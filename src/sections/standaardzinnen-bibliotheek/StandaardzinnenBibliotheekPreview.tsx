import data from '@/../product/sections/standaardzinnen-bibliotheek/data.json'
import { StandaardzinnenBibliotheek } from './components/StandaardzinnenBibliotheek'

export default function StandaardzinnenBibliotheekPreview() {
  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <StandaardzinnenBibliotheek
        standaardzinnen={data.standaardzinnen}
        atomaireSequenties={data.atomaireSequenties}
        categorieen={data.categorieen}
        tags={data.tags as any}
        placeholders={data.placeholders as any}
        documenten={data.documenten as any}
        onCopy={(id, includeCode) => console.log('Copy:', id, includeCode)}
        onInsert={(id) => console.log('Insert:', id)}
        onView={(id) => console.log('View:', id)}
        onEdit={(id) => console.log('Edit:', id)}
        onCopySequentie={(id) => console.log('Copy sequentie:', id)}
        onInsertSequentie={(id) => console.log('Insert sequentie:', id)}
        onViewSequentie={(id) => console.log('View sequentie:', id)}
      />
    </div>
  )
}
