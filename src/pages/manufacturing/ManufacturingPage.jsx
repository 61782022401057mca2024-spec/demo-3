import ItemTypePage from '../items/ItemTypePage'

export default function ManufacturingPage() {
  return (
    <ItemTypePage
      itemType="Manufacturing Item"
      title="Manufacturing Item"
      subtitle="Items created for company manufacturing flow"
      addPath="/inventory/items/manufacturing/new"
      addLabel="Add Manufacturing Item"
      rowPath="/inventory/items/manufacturing"
    />
  )
}
