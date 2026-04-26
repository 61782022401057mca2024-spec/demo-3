import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  PageContainer, SectionCard, FormGrid, FormInput, NumberInput,
  SelectDropdown, Textarea, DatePicker, ActionButtons
} from '../../components/ui/index'
import { AlertTriangle } from 'lucide-react'

export default function RejectionFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({})
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const bind = (k) => ({ value: form[k] || '', onChange: e => set(k, e.target.value) })

  return (
    <PageContainer
      title={id ? 'Edit Rejection Report' : 'New Rejection Report'}
      actions={
        <ActionButtons
          onSave={() => alert('Saved!')}
          onCancel={() => navigate(-1)}
          onDelete={id ? () => navigate(-1) : undefined}
        />
      }
    >
      <SectionCard title="Rejection Details" icon={AlertTriangle}>
        <FormGrid>
          <FormInput label="Report Number" required {...bind('reportNumber')} placeholder="REJ-0001" />
          <DatePicker label="Date" required {...bind('date')} />
          <FormInput label="Item Name" required {...bind('itemName')} />
          <FormInput label="Batch Number" {...bind('batchNumber')} />
          <NumberInput label="Rejected Quantity" required {...bind('rejectedQuantity')} />
          <SelectDropdown
            label="Reason"
            options={['Dimensional Error', 'Surface Defect', 'Material Defect', 'Wrong Part', 'Assembly Error', 'Other']}
            {...bind('reason')}
          />
          <Textarea label="Remarks" className="lg:col-span-3" rows={3} {...bind('remarks')} />
        </FormGrid>
      </SectionCard>

      <div className="flex justify-end mt-2">
        <ActionButtons onSave={() => alert('Saved!')} onCancel={() => navigate(-1)} />
      </div>
    </PageContainer>
  )
}
