'use client'

import { useState, useEffect, useCallback } from 'react'
import type {
  Agent,
  PipelineRun,
  PipelineStatistieken,
  PlaudPromptTemplate,
  Categorie,
  NieuweRunParams,
  AgentConfiguratie,
  AgentStap,
} from '@/components/ai-agents/types'
import {
  fetchAIAgentsData,
  createPipelineRun,
  cancelPipelineRun,
  retryPipelineRun,
  approvePipelineRun,
  rejectPipelineRun,
  updateAgentConfig,
  retryPipelineViaEdgeFunction,
} from '@/lib/ai-agents-service'
import { isSupabaseConfigured } from '@/lib/supabase'

// Fallback to sample data if Supabase is not configured
import {
  agents as sampleAgents,
  pipelineRuns as samplePipelineRuns,
  statistieken as sampleStatistieken,
  plaudPromptTemplate as samplePlaudPromptTemplate,
  categorieen as sampleCategorieen,
} from '@/components/ai-agents/sample-data'

interface AIAgentsData {
  agents: Agent[]
  pipelineRuns: PipelineRun[]
  statistieken: PipelineStatistieken
  plaudPromptTemplate: PlaudPromptTemplate
  categorieen: Categorie[]
}

interface UseAIAgentsDataResult {
  data: AIAgentsData
  isLoading: boolean
  error: Error | null
  isUsingFallback: boolean
  refetch: () => Promise<void>
  // Actions
  startRun: (params: NieuweRunParams) => Promise<void>
  cancelRun: (runId: string) => Promise<void>
  retryRun: (runId: string, fromAgentId?: string) => Promise<void>
  approveRun: (runId: string) => Promise<void>
  rejectRun: (runId: string, feedback: string) => Promise<void>
  saveAgentConfig: (agentId: string, config: AgentConfiguratie) => Promise<void>
}

const fallbackData: AIAgentsData = {
  agents: sampleAgents,
  pipelineRuns: samplePipelineRuns,
  statistieken: sampleStatistieken,
  plaudPromptTemplate: samplePlaudPromptTemplate,
  categorieen: sampleCategorieen,
}

export function useAIAgentsData(): UseAIAgentsDataResult {
  const [data, setData] = useState<AIAgentsData>(fallbackData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isUsingFallback, setIsUsingFallback] = useState(false)

  // Background refresh - doesn't show loading state to prevent UI remount
  const refreshData = useCallback(async () => {
    try {
      if (!isSupabaseConfigured()) {
        return
      }
      const result = await fetchAIAgentsData()
      setData(result)
      setIsUsingFallback(false)
    } catch (err) {
      console.error('Failed to refresh AI agents data:', err)
      // Don't update error state or fallback during background refresh
      // to prevent UI disruption
    }
  }, [])

  // Initial fetch - shows loading state
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, using sample data')
        setData(fallbackData)
        setIsUsingFallback(true)
        setIsLoading(false)
        return
      }

      const result = await fetchAIAgentsData()
      setData(result)
      setIsUsingFallback(false)
    } catch (err) {
      console.error('Failed to fetch AI agents data, using fallback:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch data'))
      setData(fallbackData)
      setIsUsingFallback(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Polling for data updates (every 10 seconds)
  // Uses refreshData instead of fetchData to prevent loading state / UI remount
  // Note: Realtime WebSocket subscription disabled - Supabase Realtime needs dashboard configuration
  // See: https://supabase.com/dashboard/project/qfhsctnvwsneaujcgpkp/database/replication
  useEffect(() => {
    if (isUsingFallback || !isSupabaseConfigured()) {
      return
    }

    const pollInterval = setInterval(() => {
      refreshData()
    }, 10000)

    return () => {
      clearInterval(pollInterval)
    }
  }, [isUsingFallback, refreshData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const startRun = useCallback(async (params: NieuweRunParams) => {
    if (isUsingFallback) {
      console.log('Starting new pipeline run (sample mode):', params)
      return
    }
    await createPipelineRun(params)
    await fetchData()
  }, [isUsingFallback, fetchData])

  const cancelRun = useCallback(async (runId: string) => {
    if (isUsingFallback) {
      console.log('Cancelling run (sample mode):', runId)
      return
    }
    await cancelPipelineRun(runId)
    await fetchData()
  }, [isUsingFallback, fetchData])

  const retryRun = useCallback(async (runId: string, fromAgentId?: string) => {
    if (isUsingFallback) {
      console.log('Retrying run (sample mode):', runId, fromAgentId)
      return
    }
    // Use Edge Function for retry to properly restart the agent pipeline
    await retryPipelineViaEdgeFunction(runId, fromAgentId)
    await fetchData()
  }, [isUsingFallback, fetchData])

  const approveRun = useCallback(async (runId: string) => {
    if (isUsingFallback) {
      console.log('Approving run (sample mode):', runId)
      return
    }
    await approvePipelineRun(runId)
    await fetchData()
  }, [isUsingFallback, fetchData])

  const rejectRun = useCallback(async (runId: string, feedback: string) => {
    if (isUsingFallback) {
      console.log('Rejecting run (sample mode):', runId, feedback)
      return
    }
    await rejectPipelineRun(runId, feedback)
    await fetchData()
  }, [isUsingFallback, fetchData])

  const saveAgentConfig = useCallback(async (agentId: string, config: AgentConfiguratie) => {
    if (isUsingFallback) {
      console.log('Saving agent config (sample mode):', agentId, config)
      return
    }
    await updateAgentConfig(agentId, config)
    await fetchData()
  }, [isUsingFallback, fetchData])

  return {
    data,
    isLoading,
    error,
    isUsingFallback,
    refetch: fetchData,
    startRun,
    cancelRun,
    retryRun,
    approveRun,
    rejectRun,
    saveAgentConfig,
  }
}
