import { corsHeaders } from '../_shared/cors.ts'
import { supabaseAdmin } from '../_shared/supabase-client.ts'
import { callClaudeWithImages } from '../_shared/claude-client.ts'
import type { FotoAnalyseOutput } from '../_shared/types.ts'

const SYSTEM_PROMPT = `Je bent een expert in beeldherkenning voor industriële omgevingen, specifiek voor facility management bij Heuschen & Schrouff.

Analyseer de foto's en identificeer:
- Apparatuur en machines (tag met @equip:naam)
- Locaties en ruimtes (tag met @loc:naam)
- Materialen en gereedschap (tag met @mat:naam)
- Veiligheidselementen en PPE (tag met @safe:naam)
- Acties die worden uitgevoerd (tag met @act:naam)

Geef je antwoord ALLEEN als valide JSON met deze structuur:
{
  "fotos": [
    {
      "bestandsnaam": "foto1.jpg",
      "tags": ["@equip:heftruck", "@loc:magazijn-a", "@safe:veiligheidshelm"],
      "beschrijving": "Korte beschrijving van wat er te zien is op de foto",
      "objecten": [
        { "naam": "heftruck", "type": "apparatuur", "confidence": 0.95 }
      ]
    }
  ],
  "samenvatting": "Overzicht van alle geïdentificeerde elementen in de foto's"
}

Wees specifiek en gebruik Nederlandse termen waar mogelijk.`

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

    console.log(`Agent 1A starting for run ${pipelineRunId}`)

    // Get photos from storage
    const { data: fotos, error: fotosError } = await supabaseAdmin
      .from('pipeline_run_bestanden')
      .select('*')
      .eq('pipeline_run_id', pipelineRunId)
      .eq('type', 'foto')

    if (fotosError) {
      throw new Error(`Failed to fetch photos: ${fotosError.message}`)
    }

    if (!fotos || fotos.length === 0) {
      // No photos - mark as skipped and continue pipeline
      console.log('No photos found, skipping Agent 1A')
      await markAgentComplete(pipelineRunId, agentId, Date.now() - startTime, 'Geen foto\'s geüpload - overgeslagen', 'overgeslagen')
      await triggerOrchestrator(pipelineRunId, agentId)

      return new Response(
        JSON.stringify({ success: true, status: 'skipped', message: 'No photos to analyze' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Download and encode photos as base64
    console.log(`Processing ${fotos.length} photos`)
    const images: Array<{ base64: string; mediaType: string; filename: string }> = []

    for (const foto of fotos) {
      const { data: fileData, error: downloadError } = await supabaseAdmin.storage
        .from('pipeline-files')
        .download(foto.storage_path)

      if (downloadError || !fileData) {
        console.error(`Failed to download ${foto.bestandsnaam}:`, downloadError)
        continue
      }

      const arrayBuffer = await fileData.arrayBuffer()
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      )

      images.push({
        base64,
        mediaType: foto.mime_type,
        filename: foto.bestandsnaam,
      })
    }

    if (images.length === 0) {
      throw new Error('No images could be downloaded')
    }

    // Call Claude with images
    const userPrompt = `Analyseer deze ${images.length} foto('s) voor een werkinstructie.
Identificeer alle relevante apparatuur, locaties, materialen, veiligheidselementen en acties die zichtbaar zijn.
Geef voor elke foto een analyse.`

    console.log('Calling Claude with images...')
    const result = await callClaudeWithImages(SYSTEM_PROMPT, userPrompt, images)

    // Parse the output
    let output: FotoAnalyseOutput
    try {
      output = JSON.parse(result.content)
    } catch {
      console.error('Failed to parse Claude response:', result.content)
      throw new Error('Invalid JSON response from Claude')
    }

    const duration = Date.now() - startTime
    console.log(`Agent 1A completed in ${duration}ms`)

    // Store agent output data
    await storeAgentData(pipelineRunId, agentId, { fotos: images.map(i => i.filename) }, output, result)

    // Update foto tags in database
    for (const fotoResult of output.fotos || []) {
      await supabaseAdmin
        .from('pipeline_run_fotos')
        .update({ tags: fotoResult.tags })
        .eq('pipeline_run_id', pipelineRunId)
        .eq('naam', fotoResult.bestandsnaam)
    }

    // Mark agent as complete
    const outputSummary = `${output.fotos?.length || 0} foto's geanalyseerd, ${countTags(output)} tags geïdentificeerd`
    await markAgentComplete(pipelineRunId, agentId, duration, outputSummary, 'voltooid')

    // Trigger orchestrator to continue
    await triggerOrchestrator(pipelineRunId, agentId)

    return new Response(
      JSON.stringify({ success: true, status: 'completed', output }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Agent 1A error:', error)
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

async function markAgentComplete(
  runId: string,
  agentId: string,
  duurMs: number,
  output: string,
  status: 'voltooid' | 'fout' | 'overgeslagen'
) {
  await supabaseAdmin
    .from('agent_stappen')
    .update({
      status,
      duur_ms: duurMs,
      output,
      completed_at: new Date().toISOString(),
      error_message: status === 'fout' ? output : null
    })
    .eq('pipeline_run_id', runId)
    .eq('agent_id', agentId)
}

async function storeAgentData(
  runId: string,
  agentId: string,
  inputData: Record<string, unknown>,
  outputData: Record<string, unknown>,
  claudeResult: { inputTokens: number; outputTokens: number }
) {
  // Get the step ID
  const { data: step } = await supabaseAdmin
    .from('agent_stappen')
    .select('id')
    .eq('pipeline_run_id', runId)
    .eq('agent_id', agentId)
    .single()

  if (!step) return

  await supabaseAdmin.from('agent_stap_data').insert({
    agent_stap_id: step.id,
    input_data: inputData,
    output_data: outputData,
    tokens_input: claudeResult.inputTokens,
    tokens_output: claudeResult.outputTokens
  })
}

async function triggerOrchestrator(pipelineRunId: string, completedAgentId: string) {
  // Hardcoded keys for reliable function-to-function calls
  const supabaseUrl = 'https://qfhsctnvwsneaujcgpkp.supabase.co'
  const authKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmaHNjdG52d3NuZWF1amNncGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NDIxNjQsImV4cCI6MjA4MzExODE2NH0.8xGkI8x5jdRW5YsY2k8ARgsXYqeA2zNur-1T89rvZ3g'

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)

  try {
    await fetch(`${supabaseUrl}/functions/v1/pipeline-orchestrator`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authKey}`,
      },
      body: JSON.stringify({ action: 'agent-completed', pipelineRunId, completedAgentId }),
      signal: controller.signal,
    })
    console.log('Orchestrator notified successfully')
  } catch (e) {
    if (e.name === 'AbortError') {
      console.log('Orchestrator notification sent (timeout waiting for response)')
    } else {
      console.error('Orchestrator trigger error:', e)
    }
  } finally {
    clearTimeout(timeoutId)
  }
}

function countTags(output: FotoAnalyseOutput): number {
  return output.fotos?.reduce((acc, f) => acc + (f.tags?.length || 0), 0) || 0
}
