import { corsHeaders } from '../_shared/cors.ts'
import { supabaseAdmin } from '../_shared/supabase-client.ts'
import { callClaude } from '../_shared/claude-client.ts'
import type { StijlOutput, AnalyseOutput } from '../_shared/types.ts'

const SYSTEM_PROMPT = `Je bent een expert in de HSF schrijfstandaard voor werkinstructies.

SCHRIJFREGELS:
1. Gebruik altijd de imperatiefvorm (gebiedende wijs): "Pak", "Controleer", "Zet"
2. Schrijf in actieve vorm, niet passief
3. Maximaal 20 woorden per stap
4. Wees specifiek en concreet
5. Vermijd jargon en afkortingen
6. Begin elke stap met een werkwoord
7. Gebruik "je" of directe aanspreekvorm

VOORBEELDEN VAN CORRECTIES:
- "De machine moet worden uitgeschakeld" → "Schakel de machine uit"
- "Er moet gecontroleerd worden of..." → "Controleer of..."
- "Het is belangrijk dat de veiligheidsschoenen gedragen worden" → "Draag veiligheidsschoenen"

Geef je antwoord ALLEEN als valide JSON:
{
  "gecorrigeerdeStappen": [
    {
      "nummer": 1,
      "origineel": "De machine moet worden uitgeschakeld",
      "gecorrigeerd": "Schakel de machine uit",
      "correcties": ["passief naar actief", "imperatiefvorm toegepast"]
    }
  ],
  "totaalCorrecties": 5
}`

interface AgentRequest {
  pipelineRunId: string
  agentId: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const startTime = Date.now()
  let pipelineRunId = ''
  let agentId = ''

  try {
    const body: AgentRequest = await req.json()
    pipelineRunId = body.pipelineRunId
    agentId = body.agentId

    console.log(`Agent 3 starting for run ${pipelineRunId}`)

    // Get output from Agent 2
    const { data: agent2Step } = await supabaseAdmin
      .from('agent_stappen')
      .select('id')
      .eq('pipeline_run_id', pipelineRunId)
      .eq('agent_id', 'agent-2')
      .single()

    const { data: agent2Data } = await supabaseAdmin
      .from('agent_stap_data')
      .select('output_data')
      .eq('agent_stap_id', agent2Step?.id)
      .single()

    const analyseOutput = agent2Data?.output_data as AnalyseOutput | null

    if (!analyseOutput?.enrichedStappen?.length) {
      throw new Error('Geen stappen gevonden van Analyse Agent')
    }

    // Call Claude for style corrections
    const userPrompt = `Pas de HSF schrijfstandaard toe op deze stappen.
Corrigeer naar imperatiefvorm, actieve zinnen, en maximaal 20 woorden per stap.

STAPPEN:
${JSON.stringify(analyseOutput.enrichedStappen, null, 2)}

Geef voor elke stap aan welke correcties zijn toegepast.`

    console.log('Calling Claude for style corrections...')
    const result = await callClaude(
      [{ role: 'user', content: userPrompt }],
      { systemPrompt: SYSTEM_PROMPT, maxTokens: 8192 }
    )

    let output: StijlOutput
    try {
      // First try direct parse
      try {
        output = JSON.parse(result.content)
      } catch {
        // Try to extract JSON from markdown code blocks
        const codeBlockMatch = result.content.match(/```(?:json)?\s*([\s\S]*?)```/)
        if (codeBlockMatch) {
          output = JSON.parse(codeBlockMatch[1].trim())
        } else {
          // Try to find JSON object
          const firstBrace = result.content.indexOf('{')
          const lastBrace = result.content.lastIndexOf('}')
          if (firstBrace !== -1 && lastBrace > firstBrace) {
            output = JSON.parse(result.content.substring(firstBrace, lastBrace + 1))
          } else {
            throw new Error('No JSON found')
          }
        }
      }
    } catch {
      console.error('Failed to parse:', result.content.substring(0, 500))
      throw new Error('Invalid JSON response from Claude')
    }

    const duration = Date.now() - startTime

    await storeAgentData(pipelineRunId, agentId, { analyseOutput }, output, result)

    const summary = `${output.gecorrigeerdeStappen?.length || 0} stappen verwerkt, ${output.totaalCorrecties || 0} correcties toegepast`
    await markAgentComplete(pipelineRunId, agentId, duration, summary, 'voltooid')

    await triggerOrchestrator(pipelineRunId, agentId)

    return new Response(
      JSON.stringify({ success: true, status: 'completed', output }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Agent 3 error:', error)
    const duration = Date.now() - startTime
    if (pipelineRunId && agentId) {
      await markAgentComplete(pipelineRunId, agentId, duration, error.message, 'fout')
      await triggerOrchestrator(pipelineRunId, agentId)
    }
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function markAgentComplete(runId: string, agentId: string, duurMs: number, output: string, status: string) {
  await supabaseAdmin.from('agent_stappen').update({ status, duur_ms: duurMs, output, completed_at: new Date().toISOString(), error_message: status === 'fout' ? output : null }).eq('pipeline_run_id', runId).eq('agent_id', agentId)
}

async function storeAgentData(runId: string, agentId: string, inputData: unknown, outputData: unknown, claudeResult: { inputTokens: number; outputTokens: number }) {
  const { data: step } = await supabaseAdmin.from('agent_stappen').select('id').eq('pipeline_run_id', runId).eq('agent_id', agentId).single()
  if (step) await supabaseAdmin.from('agent_stap_data').insert({ agent_stap_id: step.id, input_data: inputData, output_data: outputData, tokens_input: claudeResult.inputTokens, tokens_output: claudeResult.outputTokens })
}

async function triggerOrchestrator(pipelineRunId: string, completedAgentId: string) {
  const supabaseUrl = 'https://qfhsctnvwsneaujcgpkp.supabase.co'
  const authKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmaHNjdG52d3NuZWF1amNncGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NDIxNjQsImV4cCI6MjA4MzExODE2NH0.8xGkI8x5jdRW5YsY2k8ARgsXYqeA2zNur-1T89rvZ3g'

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)

  try {
    await fetch(`${supabaseUrl}/functions/v1/pipeline-orchestrator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authKey}` },
      body: JSON.stringify({ action: 'agent-completed', pipelineRunId, completedAgentId }),
      signal: controller.signal,
    })
    console.log('Orchestrator notified')
  } catch (e) {
    if (e.name !== 'AbortError') console.error('Orchestrator error:', e)
  } finally {
    clearTimeout(timeoutId)
  }
}
