import { useState } from 'react'
import { ChevronDown, Check, X } from 'lucide-react'
import type { Stijlregel, StijlregelCategorie } from '@/../product/sections/schrijfstandaard-structuur/types'

interface StijlregelCardProps {
  regel: Stijlregel
  isSelected?: boolean
  onToggleSelect?: (selected: boolean) => void
}

export function StijlregelCard({ regel, isSelected = false, onToggleSelect }: StijlregelCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={`
      border rounded-lg transition-all
      ${isSelected
        ? 'border-amber-400 dark:border-amber-500 bg-amber-50/50 dark:bg-amber-900/10'
        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900'
      }
    `}>
      {/* Header */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Checkbox for checklist selection */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleSelect?.(!isSelected)
          }}
          className={`
            w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
            ${isSelected
              ? 'bg-amber-500 border-amber-500 text-white'
              : 'border-stone-300 dark:border-stone-600 hover:border-amber-400 dark:hover:border-amber-500'
            }
          `}
        >
          {isSelected && <Check className="w-3 h-3" />}
        </button>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-stone-900 dark:text-stone-100">
            {regel.titel}
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
            {regel.beschrijving}
          </p>
        </div>

        {/* Expand indicator */}
        <ChevronDown className={`
          w-5 h-5 text-stone-400 transition-transform flex-shrink-0
          ${isExpanded ? 'rotate-180' : ''}
        `} />
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 space-y-4 border-t border-stone-100 dark:border-stone-800">
          {/* Description */}
          <p className="text-sm text-stone-600 dark:text-stone-400 pt-4">
            {regel.beschrijving}
          </p>

          {/* Examples */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Good example */}
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wider">
                  Goed
                </span>
              </div>
              <p className="text-sm text-green-800 dark:text-green-300 italic">
                &ldquo;{regel.voorbeeldGoed}&rdquo;
              </p>
            </div>

            {/* Bad example */}
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                  <X className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wider">
                  Fout
                </span>
              </div>
              <p className="text-sm text-red-800 dark:text-red-300 italic line-through decoration-red-400/50">
                &ldquo;{regel.voorbeeldFout}&rdquo;
              </p>
            </div>
          </div>

          {/* Explanation */}
          <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50">
            <p className="text-sm text-stone-600 dark:text-stone-400">
              <span className="font-medium text-stone-700 dark:text-stone-300">Toelichting: </span>
              {regel.toelichting}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

interface StijlregelAccordeonProps {
  categorie: StijlregelCategorie
  regels: Stijlregel[]
  selectedRegels: Set<string>
  onToggleRegel: (regelId: string, selected: boolean) => void
  defaultOpen?: boolean
}

export function StijlregelAccordeon({
  categorie,
  regels,
  selectedRegels,
  onToggleRegel,
  defaultOpen = false,
}: StijlregelAccordeonProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const selectedCount = regels.filter((r) => selectedRegels.has(r.id)).length

  return (
    <div className="border border-stone-200 dark:border-stone-700 rounded-xl overflow-hidden">
      {/* Accordeon header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 p-4 bg-stone-50 dark:bg-stone-800/50 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
      >
        <ChevronDown className={`
          w-5 h-5 text-stone-500 transition-transform flex-shrink-0
          ${isOpen ? 'rotate-180' : ''}
        `} />

        <div className="flex-1 text-left">
          <h3 className="font-semibold text-stone-900 dark:text-stone-100">
            {categorie.naam}
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {categorie.beschrijving}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm text-stone-500 dark:text-stone-400">
            {regels.length} regels
          </span>
          {selectedCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-amber-500 text-white rounded-full">
              {selectedCount} geselecteerd
            </span>
          )}
        </div>
      </button>

      {/* Accordeon content */}
      {isOpen && (
        <div className="p-4 space-y-3 bg-white dark:bg-stone-900">
          {regels.map((regel) => (
            <StijlregelCard
              key={regel.id}
              regel={regel}
              isSelected={selectedRegels.has(regel.id)}
              onToggleSelect={(selected) => onToggleRegel(regel.id, selected)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
