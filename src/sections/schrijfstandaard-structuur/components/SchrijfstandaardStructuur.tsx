import { useState } from 'react'
import { BookOpen, FileText, Layers } from 'lucide-react'
import type { SchrijfstandaardStructuurProps } from '@/../product/sections/schrijfstandaard-structuur/types'
import { TerminologieTab } from './TerminologieTab'
import { StijlregelsTab } from './StijlregelsTab'
import { DocumentstructuurTab } from './DocumentstructuurTab'

type Tab = 'terminologie' | 'stijlregels' | 'documentstructuur'

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'terminologie', label: 'Terminologie', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'stijlregels', label: 'Stijlregels', icon: <FileText className="w-4 h-4" /> },
  { id: 'documentstructuur', label: 'Documentstructuur', icon: <Layers className="w-4 h-4" /> },
]

export function SchrijfstandaardStructuur({
  terminologie,
  stijlregels,
  stijlregelCategorieen,
  documentNiveaus,
  documentTypes,
  rollen,
  raciMatrix,
  coderingFormaat,
  onSearchTerminologie,
  onCopyTerm,
  onProposeTerm,
  onGenerateChecklist,
  onSelectNiveau,
  onViewTemplate,
  onGenerateCode,
}: SchrijfstandaardStructuurProps) {
  const [activeTab, setActiveTab] = useState<Tab>('terminologie')

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
        {activeTab === 'terminologie' && (
          <TerminologieTab
            terminologie={terminologie}
            onSearch={onSearchTerminologie}
            onCopy={onCopyTerm}
            onPropose={onProposeTerm}
          />
        )}

        {activeTab === 'stijlregels' && (
          <StijlregelsTab
            stijlregels={stijlregels}
            categorieen={stijlregelCategorieen}
            onGenerateChecklist={onGenerateChecklist}
          />
        )}

        {activeTab === 'documentstructuur' && (
          <DocumentstructuurTab
            documentNiveaus={documentNiveaus}
            documentTypes={documentTypes}
            rollen={rollen}
            raciMatrix={raciMatrix}
            coderingFormaat={coderingFormaat}
            onSelectNiveau={onSelectNiveau}
            onViewTemplate={onViewTemplate}
            onGenerateCode={onGenerateCode}
          />
        )}
      </div>
    </div>
  )
}
