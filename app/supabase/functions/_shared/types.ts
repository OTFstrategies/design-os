export interface PipelineRun {
  id: string
  titel: string
  status: 'actief' | 'voltooid' | 'review_nodig' | 'gefaald'
  categorie_code: string
  locatie: string
  gestart: string
  voltooid: string | null
  doorlooptijd_ms: number | null
  current_agent_id: string | null
  last_error: string | null
}

export interface AgentStap {
  id: string
  pipeline_run_id: string
  agent_id: string
  status: 'wacht' | 'actief' | 'voltooid' | 'fout' | 'overgeslagen' | 'afgebroken'
  volgorde: number
  duur_ms: number | null
  output: string | null
  started_at: string | null
  completed_at: string | null
  error_message: string | null
  retry_count: number
}

export interface AgentStapData {
  id: string
  agent_stap_id: string
  input_data: Record<string, unknown> | null
  output_data: Record<string, unknown> | null
  claude_request: Record<string, unknown> | null
  claude_response: Record<string, unknown> | null
  tokens_input: number | null
  tokens_output: number | null
}

export interface PipelineBestand {
  id: string
  pipeline_run_id: string
  type: 'pdf' | 'foto'
  bestandsnaam: string
  storage_path: string
  mime_type: string
  grootte_bytes: number
}

// Agent output types
export interface FotoAnalyseOutput {
  fotos: Array<{
    bestandsnaam: string
    tags: string[]
    beschrijving: string
    objecten: Array<{
      naam: string
      type: string
      confidence: number
    }>
  }>
  samenvatting: string
}

export interface DocumentParserOutput {
  stappen: Array<{
    nummer: number
    actie: string
    type: 'handeling' | 'veiligheid' | 'controle'
    veiligheid: boolean
    controle: boolean
    gereedschap: string[]
    materialen: string[]
  }>
  metadata: {
    totaalStappen: number
    veiligheidsStappen: number
    controleStappen: number
    gereedschapLijst: string[]
    materialenLijst: string[]
  }
}

export interface AnalyseOutput {
  matches: Array<{
    stapIndex: number
    zinId: string
    similarity: number
  }>
  nieuweZinnen: Array<{
    tekst: string
    suggestedCode: string
    tags: string[]
  }>
  enrichedStappen: Array<{
    nummer: number
    actie: string
    tags: string[]
    matchedZinId: string | null
  }>
}

export interface StijlOutput {
  gecorrigeerdeStappen: Array<{
    nummer: number
    origineel: string
    gecorrigeerd: string
    correcties: string[]
  }>
  totaalCorrecties: number
}

export interface ReviewOutput {
  score: number
  approved: boolean
  issues: Array<{
    type: 'veiligheid' | 'consistentie' | 'leesbaarheid' | 'compleetheid'
    ernst: 'laag' | 'middel' | 'hoog'
    beschrijving: string
    stapNummer: number | null
  }>
  recommendations: string[]
}

export interface OpslagOutput {
  documentCode: string
  versie: string
  storagePath: string
  nieuweZinnenToegevoegd: number
  bibliotheekUpdates: Array<{
    type: 'nieuw' | 'update'
    zinId: string
    tekst: string
  }>
}
