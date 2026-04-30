import { useParams } from 'react-router-dom'
import ItemMasterForm from '../../components/forms/ItemMasterForm'

export default function CustomerSuppliedFormPage() {
  const { id } = useParams()
  return (
    <ItemMasterForm
      title={id ? 'Edit Customer Supplied Item' : 'New Customer Supplied Item'}
      subtitle="Inventory -> Items -> Customer Supplied"
      showSections="all"
      initialData={id ? { id, itemType: 'Customer Supplied', groupType: 'Customer Supplied' } : { itemType: 'Customer Supplied', groupType: 'Customer Supplied' }}
    />
  )
}
