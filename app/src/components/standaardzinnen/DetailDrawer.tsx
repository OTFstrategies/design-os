'use client'

import { X, Copy, FileInput, FileText, Calendar, Tag as TagIcon } from 'lucide-react'
import type { Standaardzin, AtomairSequentie, Categorie, DocumentRef } from './types'
import { TagChip } from './TagChip'

interface DetailDrawerProps {
  item: Standaardzin | AtomairSequentie | null
  type: 'zin' | 'sequentie' | null
  categorieen: Categorie[]
  documenten: DocumentRef[]
  standaardzinnen?: Standaardzin[]
  onClose: () => void
  onCopy?: () => void
  onInsert?: () => void
  onEdit?: () => void
}

export function DetailDrawer({
  item,
  type,
  categorieen,
  documenten,
  standaardzinnen = [],
  onClose,
  onCopy,
  onInsert,
}: DetailDrawerProps) {
  if (!item || !type) return null

  const isZin = type === 'zin'
  const zin = isZin ? (item as Standaardzin) : null
  const sequentie = !isZin ? (item as AtomairSequentie) : null

  const categorie = zin ? categorieen.find(c => c.code === zin.categorieCode) : null
  const gebruikteDocumenten = documenten.filter(d =>
    (zin?.gebruiktIn || sequentie?.gebruiktIn || []).includes(d.code)
  )

  const getZinTekst = (code: string) => {
    const foundZin = standaardzinnen.find(z => z.code === code)
    return foundZin?.tekst || code
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-stone-900 shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-700">
          <div>
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              {isZin ? 'Standaardzin' : 'Atomaire Sequentie'}
            </p>
            <code className="font-mono text-sm text-stone-700 dark:text-stone-300">
              {item.code}
            </code>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Main text/name */}
          <div>
            <h2 className="text-lg font-medium text-stone-900 dark:text-stone-100">
              {isZin ? zin?.tekst : sequentie?.naam}
            </h2>
          </div>

          {/* Sequentie steps */}
          {sequentie && (
            <div>
              <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-3 flex items-center gap-2">
                <span>Stappen</span>
                {sequentie.volgordeVerplicht && (
                  <span className="text-xs bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded">
                    volgorde verplicht
                  </span>
                )}
              </h3>
              <div className="space-y-2">
                {sequentie.stappen.map((stap) => (
                  <div
                    key={stap.standaardzinCode}
                    className="flex items-start gap-3 p-3 bg-stone-50 dark:bg-stone-800 rounded-lg"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-400 text-sm font-medium flex items-center justify-center">
                      {stap.volgorde}
                    </span>
                    <div>
                      <code className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                        {stap.standaardzinCode}
                      </code>
                      <p className="text-sm text-stone-700 dark:text-stone-300 mt-0.5">
                        {getZinTekst(stap.standaardzinCode)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags (for zin) */}
          {zin && zin.tags.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-2">
                <TagIcon className="w-4 h-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {zin.tags.map(tag => (
                  <TagChip key={tag} tag={tag} size="md" />
                ))}
              </div>
            </div>
          )}

          {/* Category (for zin) */}
          {categorie && (
            <div>
              <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
                Categorie
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                <span className="font-mono text-xs bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded mr-2">
                  {categorie.code}
                </span>
                {categorie.naam}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-500 mt-1">
                {categorie.beschrijving}
              </p>
            </div>
          )}

          {/* Placeholders (for zin) */}
          {zin && zin.placeholders.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                Placeholders
              </h3>
              <div className="flex flex-wrap gap-2">
                {zin.placeholders.map(ph => (
                  <span
                    key={ph}
                    className="font-mono text-sm bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 px-2 py-1 rounded"
                  >
                    {ph}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Used in documents */}
          <div>
            <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Gebruikt in ({gebruikteDocumenten.length} documenten)
            </h3>
            {gebruikteDocumenten.length > 0 ? (
              <div className="space-y-2">
                {gebruikteDocumenten.map(doc => (
                  <div
                    key={doc.code}
                    className="flex items-center gap-3 p-2 bg-stone-50 dark:bg-stone-800 rounded"
                  >
                    <span className="text-xs font-medium text-stone-500 dark:text-stone-400 bg-stone-200 dark:bg-stone-700 px-1.5 py-0.5 rounded">
                      {doc.niveau}
                    </span>
                    <div className="flex-1 min-w-0">
                      <code className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                        {doc.code}
                      </code>
                      <p className="text-sm text-stone-700 dark:text-stone-300 truncate">
                        {doc.titel}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-500 dark:text-stone-400 italic">
                Nog niet gebruikt in documenten
              </p>
            )}
          </div>

          {/* Metadata */}
          {zin && (
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <Calendar className="w-3.5 h-3.5" />
              Laatst gewijzigd: {new Date(zin.laatstGewijzigd).toLocaleDateString('nl-NL')}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-700 flex items-center gap-3">
          <button
            onClick={onCopy}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
          >
            <Copy className="w-4 h-4" />
            Kopieer
          </button>
          <button
            onClick={onInsert}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-stone-800 dark:bg-stone-100 dark:text-stone-900 rounded-lg hover:bg-stone-700 dark:hover:bg-stone-200 transition-colors"
          >
            <FileInput className="w-4 h-4" />
            Invoegen
          </button>
        </div>
      </div>
    </>
  )
}
