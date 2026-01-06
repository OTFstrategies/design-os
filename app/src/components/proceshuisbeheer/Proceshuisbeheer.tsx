'use client'

import { useState } from 'react'
import type { ProceshuisbeheerProps } from './types'
import { DocumentDashboardTab } from './DocumentDashboardTab'
import { HierarchieBrowserTab } from './HierarchieBrowserTab'
import { VersiebeheerTab } from './VersiebeheerTab'
import { RACIBeheerTab } from './RACIBeheerTab'

type TabId = 'dashboard' | 'hierarchie' | 'versiebeheer' | 'raci'

interface Tab {
  id: TabId
  label: string
  icon: React.ReactNode
}

const tabs: Tab[] = [
  {
    id: 'dashboard',
    label: 'Document Dashboard',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'hierarchie',
    label: 'Hiërarchie Browser',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    id: 'versiebeheer',
    label: 'Versiebeheer',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'raci',
    label: 'RACI Beheer',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
]

export function Proceshuisbeheer(props: ProceshuisbeheerProps) {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')

  return (
    <div className="flex flex-col h-full bg-stone-50 dark:bg-stone-900">
      {/* Header with stats */}
      <div className="bg-white dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-stone-900 dark:text-stone-100">
              Proceshuisbeheer
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Beheer van procedures en werkinstructies
            </p>
          </div>
          <div className="text-right text-sm text-stone-500 dark:text-stone-400">
            Laatste update: {props.statistieken.laatsteUpdate}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="Totaal documenten"
            value={props.statistieken.totaalDocumenten}
            color="stone"
          />
          <StatCard
            label="Actief"
            value={props.statistieken.actief}
            color="green"
            icon="●"
          />
          <StatCard
            label="In review"
            value={props.statistieken.review}
            color="amber"
            icon="◐"
          />
          <StatCard
            label="Draft"
            value={props.statistieken.draft}
            color="stone"
            icon="○"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 px-6">
        <nav className="flex gap-1 -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors
                ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                    : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300 dark:text-stone-400 dark:hover:text-stone-300'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'dashboard' && (
          <DocumentDashboardTab
            documenten={props.documenten}
            statistieken={props.statistieken}
            onFilter={props.onFilterDocumenten}
            onSort={props.onSortDocumenten}
            onOpen={props.onOpenDocument}
            onChangeStatus={props.onChangeStatus}
          />
        )}
        {activeTab === 'hierarchie' && (
          <HierarchieBrowserTab
            hierarchie={props.hierarchie}
            onToggleNode={props.onToggleNode}
            onSelectNode={props.onSelectNode}
            onOpenMiro={props.onOpenMiro}
          />
        )}
        {activeTab === 'versiebeheer' && (
          <VersiebeheerTab
            versieHistorie={props.versieHistorie}
            documenten={props.documenten}
            onViewHistory={props.onViewHistory}
            onCompare={props.onCompareVersions}
            onRevert={props.onRevertToVersion}
          />
        )}
        {activeTab === 'raci' && (
          <RACIBeheerTab
            raciMatrix={props.raciMatrix}
            personen={props.personen}
            rollen={props.rollen}
            onChangeRACI={props.onChangeRACI}
            onSave={props.onSaveRACI}
          />
        )}
      </div>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: number
  color: 'stone' | 'green' | 'amber' | 'red'
  icon?: string
}

function StatCard({ label, value, color, icon }: StatCardProps) {
  const colorClasses = {
    stone: 'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  }

  return (
    <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
      <div className="flex items-center gap-2">
        {icon && <span className="text-lg">{icon}</span>}
        <div>
          <div className="text-2xl font-semibold">{value}</div>
          <div className="text-xs opacity-75">{label}</div>
        </div>
      </div>
    </div>
  )
}
