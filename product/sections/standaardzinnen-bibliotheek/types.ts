// =============================================================================
// Data Types
// =============================================================================

export interface Categorie {
  code: string
  naam: string
  beschrijving: string
}

export interface Tag {
  prefix: '@loc' | '@equip' | '@act' | '@safe' | '@proc' | '@phase'
  waarde: string
  categorie: string
  kleur: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow'
}

export interface Placeholder {
  naam: string
  format: 'tekst' | 'getal'
  toegestaneWaarden: string[]
}

export interface DocumentRef {
  code: string
  titel: string
  niveau: 'L1' | 'L2' | 'L3' | 'L4' | 'L5'
}

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

export interface SequentieStap {
  volgorde: number
  standaardzinCode: string
}

export interface AtomairSequentie {
  id: string
  code: string
  naam: string
  volgordeVerplicht: boolean
  stappen: SequentieStap[]
  gebruiktIn: string[]
}

// =============================================================================
// Component Props
// =============================================================================

export interface StandaardzinnenBibliotheekProps {
  /** Lijst van standaardzinnen */
  standaardzinnen: Standaardzin[]
  /** Lijst van atomaire sequenties */
  atomaireSequenties: AtomairSequentie[]
  /** Beschikbare categorieën voor filtering */
  categorieen: Categorie[]
  /** Beschikbare tags voor filtering */
  tags: Tag[]
  /** Beschikbare placeholders */
  placeholders: Placeholder[]
  /** Referentielijst documenten (voor "gebruikt in" weergave) */
  documenten: DocumentRef[]

  /** Kopieer zin naar klembord */
  onCopy?: (id: string, includeCode?: boolean) => void
  /** Voeg zin in in document-editor */
  onInsert?: (id: string) => void
  /** Bekijk details in drawer */
  onView?: (id: string) => void
  /** Bewerk zin (bibliotheekbeheerder) */
  onEdit?: (id: string) => void
  /** Pas tags aan */
  onTagEdit?: (id: string, tags: string[]) => void

  /** Kopieer sequentie naar klembord */
  onCopySequentie?: (id: string) => void
  /** Voeg sequentie in in document-editor */
  onInsertSequentie?: (id: string) => void
  /** Bekijk sequentie details in drawer */
  onViewSequentie?: (id: string) => void
}

// =============================================================================
// Filter State
// =============================================================================

export interface FilterState {
  zoekterm: string
  categorie: string | null
  tags: string[]
  type: 'alle' | 'zinnen' | 'sequenties'
  placeholder: string | null
}
