import { useState, useMemo } from 'react'
import { ClipboardList, FileText } from 'lucide-react'
import type { StijlregelsTabProps } from '@/../product/sections/schrijfstandaard-structuur/types'
import { StijlregelAccordeon } from './StijlregelCard'

export function StijlregelsTab({
  stijlregels,
  categorieen,
  onGenerateChecklist,
}: StijlregelsTabProps) {
  const [selectedRegels, setSelectedRegels] = useState<Set<string>>(new Set())

  // Group rules by category
  const regelsByCategorie = useMemo(() => {
    const grouped = new Map<string, typeof stijlregels>()
    for (const cat of categorieen) {
      grouped.set(
        cat.code,
        stijlregels.filter((r) => r.categorie === cat.code)
      )
    }
    return grouped
  }, [stijlregels, categorieen])

  const handleToggleRegel = (regelId: string, selected: boolean) => {
    setSelectedRegels((prev) => {
      const next = new Set(prev)
      if (selected) {
        next.add(regelId)
      } else {
        next.delete(regelId)
      }
      return next
    })
  }

  const handleSelectAll = () => {
    if (selectedRegels.size === stijlregels.length) {
      setSelectedRegels(new Set())
    } else {
      setSelectedRegels(new Set(stijlregels.map((r) => r.id)))
    }
  }

  const handleGenerateChecklist = () => {
    onGenerateChecklist?.(Array.from(selectedRegels))
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="font-semibold text-stone-900 dark:text-stone-100">
                Stijlregels
              </h2>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                {stijlregels.length} regels in {categorieen.length} categorieën
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Select all toggle */}
            <button
              onClick={handleSelectAll}
              className="text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            >
              {selectedRegels.size === stijlregels.length ? 'Deselecteer alles' : 'Selecteer alles'}
            </button>

            {/* Generate checklist button */}
            <button
              onClick={handleGenerateChecklist}
              disabled={selectedRegels.size === 0}
              className={`
                flex items-center gap-2 px-4 py-2.5 font-medium rounded-lg transition-all
                ${selectedRegels.size > 0
                  ? 'bg-amber-500 hover:bg-amber-600 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500 cursor-not-allowed'
                }
              `}
            >
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">Genereer checklist</span>
              {selectedRegels.size > 0 && (
                <span className="px-1.5 py-0.5 text-xs bg-white/20 rounded">
                  {selectedRegels.size}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Categories as accordeons */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {categorieen.map((cat, index) => {
          const regels = regelsByCategorie.get(cat.code) || []
          if (regels.length === 0) return null

          return (
            <StijlregelAccordeon
              key={cat.id}
              categorie={cat}
              regels={regels}
              selectedRegels={selectedRegels}
              onToggleRegel={handleToggleRegel}
              defaultOpen={index === 0}
            />
          )
        })}
      </div>
    </div>
  )
}
