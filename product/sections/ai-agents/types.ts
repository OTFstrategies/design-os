// =============================================================================
// Data Types
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

export interface PlaudPromptTemplate {
  titel: string
  versie: string
  laatstBijgewerkt: string
  template: string
  instructies: string[]
}

export interface Categorie {
  code: string
  naam: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface AIAgentsProps {
  /** De 7 pipeline agents met configuratie */
  agents: Agent[]
  /** Alle pipeline runs (actief en historisch) */
  pipelineRuns: PipelineRun[]
  /** Aggregatie statistieken voor dashboard */
  statistieken: PipelineStatistieken
  /** De Plaud prompt template */
  plaudPromptTemplate: PlaudPromptTemplate
  /** Beschikbare categorieën voor nieuwe runs */
  categorieen: Categorie[]

  // Pipeline Run callbacks
  /** Nieuwe pipeline run starten */
  onStartRun?: (params: NieuweRunParams) => void
  /** Run annuleren */
  onCancelRun?: (runId: string) => void
  /** Gefaalde run opnieuw starten */
  onRetryRun?: (runId: string, fromAgentId?: string) => void
  /** Run details bekijken */
  onViewRun?: (runId: string) => void

  // Review callbacks
  /** Run resultaat goedkeuren */
  onApproveRun?: (runId: string) => void
  /** Run resultaat afwijzen met feedback */
  onRejectRun?: (runId: string, feedback: string) => void
  /** Nieuwe standaardzinnen goedkeuren */
  onApproveZinnen?: (runId: string, zinIds: string[]) => void

  // Agent callbacks
  /** Agent configuratie openen */
  onConfigureAgent?: (agentId: string) => void
  /** Agent configuratie opslaan */
  onSaveAgentConfig?: (agentId: string, config: AgentConfiguratie) => void
  /** Agent logs bekijken */
  onViewAgentLogs?: (agentId: string) => void

  // Export callbacks
  /** Document exporteren */
  onExportDocument?: (runId: string) => void
}

export interface NieuweRunParams {
  titel: string
  categorie: string
  locatie: string
  audioFile: File
  fotos: File[]
}

// =============================================================================
// Tab-specific Props
// =============================================================================

export interface DashboardTabProps {
  pipelineRuns: PipelineRun[]
  statistieken: PipelineStatistieken
  onViewRun?: (runId: string) => void
  onRetryRun?: (runId: string) => void
  onApproveRun?: (runId: string) => void
}

export interface AgentsTabProps {
  agents: Agent[]
  onConfigureAgent?: (agentId: string) => void
  onViewAgentLogs?: (agentId: string) => void
}

export interface NieuweRunTabProps {
  categorieen: Categorie[]
  plaudPromptTemplate: PlaudPromptTemplate
  onStartRun?: (params: NieuweRunParams) => void
}

export interface RunDetailProps {
  run: PipelineRun
  agents: Agent[]
  onApprove?: () => void
  onReject?: (feedback: string) => void
  onRetry?: (fromAgentId?: string) => void
  onExport?: () => void
}

export interface PipelineVisualisatieProps {
  agentStappen: AgentStap[]
  agents: Agent[]
  onClickStap?: (agentId: string) => void
}
