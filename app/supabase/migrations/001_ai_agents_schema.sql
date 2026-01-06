-- =============================================================================
-- AI Agents Schema for Proceshuis HSF
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- Enums
-- =============================================================================

CREATE TYPE agent_status AS ENUM ('idle', 'actief', 'error');
CREATE TYPE agent_stap_status AS ENUM ('wacht', 'actief', 'voltooid', 'fout', 'overgeslagen', 'afgebroken');
CREATE TYPE pipeline_run_status AS ENUM ('actief', 'voltooid', 'review_nodig', 'gefaald');
CREATE TYPE review_status AS ENUM ('goedgekeurd', 'in_review', 'afgekeurd');

-- =============================================================================
-- Tables
-- =============================================================================

-- Categorieën voor pipeline runs
CREATE TABLE categorieen (
  code TEXT PRIMARY KEY,
  naam TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- De 7 AI agents in de pipeline
CREATE TABLE agents (
  id TEXT PRIMARY KEY,
  nummer TEXT NOT NULL,
  naam TEXT NOT NULL,
  rol TEXT NOT NULL,
  beschrijving TEXT NOT NULL,
  status agent_status DEFAULT 'idle',
  configuratie JSONB DEFAULT '{}',
  runs_vandaag INTEGER DEFAULT 0,
  gemiddelde_tijd_ms INTEGER DEFAULT 0,
  succes_ratio NUMERIC(5,2) DEFAULT 100.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plaud prompt templates
CREATE TABLE plaud_prompt_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titel TEXT NOT NULL,
  versie TEXT NOT NULL,
  template TEXT NOT NULL,
  instructies TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pipeline runs
CREATE TABLE pipeline_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titel TEXT NOT NULL,
  status pipeline_run_status DEFAULT 'actief',
  gestart TIMESTAMPTZ DEFAULT NOW(),
  voltooid TIMESTAMPTZ,
  doorlooptijd_ms INTEGER,
  categorie_code TEXT REFERENCES categorieen(code),
  locatie TEXT NOT NULL,
  audio_bestand TEXT NOT NULL,
  audio_duur TEXT NOT NULL,
  kwaliteitsscore INTEGER,
  nieuwe_zinnen INTEGER DEFAULT 0,
  -- Resultaat velden
  document_code TEXT,
  document_versie TEXT,
  aantal_stappen INTEGER,
  review_status review_status,
  review_opmerkingen TEXT[],
  foutmelding TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Foto tags voor pipeline runs
CREATE TABLE pipeline_run_fotos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pipeline_run_id UUID REFERENCES pipeline_runs(id) ON DELETE CASCADE,
  naam TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent stappen binnen een pipeline run
CREATE TABLE agent_stappen (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pipeline_run_id UUID REFERENCES pipeline_runs(id) ON DELETE CASCADE,
  agent_id TEXT REFERENCES agents(id),
  status agent_stap_status DEFAULT 'wacht',
  duur_ms INTEGER,
  output TEXT,
  volgorde INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- Indexes
-- =============================================================================

CREATE INDEX idx_pipeline_runs_status ON pipeline_runs(status);
CREATE INDEX idx_pipeline_runs_categorie ON pipeline_runs(categorie_code);
CREATE INDEX idx_pipeline_runs_gestart ON pipeline_runs(gestart DESC);
CREATE INDEX idx_agent_stappen_run ON agent_stappen(pipeline_run_id);
CREATE INDEX idx_agent_stappen_agent ON agent_stappen(agent_id);
CREATE INDEX idx_pipeline_run_fotos_run ON pipeline_run_fotos(pipeline_run_id);

-- =============================================================================
-- Row Level Security
-- =============================================================================

ALTER TABLE categorieen ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE plaud_prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_run_fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_stappen ENABLE ROW LEVEL SECURITY;

-- Allow public read access (adjust based on your auth requirements)
CREATE POLICY "Allow public read on categorieen" ON categorieen FOR SELECT USING (true);
CREATE POLICY "Allow public read on agents" ON agents FOR SELECT USING (true);
CREATE POLICY "Allow public read on plaud_prompt_templates" ON plaud_prompt_templates FOR SELECT USING (true);
CREATE POLICY "Allow public read on pipeline_runs" ON pipeline_runs FOR SELECT USING (true);
CREATE POLICY "Allow public read on pipeline_run_fotos" ON pipeline_run_fotos FOR SELECT USING (true);
CREATE POLICY "Allow public read on agent_stappen" ON agent_stappen FOR SELECT USING (true);

-- Allow public insert/update for now (add auth later)
CREATE POLICY "Allow public insert on pipeline_runs" ON pipeline_runs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on pipeline_runs" ON pipeline_runs FOR UPDATE USING (true);
CREATE POLICY "Allow public insert on pipeline_run_fotos" ON pipeline_run_fotos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert on agent_stappen" ON agent_stappen FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on agent_stappen" ON agent_stappen FOR UPDATE USING (true);
CREATE POLICY "Allow public update on agents" ON agents FOR UPDATE USING (true);

-- =============================================================================
-- Functions
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pipeline_runs_updated_at
  BEFORE UPDATE ON pipeline_runs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plaud_prompt_templates_updated_at
  BEFORE UPDATE ON plaud_prompt_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_stappen_updated_at
  BEFORE UPDATE ON agent_stappen
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to format duration from ms to readable string
CREATE OR REPLACE FUNCTION format_duration(ms INTEGER)
RETURNS TEXT AS $$
BEGIN
  IF ms IS NULL THEN
    RETURN NULL;
  ELSIF ms < 1000 THEN
    RETURN ms || 'ms';
  ELSIF ms < 60000 THEN
    RETURN ROUND(ms / 1000.0, 1) || 's';
  ELSE
    RETURN FLOOR(ms / 60000) || 'm ' || FLOOR((ms % 60000) / 1000) || 's';
  END IF;
END;
$$ language 'plpgsql';
