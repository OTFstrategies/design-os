# AI-agents Specification

## Overview
Het AI-agents dashboard biedt inzicht in de volledige documentatie-pipeline van 7 gespecialiseerde agents. Gebruikers kunnen nieuwe pipeline runs starten met PLAUD PDF-output en optionele foto's, meerdere datasets per run toevoegen, de voortgang monitoren, agents configureren en resultaten reviewen.

## Agents Pipeline

| # | Agent | Rol |
|---|-------|-----|
| 1A | Foto Analyzer | Beeldherkenning & labeling van apparatuur, locaties, materialen |
| 1B | Document Parser | Extractie van gestructureerde stappen uit PLAUD PDF-output |
| 2 | Analyse & Codering | Matching met standaardzinnen en terminologie uit Glossary |
| 3 | Stijl Agent | Toepassen schrijfstandaard, format en documentstructuur |
| 4 | Review Agent | Kwaliteitsvalidatie, compliance check, suggesties |
| 5 | Opslag Agent | Documentatie archivering en bibliotheek-integratie |
| 6 | Status Tracker | Realtime pipeline monitoring en notificaties |

**Pipeline Flow:** 1A + 1B (parallel) → 2 → 3 → 4 → 5 (met 6 als continue monitor)

## User Flows

- Nieuwe pipeline run starten met PLAUD PDF(s) en optionele foto's uploaden
- Meerdere datasets toevoegen aan één run (bijv. meerdere PDFs voor gerelateerde procedures)
- Realtime voortgang van pipeline runs monitoren per agent-stap
- Agent-specifieke configuratie aanpassen (prompts, thresholds, instellingen)
- Resultaten van voltooide runs reviewen en goedkeuren of afwijzen
- Pipeline geschiedenis en statistieken bekijken
- Gefaalde runs opnieuw starten vanaf specifiek punt

## UI Requirements

### Hoofdstructuur
- 3 hoofdtabs: Dashboard | Agents | Nieuwe Run

### Dashboard Tab
- Overzicht van actieve runs met voortgangsindicatie
- Recente voltooide runs met status (succes/review nodig/gefaald)
- Pipeline statistieken (runs vandaag, succes ratio, gemiddelde doorlooptijd)
- Quick actions voor veelvoorkomende taken

### Agents Tab
- Grid van 7 agent cards met:
  - Agent naam en nummer
  - Korte rolbeschrijving
  - Status indicator (actief/idle/error)
  - Configuratie-knop
- Agent detail/configuratie modal met:
  - Huidige prompt/instellingen
  - Performance metrics
  - Log historie

### Nieuwe Run Tab
- Drag & drop zone voor bestanden:
  - PLAUD PDF-output (verplicht, meerdere toegestaan)
  - Foto's (optioneel, meerdere toegestaan)
- Bestandenlijst met:
  - Preview thumbnails
  - Type-indicator (PDF/foto)
  - Verwijder-knop per bestand
  - Mogelijkheid om extra bestanden toe te voegen
- Dataset groepering:
  - Optie om PDFs te groeperen als één procedure of als aparte procedures
  - Metadata per dataset (taaknaam, categorie, locatie)
- Review & Start knop met validatie

### Pipeline Visualisatie
- Horizontale flow diagram met 7 agent-stappen
- Parallel weergave voor 1A en 1B
- Kleurcodering: grijs (wacht), blauw (actief), groen (klaar), rood (error)
- Klikbaar voor detail per stap

### Run Detail View
- Tijdlijn met per-agent output
- Input/output per stap bekijken
- Review acties (goedkeuren, afwijzen met feedback, aanpassen)
- Export naar definitief document

## Configuration
- shell: true
