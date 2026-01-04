import { useState } from 'react'
import { LayoutDashboard, Bot, Plus } from 'lucide-react'
import type { AIAgentsProps } from '@/../product/sections/ai-agents/types'
import { DashboardTab } from './DashboardTab'
import { AgentsTab } from './AgentsTab'
import { NieuweRunTab } from './NieuweRunTab'

type Tab = 'dashboard' | 'agents' | 'nieuwe-run'

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'agents', label: 'Agents', icon: <Bot className="w-4 h-4" /> },
  { id: 'nieuwe-run', label: 'Nieuwe Run', icon: <Plus className="w-4 h-4" /> },
]

export function AIAgents({
  agents,
  pipelineRuns,
  statistieken,
  plaudPromptTemplate,
  categorieen,
  onStartRun,
  onCancelRun: _onCancelRun,
  onRetryRun,
  onViewRun,
  onApproveRun,
  onRejectRun: _onRejectRun,
  onApproveZinnen: _onApproveZinnen,
  onConfigureAgent,
  onSaveAgentConfig: _onSaveAgentConfig,
  onViewAgentLogs,
  onExportDocument: _onExportDocument,
}: AIAgentsProps) {
  // Suppress unused variable warnings - these props are part of the API but not yet implemented
  void _onCancelRun
  void _onRejectRun
  void _onApproveZinnen
  void _onSaveAgentConfig
  void _onExportDocument
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  return (
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950">
      {/* Tab navigation */}
      <div className="flex-shrink-0 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
        <div className="px-6">
          <nav className="flex gap-1" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all
                  ${activeTab === tab.id
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 hover:border-stone-300 dark:hover:border-stone-600'
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'dashboard' && (
          <DashboardTab
            pipelineRuns={pipelineRuns}
            statistieken={statistieken}
            agents={agents}
            onViewRun={onViewRun}
            onRetryRun={onRetryRun}
            onApproveRun={onApproveRun}
          />
        )}

        {activeTab === 'agents' && (
          <AgentsTab
            agents={agents}
            onConfigureAgent={onConfigureAgent}
            onViewAgentLogs={onViewAgentLogs}
          />
        )}

        {activeTab === 'nieuwe-run' && (
          <NieuweRunTab
            categorieen={categorieen}
            plaudPromptTemplate={plaudPromptTemplate}
            onStartRun={onStartRun}
          />
        )}
      </div>
    </div>
  )
}
