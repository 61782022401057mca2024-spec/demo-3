import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  PageContainer, SectionCard, FormGrid, FormInput,
  SelectDropdown, DatePicker, ActionButtons
} from '../../components/ui/index'
import { Receipt, List, Calculator } from 'lucide-react'
import { createSaleInvoice, createTaxInvoice, getCustomers, getItems, getSalesDCs } from '../../lib/api'

const emptyRow = () => ({ itemName: '', itemId: '', quantity: '', rate: '', tax: '18', amount: '' })

export default function InvoiceFormPage({ type }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({})
  const [rows, setRows] = useState([emptyRow()])
  const [customers, setCustomers] = useState([])
  const [items, setItems] = useState([])
  const [salesDCs, setSalesDCs] = useState([])
  const dbBacked = type === 'Tax Invoice' || type === 'Sale Invoice'
  const [loadingMasters, setLoadingMasters] = useState(dbBacked)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const bind = (k) => ({ value: form[k] || '', onChange: (e) => set(k, e.target.value) })

  useEffect(() => {
    if (!dbBacked) return

    async function loadMasters() {
      try {
        setLoadingMasters(true)
        setError('')
        const [customerResult, itemResult, salesDcResult] = await Promise.all([
          getCustomers(),
          getItems(),
          getSalesDCs(),
        ])
        setCustomers(customerResult)
        setItems(itemResult)
        setSalesDCs(salesDcResult)
      } catch (loadError) {
        setError(loadError.message || `Unable to load ${type.toLowerCase()} masters.`)
      } finally {
        setLoadingMasters(false)
      }
    }

    loadMasters()
  }, [dbBacked, type])

  const customerOptions = useMemo(
    () => customers.map((customer) => ({
      value: String(customer.id),
      label: `${customer.customer_code} - ${customer.customer_name}`,
    })),
    [customers]
  )

  const itemOptions = useMemo(
    () => items.map((item) => ({
      value: String(item.id),
      label: `${item.item_code} - ${item.item_name}`,
    })),
    [items]
  )

  const salesDcOptions = useMemo(
    () => salesDCs.map((dc) => ({
      value: String(dc.id),
      label: `${dc.dc_no} - ${dc.customer_name || 'Customer'}`,
    })),
    [salesDCs]
  )

  const subtotal = useMemo(() => rows.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0), [rows])
  const gst = useMemo(() => rows.reduce((s, r) => {
    const amt = parseFloat(r.amount) || 0
    const tax = parseFloat(r.tax) || 0
    return s + (amt * tax / 100)
  }, 0), [rows])

  async function handleSave() {
    if (!dbBacked) {
      alert('Saved!')
      return
    }

    const firstRow = rows[0] || {}
    if (!form.invoiceNumber || !form.invoiceDate || !form.party || !firstRow.itemId || !firstRow.quantity || !firstRow.rate) {
      setSuccess('')
      setError('Invoice Number, Date, Customer, Item, Qty, and Rate are required.')
      return
    }

    try {
      setSaving(true)
      setError('')
      setSuccess('')
        const payload = {
          invoiceNumber: form.invoiceNumber,
          invoiceDate: form.invoiceDate,
          customerId: Number(form.party),
        salesDcId: form.referenceDC ? Number(form.referenceDC) : null,
        itemId: Number(firstRow.itemId),
        qty: firstRow.quantity,
        rate: firstRow.rate,
          taxPercent: firstRow.tax || '0',
          status: form.status || 'Draft',
          remarks: form.remarks || '',
        }
        const result = type === 'Tax Invoice'
          ? await createTaxInvoice(payload)
          : await createSaleInvoice(payload)
      setSuccess(`${type} saved. ID: ${result.invoice?.id ?? '-'} | Total: ${result.totals?.total_amount ?? '-'}`)
      setForm({})
      setRows([emptyRow()])
    } catch (saveError) {
      setError(saveError.message || 'Unable to save tax invoice.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageContainer
      title={id ? `Edit ${type}` : `New ${type}`}
      actions={
        <ActionButtons
          onSave={handleSave}
          onCancel={() => navigate(-1)}
          onDelete={id ? () => navigate(-1) : undefined}
          loading={saving}
        />
      }
    >
      {error && (
        <div style={{ marginBottom: '16px', padding: '12px 14px', borderRadius: '10px', background: '#fee2e2', color: '#991b1b', fontSize: '13px', fontWeight: '700' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ marginBottom: '16px', padding: '12px 14px', borderRadius: '10px', background: '#dcfce7', color: '#166534', fontSize: '13px', fontWeight: '700' }}>
          {success}
        </div>
      )}
      {loadingMasters && (
        <div style={{ marginBottom: '16px', padding: '12px 14px', borderRadius: '10px', background: '#eef2ff', color: '#4338ca', fontSize: '13px', fontWeight: '700' }}>
          Loading {type} masters...
        </div>
      )}

      <SectionCard title="Invoice Information" icon={Receipt}>
        <FormGrid>
          <FormInput label="Invoice Number" required {...bind('invoiceNumber')} placeholder="INV-0001" />
          <DatePicker label="Invoice Date" required {...bind('invoiceDate')} />
          <SelectDropdown label="Customer" options={dbBacked ? customerOptions : []} {...bind('party')} />
          <SelectDropdown label="Reference Sales DC" options={dbBacked ? salesDcOptions : []} {...bind('referenceDC')} />
          <SelectDropdown label="Status" options={['Draft', 'Approved', 'Paid', 'Cancelled']} {...bind('status')} />
        </FormGrid>
      </SectionCard>

      <SectionCard title="Item Details" icon={List}>
        <div className="overflow-x-auto rounded-lg border border-slate-200 mb-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                {['Item', 'Quantity', 'Rate', 'Tax %', 'Amount'].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="px-2 py-1.5">
                    <select
                      value={row.itemId || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        const matched = items.find((item) => String(item.id) === value)
                        setRows((current) => current.map((entry, idx) => idx === i ? {
                          ...entry,
                          itemId: value,
                          itemName: matched?.item_name || '',
                          rate: matched?.sales_rate || '',
                          amount: entry.quantity && matched?.sales_rate ? String((Number(entry.quantity) * Number(matched.sales_rate)).toFixed(2)) : '',
                        } : entry))
                      }}
                      className="w-full px-2 py-1 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-400 min-w-[140px]"
                    >
                      <option value="">Select item</option>
                      {itemOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </td>
                  {['quantity', 'rate', 'tax', 'amount'].map((k) => (
                    <td key={k} className="px-2 py-1.5">
                      <input
                        type="number"
                        value={row[k] || ''}
                        readOnly={k === 'amount'}
                        onChange={(e) => {
                          const value = e.target.value
                          setRows((current) => current.map((entry, idx) => {
                            if (idx !== i) return entry
                            const next = { ...entry, [k]: value }
                            const qty = Number(next.quantity || 0)
                            const rate = Number(next.rate || 0)
                            next.amount = qty && rate ? String((qty * rate).toFixed(2)) : ''
                            return next
                          }))
                        }}
                        className="w-full px-2 py-1 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-400 min-w-[80px]"
                      />
                    </td>
                  ))}
                  <td className="px-2 py-1.5">
                    <button onClick={() => setRows((current) => current.filter((_, idx) => idx !== i))} className="text-slate-300 hover:text-red-400">x</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={() => setRows((current) => [...current, emptyRow()])} className="text-xs text-primary-600 hover:text-primary-700 font-medium">+ Add Row</button>
      </SectionCard>

      <SectionCard title="Amount Summary" icon={Calculator}>
        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-medium">Rs.{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST</span>
              <span className="font-medium">Rs.{gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-slate-800 border-t border-slate-200 pt-2">
              <span>Total Amount</span>
              <span>Rs.{(subtotal + gst).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-end mt-2">
        <ActionButtons onSave={handleSave} onCancel={() => navigate(-1)} loading={saving} />
      </div>
    </PageContainer>
  )
}
