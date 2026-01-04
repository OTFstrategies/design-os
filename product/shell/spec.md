# Application Shell Specification

## Overview
De applicatie-shell voor Proceshuis HSF gebruikt een sidebar navigatie met een clean, professionele uitstraling volgens de VEHA huisstijl. De sidebar bevat alle secties en het gebruikersmenu onderaan.

## Navigation Structure
- **Proceshuisbeheer** → Dashboard (default/home)
- **Standaardzinnen Bibliotheek** → Zinnen en tags beheren
- **Schrijfstandaard & Structuur** → Stijlgids en taxonomie
- **AI-agents** → Analyse en kwaliteitscontrole

## User Menu
- **Locatie:** Onderin de sidebar
- **Inhoud:** Avatar, gebruikersnaam, rol, logout knop
- **Gedrag:** Altijd zichtbaar, geen dropdown

## Layout Pattern
- **Sidebar:** Vast aan de linkerzijde, 256px breed op desktop
- **Content area:** Neemt resterende breedte in, scrollt onafhankelijk
- **Header:** Optioneel binnen content area voor sectie-titel en acties

## Responsive Behavior
- **Desktop (1024px+):** Volledige sidebar zichtbaar, content naast sidebar
- **Tablet (768px-1023px):** Sidebar collapsible via hamburger menu
- **Mobile (<768px):** Sidebar verborgen, hamburger menu in header

## Design Notes
- Kleuren: stone palette (VEHA huisstijl)
- Accent: amber voor actieve states en highlights
- Font: Open Sans voor navigatie, IBM Plex Mono voor codes
- Icons: lucide-react voor consistente iconen
- Dark mode: ondersteund via Tailwind dark: classes
