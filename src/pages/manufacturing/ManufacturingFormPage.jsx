import { useParams } from 'react-router-dom'
import ItemMasterForm from '../../components/forms/ItemMasterForm'

export default function ManufacturingFormPage() {
  const { id } = useParams()
  return (
    <ItemMasterForm
      title={id ? 'Edit Manufacturing Item' : 'New Manufacturing Item'}
      subtitle="Inventory → Manufacturing — All Sections"
      showSections="all"
      initialData={id ? { id } : {}}
    />
  )
}
