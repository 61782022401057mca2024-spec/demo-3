import { useParams } from 'react-router-dom'
import ItemMasterForm from '../../components/forms/ItemMasterForm'

export default function PurchaseItemFormPage() {
  const { id } = useParams()
  return (
    <ItemMasterForm
      title={id ? 'Edit Purchase Item' : 'New Purchase Item'}
      subtitle="Inventory -> Items -> Purchase Item"
      showSections="all"
      initialData={id ? { id, itemType: 'Purchase Item', groupType: 'Purchase Item' } : { itemType: 'Purchase Item', groupType: 'Purchase Item' }}
    />
  )
}
