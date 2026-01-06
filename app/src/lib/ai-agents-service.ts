import { supabase } from './supabase'
import type {
  Agent,
  AgentConfiguratie,
  PipelineRun,
  PipelineStatistieken,
  PlaudPromptTemplate,
  Categorie,
  AgentStap,
  AgentStapStatus,
  FotoTag,
  NieuweRunParams,
} from '@/components/ai-agents/types'
import type { RealtimeChannel } from '@supabase/supabase-js'

// =============================================================================
// Helper Functions
// =============================================================================

function formatDuration(ms: number | null): string | null {
  if (ms === null) return null
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`
}

// =============================================================================
// Fetch Functions
// =============================================================================

export async function fetchAgents(): Promise<Agent[]> {
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('nummer')

  if (error) {
    console.error('Error fetching agents:', error)
    throw error
  }

  return data.map((row) => ({
    id: row.id,
    nummer: row.nummer,
    naam: row.naam,
    rol: row.rol,
    beschrijving: row.beschrijving,
    status: row.status,
    configuratie: row.configuratie as AgentConfiguratie,
    metrics: {
      runsVandaag: row.runs_vandaag,
      gemiddeldeTijd: formatDuration(row.gemiddelde_tijd_ms) || '0s',
      succesRatio: Number(row.succes_ratio),
    },
  }))
}

export async function fetchCategorieen(): Promise<Categorie[]> {
  const { data, error } = await supabase
    .from('categorieen')
    .select('code, naam')
    .order('naam')

  if (error) {
    console.error('Error fetching categorieen:', error)
    throw error
  }

  return data
}

export async function fetchPlaudPromptTemplate(): Promise<PlaudPromptTemplate | null> {
  const { data, error } = await supabase
    .from('plaud_prompt_templates')
    .select('*')
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // No rows returned
    console.error('Error fetching plaud prompt template:', error)
    throw error
  }

  return {
    titel: data.titel,
    versie: data.versie,
    laatstBijgewerkt: new Date(data.updated_at).toISOString(),
    template: data.template,
    instructies: data.instructies,
  }
}

export async function fetchPipelineRuns(): Promise<PipelineRun[]> {
  // Fetch runs with their agent stappen and fotos
  const { data: runs, error: runsError } = await supabase
    .from('pipeline_runs')
    .select(`
      *,
      categorieen(code, naam),
      agent_stappen(
        agent_id,
        status,
        duur_ms,
        output
      ),
      pipeline_run_fotos(
        id,
        naam,
        tags
      )
    `)
    .order('gestart', { ascending: false })

  if (runsError) {
    console.error('Error fetching pipeline runs:', runsError)
    throw runsError
  }

  return runs.map((row) => ({
    id: row.id,
    titel: row.titel,
    status: row.status,
    gestart: row.gestart,
    voltooid: row.voltooid,
    doorlooptijd: formatDuration(row.doorlooptijd_ms),
    categorie: row.categorieen?.code || row.categorie_code,
    locatie: row.locatie,
    pdfBestanden: [], // TODO: Add pdf_bestanden table to database
    fotos: (row.pipeline_run_fotos || []).map((foto: { id: string; naam: string; tags: string[] }) => ({
      id: foto.id,
      naam: foto.naam,
      tags: foto.tags,
    })) as FotoTag[],
    kwaliteitsscore: row.kwaliteitsscore,
    nieuweZinnen: row.nieuwe_zinnen,
    agentStappen: (row.agent_stappen || []).map((stap: { agent_id: string; status: string; duur_ms: number | null; output: string | null }) => ({
      agentId: stap.agent_id,
      status: stap.status,
      duur: formatDuration(stap.duur_ms),
      output: stap.output,
    })) as AgentStap[],
    resultaat: row.document_code
      ? {
          documentCode: row.document_code,
          versie: row.document_versie,
          aantalStappen: row.aantal_stappen,
          reviewStatus: row.review_status,
          reviewOpmerkingen: row.review_opmerkingen,
        }
      : null,
    foutmelding: row.foutmelding,
  }))
}

export async function fetchStatistieken(): Promise<PipelineStatistieken> {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(startOfDay)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

  // Runs today
  const { count: runsVandaag } = await supabase
    .from('pipeline_runs')
    .select('*', { count: 'exact', head: true })
    .gte('gestart', startOfDay.toISOString())

  // Runs this week
  const { count: runsDezeWeek } = await supabase
    .from('pipeline_runs')
    .select('*', { count: 'exact', head: true })
    .gte('gestart', startOfWeek.toISOString())

  // Active runs
  const { count: actieveRuns } = await supabase
    .from('pipeline_runs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'actief')

  // In review
  const { count: inReview } = await supabase
    .from('pipeline_runs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'review_nodig')

  // Calculate success ratio and average duration
  const { data: completedRuns } = await supabase
    .from('pipeline_runs')
    .select('status, doorlooptijd_ms')
    .gte('gestart', startOfWeek.toISOString())
    .in('status', ['voltooid', 'gefaald'])

  const successfulRuns = completedRuns?.filter((r) => r.status === 'voltooid').length || 0
  const totalCompleted = completedRuns?.length || 0
  const succesRatio = totalCompleted > 0 ? Math.round((successfulRuns / totalCompleted) * 100) : 100

  const runsWithDuration = completedRuns?.filter((r) => r.doorlooptijd_ms) || []
  const avgDuration =
    runsWithDuration.length > 0
      ? runsWithDuration.reduce((sum, r) => sum + (r.doorlooptijd_ms || 0), 0) / runsWithDuration.length
      : 0

  // New sentences this week
  const { data: zinnenData } = await supabase
    .from('pipeline_runs')
    .select('nieuwe_zinnen')
    .gte('gestart', startOfWeek.toISOString())
    .not('nieuwe_zinnen', 'is', null)

  const nieuweZinnenDezeWeek = zinnenData?.reduce((sum, r) => sum + (r.nieuwe_zinnen || 0), 0) || 0

  return {
    runsVandaag: runsVandaag || 0,
    runsDezeWeek: runsDezeWeek || 0,
    succesRatio,
    gemiddeldeDoorlooptijd: formatDuration(Math.round(avgDuration)) || '0s',
    actieveRuns: actieveRuns || 0,
    inReview: inReview || 0,
    nieuweZinnenDezeWeek,
  }
}

// =============================================================================
// Edge Function Calls
// =============================================================================

/**
 * Get the Supabase URL without protocol for function invocation
 */
function getSupabaseProjectRef(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  // Extract project ref from URL like https://xxxx.supabase.co
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/)
  return match ? match[1] : ''
}

/**
 * Start a new pipeline run with file uploads via Edge Functions
 * This uploads files to Supabase Storage and triggers the AI agent pipeline
 */
export async function startPipelineWithFiles(params: NieuweRunParams): Promise<string> {
  const { data: sessionData } = await supabase.auth.getSession()
  const accessToken = sessionData?.session?.access_token

  // Create FormData for multipart upload
  const formData = new FormData()
  formData.append('titel', params.titel)
  formData.append('categorie', params.categorie)
  formData.append('locatie', params.locatie)
  formData.append('datasetGroepering', params.datasetGroepering)

  // Add PDF files
  for (const pdf of params.pdfFiles) {
    formData.append('pdfs', pdf)
  }

  // Add photo files
  for (const foto of params.fotos) {
    formData.append('fotos', foto)
  }

  // Call upload-files Edge Function
  const { data, error } = await supabase.functions.invoke('upload-files', {
    body: formData,
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined
  })

  if (error) {
    console.error('Error starting pipeline:', error)
    throw new Error(error.message || 'Failed to start pipeline')
  }

  if (!data?.success) {
    throw new Error(data?.error || 'Failed to upload files')
  }

  // Return the first pipeline run ID (or array if multiple)
  return Array.isArray(data.pipelineRunIds) ? data.pipelineRunIds[0] : data.pipelineRunId
}

/**
 * Retry a failed pipeline run from a specific agent via Edge Function
 */
export async function retryPipelineViaEdgeFunction(runId: string, fromAgentId?: string): Promise<void> {
  const { error } = await supabase.functions.invoke('pipeline-orchestrator', {
    body: {
      action: 'retry',
      pipelineRunId: runId,
      fromAgentId
    }
  })

  if (error) {
    console.error('Error retrying pipeline:', error)
    throw new Error(error.message || 'Failed to retry pipeline')
  }
}

// =============================================================================
// Mutation Functions
// =============================================================================

export async function createPipelineRun(params: NieuweRunParams): Promise<string> {
  // Use Edge Function for file upload and pipeline start
  return startPipelineWithFiles(params)
}

export async function cancelPipelineRun(runId: string): Promise<void> {
  const { error } = await supabase
    .from('pipeline_runs')
    .update({
      status: 'gefaald',
      voltooid: new Date().toISOString(),
      foutmelding: 'Run geannuleerd door gebruiker',
    })
    .eq('id', runId)

  if (error) {
    console.error('Error cancelling run:', error)
    throw error
  }

  // Mark all pending agent stappen as afgebroken
  await supabase
    .from('agent_stappen')
    .update({ status: 'afgebroken' })
    .eq('pipeline_run_id', runId)
    .in('status', ['wacht', 'actief'])
}

export async function retryPipelineRun(runId: string, fromAgentId?: string): Promise<void> {
  // Reset the run status
  await supabase
    .from('pipeline_runs')
    .update({
      status: 'actief',
      voltooid: null,
      doorlooptijd_ms: null,
      foutmelding: null,
    })
    .eq('id', runId)

  // Reset agent stappen from the specified agent onwards
  if (fromAgentId) {
    const { data: stappen } = await supabase
      .from('agent_stappen')
      .select('id, volgorde')
      .eq('pipeline_run_id', runId)
      .eq('agent_id', fromAgentId)
      .single()

    if (stappen) {
      await supabase
        .from('agent_stappen')
        .update({ status: 'wacht', duur_ms: null, output: null })
        .eq('pipeline_run_id', runId)
        .gte('volgorde', stappen.volgorde)

      // Set the first one to actief
      await supabase
        .from('agent_stappen')
        .update({ status: 'actief' })
        .eq('id', stappen.id)
    }
  } else {
    // Reset all stappen
    await supabase
      .from('agent_stappen')
      .update({ status: 'wacht', duur_ms: null, output: null })
      .eq('pipeline_run_id', runId)

    // Set first stap to actief
    const { data: firstStap } = await supabase
      .from('agent_stappen')
      .select('id')
      .eq('pipeline_run_id', runId)
      .order('volgorde')
      .limit(1)
      .single()

    if (firstStap) {
      await supabase.from('agent_stappen').update({ status: 'actief' }).eq('id', firstStap.id)
    }
  }
}

export async function approvePipelineRun(runId: string): Promise<void> {
  await supabase
    .from('pipeline_runs')
    .update({
      status: 'voltooid',
      review_status: 'goedgekeurd',
      voltooid: new Date().toISOString(),
    })
    .eq('id', runId)

  // Complete the opslag agent stap
  await supabase
    .from('agent_stappen')
    .update({ status: 'voltooid', duur_ms: 2000 })
    .eq('pipeline_run_id', runId)
    .eq('agent_id', 'agent-5')
}

export async function rejectPipelineRun(runId: string, feedback: string): Promise<void> {
  const { data: run } = await supabase
    .from('pipeline_runs')
    .select('review_opmerkingen')
    .eq('id', runId)
    .single()

  const opmerkingen = [...(run?.review_opmerkingen || []), feedback]

  await supabase
    .from('pipeline_runs')
    .update({
      review_status: 'afgekeurd',
      review_opmerkingen: opmerkingen,
    })
    .eq('id', runId)
}

export async function updateAgentConfig(agentId: string, config: AgentConfiguratie): Promise<void> {
  const { error } = await supabase
    .from('agents')
    .update({ configuratie: config })
    .eq('id', agentId)

  if (error) {
    console.error('Error updating agent config:', error)
    throw error
  }
}

// =============================================================================
// Combined Fetch for Initial Load
// =============================================================================

export async function fetchAIAgentsData() {
  const [agents, pipelineRuns, statistieken, plaudPromptTemplate, categorieen] = await Promise.all([
    fetchAgents(),
    fetchPipelineRuns(),
    fetchStatistieken(),
    fetchPlaudPromptTemplate(),
    fetchCategorieen(),
  ])

  return {
    agents,
    pipelineRuns,
    statistieken,
    plaudPromptTemplate: plaudPromptTemplate || {
      titel: 'Standaard Procedure Opname',
      versie: 'v1.0',
      laatstBijgewerkt: new Date().toISOString(),
      template: '',
      instructies: [],
    },
    categorieen,
  }
}

// =============================================================================
// Real-time Subscriptions
// =============================================================================

export interface RealtimeCallbacks {
  onPipelineUpdate?: (run: PipelineRun) => void
  onAgentStapUpdate?: (stap: AgentStap & { pipeline_run_id: string }) => void
  onNewPipelineRun?: (runId: string) => void
}

/**
 * Subscribe to real-time updates for pipeline runs and agent steps
 * Returns a cleanup function to unsubscribe
 *
 * Note: Realtime requires the tables to be added to the supabase_realtime publication
 * and proper RLS policies. If realtime fails, the app will still work but won't auto-update.
 */
export function subscribeToRealtimeUpdates(callbacks: RealtimeCallbacks): () => void {
  const channels: RealtimeChannel[] = []
  let realtimeDisabled = false

  // Subscribe to pipeline_runs changes
  const pipelineChannel = supabase
    .channel('pipeline-runs-changes', {
      config: {
        broadcast: { self: true },
      },
    })
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'pipeline_runs'
      },
      async (payload) => {
        console.log('Pipeline run update:', payload)
        const newRecord = payload.new as { id: string } | null

        if (payload.eventType === 'INSERT' && callbacks.onNewPipelineRun && newRecord) {
          callbacks.onNewPipelineRun(newRecord.id)
        }

        if (callbacks.onPipelineUpdate && newRecord) {
          // Fetch the full run data with relations
          const runs = await fetchPipelineRuns()
          const updatedRun = runs.find(r => r.id === newRecord.id)
          if (updatedRun) {
            callbacks.onPipelineUpdate(updatedRun)
          }
        }
      }
    )
    .subscribe((status, err) => {
      if (status === 'SUBSCRIBED') {
        console.log('✓ Realtime: pipeline_runs subscription active')
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        if (!realtimeDisabled) {
          console.info('Realtime disabled - manual refresh required for updates')
          realtimeDisabled = true
        }
      }
    })

  channels.push(pipelineChannel)

  // Subscribe to agent_stappen changes
  const stappenChannel = supabase
    .channel('agent-stappen-changes', {
      config: {
        broadcast: { self: true },
      },
    })
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'agent_stappen'
      },
      (payload) => {
        console.log('Agent stap update:', payload)

        if (callbacks.onAgentStapUpdate && payload.new) {
          const stap = payload.new as {
            agent_id: string
            status: AgentStapStatus
            duur_ms: number | null
            output: string | null
            pipeline_run_id: string
          }
          callbacks.onAgentStapUpdate({
            agentId: stap.agent_id,
            status: stap.status,
            duur: stap.duur_ms ? formatDuration(stap.duur_ms) : null,
            output: stap.output,
            pipeline_run_id: stap.pipeline_run_id
          })
        }
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('✓ Realtime: agent_stappen subscription active')
      }
      // Don't log errors for stappen channel since pipeline channel already handles it
    })

  channels.push(stappenChannel)

  // Return cleanup function
  return () => {
    channels.forEach(channel => {
      supabase.removeChannel(channel)
    })
  }
}

/**
 * Subscribe to updates for a specific pipeline run
 */
export function subscribeToPipelineRun(
  runId: string,
  callbacks: RealtimeCallbacks
): () => void {
  const channels: RealtimeChannel[] = []

  // Subscribe to this specific pipeline run
  const runChannel = supabase
    .channel(`pipeline-run-${runId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'pipeline_runs',
        filter: `id=eq.${runId}`
      },
      async (payload) => {
        console.log(`Pipeline ${runId} update:`, payload)

        if (callbacks.onPipelineUpdate && payload.new) {
          const runs = await fetchPipelineRuns()
          const updatedRun = runs.find(r => r.id === runId)
          if (updatedRun) {
            callbacks.onPipelineUpdate(updatedRun)
          }
        }
      }
    )
    .subscribe()

  channels.push(runChannel)

  // Subscribe to agent stappen for this run
  const stappenChannel = supabase
    .channel(`agent-stappen-${runId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'agent_stappen',
        filter: `pipeline_run_id=eq.${runId}`
      },
      (payload) => {
        console.log(`Agent stap for ${runId} update:`, payload)

        if (callbacks.onAgentStapUpdate && payload.new) {
          const stap = payload.new as {
            agent_id: string
            status: AgentStapStatus
            duur_ms: number | null
            output: string | null
            pipeline_run_id: string
          }
          callbacks.onAgentStapUpdate({
            agentId: stap.agent_id,
            status: stap.status,
            duur: stap.duur_ms ? formatDuration(stap.duur_ms) : null,
            output: stap.output,
            pipeline_run_id: stap.pipeline_run_id
          })
        }
      }
    )
    .subscribe()

  channels.push(stappenChannel)

  return () => {
    channels.forEach(channel => {
      supabase.removeChannel(channel)
    })
  }
}
