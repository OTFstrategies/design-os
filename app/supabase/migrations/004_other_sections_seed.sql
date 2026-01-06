-- =============================================================================
-- Seed Data for Proceshuisbeheer, Standaardzinnen, Schrijfstandaard
-- =============================================================================

-- =============================================================================
-- PROCESHUISBEHEER
-- =============================================================================

-- Afdelingen
INSERT INTO afdelingen (id, code, naam) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'LOG', 'Logistiek'),
  ('a2222222-2222-2222-2222-222222222222', 'PROD', 'Productie'),
  ('a3333333-3333-3333-3333-333333333333', 'QA', 'Quality Assurance'),
  ('a4444444-4444-4444-4444-444444444444', 'HR', 'Human Resources'),
  ('a5555555-5555-5555-5555-555555555555', 'TECH', 'Technische Dienst');

-- Personen
INSERT INTO personen (id, naam, functie, afdeling_id, email) VALUES
  ('p1111111-1111-1111-1111-111111111111', 'Jan de Vries', 'Logistiek Manager', 'a1111111-1111-1111-1111-111111111111', 'j.devries@hsf.nl'),
  ('p2222222-2222-2222-2222-222222222222', 'Maria Jansen', 'Kwaliteitsmanager', 'a3333333-3333-3333-3333-333333333333', 'm.jansen@hsf.nl'),
  ('p3333333-3333-3333-3333-333333333333', 'Pieter Bakker', 'Teamleider Warehouse', 'a1111111-1111-1111-1111-111111111111', 'p.bakker@hsf.nl'),
  ('p4444444-4444-4444-4444-444444444444', 'Lisa van den Berg', 'Productie Supervisor', 'a2222222-2222-2222-2222-222222222222', 'l.vandenberg@hsf.nl'),
  ('p5555555-5555-5555-5555-555555555555', 'Thomas Mulder', 'Technisch Specialist', 'a5555555-5555-5555-5555-555555555555', 't.mulder@hsf.nl');

-- Documenten
INSERT INTO documenten (id, code, titel, niveau, type, status, versie, eigenaar_id, afdeling_id, aantal_stappen, tags) VALUES
  ('d1111111-1111-1111-1111-111111111111', 'WI-HEF-001', 'Heftruck dagelijkse inspectie', 'N4', 'WI', 'active', '1.2', 'p3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 12, ARRAY['heftruck', 'veiligheid', 'dagelijks']),
  ('d2222222-2222-2222-2222-222222222222', 'WI-PAL-001', 'Pallet inboeken procedure', 'N4', 'WI', 'active', '2.0', 'p3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 8, ARRAY['pallet', 'WMS', 'ontvangst']),
  ('d3333333-3333-3333-3333-333333333333', 'PR-LOG-001', 'Goederenontvangst procedure', 'N3', 'PR', 'active', '1.5', 'p1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 15, ARRAY['ontvangst', 'logistiek']),
  ('d4444444-4444-4444-4444-444444444444', 'WI-ORD-001', 'Orderpicken standaard', 'N4', 'WI', 'review', '1.0', 'p3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 10, ARRAY['orderpick', 'warehouse']),
  ('d5555555-5555-5555-5555-555555555555', 'DS-VEI-001', 'Veiligheidshandboek magazijn', 'N5', 'DS', 'active', '3.0', 'p2222222-2222-2222-2222-222222222222', 'a3333333-3333-3333-3333-333333333333', 0, ARRAY['veiligheid', 'handboek']),
  ('d6666666-6666-6666-6666-666666666666', 'FO-HEF-001', 'Heftruck inspectie checklist', 'N5', 'FO', 'active', '1.1', 'p3333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111', 0, ARRAY['heftruck', 'checklist']),
  ('d7777777-7777-7777-7777-777777777777', 'WI-REI-001', 'Schoonmaakprocedure koelcel', 'N4', 'WI', 'draft', '0.9', 'p4444444-4444-4444-4444-444444444444', 'a2222222-2222-2222-2222-222222222222', 18, ARRAY['schoonmaak', 'koeling', 'hygiëne']),
  ('d8888888-8888-8888-8888-888888888888', 'PR-QA-001', 'Kwaliteitscontrole procedure', 'N3', 'PR', 'active', '2.1', 'p2222222-2222-2222-2222-222222222222', 'a3333333-3333-3333-3333-333333333333', 12, ARRAY['kwaliteit', 'controle']);

-- Hierarchie nodes
INSERT INTO hierarchie_nodes (id, niveau, titel, code, parent_id, sort_order, miro_link) VALUES
  ('h1111111-1111-1111-1111-111111111111', 'N1', 'Kwaliteitsbeleid', 'KB-001', NULL, 1, 'https://miro.com/app/board/kb001'),
  ('h2222222-2222-2222-2222-222222222222', 'N2', 'Logistiek Proces', 'LP-001', 'h1111111-1111-1111-1111-111111111111', 1, NULL),
  ('h3333333-3333-3333-3333-333333333333', 'N3', 'Goederenontvangst', 'GO-001', 'h2222222-2222-2222-2222-222222222222', 1, NULL),
  ('h4444444-4444-4444-4444-444444444444', 'N4', 'Heftruck operaties', 'HO-001', 'h3333333-3333-3333-3333-333333333333', 1, NULL),
  ('h5555555-5555-5555-5555-555555555555', 'N2', 'Productie Proces', 'PP-001', 'h1111111-1111-1111-1111-111111111111', 2, NULL);

-- RACI rollen
INSERT INTO raci_rollen (code, naam, beschrijving, kleur) VALUES
  ('R', 'Responsible', 'Voert de taak uit', '#22c55e'),
  ('A', 'Accountable', 'Eindverantwoordelijk', '#ef4444'),
  ('C', 'Consulted', 'Wordt geraadpleegd', '#3b82f6'),
  ('I', 'Informed', 'Wordt geïnformeerd', '#a855f7');

-- RACI toewijzingen
INSERT INTO raci_toewijzingen (document_id, persoon_id, rol) VALUES
  ('d1111111-1111-1111-1111-111111111111', 'p3333333-3333-3333-3333-333333333333', 'R'),
  ('d1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'A'),
  ('d1111111-1111-1111-1111-111111111111', 'p2222222-2222-2222-2222-222222222222', 'C'),
  ('d2222222-2222-2222-2222-222222222222', 'p3333333-3333-3333-3333-333333333333', 'R'),
  ('d2222222-2222-2222-2222-222222222222', 'p1111111-1111-1111-1111-111111111111', 'A'),
  ('d3333333-3333-3333-3333-333333333333', 'p1111111-1111-1111-1111-111111111111', 'R'),
  ('d3333333-3333-3333-3333-333333333333', 'p2222222-2222-2222-2222-222222222222', 'A');

-- Versie historie
INSERT INTO versie_historie (document_id, versie, auteur_id, wijzigingen, status) VALUES
  ('d1111111-1111-1111-1111-111111111111', '1.0', 'p3333333-3333-3333-3333-333333333333', 'Initiële versie', 'superseded'),
  ('d1111111-1111-1111-1111-111111111111', '1.1', 'p3333333-3333-3333-3333-333333333333', 'Veiligheidsstappen toegevoegd', 'superseded'),
  ('d1111111-1111-1111-1111-111111111111', '1.2', 'p3333333-3333-3333-3333-333333333333', 'Checklist geoptimaliseerd', 'active'),
  ('d2222222-2222-2222-2222-222222222222', '1.0', 'p3333333-3333-3333-3333-333333333333', 'Initiële versie', 'superseded'),
  ('d2222222-2222-2222-2222-222222222222', '2.0', 'p3333333-3333-3333-3333-333333333333', 'WMS integratie toegevoegd', 'active');

-- =============================================================================
-- STANDAARDZINNEN BIBLIOTHEEK
-- =============================================================================

-- Categorieën
INSERT INTO standaardzin_categorieen (code, naam, beschrijving) VALUES
  ('HEF-BEW', 'Heftruckbewegingen', 'Standaardzinnen voor heftruckoperaties'),
  ('OHD-EL', 'Onderhoud Elektrisch', 'Zinnen voor elektrisch onderhoud'),
  ('DISP', 'Dispatch', 'Zinnen voor verzending en dispatch'),
  ('ONT', 'Ontvangst', 'Zinnen voor goederenontvangst'),
  ('KWA', 'Kwaliteit', 'Zinnen voor kwaliteitscontroles');

-- Tags
INSERT INTO standaardzin_tags (prefix, waarde, categorie, kleur) VALUES
  ('@loc', 'magazijn', 'locatie', '#22c55e'),
  ('@loc', 'laadperron', 'locatie', '#22c55e'),
  ('@loc', 'koelcel', 'locatie', '#22c55e'),
  ('@equip', 'heftruck', 'apparatuur', '#3b82f6'),
  ('@equip', 'pompwagen', 'apparatuur', '#3b82f6'),
  ('@equip', 'scanner', 'apparatuur', '#3b82f6'),
  ('@act', 'starten', 'actie', '#f59e0b'),
  ('@act', 'controleren', 'actie', '#f59e0b'),
  ('@act', 'parkeren', 'actie', '#f59e0b'),
  ('@safe', 'veiligheid', 'veiligheid', '#ef4444'),
  ('@safe', 'pbm', 'veiligheid', '#ef4444');

-- Placeholders
INSERT INTO standaardzin_placeholders (naam, format, toegestane_waarden) VALUES
  ('[locatie]', 'tekst', ARRAY['magazijn', 'laadperron', 'koelcel', 'expeditie']),
  ('[bestemming]', 'tekst', ARRAY['stellage', 'verzamellocatie', 'dock']),
  ('[apparaat]', 'tekst', ARRAY['heftruck', 'reachtruck', 'pompwagen']),
  ('[tijd]', 'getal', ARRAY['1', '2', '3', '5', '10']),
  ('[aantal]', 'getal', ARRAY[]);

-- Standaardzinnen
INSERT INTO standaardzinnen (id, code, tekst, categorie_code, tags, placeholders) VALUES
  ('s1111111-1111-1111-1111-111111111111', 'HEF-BEW-01', 'Start de heftruck.', 'HEF-BEW', ARRAY['@equip:heftruck', '@act:starten'], ARRAY[]::text[]),
  ('s2222222-2222-2222-2222-222222222222', 'HEF-BEW-02', 'Rijd naar [locatie].', 'HEF-BEW', ARRAY['@equip:heftruck', '@loc:magazijn'], ARRAY['[locatie]']),
  ('s3333333-3333-3333-3333-333333333333', 'HEF-BEW-03', 'Parkeer de heftruck op de aangewezen parkeerplaats.', 'HEF-BEW', ARRAY['@equip:heftruck', '@loc:magazijn'], ARRAY[]::text[]),
  ('s4444444-4444-4444-4444-444444444444', 'HEF-BEW-04', 'Controleer de heftruck visueel op beschadigingen.', 'HEF-BEW', ARRAY['@equip:heftruck', '@safe:veiligheid'], ARRAY[]::text[]),
  ('s5555555-5555-5555-5555-555555555555', 'HEF-BEW-05', 'Wacht [tijd] minuten tot de motor op temperatuur is.', 'HEF-BEW', ARRAY['@equip:heftruck'], ARRAY['[tijd]']),
  ('s6666666-6666-6666-6666-666666666666', 'OHD-EL-01', 'Schakel de stroomtoevoer uit voordat je begint.', 'OHD-EL', ARRAY['@safe:veiligheid'], ARRAY[]::text[]),
  ('s7777777-7777-7777-7777-777777777777', 'DISP-01', 'Verplaats de pallet naar [bestemming].', 'DISP', ARRAY['@loc:laadperron', '@equip:pompwagen'], ARRAY['[bestemming]']),
  ('s8888888-8888-8888-8888-888888888888', 'DISP-02', 'Scan de barcode van de pallet.', 'DISP', ARRAY['@act:starten'], ARRAY[]::text[]);

-- Atomaire sequenties
INSERT INTO atomaire_sequenties (id, code, naam, volgorde_verplicht) VALUES
  ('q1111111-1111-1111-1111-111111111111', 'SEQ-HEF-START', 'Heftruck opstarten', true),
  ('q2222222-2222-2222-2222-222222222222', 'SEQ-HEF-PARK', 'Heftruck parkeren', true);

-- Sequentie stappen
INSERT INTO sequentie_stappen (sequentie_id, standaardzin_code, volgorde) VALUES
  ('q1111111-1111-1111-1111-111111111111', 'HEF-BEW-04', 1),
  ('q1111111-1111-1111-1111-111111111111', 'HEF-BEW-01', 2),
  ('q1111111-1111-1111-1111-111111111111', 'HEF-BEW-05', 3),
  ('q2222222-2222-2222-2222-222222222222', 'HEF-BEW-02', 1),
  ('q2222222-2222-2222-2222-222222222222', 'HEF-BEW-03', 2);

-- =============================================================================
-- SCHRIJFSTANDAARD & STRUCTUUR
-- =============================================================================

-- Terminologie categorieën
INSERT INTO terminologie_categorieen (code, naam) VALUES
  ('apparatuur', 'Apparatuur'),
  ('infrastructuur', 'Infrastructuur'),
  ('locatie', 'Locatie'),
  ('materiaal', 'Materiaal'),
  ('rollen', 'Rollen'),
  ('systeem', 'Systeem');

-- Terminologie
INSERT INTO terminologie (id, voorkeursterm, verboden_synoniemen, definitie, context, voorbeelden, categorie_code) VALUES
  ('t1111111-1111-1111-1111-111111111111', 'Heftruck', ARRAY['vorkheftruck', 'forklift', 'clark'], 'Gemotoriseerd voertuig voor het tillen en verplaatsen van pallets', 'Gebruik in alle logistieke documenten', ARRAY['Start de heftruck', 'Parkeer de heftruck'], 'apparatuur'),
  ('t2222222-2222-2222-2222-222222222222', 'Overhead door', ARRAY['roldeur', 'sectionaaldeur', 'poort'], 'Grote industriële deur die omhoog opent', 'Gebruik voor toegangsdeuren magazijn', ARRAY['Open de overhead door', 'Sluit de overhead door'], 'infrastructuur'),
  ('t3333333-3333-3333-3333-333333333333', 'Handscanner', ARRAY['scanner', 'barcodelezer'], 'Draagbaar apparaat voor het scannen van barcodes', 'Gebruik voor WMS-gerelateerde taken', ARRAY['Pak de handscanner', 'Scan met de handscanner'], 'apparatuur'),
  ('t4444444-4444-4444-4444-444444444444', 'Operator', ARRAY['medewerker', 'werknemer', 'persoon'], 'Persoon die een machine of proces bedient', 'Gebruik in werkinstructies voor de uitvoerder', ARRAY['De operator controleert', 'De operator voert uit'], 'rollen'),
  ('t5555555-5555-5555-5555-555555555555', 'Pallet', ARRAY['europallet', 'blokpallet'], 'Houten of kunststof laadplatform', 'Standaardterm voor alle pallets', ARRAY['Plaats de pallet', 'Verplaats de pallet'], 'materiaal'),
  ('t6666666-6666-6666-6666-666666666666', 'Picklocatie', ARRAY['pickplek', 'verzamellocatie', 'orderpicklocatie'], 'Locatie waar items worden verzameld voor orders', 'Gebruik in orderpick documenten', ARRAY['Ga naar de picklocatie', 'Bij de picklocatie'], 'locatie'),
  ('t7777777-7777-7777-7777-777777777777', 'WMS', ARRAY['systeem', 'het systeem', 'warehouse systeem'], 'Warehouse Management System', 'Afkorting is toegestaan en gewenst', ARRAY['Registreer in WMS', 'WMS geeft aan'], 'systeem'),
  ('t8888888-8888-8888-8888-888888888888', 'Reachtruck', ARRAY['reachtruc', 'reach truck', 'reach-truck'], 'Heftruck met uitschuifbare vorken voor hoog reiken', 'Gebruik voor stellage-operaties', ARRAY['Start de reachtruck', 'Met de reachtruck'], 'apparatuur');

-- Stijlregel categorieën
INSERT INTO stijlregel_categorieen (id, code, naam, beschrijving, icoon) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'IMP', 'Imperatiefvorm', 'Regels over het gebruik van de gebiedende wijs in instructies.', 'command'),
  ('c2222222-2222-2222-2222-222222222222', 'ACT', 'Actieve zinnen', 'Regels over actief versus passief taalgebruik.', 'zap'),
  ('c3333333-3333-3333-3333-333333333333', 'VRB', 'Verboden woorden', 'Woorden en formuleringen die niet gebruikt mogen worden.', 'x-circle'),
  ('c4444444-4444-4444-4444-444444444444', 'ZIN', 'Zinlengte', 'Regels over de lengte en structuur van zinnen.', 'ruler'),
  ('c5555555-5555-5555-5555-555555555555', 'CON', 'Consistentie', 'Regels over consequent woordgebruik en terminologie.', 'check-circle');

-- Stijlregels
INSERT INTO stijlregels (categorie_id, titel, beschrijving, voorbeeld_goed, voorbeeld_fout, toelichting) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Gebruik de gebiedende wijs', 'Begin instructies altijd met een werkwoord in de gebiedende wijs. Dit maakt duidelijk wat de operator moet doen.', 'Pak de handscanner.', 'Je moet de handscanner pakken.', 'De gebiedende wijs is direct en duidelijk.'),
  ('c1111111-1111-1111-1111-111111111111', 'Eén actie per zin', 'Elke zin bevat maximaal één handeling. Meerdere acties worden opgesplitst in aparte stappen.', 'Open de deur. Loop naar binnen.', 'Open de deur en loop naar binnen.', 'Eén actie per stap voorkomt vergissingen.'),
  ('c2222222-2222-2222-2222-222222222222', 'Vermijd passieve zinnen', 'Gebruik actieve zinconstructies waarbij het onderwerp de handeling uitvoert.', 'Controleer de pallet.', 'De pallet wordt gecontroleerd.', 'Actieve zinnen zijn duidelijker over wie wat doet.'),
  ('c2222222-2222-2222-2222-222222222222', 'Noem de actor expliciet', 'Als er meerdere personen betrokken zijn, benoem dan wie de actie uitvoert.', 'De operator start de machine.', 'Start de machine.', 'Voorkomt onduidelijkheid bij teamwerk.'),
  ('c3333333-3333-3333-3333-333333333333', 'Vermijd "eventueel"', 'Het woord eventueel suggereert optionaliteit terwijl instructies vaak verplicht zijn.', 'Controleer bij twijfel.', 'Controleer eventueel.', 'Wees expliciet over wanneer een stap nodig is.'),
  ('c3333333-3333-3333-3333-333333333333', 'Vermijd "men"', 'Het onbepaald voornaamwoord "men" is vaag en onduidelijk.', 'De operator controleert.', 'Men controleert.', 'Benoem de specifieke rol.'),
  ('c3333333-3333-3333-3333-333333333333', 'Vermijd "etc."', 'Wees specifiek over wat er bedoeld wordt in plaats van af te korten.', 'Controleer schade, lekkage en vervuiling.', 'Controleer schade, lekkage, etc.', 'Voorkomt dat belangrijke items worden overgeslagen.'),
  ('c4444444-4444-4444-4444-444444444444', 'Maximaal 15 woorden per zin', 'Houd zinnen kort en bondig voor betere leesbaarheid.', 'Controleer de oliepeil.', 'Controleer de oliepeil van de heftruck door de peilstok eruit te halen en te bekijken.', 'Korte zinnen zijn makkelijker te begrijpen.'),
  ('c4444444-4444-4444-4444-444444444444', 'Splits lange instructies', 'Complexe handelingen worden opgedeeld in meerdere stappen.', '1. Pak de peilstok. 2. Controleer het niveau.', 'Pak de peilstok en controleer het niveau.', 'Duidelijke stappen zijn beter te volgen.'),
  ('c5555555-5555-5555-5555-555555555555', 'Gebruik voorkeursterm', 'Gebruik altijd de term uit de terminologielijst.', 'Pak de handscanner.', 'Pak de barcodelezer.', 'Consistente terminologie voorkomt verwarring.');

-- Document niveaus (L1-L5)
INSERT INTO document_niveaus (code, naam, beschrijving, doelgroep, voorbeelden, template_secties, kleur, sort_order) VALUES
  ('L1', 'Strategisch', 'Organisatiebrede beleidslijnen en missie. Bepaalt de richting voor alle onderliggende documentatie.', 'Directie, Management', ARRAY['Kwaliteitsbeleid', 'Veiligheidsbeleid', 'Missie & Visie'], ARRAY['Doel', 'Scope', 'Beleidsprincipes', 'Verantwoordelijkheden'], '#1e3a8a', 1),
  ('L2', 'Tactisch', 'Afdelingsoverstijgende processen en procesbeschrijvingen. Vertaalt beleid naar werkbare processen.', 'Procesmanagers, Afdelingshoofden', ARRAY['Inkoopproces', 'Ontvangstproces', 'Verzendproces'], ARRAY['Procesbeschrijving', 'Processtappen', 'Rollen', 'KPIs'], '#1d4ed8', 2),
  ('L3', 'Operationeel', 'Procedures die beschrijven hoe processen worden uitgevoerd. Inclusief beslismomenten en uitzonderingen.', 'Teamleiders, Supervisors', ARRAY['Ontvangstprocedure', 'Retourprocedure', 'Klachtenprocedure'], ARRAY['Doel', 'Toepassingsgebied', 'Procedure', 'Uitzonderingen', 'Registraties'], '#2563eb', 3),
  ('L4', 'Uitvoerend', 'Werkinstructies met gedetailleerde stap-voor-stap handelingen. Focus op hoe een specifieke taak wordt uitgevoerd.', 'Operators, Uitvoerend personeel', ARRAY['Heftruck starten', 'Pallet inboeken', 'Order picken'], ARRAY['Benodigdheden', 'Voorbereiding', 'Stappen', 'Controle', 'Veiligheid'], '#3b82f6', 4),
  ('L5', 'Registratie', 'Formulieren, checklists en handboeken. Ondersteunende documenten voor vastlegging en referentie.', 'Alle medewerkers', ARRAY['Dagelijkse heftruckcheck', 'Schoonmaakchecklist', 'Apparatuurhandboek'], ARRAY['Instructies', 'Invoervelden', 'Handtekeningen'], '#60a5fa', 5);

-- Document types
INSERT INTO document_types (code, naam, niveau_code, beschrijving, structuur_vereisten) VALUES
  ('PR', 'Procedure', 'L3', 'Operationele procedure met processtappen en beslispunten', ARRAY['Doel', 'Scope', 'Verantwoordelijkheden', 'Procedure', 'Registraties']),
  ('WI', 'Werkinstructie', 'L4', 'Gedetailleerde stap-voor-stap instructie', ARRAY['Benodigdheden', 'Veiligheidsinstructies', 'Stappen', 'Controle']),
  ('DS', 'Handboek', 'L5', 'Naslagwerk met referentie-informatie', ARRAY['Inleiding', 'Inhoud', 'Bijlagen']),
  ('FO', 'Formulier', 'L5', 'Invulbaar document voor registratie', ARRAY['Instructies', 'Invoervelden', 'Ondertekening']);

-- Schrijfstandaard rollen
INSERT INTO schrijfstandaard_rollen (code, naam, beschrijving) VALUES
  ('DIR', 'Directie', 'Directieleden en MT'),
  ('PM', 'Procesmanager', 'Verantwoordelijk voor bedrijfsprocessen'),
  ('TL', 'Teamleider', 'Leiding over operationeel team'),
  ('OP', 'Operator', 'Uitvoerend personeel'),
  ('QA', 'Kwaliteit', 'Kwaliteitsafdeling');

-- Document type RACI matrix
INSERT INTO document_type_raci (document_type_code, rol_code, raci_waarde) VALUES
  ('PR', 'PM', 'R'),
  ('PR', 'TL', 'C'),
  ('PR', 'QA', 'A'),
  ('WI', 'TL', 'R'),
  ('WI', 'OP', 'C'),
  ('WI', 'QA', 'A'),
  ('DS', 'QA', 'R'),
  ('DS', 'PM', 'A'),
  ('FO', 'TL', 'R'),
  ('FO', 'QA', 'A');

-- Codering formaat
INSERT INTO codering_formaat (id, patroon, voorbeeld, is_active) VALUES
  ('f1111111-1111-1111-1111-111111111111', '[TYPE]-[AFD]-[CAT]-[NR]-[VER]', 'WI-LOG-HEF-001-v1.0', true);

-- Codering segmenten
INSERT INTO codering_segmenten (formaat_id, naam, beschrijving, voorbeelden, sort_order) VALUES
  ('f1111111-1111-1111-1111-111111111111', 'TYPE', 'Documenttype code', ARRAY['WI', 'PR', 'DS', 'FO'], 1),
  ('f1111111-1111-1111-1111-111111111111', 'AFD', 'Afdelingsafkorting', ARRAY['LOG', 'PROD', 'QA', 'HR'], 2),
  ('f1111111-1111-1111-1111-111111111111', 'CAT', 'Categorieafkorting', ARRAY['HEF', 'PAL', 'ORD', 'REI'], 3),
  ('f1111111-1111-1111-1111-111111111111', 'NR', 'Volgnummer (3 cijfers)', ARRAY['001', '002', '003'], 4),
  ('f1111111-1111-1111-1111-111111111111', 'VER', 'Versienummer', ARRAY['v1.0', 'v1.1', 'v2.0'], 5);
