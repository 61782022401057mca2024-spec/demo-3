import { useState } from 'react'
import { PageContainer, StatusBadge } from '../../components/ui/index'
import DataTable from '../../components/tables/DataTable'
import { MOCK_BINS } from '../../data/mockData'

const COLUMNS = [
  { key: 'id', label: 'Bin ID', width: 120 },
  { key: 'binName', label: 'Bin Name', width: 140 },
  { key: 'rackName', label: 'Rack Name', width: 140 },
  { key: 'capacity', label: 'Capacity', width: 100 },
  { key: 'isActive', label: 'Status', width: 100, render: v => <StatusBadge status={v ? 'Active' : 'Inactive'} /> },
]

export default function BinPage() {
  const [data, setData] = useState(MOCK_BINS)
  return (
    <PageContainer title="Bin" subtitle="Manage bin master records">
      <DataTable
        columns={COLUMNS}
        data={data}
        addLabel="Add Bin"
        onAdd={() => alert('Add Bin form — to be connected')}
        onDelete={(row) => { if (confirm(`Delete?`)) setData(d => d.filter(r => r.id !== row.id)) }}
      />
    </PageContainer>
  )
}
