import { useParams } from 'react-router-dom'
import ItemMasterForm from '../../components/forms/ItemMasterForm'

export default function ManufacturingFormPage() {
  const { id } = useParams()
  return (
    <ItemMasterForm
      title={id ? 'Edit Manufacturing Item' : 'New Manufacturing Item'}
      subtitle="Inventory -> Items -> Manufacturing Item"
      showSections="all"
      initialData={id ? { id, itemType: 'Manufacturing Item', groupType: 'Manufacturing Item' } : { itemType: 'Manufacturing Item', groupType: 'Manufacturing Item' }}
    />
  )
}
