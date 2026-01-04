import { CheckCircle2, Circle, Loader2, AlertCircle, SkipForward, XCircle } from 'lucide-react'
import type { AgentStap, Agent, AgentStapStatus } from '@/../product/sections/ai-agents/types'

interface PipelineVisualisatieProps {
  agentStappen: AgentStap[]
  agents: Agent[]
  compact?: boolean
  onClickStap?: (agentId: string) => void
}

const statusConfig: Record<AgentStapStatus, { icon: React.ReactNode; color: string; bgColor: string }> = {
  wacht: {
    icon: <Circle className="w-3 h-3" />,
    color: 'text-stone-400 dark:text-stone-500',
    bgColor: 'bg-stone-100 dark:bg-stone-800',
  },
  actief: {
    icon: <Loader2 className="w-3 h-3 animate-spin" />,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
  },
  voltooid: {
    icon: <CheckCircle2 className="w-3 h-3" />,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900',
  },
  fout: {
    icon: <AlertCircle className="w-3 h-3" />,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900',
  },
  overgeslagen: {
    icon: <SkipForward className="w-3 h-3" />,
    color: 'text-stone-400 dark:text-stone-500',
    bgColor: 'bg-stone-100 dark:bg-stone-800',
  },
  afgebroken: {
    icon: <XCircle className="w-3 h-3" />,
    color: 'text-stone-400 dark:text-stone-500',
    bgColor: 'bg-stone-100 dark:bg-stone-800',
  },
}

// Map agent IDs to their display numbers
const agentNummerMap: Record<string, string> = {
  'agent-1a': '1A',
  'agent-1b': '1B',
  'agent-2': '2',
  'agent-3': '3',
  'agent-4': '4',
  'agent-5': '5',
  'agent-6': '6',
}

export function PipelineVisualisatie({ agentStappen, agents, compact = false, onClickStap }: PipelineVisualisatieProps) {
  const getAgent = (agentId: string) => agents.find(a => a.id === agentId)
  const getStap = (agentId: string) => agentStappen.find(s => s.agentId === agentId)

  // Group steps: parallel (1A, 1B) then sequential (2, 3, 4, 5)
  const stap1A = getStap('agent-1a')
  const stap1B = getStap('agent-1b')
  const sequentialStappen = ['agent-2', 'agent-3', 'agent-4', 'agent-5'].map(id => ({
    stap: getStap(id),
    agent: getAgent(id),
    nummer: agentNummerMap[id],
  }))

  if (compact) {
    return (
      <div className="flex items-center gap-1 flex-wrap">
        {/* Parallel steps */}
        <div className="flex flex-col gap-0.5">
          <StapChip stap={stap1A} nummer="1A" compact />
          <StapChip stap={stap1B} nummer="1B" compact />
        </div>
        <Arrow compact />
        {sequentialStappen.map(({ stap, nummer }, index) => (
          <div key={nummer} className="flex items-center gap-1">
            <StapChip stap={stap} nummer={nummer} compact />
            {index < sequentialStappen.length - 1 && <Arrow compact />}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap p-4 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
      {/* Parallel steps */}
      <div className="flex flex-col gap-2">
        <StapCard
          stap={stap1A}
          agent={getAgent('agent-1a')}
          nummer="1A"
          onClick={() => onClickStap?.('agent-1a')}
        />
        <StapCard
          stap={stap1B}
          agent={getAgent('agent-1b')}
          nummer="1B"
          onClick={() => onClickStap?.('agent-1b')}
        />
      </div>
      <Arrow />
      {sequentialStappen.map(({ stap, agent, nummer }, index) => (
        <div key={nummer} className="flex items-center gap-2">
          <StapCard
            stap={stap}
            agent={agent}
            nummer={nummer}
            onClick={() => onClickStap?.(agent?.id || '')}
          />
          {index < sequentialStappen.length - 1 && <Arrow />}
        </div>
      ))}
    </div>
  )
}

interface StapChipProps {
  stap?: AgentStap
  nummer: string
  compact?: boolean
}

function StapChip({ stap, nummer }: StapChipProps) {
  const status = stap?.status || 'wacht'
  const config = statusConfig[status]

  return (
    <div className={`
      flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium
      ${config.bgColor} ${config.color}
    `}>
      {config.icon}
      <span>{nummer}</span>
    </div>
  )
}

interface StapCardProps {
  stap?: AgentStap
  agent?: Agent
  nummer: string
  onClick?: () => void
}

function StapCard({ stap, agent, nummer, onClick }: StapCardProps) {
  const status = stap?.status || 'wacht'
  const config = statusConfig[status]

  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center p-3 rounded-lg border transition-all
        ${status === 'actief'
          ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950 ring-2 ring-blue-200 dark:ring-blue-800'
          : status === 'voltooid'
            ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950'
            : status === 'fout'
              ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950'
              : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-600'
        }
      `}
    >
      <div className={`w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center ${config.color} mb-1`}>
        {config.icon}
      </div>
      <span className="text-xs font-bold text-stone-700 dark:text-stone-300">{nummer}</span>
      {agent && (
        <span className="text-[10px] text-stone-500 dark:text-stone-400 max-w-[60px] truncate">
          {agent.naam.split(' ')[0]}
        </span>
      )}
      {stap?.duur && status === 'voltooid' && (
        <span className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5">{stap.duur}</span>
      )}
    </button>
  )
}

function Arrow({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <svg className="w-3 h-3 text-stone-300 dark:text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    )
  }

  return (
    <div className="text-stone-300 dark:text-stone-600">
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  )
}
