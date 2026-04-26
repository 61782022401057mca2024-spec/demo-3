// UOMPage.jsx
import { useState } from 'react'
import { PageContainer, StatusBadge } from '../../components/ui/index'
import DataTable from '../../components/tables/DataTable'
import { MOCK_UOM } from '../../data/mockData'

const COLUMNS = [
  { key: 'id', label: 'UOM ID', width: 120 },
  { key: 'uomName', label: 'UOM Name', width: 140 },
  { key: 'description', label: 'Description' },
  { key: 'isActive', label: 'Status', width: 100, render: v => <StatusBadge status={v ? 'Active' : 'Inactive'} /> },
]

export default function UOMPage() {
  const [data, setData] = useState(MOCK_UOM)
  return (
    <PageContainer title="Unit of Measure (UOM)" subtitle="Manage UOM master records">
      <DataTable
        columns={COLUMNS}
        data={data}
        addLabel="Add UOM"
        onAdd={() => alert('Add UOM form — to be connected')}
        onDelete={(row) => { if (confirm(`Delete ${row.uomName}?`)) setData(d => d.filter(r => r.id !== row.id)) }}
      />
    </PageContainer>
  )
}
