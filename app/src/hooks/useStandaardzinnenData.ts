'use client'

import { useState, useEffect, useCallback } from 'react'
import type {
  Standaardzin,
  AtomairSequentie,
  Categorie,
  Tag,
  Placeholder,
  DocumentRef,
} from '@/components/standaardzinnen/types'
import { fetchStandaardzinnenData } from '@/lib/standaardzinnen-service'
import { isSupabaseConfigured } from '@/lib/supabase'

// Fallback to sample data if Supabase is not configured
import {
  standaardzinnen as sampleStandaardzinnen,
  atomaireSequenties as sampleAtomairSequenties,
  categorieen as sampleCategorieen,
  tags as sampleTags,
  placeholders as samplePlaceholders,
  documenten as sampleDocumenten,
} from '@/components/standaardzinnen/sample-data'

interface StandaardzinnenData {
  standaardzinnen: Standaardzin[]
  atomaireSequenties: AtomairSequentie[]
  categorieen: Categorie[]
  tags: Tag[]
  placeholders: Placeholder[]
  documenten: DocumentRef[]
}

interface UseStandaardzinnenDataResult {
  data: StandaardzinnenData
  isLoading: boolean
  error: Error | null
  isUsingFallback: boolean
  refetch: () => Promise<void>
}

const fallbackData: StandaardzinnenData = {
  standaardzinnen: sampleStandaardzinnen,
  atomaireSequenties: sampleAtomairSequenties,
  categorieen: sampleCategorieen,
  tags: sampleTags,
  placeholders: samplePlaceholders,
  documenten: sampleDocumenten,
}

export function useStandaardzinnenData(): UseStandaardzinnenDataResult {
  const [data, setData] = useState<StandaardzinnenData>(fallbackData)
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

      const result = await fetchStandaardzinnenData()
      setData(result)
      setIsUsingFallback(false)
    } catch (err) {
      console.error('Failed to fetch standaardzinnen data, using fallback:', err)
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
