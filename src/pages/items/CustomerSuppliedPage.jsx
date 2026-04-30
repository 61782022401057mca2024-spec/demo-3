import ItemTypePage from './ItemTypePage'

export default function CustomerSuppliedPage() {
  return (
    <ItemTypePage
      itemType="Customer Supplied"
      title="Customer Supplied"
      subtitle="Items supplied by customers for company work"
      addPath="/inventory/items/customer-supplied/new"
      addLabel="Add Customer Supplied Item"
      rowPath="/inventory/items/customer-supplied"
    />
  )
}
