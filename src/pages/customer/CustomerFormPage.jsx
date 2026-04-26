import { useParams } from 'react-router-dom'
import ItemMasterForm from '../../components/forms/ItemMasterForm'

export default function CustomerFormPage() {
  const { id } = useParams()
  return (
    <ItemMasterForm
      title={id ? 'Edit Customer/Supplier Item' : 'New Customer/Supplier Item'}
      subtitle="Inventory → Customer/Supplier — All Sections"
      showSections="all"
      initialData={id ? { id } : {}}
    />
  )
}
