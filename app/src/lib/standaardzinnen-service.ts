import { supabase } from './supabase'
import type {
  Standaardzin,
  AtomairSequentie,
  Categorie,
  Tag,
  Placeholder,
  DocumentRef,
} from '@/components/standaardzinnen/types'

// =============================================================================
// Fetch Functions
// =============================================================================

export async function fetchStandaardzinnen(): Promise<Standaardzin[]> {
  const { data, error } = await supabase
    .from('standaardzinnen')
    .select('*')
    .order('code')

  if (error) {
    console.error('Error fetching standaardzinnen:', error)
    throw error
  }

  // Fetch document links
  const { data: links } = await supabase
    .from('standaardzin_document_links')
    .select('standaardzin_id, document_id')

  const linkMap = new Map<string, string[]>()
  links?.forEach((link) => {
    if (!linkMap.has(link.standaardzin_id)) {
      linkMap.set(link.standaardzin_id, [])
    }
    linkMap.get(link.standaardzin_id)!.push(link.document_id)
  })

  return data.map((row) => ({
    id: row.id,
    code: row.code,
    tekst: row.tekst,
    categorieCode: row.categorie_code,
    tags: row.tags || [],
    placeholders: row.placeholders || [],
    laatstGewijzigd: row.updated_at,
    gebruiktIn: linkMap.get(row.id) || [],
  }))
}

export async function fetchAtomairSequenties(): Promise<AtomairSequentie[]> {
  const { data: sequenties, error } = await supabase
    .from('atomaire_sequenties')
    .select('*')
    .order('code')

  if (error) {
    console.error('Error fetching atomaire sequenties:', error)
    throw error
  }

  // Fetch steps
  const { data: stappen } = await supabase
    .from('sequentie_stappen')
    .select('*')
    .order('volgorde')

  const stappenMap = new Map<string, { volgorde: number; standaardzinCode: string }[]>()
  stappen?.forEach((stap) => {
    if (!stappenMap.has(stap.sequentie_id)) {
      stappenMap.set(stap.sequentie_id, [])
    }
    stappenMap.get(stap.sequentie_id)!.push({
      volgorde: stap.volgorde,
      standaardzinCode: stap.standaardzin_code,
    })
  })

  // Fetch document links
  const { data: links } = await supabase
    .from('sequentie_document_links')
    .select('sequentie_id, document_id')

  const linkMap = new Map<string, string[]>()
  links?.forEach((link) => {
    if (!linkMap.has(link.sequentie_id)) {
      linkMap.set(link.sequentie_id, [])
    }
    linkMap.get(link.sequentie_id)!.push(link.document_id)
  })

  return sequenties.map((row) => ({
    id: row.id,
    code: row.code,
    naam: row.naam,
    volgordeVerplicht: row.volgorde_verplicht,
    stappen: stappenMap.get(row.id) || [],
    gebruiktIn: linkMap.get(row.id) || [],
  }))
}

export async function fetchCategorieen(): Promise<Categorie[]> {
  const { data, error } = await supabase
    .from('standaardzin_categorieen')
    .select('*')
    .order('naam')

  if (error) {
    console.error('Error fetching categorieen:', error)
    throw error
  }

  return data.map((row) => ({
    code: row.code,
    naam: row.naam,
    beschrijving: row.beschrijving || '',
  }))
}

export async function fetchTags(): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('standaardzin_tags')
    .select('*')
    .order('prefix, waarde')

  if (error) {
    console.error('Error fetching tags:', error)
    throw error
  }

  return data.map((row) => ({
    prefix: row.prefix,
    waarde: row.waarde,
    categorie: row.categorie,
    kleur: row.kleur,
  }))
}

export async function fetchPlaceholders(): Promise<Placeholder[]> {
  const { data, error } = await supabase
    .from('standaardzin_placeholders')
    .select('*')
    .order('naam')

  if (error) {
    console.error('Error fetching placeholders:', error)
    throw error
  }

  return data.map((row) => ({
    naam: row.naam,
    format: row.format,
    toegestaneWaarden: row.toegestane_waarden || [],
  }))
}

export async function fetchDocumentRefs(): Promise<DocumentRef[]> {
  const { data, error } = await supabase
    .from('documenten')
    .select('code, titel, niveau')
    .order('code')

  if (error) {
    console.error('Error fetching document refs:', error)
    throw error
  }

  return data.map((row) => ({
    code: row.code,
    titel: row.titel,
    niveau: row.niveau,
  }))
}

// =============================================================================
// Combined Fetch
// =============================================================================

export async function fetchStandaardzinnenData() {
  const [standaardzinnen, atomaireSequenties, categorieen, tags, placeholders, documenten] =
    await Promise.all([
      fetchStandaardzinnen(),
      fetchAtomairSequenties(),
      fetchCategorieen(),
      fetchTags(),
      fetchPlaceholders(),
      fetchDocumentRefs(),
    ])

  return {
    standaardzinnen,
    atomaireSequenties,
    categorieen,
    tags,
    placeholders,
    documenten,
  }
}
