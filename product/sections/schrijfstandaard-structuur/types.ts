// =============================================================================
// Data Types
// =============================================================================

export interface Terminologie {
  id: string
  voorkeursterm: string
  verbodenSynoniemen: string[]
  definitie: string
  context: string
  voorbeelden: string[]
  categorie: 'apparatuur' | 'infrastructuur' | 'materiaal' | 'locatie' | 'systeem' | 'rollen'
}

export interface Stijlregel {
  id: string
  categorie: 'imperatiefvorm' | 'actieve-zinnen' | 'verboden-woorden' | 'zinlengte' | 'consistentie'
  titel: string
  beschrijving: string
  voorbeeldGoed: string
  voorbeeldFout: string
  toelichting: string
}

export interface StijlregelCategorie {
  id: string
  code: string
  naam: string
  beschrijving: string
  icoon: string
}

export interface DocumentNiveau {
  id: string
  code: 'L1' | 'L2' | 'L3' | 'L4' | 'L5'
  naam: string
  beschrijving: string
  doelgroep: string
  voorbeelden: string[]
  templateSecties: string[]
  kleur: string
}

export interface DocumentType {
  id: string
  code: 'PR' | 'WI' | 'DS' | 'FO'
  naam: string
  niveau: 'L1' | 'L2' | 'L3' | 'L4' | 'L5'
  beschrijving: string
  structuurVereisten: string[]
}

export interface Rol {
  id: string
  code: string
  naam: string
  beschrijving: string
}

export type RACIWaarde = 'R' | 'A' | 'C' | 'I'

export interface RACIToewijzing {
  documentTypeCode: string
  toewijzingen: Record<string, RACIWaarde>
}

export interface CoderingSegment {
  naam: string
  beschrijving: string
  voorbeelden: string[]
}

export interface CoderingFormaat {
  patroon: string
  voorbeeld: string
  segmenten: CoderingSegment[]
}

// =============================================================================
// Component Props
// =============================================================================

export interface SchrijfstandaardStructuurProps {
  /** Lijst met terminologie-items */
  terminologie: Terminologie[]
  /** Lijst met stijlregels */
  stijlregels: Stijlregel[]
  /** Categorieën voor stijlregels */
  stijlregelCategorieen: StijlregelCategorie[]
  /** De 5 documentniveaus (L1-L5) */
  documentNiveaus: DocumentNiveau[]
  /** Documenttypes (WI, PROC, FORM, etc.) */
  documentTypes: DocumentType[]
  /** RACI-rollen */
  rollen: Rol[]
  /** RACI-matrix per documenttype */
  raciMatrix: RACIToewijzing[]
  /** Coderingsformaat voor documentcodes */
  coderingFormaat: CoderingFormaat

  // Terminologie callbacks
  /** Zoeken in terminologie */
  onSearchTerminologie?: (query: string) => void
  /** Term kopiëren naar clipboard */
  onCopyTerm?: (id: string) => void
  /** Nieuwe term voorstellen */
  onProposeTerm?: () => void

  // Stijlregels callbacks
  /** Checklist genereren van geselecteerde regels */
  onGenerateChecklist?: (regelIds: string[]) => void

  // Documentstructuur callbacks
  /** Documentniveau selecteren */
  onSelectNiveau?: (code: string) => void
  /** Template bekijken voor een niveau */
  onViewTemplate?: (niveauCode: string) => void
  /** Documentcode genereren */
  onGenerateCode?: (params: CodeGeneratorParams) => void
}

export interface CodeGeneratorParams {
  niveau: string
  type: string
  afdeling: string
  categorie: string
  volgnummer: string
  versie: string
}

// =============================================================================
// Tab-specific Props
// =============================================================================

export interface TerminologieTabProps {
  terminologie: Terminologie[]
  onSearch?: (query: string) => void
  onCopy?: (id: string) => void
  onPropose?: () => void
}

export interface StijlregelsTabProps {
  stijlregels: Stijlregel[]
  categorieen: StijlregelCategorie[]
  onGenerateChecklist?: (regelIds: string[]) => void
}

export interface DocumentstructuurTabProps {
  documentNiveaus: DocumentNiveau[]
  documentTypes: DocumentType[]
  rollen: Rol[]
  raciMatrix: RACIToewijzing[]
  coderingFormaat: CoderingFormaat
  onSelectNiveau?: (code: string) => void
  onViewTemplate?: (niveauCode: string) => void
  onGenerateCode?: (params: CodeGeneratorParams) => void
}
