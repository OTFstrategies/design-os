// Glossary Types - Standaardzinnen & Schrijfstandaard

// ============================================================================
// Standaardzinnen Types
// ============================================================================

export interface StandaardzinCategorie {
  code: string
  naam: string
  beschrijving: string
}

export interface StandaardzinTag {
  id: string
  prefix: string
  waarde: string
  categorie: string
  kleur: string
}

export interface StandaardzinPlaceholder {
  naam: string
  format: string
  toegestane_waarden: string[]
}

export interface StandaardzinDocument {
  id: string
  code: string
  titel: string
  versie: string
}

export interface Standaardzin {
  id: string
  code: string
  tekst: string
  categorie_code: string
  tags: string[]
  placeholders: string[]
}

export interface SequentieStap {
  standaardzin_code: string
  volgorde: number
}

export interface AtomairSequentie {
  id: string
  code: string
  naam: string
  volgorde_verplicht: boolean
  stappen: SequentieStap[]
}

// ============================================================================
// Schrijfstandaard Types
// ============================================================================

export interface Terminologie {
  id: string
  voorkeursterm: string
  verboden_synoniemen: string[]
  definitie: string
  context: string
  voorbeelden: string[]
  categorie_code: string
}

export interface StijlregelCategorie {
  id: string
  code: string
  naam: string
  beschrijving: string
  icoon: string
}

export interface Stijlregel {
  id: string
  categorie_id: string
  titel: string
  beschrijving: string
  voorbeeld_goed: string
  voorbeeld_fout: string
  toelichting: string
}

export interface DocumentNiveau {
  id: string
  code: string
  naam: string
  beschrijving: string
  doelgroep: string
  voorbeelden: string[]
  template_secties: string[]
  kleur: string
  sort_order: number
}

export interface DocumentType {
  id: string
  code: string
  naam: string
  niveau_code: string
  beschrijving: string
  structuur_vereisten: string[]
}

export interface SchrijfstandaardRol {
  id: string
  code: string
  naam: string
  beschrijving: string
}

export interface RaciEntry {
  document_type_code: string
  rol_code: string
  raci_waarde: 'R' | 'A' | 'C' | 'I' | '-'
}

export interface CoderingSegment {
  id: string
  naam: string
  beschrijving: string
  voorbeelden: string[]
  sort_order: number
}

export interface CoderingFormaat {
  id: string
  patroon: string
  voorbeeld: string
  is_active: boolean
  segmenten: CoderingSegment[]
}

// ============================================================================
// Combined Props Types
// ============================================================================

export interface StandaardzinnenData {
  categorieen: StandaardzinCategorie[]
  tags: StandaardzinTag[]
  placeholders: StandaardzinPlaceholder[]
  documenten: StandaardzinDocument[]
  standaardzinnen: Standaardzin[]
  atomaireSequenties: AtomairSequentie[]
}

export interface SchrijfstandaardData {
  terminologie: Terminologie[]
  stijlregelCategorieen: StijlregelCategorie[]
  stijlregels: Stijlregel[]
  documentNiveaus: DocumentNiveau[]
  documentTypes: DocumentType[]
  rollen: SchrijfstandaardRol[]
  raciMatrix: RaciEntry[]
  coderingFormaat: CoderingFormaat
}

export interface GlossaryData extends StandaardzinnenData, SchrijfstandaardData {}

// ============================================================================
// Component Props
// ============================================================================

export interface GlossaryProps {
  data: GlossaryData
  initialTab?: 'standaardzinnen' | 'terminologie' | 'stijlregels' | 'structuur'
  onStandaardzinSelect?: (zin: Standaardzin) => void
  onTerminologieSelect?: (term: Terminologie) => void
  onStijlregelSelect?: (regel: Stijlregel) => void
  onDocumentNiveauSelect?: (niveau: DocumentNiveau) => void
  onSearch?: (query: string) => void
}

export interface StandaardzinnenTabProps {
  categorieen: StandaardzinCategorie[]
  tags: StandaardzinTag[]
  placeholders: StandaardzinPlaceholder[]
  standaardzinnen: Standaardzin[]
  atomaireSequenties: AtomairSequentie[]
  searchQuery?: string
  onSelect?: (zin: Standaardzin) => void
}

export interface TerminologieTabProps {
  terminologie: Terminologie[]
  searchQuery?: string
  onSelect?: (term: Terminologie) => void
}

export interface StijlregelsTabProps {
  categorieen: StijlregelCategorie[]
  stijlregels: Stijlregel[]
  searchQuery?: string
  onSelect?: (regel: Stijlregel) => void
}

export interface DocumentStructuurTabProps {
  documentNiveaus: DocumentNiveau[]
  documentTypes: DocumentType[]
  rollen: SchrijfstandaardRol[]
  raciMatrix: RaciEntry[]
  coderingFormaat: CoderingFormaat
  searchQuery?: string
  onNiveauSelect?: (niveau: DocumentNiveau) => void
}
