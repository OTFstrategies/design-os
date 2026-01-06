'use client'

import { ShellWrapper } from '@/components/ShellWrapper'
import { Proceshuisbeheer } from '@/components/proceshuisbeheer'
import { useProceshuisbeheerData } from '@/hooks/useProceshuisbeheerData'
import type { DocumentStatus, RACICode } from '@/components/proceshuisbeheer/types'

export default function ProceshuisbeheerPage() {
  const { data, isLoading, isUsingFallback, changeDocumentStatus, changeRACIToewijzing } = useProceshuisbeheerData()

  const handleFilterDocumenten = (filters: unknown) => {
    console.log('Filter documenten:', filters)
  }

  const handleSortDocumenten = (field: string, direction: 'asc' | 'desc') => {
    console.log('Sort documenten:', field, direction)
  }

  const handleOpenDocument = (id: string) => {
    console.log('Open document:', id)
  }

  const handleChangeStatus = async (id: string, status: DocumentStatus) => {
    console.log('Change status:', id, status)
    await changeDocumentStatus(id, status)
  }

  const handleToggleNode = (nodeId: string) => {
    console.log('Toggle node:', nodeId)
  }

  const handleSelectNode = (nodeId: string) => {
    console.log('Select node:', nodeId)
  }

  const handleOpenMiro = (url: string) => {
    window.open(url, '_blank')
  }

  const handleViewHistory = (documentId: string) => {
    console.log('View history:', documentId)
  }

  const handleCompareVersions = (documentId: string, v1: string, v2: string) => {
    console.log('Compare versions:', documentId, v1, v2)
  }

  const handleRevertToVersion = (documentId: string, versie: string) => {
    console.log('Revert to version:', documentId, versie)
  }

  const handleChangeRACI = async (documentId: string, persoonId: string, rol: RACICode | null) => {
    console.log('Change RACI:', documentId, persoonId, rol)
    await changeRACIToewijzing(documentId, persoonId, rol)
  }

  const handleSaveRACI = (documentId: string) => {
    console.log('Save RACI:', documentId)
  }

  if (isLoading) {
    return (
      <ShellWrapper>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
        </div>
      </ShellWrapper>
    )
  }

  return (
    <ShellWrapper>
      {isUsingFallback && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 px-4 py-2 text-sm text-amber-800 dark:text-amber-200">
          <span className="font-medium">Demo modus:</span> Data wordt lokaal weergegeven. Configureer Supabase om live data te gebruiken.
        </div>
      )}
      <Proceshuisbeheer
        documenten={data.documenten}
        hierarchie={data.hierarchie}
        personen={data.personen}
        rollen={data.rollen}
        raciMatrix={data.raciMatrix}
        versieHistorie={data.versieHistorie}
        statistieken={data.statistieken}
        onFilterDocumenten={handleFilterDocumenten}
        onSortDocumenten={handleSortDocumenten}
        onOpenDocument={handleOpenDocument}
        onChangeStatus={handleChangeStatus}
        onToggleNode={handleToggleNode}
        onSelectNode={handleSelectNode}
        onOpenMiro={handleOpenMiro}
        onViewHistory={handleViewHistory}
        onCompareVersions={handleCompareVersions}
        onRevertToVersion={handleRevertToVersion}
        onChangeRACI={handleChangeRACI}
        onSaveRACI={handleSaveRACI}
      />
    </ShellWrapper>
  )
}
