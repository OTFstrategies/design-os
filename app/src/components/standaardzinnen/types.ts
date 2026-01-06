// Filter state for the library
export interface FilterState {
  zoekterm: string
  categorie: string | null
  tags: string[]
  type: 'alle' | 'zinnen' | 'sequenties'
  placeholder: string | null
}

// Category for grouping standard sentences
export interface Categorie {
  code: string
  naam: string
  beschrijving: string
}

// Tag for semantic labeling
export interface Tag {
  prefix: string
  waarde: string
  categorie: string
  kleur: string
}

// Placeholder variable in standard sentences
export interface Placeholder {
  naam: string
  format: string
  toegestaneWaarden: string[]
}

// Document reference
export interface DocumentRef {
  code: string
  titel: string
  niveau: string
}

// Standard sentence
export interface Standaardzin {
  id: string
  code: string
  tekst: string
  categorieCode: string
  tags: string[]
  placeholders: string[]
  laatstGewijzigd: string
  gebruiktIn: string[]
}

// Step in an atomic sequence
export interface SequentieStap {
  volgorde: number
  standaardzinCode: string
}

// Atomic sequence (ordered group of standard sentences)
export interface AtomairSequentie {
  id: string
  code: string
  naam: string
  volgordeVerplicht: boolean
  stappen: SequentieStap[]
  gebruiktIn: string[]
}

// Props for the main component
export interface StandaardzinnenBibliotheekProps {
  standaardzinnen: Standaardzin[]
  atomaireSequenties: AtomairSequentie[]
  categorieen: Categorie[]
  tags: Tag[]
  placeholders: Placeholder[]
  documenten: DocumentRef[]
  onCopy?: (id: string, includeCode?: boolean) => void
  onInsert?: (id: string) => void
  onView?: (id: string) => void
  onEdit?: (id: string) => void
  onCopySequentie?: (id: string) => void
  onInsertSequentie?: (id: string) => void
  onViewSequentie?: (id: string) => void
}
