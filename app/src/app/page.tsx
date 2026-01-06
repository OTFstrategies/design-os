'use client'

import { useState } from 'react'
import { ShellWrapper } from '@/components/ShellWrapper'
import { Proceshuisbeheer } from '@/components/proceshuisbeheer'
import { useProceshuisbeheerData } from '@/hooks/useProceshuisbeheerData'
import type { HierarchieNode, DocumentStatus, RACICode } from '@/components/proceshuisbeheer/types'

export default function Home() {
  const { data, isLoading, isUsingFallback, changeDocumentStatus, changeRACIToewijzing } = useProceshuisbeheerData()
  const [localHierarchie, setLocalHierarchie] = useState<HierarchieNode[] | null>(null)

  // Use local state for hierarchie to handle toggle, or fallback to data
  const hierarchie = localHierarchie ?? data.hierarchie

  const handleToggleNode = (nodeId: string) => {
    const toggleNode = (nodes: HierarchieNode[]): HierarchieNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, expanded: !node.expanded }
        }
        if (node.children.length > 0) {
          return { ...node, children: toggleNode(node.children) }
        }
        return node
      })
    }
    setLocalHierarchie(toggleNode(hierarchie))
  }

  const handleOpenMiro = (url: string) => {
    window.open(url, '_blank')
  }

  const handleOpenDocument = (id: string) => {
    console.log('Opening document:', id)
    // TODO: Navigate to document detail view
  }

  const handleChangeStatus = async (id: string, status: DocumentStatus) => {
    await changeDocumentStatus(id, status)
  }

  const handleChangeRACI = async (documentId: string, persoonId: string, rol: RACICode | null) => {
    await changeRACIToewijzing(documentId, persoonId, rol)
  }

  const handleSaveRACI = (documentId: string) => {
    console.log('Saving RACI for:', documentId)
    // TODO: Save to backend
  }

  if (isLoading) {
    return (
      <ShellWrapper>
        <div className="h-full flex items-center justify-center bg-stone-50 dark:bg-stone-950">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-stone-600 dark:text-stone-400">Laden...</p>
          </div>
        </div>
      </ShellWrapper>
    )
  }

  return (
    <ShellWrapper>
      {isUsingFallback && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800 px-4 py-2">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <span className="font-medium">Demo modus:</span> Supabase niet geconfigureerd. Bekijk sample data.
          </p>
        </div>
      )}
      <Proceshuisbeheer
        documenten={data.documenten}
        hierarchie={hierarchie}
        personen={data.personen}
        rollen={data.rollen}
        raciMatrix={data.raciMatrix}
        versieHistorie={data.versieHistorie}
        statistieken={data.statistieken}
        onToggleNode={handleToggleNode}
        onOpenMiro={handleOpenMiro}
        onOpenDocument={handleOpenDocument}
        onChangeStatus={handleChangeStatus}
        onChangeRACI={handleChangeRACI}
        onSaveRACI={handleSaveRACI}
      />
    </ShellWrapper>
  )
}
