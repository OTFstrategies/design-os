import { useState, useMemo } from 'react'

// Types matching the camelCase data.json structure
interface StandaardzinCategorie {
  code: string
  naam: string
  beschrijving: string
}

interface StandaardzinTag {
  prefix: string
  waarde: string
  categorie: string
  kleur: string
}

interface Standaardzin {
  id: string
  code: string
  tekst: string
  categorieCode: string
  tags: string[]
  placeholders: string[]
}

interface SequentieStap {
  standaardzinCode: string
  volgorde: number
}

interface AtomairSequentie {
  id: string
  code: string
  naam: string
  volgordeVerplicht: boolean
  stappen: SequentieStap[]
}

interface Terminologie {
  id: string
  voorkeursterm: string
  verbodenSynoniemen: string[]
  definitie: string
  context: string
  voorbeelden: string[]
  categorie: string
}

interface StijlregelCategorie {
  id: string
  code: string
  naam: string
  beschrijving: string
  icoon: string
}

interface Stijlregel {
  id: string
  categorie: string  // References the category code, not ID
  titel: string
  beschrijving: string
  voorbeeldGoed: string
  voorbeeldFout: string
  toelichting: string
}

interface DocumentNiveau {
  id: string
  code: string
  naam: string
  beschrijving: string
  doelgroep: string
  voorbeelden: string[]
  templateSecties: string[]
  kleur: string
  sortOrder: number
}

interface DocumentType {
  id: string
  code: string
  naam: string
  niveauCode: string
  beschrijving: string
  structuurVereisten: string[]
}

interface SchrijfstandaardRol {
  id: string
  code: string
  naam: string
  beschrijving: string
}

interface RaciEntry {
  documentTypeCode: string
  toewijzingen: Record<string, 'R' | 'A' | 'C' | 'I'>
}

interface CoderingSegment {
  id: string
  naam: string
  beschrijving: string
  voorbeelden: string[]
  sortOrder: number
}

interface CoderingFormaat {
  id: string
  patroon: string
  voorbeeld: string
  isActive: boolean
  segmenten: CoderingSegment[]
}

interface GlossaryData {
  categorieen: StandaardzinCategorie[]
  tags: StandaardzinTag[]
  standaardzinnen: Standaardzin[]
  atomaireSequenties: AtomairSequentie[]
  terminologie: Terminologie[]
  stijlregelCategorieen: StijlregelCategorie[]
  stijlregels: Stijlregel[]
  documentNiveaus: DocumentNiveau[]
  documentTypes: DocumentType[]
  rollen: SchrijfstandaardRol[]
  raciMatrix: RaciEntry[]
  coderingFormaat: CoderingFormaat
}

interface GlossaryProps {
  data: GlossaryData
  initialTab?: 'standaardzinnen' | 'terminologie' | 'stijlregels' | 'structuur'
  onStandaardzinSelect?: (zin: Standaardzin) => void
  onTerminologieSelect?: (term: Terminologie) => void
  onStijlregelSelect?: (regel: Stijlregel) => void
  onDocumentNiveauSelect?: (niveau: DocumentNiveau) => void
  onSearch?: (query: string) => void
}

type TabId = 'standaardzinnen' | 'terminologie' | 'stijlregels' | 'structuur'

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'standaardzinnen', label: 'Standaardzinnen', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { id: 'terminologie', label: 'Terminologie', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { id: 'stijlregels', label: 'Stijlregels', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { id: 'structuur', label: 'Document Structuur', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' }
]

export function Glossary({
  data,
  initialTab = 'standaardzinnen',
  onStandaardzinSelect,
  onTerminologieSelect,
  onStijlregelSelect,
  onDocumentNiveauSelect,
  onSearch
}: GlossaryProps) {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data

    const query = searchQuery.toLowerCase()
    return {
      ...data,
      standaardzinnen: data.standaardzinnen.filter(z =>
        z.tekst.toLowerCase().includes(query) ||
        z.code.toLowerCase().includes(query)
      ),
      terminologie: data.terminologie.filter(t =>
        t.voorkeursterm.toLowerCase().includes(query) ||
        t.definitie.toLowerCase().includes(query) ||
        t.verbodenSynoniemen.some(s => s.toLowerCase().includes(query))
      ),
      stijlregels: data.stijlregels.filter(r =>
        r.titel.toLowerCase().includes(query) ||
        r.beschrijving.toLowerCase().includes(query)
      ),
      documentNiveaus: data.documentNiveaus.filter(n =>
        n.naam.toLowerCase().includes(query) ||
        n.beschrijving.toLowerCase().includes(query)
      )
    }
  }, [data, searchQuery])

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      {/* Header */}
      <div className="bg-white dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
                Glossary
              </h1>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                Standaardzinnen, terminologie en schrijfstandaard
              </p>
            </div>

            {/* Global Search */}
            <div className="relative w-full sm:w-80">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Zoek in alle categorieën..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
                </svg>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'standaardzinnen' && (
          <StandaardzinnenTab
            categorieen={data.categorieen}
            tags={data.tags}
            standaardzinnen={filteredData.standaardzinnen}
            atomaireSequenties={data.atomaireSequenties}
            onSelect={onStandaardzinSelect}
          />
        )}

        {activeTab === 'terminologie' && (
          <TerminologieTab
            terminologie={filteredData.terminologie}
            onSelect={onTerminologieSelect}
          />
        )}

        {activeTab === 'stijlregels' && (
          <StijlregelsTab
            categorieen={data.stijlregelCategorieen}
            stijlregels={filteredData.stijlregels}
            onSelect={onStijlregelSelect}
          />
        )}

        {activeTab === 'structuur' && (
          <DocumentStructuurTab
            documentNiveaus={filteredData.documentNiveaus}
            documentTypes={data.documentTypes}
            rollen={data.rollen}
            raciMatrix={data.raciMatrix}
            coderingFormaat={data.coderingFormaat}
            onNiveauSelect={onDocumentNiveauSelect}
          />
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Standaardzinnen Tab
// ============================================================================

function StandaardzinnenTab({
  categorieen,
  tags,
  standaardzinnen,
  atomaireSequenties,
  onSelect
}: {
  categorieen: StandaardzinCategorie[]
  tags: StandaardzinTag[]
  standaardzinnen: Standaardzin[]
  atomaireSequenties: AtomairSequentie[]
  onSelect?: (zin: Standaardzin) => void
}) {
  const [selectedCategorie, setSelectedCategorie] = useState<string | null>(null)

  const filteredZinnen = selectedCategorie
    ? standaardzinnen.filter(z => z.categorieCode === selectedCategorie)
    : standaardzinnen

  const getTagByValue = (value: string) => tags.find(t => t.waarde === value)

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategorie(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            !selectedCategorie
              ? 'bg-amber-500 text-white'
              : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-600'
          }`}
        >
          Alle ({standaardzinnen.length})
        </button>
        {categorieen.map((cat) => {
          const count = standaardzinnen.filter(z => z.categorieCode === cat.code).length
          return (
            <button
              key={cat.code}
              onClick={() => setSelectedCategorie(cat.code)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategorie === cat.code
                  ? 'bg-amber-500 text-white'
                  : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-600'
              }`}
            >
              {cat.naam} ({count})
            </button>
          )
        })}
      </div>

      {/* Standaardzinnen Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredZinnen.map((zin) => (
          <div
            key={zin.id}
            onClick={() => onSelect?.(zin)}
            className="p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-600 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <code className="text-xs font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-400">
                {zin.code}
              </code>
              <span className="text-xs text-stone-400">
                {categorieen.find(c => c.code === zin.categorieCode)?.naam}
              </span>
            </div>
            <p className="text-stone-900 dark:text-stone-100 mb-3">
              {zin.tekst}
            </p>
            {zin.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {zin.tags.map((tagValue, idx) => {
                  const tag = getTagByValue(tagValue)
                  return (
                    <span
                      key={idx}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: tag?.kleur ? `${tag.kleur}20` : '#f5f5f4',
                        color: tag?.kleur || '#78716c'
                      }}
                    >
                      @{tag?.prefix}:{tagValue}
                    </span>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Atomaire Sequenties */}
      {atomaireSequenties.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100 mb-4">
            Atomaire Sequenties
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {atomaireSequenties.map((seq) => (
              <div
                key={seq.id}
                className="p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <code className="text-xs font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                    {seq.code}
                  </code>
                  {seq.volgordeVerplicht && (
                    <span className="text-xs px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                      Volgorde verplicht
                    </span>
                  )}
                </div>
                <h4 className="font-medium text-stone-900 dark:text-stone-100 mb-2">
                  {seq.naam}
                </h4>
                <ol className="space-y-1">
                  {seq.stappen.map((stap, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-stone-100 dark:bg-stone-700 flex items-center justify-center text-xs">
                        {stap.volgorde}
                      </span>
                      {stap.standaardzinCode}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Terminologie Tab
// ============================================================================

function TerminologieTab({
  terminologie,
  onSelect
}: {
  terminologie: Terminologie[]
  onSelect?: (term: Terminologie) => void
}) {
  const groupedByCategorie = terminologie.reduce((acc, term) => {
    const cat = term.categorie
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(term)
    return acc
  }, {} as Record<string, Terminologie[]>)

  return (
    <div className="space-y-8">
      {Object.entries(groupedByCategorie).map(([categorie, terms]) => (
        <div key={categorie}>
          <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100 mb-4 capitalize">
            {categorie}
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {terms.map((term) => (
              <div
                key={term.id}
                onClick={() => onSelect?.(term)}
                className="p-4 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-600 transition-colors cursor-pointer"
              >
                <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-2">
                  {term.voorkeursterm}
                </h4>
                <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">
                  {term.definitie}
                </p>
                {term.verbodenSynoniemen.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {term.verbodenSynoniemen.map((syn, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 line-through"
                      >
                        {syn}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// Stijlregels Tab
// ============================================================================

function StijlregelsTab({
  categorieen,
  stijlregels,
  onSelect
}: {
  categorieen: StijlregelCategorie[]
  stijlregels: Stijlregel[]
  onSelect?: (regel: Stijlregel) => void
}) {
  const [expandedCategorie, setExpandedCategorie] = useState<string | null>(
    categorieen[0]?.code || null
  )

  const getRegelsByCategorie = (categorieCode: string) =>
    stijlregels.filter(r => r.categorie === categorieCode)

  return (
    <div className="space-y-4">
      {categorieen.map((cat) => {
        const regels = getRegelsByCategorie(cat.code)
        const isExpanded = expandedCategorie === cat.code

        return (
          <div
            key={cat.id}
            className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden"
          >
            <button
              onClick={() => setExpandedCategorie(isExpanded ? null : cat.code)}
              className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-stone-50 dark:hover:bg-stone-750 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icoon}</span>
                <div>
                  <h3 className="font-medium text-stone-900 dark:text-stone-100">
                    {cat.naam}
                  </h3>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    {cat.beschrijving}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-stone-400">
                  {regels.length} regels
                </span>
                <svg
                  className={`w-5 h-5 text-stone-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-stone-200 dark:border-stone-700">
                {regels.map((regel, idx) => (
                  <div
                    key={regel.id}
                    onClick={() => onSelect?.(regel)}
                    className={`p-4 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-750 ${
                      idx > 0 ? 'border-t border-stone-100 dark:border-stone-700' : ''
                    }`}
                  >
                    <h4 className="font-medium text-stone-900 dark:text-stone-100 mb-2">
                      {regel.titel}
                    </h4>
                    <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">
                      {regel.beschrijving}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="p-2 rounded bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                        <span className="text-xs font-medium text-green-700 dark:text-green-400 block mb-1">
                          Goed
                        </span>
                        <p className="text-sm text-green-800 dark:text-green-300">
                          {regel.voorbeeldGoed}
                        </p>
                      </div>
                      <div className="p-2 rounded bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <span className="text-xs font-medium text-red-700 dark:text-red-400 block mb-1">
                          Fout
                        </span>
                        <p className="text-sm text-red-800 dark:text-red-300">
                          {regel.voorbeeldFout}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ============================================================================
// Document Structuur Tab
// ============================================================================

function DocumentStructuurTab({
  documentNiveaus,
  documentTypes,
  rollen,
  raciMatrix,
  coderingFormaat,
  onNiveauSelect
}: {
  documentNiveaus: DocumentNiveau[]
  documentTypes: DocumentType[]
  rollen: SchrijfstandaardRol[]
  raciMatrix: RaciEntry[]
  coderingFormaat: CoderingFormaat
  onNiveauSelect?: (niveau: DocumentNiveau) => void
}) {
  const [activeSection, setActiveSection] = useState<'niveaus' | 'raci' | 'codering'>('niveaus')

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-stone-200 dark:border-stone-700 pb-2">
        {[
          { id: 'niveaus', label: 'Document Niveaus' },
          { id: 'raci', label: 'RACI Matrix' },
          { id: 'codering', label: 'Codering' }
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as typeof activeSection)}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              activeSection === section.id
                ? 'bg-white dark:bg-stone-800 text-amber-600 dark:text-amber-400 border border-b-0 border-stone-200 dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Document Niveaus */}
      {activeSection === 'niveaus' && (
        <div className="space-y-4">
          {documentNiveaus
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((niveau) => {
              const types = documentTypes.filter(t => t.niveauCode === niveau.code)
              return (
                <div
                  key={niveau.id}
                  onClick={() => onNiveauSelect?.(niveau)}
                  className="p-4 bg-white dark:bg-stone-800 rounded-xl border-l-4 border border-stone-200 dark:border-stone-700 cursor-pointer hover:shadow-md transition-shadow"
                  style={{ borderLeftColor: niveau.kleur }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-400">
                        {niveau.code}
                      </span>
                      <h3 className="font-semibold text-stone-900 dark:text-stone-100 mt-1">
                        {niveau.naam}
                      </h3>
                    </div>
                    <span className="text-xs text-stone-400">
                      {niveau.doelgroep}
                    </span>
                  </div>
                  <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">
                    {niveau.beschrijving}
                  </p>
                  {types.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {types.map((type) => (
                        <span
                          key={type.id}
                          className="text-xs px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                        >
                          {type.code}: {type.naam}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      )}

      {/* RACI Matrix */}
      {activeSection === 'raci' && (
        <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-700">
                <th className="px-4 py-3 text-left text-sm font-medium text-stone-600 dark:text-stone-400">
                  Document Type
                </th>
                {rollen.map((rol) => (
                  <th
                    key={rol.id}
                    className="px-4 py-3 text-center text-sm font-medium text-stone-600 dark:text-stone-400"
                  >
                    <div className="flex flex-col items-center">
                      <span>{rol.code}</span>
                      <span className="text-xs font-normal text-stone-400">
                        {rol.naam}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {documentTypes.map((type) => (
                <tr
                  key={type.id}
                  className="border-b border-stone-100 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-750"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-stone-900 dark:text-stone-100">
                      {type.code}
                    </span>
                    <span className="ml-2 text-sm text-stone-500">
                      {type.naam}
                    </span>
                  </td>
                  {rollen.map((rol) => {
                    const entry = raciMatrix.find(e => e.documentTypeCode === type.code)
                    const value = entry?.toewijzingen?.[rol.code] || '-'
                    const colorClass = {
                      'R': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
                      'A': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
                      'C': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
                      'I': 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-400',
                      '-': 'text-stone-300 dark:text-stone-600'
                    }[value] || ''

                    return (
                      <td key={rol.id} className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${colorClass}`}>
                          {value}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Codering */}
      {activeSection === 'codering' && (
        <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-6">
          <div className="mb-6">
            <h3 className="font-medium text-stone-900 dark:text-stone-100 mb-2">
              Coderingsformaat
            </h3>
            <code className="block p-4 bg-stone-100 dark:bg-stone-900 rounded-lg text-lg font-mono text-amber-600 dark:text-amber-400">
              {coderingFormaat.patroon}
            </code>
            <p className="mt-2 text-sm text-stone-500">
              Voorbeeld: <strong>{coderingFormaat.voorbeeld}</strong>
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-stone-900 dark:text-stone-100">
              Segmenten
            </h4>
            {coderingFormaat.segmenten
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((segment) => (
                <div
                  key={segment.id}
                  className="p-4 bg-stone-50 dark:bg-stone-900 rounded-lg"
                >
                  <h5 className="font-medium text-stone-900 dark:text-stone-100 mb-1">
                    {segment.naam}
                  </h5>
                  <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">
                    {segment.beschrijving}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {segment.voorbeelden.map((vb, idx) => (
                      <code
                        key={idx}
                        className="text-xs px-2 py-1 rounded bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300"
                      >
                        {vb}
                      </code>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Glossary
