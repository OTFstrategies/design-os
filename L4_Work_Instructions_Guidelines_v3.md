# L4 Work Instructions Guidelines v3.0

**Version:** 3.0  
**Date:** 30/12/2024  
**Purpose:** Strategic L4 work instruction creation for ISO/FSSC standards

---

## Core Principle

**L4 = Strategic level defining WHAT and WHY**  
**L5 = Operational level defining HOW (step-by-step)**

---

## Document Hierarchy

- **L4 (Strategic):** Defines what activities exist, who is responsible, and key requirements
- **L5 (Operational):** Provides detailed step-by-step instructions with photos/diagrams

**L4 always references L5 for operational details.**

---

## Target Audience

- **L4:** Managers, supervisors, process owners, compliance teams
- **L5:** Shop floor workers, operators

---

## CRITICAL FORMAT RULE

**L4 uses TOPIC HEADERS with BULLETS underneath.**  
**NOT numbered sequential steps 1-24 (that's L5 format).**

**Example:**
```
Inspectie en controle:
• Dagelijkse visuele inspectie
• Controle verlichting

Training:
• Certificering verplicht
```

**NOT this:**
```
1. Dagelijkse visuele inspectie
2. Controle verlichting
3. Certificering verplicht
4. ...
```

---

## Formatting Specifications

### Typography
- **Font:** Arial 11pt
- **Date format:** dd/mm/yyyy
- **Version format:** V1.0, increment by 1.0 per update (V2.0, V3.0)

### Content Structure
- **Topics:** Use descriptive headers (not numbered)
- **Sub-items:** Use bullets (•) for all items under topics
- **Substappen:** If sub-steps are needed within a bullet, use indented numbering:
  ```
  • Main activity
    1. Sub-step A
    2. Sub-step B
  • Next activity
  ```
  **Use sparingly** - extensive sub-steps indicate L5 content.
- **Language:** Active, short, clear sentences
- **Jargon:** Avoid or explain at first use
- **Output language:** Dutch (Nederlands)

### Visual Elements
**L4 NEVER contains:**
- Photos or screenshots
- Diagrams or flowcharts
- Step/photo tables (that's L5 format)

**Reference L5 for visuals and detailed execution.**

---

## Document Numbering System

**Format:** `PREFIX-XXX`

**Prefix types:**
- **WI:** Work Instruction (e.g., WI-001, WI-002)
- **PR:** Procedure (e.g., PR-001, PR-002)
- **DS:** Datasheet (e.g., DS-001, DS-002)
- **FO:** Form or Report (e.g., FO-001, FO-002)

**Rule:** Start with 001 for each document type, increment by 1.

---

## Mandatory Document Sections

### 1. Header Metadata Table

| Field | Content |
|-------|---------|
| **Title** | Document title |
| **Document number** | PREFIX-XXX |
| **Version** | V1.0 (initial) |
| **Document type** | ☐ PR ☐ WI ☐ DS ☐ FO |
| **Created by** | Owner (marked as "R" in RACI) |
| **Department** | Department responsible |
| **Date** | dd/mm/yyyy |
| **Approved by** | [Name] |
| **Certification standard** | ISO/FSSC or other |

### 2. Change History Table

| Version | Date | Description of Change | Changed by | Approved by |
|---------|------|----------------------|------------|-------------|
| V1.0 | dd/mm/yyyy | Initial creation | [Name] | [Name] |

### 3. Purpose and Scope

Define:
- Purpose of this instruction
- Which plants apply (e.g., P010, P022, P0xx)
- Relevant internal documents
- Company standards
- Compliance requirements

**Keep to 2-3 clear sentences.**

### 4. RACI Matrix

**Purpose:** Define roles and responsibilities clearly

**Structure:**
```
| Activity / Deliverable | Role 1 | Role 2 | Role 3 |
|------------------------|--------|--------|--------|
| [Activity]             | R      | A      | I      |
```

**Legend:**
- **R** = Responsible (executes the activity)
- **A** = Accountable (ultimately responsible for outcome)
- **C** = Consulted (provides input/expertise)
- **I** = Informed (must be kept informed)

**Use specific role names, not placeholders.**

### 5. Content (Procedure / Execution)

**Focus:** Describe WHAT activities/topics exist and their requirements

**Structure:** Topic headers with bullets

**NOT:** Sequential numbered steps (that's L5)

**See separate document "L4_Content_Section_Examples.md" for concrete examples.**

**Key guidelines:**
- Identify activity AREAS (not action steps)
- Group related requirements under topic headers
- Use bullets for sub-items

### 6. Control

**Purpose:** Define how to verify correct execution

**Include:**
- How compliance is monitored
- Metrics or KPIs
- Verification frequency
- Who verifies
- Corrective actions if non-compliant

### 7. Abbreviations

**Format:**
```
PBM – Persoonlijke Beschermingsmiddelen
H&S – Health & Safety
WI – Werkinstructie
```

---

## Quality Checklist

Before finalizing L4 document, verify:

1. ✅ Document number follows PREFIX-XXX format
2. ✅ Version is V1.0 for new document
3. ✅ All metadata fields completed
4. ✅ Change history table included
5. ✅ Purpose and scope clearly stated
6. ✅ RACI matrix has specific role names
7. ✅ Content uses topic headers with bullets (NOT numbered steps)
8. ✅ NO photos, screenshots, or step/photo tables

---

## File Naming Convention

**Format:** `[PREFIX]-[CODE]_[Name].docx`

**Examples:**
- `WI-001_Materiaalvoorbereiding.docx`
- `PR-002_Veiligheidsprotocol.docx`

**Location:** `/mnt/user-data/outputs/`

---

## References

- Primary guidelines: `Document_Formatting_and_Content_Guidelines_for_Work_Instructions__L4_.docx`
- ISO/FSSC standards for strategic documentation
- L5 operational guidelines: `Document_Formatting_and_Content_Guidelines_for_Manuals__L5_.docx`
