import { corsHeaders } from '../_shared/cors.ts'
import { supabaseAdmin } from '../_shared/supabase-client.ts'
import { callClaude } from '../_shared/claude-client.ts'
import type { ReviewOutput, StijlOutput } from '../_shared/types.ts'

const SYSTEM_PROMPT = `Je bent een kwaliteitsreviewer voor werkinstructies bij Heuschen & Schrouff Facilities.

BEOORDELINGSCRITERIA:
1. VEILIGHEID (40%): Zijn alle veiligheidsstappen aanwezig? PPE vermeld? Noodprocedures?
2. COMPLEETHEID (25%): Zijn alle stappen logisch en volledig? Ontbreekt er iets?
3. CONSISTENTIE (20%): Is de terminologie consistent? Volgt het de schrijfstandaard?
4. LEESBAARHEID (15%): Zijn de stappen duidelijk en begrijpelijk?

SCORE INTERPRETATIE:
- 90-100: Uitstekend, direct bruikbaar
- 80-89: Goed, kleine verbeteringen mogelijk
- 70-79: Voldoende, review nodig
- <70: Onvoldoende, significante aanpassingen nodig

Geef je antwoord ALLEEN als valide JSON:
{
  "score": 85,
  "approved": true,
  "issues": [
    {
      "type": "veiligheid",
      "ernst": "middel",
      "beschrijving": "Geen vermelding van veiligheidsschoenen bij stap 3",
      "stapNummer": 3
    }
  ],
  "recommendations": [
    "Voeg PPE-check toe aan het begin van de procedure",
    "Overweeg een eindinspectie toe te voegen"
  ]
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

    console.log(`Agent 4 starting for run ${pipelineRunId}`)

    // Get output from Agent 3
    const { data: agent3Step } = await supabaseAdmin
      .from('agent_stappen')
      .select('id')
      .eq('pipeline_run_id', pipelineRunId)
      .eq('agent_id', 'agent-3')
      .single()

    const { data: agent3Data } = await supabaseAdmin
      .from('agent_stap_data')
      .select('output_data')
      .eq('agent_stap_id', agent3Step?.id)
      .single()

    const stijlOutput = agent3Data?.output_data as StijlOutput | null

    if (!stijlOutput?.gecorrigeerdeStappen?.length) {
      throw new Error('Geen stappen gevonden van Stijl Agent')
    }

    // Get run info for context
    const { data: run } = await supabaseAdmin
      .from('pipeline_runs')
      .select('titel, categorie_code')
      .eq('id', pipelineRunId)
      .single()

    // Call Claude for review
    const userPrompt = `Beoordeel deze werkinstructie op kwaliteit.

DOCUMENT INFO:
- Titel: ${run?.titel || 'Onbekend'}
- Categorie: ${run?.categorie_code || 'Onbekend'}

STAPPEN OM TE REVIEWEN:
${JSON.stringify(stijlOutput.gecorrigeerdeStappen.map(s => ({ nummer: s.nummer, actie: s.gecorrigeerd })), null, 2)}

Geef een score (0-100), identificeer issues, en doe aanbevelingen.
Markeer als approved alleen als de score >= 80 is.`

    console.log('Calling Claude for review...')
    const result = await callClaude(
      [{ role: 'user', content: userPrompt }],
      { systemPrompt: SYSTEM_PROMPT, maxTokens: 4096 }
    )

    let output: ReviewOutput
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

    await storeAgentData(pipelineRunId, agentId, { stijlOutput }, output, result)

    // Update pipeline with quality score
    await supabaseAdmin
      .from('pipeline_runs')
      .update({ kwaliteitsscore: output.score })
      .eq('id', pipelineRunId)

    const summary = `Score: ${output.score}/100, ${output.issues?.length || 0} issues gevonden, ${output.approved ? 'Goedgekeurd' : 'Review nodig'}`
    await markAgentComplete(pipelineRunId, agentId, duration, summary, 'voltooid')

    await triggerOrchestrator(pipelineRunId, agentId)

    return new Response(
      JSON.stringify({ success: true, status: 'completed', output }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Agent 4 error:', error)
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
