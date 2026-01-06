'use client'

import { useState, useMemo } from 'react'
import { Search, Plus, BookOpen } from 'lucide-react'
import type { TerminologieTabProps } from './types'
import { TermRow } from './TermRow'

export function TerminologieTab({
  terminologie,
  onSearch,
  onCopy,
  onPropose,
}: TerminologieTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategorie, setFilterCategorie] = useState<string | null>(null)

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(terminologie.map((t) => t.categorie))
    return Array.from(cats).sort()
  }, [terminologie])

  // Filter terminology
  const filteredTerminologie = useMemo(() => {
    return terminologie.filter((term) => {
      // Category filter
      if (filterCategorie && term.categorie !== filterCategorie) {
        return false
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesVoorkeursterm = term.voorkeursterm.toLowerCase().includes(query)
        const matchesSynoniem = term.verbodenSynoniemen.some((s) =>
          s.toLowerCase().includes(query)
        )
        const matchesDefinitie = term.definitie.toLowerCase().includes(query)
        return matchesVoorkeursterm || matchesSynoniem || matchesDefinitie
      }
      return true
    })
  }, [terminologie, searchQuery, filterCategorie])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with search */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              placeholder="Zoek op term of synoniem..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Category filter */}
          <select
            value={filterCategorie || ''}
            onChange={(e) => setFilterCategorie(e.target.value || null)}
            className="px-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
          >
            <option value="">Alle categorieën</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          {/* Propose term button */}
          <button
            onClick={onPropose}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Term voorstellen</span>
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="flex-shrink-0 px-6 py-2 bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-700">
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {filteredTerminologie.length} van {terminologie.length} termen
          {searchQuery && (
            <span className="ml-2">
              voor &ldquo;<span className="font-medium text-stone-700 dark:text-stone-300">{searchQuery}</span>&rdquo;
            </span>
          )}
        </p>
      </div>

      {/* Terminology list */}
      <div className="flex-1 overflow-y-auto">
        {filteredTerminologie.length > 0 ? (
          <div className="bg-white dark:bg-stone-900">
            {filteredTerminologie.map((term) => (
              <TermRow
                key={term.id}
                term={term}
                searchQuery={searchQuery}
                onCopy={() => onCopy?.(term.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-stone-400" />
            </div>
            <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100 mb-2">
              Geen termen gevonden
            </h3>
            <p className="text-stone-500 dark:text-stone-400 max-w-sm mb-4">
              {searchQuery
                ? `Geen resultaten voor "${searchQuery}". Probeer een andere zoekterm.`
                : 'Er zijn nog geen termen in deze categorie.'}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  onSearch?.('')
                }}
                className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium"
              >
                Zoekopdracht wissen
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
