'use client'

import { Copy, FileInput, Layers, ArrowRight } from 'lucide-react'
import type { AtomairSequentie, Standaardzin } from './types'

interface SequentieCardProps {
  sequentie: AtomairSequentie
  standaardzinnen: Standaardzin[]
  onCopy?: () => void
  onInsert?: () => void
  onView?: () => void
}

export function SequentieCard({ sequentie, standaardzinnen, onCopy, onInsert, onView }: SequentieCardProps) {
  const getZinTekst = (code: string) => {
    const zin = standaardzinnen.find(z => z.code === code)
    return zin?.tekst || code
  }

  return (
    <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden hover:border-stone-300 dark:hover:border-stone-600 transition-colors group">
      {/* Header */}
      <div className="px-4 py-3 bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" />
            <code className="font-mono text-xs text-stone-500 dark:text-stone-400 bg-stone-200 dark:bg-stone-700 px-2 py-0.5 rounded">
              {sequentie.code}
            </code>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onCopy?.()}
              className="p-1.5 text-stone-400 hover:text-stone-600 dark:text-stone-500 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 rounded transition-colors"
              title="Kopieer"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onInsert?.()}
              className="p-1.5 text-stone-400 hover:text-amber-600 dark:text-stone-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded transition-colors"
              title="Invoegen"
            >
              <FileInput className="w-4 h-4" />
            </button>
          </div>
        </div>
        <h3 className="mt-1 font-medium text-stone-900 dark:text-stone-100">
          {sequentie.naam}
        </h3>
      </div>

      {/* Steps */}
      <div className="px-4 py-3">
        <div className="space-y-2">
          {sequentie.stappen.map((stap, index) => (
            <div key={stap.standaardzinCode} className="flex items-start gap-2">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-400 text-xs font-medium flex items-center justify-center mt-0.5">
                {stap.volgorde}
              </span>
              <p className="text-sm text-stone-700 dark:text-stone-300 flex-1">
                {getZinTekst(stap.standaardzinCode)}
              </p>
              {index < sequentie.stappen.length - 1 && (
                <ArrowRight className="w-3 h-3 text-stone-300 dark:text-stone-600 flex-shrink-0 mt-1.5 hidden sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-stone-50 dark:bg-stone-800/30 border-t border-stone-100 dark:border-stone-700/50 flex items-center justify-between">
        <span className="text-xs text-stone-500 dark:text-stone-400">
          {sequentie.stappen.length} stappen
          {sequentie.volgordeVerplicht && ' • volgorde verplicht'}
        </span>
        <button
          onClick={() => onView?.()}
          className="text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
        >
          Details
        </button>
      </div>
    </div>
  )
}
