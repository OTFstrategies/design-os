# Standaardzinnen Bibliotheek Specification

## Overview
Centrale database voor het zoeken, browsen en gebruiken van gevalideerde standaardzinnen én atomaire sequenties. Gebruikers kunnen zoeken via full-text search en faceted filters, details bekijken in een drawer, en zinnen/sequenties kopiëren of direct invoegen in de geïntegreerde document-editor.

## User Flows
- Zoeken → filteren → zin/sequentie kopiëren naar klembord
- Zoeken → filteren → zin/sequentie invoegen in document-editor
- Browsen per categorie → zinnen ontdekken
- Filteren op type (losse zinnen vs sequenties)
- Zin/sequentie selecteren → details bekijken in drawer
- Bibliotheekbeheerder: zin bewerken, tags aanpassen

## UI Requirements
- Tabel met inline-expand voor standaardzinnen
- Kaarten met stappen-lijst voor atomaire sequenties
- Sidebar met faceted search (categorie, tags, niveau, type, placeholder)
- Detail-drawer met volledige informatie inclusief "Gebruikt in" overzicht (documenten waar zin/sequentie voorkomt)
- Tag-chips met kleuren per categorie (@loc: blauw, @safe: oranje, etc.)
- Placeholder preview met inline dropdown
- Kopieer- en invoeg-knoppen per item
- "Gebruikt in X documenten" indicator voor impact-analyse en consistentie-controle

## Out of Scope
- AI-suggesties (AI-agents sectie)
- Goedkeuringsworkflow (AI-agents sectie)
- Personalisatie (recent/favorieten)

## Configuration
- shell: true
