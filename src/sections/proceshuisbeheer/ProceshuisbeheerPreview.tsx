import data from '@/../product/sections/proceshuisbeheer/data.json'
import { Proceshuisbeheer } from './components/Proceshuisbeheer'

export default function ProceshuisbeheerPreview() {
  return (
    <div className="h-[calc(100vh-3.5rem)]">
      <Proceshuisbeheer
        documenten={data.documenten as any}
        hierarchie={data.hierarchie as any}
        personen={data.personen as any}
        rollen={data.rollen as any}
        raciMatrix={data.raciMatrix as any}
        versieHistorie={data.versieHistorie as any}
        statistieken={data.statistieken as any}
        onFilterDocumenten={(filters) => console.log('Filter:', filters)}
        onSortDocumenten={(field, dir) => console.log('Sort:', field, dir)}
        onOpenDocument={(id) => console.log('Open document:', id)}
        onChangeStatus={(id, status) => console.log('Change status:', id, status)}
        onToggleNode={(nodeId) => console.log('Toggle node:', nodeId)}
        onSelectNode={(nodeId) => console.log('Select node:', nodeId)}
        onOpenMiro={(url) => console.log('Open MIRO:', url)}
        onViewHistory={(docId) => console.log('View history:', docId)}
        onCompareVersions={(docId, v1, v2) => console.log('Compare:', docId, v1, v2)}
        onRevertToVersion={(docId, v) => console.log('Revert:', docId, v)}
        onChangeRACI={(docId, personId, rol) => console.log('Change RACI:', docId, personId, rol)}
        onSaveRACI={(docId) => console.log('Save RACI:', docId)}
      />
    </div>
  )
}
