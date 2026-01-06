'use client'

import { ShellWrapper } from '@/components/ShellWrapper'
import { AIAgents } from '@/components/ai-agents'
import { useAIAgentsData } from '@/hooks/useAIAgentsData'
import type { AgentConfiguratie } from '@/components/ai-agents'

export default function AIAgentsPage() {
  const {
    data,
    isLoading,
    isUsingFallback,
    startRun,
    cancelRun,
    retryRun,
    approveRun,
    rejectRun,
    saveAgentConfig,
  } = useAIAgentsData()

  const handleViewRun = (runId: string) => {
    console.log('Viewing run:', runId)
    // TODO: Open run detail modal or navigate to detail page
  }

  const handleApproveZinnen = (runId: string, zinIds: string[]) => {
    console.log('Approving zinnen for run:', runId, zinIds)
    // TODO: Implement zinnen approval
  }

  const handleConfigureAgent = (agentId: string) => {
    console.log('Configuring agent:', agentId)
    // TODO: Open agent configuration modal
  }

  const handleViewAgentLogs = (agentId: string) => {
    console.log('Viewing agent logs:', agentId)
    // TODO: Open agent logs modal
  }

  const handleExportDocument = (runId: string) => {
    console.log('Exporting document for run:', runId)
    // TODO: Trigger document export
  }

  if (isLoading) {
    return (
      <ShellWrapper>
        <div className="h-full flex items-center justify-center bg-stone-50 dark:bg-stone-950">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-stone-600 dark:text-stone-400">Laden...</p>
          </div>
        </div>
      </ShellWrapper>
    )
  }

  return (
    <ShellWrapper>
      {isUsingFallback && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 px-4 py-2">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <span className="font-medium">Demo modus:</span> Supabase niet geconfigureerd. Bekijk sample data.
          </p>
        </div>
      )}
      <AIAgents
        agents={data.agents}
        pipelineRuns={data.pipelineRuns}
        statistieken={data.statistieken}
        plaudPromptTemplate={data.plaudPromptTemplate}
        categorieen={data.categorieen}
        onStartRun={startRun}
        onCancelRun={cancelRun}
        onRetryRun={retryRun}
        onViewRun={handleViewRun}
        onApproveRun={approveRun}
        onRejectRun={rejectRun}
        onApproveZinnen={handleApproveZinnen}
        onConfigureAgent={handleConfigureAgent}
        onSaveAgentConfig={(agentId: string, config: AgentConfiguratie) => saveAgentConfig(agentId, config)}
        onViewAgentLogs={handleViewAgentLogs}
        onExportDocument={handleExportDocument}
      />
    </ShellWrapper>
  )
}
