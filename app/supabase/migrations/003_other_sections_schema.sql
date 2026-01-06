-- =============================================================================
-- Schema for Proceshuisbeheer, Standaardzinnen Bibliotheek, Schrijfstandaard
-- =============================================================================

-- =============================================================================
-- PROCESHUISBEHEER
-- =============================================================================

CREATE TYPE document_status AS ENUM ('draft', 'review', 'active', 'obsolete');
CREATE TYPE document_niveau AS ENUM ('N1', 'N2', 'N3', 'N4', 'N5');
CREATE TYPE document_type AS ENUM ('WI', 'PR', 'DS', 'FO');
CREATE TYPE raci_code AS ENUM ('R', 'A', 'C', 'I');
CREATE TYPE versie_status AS ENUM ('active', 'superseded');

-- Afdelingen
CREATE TABLE afdelingen (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  naam TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Personen
CREATE TABLE personen (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  naam TEXT NOT NULL,
  functie TEXT NOT NULL,
  afdeling_id UUID REFERENCES afdelingen(id),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documenten
CREATE TABLE documenten (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  titel TEXT NOT NULL,
  niveau document_niveau NOT NULL,
  type document_type NOT NULL,
  status document_status DEFAULT 'draft',
  versie TEXT NOT NULL DEFAULT '1.0',
  eigenaar_id UUID REFERENCES personen(id),
  afdeling_id UUID REFERENCES afdelingen(id),
  parent_id UUID REFERENCES documenten(id),
  aantal_stappen INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hierarchie nodes (for process visualization)
CREATE TABLE hierarchie_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  niveau document_niveau NOT NULL,
  titel TEXT NOT NULL,
  code TEXT NOT NULL,
  miro_link TEXT,
  parent_id UUID REFERENCES hierarchie_nodes(id),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RACI rollen
CREATE TABLE raci_rollen (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code raci_code NOT NULL,
  naam TEXT NOT NULL,
  beschrijving TEXT,
  kleur TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RACI toewijzingen
CREATE TABLE raci_toewijzingen (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documenten(id) ON DELETE CASCADE,
  persoon_id UUID REFERENCES personen(id) ON DELETE CASCADE,
  rol raci_code NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(document_id, persoon_id)
);

-- Versie historie
CREATE TABLE versie_historie (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documenten(id) ON DELETE CASCADE,
  versie TEXT NOT NULL,
  datum TIMESTAMPTZ DEFAULT NOW(),
  auteur_id UUID REFERENCES personen(id),
  wijzigingen TEXT NOT NULL,
  status versie_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- STANDAARDZINNEN BIBLIOTHEEK
-- =============================================================================

-- Standaardzinnen categorieën
CREATE TABLE standaardzin_categorieen (
  code TEXT PRIMARY KEY,
  naam TEXT NOT NULL,
  beschrijving TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags
CREATE TABLE standaardzin_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prefix TEXT NOT NULL,
  waarde TEXT NOT NULL,
  categorie TEXT NOT NULL,
  kleur TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(prefix, waarde)
);

-- Placeholders
CREATE TABLE standaardzin_placeholders (
  naam TEXT PRIMARY KEY,
  format TEXT NOT NULL,
  toegestane_waarden TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Standaardzinnen
CREATE TABLE standaardzinnen (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  tekst TEXT NOT NULL,
  categorie_code TEXT REFERENCES standaardzin_categorieen(code),
  tags TEXT[] DEFAULT '{}',
  placeholders TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Standaardzin document links
CREATE TABLE standaardzin_document_links (
  standaardzin_id UUID REFERENCES standaardzinnen(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documenten(id) ON DELETE CASCADE,
  PRIMARY KEY (standaardzin_id, document_id)
);

-- Atomaire sequenties
CREATE TABLE atomaire_sequenties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  naam TEXT NOT NULL,
  volgorde_verplicht BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sequentie stappen
CREATE TABLE sequentie_stappen (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sequentie_id UUID REFERENCES atomaire_sequenties(id) ON DELETE CASCADE,
  standaardzin_code TEXT NOT NULL,
  volgorde INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sequentie document links
CREATE TABLE sequentie_document_links (
  sequentie_id UUID REFERENCES atomaire_sequenties(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documenten(id) ON DELETE CASCADE,
  PRIMARY KEY (sequentie_id, document_id)
);

-- =============================================================================
-- SCHRIJFSTANDAARD & STRUCTUUR
-- =============================================================================

-- Terminologie categorieën
CREATE TABLE terminologie_categorieen (
  code TEXT PRIMARY KEY,
  naam TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Terminologie
CREATE TABLE terminologie (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voorkeursterm TEXT NOT NULL,
  verboden_synoniemen TEXT[] DEFAULT '{}',
  definitie TEXT,
  context TEXT,
  voorbeelden TEXT[] DEFAULT '{}',
  categorie_code TEXT REFERENCES terminologie_categorieen(code),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stijlregel categorieën
CREATE TABLE stijlregel_categorieen (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  naam TEXT NOT NULL,
  beschrijving TEXT,
  icoon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stijlregels
CREATE TABLE stijlregels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  categorie_id UUID REFERENCES stijlregel_categorieen(id),
  titel TEXT NOT NULL,
  beschrijving TEXT NOT NULL,
  voorbeeld_goed TEXT,
  voorbeeld_fout TEXT,
  toelichting TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document niveaus (L1-L5)
CREATE TABLE document_niveaus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  naam TEXT NOT NULL,
  beschrijving TEXT,
  doelgroep TEXT,
  voorbeelden TEXT[] DEFAULT '{}',
  template_secties TEXT[] DEFAULT '{}',
  kleur TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document types (WI, PR, DS, FO)
CREATE TABLE document_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  naam TEXT NOT NULL,
  niveau_code TEXT REFERENCES document_niveaus(code),
  beschrijving TEXT,
  structuur_vereisten TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schrijfstandaard rollen (for RACI matrix in schrijfstandaard)
CREATE TABLE schrijfstandaard_rollen (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  naam TEXT NOT NULL,
  beschrijving TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document type RACI matrix
CREATE TABLE document_type_raci (
  document_type_code TEXT REFERENCES document_types(code) ON DELETE CASCADE,
  rol_code TEXT REFERENCES schrijfstandaard_rollen(code) ON DELETE CASCADE,
  raci_waarde raci_code NOT NULL,
  PRIMARY KEY (document_type_code, rol_code)
);

-- Codering formaat
CREATE TABLE codering_formaat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patroon TEXT NOT NULL,
  voorbeeld TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Codering segmenten
CREATE TABLE codering_segmenten (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  formaat_id UUID REFERENCES codering_formaat(id) ON DELETE CASCADE,
  naam TEXT NOT NULL,
  beschrijving TEXT,
  voorbeelden TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- Indexes
-- =============================================================================

CREATE INDEX idx_documenten_status ON documenten(status);
CREATE INDEX idx_documenten_niveau ON documenten(niveau);
CREATE INDEX idx_documenten_type ON documenten(type);
CREATE INDEX idx_documenten_parent ON documenten(parent_id);
CREATE INDEX idx_documenten_eigenaar ON documenten(eigenaar_id);
CREATE INDEX idx_hierarchie_parent ON hierarchie_nodes(parent_id);
CREATE INDEX idx_versie_historie_document ON versie_historie(document_id);
CREATE INDEX idx_raci_toewijzingen_document ON raci_toewijzingen(document_id);
CREATE INDEX idx_standaardzinnen_categorie ON standaardzinnen(categorie_code);
CREATE INDEX idx_sequentie_stappen_sequentie ON sequentie_stappen(sequentie_id);
CREATE INDEX idx_terminologie_categorie ON terminologie(categorie_code);
CREATE INDEX idx_stijlregels_categorie ON stijlregels(categorie_id);

-- =============================================================================
-- Row Level Security
-- =============================================================================

ALTER TABLE afdelingen ENABLE ROW LEVEL SECURITY;
ALTER TABLE personen ENABLE ROW LEVEL SECURITY;
ALTER TABLE documenten ENABLE ROW LEVEL SECURITY;
ALTER TABLE hierarchie_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE raci_rollen ENABLE ROW LEVEL SECURITY;
ALTER TABLE raci_toewijzingen ENABLE ROW LEVEL SECURITY;
ALTER TABLE versie_historie ENABLE ROW LEVEL SECURITY;
ALTER TABLE standaardzin_categorieen ENABLE ROW LEVEL SECURITY;
ALTER TABLE standaardzin_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE standaardzin_placeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE standaardzinnen ENABLE ROW LEVEL SECURITY;
ALTER TABLE standaardzin_document_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE atomaire_sequenties ENABLE ROW LEVEL SECURITY;
ALTER TABLE sequentie_stappen ENABLE ROW LEVEL SECURITY;
ALTER TABLE sequentie_document_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE terminologie_categorieen ENABLE ROW LEVEL SECURITY;
ALTER TABLE terminologie ENABLE ROW LEVEL SECURITY;
ALTER TABLE stijlregel_categorieen ENABLE ROW LEVEL SECURITY;
ALTER TABLE stijlregels ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_niveaus ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE schrijfstandaard_rollen ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_type_raci ENABLE ROW LEVEL SECURITY;
ALTER TABLE codering_formaat ENABLE ROW LEVEL SECURITY;
ALTER TABLE codering_segmenten ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "public_read" ON afdelingen FOR SELECT USING (true);
CREATE POLICY "public_read" ON personen FOR SELECT USING (true);
CREATE POLICY "public_read" ON documenten FOR SELECT USING (true);
CREATE POLICY "public_read" ON hierarchie_nodes FOR SELECT USING (true);
CREATE POLICY "public_read" ON raci_rollen FOR SELECT USING (true);
CREATE POLICY "public_read" ON raci_toewijzingen FOR SELECT USING (true);
CREATE POLICY "public_read" ON versie_historie FOR SELECT USING (true);
CREATE POLICY "public_read" ON standaardzin_categorieen FOR SELECT USING (true);
CREATE POLICY "public_read" ON standaardzin_tags FOR SELECT USING (true);
CREATE POLICY "public_read" ON standaardzin_placeholders FOR SELECT USING (true);
CREATE POLICY "public_read" ON standaardzinnen FOR SELECT USING (true);
CREATE POLICY "public_read" ON standaardzin_document_links FOR SELECT USING (true);
CREATE POLICY "public_read" ON atomaire_sequenties FOR SELECT USING (true);
CREATE POLICY "public_read" ON sequentie_stappen FOR SELECT USING (true);
CREATE POLICY "public_read" ON sequentie_document_links FOR SELECT USING (true);
CREATE POLICY "public_read" ON terminologie_categorieen FOR SELECT USING (true);
CREATE POLICY "public_read" ON terminologie FOR SELECT USING (true);
CREATE POLICY "public_read" ON stijlregel_categorieen FOR SELECT USING (true);
CREATE POLICY "public_read" ON stijlregels FOR SELECT USING (true);
CREATE POLICY "public_read" ON document_niveaus FOR SELECT USING (true);
CREATE POLICY "public_read" ON document_types FOR SELECT USING (true);
CREATE POLICY "public_read" ON schrijfstandaard_rollen FOR SELECT USING (true);
CREATE POLICY "public_read" ON document_type_raci FOR SELECT USING (true);
CREATE POLICY "public_read" ON codering_formaat FOR SELECT USING (true);
CREATE POLICY "public_read" ON codering_segmenten FOR SELECT USING (true);

-- Public write policies (for development - restrict in production)
CREATE POLICY "public_write" ON documenten FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update" ON documenten FOR UPDATE USING (true);
CREATE POLICY "public_write" ON raci_toewijzingen FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update" ON raci_toewijzingen FOR UPDATE USING (true);
CREATE POLICY "public_delete" ON raci_toewijzingen FOR DELETE USING (true);
CREATE POLICY "public_write" ON versie_historie FOR INSERT WITH CHECK (true);
CREATE POLICY "public_write" ON standaardzinnen FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update" ON standaardzinnen FOR UPDATE USING (true);
CREATE POLICY "public_write" ON terminologie FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update" ON terminologie FOR UPDATE USING (true);

-- =============================================================================
-- Triggers
-- =============================================================================

CREATE TRIGGER update_documenten_updated_at
  BEFORE UPDATE ON documenten
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_standaardzinnen_updated_at
  BEFORE UPDATE ON standaardzinnen
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_terminologie_updated_at
  BEFORE UPDATE ON terminologie
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
