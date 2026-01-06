// Re-export types from standaardzinnen
export type {
  FilterState,
  Categorie,
  Tag,
  Placeholder,
  DocumentRef,
  Standaardzin,
  SequentieStap,
  AtomairSequentie,
  StandaardzinnenBibliotheekProps,
} from '../standaardzinnen/types'

// Re-export types from schrijfstandaard
export type {
  Terminologie,
  StijlregelCategorie,
  Stijlregel,
  DocumentNiveau,
  DocumentType,
  Rol,
  RACIWaarde,
  RACIToewijzing,
  CoderingSegment,
  CoderingFormaat,
  CodeGeneratorParams,
  TerminologieTabProps,
  StijlregelsTabProps,
  DocumentstructuurTabProps,
} from '../schrijfstandaard/types'

// Combined props for Glossary component
export interface GlossaryProps {
  // Standaardzinnen data
  standaardzinnen: import('../standaardzinnen/types').Standaardzin[]
  atomaireSequenties: import('../standaardzinnen/types').AtomairSequentie[]
  categorieen: import('../standaardzinnen/types').Categorie[]
  tags: import('../standaardzinnen/types').Tag[]
  placeholders: import('../standaardzinnen/types').Placeholder[]
  documenten: import('../standaardzinnen/types').DocumentRef[]

  // Terminologie/stijlregels/documentstructuur data
  terminologie: import('../schrijfstandaard/types').Terminologie[]
  stijlregels: import('../schrijfstandaard/types').Stijlregel[]
  stijlregelCategorieen: import('../schrijfstandaard/types').StijlregelCategorie[]
  documentNiveaus: import('../schrijfstandaard/types').DocumentNiveau[]
  documentTypes: import('../schrijfstandaard/types').DocumentType[]
  rollen: import('../schrijfstandaard/types').Rol[]
  raciMatrix: import('../schrijfstandaard/types').RACIToewijzing[]
  coderingFormaat: import('../schrijfstandaard/types').CoderingFormaat

  // Standaardzinnen callbacks
  onCopyZin?: (id: string, includeCode?: boolean) => void
  onInsertZin?: (id: string) => void
  onViewZin?: (id: string) => void
  onEditZin?: (id: string) => void
  onCopySequentie?: (id: string) => void
  onInsertSequentie?: (id: string) => void
  onViewSequentie?: (id: string) => void

  // Terminologie callbacks
  onSearchTerminologie?: (query: string) => void
  onCopyTerm?: (id: string) => void
  onProposeTerm?: () => void

  // Stijlregels callbacks
  onGenerateChecklist?: (regelIds: string[]) => void

  // Documentstructuur callbacks
  onSelectNiveau?: (code: string) => void
  onViewTemplate?: (niveauCode: string) => void
  onGenerateCode?: (params: import('../schrijfstandaard/types').CodeGeneratorParams) => void
}
