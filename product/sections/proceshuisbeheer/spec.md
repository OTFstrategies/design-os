# Proceshuisbeheer Specification

## Overview
Dashboard voor het beheren van alle procedures binnen Heuschen & Schrouff Facilities, met statusoverzicht, hiërarchische relaties (N1-N5), versiebeheer en RACI-eigenaarschap. Focus ligt op N4 (Werkinstructie - WAT) en N5 (Instructies - HOE) documenten.

## Kernfuncties

### Document Dashboard
Overzicht van alle N4/N5 documenten met status, eigenaar en versie.

### Hiërarchie Browser
N1-N5 structuur visualiseren met focus op Facility:
- N1: Waardeketen (alleen context, niet bewerkbaar)
- N2: Bedrijfsproces swimlane (link naar MIRO)
- N3: Werkproces swimlane (link naar MIRO)
- N4: Werkinstructie (WAT) - kernfocus Proceshuis
- N5: Instructies (HOE) - kernfocus Proceshuis

### Versiebeheer
Versiehistorie bekijken, versies vergelijken en terugdraaien.

### RACI Beheer
Eigenaarschap en verantwoordelijkheden toewijzen per document.

## User Flows
- Manager checkt status: Dashboard openen → Filter toepassen → Overzicht bekijken
- Reviewer zoekt werk: Filter op "Review" status → Document openen
- Kwaliteit checkt relaties: Hiërarchie Browser openen → Door structuur navigeren
- Beheerder wijzigt eigenaar: RACI Beheer openen → Rollen toewijzen
- Auditor bekijkt historie: Versiebeheer openen → Versies vergelijken

## UI Requirements
- Data table met sorting en filtering voor Document Dashboard
- Tree view (collapsible) voor Hiërarchie Browser
- N2/N3 niveaus: Link naar externe MIRO board
- Timeline met diff viewer voor Versiebeheer
- Editable matrix grid voor RACI toewijzingen
- Status badges met visuele indicatie:
  - Draft (○ open cirkel)
  - Review (◐ half gevuld)
  - Active (● gevuld)
  - Obsolete (✗ kruis)

## Out of Scope
- N2/N3 swimlane creatie (gebeurt in MIRO)
- Workflow automatisering (afgehandeld door AI-Agents pipeline)
- Audit trails en security logging

## Configuration
- shell: true
