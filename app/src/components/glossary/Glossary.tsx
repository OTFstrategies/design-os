'use client'

import { useState, useMemo } from 'react'
import { Search, BookOpen, FileText, Layers, Library } from 'lucide-react'
import type { GlossaryProps } from './types'
import { StandaardzinnenBibliotheek } from '../standaardzinnen'
import { TerminologieTab } from '../schrijfstandaard/TerminologieTab'
import { StijlregelsTab } from '../schrijfstandaard/StijlregelsTab'
import { DocumentstructuurTab } from '../schrijfstandaard/DocumentstructuurTab'

type Tab = 'standaardzinnen' | 'terminologie' | 'stijlregels' | 'documentstructuur'

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'standaardzinnen', label: 'Standaardzinnen', icon: <Library className="w-4 h-4" /> },
  { id: 'terminologie', label: 'Terminologie', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'stijlregels', label: 'Stijlregels', icon: <FileText className="w-4 h-4" /> },
  { id: 'documentstructuur', label: 'Document Structuur', icon: <Layers className="w-4 h-4" /> },
]

interface SearchResult {
  type: 'standaardzin' | 'terminologie' | 'stijlregel'
  id: string
  title: string
  description: string
  tab: Tab
}

export function Glossary({
  // Standaardzinnen data
  standaardzinnen,
  atomaireSequenties,
  categorieen,
  tags,
  placeholders,
  documenten,

  // Terminologie/stijlregels/documentstructuur data
  terminologie,
  stijlregels,
  stijlregelCategorieen,
  documentNiveaus,
  documentTypes,
  rollen,
  raciMatrix,
  coderingFormaat,

  // Standaardzinnen callbacks
  onCopyZin,
  onInsertZin,
  onViewZin,
  onEditZin,
  onCopySequentie,
  onInsertSequentie,
  onViewSequentie,

  // Terminologie callbacks
  onSearchTerminologie,
  onCopyTerm,
  onProposeTerm,

  // Stijlregels callbacks
  onGenerateChecklist,

  // Documentstructuur callbacks
  onSelectNiveau,
  onViewTemplate,
  onGenerateCode,
}: GlossaryProps) {
  const [activeTab, setActiveTab] = useState<Tab>('standaardzinnen')
  const [globalSearch, setGlobalSearch] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Global search results
  const searchResults = useMemo<SearchResult[]>(() => {
    if (!globalSearch.trim() || globalSearch.length < 2) return []

    const term = globalSearch.toLowerCase()
    const results: SearchResult[] = []

    // Search standaardzinnen
    standaardzinnen.forEach(zin => {
      if (zin.tekst.toLowerCase().includes(term) || zin.code.toLowerCase().includes(term)) {
        results.push({
          type: 'standaardzin',
          id: zin.id,
          title: zin.code,
          description: zin.tekst.substring(0, 100) + (zin.tekst.length > 100 ? '...' : ''),
          tab: 'standaardzinnen',
        })
      }
    })

    // Search terminologie
    terminologie.forEach(term => {
      if (
        term.voorkeursterm.toLowerCase().includes(globalSearch.toLowerCase()) ||
        term.definitie.toLowerCase().includes(globalSearch.toLowerCase()) ||
        term.verbodenSynoniemen.some(s => s.toLowerCase().includes(globalSearch.toLowerCase()))
      ) {
        results.push({
          type: 'terminologie',
          id: term.id,
          title: term.voorkeursterm,
          description: term.definitie.substring(0, 100) + (term.definitie.length > 100 ? '...' : ''),
          tab: 'terminologie',
        })
      }
    })

    // Search stijlregels
    stijlregels.forEach(regel => {
      if (
        regel.titel.toLowerCase().includes(globalSearch.toLowerCase()) ||
        regel.beschrijving.toLowerCase().includes(globalSearch.toLowerCase())
      ) {
        results.push({
          type: 'stijlregel',
          id: regel.id,
          title: regel.titel,
          description: regel.beschrijving.substring(0, 100) + (regel.beschrijving.length > 100 ? '...' : ''),
          tab: 'stijlregels',
        })
      }
    })

    return results.slice(0, 10) // Limit to 10 results
  }, [globalSearch, standaardzinnen, terminologie, stijlregels])

  const handleSearchResultClick = (result: SearchResult) => {
    setActiveTab(result.tab)
    setGlobalSearch('')
    setShowSearchResults(false)
    // TODO: Scroll to or highlight the item
  }

  return (
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950">
      {/* Global search bar */}
      <div className="flex-shrink-0 px-6 py-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="text"
            placeholder="Zoek in alle onderdelen..."
            value={globalSearch}
            onChange={(e) => {
              setGlobalSearch(e.target.value)
              setShowSearchResults(e.target.value.length >= 2)
            }}
            onFocus={() => setShowSearchResults(globalSearch.length >= 2)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />

          {/* Search results dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}-${index}`}
                  onClick={() => handleSearchResultClick(result)}
                  className="w-full px-4 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-700 border-b border-stone-100 dark:border-stone-700 last:border-b-0"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      result.type === 'standaardzin'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        : result.type === 'terminologie'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    }`}>
                      {result.type === 'standaardzin' ? 'Standaardzin' : result.type === 'terminologie' ? 'Term' : 'Stijlregel'}
                    </span>
                    <span className="font-medium text-stone-900 dark:text-stone-100">
                      {result.title}
                    </span>
                  </div>
                  <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-1">
                    {result.description}
                  </p>
                </button>
              ))}
            </div>
          )}

          {showSearchResults && globalSearch.length >= 2 && searchResults.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg shadow-lg z-50 p-4 text-center text-stone-500 dark:text-stone-400">
              Geen resultaten gevonden
            </div>
          )}
        </div>
      </div>

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
        {activeTab === 'standaardzinnen' && (
          <StandaardzinnenBibliotheek
            standaardzinnen={standaardzinnen}
            atomaireSequenties={atomaireSequenties}
            categorieen={categorieen}
            tags={tags}
            placeholders={placeholders}
            documenten={documenten}
            onCopy={onCopyZin}
            onInsert={onInsertZin}
            onView={onViewZin}
            onEdit={onEditZin}
            onCopySequentie={onCopySequentie}
            onInsertSequentie={onInsertSequentie}
            onViewSequentie={onViewSequentie}
          />
        )}

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
