// =============================================================================
// Standaardzinnen Bibliotheek Types
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
// Schrijfstandaard & Structuur Types
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

export type RACIWaarde = 'R' | 'A' | 'C' | 'I'

export interface RACIRol {
  id: string
  code: string
  naam: string
  beschrijving: string
}

// =============================================================================
// AI-agents Types
// =============================================================================

export type AgentStatus = 'idle' | 'actief' | 'error'

export type AgentStapStatus = 'wacht' | 'actief' | 'voltooid' | 'fout' | 'overgeslagen' | 'afgebroken'

export type PipelineRunStatus = 'actief' | 'voltooid' | 'review_nodig' | 'gefaald'

export type ReviewStatus = 'goedgekeurd' | 'in_review' | 'afgekeurd'

export interface AgentConfiguratie {
  [key: string]: string | number | boolean | string[]
}

export interface AgentMetrics {
  runsVandaag: number
  gemiddeldeTijd: string
  succesRatio: number
}

export interface Agent {
  id: string
  nummer: string
  naam: string
  rol: string
  beschrijving: string
  status: AgentStatus
  configuratie: AgentConfiguratie
  metrics: AgentMetrics
}

export interface FotoTag {
  id: string
  naam: string
  tags: string[]
}

export interface AgentStap {
  agentId: string
  status: AgentStapStatus
  duur: string | null
  output: string | null
}

export interface PipelineResultaat {
  documentCode: string
  versie: string
  aantalStappen: number
  reviewStatus: ReviewStatus
  reviewOpmerkingen?: string[]
}

export interface PipelineRun {
  id: string
  titel: string
  status: PipelineRunStatus
  gestart: string
  voltooid: string | null
  doorlooptijd: string | null
  categorie: string
  locatie: string
  audioBestand: string
  audioDuur: string
  fotos: FotoTag[]
  kwaliteitsscore: number | null
  nieuweZinnen: number | null
  agentStappen: AgentStap[]
  resultaat: PipelineResultaat | null
  foutmelding?: string
}

export interface PipelineStatistieken {
  runsVandaag: number
  runsDezeWeek: number
  succesRatio: number
  gemiddeldeDoorlooptijd: string
  actieveRuns: number
  inReview: number
  nieuweZinnenDezeWeek: number
}

// =============================================================================
// Proceshuisbeheer Types
// =============================================================================

export type DocumentStatus = 'draft' | 'review' | 'active' | 'obsolete'

export type ProcesNiveau = 'N1' | 'N2' | 'N3' | 'N4' | 'N5'

export type ProcesDocumentType = 'WI' | 'PR' | 'DS' | 'FO'

export type RACICode = 'R' | 'A' | 'C' | 'I'

export type VersieStatus = 'active' | 'superseded'

export interface ProcesDocument {
  id: string
  code: string
  titel: string
  niveau: ProcesNiveau
  type: ProcesDocumentType
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
  niveau: ProcesNiveau
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
