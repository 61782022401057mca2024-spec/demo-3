import { useState } from 'react'
import { PageContainer, StatusBadge } from '../../components/ui/index'
import DataTable from '../../components/tables/DataTable'
import { MOCK_RACKS } from '../../data/mockData'

const COLUMNS = [
  { key: 'id', label: 'Rack ID', width: 120 },
  { key: 'rackName', label: 'Rack Name', width: 140 },
  { key: 'location', label: 'Location', width: 140 },
  { key: 'capacity', label: 'Capacity', width: 100 },
  { key: 'isActive', label: 'Status', width: 100, render: v => <StatusBadge status={v ? 'Active' : 'Inactive'} /> },
]

export default function RackPage() {
  const [data, setData] = useState(MOCK_RACKS)
  return (
    <PageContainer title="Rack" subtitle="Manage rack master records">
      <DataTable
        columns={COLUMNS}
        data={data}
        addLabel="Add Rack"
        onAdd={() => alert('Add Rack form — to be connected')}
        onDelete={(row) => { if (confirm(`Delete?`)) setData(d => d.filter(r => r.id !== row.id)) }}
      />
    </PageContainer>
  )
}
