import { corsHeaders } from '../_shared/cors.ts'
import { supabaseAdmin } from '../_shared/supabase-client.ts'

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()

    // Get metadata from form
    const titel = formData.get('titel') as string
    const categorie = formData.get('categorie') as string
    const locatie = formData.get('locatie') as string
    const datasetGroepering = formData.get('datasetGroepering') as string || 'enkel'

    // Get files
    const pdfs = formData.getAll('pdfs') as File[]
    const fotos = formData.getAll('fotos') as File[]

    console.log('Upload request:', { titel, categorie, locatie, pdfCount: pdfs.length, fotoCount: fotos.length })

    if (!titel || !categorie || !locatie) {
      throw new Error('titel, categorie en locatie zijn verplicht')
    }

    if (!pdfs || pdfs.length === 0) {
      throw new Error('Minimaal één PDF bestand is verplicht')
    }

    // Create pipeline run
    const { data: pipelineRun, error: runError } = await supabaseAdmin
      .from('pipeline_runs')
      .insert({
        titel,
        categorie_code: categorie,
        locatie,
        status: 'actief',
      })
      .select()
      .single()

    if (runError) {
      console.error('Failed to create pipeline run:', runError)
      throw new Error(`Kon pipeline run niet aanmaken: ${runError.message}`)
    }

    const pipelineRunId = pipelineRun.id
    console.log('Created pipeline run:', pipelineRunId)

    // Create agent stappen
    const agentIds = ['agent-1a', 'agent-1b', 'agent-2', 'agent-3', 'agent-4', 'agent-5']
    const agentStappen = agentIds.map((agentId, index) => ({
      pipeline_run_id: pipelineRunId,
      agent_id: agentId,
      status: index < 2 ? 'wacht' : 'wacht', // Stage 1 agents will be activated by orchestrator
      volgorde: index + 1,
    }))

    const { error: stappenError } = await supabaseAdmin
      .from('agent_stappen')
      .insert(agentStappen)

    if (stappenError) {
      console.error('Failed to create agent stappen:', stappenError)
      throw new Error(`Kon agent stappen niet aanmaken: ${stappenError.message}`)
    }

    // Upload PDF files
    for (const pdf of pdfs) {
      const timestamp = Date.now()
      const safeName = pdf.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const storagePath = `${pipelineRunId}/pdfs/${timestamp}_${safeName}`

      const arrayBuffer = await pdf.arrayBuffer()
      const { error: uploadError } = await supabaseAdmin.storage
        .from('pipeline-files')
        .upload(storagePath, arrayBuffer, {
          contentType: pdf.type || 'application/pdf',
          upsert: false,
        })

      if (uploadError) {
        console.error('PDF upload error:', uploadError)
        throw new Error(`Upload mislukt voor ${pdf.name}: ${uploadError.message}`)
      }

      // Record in database
      await supabaseAdmin
        .from('pipeline_run_bestanden')
        .insert({
          pipeline_run_id: pipelineRunId,
          type: 'pdf',
          bestandsnaam: pdf.name,
          storage_path: storagePath,
          mime_type: pdf.type || 'application/pdf',
          grootte_bytes: pdf.size,
        })

      console.log('Uploaded PDF:', pdf.name)
    }

    // Upload foto files
    for (const foto of fotos) {
      const timestamp = Date.now()
      const safeName = foto.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const storagePath = `${pipelineRunId}/fotos/${timestamp}_${safeName}`

      const arrayBuffer = await foto.arrayBuffer()
      const { error: uploadError } = await supabaseAdmin.storage
        .from('pipeline-files')
        .upload(storagePath, arrayBuffer, {
          contentType: foto.type,
          upsert: false,
        })

      if (uploadError) {
        console.error('Foto upload error:', uploadError)
        throw new Error(`Upload mislukt voor ${foto.name}: ${uploadError.message}`)
      }

      // Record in pipeline_run_bestanden
      await supabaseAdmin
        .from('pipeline_run_bestanden')
        .insert({
          pipeline_run_id: pipelineRunId,
          type: 'foto',
          bestandsnaam: foto.name,
          storage_path: storagePath,
          mime_type: foto.type,
          grootte_bytes: foto.size,
        })

      // Also record in pipeline_run_fotos for legacy compatibility
      await supabaseAdmin
        .from('pipeline_run_fotos')
        .insert({
          pipeline_run_id: pipelineRunId,
          naam: foto.name,
          tags: [],
        })

      console.log('Uploaded foto:', foto.name)
    }

    // Trigger pipeline orchestrator to start
    console.log('Triggering orchestrator for pipeline:', pipelineRunId)

    // Use hardcoded keys for reliable function-to-function calls
    const supabaseUrl = 'https://qfhsctnvwsneaujcgpkp.supabase.co'
    const authKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmaHNjdG52d3NuZWF1amNncGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NDIxNjQsImV4cCI6MjA4MzExODE2NH0.8xGkI8x5jdRW5YsY2k8ARgsXYqeA2zNur-1T89rvZ3g'

    try {
      const orchestratorResponse = await fetch(`${supabaseUrl}/functions/v1/pipeline-orchestrator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authKey}`,
        },
        body: JSON.stringify({
          action: 'start',
          pipelineRunId,
        }),
      })

      if (!orchestratorResponse.ok) {
        const errorText = await orchestratorResponse.text()
        console.error('Orchestrator response error:', orchestratorResponse.status, errorText)
      } else {
        console.log('Orchestrator triggered successfully')
      }
    } catch (e) {
      console.error('Orchestrator trigger error:', e)
      // Don't throw - the pipeline is created, just log the error
    }

    return new Response(
      JSON.stringify({
        success: true,
        pipelineRunId,
        message: `Pipeline gestart met ${pdfs.length} PDF(s) en ${fotos.length} foto('s)`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Upload function error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
