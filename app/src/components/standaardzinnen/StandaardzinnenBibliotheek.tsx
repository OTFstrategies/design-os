'use client'

import { useState, useMemo } from 'react'
import { Library } from 'lucide-react'
import type {
  StandaardzinnenBibliotheekProps,
  FilterState,
  Standaardzin,
  AtomairSequentie,
} from './types'
import { FilterSidebar } from './FilterSidebar'
import { StandaardzinRow } from './StandaardzinRow'
import { SequentieCard } from './SequentieCard'
import { DetailDrawer } from './DetailDrawer'

export function StandaardzinnenBibliotheek({
  standaardzinnen,
  atomaireSequenties,
  categorieen,
  tags,
  placeholders,
  documenten,
  onCopy,
  onInsert,
  onView,
  onEdit,
  onCopySequentie,
  onInsertSequentie,
  onViewSequentie,
}: StandaardzinnenBibliotheekProps) {
  const [filters, setFilters] = useState<FilterState>({
    zoekterm: '',
    categorie: null,
    tags: [],
    type: 'alle',
    placeholder: null,
  })

  const [selectedItem, setSelectedItem] = useState<{
    item: Standaardzin | AtomairSequentie
    type: 'zin' | 'sequentie'
  } | null>(null)

  // Filter logic
  const filteredZinnen = useMemo(() => {
    if (filters.type === 'sequenties') return []

    return standaardzinnen.filter(zin => {
      if (filters.zoekterm) {
        const term = filters.zoekterm.toLowerCase()
        if (!zin.tekst.toLowerCase().includes(term) && !zin.code.toLowerCase().includes(term)) {
          return false
        }
      }
      if (filters.categorie && zin.categorieCode !== filters.categorie) {
        return false
      }
      if (filters.tags.length > 0 && !filters.tags.some(t => zin.tags.includes(t))) {
        return false
      }
      if (filters.placeholder && !zin.placeholders.includes(filters.placeholder)) {
        return false
      }
      return true
    })
  }, [standaardzinnen, filters])

  const filteredSequenties = useMemo(() => {
    if (filters.type === 'zinnen') return []

    return atomaireSequenties.filter(seq => {
      if (filters.zoekterm) {
        const term = filters.zoekterm.toLowerCase()
        if (!seq.naam.toLowerCase().includes(term) && !seq.code.toLowerCase().includes(term)) {
          return false
        }
      }
      return true
    })
  }, [atomaireSequenties, filters])

  const handleViewZin = (id: string) => {
    const zin = standaardzinnen.find(z => z.id === id)
    if (zin) {
      setSelectedItem({ item: zin, type: 'zin' })
      onView?.(id)
    }
  }

  const handleViewSequentie = (id: string) => {
    const seq = atomaireSequenties.find(s => s.id === id)
    if (seq) {
      setSelectedItem({ item: seq, type: 'sequentie' })
      onViewSequentie?.(id)
    }
  }

  const showZinnen = filters.type === 'alle' || filters.type === 'zinnen'
  const showSequenties = filters.type === 'alle' || filters.type === 'sequenties'

  return (
    <div className="flex h-full">
      {/* Filter Sidebar */}
      <FilterSidebar
        filters={filters}
        categorieen={categorieen}
        tags={tags}
        placeholders={placeholders}
        onFilterChange={setFilters}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-6 py-4 border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Library className="w-5 h-5 text-amber-500" />
              <h1 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                Standaardzinnen Bibliotheek
              </h1>
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {filteredZinnen.length} zinnen
              {showSequenties && ` • ${filteredSequenties.length} sequenties`}
            </p>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Sequenties section */}
          {showSequenties && filteredSequenties.length > 0 && (
            <section className="p-6 border-b border-stone-200 dark:border-stone-700">
              <h2 className="text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-4">
                Atomaire Sequenties
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSequenties.map(seq => (
                  <SequentieCard
                    key={seq.id}
                    sequentie={seq}
                    standaardzinnen={standaardzinnen}
                    onCopy={() => onCopySequentie?.(seq.id)}
                    onInsert={() => onInsertSequentie?.(seq.id)}
                    onView={() => handleViewSequentie(seq.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Standaardzinnen table */}
          {showZinnen && (
            <section className="bg-white dark:bg-stone-900">
              {filteredSequenties.length > 0 && showSequenties && (
                <h2 className="px-6 pt-6 pb-2 text-sm font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Standaardzinnen
                </h2>
              )}
              <div className="divide-y divide-stone-200 dark:divide-stone-700">
                {filteredZinnen.map(zin => (
                  <StandaardzinRow
                    key={zin.id}
                    zin={zin}
                    categorie={categorieen.find(c => c.code === zin.categorieCode)}
                    onCopy={(includeCode) => onCopy?.(zin.id, includeCode)}
                    onInsert={() => onInsert?.(zin.id)}
                    onView={() => handleViewZin(zin.id)}
                  />
                ))}
              </div>

              {filteredZinnen.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <p className="text-stone-500 dark:text-stone-400">
                    Geen standaardzinnen gevonden met de huidige filters.
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      <DetailDrawer
        item={selectedItem?.item || null}
        type={selectedItem?.type || null}
        categorieen={categorieen}
        documenten={documenten}
        standaardzinnen={standaardzinnen}
        onClose={() => setSelectedItem(null)}
        onCopy={() => {
          if (selectedItem?.type === 'zin') {
            onCopy?.(selectedItem.item.id)
          } else if (selectedItem?.type === 'sequentie') {
            onCopySequentie?.(selectedItem.item.id)
          }
        }}
        onInsert={() => {
          if (selectedItem?.type === 'zin') {
            onInsert?.(selectedItem.item.id)
          } else if (selectedItem?.type === 'sequentie') {
            onInsertSequentie?.(selectedItem.item.id)
          }
        }}
        onEdit={() => {
          if (selectedItem?.type === 'zin') {
            onEdit?.(selectedItem.item.id)
          }
        }}
      />
    </div>
  )
}
