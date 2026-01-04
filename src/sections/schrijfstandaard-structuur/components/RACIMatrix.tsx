import type { DocumentType, Rol, RACIToewijzing, RACIWaarde } from '@/../product/sections/schrijfstandaard-structuur/types'

interface RACIMatrixProps {
  documentTypes: DocumentType[]
  rollen: Rol[]
  raciMatrix: RACIToewijzing[]
}

const raciKleuren: Record<RACIWaarde, { bg: string; text: string; label: string }> = {
  R: {
    bg: 'bg-green-100 dark:bg-green-900/40',
    text: 'text-green-700 dark:text-green-300',
    label: 'Responsible',
  },
  A: {
    bg: 'bg-blue-100 dark:bg-blue-900/40',
    text: 'text-blue-700 dark:text-blue-300',
    label: 'Accountable',
  },
  C: {
    bg: 'bg-amber-100 dark:bg-amber-900/40',
    text: 'text-amber-700 dark:text-amber-300',
    label: 'Consulted',
  },
  I: {
    bg: 'bg-stone-100 dark:bg-stone-800',
    text: 'text-stone-500 dark:text-stone-400',
    label: 'Informed',
  },
}

function RACICell({ waarde }: { waarde: RACIWaarde | undefined }) {
  if (!waarde) {
    return (
      <td className="px-3 py-2 text-center">
        <span className="text-stone-300 dark:text-stone-600">-</span>
      </td>
    )
  }

  const kleuren = raciKleuren[waarde]

  return (
    <td className="px-3 py-2 text-center">
      <span
        className={`
          inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm
          ${kleuren.bg} ${kleuren.text}
        `}
        title={kleuren.label}
      >
        {waarde}
      </span>
    </td>
  )
}

export function RACIMatrix({ documentTypes, rollen, raciMatrix }: RACIMatrixProps) {
  // Create a lookup map for quick access
  const matrixMap = new Map<string, Record<string, RACIWaarde>>()
  for (const entry of raciMatrix) {
    matrixMap.set(entry.documentTypeCode, entry.toewijzingen)
  }

  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
      {/* Legend */}
      <div className="px-4 py-3 bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-700">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          {Object.entries(raciKleuren).map(([key, value]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className={`w-5 h-5 rounded flex items-center justify-center font-bold ${value.bg} ${value.text}`}>
                {key}
              </span>
              <span className="text-stone-600 dark:text-stone-400">{value.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-stone-50 dark:bg-stone-800/30">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                Documenttype
              </th>
              {rollen.map((rol) => (
                <th
                  key={rol.id}
                  className="px-3 py-3 text-center text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider"
                  title={rol.beschrijving}
                >
                  {rol.naam}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {documentTypes.map((type) => {
              const toewijzingen = matrixMap.get(type.code) || {}
              return (
                <tr
                  key={type.id}
                  className="bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <span className="font-mono text-xs text-stone-400 dark:text-stone-500 mr-2">
                        {type.code}
                      </span>
                      <span className="font-medium text-stone-900 dark:text-stone-100">
                        {type.naam}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      Niveau: {type.niveau}
                    </p>
                  </td>
                  {rollen.map((rol) => (
                    <RACICell
                      key={rol.id}
                      waarde={toewijzingen[rol.code] as RACIWaarde | undefined}
                    />
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
