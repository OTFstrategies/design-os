'use client'

import { useStandaardzinnenData } from './useStandaardzinnenData'
import { useSchrijfstandaardData } from './useSchrijfstandaardData'

export function useGlossaryData() {
  const standaardzinnenResult = useStandaardzinnenData()
  const schrijfstandaardResult = useSchrijfstandaardData()

  // Combined loading state
  const isLoading = standaardzinnenResult.isLoading || schrijfstandaardResult.isLoading

  // Combined fallback state
  const isUsingFallback = standaardzinnenResult.isUsingFallback || schrijfstandaardResult.isUsingFallback

  // Combined error
  const error = standaardzinnenResult.error || schrijfstandaardResult.error

  // Combined data
  const data = {
    // Standaardzinnen data
    standaardzinnen: standaardzinnenResult.data.standaardzinnen,
    atomaireSequenties: standaardzinnenResult.data.atomaireSequenties,
    categorieen: standaardzinnenResult.data.categorieen,
    tags: standaardzinnenResult.data.tags,
    placeholders: standaardzinnenResult.data.placeholders,
    documenten: standaardzinnenResult.data.documenten,

    // Schrijfstandaard data
    terminologie: schrijfstandaardResult.data.terminologie,
    stijlregels: schrijfstandaardResult.data.stijlregels,
    stijlregelCategorieen: schrijfstandaardResult.data.stijlregelCategorieen,
    documentNiveaus: schrijfstandaardResult.data.documentNiveaus,
    documentTypes: schrijfstandaardResult.data.documentTypes,
    rollen: schrijfstandaardResult.data.rollen,
    raciMatrix: schrijfstandaardResult.data.raciMatrix,
    coderingFormaat: schrijfstandaardResult.data.coderingFormaat,
  }

  // Combined refetch
  const refetch = async () => {
    await Promise.all([
      standaardzinnenResult.refetch(),
      schrijfstandaardResult.refetch(),
    ])
  }

  return {
    data,
    isLoading,
    error,
    isUsingFallback,
    refetch,
  }
}
