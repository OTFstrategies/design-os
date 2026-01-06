import data from '@/../product/sections/glossary/data.json'
import { Glossary } from './components/Glossary'

export default function GlossaryPreview() {
  return (
    <Glossary
      data={data as any}
      onStandaardzinSelect={(zin) => console.log('Selected standaardzin:', zin.code, zin.tekst)}
      onTerminologieSelect={(term) => console.log('Selected terminologie:', term.voorkeursterm)}
      onStijlregelSelect={(regel) => console.log('Selected stijlregel:', regel.titel)}
      onDocumentNiveauSelect={(niveau) => console.log('Selected niveau:', niveau.code, niveau.naam)}
      onSearch={(query) => console.log('Search query:', query)}
    />
  )
}
