-- =============================================================================
-- Seed Data for AI Agents
-- =============================================================================

-- Insert categorieën
INSERT INTO categorieen (code, naam) VALUES
  ('HEF-BEW', 'Heftruckbewegingen'),
  ('OHD-EL', 'Onderhoud Elektrisch'),
  ('DISP', 'Dispatch'),
  ('PAL-VER', 'Pallet Verwerking'),
  ('ORD-PIC', 'Order Picking'),
  ('REI-KOE', 'Reiniging Koeling'),
  ('NRG-NOO', 'Energie Noodprocedures');

-- Insert the 7 agents
INSERT INTO agents (id, nummer, naam, rol, beschrijving, status, configuratie, runs_vandaag, gemiddelde_tijd_ms, succes_ratio) VALUES
  ('agent-1a', '1A', 'Foto Analyzer', 'Beeldherkenning', 'Beeldherkenning & labeling van apparatuur, locaties, materialen', 'idle',
   '{"model": "gpt-4-vision", "maxPhotos": 10, "confidenceThreshold": 0.8}'::jsonb, 12, 8200, 98.00),

  ('agent-1b', '1B', 'Stappenplan Generator', 'Transcriptie', 'Transcriptie van Plaud-opname naar gestructureerde stappen', 'actief',
   '{"model": "whisper-large", "language": "nl", "punctuation": true}'::jsonb, 12, 15400, 95.00),

  ('agent-2', '2', 'Analyse & Codering', 'Matching', 'Matching met standaardzinnen en terminologie uit bibliotheek', 'idle',
   '{"similarityThreshold": 0.85, "maxSuggestions": 5, "autoMatch": true}'::jsonb, 11, 4100, 99.00),

  ('agent-3', '3', 'Stijl Agent', 'Formattering', 'Toepassen schrijfstandaard, format en documentstructuur', 'idle',
   '{"strictMode": true, "autoCorrect": false, "styleGuide": "HSF-2024"}'::jsonb, 10, 3800, 97.00),

  ('agent-4', '4', 'Review Agent', 'Validatie', 'Kwaliteitsvalidatie, compliance check, suggesties', 'idle',
   '{"complianceLevel": "strict", "checklistEnabled": true, "minScore": 70}'::jsonb, 9, 5200, 94.00),

  ('agent-5', '5', 'Opslag Agent', 'Archivering', 'Documentatie archivering en bibliotheek-integratie', 'idle',
   '{"autoArchive": true, "versionControl": true, "notifyOnSave": true}'::jsonb, 8, 2100, 100.00),

  ('agent-6', '6', 'Status Tracker', 'Monitoring', 'Realtime pipeline monitoring en notificaties', 'actief',
   '{"refreshInterval": 5000, "alertOnError": true, "slackEnabled": false}'::jsonb, 45, 100, 100.00);

-- Insert the active Plaud prompt template
INSERT INTO plaud_prompt_templates (titel, versie, template, instructies, is_active) VALUES
  ('Standaard Procedure Opname', 'v2.1',
   'Je bent een expert in het vastleggen van werkprocedures. Ik ga nu een taak uitvoeren en hardop beschrijven wat ik doe. Maak van mijn beschrijving een gestructureerde werkinstructie. Let op: - Elke fysieke handeling = apart stap - Gebruik imperatiefvorm (Pak, Draai, Controleer) - Noteer gereedschap en materialen - Markeer veiligheidspunten met [VEILIGHEID] - Markeer kwaliteitscontroles met [CONTROLE] Ik begin nu met: [TAAKNAAM]',
   ARRAY[
     'Zorg voor een rustige omgeving zonder achtergrondgeluid',
     'Houd de Plaud op max 50cm afstand',
     'Beschrijf elke handeling terwijl je deze uitvoert',
     'Noem expliciet welk gereedschap je pakt',
     'Geef aan wanneer je iets controleert'
   ],
   true);

-- Insert sample pipeline runs
INSERT INTO pipeline_runs (id, titel, status, gestart, voltooid, doorlooptijd_ms, categorie_code, locatie, audio_bestand, audio_duur, kwaliteitsscore, nieuwe_zinnen, document_code, document_versie, aantal_stappen, review_status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Schoonmaakprocedure koelcel', 'actief',
   NOW() - INTERVAL '5 minutes', NULL, NULL,
   'REI-KOE', 'Koelcel 3', 'schoonmaak-koelcel-3.m4a', '4m 23s',
   NULL, NULL, NULL, NULL, NULL, NULL),

  ('22222222-2222-2222-2222-222222222222', 'Heftruckinspectie dagelijkse controle', 'voltooid',
   NOW() - INTERVAL '2 hours', NOW() - INTERVAL '118 minutes', 102000,
   'HEF-BEW', 'Warehouse A', 'heftruck-check-dagelijks.m4a', '2m 15s',
   88, 0, 'WI-HEF-001', 'v1.2', 12, 'goedgekeurd'),

  ('33333333-3333-3333-3333-333333333333', 'Palletwikkelmachine instellen', 'review_nodig',
   NOW() - INTERVAL '1 hour', NOW() - INTERVAL '57 minutes', 195000,
   'PAL-VER', 'Expeditie', 'palletwikkel-instellen.m4a', '5m 42s',
   72, 5, 'WI-PAL-012', 'v1.0', 18, 'in_review'),

  ('44444444-4444-4444-4444-444444444444', 'Orderpicken zone B', 'gefaald',
   NOW() - INTERVAL '3 hours', NOW() - INTERVAL '178 minutes', 105000,
   'ORD-PIC', 'Zone B', 'orderpick-zone-b.m4a', '3m 10s',
   NULL, NULL, NULL, NULL, NULL, NULL),

  ('55555555-5555-5555-5555-555555555555', 'Noodprocedure stroomuitval', 'voltooid',
   NOW() - INTERVAL '4 hours', NOW() - INTERVAL '236 minutes', 212000,
   'NRG-NOO', 'Technische ruimte', 'noodprocedure-stroom.m4a', '6m 55s',
   95, 3, 'WI-NRG-008', 'v2.0', 24, 'goedgekeurd');

-- Insert foto tags for the active run
INSERT INTO pipeline_run_fotos (pipeline_run_id, naam, tags) VALUES
  ('11111111-1111-1111-1111-111111111111', 'koelcel-deur.jpg', ARRAY['@loc:koelcel', '@equip:deur']),
  ('11111111-1111-1111-1111-111111111111', 'schoonmaakmiddelen.jpg', ARRAY['@mat:schoonmaak', '@safe:chemisch']);

-- Insert agent stappen for the active run
INSERT INTO agent_stappen (pipeline_run_id, agent_id, status, duur_ms, output, volgorde) VALUES
  ('11111111-1111-1111-1111-111111111111', 'agent-1a', 'voltooid', 8500, 'Foto analyse voltooid: 2 objecten herkend', 1),
  ('11111111-1111-1111-1111-111111111111', 'agent-1b', 'voltooid', 16200, 'Transcriptie voltooid: 15 stappen gedetecteerd', 2),
  ('11111111-1111-1111-1111-111111111111', 'agent-2', 'actief', NULL, NULL, 3),
  ('11111111-1111-1111-1111-111111111111', 'agent-3', 'wacht', NULL, NULL, 4),
  ('11111111-1111-1111-1111-111111111111', 'agent-4', 'wacht', NULL, NULL, 5),
  ('11111111-1111-1111-1111-111111111111', 'agent-5', 'wacht', NULL, NULL, 6);

-- Insert agent stappen for completed runs
INSERT INTO agent_stappen (pipeline_run_id, agent_id, status, duur_ms, output, volgorde) VALUES
  ('22222222-2222-2222-2222-222222222222', 'agent-1a', 'voltooid', 7800, 'Analyse voltooid', 1),
  ('22222222-2222-2222-2222-222222222222', 'agent-1b', 'voltooid', 14200, 'Transcriptie voltooid', 2),
  ('22222222-2222-2222-2222-222222222222', 'agent-2', 'voltooid', 3900, 'Codering voltooid', 3),
  ('22222222-2222-2222-2222-222222222222', 'agent-3', 'voltooid', 3500, 'Stijl toegepast', 4),
  ('22222222-2222-2222-2222-222222222222', 'agent-4', 'voltooid', 4800, 'Review goedgekeurd', 5),
  ('22222222-2222-2222-2222-222222222222', 'agent-5', 'voltooid', 1900, 'Opgeslagen', 6);

-- Insert agent stappen for review_nodig run
INSERT INTO agent_stappen (pipeline_run_id, agent_id, status, duur_ms, output, volgorde) VALUES
  ('33333333-3333-3333-3333-333333333333', 'agent-1a', 'voltooid', 9200, 'Analyse voltooid', 1),
  ('33333333-3333-3333-3333-333333333333', 'agent-1b', 'voltooid', 18500, 'Transcriptie voltooid', 2),
  ('33333333-3333-3333-3333-333333333333', 'agent-2', 'voltooid', 4500, 'Codering voltooid', 3),
  ('33333333-3333-3333-3333-333333333333', 'agent-3', 'voltooid', 4100, 'Stijl toegepast', 4),
  ('33333333-3333-3333-3333-333333333333', 'agent-4', 'voltooid', 5500, 'Review nodig: 5 nieuwe zinnen', 5),
  ('33333333-3333-3333-3333-333333333333', 'agent-5', 'wacht', NULL, NULL, 6);

-- Insert agent stappen for failed run
INSERT INTO agent_stappen (pipeline_run_id, agent_id, status, duur_ms, output, volgorde) VALUES
  ('44444444-4444-4444-4444-444444444444', 'agent-1a', 'voltooid', 8100, 'Analyse voltooid', 1),
  ('44444444-4444-4444-4444-444444444444', 'agent-1b', 'fout', 45000, 'Fout: Audio kwaliteit te laag', 2),
  ('44444444-4444-4444-4444-444444444444', 'agent-2', 'afgebroken', NULL, NULL, 3),
  ('44444444-4444-4444-4444-444444444444', 'agent-3', 'afgebroken', NULL, NULL, 4),
  ('44444444-4444-4444-4444-444444444444', 'agent-4', 'afgebroken', NULL, NULL, 5),
  ('44444444-4444-4444-4444-444444444444', 'agent-5', 'afgebroken', NULL, NULL, 6);

-- Update the failed run with error message
UPDATE pipeline_runs
SET foutmelding = 'Audio kwaliteit te laag voor betrouwbare transcriptie. Neem opnieuw op in een stillere omgeving.'
WHERE id = '44444444-4444-4444-4444-444444444444';
