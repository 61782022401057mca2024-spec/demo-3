import { useEffect, useState } from 'react'
import { PageContainer, StatusBadge } from '../../components/ui/index'
import DataTable from '../../components/tables/DataTable'
import { getCustomers, getSuppliers } from '../../lib/api'

const COLUMNS = [
  { key: 'id', label: 'ID', width: 90 },
  { key: 'code', label: 'Code', width: 130 },
  { key: 'name', label: 'Name' },
  {
    key: 'type',
    label: 'Type',
    width: 110,
    render: (v) => (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: '999px',
        fontSize: '11px',
        fontWeight: '600',
        background: v === 'Customer' ? '#eff6ff' : '#f0fdf4',
        color: v === 'Customer' ? '#2563eb' : '#16a34a',
      }}>
        {v}
      </span>
    ),
  },
  { key: 'partyGroup', label: 'Group', width: 140 },
  { key: 'location', label: 'City / State', width: 180 },
  { key: 'mobile', label: 'Mobile', width: 130 },
  { key: 'status', label: 'Status', width: 100, render: (v) => <StatusBadge status={v} /> },
]

export default function CustomerPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadParties() {
      try {
        setLoading(true)
        setError('')
        const [customerResult, supplierResult] = await Promise.all([getCustomers(), getSuppliers()])
        const customerRows = customerResult.map((row) => ({
          id: `C-${row.id}`,
          code: row.customer_code,
          name: row.customer_name,
          type: 'Customer',
          partyGroup: row.customer_group || '-',
          location: [row.city, row.state].filter(Boolean).join(', ') || '-',
          mobile: row.mobile || '-',
          status: row.status || 'Active',
        }))
        const supplierRows = supplierResult.map((row) => ({
          id: `S-${row.id}`,
          code: row.supplier_code,
          name: row.supplier_name,
          type: 'Supplier',
          partyGroup: row.supplier_group || '-',
          location: [row.city, row.state].filter(Boolean).join(', ') || '-',
          mobile: row.mobile || '-',
          status: row.status || 'Active',
        }))
        setData([...customerRows, ...supplierRows])
      } catch (loadError) {
        setError(loadError.message || 'Unable to load customer and supplier records.')
      } finally {
        setLoading(false)
      }
    }

    loadParties()
  }, [])

  return (
    <PageContainer title="Customer / Supplier" subtitle="View customer and supplier master records from the database">
      {error && (
        <div style={{ marginBottom: '16px', padding: '12px 14px', borderRadius: '10px', background: '#fee2e2', color: '#991b1b', fontSize: '13px', fontWeight: '700' }}>
          {error}
        </div>
      )}
      {loading && (
        <div style={{ marginBottom: '16px', padding: '12px 14px', borderRadius: '10px', background: '#eef2ff', color: '#4338ca', fontSize: '13px', fontWeight: '700' }}>
          Loading customer and supplier records...
        </div>
      )}
      <DataTable
        columns={COLUMNS}
        data={data}
        addPath="/inventory/customer/new"
        addLabel="Add Item"
        rowPath="/inventory/customer"
      />
    </PageContainer>
  )
}
