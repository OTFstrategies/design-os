import { corsHeaders } from '../_shared/cors.ts'
import { supabaseAdmin } from '../_shared/supabase-client.ts'

// Pipeline flow configuration
// Stage 1: 1A and 1B run in parallel
// Stages 2-5: Sequential
const PIPELINE_STAGES = [
  { stage: 1, agents: ['agent-1a', 'agent-1b'], parallel: true },
  { stage: 2, agents: ['agent-2'], parallel: false },
  { stage: 3, agents: ['agent-3'], parallel: false },
  { stage: 4, agents: ['agent-4'], parallel: false },
  { stage: 5, agents: ['agent-5'], parallel: false },
]

const AGENT_FUNCTIONS: Record<string, string> = {
  'agent-1a': 'agent-1a-foto-analyzer',
  'agent-1b': 'agent-1b-document-parser',
  'agent-2': 'agent-2-analyse',
  'agent-3': 'agent-3-stijl',
  'agent-4': 'agent-4-review',
  'agent-5': 'agent-5-opslag',
}

interface OrchestratorRequest {
  action: 'start' | 'continue' | 'retry' | 'agent-completed'
  pipelineRunId: string
  fromAgentId?: string
  completedAgentId?: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body: OrchestratorRequest = await req.json()
    const { action, pipelineRunId, fromAgentId, completedAgentId } = body

    console.log(`Orchestrator: ${action} for run ${pipelineRunId}`)

    switch (action) {
      case 'start':
        return await startPipeline(pipelineRunId)

      case 'continue':
      case 'agent-completed':
        return await continueAfterAgent(pipelineRunId, completedAgentId)

      case 'retry':
        return await retryFromAgent(pipelineRunId, fromAgentId!)

      default:
        throw new Error(`Unknown action: ${action}`)
    }
  } catch (error) {
    console.error('Orchestrator error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function startPipeline(pipelineRunId: string) {
  // Verify pipeline run exists
  const { data: run, error: runError } = await supabaseAdmin
    .from('pipeline_runs')
    .select('*')
    .eq('id', pipelineRunId)
    .single()

  if (runError || !run) {
    throw new Error('Pipeline run not found')
  }

  if (run.status !== 'actief') {
    throw new Error(`Pipeline run is not active (status: ${run.status})`)
  }

  // Start Stage 1 (parallel agents 1A and 1B)
  const stage1 = PIPELINE_STAGES[0]
  console.log(`Starting Stage 1 with agents: ${stage1.agents.join(', ')}`)

  // Invoke agents in parallel and wait for them to complete
  // Each agent will fire a callback to orchestrator when done (fire-and-forget from agent side)
  try {
    const results = await Promise.all(
      stage1.agents.map(agentId => invokeAgent(agentId, pipelineRunId))
    )
    console.log('Stage 1 completed:', results)
  } catch (err) {
    console.error('Stage 1 error:', err)
    // Continue anyway - individual agents handle their own errors
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Pipeline started',
      stage: 1,
      agents: stage1.agents
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function continueAfterAgent(pipelineRunId: string, completedAgentId?: string) {
  // Get current state of all agent steps
  const { data: stappen, error } = await supabaseAdmin
    .from('agent_stappen')
    .select('*')
    .eq('pipeline_run_id', pipelineRunId)
    .order('volgorde')

  if (error || !stappen) {
    throw new Error('Failed to fetch agent steps')
  }

  // Find current stage by checking which agents are done
  const stage1Agents = ['agent-1a', 'agent-1b']
  const stage1Steps = stappen.filter(s => stage1Agents.includes(s.agent_id))
  const stage1Complete = stage1Steps.every(s =>
    s.status === 'voltooid' || s.status === 'overgeslagen'
  )
  const stage1HasError = stage1Steps.some(s => s.status === 'fout')

  if (stage1HasError) {
    await markPipelineFailed(pipelineRunId, 'Stage 1 failed')
    return new Response(
      JSON.stringify({ success: false, error: 'Stage 1 failed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // If Stage 1 not complete, wait for both agents
  if (!stage1Complete) {
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Waiting for Stage 1 to complete',
        stage: 1
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Find next agent to run
  for (let i = 1; i < PIPELINE_STAGES.length; i++) {
    const stage = PIPELINE_STAGES[i]
    const agentId = stage.agents[0]
    const step = stappen.find(s => s.agent_id === agentId)

    if (!step) continue

    if (step.status === 'fout') {
      await markPipelineFailed(pipelineRunId, `Agent ${agentId} failed`)
      return new Response(
        JSON.stringify({ success: false, error: `Agent ${agentId} failed` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (step.status === 'wacht') {
      // This is the next agent to run
      console.log(`Starting Stage ${i + 1} with agent: ${agentId}`)
      await invokeAgent(agentId, pipelineRunId)

      return new Response(
        JSON.stringify({
          success: true,
          message: `Started agent ${agentId}`,
          stage: i + 1
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  }

  // All agents complete
  await markPipelineComplete(pipelineRunId)

  return new Response(
    JSON.stringify({
      success: true,
      message: 'Pipeline completed',
      status: 'voltooid'
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function retryFromAgent(pipelineRunId: string, fromAgentId: string) {
  // Reset pipeline status
  await supabaseAdmin
    .from('pipeline_runs')
    .update({
      status: 'actief',
      voltooid: null,
      doorlooptijd_ms: null,
      last_error: null
    })
    .eq('id', pipelineRunId)

  // Get the step to retry from
  const { data: fromStep } = await supabaseAdmin
    .from('agent_stappen')
    .select('volgorde')
    .eq('pipeline_run_id', pipelineRunId)
    .eq('agent_id', fromAgentId)
    .single()

  if (!fromStep) {
    throw new Error(`Agent ${fromAgentId} not found in pipeline`)
  }

  // Reset all steps from this point onwards
  await supabaseAdmin
    .from('agent_stappen')
    .update({
      status: 'wacht',
      duur_ms: null,
      output: null,
      started_at: null,
      completed_at: null,
      error_message: null
    })
    .eq('pipeline_run_id', pipelineRunId)
    .gte('volgorde', fromStep.volgorde)

  // Invoke the agent
  await invokeAgent(fromAgentId, pipelineRunId)

  return new Response(
    JSON.stringify({
      success: true,
      message: `Retrying from agent ${fromAgentId}`
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function invokeAgent(agentId: string, pipelineRunId: string) {
  const functionName = AGENT_FUNCTIONS[agentId]
  if (!functionName) {
    throw new Error(`Unknown agent: ${agentId}`)
  }

  // Update step status to active
  await supabaseAdmin
    .from('agent_stappen')
    .update({
      status: 'actief',
      started_at: new Date().toISOString()
    })
    .eq('pipeline_run_id', pipelineRunId)
    .eq('agent_id', agentId)

  // Update pipeline current agent
  await supabaseAdmin
    .from('pipeline_runs')
    .update({ current_agent_id: agentId })
    .eq('id', pipelineRunId)

  // Invoke the agent function and wait for its response
  console.log(`Invoking function: ${functionName}`)

  // Hardcode the keys since env vars seem to not work correctly
  const supabaseUrl = 'https://qfhsctnvwsneaujcgpkp.supabase.co'
  const authKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmaHNjdG52d3NuZWF1amNncGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1NDIxNjQsImV4cCI6MjA4MzExODE2NH0.8xGkI8x5jdRW5YsY2k8ARgsXYqeA2zNur-1T89rvZ3g'

  const targetUrl = `${supabaseUrl}/functions/v1/${functionName}`
  console.log(`Target URL: ${targetUrl}`)

  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authKey}`,
      },
      body: JSON.stringify({ pipelineRunId, agentId }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error(`${functionName} error: ${response.status} - ${error}`)
      throw new Error(`Agent ${agentId} failed: ${error}`)
    }

    const result = await response.json()
    console.log(`${functionName} completed:`, result.success ? 'success' : 'failed')
    return { invoked: true, function: functionName, agentId, result }
  } catch (err) {
    console.error(`${functionName} fetch error:`, err)
    throw err
  }
}

async function markPipelineFailed(pipelineRunId: string, error: string) {
  const { data: run } = await supabaseAdmin
    .from('pipeline_runs')
    .select('gestart')
    .eq('id', pipelineRunId)
    .single()

  const doorlooptijd = run?.gestart
    ? Date.now() - new Date(run.gestart).getTime()
    : null

  await supabaseAdmin
    .from('pipeline_runs')
    .update({
      status: 'gefaald',
      voltooid: new Date().toISOString(),
      doorlooptijd_ms: doorlooptijd,
      last_error: error,
      foutmelding: error
    })
    .eq('id', pipelineRunId)
}

async function markPipelineComplete(pipelineRunId: string) {
  const { data: run } = await supabaseAdmin
    .from('pipeline_runs')
    .select('gestart')
    .eq('id', pipelineRunId)
    .single()

  const doorlooptijd = run?.gestart
    ? Date.now() - new Date(run.gestart).getTime()
    : null

  // Check if review is needed (score < 80)
  const { data: reviewStep } = await supabaseAdmin
    .from('agent_stap_data')
    .select('output_data')
    .eq('agent_stap_id', (
      await supabaseAdmin
        .from('agent_stappen')
        .select('id')
        .eq('pipeline_run_id', pipelineRunId)
        .eq('agent_id', 'agent-4')
        .single()
    ).data?.id)
    .single()

  const reviewScore = reviewStep?.output_data?.score ?? 100
  const needsReview = reviewScore < 80

  await supabaseAdmin
    .from('pipeline_runs')
    .update({
      status: needsReview ? 'review_nodig' : 'voltooid',
      voltooid: new Date().toISOString(),
      doorlooptijd_ms: doorlooptijd,
      kwaliteitsscore: reviewScore,
      current_agent_id: null
    })
    .eq('id', pipelineRunId)
}
