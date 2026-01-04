# Schrijfstandaard & Structuur Specification

## Overview
Centrale referentie voor het correct opstellen van documentatie, bestaande uit drie onderdelen: een terminologiedatabase met voorkeurtermen en verboden synoniemen, stijlregels met voorbeelden per categorie, en documentstructuur met de 5-niveau hiërarchie, templates en codering.

## User Flows
- Schrijver zoekt op term/synoniem → vindt correcte term met definitie en context → kopieert naar document
- Schrijver stuit op ontbrekende term → vult voorstelformulier in → term wordt gereviewd
- Reviewer selecteert stijlcategorie → bekijkt goed/fout voorbeelden → genereert checklist
- Auteur selecteert documentniveau (L1-L5) → bekijkt template → genereert documentcode via wizard
- Gebruiker raadpleegt RACI-matrix per documenttype

## UI Requirements
- Drie tabs bovenaan: Terminologie | Stijlregels | Documentstructuur
- Terminologie tab:
  - Zoekbalk bovenaan
  - Doorzoekbare tabel met voorkeursterm, verboden varianten, definitie
  - Expandable rows voor volledige details (context, voorbeelden)
  - "Term voorstellen" knop
- Stijlregels tab:
  - Categorieën als accordeons (Imperatiefvorm, Actieve zinnen, Verboden woorden, Zinlengte, Consistentie)
  - Per regel: goed/fout voorbeelden met visuele markering (groen/rood)
  - "Genereer checklist" knop
- Documentstructuur tab:
  - Visuele hiërarchie-boom (L1→L5) met klikbare niveaus
  - Template preview cards per niveau
  - Interactieve code-generator wizard
  - RACI-matrix tabel per documenttype

## Configuration
- shell: true
