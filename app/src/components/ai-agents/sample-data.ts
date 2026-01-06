import type {
  Agent,
  PipelineRun,
  PipelineStatistieken,
  PlaudPromptTemplate,
  Categorie,
} from './types'

export const agents: Agent[] = [
  {
    id: 'agent-1a',
    nummer: '1A',
    naam: 'Foto Analyzer',
    rol: 'Beeldherkenning & labeling van apparatuur, locaties, materialen',
    beschrijving: 'Analyseert geüploade foto\'s en identificeert relevante elementen zoals machines, gereedschap, locaties en materialen. Genereert tags voor gebruik in latere stappen.',
    status: 'idle',
    configuratie: {
      modelVersie: 'gpt-4o',
      maxFotos: 20,
      tagCategorieen: ['@equip:', '@loc:', '@mat:', '@safe:'],
      confidenceThreshold: 0.85,
    },
    metrics: {
      runsVandaag: 12,
      gemiddeldeTijd: '8.2s',
      succesRatio: 0.98,
    },
  },
  {
    id: 'agent-1b',
    nummer: '1B',
    naam: 'Document Parser',
    rol: 'Extractie van gestructureerde stappen uit PLAUD PDF-output',
    beschrijving: 'Verwerkt de PDF-output van PLAUD en extraheert gestructureerde stappen. Markeert veiligheidspunten en kwaliteitscontroles.',
    status: 'actief',
    configuratie: {
      modelVersie: 'gpt-4o',
      taal: 'nl',
      stapDelimiters: ['dan', 'vervolgens', 'daarna', 'nu'],
      veiligheidKeywords: ['pas op', 'let op', 'gevaar', 'veiligheid'],
    },
    metrics: {
      runsVandaag: 12,
      gemiddeldeTijd: '15.4s',
      succesRatio: 0.95,
    },
  },
  {
    id: 'agent-2',
    nummer: '2',
    naam: 'Analyse & Codering',
    rol: 'Matching met standaardzinnen en terminologie uit bibliotheek',
    beschrijving: 'Vergelijkt gegenereerde stappen met de standaardzinnenbibliotheek. Identificeert matches, suggereert bestaande zinnen en markeert nieuwe patronen.',
    status: 'idle',
    configuratie: {
      matchThreshold: 0.75,
      maxSuggesties: 5,
      inclusiefSynoniemen: true,
      bibliotheekVersie: '2024-12-01',
    },
    metrics: {
      runsVandaag: 11,
      gemiddeldeTijd: '4.1s',
      succesRatio: 0.99,
    },
  },
  {
    id: 'agent-3',
    nummer: '3',
    naam: 'Stijl Agent',
    rol: 'Toepassen schrijfstandaard, format en documentstructuur',
    beschrijving: 'Past de schrijfstandaard toe: imperatiefvorm, actieve zinnen, correcte terminologie. Formatteert volgens documentniveau (L4/L5).',
    status: 'idle',
    configuratie: {
      stijlregels: ['imperatiefvorm', 'actieve-zinnen', 'verboden-woorden', 'zinlengte'],
      maxZinlengte: 20,
      documentNiveau: 'L5',
      autoCorrectie: true,
    },
    metrics: {
      runsVandaag: 10,
      gemiddeldeTijd: '3.8s',
      succesRatio: 0.97,
    },
  },
  {
    id: 'agent-4',
    nummer: '4',
    naam: 'Review Agent',
    rol: 'Kwaliteitsvalidatie, compliance check, suggesties',
    beschrijving: 'Voert kwaliteitscontroles uit: compleetheid, consistentie, veiligheidsmarkeringen. Genereert verbeterpunten en een kwaliteitsscore.',
    status: 'idle',
    configuratie: {
      checklijst: ['veiligheid', 'compleetheid', 'consistentie', 'leesbaarheid'],
      minimaleScore: 80,
      automatischGoedkeuren: false,
      reviewerNotificatie: true,
    },
    metrics: {
      runsVandaag: 9,
      gemiddeldeTijd: '5.2s',
      succesRatio: 0.94,
    },
  },
  {
    id: 'agent-5',
    nummer: '5',
    naam: 'Opslag Agent',
    rol: 'Documentatie archivering en bibliotheek-integratie',
    beschrijving: 'Slaat goedgekeurde documenten op, integreert nieuwe standaardzinnen in de bibliotheek en beheert versioning.',
    status: 'idle',
    configuratie: {
      opslagLocatie: 'SharePoint',
      bibliotheekSync: true,
      versioning: true,
      notificeerEigenaar: true,
    },
    metrics: {
      runsVandaag: 8,
      gemiddeldeTijd: '2.1s',
      succesRatio: 1.0,
    },
  },
  {
    id: 'agent-6',
    nummer: '6',
    naam: 'Status Tracker',
    rol: 'Realtime pipeline monitoring en notificaties',
    beschrijving: 'Monitort alle pipeline runs, genereert notificaties bij fouten of voltooiing, en beheert de wachtrij.',
    status: 'actief',
    configuratie: {
      pollInterval: 2000,
      notificatieKanalen: ['dashboard', 'email', 'teams'],
      retryBijFout: 3,
      timeoutMinuten: 10,
    },
    metrics: {
      runsVandaag: 45,
      gemiddeldeTijd: '0.1s',
      succesRatio: 1.0,
    },
  },
]

export const pipelineRuns: PipelineRun[] = [
  {
    id: 'run-001',
    titel: 'Heftruckinspectie dagelijkse controle',
    status: 'voltooid',
    gestart: '2024-12-19T08:15:00',
    voltooid: '2024-12-19T08:16:42',
    doorlooptijd: '1m 42s',
    categorie: 'HEF-BEW',
    locatie: 'Warehouse A',
    pdfBestanden: [
      { naam: 'plaud_heftruck_20241219.pdf', grootte: 245760 },
    ],
    fotos: [
      { id: 'foto-001', naam: 'heftruck_vooraanzicht.jpg', tags: ['@equip:heftruck', '@loc:warehouse-a'] },
      { id: 'foto-002', naam: 'controlepunten.jpg', tags: ['@equip:heftruck', '@safe:inspectie'] },
      { id: 'foto-003', naam: 'logboek.jpg', tags: ['@doc:logboek'] },
    ],
    kwaliteitsscore: 94,
    nieuweZinnen: 2,
    agentStappen: [
      { agentId: 'agent-1a', status: 'voltooid', duur: '7.8s', output: '12 tags geïdentificeerd' },
      { agentId: 'agent-1b', status: 'voltooid', duur: '14.2s', output: '18 stappen gegenereerd' },
      { agentId: 'agent-2', status: 'voltooid', duur: '3.9s', output: '14 matches, 2 nieuwe' },
      { agentId: 'agent-3', status: 'voltooid', duur: '4.1s', output: '3 correcties toegepast' },
      { agentId: 'agent-4', status: 'voltooid', duur: '5.0s', output: 'Score: 94/100' },
      { agentId: 'agent-5', status: 'voltooid', duur: '2.2s', output: 'Opgeslagen: WI-HEF-001-v1.2' },
    ],
    resultaat: {
      documentCode: 'WI-HEF-001',
      versie: '1.2',
      aantalStappen: 18,
      reviewStatus: 'goedgekeurd',
    },
  },
  {
    id: 'run-002',
    titel: 'Schoonmaakprocedure koelcel',
    status: 'actief',
    gestart: '2024-12-19T09:32:00',
    voltooid: null,
    doorlooptijd: null,
    categorie: 'REI-KOE',
    locatie: 'Koelcel 3',
    pdfBestanden: [
      { naam: 'plaud_koelcel_20241219.pdf', grootte: 389120 },
    ],
    fotos: [
      { id: 'foto-004', naam: 'koelcel_ingang.jpg', tags: ['@loc:koelcel-3'] },
      { id: 'foto-005', naam: 'reinigingsmiddelen.jpg', tags: ['@mat:reinigingsmiddel', '@safe:pbm'] },
    ],
    kwaliteitsscore: null,
    nieuweZinnen: null,
    agentStappen: [
      { agentId: 'agent-1a', status: 'voltooid', duur: '6.4s', output: '8 tags geïdentificeerd' },
      { agentId: 'agent-1b', status: 'voltooid', duur: '18.1s', output: '24 stappen gegenereerd' },
      { agentId: 'agent-2', status: 'actief', duur: null, output: null },
      { agentId: 'agent-3', status: 'wacht', duur: null, output: null },
      { agentId: 'agent-4', status: 'wacht', duur: null, output: null },
      { agentId: 'agent-5', status: 'wacht', duur: null, output: null },
    ],
    resultaat: null,
  },
  {
    id: 'run-003',
    titel: 'Palletwikkelmachine instellen',
    status: 'review_nodig',
    gestart: '2024-12-19T07:45:00',
    voltooid: '2024-12-19T07:48:15',
    doorlooptijd: '3m 15s',
    categorie: 'PAL-VER',
    locatie: 'Expeditie',
    pdfBestanden: [
      { naam: 'plaud_wikkelmachine_20241219.pdf', grootte: 512000 },
    ],
    fotos: [
      { id: 'foto-006', naam: 'wikkelmachine_panel.jpg', tags: ['@equip:wikkelmachine', '@loc:expeditie'] },
      { id: 'foto-007', naam: 'instellingen_display.jpg', tags: ['@equip:wikkelmachine', '@act:instellen'] },
    ],
    kwaliteitsscore: 72,
    nieuweZinnen: 5,
    agentStappen: [
      { agentId: 'agent-1a', status: 'voltooid', duur: '5.9s', output: '6 tags geïdentificeerd' },
      { agentId: 'agent-1b', status: 'voltooid', duur: '21.3s', output: '28 stappen gegenereerd' },
      { agentId: 'agent-2', status: 'voltooid', duur: '5.2s', output: '8 matches, 5 nieuwe' },
      { agentId: 'agent-3', status: 'voltooid', duur: '4.8s', output: '7 correcties toegepast' },
      { agentId: 'agent-4', status: 'voltooid', duur: '6.1s', output: 'Score: 72/100 - review nodig' },
      { agentId: 'agent-5', status: 'wacht', duur: null, output: 'Wacht op goedkeuring' },
    ],
    resultaat: {
      documentCode: 'WI-PAL-012',
      versie: 'draft',
      aantalStappen: 28,
      reviewStatus: 'in_review',
      reviewOpmerkingen: [
        'Stap 12: Veiligheidsinstructie ontbreekt',
        'Stap 18-20: Kunnen samengevoegd worden',
        '5 nieuwe standaardzinnen ter beoordeling',
      ],
    },
  },
  {
    id: 'run-004',
    titel: 'Orderpicken zone B',
    status: 'gefaald',
    gestart: '2024-12-18T14:22:00',
    voltooid: '2024-12-18T14:23:45',
    doorlooptijd: '1m 45s',
    categorie: 'ORD-PIC',
    locatie: 'Zone B',
    pdfBestanden: [
      { naam: 'plaud_orderpick_20241218.pdf', grootte: 184320 },
    ],
    fotos: [],
    kwaliteitsscore: null,
    nieuweZinnen: null,
    agentStappen: [
      { agentId: 'agent-1a', status: 'overgeslagen', duur: '0s', output: 'Geen foto\'s geüpload' },
      { agentId: 'agent-1b', status: 'voltooid', duur: '12.5s', output: '8 stappen gegenereerd' },
      { agentId: 'agent-2', status: 'fout', duur: '45.2s', output: 'Timeout: bibliotheek onbereikbaar' },
      { agentId: 'agent-3', status: 'afgebroken', duur: null, output: null },
      { agentId: 'agent-4', status: 'afgebroken', duur: null, output: null },
      { agentId: 'agent-5', status: 'afgebroken', duur: null, output: null },
    ],
    resultaat: null,
    foutmelding: 'Analyse & Codering agent kon geen verbinding maken met de standaardzinnenbibliotheek. Probeer opnieuw of neem contact op met IT.',
  },
  {
    id: 'run-005',
    titel: 'Noodprocedure stroomuitval',
    status: 'voltooid',
    gestart: '2024-12-18T10:05:00',
    voltooid: '2024-12-18T10:08:32',
    doorlooptijd: '3m 32s',
    categorie: 'NRG-NOO',
    locatie: 'Technische ruimte',
    pdfBestanden: [
      { naam: 'plaud_noodprocedure_20241218.pdf', grootte: 716800 },
    ],
    fotos: [
      { id: 'foto-008', naam: 'hoofdschakelaar.jpg', tags: ['@equip:schakelaar', '@safe:nood', '@loc:technisch'] },
      { id: 'foto-009', naam: 'noodverlichting.jpg', tags: ['@equip:noodverlichting', '@safe:evacuatie'] },
      { id: 'foto-010', naam: 'ups_systeem.jpg', tags: ['@equip:ups', '@loc:technisch'] },
      { id: 'foto-011', naam: 'evacuatieroute.jpg', tags: ['@safe:evacuatie', '@loc:gang'] },
    ],
    kwaliteitsscore: 98,
    nieuweZinnen: 0,
    agentStappen: [
      { agentId: 'agent-1a', status: 'voltooid', duur: '9.2s', output: '16 tags geïdentificeerd' },
      { agentId: 'agent-1b', status: 'voltooid', duur: '28.4s', output: '32 stappen gegenereerd' },
      { agentId: 'agent-2', status: 'voltooid', duur: '4.8s', output: '32 matches, 0 nieuwe' },
      { agentId: 'agent-3', status: 'voltooid', duur: '5.1s', output: '1 correctie toegepast' },
      { agentId: 'agent-4', status: 'voltooid', duur: '7.3s', output: 'Score: 98/100' },
      { agentId: 'agent-5', status: 'voltooid', duur: '2.4s', output: 'Opgeslagen: PR-NRG-002-v2.0' },
    ],
    resultaat: {
      documentCode: 'PR-NRG-002',
      versie: '2.0',
      aantalStappen: 32,
      reviewStatus: 'goedgekeurd',
    },
  },
]

export const statistieken: PipelineStatistieken = {
  runsVandaag: 12,
  runsDezeWeek: 47,
  succesRatio: 0.89,
  gemiddeldeDoorlooptijd: '2m 18s',
  actieveRuns: 1,
  inReview: 3,
  nieuweZinnenDezeWeek: 23,
}

export const plaudPromptTemplate: PlaudPromptTemplate = {
  titel: 'Standaard Plaud Prompt',
  versie: '1.0',
  laatstBijgewerkt: '2024-12-01',
  template: `Je bent een expert in het vastleggen van werkprocedures. Ik ga nu een taak uitvoeren en hardop beschrijven wat ik doe. Maak van mijn beschrijving een gestructureerde werkinstructie.

Let op:
- Elke fysieke handeling = apart stap
- Gebruik imperatiefvorm (Pak, Draai, Controleer)
- Noteer gereedschap en materialen
- Markeer veiligheidspunten met [VEILIGHEID]
- Markeer kwaliteitscontroles met [CONTROLE]

Ik begin nu met: [TAAKNAAM]`,
  instructies: [
    'Start de Plaud-app en begin met opnemen',
    'Lees de prompt hardop voor',
    'Vervang [TAAKNAAM] door de specifieke taak',
    'Beschrijf elke handeling terwijl je deze uitvoert',
    'Stop de opname wanneer de taak is afgerond',
  ],
}

export const categorieen: Categorie[] = [
  { code: 'HEF-BEW', naam: 'Heftruckbewegingen' },
  { code: 'REI-KOE', naam: 'Reiniging Koeling' },
  { code: 'PAL-VER', naam: 'Palletverwerking' },
  { code: 'ORD-PIC', naam: 'Orderpicking' },
  { code: 'NRG-NOO', naam: 'Noodprocedures Energie' },
  { code: 'OHD-EL', naam: 'Onderhoud Elektra' },
  { code: 'VEI-ALG', naam: 'Veiligheid Algemeen' },
]
