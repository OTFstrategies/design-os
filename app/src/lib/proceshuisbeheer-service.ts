import { supabase } from './supabase'
import type {
  Document,
  HierarchieNode,
  Persoon,
  Rol,
  RACIToewijzing,
  VersieHistorie,
  Statistieken,
  DocumentStatus,
  RACICode,
} from '@/components/proceshuisbeheer/types'

// =============================================================================
// Fetch Functions
// =============================================================================

export async function fetchDocumenten(): Promise<Document[]> {
  const { data, error } = await supabase
    .from('documenten')
    .select(`
      *,
      eigenaar:personen!eigenaar_id(naam),
      afdeling:afdelingen!afdeling_id(naam)
    `)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching documenten:', error)
    throw error
  }

  return data.map((row) => ({
    id: row.id,
    code: row.code,
    titel: row.titel,
    niveau: row.niveau,
    type: row.type,
    status: row.status,
    versie: row.versie,
    laatstGewijzigd: row.updated_at,
    eigenaar: row.eigenaar?.naam || 'Onbekend',
    afdeling: row.afdeling?.naam || 'Onbekend',
    parentId: row.parent_id || '',
    aantalStappen: row.aantal_stappen,
    tags: row.tags || [],
  }))
}

export async function fetchHierarchie(): Promise<HierarchieNode[]> {
  const { data, error } = await supabase
    .from('hierarchie_nodes')
    .select('*')
    .order('sort_order')

  if (error) {
    console.error('Error fetching hierarchie:', error)
    throw error
  }

  // Build tree structure
  const nodeMap = new Map<string, HierarchieNode>()
  const roots: HierarchieNode[] = []

  // First pass: create all nodes
  data.forEach((row) => {
    nodeMap.set(row.id, {
      id: row.id,
      niveau: row.niveau,
      titel: row.titel,
      code: row.code,
      expanded: true,
      miroLink: row.miro_link,
      children: [],
    })
  })

  // Second pass: build tree
  data.forEach((row) => {
    const node = nodeMap.get(row.id)!
    if (row.parent_id && nodeMap.has(row.parent_id)) {
      nodeMap.get(row.parent_id)!.children.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}

export async function fetchPersonen(): Promise<Persoon[]> {
  const { data, error } = await supabase
    .from('personen')
    .select(`
      *,
      afdeling:afdelingen!afdeling_id(naam)
    `)
    .order('naam')

  if (error) {
    console.error('Error fetching personen:', error)
    throw error
  }

  return data.map((row) => ({
    id: row.id,
    naam: row.naam,
    functie: row.functie,
    afdeling: row.afdeling?.naam || 'Onbekend',
    email: row.email,
  }))
}

export async function fetchRollen(): Promise<Rol[]> {
  const { data, error } = await supabase
    .from('raci_rollen')
    .select('*')

  if (error) {
    console.error('Error fetching rollen:', error)
    throw error
  }

  return data.map((row) => ({
    id: row.id,
    code: row.code,
    naam: row.naam,
    beschrijving: row.beschrijving || '',
    kleur: row.kleur,
  }))
}

export async function fetchRACIMatrix(): Promise<RACIToewijzing[]> {
  const { data: documenten, error: docError } = await supabase
    .from('documenten')
    .select('id, code, titel')

  if (docError) throw docError

  const { data: toewijzingen, error: raciError } = await supabase
    .from('raci_toewijzingen')
    .select('document_id, persoon_id, rol')

  if (raciError) throw raciError

  // Group by document
  const matrix: RACIToewijzing[] = documenten.map((doc) => {
    const docToewijzingen = toewijzingen.filter((t) => t.document_id === doc.id)
    const toewijzingenMap: Record<string, RACICode> = {}
    docToewijzingen.forEach((t) => {
      toewijzingenMap[t.persoon_id] = t.rol as RACICode
    })

    return {
      documentId: doc.id,
      documentCode: doc.code,
      documentTitel: doc.titel,
      toewijzingen: toewijzingenMap,
    }
  })

  return matrix
}

export async function fetchVersieHistorie(): Promise<VersieHistorie[]> {
  const { data: documenten, error: docError } = await supabase
    .from('documenten')
    .select('id, code')

  if (docError) throw docError

  const { data: versies, error: versieError } = await supabase
    .from('versie_historie')
    .select(`
      *,
      auteur:personen!auteur_id(naam)
    `)
    .order('datum', { ascending: false })

  if (versieError) throw versieError

  // Group by document
  const historieMap = new Map<string, VersieHistorie>()

  documenten.forEach((doc) => {
    historieMap.set(doc.id, {
      documentId: doc.id,
      documentCode: doc.code,
      versies: [],
    })
  })

  versies.forEach((v) => {
    const historie = historieMap.get(v.document_id)
    if (historie) {
      historie.versies.push({
        versie: v.versie,
        datum: v.datum,
        auteur: v.auteur?.naam || 'Onbekend',
        wijzigingen: v.wijzigingen,
        status: v.status,
      })
    }
  })

  return Array.from(historieMap.values())
}

export async function fetchStatistieken(): Promise<Statistieken> {
  const { data, error } = await supabase
    .from('documenten')
    .select('status, updated_at, versie')

  if (error) throw error

  const totaal = data.length
  const statusCounts = {
    active: 0,
    review: 0,
    draft: 0,
    obsolete: 0,
  }

  let latestUpdate = ''
  let versionSum = 0

  data.forEach((doc) => {
    statusCounts[doc.status as keyof typeof statusCounts]++
    if (!latestUpdate || doc.updated_at > latestUpdate) {
      latestUpdate = doc.updated_at
    }
    const majorVersion = parseFloat(doc.versie) || 1
    versionSum += majorVersion
  })

  return {
    totaalDocumenten: totaal,
    actief: statusCounts.active,
    review: statusCounts.review,
    draft: statusCounts.draft,
    obsolete: statusCounts.obsolete,
    gemiddeldeVersie: totaal > 0 ? (versionSum / totaal).toFixed(1) : '1.0',
    laatsteUpdate: latestUpdate,
  }
}

// =============================================================================
// Mutation Functions
// =============================================================================

export async function updateDocumentStatus(id: string, status: DocumentStatus): Promise<void> {
  const { error } = await supabase
    .from('documenten')
    .update({ status })
    .eq('id', id)

  if (error) throw error
}

export async function updateRACIToewijzing(
  documentId: string,
  persoonId: string,
  rol: RACICode | null
): Promise<void> {
  if (rol === null) {
    // Remove the assignment
    await supabase
      .from('raci_toewijzingen')
      .delete()
      .eq('document_id', documentId)
      .eq('persoon_id', persoonId)
  } else {
    // Upsert the assignment
    const { error } = await supabase
      .from('raci_toewijzingen')
      .upsert(
        { document_id: documentId, persoon_id: persoonId, rol },
        { onConflict: 'document_id,persoon_id' }
      )

    if (error) throw error
  }
}

// =============================================================================
// Combined Fetch
// =============================================================================

export async function fetchProceshuisbeheerData() {
  const [documenten, hierarchie, personen, rollen, raciMatrix, versieHistorie, statistieken] =
    await Promise.all([
      fetchDocumenten(),
      fetchHierarchie(),
      fetchPersonen(),
      fetchRollen(),
      fetchRACIMatrix(),
      fetchVersieHistorie(),
      fetchStatistieken(),
    ])

  return {
    documenten,
    hierarchie,
    personen,
    rollen,
    raciMatrix,
    versieHistorie,
    statistieken,
  }
}
