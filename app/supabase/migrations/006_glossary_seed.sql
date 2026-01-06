-- ============================================================================
-- Glossary Seed Data - Applied via Supabase API
-- This file documents the seed data that was inserted
-- ============================================================================

-- Standaardzin Categorieen (3 records):
-- HEF-BEW: Heftruckbewegingen
-- OHD-EL: Onderhoud Elektrisch
-- DISP: Dispatch

-- Standaardzin Tags (6 records):
-- @loc:magazijn, @loc:laadperron
-- @equip:heftruck, @equip:pompwagen
-- @act:starten
-- @safe:veiligheid

-- Standaardzin Placeholders (4 records):
-- [locatie], [bestemming], [apparaat], [tijd]

-- Standaardzinnen (8 records):
-- HEF-BEW-01 through HEF-BEW-05
-- OHD-EL-01
-- DISP-01, DISP-02

-- Atomaire Sequenties (2 records):
-- SEQ-HEF-START: Heftruck opstarten (3 stappen)
-- SEQ-HEF-PARK: Heftruck parkeren (2 stappen)

-- Terminologie Categorieen (6 records):
-- apparatuur, infrastructuur, rollen, materiaal, locatie, systeem

-- Terminologie (8 records):
-- Heftruck, Overhead door, Handscanner, Operator, Pallet, Picklocatie, WMS, Reachtruck

-- Stijlregel Categorieen (5 records):
-- imperatiefvorm, actieve-zinnen, verboden-woorden, zinlengte, consistentie

-- Stijlregels (10 records):
-- 2x imperatiefvorm, 2x actieve-zinnen, 3x verboden-woorden, 2x zinlengte, 1x consistentie

-- Document Niveaus (5 records):
-- L1: Strategisch, L2: Tactisch, L3: Operationeel, L4: Uitvoerend, L5: Registratie

-- Document Types (4 records):
-- PR: Procedure, WI: Work Instruction, DS: Datasheet, FO: Form/Report

-- Schrijfstandaard Rollen (5 records):
-- OPST, REV, GOEDKR, BEHEER, GEBR

-- Document Type RACI (20 records):
-- 4 document types x 5 rollen
