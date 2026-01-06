import { corsHeaders } from '../_shared/cors.ts'
import { supabaseAdmin } from '../_shared/supabase-client.ts'
import { callClaudeWithDocuments } from '../_shared/claude-client.ts'
import type { DocumentParserOutput } from '../_shared/types.ts'

// Helper function to properly encode Uint8Array to base64
function uint8ArrayToBase64(bytes: Uint8Array): string {
  // Use chunks to avoid call stack overflow for large files
  const chunkSize = 0x8000 // 32KB chunks
  const chunks: string[] = []
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    chunks.push(String.fromCharCode.apply(null, Array.from(chunk)))
  }
  return btoa(chunks.join(''))
}

const SYSTEM_PROMPT = `Je bent een expert in het analyseren van transcripties van werkprocedures voor Heuschen & Schrouff Facilities.

Je taak is om PDF-tekst om te zetten naar een gestructureerd stappenplan.

REGELS:
- Elke fysieke handeling wordt een aparte stap
- Gebruik imperatiefvorm (Pak, Draai, Controleer, Zet, Open, Sluit, etc.)
- Markeer veiligheidsstappen duidelijk
- Markeer kwaliteitscontroles duidelijk
- Identificeer alle gereedschappen en materialen
- Maximaal 20 woorden per stap
- Wees specifiek en concreet

Geef je antwoord ALLEEN als valide JSON met deze structuur:
{
  "stappen": [
    {
      "nummer": 1,
      "actie": "Pak de sleutel van 13mm uit de gereedschapskist",
      "type": "handeling",
      "veiligheid": false,
      "controle": false,
      "gereedschap": ["sleutel 13mm"],
      "materialen": []
    },
    {
      "nummer": 2,
      "actie": "Controleer of de machine is uitgeschakeld",
      "type": "controle",
      "veiligheid": true,
      "controle": true,
      "gereedschap": [],
      "materialen": []
    }
  ],
  "metadata": {
    "totaalStappen": 12,
    "veiligheidsStappen": 2,
    "controleStappen": 3,
    "gereedschapLijst": ["sleutel 13mm", "schroevendraaier plat"],
    "materialenLijst": ["bout M10", "moer M10"]
  }
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

    console.log(`Agent 1B starting for run ${pipelineRunId}`)

    // Get PDFs from storage
    const { data: pdfs, error: pdfsError } = await supabaseAdmin
      .from('pipeline_run_bestanden')
      .select('*')
      .eq('pipeline_run_id', pipelineRunId)
      .eq('type', 'pdf')

    if (pdfsError) {
      throw new Error(`Failed to fetch PDFs: ${pdfsError.message}`)
    }

    if (!pdfs || pdfs.length === 0) {
      throw new Error('Geen PDF-bestanden gevonden. Upload minimaal één PDF.')
    }

    // Download PDFs and send to Claude for analysis
    console.log(`Processing ${pdfs.length} PDFs`)

    const pdfDocuments: Array<{ base64: string; mediaType: string; filename: string }> = []
    const pdfNames: string[] = []

    for (const pdf of pdfs) {
      const { data: fileData, error: downloadError } = await supabaseAdmin.storage
        .from('pipeline-files')
        .download(pdf.storage_path)

      if (downloadError || !fileData) {
        console.error(`Failed to download ${pdf.bestandsnaam}:`, downloadError)
        continue
      }

      pdfNames.push(pdf.bestandsnaam)

      // Convert PDF to base64 for Claude to read directly
      const arrayBuffer = await fileData.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      const base64 = uint8ArrayToBase64(uint8Array)

      pdfDocuments.push({
        base64,
        mediaType: pdf.mime_type || 'application/pdf',
        filename: pdf.bestandsnaam
      })

      console.log(`Loaded PDF: ${pdf.bestandsnaam} (${(pdf.grootte_bytes / 1024).toFixed(1)} KB)`)
    }

    // Get pipeline run info for context
    const { data: run } = await supabaseAdmin
      .from('pipeline_runs')
      .select('titel, locatie, categorie_code')
      .eq('id', pipelineRunId)
      .single()

    // Check if we have any PDFs loaded
    if (pdfDocuments.length === 0) {
      throw new Error('Geen PDF-bestanden konden worden geladen.')
    }

    // Prepare prompt with context
    const userPrompt = `Analyseer de bijgevoegde PDF-document(en) en genereer een gestructureerd stappenplan.

CONTEXT:
- Titel: ${run?.titel || 'Onbekend'}
- Locatie: ${run?.locatie || 'Onbekend'}
- Categorie: ${run?.categorie_code || 'Onbekend'}
- Aantal PDF's: ${pdfNames.length}
- Bestanden: ${pdfNames.join(', ')}

INSTRUCTIE:
Analyseer de inhoud van de PDF en genereer een stappenplan gebaseerd op wat je leest.
Als de PDF een transcriptie van een werkprocedure bevat, extraheer de stappen daaruit.
Als de PDF weinig bruikbare inhoud heeft, genereer dan een realistisch stappenplan
voor een "${run?.categorie_code || 'algemeen'}" procedure.
Zorg voor veiligheidsstappen aan het begin en controlestappen aan het eind.

Genereer minimaal 8 en maximaal 20 stappen.`

    console.log('Calling Claude with PDF documents...')
    const result = await callClaudeWithDocuments(
      SYSTEM_PROMPT,
      userPrompt,
      pdfDocuments
    )

    // Parse the output - extract JSON from Claude's response
    let output: DocumentParserOutput
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
      console.error('Parse error:', parseError)
      throw new Error('Invalid JSON response from Claude')
    }

    const duration = Date.now() - startTime
    console.log(`Agent 1B completed in ${duration}ms with ${output.stappen?.length || 0} steps`)

    // Store agent output data
    await storeAgentData(pipelineRunId, agentId, { pdfs: pdfNames }, output, result)

    // Mark agent as complete
    const outputSummary = `${output.stappen?.length || 0} stappen gegenereerd uit ${pdfNames.length} PDF('s)`
    await markAgentComplete(pipelineRunId, agentId, duration, outputSummary, 'voltooid')

    // Trigger orchestrator to continue
    await triggerOrchestrator(pipelineRunId, agentId)

    return new Response(
      JSON.stringify({ success: true, status: 'completed', output }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Agent 1B error:', error)
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
