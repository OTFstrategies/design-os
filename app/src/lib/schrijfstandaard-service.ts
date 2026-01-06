import { supabase } from './supabase'
import type {
  Terminologie,
  Stijlregel,
  StijlregelCategorie,
  DocumentNiveau,
  DocumentType,
  Rol,
  RACIToewijzing,
  CoderingFormaat,
} from '@/components/schrijfstandaard/types'

// =============================================================================
// Fetch Functions
// =============================================================================

export async function fetchTerminologie(): Promise<Terminologie[]> {
  const { data, error } = await supabase
    .from('terminologie')
    .select('*')
    .order('voorkeursterm')

  if (error) {
    console.error('Error fetching terminologie:', error)
    throw error
  }

  return data.map((row) => ({
    id: row.id,
    voorkeursterm: row.voorkeursterm,
    verbodenSynoniemen: row.verboden_synoniemen || [],
    definitie: row.definitie || '',
    context: row.context || '',
    voorbeelden: row.voorbeelden || [],
    categorie: row.categorie_code || '',
  }))
}

export async function fetchStijlregels(): Promise<Stijlregel[]> {
  const { data, error } = await supabase
    .from('stijlregels')
    .select(`
      *,
      categorie:stijlregel_categorieen!categorie_id(code)
    `)

  if (error) {
    console.error('Error fetching stijlregels:', error)
    throw error
  }

  return data.map((row) => ({
    id: row.id,
    categorie: row.categorie?.code || '',
    titel: row.titel,
    beschrijving: row.beschrijving,
    voorbeeldGoed: row.voorbeeld_goed || '',
    voorbeeldFout: row.voorbeeld_fout || '',
    toelichting: row.toelichting || '',
  }))
}

export async function fetchStijlregelCategorieen(): Promise<StijlregelCategorie[]> {
  const { data, error } = await supabase
    .from('stijlregel_categorieen')
    .select('*')

  if (error) {
    console.error('Error fetching stijlregel categorieen:', error)
    throw error
  }

  return data.map((row) => ({
    id: row.id,
    code: row.code,
    naam: row.naam,
    beschrijving: row.beschrijving || '',
    icoon: row.icoon || 'file-text',
  }))
}

export async function fetchDocumentNiveaus(): Promise<DocumentNiveau[]> {
  const { data, error } = await supabase
    .from('document_niveaus')
    .select('*')
    .order('sort_order')

  if (error) {
    console.error('Error fetching document niveaus:', error)
    throw error
  }

  return data.map((row) => ({
    id: row.id,
    code: row.code,
    naam: row.naam,
    beschrijving: row.beschrijving || '',
    doelgroep: row.doelgroep || '',
    voorbeelden: row.voorbeelden || [],
    templateSecties: row.template_secties || [],
    kleur: row.kleur || '#3b82f6',
  }))
}

export async function fetchDocumentTypes(): Promise<DocumentType[]> {
  const { data, error } = await supabase
    .from('document_types')
    .select('*')

  if (error) {
    console.error('Error fetching document types:', error)
    throw error
  }

  return data.map((row) => ({
    id: row.id,
    code: row.code,
    naam: row.naam,
    niveau: row.niveau_code || '',
    beschrijving: row.beschrijving || '',
    structuurVereisten: row.structuur_vereisten || [],
  }))
}

export async function fetchRollen(): Promise<Rol[]> {
  const { data, error } = await supabase
    .from('schrijfstandaard_rollen')
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
  }))
}

export async function fetchRACIMatrix(): Promise<RACIToewijzing[]> {
  const { data: types, error: typesError } = await supabase
    .from('document_types')
    .select('code')

  if (typesError) throw typesError

  const { data: matrix, error: matrixError } = await supabase
    .from('document_type_raci')
    .select('*')

  if (matrixError) throw matrixError

  // Group by document type
  const result: RACIToewijzing[] = types.map((type) => {
    const typeToewijzingen = matrix.filter((m) => m.document_type_code === type.code)
    const toewijzingenMap: Record<string, 'R' | 'A' | 'C' | 'I'> = {}
    typeToewijzingen.forEach((t) => {
      toewijzingenMap[t.rol_code] = t.raci_waarde
    })

    return {
      documentTypeCode: type.code,
      toewijzingen: toewijzingenMap,
    }
  })

  return result
}

export async function fetchCoderingFormaat(): Promise<CoderingFormaat> {
  const { data: formaat, error: formaatError } = await supabase
    .from('codering_formaat')
    .select('*')
    .eq('is_active', true)
    .single()

  if (formaatError) {
    // Return default if none found
    return {
      patroon: '[TYPE]-[AFD]-[CAT]-[NR]-[VER]',
      voorbeeld: 'WI-LOG-HEF-001-v1.0',
      segmenten: [],
    }
  }

  const { data: segmenten, error: segmentenError } = await supabase
    .from('codering_segmenten')
    .select('*')
    .eq('formaat_id', formaat.id)
    .order('sort_order')

  if (segmentenError) throw segmentenError

  return {
    patroon: formaat.patroon,
    voorbeeld: formaat.voorbeeld,
    segmenten: segmenten.map((s) => ({
      naam: s.naam,
      beschrijving: s.beschrijving || '',
      voorbeelden: s.voorbeelden || [],
    })),
  }
}

// =============================================================================
// Combined Fetch
// =============================================================================

export async function fetchSchrijfstandaardData() {
  const [
    terminologie,
    stijlregels,
    stijlregelCategorieen,
    documentNiveaus,
    documentTypes,
    rollen,
    raciMatrix,
    coderingFormaat,
  ] = await Promise.all([
    fetchTerminologie(),
    fetchStijlregels(),
    fetchStijlregelCategorieen(),
    fetchDocumentNiveaus(),
    fetchDocumentTypes(),
    fetchRollen(),
    fetchRACIMatrix(),
    fetchCoderingFormaat(),
  ])

  return {
    terminologie,
    stijlregels,
    stijlregelCategorieen,
    documentNiveaus,
    documentTypes,
    rollen,
    raciMatrix,
    coderingFormaat,
  }
}
