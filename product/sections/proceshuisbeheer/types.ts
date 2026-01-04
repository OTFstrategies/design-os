// =============================================================================
// Data Types
// =============================================================================

export type DocumentStatus = 'draft' | 'review' | 'active' | 'obsolete'

export type DocumentNiveau = 'N1' | 'N2' | 'N3' | 'N4' | 'N5'

export type DocumentType = 'WI' | 'PR' | 'DS' | 'FO'

export type RACICode = 'R' | 'A' | 'C' | 'I'

export type VersieStatus = 'active' | 'superseded'

export interface Document {
  id: string
  code: string
  titel: string
  niveau: DocumentNiveau
  type: DocumentType
  status: DocumentStatus
  versie: string
  laatstGewijzigd: string
  eigenaar: string
  afdeling: string
  parentId: string
  aantalStappen: number
  tags: string[]
}

export interface HierarchieNode {
  id: string
  niveau: DocumentNiveau
  titel: string
  code: string
  expanded: boolean
  miroLink?: string
  documentCount?: number
  children: HierarchieNode[]
}

export interface Persoon {
  id: string
  naam: string
  functie: string
  afdeling: string
  email: string
}

export interface Rol {
  id: string
  code: RACICode
  naam: string
  beschrijving: string
  kleur: string
}

export interface RACIToewijzing {
  documentId: string
  documentCode: string
  documentTitel: string
  toewijzingen: Record<string, RACICode>
}

export interface VersieRecord {
  versie: string
  datum: string
  auteur: string
  wijzigingen: string
  status: VersieStatus
}

export interface VersieHistorie {
  documentId: string
  documentCode: string
  versies: VersieRecord[]
}

export interface Statistieken {
  totaalDocumenten: number
  actief: number
  review: number
  draft: number
  obsolete: number
  gemiddeldeVersie: string
  laatsteUpdate: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface ProceshuisbeheerProps {
  /** Alle N4/N5 documenten */
  documenten: Document[]
  /** N1-N5 hiërarchie structuur */
  hierarchie: HierarchieNode[]
  /** Personen voor RACI toewijzingen */
  personen: Persoon[]
  /** RACI rollen definities */
  rollen: Rol[]
  /** RACI matrix per document */
  raciMatrix: RACIToewijzing[]
  /** Versiehistorie per document */
  versieHistorie: VersieHistorie[]
  /** Dashboard statistieken */
  statistieken: Statistieken

  // Document Dashboard callbacks
  /** Filter documenten */
  onFilterDocumenten?: (filters: DocumentFilters) => void
  /** Sorteer documenten */
  onSortDocumenten?: (field: string, direction: 'asc' | 'desc') => void
  /** Document openen */
  onOpenDocument?: (id: string) => void
  /** Document status wijzigen */
  onChangeStatus?: (id: string, status: DocumentStatus) => void

  // Hiërarchie Browser callbacks
  /** Node uitklappen/inklappen */
  onToggleNode?: (nodeId: string) => void
  /** Navigeren naar node */
  onSelectNode?: (nodeId: string) => void
  /** MIRO board openen */
  onOpenMiro?: (url: string) => void

  // Versiebeheer callbacks
  /** Versiehistorie bekijken */
  onViewHistory?: (documentId: string) => void
  /** Versies vergelijken */
  onCompareVersions?: (documentId: string, v1: string, v2: string) => void
  /** Terugdraaien naar versie */
  onRevertToVersion?: (documentId: string, versie: string) => void

  // RACI Beheer callbacks
  /** RACI toewijzing wijzigen */
  onChangeRACI?: (documentId: string, persoonId: string, rol: RACICode | null) => void
  /** RACI opslaan */
  onSaveRACI?: (documentId: string) => void
}

export interface DocumentFilters {
  status?: DocumentStatus[]
  niveau?: DocumentNiveau[]
  type?: DocumentType[]
  afdeling?: string
  eigenaar?: string
  zoekterm?: string
}

// =============================================================================
// Tab-specific Props
// =============================================================================

export interface DocumentDashboardProps {
  documenten: Document[]
  statistieken: Statistieken
  onFilter?: (filters: DocumentFilters) => void
  onSort?: (field: string, direction: 'asc' | 'desc') => void
  onOpen?: (id: string) => void
  onChangeStatus?: (id: string, status: DocumentStatus) => void
}

export interface HierarchieBrowserProps {
  hierarchie: HierarchieNode[]
  onToggleNode?: (nodeId: string) => void
  onSelectNode?: (nodeId: string) => void
  onOpenMiro?: (url: string) => void
}

export interface VersiebeheerProps {
  versieHistorie: VersieHistorie[]
  documenten: Document[]
  onViewHistory?: (documentId: string) => void
  onCompare?: (documentId: string, v1: string, v2: string) => void
  onRevert?: (documentId: string, versie: string) => void
}

export interface RACIBeheerProps {
  raciMatrix: RACIToewijzing[]
  personen: Persoon[]
  rollen: Rol[]
  onChangeRACI?: (documentId: string, persoonId: string, rol: RACICode | null) => void
  onSave?: (documentId: string) => void
}
