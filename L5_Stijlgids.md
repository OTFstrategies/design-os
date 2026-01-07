# L5 Stijlgids - Formatting & Opmaak

**Doel:** Definieer visuele stijl, opmaak en formatting voor L5 werkinstructies.

**Scope:** Dit document beschrijft ALLEEN hoe documenten eruit moeten zien, NIET hoe ze gegenereerd worden.

---

## Kleur Specificaties (VERPLICHT)

| Element | Kleur | Hex Code | RGB |
|---------|-------|----------|-----|
| Document titel | Donkerblauw | #002060 | RGB(0, 32, 96) |
| Sectiekoppen (Benodigdheden:, Veiligheid:) | Donkerblauw | #002060 | RGB(0, 32, 96) |
| Tabel header achtergrond | Lichtblauw | #DAE9F7 | RGB(218, 233, 247) |
| Tabel header tekst | Zwart | (default) | - |
| Overige tekst | Zwart | (default) | - |

**Deze kleuren zijn afgeleid uit het officiële H&S document en mogen NIET worden aangepast.**

---

## Document Structuur

### 1. Header

```
[TITEL]                          ← Arial 11pt, BOLD, #002060
Versie: V1.0 | Datum: dd/mm/yyyy ← Arial 10pt, normaal, zwart
```

### 2. Benodigdheden (optioneel)

```
Benodigdheden:    ← Arial 11pt, BOLD, #002060
• Item 1          ← Arial 11pt, normaal, zwart
• Item 2
```

Gebruik L5_Masterlijsten_v1.0.md voor standaard items.

### 3. Veiligheid (optioneel)

```
Veiligheid:       ← Arial 11pt, BOLD, #002060
• Waarschuwing 1  ← Arial 11pt, normaal, zwart
• Waarschuwing 2
```

Gebruik L5_Masterlijsten_v1.0.md voor standaard items.

### 4. Stappen TABEL (VERPLICHT)

**Tabel specificaties:**
- Kolommen: 50% / 50% breedte
- Header rij: achtergrond #DAE9F7 (lichtblauw), tekst BOLD
- Data rijen: witte achtergrond, normale tekst
- Kolomkoppen: "Description" | "Add in Picture (if required)"

```
┌─────────────────────────────────────────┬─────────────────────────────┐
│ Description                             │ Add in Picture (if required)│ ← BOLD, bg #DAE9F7
├─────────────────────────────────────────┼─────────────────────────────┤
│ 1. [Actie in imperatief]                │ [FOTO] of leeg              │ ← Normaal, wit
│    [Details]                            │ Onderwerp: ...              │
│    • [Sub-item]                         │ Annotatie: ...              │
│    Let op: [Waarschuwing]               │                             │
├─────────────────────────────────────────┼─────────────────────────────┤
│ 2. [Volgende stap]                      │ ...                         │
└─────────────────────────────────────────┴─────────────────────────────┘
```

**Description kolom inhoud:**
- **Stapnummer**: 1. 2. 3. (Arabisch, met punt) - BOLD
- **Actie**: Imperatief, actief
- **Details**: Extra uitleg indien nodig
- **Sub-items**: Bullets (•) voor deelacties
- **Note**: "Let op:" voor waarschuwingen - CURSIEF

**Picture kolom format:**
```
[FOTO]
Onderwerp: Waterkraan bij vulstation
Annotatie: Pijl naar hendel
```

Of: laat leeg als geen foto nodig.

### 5. Footer

```
Versie V1.0 - dd/mm/yyyy  ← Arial 10pt, normaal, zwart
```

---

## Opmaak Specificaties

| Element | Font | Grootte | Stijl | Kleur |
|---------|------|---------|-------|-------|
| Titel | Arial | 11pt | Bold | #002060 |
| Versie/datum header | Arial | 10pt | Normaal | Zwart |
| Sectiekoppen | Arial | 11pt | Bold | #002060 |
| Tabel header | Arial | 11pt | Bold | Zwart (bg #DAE9F7) |
| Stapnummer | Arial | 11pt | Bold | Zwart |
| Staptekst | Arial | 11pt | Normaal | Zwart |
| Notes ("Let op:") | Arial | 11pt | Cursief | Zwart |
| Bullets | Arial | 11pt | Normaal | Zwart |
| Footer | Arial | 10pt | Normaal | Zwart |

---

## Taalregels

| Regel | Goed | Fout |
|-------|------|------|
| Actief | "Open de klep" | "De klep moet geopend worden" |
| Imperatief | "Controleer het niveau" | "U dient het niveau te controleren" |
| Kort | "Wacht 15 minuten" | "Het is noodzakelijk om 15 minuten te wachten" |
| Direct | "Bel Raymond" | "Neem contact op met de verantwoordelijke" |

**Jargon:** Bij eerste gebruik uitleggen, daarna afkorting gebruiken.
```
Sluit de IBC (Intermediate Bulk Container) aan.
...
Vul de IBC tot 90%.
```

---

## Nummering & Bullets

- **Stappen**: 1. 2. 3. (Arabische cijfers met punt)
- **Sub-items**: • (bullet point)
- **Benodigdheden**: • (bullet point)
- **Veiligheid**: • (bullet point)

---

## Versie & Datum Format

- **Versie**: V1.0, V2.0, V3.0 (increment by 1.0)
- **Datum**: dd/mm/yyyy (bijvoorbeeld: 31/12/2025)

---

## Afbeelding Kolom

**Vul in als:**
- Taak is visueel
- Risico op fouten hoog
- Visuele herkenning nodig
- Tekst verwijst naar foto

**Laat leeg als:**
- Taak is simpel
- Afbeelding veroudert snel
- Tekst is duidelijker

---

## Referenties

**Voor standaardzinnen en templates:**
- `L5_Masterlijsten_v1.0.md` - Standaardzinnen, benodigdheden, veiligheid

**Voor visuele voorbeelden:**
- `L5_documentstructuur.html` - Visuele element mapping
