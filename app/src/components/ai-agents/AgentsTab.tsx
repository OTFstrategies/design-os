'use client'

import { Settings, FileText, Zap, Clock, AlertCircle } from 'lucide-react'
import type { Agent, AgentStatus, AgentsTabProps } from './types'

const statusConfig: Record<AgentStatus, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  idle: {
    label: 'Idle',
    color: 'text-stone-500 dark:text-stone-400',
    bgColor: 'bg-stone-100 dark:bg-stone-800',
    icon: <Clock className="w-3 h-3" />,
  },
  actief: {
    label: 'Actief',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900',
    icon: <Zap className="w-3 h-3 animate-pulse" />,
  },
  error: {
    label: 'Error',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900',
    icon: <AlertCircle className="w-3 h-3" />,
  },
}

// Agent nummer determines the visual position in the pipeline
const agentColors: Record<string, string> = {
  '1A': 'from-blue-500 to-cyan-500',
  '1B': 'from-violet-500 to-purple-500',
  '2': 'from-amber-500 to-orange-500',
  '3': 'from-rose-500 to-pink-500',
  '4': 'from-emerald-500 to-teal-500',
  '5': 'from-indigo-500 to-blue-500',
  '6': 'from-stone-500 to-stone-600',
}

export function AgentsTab({ agents, onConfigureAgent, onViewAgentLogs }: AgentsTabProps) {
  // Sort agents by nummer for consistent display
  const sortedAgents = [...agents].sort((a, b) => {
    const numA = a.nummer.replace(/[^\d]/g, '') + a.nummer.replace(/\d/g, '')
    const numB = b.nummer.replace(/[^\d]/g, '') + b.nummer.replace(/\d/g, '')
    return numA.localeCompare(numB)
  })

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6">
        {/* Pipeline flow diagram */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-4">Pipeline Flow</h2>
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {/* Parallel agents 1A and 1B */}
              <div className="flex flex-col gap-2">
                <AgentChip nummer="1A" naam="Foto Analyzer" gradient={agentColors['1A']} />
                <AgentChip nummer="1B" naam="PDF Parser" gradient={agentColors['1B']} />
              </div>
              <FlowArrow />
              <AgentChip nummer="2" naam="Analyse" gradient={agentColors['2']} />
              <FlowArrow />
              <AgentChip nummer="3" naam="Stijl" gradient={agentColors['3']} />
              <FlowArrow />
              <AgentChip nummer="4" naam="Review" gradient={agentColors['4']} />
              <FlowArrow />
              <AgentChip nummer="5" naam="Opslag" gradient={agentColors['5']} />
            </div>
            <div className="mt-4 flex items-center justify-center">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 dark:bg-stone-800 rounded-full text-xs text-stone-500 dark:text-stone-400">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-stone-500 to-stone-600" />
                <span>Status Tracker monitort alle stappen</span>
              </div>
            </div>
          </div>
        </div>

        {/* Agent grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedAgents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              gradient={agentColors[agent.nummer] || 'from-stone-500 to-stone-600'}
              onConfigure={() => onConfigureAgent?.(agent.id)}
              onViewLogs={() => onViewAgentLogs?.(agent.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface AgentChipProps {
  nummer: string
  naam: string
  gradient: string
}

function AgentChip({ nummer, naam, gradient }: AgentChipProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
      <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${gradient} flex items-center justify-center text-xs font-bold text-white shadow-sm`}>
        {nummer}
      </div>
      <span className="text-sm font-medium text-stone-700 dark:text-stone-300">{naam}</span>
    </div>
  )
}

function FlowArrow() {
  return (
    <div className="text-stone-300 dark:text-stone-600 hidden sm:block">
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  )
}

interface AgentCardProps {
  agent: Agent
  gradient: string
  onConfigure?: () => void
  onViewLogs?: () => void
}

function AgentCard({ agent, gradient, onConfigure, onViewLogs }: AgentCardProps) {
  const status = statusConfig[agent.status]

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden group hover:border-stone-300 dark:hover:border-stone-700 transition-colors">
      {/* Header with gradient */}
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

      <div className="p-4">
        {/* Agent header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-sm font-bold text-white shadow-sm`}>
              {agent.nummer}
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 dark:text-stone-100">{agent.naam}</h3>
              <span className={`inline-flex items-center gap-1 text-xs ${status.color}`}>
                {status.icon}
                {status.label}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2 mb-4">
          {agent.rol}
        </p>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <MetricBox label="Vandaag" value={agent.metrics.runsVandaag} />
          <MetricBox label="Gem. tijd" value={agent.metrics.gemiddeldeTijd} />
          <MetricBox
            label="Succes"
            value={`${Math.round(agent.metrics.succesRatio * 100)}%`}
            highlight={agent.metrics.succesRatio >= 0.95}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
          <button
            onClick={onConfigure}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            Configuratie
          </button>
          <button
            onClick={onViewLogs}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" />
            Logs
          </button>
        </div>
      </div>
    </div>
  )
}

interface MetricBoxProps {
  label: string
  value: string | number
  highlight?: boolean
}

function MetricBox({ label, value, highlight }: MetricBoxProps) {
  return (
    <div className="text-center px-2 py-1.5 bg-stone-50 dark:bg-stone-800/50 rounded-lg">
      <div className={`text-sm font-semibold ${highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-900 dark:text-stone-100'}`}>
        {value}
      </div>
      <div className="text-xs text-stone-500 dark:text-stone-400">{label}</div>
    </div>
  )
}
