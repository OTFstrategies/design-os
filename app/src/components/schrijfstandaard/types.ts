// Terminologie entry
export interface Terminologie {
  id: string
  voorkeursterm: string
  verbodenSynoniemen: string[]
  definitie: string
  context: string
  voorbeelden: string[]
  categorie: string
}

// Stijlregel categorie
export interface StijlregelCategorie {
  id: string
  code: string
  naam: string
  beschrijving: string
  icoon: string
}

// Stijlregel
export interface Stijlregel {
  id: string
  categorie: string
  titel: string
  beschrijving: string
  voorbeeldGoed: string
  voorbeeldFout: string
  toelichting: string
}

// Document niveau (L1-L5)
export interface DocumentNiveau {
  id: string
  code: string
  naam: string
  beschrijving: string
  doelgroep: string
  voorbeelden: string[]
  templateSecties: string[]
  kleur: string
}

// Document type
export interface DocumentType {
  id: string
  code: string
  naam: string
  niveau: string
  beschrijving: string
  structuurVereisten: string[]
}

// Rol for RACI
export interface Rol {
  id: string
  code: string
  naam: string
  beschrijving: string
}

// RACI value type
export type RACIWaarde = 'R' | 'A' | 'C' | 'I'

// RACI toewijzing
export interface RACIToewijzing {
  documentTypeCode: string
  toewijzingen: Record<string, RACIWaarde>
}

// Codering segment
export interface CoderingSegment {
  naam: string
  beschrijving: string
  voorbeelden: string[]
}

// Codering formaat
export interface CoderingFormaat {
  patroon: string
  voorbeeld: string
  segmenten: CoderingSegment[]
}

// Code generator params
export interface CodeGeneratorParams {
  niveau: string
  type: string
  afdeling: string
  categorie: string
  volgnummer: string
  versie: string
}

// Tab props
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

// Main component props
export interface SchrijfstandaardStructuurProps {
  terminologie: Terminologie[]
  stijlregels: Stijlregel[]
  stijlregelCategorieen: StijlregelCategorie[]
  documentNiveaus: DocumentNiveau[]
  documentTypes: DocumentType[]
  rollen: Rol[]
  raciMatrix: RACIToewijzing[]
  coderingFormaat: CoderingFormaat
  onSearchTerminologie?: (query: string) => void
  onCopyTerm?: (id: string) => void
  onProposeTerm?: () => void
  onGenerateChecklist?: (regelIds: string[]) => void
  onSelectNiveau?: (code: string) => void
  onViewTemplate?: (niveauCode: string) => void
  onGenerateCode?: (params: CodeGeneratorParams) => void
}
