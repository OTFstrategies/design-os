'use client'

import { ShellWrapper } from '@/components/ShellWrapper'
import { Glossary } from '@/components/glossary'
import { useGlossaryData } from '@/hooks/useGlossaryData'
import type { CodeGeneratorParams } from '@/components/schrijfstandaard/types'

export default function GlossaryPage() {
  const { data, isLoading, isUsingFallback } = useGlossaryData()

  // Standaardzinnen handlers
  const handleCopyZin = (id: string, includeCode?: boolean) => {
    const zin = data.standaardzinnen.find(z => z.id === id)
    if (zin) {
      const text = includeCode ? `${zin.code}: ${zin.tekst}` : zin.tekst
      navigator.clipboard.writeText(text)
      console.log('Copied:', text)
    }
  }

  const handleInsertZin = (id: string) => {
    console.log('Insert standaardzin:', id)
  }

  const handleViewZin = (id: string) => {
    console.log('View standaardzin:', id)
  }

  const handleEditZin = (id: string) => {
    console.log('Edit standaardzin:', id)
  }

  const handleCopySequentie = (id: string) => {
    const seq = data.atomaireSequenties.find(s => s.id === id)
    if (seq) {
      const stappen = seq.stappen.map(stap => {
        const zin = data.standaardzinnen.find(z => z.code === stap.standaardzinCode)
        return `${stap.volgorde}. ${zin?.tekst || stap.standaardzinCode}`
      })
      const text = `${seq.naam}:\n${stappen.join('\n')}`
      navigator.clipboard.writeText(text)
      console.log('Copied sequence:', text)
    }
  }

  const handleInsertSequentie = (id: string) => {
    console.log('Insert sequentie:', id)
  }

  const handleViewSequentie = (id: string) => {
    console.log('View sequentie:', id)
  }

  // Terminologie handlers
  const handleSearchTerminologie = (query: string) => {
    console.log('Searching terminology:', query)
  }

  const handleCopyTerm = (term: string) => {
    navigator.clipboard.writeText(term)
    console.log('Copied term:', term)
  }

  const handleProposeTerm = () => {
    console.log('Propose new term clicked')
  }

  // Stijlregels handlers
  const handleGenerateChecklist = (regelIds: string[]) => {
    console.log('Generate checklist for rules:', regelIds)
  }

  // Documentstructuur handlers
  const handleSelectNiveau = (code: string) => {
    console.log('Selected niveau:', code)
  }

  const handleViewTemplate = (niveauCode: string) => {
    console.log('View template for niveau:', niveauCode)
  }

  const handleGenerateCode = (params: CodeGeneratorParams) => {
    console.log('Generated code with params:', params)
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
      <Glossary
        // Standaardzinnen data
        standaardzinnen={data.standaardzinnen}
        atomaireSequenties={data.atomaireSequenties}
        categorieen={data.categorieen}
        tags={data.tags}
        placeholders={data.placeholders}
        documenten={data.documenten}
        // Schrijfstandaard data
        terminologie={data.terminologie}
        stijlregels={data.stijlregels}
        stijlregelCategorieen={data.stijlregelCategorieen}
        documentNiveaus={data.documentNiveaus}
        documentTypes={data.documentTypes}
        rollen={data.rollen}
        raciMatrix={data.raciMatrix}
        coderingFormaat={data.coderingFormaat}
        // Standaardzinnen callbacks
        onCopyZin={handleCopyZin}
        onInsertZin={handleInsertZin}
        onViewZin={handleViewZin}
        onEditZin={handleEditZin}
        onCopySequentie={handleCopySequentie}
        onInsertSequentie={handleInsertSequentie}
        onViewSequentie={handleViewSequentie}
        // Terminologie callbacks
        onSearchTerminologie={handleSearchTerminologie}
        onCopyTerm={handleCopyTerm}
        onProposeTerm={handleProposeTerm}
        // Stijlregels callbacks
        onGenerateChecklist={handleGenerateChecklist}
        // Documentstructuur callbacks
        onSelectNiveau={handleSelectNiveau}
        onViewTemplate={handleViewTemplate}
        onGenerateCode={handleGenerateCode}
      />
    </ShellWrapper>
  )
}
