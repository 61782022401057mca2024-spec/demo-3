import ItemTypePage from './ItemTypePage'

export default function PurchaseItemPage() {
  return (
    <ItemTypePage
      itemType="Purchase Item"
      title="Purchase Item"
      subtitle="Items used for company purchase requirements"
      addPath="/inventory/items/purchase/new"
      addLabel="Add Purchase Item"
      rowPath="/inventory/items/purchase"
    />
  )
}
