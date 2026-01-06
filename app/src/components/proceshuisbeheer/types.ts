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

export interface ProceshuisbeheerProps {
  documenten: Document[]
  hierarchie: HierarchieNode[]
  personen: Persoon[]
  rollen: Rol[]
  raciMatrix: RACIToewijzing[]
  versieHistorie: VersieHistorie[]
  statistieken: Statistieken
  onFilterDocumenten?: (filters: DocumentFilters) => void
  onSortDocumenten?: (field: string, direction: 'asc' | 'desc') => void
  onOpenDocument?: (id: string) => void
  onChangeStatus?: (id: string, status: DocumentStatus) => void
  onToggleNode?: (nodeId: string) => void
  onSelectNode?: (nodeId: string) => void
  onOpenMiro?: (url: string) => void
  onViewHistory?: (documentId: string) => void
  onCompareVersions?: (documentId: string, v1: string, v2: string) => void
  onRevertToVersion?: (documentId: string, versie: string) => void
  onChangeRACI?: (documentId: string, persoonId: string, rol: RACICode | null) => void
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
