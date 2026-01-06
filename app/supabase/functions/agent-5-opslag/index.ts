import { corsHeaders } from '../_shared/cors.ts'
import { supabaseAdmin } from '../_shared/supabase-client.ts'
import { callClaude } from '../_shared/claude-client.ts'
import type { OpslagOutput, StijlOutput, AnalyseOutput, ReviewOutput } from '../_shared/types.ts'

const SYSTEM_PROMPT = `Je bent verantwoordelijk voor documentarchivering bij Heuschen & Schrouff Facilities.

DOCUMENTCODE FORMAAT:
- WI-[CAT]-[NNN] voor werkinstructies
- PR-[CAT]-[NNN] voor procedures
- Categoriecodes: SCH (Schoonmaak), OND (Onderhoud), VEI (Veiligheid), LOG (Logistiek), ADM (Administratie)

VERSIENUMMERING:
- Start met versie 1.0
- Minor updates: 1.1, 1.2, etc.
- Major updates: 2.0, 3.0, etc.

Geef je antwoord ALLEEN als valide JSON:
{
  "documentCode": "WI-SCH-001",
  "versie": "1.0",
  "storagePath": "werkinstructies/schoonmaak/WI-SCH-001-v1.0.md",
  "nieuweZinnenToegevoegd": 3,
  "bibliotheekUpdates": [
    {
      "type": "nieuw",
      "zinId": "SZ-SCH-042",
      "tekst": "Controleer of de noodstop bereikbaar is"
    }
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

    console.log(`Agent 5 starting for run ${pipelineRunId}`)

    // Get all previous outputs
    const { data: allStappen } = await supabaseAdmin
      .from('agent_stappen')
      .select('agent_id, id')
      .eq('pipeline_run_id', pipelineRunId)

    const outputs: Record<string, unknown> = {}
    for (const stap of allStappen || []) {
      const { data: stapData } = await supabaseAdmin
        .from('agent_stap_data')
        .select('output_data')
        .eq('agent_stap_id', stap.id)
        .single()
      if (stapData?.output_data) {
        outputs[stap.agent_id] = stapData.output_data
      }
    }

    // Get run info
    const { data: run } = await supabaseAdmin
      .from('pipeline_runs')
      .select('titel, categorie_code, locatie')
      .eq('id', pipelineRunId)
      .single()

    const stijlOutput = outputs['agent-3'] as StijlOutput | undefined
    const analyseOutput = outputs['agent-2'] as AnalyseOutput | undefined
    const reviewOutput = outputs['agent-4'] as ReviewOutput | undefined

    // Call Claude to generate storage metadata
    const userPrompt = `Genereer documentcode en metadata voor opslag.

DOCUMENT INFO:
- Titel: ${run?.titel || 'Onbekend'}
- Categorie: ${run?.categorie_code || 'ALGEMEEN'}
- Locatie: ${run?.locatie || 'Onbekend'}
- Kwaliteitsscore: ${reviewOutput?.score || 'N/A'}

AANTAL STAPPEN: ${stijlOutput?.gecorrigeerdeStappen?.length || 0}

GESUGGEREERDE NIEUWE ZINNEN:
${JSON.stringify(analyseOutput?.nieuweZinnen || [], null, 2)}

Genereer een unieke documentcode en versienummer.`

    console.log('Calling Claude for storage metadata...')
    const result = await callClaude(
      [{ role: 'user', content: userPrompt }],
      { systemPrompt: SYSTEM_PROMPT, maxTokens: 2048 }
    )

    let output: OpslagOutput
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

    // Update pipeline run with document code
    await supabaseAdmin
      .from('pipeline_runs')
      .update({
        document_code: output.documentCode,
        document_versie: output.versie,
        aantal_stappen: stijlOutput?.gecorrigeerdeStappen?.length || 0,
        nieuwe_zinnen: output.nieuweZinnenToegevoegd
      })
      .eq('id', pipelineRunId)

    await storeAgentData(pipelineRunId, agentId, { run, stijlOutput, analyseOutput }, output, result)

    const summary = `Document ${output.documentCode} v${output.versie} aangemaakt, ${output.nieuweZinnenToegevoegd || 0} nieuwe zinnen`
    await markAgentComplete(pipelineRunId, agentId, duration, summary, 'voltooid')

    await triggerOrchestrator(pipelineRunId, agentId)

    return new Response(
      JSON.stringify({ success: true, status: 'completed', output }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Agent 5 error:', error)
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
