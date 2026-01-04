import { useState } from 'react'
import { ChevronDown, ChevronRight, Copy, Ban, Check } from 'lucide-react'
import type { Terminologie } from '@/../product/sections/schrijfstandaard-structuur/types'

interface TermRowProps {
  term: Terminologie
  searchQuery?: string
  onCopy?: () => void
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-amber-200 dark:bg-amber-800 text-inherit rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

export function TermRow({ term, searchQuery = '', onCopy }: TermRowProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(term.voorkeursterm)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    onCopy?.()
  }

  const categorieKleur: Record<string, string> = {
    apparatuur: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    infrastructuur: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    materiaal: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    locatie: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
    systeem: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
    rollen: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  }

  return (
    <div className="border-b border-stone-200 dark:border-stone-700 last:border-b-0">
      {/* Main row */}
      <div
        className={`
          flex items-center gap-4 px-4 py-3 cursor-pointer
          hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors
          ${isExpanded ? 'bg-stone-50 dark:bg-stone-800/50' : ''}
        `}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Expand indicator */}
        <button className="p-1 text-stone-400 dark:text-stone-500">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {/* Voorkeursterm */}
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-stone-900 dark:text-stone-100">
            {highlightMatch(term.voorkeursterm, searchQuery)}
          </span>
        </div>

        {/* Verboden synoniemen */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0 max-w-xs">
          <Ban className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
          <span className="text-sm text-stone-500 dark:text-stone-400 truncate">
            {term.verbodenSynoniemen.slice(0, 3).map((syn, i) => (
              <span key={syn}>
                {i > 0 && ', '}
                <span className="line-through decoration-red-400/50">
                  {highlightMatch(syn, searchQuery)}
                </span>
              </span>
            ))}
            {term.verbodenSynoniemen.length > 3 && (
              <span className="text-stone-400"> +{term.verbodenSynoniemen.length - 3}</span>
            )}
          </span>
        </div>

        {/* Categorie badge */}
        <span className={`
          hidden sm:inline-flex px-2 py-0.5 text-xs font-medium rounded-full
          ${categorieKleur[term.categorie] || 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300'}
        `}>
          {term.categorie}
        </span>

        {/* Copy button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleCopy()
          }}
          className={`
            p-2 rounded-lg transition-all flex-shrink-0
            ${copied
              ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400'
              : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
            }
          `}
          title="Kopieer term"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 pl-12 space-y-4 bg-stone-50/50 dark:bg-stone-800/30">
          {/* Definitie */}
          <div>
            <h4 className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
              Definitie
            </h4>
            <p className="text-sm text-stone-700 dark:text-stone-300">
              {term.definitie}
            </p>
          </div>

          {/* Context */}
          <div>
            <h4 className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
              Context
            </h4>
            <p className="text-sm text-stone-600 dark:text-stone-400 italic">
              {term.context}
            </p>
          </div>

          {/* Verboden synoniemen (full list on mobile) */}
          <div>
            <h4 className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Ban className="w-3 h-3 text-red-400" />
              Verboden synoniemen
            </h4>
            <div className="flex flex-wrap gap-2">
              {term.verbodenSynoniemen.map((syn) => (
                <span
                  key={syn}
                  className="px-2 py-1 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded line-through decoration-red-400/50"
                >
                  {syn}
                </span>
              ))}
            </div>
          </div>

          {/* Voorbeelden */}
          <div>
            <h4 className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
              Voorbeelden
            </h4>
            <ul className="space-y-1">
              {term.voorbeelden.map((vb, i) => (
                <li key={i} className="text-sm text-stone-600 dark:text-stone-400 flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">-</span>
                  <span className="italic">{vb}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
