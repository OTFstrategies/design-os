import { corsHeaders } from '../_shared/cors.ts'
import { supabaseAdmin } from '../_shared/supabase-client.ts'
import { callClaude } from '../_shared/claude-client.ts'
import type { AnalyseOutput, DocumentParserOutput, FotoAnalyseOutput } from '../_shared/types.ts'

const SYSTEM_PROMPT = `Je bent een expert in het analyseren en coderen van werkinstructies voor Heuschen & Schrouff Facilities.

Je taak is om:
1. De stappen te verrijken met semantische tags (@equip:, @loc:, @mat:, @act:, @safe:)
2. Patronen te identificeren die herbruikbaar zijn als standaardzinnen
3. Suggesties te doen voor nieuwe standaardzinnen

TAG TYPES:
- @equip:naam - Apparatuur en machines (bijv. @equip:heftruck, @equip:hogedrukreiniger)
- @loc:naam - Locaties (bijv. @loc:magazijn-a, @loc:expeditie)
- @mat:naam - Materialen (bijv. @mat:reinigingsmiddel, @mat:bout-m10)
- @act:naam - Acties (bijv. @act:reinigen, @act:controleren)
- @safe:naam - Veiligheidselementen (bijv. @safe:veiligheidsschoenen, @safe:handschoenen)

Geef je antwoord ALLEEN als valide JSON met deze structuur:
{
  "matches": [],
  "nieuweZinnen": [
    {
      "tekst": "Controleer of de noodstop bereikbaar is",
      "suggestedCode": "VEI-001",
      "tags": ["@safe:noodstop", "@act:controleren"]
    }
  ],
  "enrichedStappen": [
    {
      "nummer": 1,
      "actie": "Pak de sleutel van 13mm uit de gereedschapskist",
      "tags": ["@mat:sleutel-13mm", "@loc:gereedschapskist", "@act:pakken"],
      "matchedZinId": null
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

    console.log(`Agent 2 starting for run ${pipelineRunId}`)

    // Get outputs from Stage 1 agents
    const { data: stappen } = await supabaseAdmin
      .from('agent_stappen')
      .select('agent_id, id')
      .eq('pipeline_run_id', pipelineRunId)
      .in('agent_id', ['agent-1a', 'agent-1b'])

    let fotoAnalyse: FotoAnalyseOutput | null = null
    let documentStappen: DocumentParserOutput | null = null

    for (const stap of stappen || []) {
      const { data: stapData } = await supabaseAdmin
        .from('agent_stap_data')
        .select('output_data')
        .eq('agent_stap_id', stap.id)
        .single()

      if (stap.agent_id === 'agent-1a' && stapData?.output_data) {
        fotoAnalyse = stapData.output_data as FotoAnalyseOutput
      }
      if (stap.agent_id === 'agent-1b' && stapData?.output_data) {
        documentStappen = stapData.output_data as DocumentParserOutput
      }
    }

    if (!documentStappen?.stappen?.length) {
      throw new Error('Geen stappen gevonden van Document Parser')
    }

    // Build context from foto analyse
    let fotoContext = ''
    if (fotoAnalyse?.fotos?.length) {
      const allTags = fotoAnalyse.fotos.flatMap(f => f.tags || [])
      fotoContext = `\n\nGeïdentificeerde elementen uit foto's: ${[...new Set(allTags)].join(', ')}`
    }

    // Call Claude for analysis
    const userPrompt = `Analyseer en verrijk de volgende stappen met semantische tags.
${fotoContext}

STAPPEN OM TE ANALYSEREN:
${JSON.stringify(documentStappen.stappen, null, 2)}

Voeg relevante tags toe aan elke stap en identificeer patronen die als standaardzin kunnen dienen.`

    console.log('Calling Claude for analysis...')
    const result = await callClaude(
      [{ role: 'user', content: userPrompt }],
      { systemPrompt: SYSTEM_PROMPT, maxTokens: 8192 }
    )

    let output: AnalyseOutput
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
          // Try to find JSON object - find the first { and last }
          const firstBrace = result.content.indexOf('{')
          const lastBrace = result.content.lastIndexOf('}')
          if (firstBrace !== -1 && lastBrace > firstBrace) {
            const jsonStr = result.content.substring(firstBrace, lastBrace + 1)
            output = JSON.parse(jsonStr)
          } else {
            console.error('No JSON found in Claude response:', result.content.substring(0, 500))
            throw new Error('No JSON found in response')
          }
        }
      }
    } catch (parseError) {
      console.error('Failed to parse Claude response:', result.content.substring(0, 500))
      throw new Error('Invalid JSON response from Claude')
    }

    const duration = Date.now() - startTime

    // Store agent data
    await storeAgentData(pipelineRunId, agentId, { fotoAnalyse, documentStappen }, output, result)

    // Mark complete
    const summary = `${output.enrichedStappen?.length || 0} stappen verrijkt, ${output.nieuweZinnen?.length || 0} nieuwe zinnen gesuggereerd`
    await markAgentComplete(pipelineRunId, agentId, duration, summary, 'voltooid')

    await triggerOrchestrator(pipelineRunId, agentId)

    return new Response(
      JSON.stringify({ success: true, status: 'completed', output }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Agent 2 error:', error)
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
  await supabaseAdmin
    .from('agent_stappen')
    .update({ status, duur_ms: duurMs, output, completed_at: new Date().toISOString(), error_message: status === 'fout' ? output : null })
    .eq('pipeline_run_id', runId)
    .eq('agent_id', agentId)
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
