import { useState } from 'react'
import type { VersiebeheerProps, VersieRecord } from '@/../product/sections/proceshuisbeheer/types'

export function VersiebeheerTab({
  versieHistorie,
  documenten,
  onViewHistory,
  onCompare,
  onRevert,
}: VersiebeheerProps) {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(
    versieHistorie.length > 0 ? versieHistorie[0].documentId : null
  )
  const [compareMode, setCompareMode] = useState(false)
  const [selectedVersions, setSelectedVersions] = useState<string[]>([])

  const selectedHistory = versieHistorie.find((h) => h.documentId === selectedDocId)
  const selectedDoc = documenten.find((d) => d.id === selectedDocId)

  const handleVersionSelect = (versie: string) => {
    if (compareMode) {
      setSelectedVersions((prev) => {
        if (prev.includes(versie)) {
          return prev.filter((v) => v !== versie)
        }
        if (prev.length < 2) {
          return [...prev, versie]
        }
        return [prev[1], versie]
      })
    }
  }

  const handleCompare = () => {
    if (selectedDocId && selectedVersions.length === 2) {
      onCompare?.(selectedDocId, selectedVersions[0], selectedVersions[1])
    }
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document selector */}
        <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
          <div className="p-4 border-b border-stone-200 dark:border-stone-700">
            <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300">
              Document selecteren
            </h3>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {versieHistorie.map((history) => {
              const doc = documenten.find((d) => d.id === history.documentId)
              const isSelected = history.documentId === selectedDocId

              return (
                <button
                  key={history.documentId}
                  onClick={() => {
                    setSelectedDocId(history.documentId)
                    setSelectedVersions([])
                    onViewHistory?.(history.documentId)
                  }}
                  className={`
                    w-full text-left px-4 py-3 border-b border-stone-100 dark:border-stone-700/50 transition-colors
                    ${isSelected
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-l-2 border-l-amber-500'
                      : 'hover:bg-stone-50 dark:hover:bg-stone-700/30'
                    }
                  `}
                >
                  <div className="font-mono text-xs text-stone-400 mb-1">
                    {history.documentCode}
                  </div>
                  <div className="text-sm font-medium text-stone-900 dark:text-stone-100">
                    {doc?.titel || 'Onbekend document'}
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    {history.versies.length} versie(s)
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Version timeline */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
          <div className="p-4 border-b border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Versiehistorie
              </h3>
              {selectedDoc && (
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  {selectedDoc.code} - {selectedDoc.titel}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCompareMode(!compareMode)
                  setSelectedVersions([])
                }}
                className={`
                  px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
                  ${compareMode
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                    : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-600'
                  }
                `}
              >
                {compareMode ? 'Vergelijkmodus aan' : 'Vergelijken'}
              </button>
              {compareMode && selectedVersions.length === 2 && (
                <button
                  onClick={handleCompare}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                >
                  Vergelijk v{selectedVersions[0]} ↔ v{selectedVersions[1]}
                </button>
              )}
            </div>
          </div>

          {selectedHistory ? (
            <div className="p-4">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-stone-200 dark:bg-stone-700" />

                {/* Version entries */}
                <div className="space-y-4">
                  {selectedHistory.versies.map((versie, index) => (
                    <VersionEntry
                      key={versie.versie}
                      versie={versie}
                      isLatest={index === 0}
                      isSelected={selectedVersions.includes(versie.versie)}
                      compareMode={compareMode}
                      onSelect={() => handleVersionSelect(versie.versie)}
                      onRevert={() => onRevert?.(selectedDocId!, versie.versie)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-stone-500 dark:text-stone-400">
              Selecteer een document om de versiehistorie te bekijken.
            </div>
          )}
        </div>
      </div>

      {/* Compare view placeholder */}
      {compareMode && selectedVersions.length === 2 && (
        <div className="mt-6 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
          <div className="p-4 border-b border-stone-200 dark:border-stone-700">
            <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300">
              Versie vergelijking
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <div className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">
                  Versie {selectedVersions[0]} (oud)
                </div>
                <div className="text-sm text-stone-600 dark:text-stone-300 font-mono">
                  <div className="line-through opacity-60">- Stap 3: Oude instructie tekst</div>
                  <div className="line-through opacity-60">- Veiligheidsnorm: VCA 2017</div>
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <div className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">
                  Versie {selectedVersions[1]} (nieuw)
                </div>
                <div className="text-sm text-stone-600 dark:text-stone-300 font-mono">
                  <div>+ Stap 3: Nieuwe instructie tekst met meer detail</div>
                  <div>+ Veiligheidsnorm: VCA 2023</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface VersionEntryProps {
  versie: VersieRecord
  isLatest: boolean
  isSelected: boolean
  compareMode: boolean
  onSelect: () => void
  onRevert: () => void
}

function VersionEntry({
  versie,
  isLatest,
  isSelected,
  compareMode,
  onSelect,
  onRevert,
}: VersionEntryProps) {
  return (
    <div
      className={`
        relative pl-10 py-3 pr-4 rounded-lg transition-colors
        ${isSelected ? 'bg-amber-50 dark:bg-amber-900/20' : 'hover:bg-stone-50 dark:hover:bg-stone-700/30'}
        ${compareMode ? 'cursor-pointer' : ''}
      `}
      onClick={compareMode ? onSelect : undefined}
    >
      {/* Timeline dot */}
      <div
        className={`
          absolute left-[7px] top-[18px] w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center
          ${isLatest
            ? 'bg-green-500 border-green-500 text-white'
            : versie.status === 'superseded'
            ? 'bg-stone-100 dark:bg-stone-700 border-stone-300 dark:border-stone-600'
            : 'bg-white dark:bg-stone-800 border-amber-400'
          }
          ${isSelected ? 'ring-2 ring-amber-400 ring-offset-2 dark:ring-offset-stone-800' : ''}
        `}
      >
        {isLatest && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm font-bold text-stone-900 dark:text-stone-100">
              v{versie.versie}
            </span>
            {isLatest && (
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                Huidige versie
              </span>
            )}
            {versie.status === 'superseded' && (
              <span className="text-xs bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400 px-2 py-0.5 rounded-full">
                Vervangen
              </span>
            )}
            {compareMode && (
              <span className="text-xs text-amber-600 dark:text-amber-400">
                {isSelected ? '✓ Geselecteerd' : 'Klik om te selecteren'}
              </span>
            )}
          </div>
          <div className="text-sm text-stone-600 dark:text-stone-300 mb-2">
            {versie.wijzigingen}
          </div>
          <div className="flex items-center gap-4 text-xs text-stone-400">
            <span>{versie.datum}</span>
            <span>Door: {versie.auteur}</span>
          </div>
        </div>

        {/* Actions */}
        {!isLatest && !compareMode && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRevert()
            }}
            className="text-xs text-stone-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            Terugdraaien
          </button>
        )}
      </div>
    </div>
  )
}
