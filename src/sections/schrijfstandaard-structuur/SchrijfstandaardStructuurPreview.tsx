import data from '@/../product/sections/schrijfstandaard-structuur/data.json'
import { SchrijfstandaardStructuur } from './components/SchrijfstandaardStructuur'

export default function SchrijfstandaardStructuurPreview() {
  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <SchrijfstandaardStructuur
        terminologie={data.terminologie as any}
        stijlregels={data.stijlregels as any}
        stijlregelCategorieen={data.stijlregelCategorieen}
        documentNiveaus={data.documentNiveaus as any}
        documentTypes={data.documentTypes as any}
        rollen={data.rollen}
        raciMatrix={data.raciMatrix as any}
        coderingFormaat={data.coderingFormaat as any}
        onSearchTerminologie={(query) => console.log('Search terminologie:', query)}
        onCopyTerm={(id) => console.log('Copy term:', id)}
        onProposeTerm={() => console.log('Propose new term')}
        onGenerateChecklist={(regelIds) => console.log('Generate checklist:', regelIds)}
        onSelectNiveau={(code) => console.log('Select niveau:', code)}
        onViewTemplate={(code) => console.log('View template:', code)}
        onGenerateCode={(params) => console.log('Generate code:', params)}
      />
    </div>
  )
}
