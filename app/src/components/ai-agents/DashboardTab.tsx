'use client'

import { Activity, CheckCircle2, Clock, AlertTriangle, FileText, Eye, RotateCcw, ThumbsUp } from 'lucide-react'
import type { PipelineRun, PipelineStatistieken, Agent, PipelineRunStatus, DashboardTabProps } from './types'
import { PipelineVisualisatie } from './PipelineVisualisatie'

const statusConfig: Record<PipelineRunStatus, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  actief: {
    label: 'Actief',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
    icon: <Activity className="w-4 h-4 animate-pulse" />,
  },
  voltooid: {
    label: 'Voltooid',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800',
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  review_nodig: {
    label: 'Review nodig',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800',
    icon: <Clock className="w-4 h-4" />,
  },
  gefaald: {
    label: 'Gefaald',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
    icon: <AlertTriangle className="w-4 h-4" />,
  },
}

export function DashboardTab({
  pipelineRuns,
  statistieken,
  agents,
  onViewRun,
  onRetryRun,
  onApproveRun,
}: DashboardTabProps) {
  const actieveRuns = pipelineRuns.filter(r => r.status === 'actief')
  const reviewRuns = pipelineRuns.filter(r => r.status === 'review_nodig')
  const recenteRuns = pipelineRuns.filter(r => r.status !== 'actief').slice(0, 5)

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Active runs section */}
        {actieveRuns.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Actieve runs
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                {actieveRuns.length}
              </span>
            </h2>
            <div className="space-y-4">
              {actieveRuns.map((run) => (
                <ActiveRunCard
                  key={run.id}
                  run={run}
                  agents={agents}
                  onView={() => onViewRun?.(run.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Review needed section */}
        {reviewRuns.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Wacht op review
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-full">
                {reviewRuns.length}
              </span>
            </h2>
            <div className="space-y-3">
              {reviewRuns.map((run) => (
                <ReviewRunCard
                  key={run.id}
                  run={run}
                  onView={() => onViewRun?.(run.id)}
                  onApprove={() => onApproveRun?.(run.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Recent runs table */}
        <section>
          <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-stone-500" />
            Recente runs
          </h2>
          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800">
                  <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">Titel</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider hidden sm:table-cell">Categorie</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider hidden md:table-cell">Doorlooptijd</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {recenteRuns.map((run) => {
                  const config = statusConfig[run.status]
                  return (
                    <tr key={run.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-stone-900 dark:text-stone-100">{run.titel}</div>
                        <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{run.locatie}</div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-mono bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded">
                          {run.categorie}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-stone-600 dark:text-stone-400 hidden md:table-cell">
                        {run.doorlooptijd || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-full border ${config.bgColor} ${config.color}`}>
                          {config.icon}
                          <span className="hidden sm:inline">{config.label}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onViewRun?.(run.id)}
                            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors"
                            title="Bekijken"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {run.status === 'gefaald' && (
                            <button
                              onClick={() => onRetryRun?.(run.id)}
                              className="p-1.5 text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950 rounded transition-colors"
                              title="Opnieuw proberen"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

interface ActiveRunCardProps {
  run: PipelineRun
  agents: Agent[]
  onView?: () => void
}

function ActiveRunCard({ run, agents, onView }: ActiveRunCardProps) {
  const completedSteps = run.agentStappen.filter(s => s.status === 'voltooid').length
  const totalSteps = run.agentStappen.length
  const progress = (completedSteps / totalSteps) * 100

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-blue-200 dark:border-blue-800 p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-stone-900 dark:text-stone-100">{run.titel}</h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-stone-500 dark:text-stone-400">
            <span>{run.locatie}</span>
            <span className="font-mono text-xs bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded">{run.categorie}</span>
          </div>
        </div>
        <button
          onClick={onView}
          className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition-colors"
        >
          Details
        </button>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1.5">
          <span>Voortgang</span>
          <span>{completedSteps} / {totalSteps} stappen</span>
        </div>
        <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Pipeline visualization */}
      <PipelineVisualisatie agentStappen={run.agentStappen} agents={agents} compact />
    </div>
  )
}

interface ReviewRunCardProps {
  run: PipelineRun
  onView?: () => void
  onApprove?: () => void
}

function ReviewRunCard({ run, onView, onApprove }: ReviewRunCardProps) {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-amber-200 dark:border-amber-800 p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-stone-900 dark:text-stone-100 truncate">{run.titel}</h3>
            {run.kwaliteitsscore !== null && (
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                run.kwaliteitsscore >= 80
                  ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                  : 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
              }`}>
                {run.kwaliteitsscore}/100
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-sm text-stone-500 dark:text-stone-400">
            <span className="font-mono text-xs">{run.resultaat?.documentCode}</span>
            {run.nieuweZinnen !== null && run.nieuweZinnen > 0 && (
              <span className="text-amber-600 dark:text-amber-400 text-xs">
                +{run.nieuweZinnen} nieuwe zinnen
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={onView}
            className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
            title="Bekijken"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onApprove}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Goedkeuren</span>
          </button>
        </div>
      </div>
    </div>
  )
}
