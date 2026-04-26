import { useParams } from 'react-router-dom'
import ItemMasterForm from '../../components/forms/ItemMasterForm'

export default function ItemFormPage() {
  const { id } = useParams()
  return (
    <ItemMasterForm
      title={id ? 'Edit Item' : 'New Item'}
      subtitle="Inventory → Items — Manufacturing Item Master (All Sections)"
      showSections="all"
      initialData={id ? { id, itemCode: id } : {}}
    />
  )
}
