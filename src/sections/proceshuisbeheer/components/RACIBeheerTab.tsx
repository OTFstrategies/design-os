import { useState } from 'react'
import type { RACIBeheerProps, RACICode } from '@/../product/sections/proceshuisbeheer/types'

export function RACIBeheerTab({
  raciMatrix,
  personen,
  rollen,
  onChangeRACI,
  onSave,
}: RACIBeheerProps) {
  const [editingCell, setEditingCell] = useState<{ docId: string; personId: string } | null>(null)
  const [hasChanges, setHasChanges] = useState<Record<string, boolean>>({})

  const handleRoleChange = (docId: string, personId: string, role: RACICode | null) => {
    onChangeRACI?.(docId, personId, role)
    setHasChanges((prev) => ({ ...prev, [docId]: true }))
    setEditingCell(null)
  }

  const handleSave = (docId: string) => {
    onSave?.(docId)
    setHasChanges((prev) => ({ ...prev, [docId]: false }))
  }

  // Get role config
  const getRoleConfig = (code: RACICode) => {
    const rol = rollen.find((r) => r.code === code)
    return rol || { code, naam: code, kleur: '#888888', beschrijving: '' }
  }

  return (
    <div className="p-6">
      {/* Legend */}
      <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-4 mb-6">
        <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-3">
          RACI Matrix Legenda
        </h3>
        <div className="flex flex-wrap gap-4">
          {rollen.map((rol) => (
            <div key={rol.code} className="flex items-center gap-2">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: rol.kleur }}
              >
                {rol.code}
              </span>
              <div>
                <div className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  {rol.naam}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400">
                  {rol.beschrijving}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RACI Matrix */}
      <div className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-700/50">
                <th className="px-4 py-3 text-left font-medium text-stone-500 dark:text-stone-400 sticky left-0 bg-stone-50 dark:bg-stone-700/50 z-10 min-w-[200px]">
                  Document
                </th>
                {personen.map((persoon) => (
                  <th
                    key={persoon.id}
                    className="px-2 py-3 text-center font-medium text-stone-500 dark:text-stone-400 min-w-[100px]"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-600 flex items-center justify-center text-xs font-bold text-stone-600 dark:text-stone-300">
                        {persoon.naam.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <span className="text-xs truncate max-w-[90px]" title={persoon.naam}>
                        {persoon.naam.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-stone-400 truncate max-w-[90px]">
                        {persoon.functie}
                      </span>
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-center font-medium text-stone-500 dark:text-stone-400 min-w-[80px]">
                  Acties
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
              {raciMatrix.map((row) => (
                <tr
                  key={row.documentId}
                  className={`
                    transition-colors
                    ${hasChanges[row.documentId]
                      ? 'bg-amber-50/50 dark:bg-amber-900/10'
                      : 'hover:bg-stone-50 dark:hover:bg-stone-700/30'
                    }
                  `}
                >
                  {/* Document info */}
                  <td className="px-4 py-3 sticky left-0 bg-white dark:bg-stone-800 z-10">
                    <div className="font-mono text-xs text-stone-400 mb-1">
                      {row.documentCode}
                    </div>
                    <div className="font-medium text-stone-900 dark:text-stone-100">
                      {row.documentTitel}
                    </div>
                  </td>

                  {/* RACI cells */}
                  {personen.map((persoon) => {
                    const currentRole = row.toewijzingen[persoon.id] as RACICode | undefined
                    const isEditing =
                      editingCell?.docId === row.documentId &&
                      editingCell?.personId === persoon.id

                    return (
                      <td key={persoon.id} className="px-2 py-3 text-center">
                        {isEditing ? (
                          <RACISelector
                            currentRole={currentRole}
                            rollen={rollen}
                            onSelect={(role) =>
                              handleRoleChange(row.documentId, persoon.id, role)
                            }
                            onCancel={() => setEditingCell(null)}
                          />
                        ) : (
                          <button
                            onClick={() =>
                              setEditingCell({ docId: row.documentId, personId: persoon.id })
                            }
                            className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                            style={
                              currentRole
                                ? { backgroundColor: getRoleConfig(currentRole).kleur }
                                : undefined
                            }
                          >
                            {currentRole ? (
                              <span className="text-white font-bold">{currentRole}</span>
                            ) : (
                              <span className="text-stone-300 dark:text-stone-600 text-lg">+</span>
                            )}
                          </button>
                        )}
                      </td>
                    )
                  })}

                  {/* Save button */}
                  <td className="px-4 py-3 text-center">
                    {hasChanges[row.documentId] && (
                      <button
                        onClick={() => handleSave(row.documentId)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors"
                      >
                        Opslaan
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {raciMatrix.length === 0 && (
          <div className="p-8 text-center text-stone-500 dark:text-stone-400">
            Geen documenten gevonden voor RACI toewijzing.
          </div>
        )}
      </div>

      {/* Summary stats */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {rollen.map((rol) => {
          const count = raciMatrix.reduce((acc, row) => {
            return (
              acc +
              Object.values(row.toewijzingen).filter((r) => r === rol.code).length
            )
          }, 0)

          return (
            <div
              key={rol.code}
              className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold text-white"
                  style={{ backgroundColor: rol.kleur }}
                >
                  {rol.code}
                </span>
                <div>
                  <div className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
                    {count}
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">
                    {rol.naam}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface RACISelectorProps {
  currentRole?: RACICode
  rollen: { code: RACICode; naam: string; kleur: string }[]
  onSelect: (role: RACICode | null) => void
  onCancel: () => void
}

function RACISelector({ currentRole, rollen, onSelect, onCancel }: RACISelectorProps) {
  return (
    <div className="relative">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg shadow-lg p-2 flex gap-1">
        {rollen.map((rol) => (
          <button
            key={rol.code}
            onClick={() => onSelect(rol.code)}
            className={`
              w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white transition-all hover:scale-110
              ${currentRole === rol.code ? 'ring-2 ring-offset-2 ring-amber-400' : ''}
            `}
            style={{ backgroundColor: rol.kleur }}
            title={rol.naam}
          >
            {rol.code}
          </button>
        ))}
        {currentRole && (
          <button
            onClick={() => onSelect(null)}
            className="w-9 h-9 rounded-lg flex items-center justify-center bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Verwijderen"
          >
            ✕
          </button>
        )}
        <button
          onClick={onCancel}
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-stone-100 dark:bg-stone-600 text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-500 transition-colors"
          title="Annuleren"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="fixed inset-0 z-10" onClick={onCancel} />
    </div>
  )
}
