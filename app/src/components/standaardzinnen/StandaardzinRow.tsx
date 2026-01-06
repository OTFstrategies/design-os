'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Copy, FileInput, FileText } from 'lucide-react'
import type { Standaardzin, Categorie } from './types'
import { TagChip } from './TagChip'

interface StandaardzinRowProps {
  zin: Standaardzin
  categorie?: Categorie
  onCopy?: (includeCode?: boolean) => void
  onInsert?: () => void
  onView?: () => void
}

function HighlightedText({ tekst }: { tekst: string }) {
  const parts = tekst.split(/(\[[^\]]+\])/)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('[') && part.endsWith(']')) {
          return (
            <span
              key={i}
              className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 px-1 rounded font-medium"
            >
              {part}
            </span>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

export function StandaardzinRow({ zin, categorie, onCopy, onInsert, onView }: StandaardzinRowProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border-b border-stone-200 dark:border-stone-700 last:border-b-0">
      {/* Main row */}
      <div
        className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer group"
        onClick={() => setExpanded(!expanded)}
      >
        <button className="text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300">
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <code className="font-mono text-xs text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded min-w-[100px]">
          {zin.code}
        </code>

        <p className="flex-1 text-stone-900 dark:text-stone-100">
          <HighlightedText tekst={zin.tekst} />
        </p>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {zin.tags.slice(0, 2).map(tag => (
            <TagChip key={tag} tag={tag} />
          ))}
          {zin.tags.length > 2 && (
            <span className="text-xs text-stone-400 dark:text-stone-500">+{zin.tags.length - 2}</span>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onCopy?.() }}
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 rounded transition-colors"
            title="Kopieer"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onInsert?.() }}
            className="p-1.5 text-stone-400 hover:text-amber-600 dark:text-stone-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded transition-colors"
            title="Invoegen"
          >
            <FileInput className="w-4 h-4" />
          </button>
        </div>

        {zin.gebruiktIn.length > 0 && (
          <span className="text-xs text-stone-400 dark:text-stone-500 flex items-center gap-1 flex-shrink-0">
            <FileText className="w-3 h-3" />
            {zin.gebruiktIn.length}
          </span>
        )}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 py-3 bg-stone-50 dark:bg-stone-800/30 border-t border-stone-100 dark:border-stone-800">
          <div className="pl-7 space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {zin.tags.map(tag => (
                <TagChip key={tag} tag={tag} size="md" />
              ))}
            </div>

            {categorie && (
              <p className="text-sm text-stone-500 dark:text-stone-400">
                <span className="font-medium text-stone-700 dark:text-stone-300">Categorie:</span> {categorie.naam}
              </p>
            )}

            {zin.placeholders.length > 0 && (
              <div className="text-sm">
                <span className="font-medium text-stone-700 dark:text-stone-300">Placeholders:</span>
                <span className="ml-2 text-stone-500 dark:text-stone-400">{zin.placeholders.join(', ')}</span>
              </div>
            )}

            <p className="text-xs text-stone-400 dark:text-stone-500">
              Laatst gewijzigd: {new Date(zin.laatstGewijzigd).toLocaleDateString('nl-NL')}
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => onCopy?.()}
                className="px-3 py-1.5 text-sm font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
              >
                Kopieer
              </button>
              <button
                onClick={() => onInsert?.()}
                className="px-3 py-1.5 text-sm font-medium text-white bg-stone-800 dark:bg-stone-100 dark:text-stone-900 rounded hover:bg-stone-700 dark:hover:bg-stone-200 transition-colors"
              >
                Invoegen
              </button>
              <button
                onClick={() => onView?.()}
                className="px-3 py-1.5 text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
              >
                Bekijk details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
