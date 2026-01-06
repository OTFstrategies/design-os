'use client'

import { useState, useEffect, useCallback } from 'react'
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
import {
  fetchProceshuisbeheerData,
  updateDocumentStatus,
  updateRACIToewijzing,
} from '@/lib/proceshuisbeheer-service'
import { isSupabaseConfigured } from '@/lib/supabase'

// Fallback to sample data if Supabase is not configured
import {
  documenten as sampleDocumenten,
  hierarchie as sampleHierarchie,
  personen as samplePersonen,
  rollen as sampleRollen,
  raciMatrix as sampleRaciMatrix,
  versieHistorie as sampleVersieHistorie,
  statistieken as sampleStatistieken,
} from '@/components/proceshuisbeheer/sample-data'

interface ProceshuisbeheerData {
  documenten: Document[]
  hierarchie: HierarchieNode[]
  personen: Persoon[]
  rollen: Rol[]
  raciMatrix: RACIToewijzing[]
  versieHistorie: VersieHistorie[]
  statistieken: Statistieken
}

interface UseProceshuisbeheerDataResult {
  data: ProceshuisbeheerData
  isLoading: boolean
  error: Error | null
  isUsingFallback: boolean
  refetch: () => Promise<void>
  // Actions
  changeDocumentStatus: (id: string, status: DocumentStatus) => Promise<void>
  changeRACIToewijzing: (documentId: string, persoonId: string, rol: RACICode | null) => Promise<void>
}

const fallbackData: ProceshuisbeheerData = {
  documenten: sampleDocumenten,
  hierarchie: sampleHierarchie,
  personen: samplePersonen,
  rollen: sampleRollen,
  raciMatrix: sampleRaciMatrix,
  versieHistorie: sampleVersieHistorie,
  statistieken: sampleStatistieken,
}

export function useProceshuisbeheerData(): UseProceshuisbeheerDataResult {
  const [data, setData] = useState<ProceshuisbeheerData>(fallbackData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isUsingFallback, setIsUsingFallback] = useState(false)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        console.log('Supabase not configured, using sample data')
        setData(fallbackData)
        setIsUsingFallback(true)
        setIsLoading(false)
        return
      }

      const result = await fetchProceshuisbeheerData()
      setData(result)
      setIsUsingFallback(false)
    } catch (err) {
      console.error('Failed to fetch proceshuisbeheer data, using fallback:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch data'))
      setData(fallbackData)
      setIsUsingFallback(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const changeDocumentStatus = useCallback(async (id: string, status: DocumentStatus) => {
    if (isUsingFallback) {
      console.log('Changing document status (sample mode):', id, status)
      return
    }
    await updateDocumentStatus(id, status)
    await fetchData()
  }, [isUsingFallback, fetchData])

  const changeRACIToewijzing = useCallback(async (documentId: string, persoonId: string, rol: RACICode | null) => {
    if (isUsingFallback) {
      console.log('Changing RACI toewijzing (sample mode):', documentId, persoonId, rol)
      return
    }
    await updateRACIToewijzing(documentId, persoonId, rol)
    await fetchData()
  }, [isUsingFallback, fetchData])

  return {
    data,
    isLoading,
    error,
    isUsingFallback,
    refetch: fetchData,
    changeDocumentStatus,
    changeRACIToewijzing,
  }
}
