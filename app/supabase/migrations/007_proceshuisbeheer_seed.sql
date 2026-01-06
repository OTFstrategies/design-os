-- ============================================================================
-- Proceshuisbeheer Seed Data - Applied via Supabase API
-- This file documents the seed data that was inserted
-- ============================================================================

-- Afdelingen (7 records):
-- WAR: Warehouse
-- KWA: Kwaliteit
-- EXP: Expeditie
-- TEC: Technische Dienst
-- VEI: Veiligheid
-- REI: Reiniging
-- HRV: HR & Veiligheid

-- Personen (6 records):
-- Jan van der Berg (Warehouse Manager)
-- Maria Jansen (Quality Coordinator)
-- Pieter de Groot (Teamleider Expeditie)
-- Kees Bakker (Technisch Manager)
-- Linda Smits (Operationeel Medewerker)
-- Tom Hendriks (HSE Officer)

-- RACI Rollen (4 records):
-- R: Responsible, A: Accountable, C: Consulted, I: Informed

-- Hierarchie Nodes (14 records):
-- N1: Heuschen & Schrouff Waardeketen
-- N2: Warehousing & Distributie, Veiligheid & Compliance, Expeditie & Transport
-- N3: Inbound Logistiek, Facility Management, HSE Procedures, Outbound Logistiek
-- N4: Goederenontvangst, Orderpicking, Technisch Onderhoud, Reiniging & Hygiëne,
--     Verpakking & Palletisering, Voorraadbeheer

-- Documenten (8 records):
-- WI-HEF-001: Heftruckinspectie dagelijkse controle
-- WI-REI-003: Schoonmaakprocedure koelcel
-- WI-PAL-012: Palletwikkelmachine instellen
-- PR-NRG-002: Noodprocedure stroomuitval
-- WI-ORD-007: Orderpicken zone B
-- WI-OHD-015: Preventief onderhoud koelinstallatie
-- PR-VEI-001: Veiligheidsinstructie nieuwe medewerkers
-- DS-INV-002: Inventarisatie magazijn sjabloon

-- RACI Toewijzingen (21 records):
-- Various R/A/C/I assignments for 5 documents

-- Versie Historie (10 records):
-- WI-HEF-001: 3 versies (1.0, 1.1, 1.2)
-- PR-NRG-002: 3 versies (1.0, 1.1, 2.0)
-- WI-OHD-015: 4 versies (2.0, 2.5, 3.0, 3.1)
