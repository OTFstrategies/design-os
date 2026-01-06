'use client'

import { ChevronRight, FileText, Users, Layers } from 'lucide-react'
import type { DocumentNiveau, DocumentType } from './types'

interface NiveauCardProps {
  niveau: DocumentNiveau
  documentTypes: DocumentType[]
  isSelected?: boolean
  onSelect?: () => void
  onViewTemplate?: () => void
}

const niveauKleuren: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    border: 'border-indigo-200 dark:border-indigo-800',
    text: 'text-indigo-700 dark:text-indigo-300',
    badge: 'bg-indigo-500',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
    text: 'text-purple-700 dark:text-purple-300',
    badge: 'bg-purple-500',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-300',
    badge: 'bg-blue-500',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-700 dark:text-green-300',
    badge: 'bg-green-500',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
    badge: 'bg-amber-500',
  },
}

export function NiveauCard({
  niveau,
  documentTypes,
  isSelected,
  onSelect,
  onViewTemplate,
}: NiveauCardProps) {
  const kleuren = niveauKleuren[niveau.kleur] || niveauKleuren.amber
  const types = documentTypes.filter((t) => t.niveau === niveau.code)

  return (
    <div
      className={`
        rounded-xl border-2 transition-all cursor-pointer
        ${isSelected
          ? `${kleuren.bg} ${kleuren.border}`
          : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 bg-white dark:bg-stone-900'
        }
      `}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="p-4 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-start gap-3">
          {/* Level badge */}
          <div className={`
            w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg
            ${kleuren.badge}
          `}>
            {niveau.code}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-stone-900 dark:text-stone-100">
              {niveau.naam}
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
              {niveau.beschrijving}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Doelgroep */}
        <div className="flex items-start gap-2">
          <Users className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              Doelgroep
            </span>
            <p className="text-sm text-stone-700 dark:text-stone-300">
              {niveau.doelgroep}
            </p>
          </div>
        </div>

        {/* Document types */}
        {types.length > 0 && (
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                Documenttypes
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {types.map((type) => (
                  <span
                    key={type.id}
                    className={`
                      px-2 py-0.5 text-xs font-medium rounded
                      ${kleuren.bg} ${kleuren.text}
                    `}
                  >
                    {type.code}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Template sections */}
        <div className="flex items-start gap-2">
          <Layers className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              Template secties
            </span>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-0.5">
              {niveau.templateSecties.join(' • ')}
            </p>
          </div>
        </div>

        {/* Voorbeelden */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            Voorbeelden
          </span>
          <div className="flex flex-wrap gap-2 mt-2">
            {niveau.voorbeelden.map((vb) => (
              <span
                key={vb}
                className="px-2 py-1 text-xs bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded"
              >
                {vb}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* View template button */}
      <div className="px-4 pb-4">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onViewTemplate?.()
          }}
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg
            font-medium text-sm transition-colors
            ${isSelected
              ? `${kleuren.bg} ${kleuren.text} hover:opacity-80`
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
            }
          `}
        >
          Template bekijken
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
