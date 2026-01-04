# Data Model

## Core Entiteiten

### Standaardzin
Een gecodeerde, herbruikbare zin die in werkinstructies kan worden ingezet. Bevat code, tekst, categorie, tags en placeholders.

### Tag
Een semantisch label voor categoriseren en filteren. Heeft een prefix (@loc:, @equip:, @act:, @safe:, @proc:, @phase:), waarde, categorie en synoniemen.

### Categorie
Een groepering van standaardzinnen op werkgebied. Voorbeelden: HEF-BEW, OHD-EL, DISP. Bevat code, naam en beschrijving.

### Placeholder
Een variabele binnen een standaardzin die bij gebruik wordt ingevuld. Heeft naam, format en toegestane waarden. Voorbeelden: [locatie], [bestemming], [apparaat].

### AtomairSequentie
Een ondeelbare, geordende reeks stappen die samen één logische handeling vormen. Bevat code, naam, stappen en of volgorde verplicht is.

### Document
Een procedurebeschrijving binnen de documenthiërarchie. Bevat code, titel, niveau (L1-L5), type, versie en status. Niveau bepaalt focus en doelgroep.

### Stijlregel
Een schrijfrichtlijn die bepaalt hoe teksten worden geformuleerd. Bevat regel_id, categorie, beschrijving en voorbeelden.

### Agent
Een AI-validatiecomponent voor analyse, kwaliteitscontrole of bibliotheekbeheer. Bevat naam, taak, triggers en validatieregels.

## Ondersteunende Entiteiten

### Rol
Een RACI-rol binnen het systeem: Opsteller, Reviewer, Goedkeurder, etc. Bepaalt verantwoordelijkheden per documenttype.

### Terminologie
Een gestandaardiseerde term met de correcte schrijfwijze en verboden synoniemen. Zorgt voor consistente woordkeuze.

### Bron
De oorsprong van een standaardzin: PDF, transcriptie of markdown. Belangrijk voor traceerbaarheid en validatie.

### Vragenlijst
Een validatie-instrument voor het toetsen van documenten of het verzamelen van feedback van operators.

### DocumentType
Het type document: WI (werkinstructie), PROC (procedure), FORM (formulier), etc. Bepaalt structuurvereisten.

## Relationele Entiteiten

### RACI_Toewijzing
Koppeling tussen Document, Rol en Persoon. Bepaalt wie Responsible, Accountable, Consulted of Informed is.

### DocumentRelatie
Hiërarchische relatie tussen documenten: parent-child verbindingen en kruisverwijzingen.

## Relaties

- Standaardzin behoort tot één Categorie
- Standaardzin heeft meerdere Tags
- Standaardzin bevat meerdere Placeholders
- Standaardzin heeft meerdere Bronnen
- AtomairSequentie bevat meerdere Standaardzinnen (geordend)
- Document heeft één DocumentType
- Document heeft meerdere DocumentRelaties (parent-child, referenties)
- Document heeft meerdere RACI_Toewijzingen
- Stijlregel is gekoppeld aan DocumentType(s) en/of niveau(s)
- Agent opereert op Documenten, Standaardzinnen en/of de Bibliotheek
