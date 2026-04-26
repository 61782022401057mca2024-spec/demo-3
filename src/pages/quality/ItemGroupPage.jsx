import { useState } from 'react'
import { PageContainer, StatusBadge } from '../../components/ui/index'
import DataTable from '../../components/tables/DataTable'
import { MOCK_ITEM_GROUPS } from '../../data/mockData'

const COLUMNS = [
  { key: 'id', label: 'Group ID', width: 120 },
  { key: 'groupName', label: 'Group Name', width: 180 },
  { key: 'description', label: 'Description' },
  { key: 'isActive', label: 'Status', width: 100, render: v => <StatusBadge status={v ? 'Active' : 'Inactive'} /> },
]

export default function ItemGroupPage() {
  const [data, setData] = useState(MOCK_ITEM_GROUPS)
  return (
    <PageContainer title="Item Group" subtitle="Manage item group master records">
      <DataTable
        columns={COLUMNS}
        data={data}
        addLabel="Add Item Group"
        onAdd={() => alert('Add Item Group form — to be connected')}
        onDelete={(row) => { if (confirm(`Delete?`)) setData(d => d.filter(r => r.id !== row.id)) }}
      />
    </PageContainer>
  )
}
