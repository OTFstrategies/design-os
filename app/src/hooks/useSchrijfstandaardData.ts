'use client'

import { useState, useEffect, useCallback } from 'react'
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
import { fetchSchrijfstandaardData } from '@/lib/schrijfstandaard-service'
import { isSupabaseConfigured } from '@/lib/supabase'

// Fallback to sample data if Supabase is not configured
import {
  terminologie as sampleTerminologie,
  stijlregels as sampleStijlregels,
  stijlregelCategorieen as sampleStijlregelCategorieen,
  documentNiveaus as sampleDocumentNiveaus,
  documentTypes as sampleDocumentTypes,
  rollen as sampleRollen,
  raciMatrix as sampleRaciMatrix,
  coderingFormaat as sampleCoderingFormaat,
} from '@/components/schrijfstandaard/sample-data'

interface SchrijfstandaardData {
  terminologie: Terminologie[]
  stijlregels: Stijlregel[]
  stijlregelCategorieen: StijlregelCategorie[]
  documentNiveaus: DocumentNiveau[]
  documentTypes: DocumentType[]
  rollen: Rol[]
  raciMatrix: RACIToewijzing[]
  coderingFormaat: CoderingFormaat
}

interface UseSchrijfstandaardDataResult {
  data: SchrijfstandaardData
  isLoading: boolean
  error: Error | null
  isUsingFallback: boolean
  refetch: () => Promise<void>
}

const fallbackData: SchrijfstandaardData = {
  terminologie: sampleTerminologie,
  stijlregels: sampleStijlregels,
  stijlregelCategorieen: sampleStijlregelCategorieen,
  documentNiveaus: sampleDocumentNiveaus,
  documentTypes: sampleDocumentTypes,
  rollen: sampleRollen,
  raciMatrix: sampleRaciMatrix,
  coderingFormaat: sampleCoderingFormaat,
}

export function useSchrijfstandaardData(): UseSchrijfstandaardDataResult {
  const [data, setData] = useState<SchrijfstandaardData>(fallbackData)
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

      const result = await fetchSchrijfstandaardData()
      setData(result)
      setIsUsingFallback(false)
    } catch (err) {
      console.error('Failed to fetch schrijfstandaard data, using fallback:', err)
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

  return {
    data,
    isLoading,
    error,
    isUsingFallback,
    refetch: fetchData,
  }
}
