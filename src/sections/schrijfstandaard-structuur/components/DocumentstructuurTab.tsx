import { useState } from 'react'
import { Layers, Table, Wand2 } from 'lucide-react'
import type { DocumentstructuurTabProps } from '@/../product/sections/schrijfstandaard-structuur/types'
import { NiveauCard } from './NiveauCard'
import { RACIMatrix } from './RACIMatrix'
import { CodeGenerator } from './CodeGenerator'

type SubTab = 'niveaus' | 'raci' | 'code'

export function DocumentstructuurTab({
  documentNiveaus,
  documentTypes,
  rollen,
  raciMatrix,
  coderingFormaat,
  onSelectNiveau,
  onViewTemplate,
  onGenerateCode,
}: DocumentstructuurTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('niveaus')
  const [selectedNiveau, setSelectedNiveau] = useState<string | null>(null)

  const handleSelectNiveau = (code: string) => {
    setSelectedNiveau(code === selectedNiveau ? null : code)
    onSelectNiveau?.(code)
  }

  const subTabs: { id: SubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'niveaus', label: 'Niveaus & Templates', icon: <Layers className="w-4 h-4" /> },
    { id: 'raci', label: 'RACI-Matrix', icon: <Table className="w-4 h-4" /> },
    { id: 'code', label: 'Code Generator', icon: <Wand2 className="w-4 h-4" /> },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Sub-tab navigation */}
      <div className="flex-shrink-0 px-6 py-3 border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
        <div className="flex gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-lg w-fit">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                ${activeSubTab === tab.id
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }
              `}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Niveaus & Templates */}
        {activeSubTab === 'niveaus' && (
          <div className="space-y-6">
            {/* Visual hierarchy */}
            <div className="flex items-center justify-center gap-2 py-4 overflow-x-auto">
              {documentNiveaus.map((niveau, index) => (
                <div key={niveau.id} className="flex items-center">
                  <button
                    onClick={() => handleSelectNiveau(niveau.code)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all whitespace-nowrap
                      ${selectedNiveau === niveau.code
                        ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-500'
                        : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                      }
                    `}
                  >
                    <span className="font-bold text-stone-900 dark:text-stone-100">
                      {niveau.code}
                    </span>
                    <span className="text-sm text-stone-500 dark:text-stone-400">
                      {niveau.naam}
                    </span>
                  </button>
                  {index < documentNiveaus.length - 1 && (
                    <div className="w-8 h-0.5 bg-stone-200 dark:bg-stone-700 mx-1" />
                  )}
                </div>
              ))}
            </div>

            {/* Niveau cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {documentNiveaus.map((niveau) => (
                <NiveauCard
                  key={niveau.id}
                  niveau={niveau}
                  documentTypes={documentTypes}
                  isSelected={selectedNiveau === niveau.code}
                  onSelect={() => handleSelectNiveau(niveau.code)}
                  onViewTemplate={() => onViewTemplate?.(niveau.code)}
                />
              ))}
            </div>
          </div>
        )}

        {/* RACI Matrix */}
        {activeSubTab === 'raci' && (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                RACI-Matrix
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                Overzicht van verantwoordelijkheden per documenttype
              </p>
            </div>
            <RACIMatrix
              documentTypes={documentTypes}
              rollen={rollen}
              raciMatrix={raciMatrix}
            />
          </div>
        )}

        {/* Code Generator */}
        {activeSubTab === 'code' && (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                Documentcode Generator
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                Genereer een unieke documentcode volgens het standaardformaat
              </p>
            </div>
            <CodeGenerator
              coderingFormaat={coderingFormaat}
              documentNiveaus={documentNiveaus}
              documentTypes={documentTypes}
              onGenerate={onGenerateCode}
            />
          </div>
        )}
      </div>
    </div>
  )
}
