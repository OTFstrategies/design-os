# Glossary Specification

## Overview
Centrale kennisbank voor het correct opstellen van documentatie, bestaande uit vier onderdelen: standaardzinnen met atomaire sequenties, terminologie met voorkeurtermen, stijlregels met voorbeelden, en documentstructuur met de 5-niveau hiërarchie en codering. Inclusief globale zoekfunctie die door alle onderdelen zoekt.

## User Flows
- Globaal zoeken → resultaten uit alle tabs → direct naar relevante content
- Zoeken/browsen standaardzinnen → zin/sequentie kopiëren of invoegen
- Zoeken op term/synoniem → correcte term met definitie vinden → kopiëren
- Stijlcategorie selecteren → goed/fout voorbeelden bekijken → checklist genereren
- Documentniveau selecteren → template bekijken → documentcode genereren via wizard
- Bibliotheekbeheerder: items bewerken, tags aanpassen, termen voorstellen

## UI Requirements

### Hoofdstructuur
- 4 tabs: Standaardzinnen | Terminologie | Stijlregels | Document Structuur
- Globale zoekbalk bovenaan die door alle tabs zoekt
- Zoekresultaten tonen van welke tab ze komen met directe link

### Standaardzinnen Tab
- Tabel met inline-expand voor standaardzinnen
- Kaarten met stappen-lijst voor atomaire sequenties
- Sidebar met faceted search (categorie, tags, niveau, type, placeholder)
- Detail-drawer met volledige informatie inclusief "Gebruikt in" overzicht
- Tag-chips met kleuren per categorie (@loc: blauw, @safe: oranje, etc.)
- Placeholder preview met inline dropdown
- Kopieer- en invoeg-knoppen per item
- "Gebruikt in X documenten" indicator

### Terminologie Tab
- Doorzoekbare tabel met voorkeursterm, verboden varianten, definitie
- Expandable rows voor volledige details (context, voorbeelden)
- Kopieer-knop per term
- "Term voorstellen" knop voor nieuwe termen

### Stijlregels Tab
- Categorieën als accordeons (Imperatiefvorm, Actieve zinnen, Verboden woorden, Zinlengte, Consistentie)
- Per regel: goed/fout voorbeelden met visuele markering (groen/rood)
- "Genereer checklist" knop voor geselecteerde regels

### Document Structuur Tab
- Visuele hiërarchie-boom (N1→N5) met klikbare niveaus
- Template preview cards per niveau
- Interactieve code-generator wizard
- RACI-matrix tabel per documenttype

## Out of Scope
- AI-suggesties (AI-agents sectie)
- Goedkeuringsworkflow (AI-agents sectie)
- Personalisatie (recent/favorieten)

## Configuration
- shell: true
