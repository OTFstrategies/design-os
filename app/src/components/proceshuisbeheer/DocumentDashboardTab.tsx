'use client'

import { useState } from 'react'
import type {
  Document,
  DocumentDashboardProps,
  DocumentStatus,
  DocumentNiveau,
  DocumentType,
} from './types'

type SortField = 'code' | 'titel' | 'status' | 'versie' | 'laatstGewijzigd' | 'eigenaar'
type SortDirection = 'asc' | 'desc'

export function DocumentDashboardTab({
  documenten,
  onFilter,
  onSort,
  onOpen,
  onChangeStatus,
}: DocumentDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all')
  const [niveauFilter, setNiveauFilter] = useState<DocumentNiveau | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all')
  const [sortField, setSortField] = useState<SortField>('laatstGewijzigd')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortField(field)
    setSortDirection(newDirection)
    onSort?.(field, newDirection)
  }

  // Client-side filtering
  const filteredDocs = documenten.filter((doc) => {
    if (searchTerm && !doc.titel.toLowerCase().includes(searchTerm.toLowerCase()) && !doc.code.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }
    if (statusFilter !== 'all' && doc.status !== statusFilter) return false
    if (niveauFilter !== 'all' && doc.niveau !== niveauFilter) return false
    if (typeFilter !== 'all' && doc.type !== typeFilter) return false
    return true
  })

  // Client-side sorting
  const sortedDocs = [...filteredDocs].sort((a, b) => {
    const aVal = a[sortField]
    const bVal = b[sortField]
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    return sortDirection === 'asc' ? comparison : -comparison
  })

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
              Zoeken
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Zoek op titel of code..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400"
              />
              <svg
                className="absolute left-3 top-2.5 w-4 h-4 text-stone-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | 'all')}
              className="w-full px-3 py-2 text-sm border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
            >
              <option value="all">Alle statussen</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="active">Active</option>
              <option value="obsolete">Obsolete</option>
            </select>
          </div>

          {/* Niveau filter */}
          <div>
            <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
              Niveau
            </label>
            <select
              value={niveauFilter}
              onChange={(e) => setNiveauFilter(e.target.value as DocumentNiveau | 'all')}
              className="w-full px-3 py-2 text-sm border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
            >
              <option value="all">Alle niveaus</option>
              <option value="N4">N4 - Werkinstructie</option>
              <option value="N5">N5 - Instructie</option>
            </select>
          </div>

          {/* Type filter */}
          <div>
            <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as DocumentType | 'all')}
              className="w-full px-3 py-2 text-sm border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
            >
              <option value="all">Alle types</option>
              <option value="WI">WI - Werkinstructie</option>
              <option value="PR">PR - Procedure</option>
              <option value="DS">DS - Document</option>
              <option value="FO">FO - Formulier</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-700/50 border-b border-stone-200 dark:border-stone-700">
                <SortableHeader
                  field="code"
                  label="Code"
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  field="titel"
                  label="Titel"
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <th className="px-4 py-3 text-left font-medium text-stone-500 dark:text-stone-400">
                  Niveau
                </th>
                <SortableHeader
                  field="status"
                  label="Status"
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  field="versie"
                  label="Versie"
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  field="laatstGewijzigd"
                  label="Gewijzigd"
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  field="eigenaar"
                  label="Eigenaar"
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <th className="px-4 py-3 text-right font-medium text-stone-500 dark:text-stone-400">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
              {sortedDocs.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-stone-50 dark:hover:bg-stone-700/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs bg-stone-100 dark:bg-stone-700 px-2 py-1 rounded">
                      {doc.code}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onOpen?.(doc.id)}
                      className="text-stone-900 dark:text-stone-100 hover:text-amber-600 dark:hover:text-amber-400 font-medium text-left"
                    >
                      {doc.titel}
                    </button>
                    <div className="flex gap-1 mt-1">
                      {doc.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400 px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {doc.tags.length > 2 && (
                        <span className="text-xs text-stone-400">
                          +{doc.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <NiveauBadge niveau={doc.niveau} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{doc.versie}</td>
                  <td className="px-4 py-3 text-stone-500 dark:text-stone-400">
                    {doc.laatstGewijzigd}
                  </td>
                  <td className="px-4 py-3 text-stone-600 dark:text-stone-300">
                    {doc.eigenaar}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onOpen?.(doc.id)}
                        className="p-1.5 text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 rounded transition-colors"
                        title="Openen"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <StatusDropdown
                        currentStatus={doc.status}
                        onChangeStatus={(status) => onChangeStatus?.(doc.id, status)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedDocs.length === 0 && (
          <div className="p-8 text-center text-stone-500 dark:text-stone-400">
            Geen documenten gevonden met de huidige filters.
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="mt-4 text-sm text-stone-500 dark:text-stone-400">
        {sortedDocs.length} van {documenten.length} documenten
      </div>
    </div>
  )
}

interface SortableHeaderProps {
  field: SortField
  label: string
  currentField: SortField
  direction: SortDirection
  onSort: (field: SortField) => void
}

function SortableHeader({ field, label, currentField, direction, onSort }: SortableHeaderProps) {
  const isActive = currentField === field

  return (
    <th className="px-4 py-3 text-left">
      <button
        onClick={() => onSort(field)}
        className={`flex items-center gap-1 font-medium transition-colors ${
          isActive
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
        }`}
      >
        {label}
        <span className="text-xs">
          {isActive ? (direction === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </button>
    </th>
  )
}

function StatusBadge({ status }: { status: DocumentStatus }) {
  const config = {
    draft: { icon: '○', label: 'Draft', className: 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300' },
    review: { icon: '◐', label: 'Review', className: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
    active: { icon: '●', label: 'Active', className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
    obsolete: { icon: '✗', label: 'Obsolete', className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
  }

  const { icon, label, className } = config[status]

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      <span>{icon}</span>
      {label}
    </span>
  )
}

function NiveauBadge({ niveau }: { niveau: DocumentNiveau }) {
  const labels: Record<DocumentNiveau, string> = {
    N1: 'Waardeketen',
    N2: 'Bedrijfsproces',
    N3: 'Werkproces',
    N4: 'Werkinstructie',
    N5: 'Instructie',
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs">
      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{niveau}</span>
      <span className="text-stone-500 dark:text-stone-400 hidden sm:inline">
        {labels[niveau]}
      </span>
    </span>
  )
}

function StatusDropdown({
  currentStatus,
  onChangeStatus,
}: {
  currentStatus: DocumentStatus
  onChangeStatus: (status: DocumentStatus) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const statuses: DocumentStatus[] = ['draft', 'review', 'active', 'obsolete']

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 rounded transition-colors"
        title="Status wijzigen"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg shadow-lg py-1 min-w-[140px]">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => {
                  onChangeStatus(status)
                  setIsOpen(false)
                }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors ${
                  status === currentStatus ? 'bg-stone-50 dark:bg-stone-700/50' : ''
                }`}
              >
                <StatusBadge status={status} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
