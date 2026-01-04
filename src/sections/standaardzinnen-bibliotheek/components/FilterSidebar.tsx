import { Search, X } from 'lucide-react'
import type { Categorie, Tag, Placeholder, FilterState } from '@/../product/sections/standaardzinnen-bibliotheek/types'
import { TagChip } from './TagChip'

interface FilterSidebarProps {
  filters: FilterState
  categorieen: Categorie[]
  tags: Tag[]
  placeholders: Placeholder[]
  onFilterChange: (filters: FilterState) => void
}

export function FilterSidebar({
  filters,
  categorieen,
  tags,
  placeholders,
  onFilterChange,
}: FilterSidebarProps) {
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const toggleTag = (tagValue: string) => {
    const newTags = filters.tags.includes(tagValue)
      ? filters.tags.filter(t => t !== tagValue)
      : [...filters.tags, tagValue]
    updateFilter('tags', newTags)
  }

  const clearFilters = () => {
    onFilterChange({
      zoekterm: '',
      categorie: null,
      tags: [],
      type: 'alle',
      placeholder: null,
    })
  }

  const hasActiveFilters = filters.zoekterm || filters.categorie || filters.tags.length > 0 || filters.type !== 'alle' || filters.placeholder

  return (
    <aside className="w-64 flex-shrink-0 border-r border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/30 overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Search */}
        <div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={filters.zoekterm}
              onChange={(e) => updateFilter('zoekterm', e.target.value)}
              placeholder="Zoeken..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 dark:focus:border-amber-400 text-stone-900 dark:text-stone-100 placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Type filter */}
        <div>
          <h4 className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
            Type
          </h4>
          <div className="flex gap-1">
            {(['alle', 'zinnen', 'sequenties'] as const).map((type) => (
              <button
                key={type}
                onClick={() => updateFilter('type', type)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  filters.type === type
                    ? 'bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900'
                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-300 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-stone-700'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
            Categorie
          </h4>
          <div className="space-y-1">
            {categorieen.map((cat) => (
              <button
                key={cat.code}
                onClick={() => updateFilter('categorie', filters.categorie === cat.code ? null : cat.code)}
                className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                  filters.categorie === cat.code
                    ? 'bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900'
                    : 'text-stone-700 dark:text-stone-300 hover:bg-white dark:hover:bg-stone-800'
                }`}
              >
                <span className="font-mono text-xs opacity-60">{cat.code}</span>
                <span className="ml-2">{cat.naam}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <h4 className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
            Tags
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => {
              const fullTag = `${tag.prefix}:${tag.waarde}`
              const isActive = filters.tags.includes(fullTag)
              return (
                <button
                  key={fullTag}
                  onClick={() => toggleTag(fullTag)}
                  className={`transition-all ${isActive ? 'ring-2 ring-amber-500 ring-offset-1 dark:ring-offset-stone-900' : 'opacity-70 hover:opacity-100'}`}
                >
                  <TagChip tag={fullTag} />
                </button>
              )
            })}
          </div>
        </div>

        {/* Placeholders */}
        <div>
          <h4 className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
            Placeholder
          </h4>
          <div className="space-y-1">
            {placeholders.map((ph) => (
              <button
                key={ph.naam}
                onClick={() => updateFilter('placeholder', filters.placeholder === ph.naam ? null : ph.naam)}
                className={`w-full text-left px-3 py-1.5 text-sm rounded transition-colors font-mono ${
                  filters.placeholder === ph.naam
                    ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-white dark:hover:bg-stone-800'
                }`}
              >
                {ph.naam}
              </button>
            ))}
          </div>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 border border-stone-300 dark:border-stone-600 rounded-lg hover:bg-white dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
            Filters wissen
          </button>
        )}
      </div>
    </aside>
  )
}
