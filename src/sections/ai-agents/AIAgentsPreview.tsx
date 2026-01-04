import data from '@/../product/sections/ai-agents/data.json'
import { AIAgents } from './components/AIAgents'

export default function AIAgentsPreview() {
  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <AIAgents
        agents={data.agents as any}
        pipelineRuns={data.pipelineRuns as any}
        statistieken={data.statistieken as any}
        plaudPromptTemplate={data.plaudPromptTemplate as any}
        categorieen={data.categorieen as any}
        onStartRun={(params) => console.log('Start run:', params)}
        onCancelRun={(runId) => console.log('Cancel run:', runId)}
        onRetryRun={(runId, fromAgentId) => console.log('Retry run:', runId, fromAgentId)}
        onViewRun={(runId) => console.log('View run:', runId)}
        onApproveRun={(runId) => console.log('Approve run:', runId)}
        onRejectRun={(runId, feedback) => console.log('Reject run:', runId, feedback)}
        onApproveZinnen={(runId, zinIds) => console.log('Approve zinnen:', runId, zinIds)}
        onConfigureAgent={(agentId) => console.log('Configure agent:', agentId)}
        onSaveAgentConfig={(agentId, config) => console.log('Save agent config:', agentId, config)}
        onViewAgentLogs={(agentId) => console.log('View agent logs:', agentId)}
        onExportDocument={(runId) => console.log('Export document:', runId)}
      />
    </div>
  )
}
