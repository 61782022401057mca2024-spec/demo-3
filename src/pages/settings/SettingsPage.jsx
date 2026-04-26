import { PageContainer, SectionCard, FormGrid, FormInput, SelectDropdown, ActionButtons } from '../../components/ui/index'
import { Building, Bell, Lock, Database } from 'lucide-react'

export default function SettingsPage() {
  return (
    <PageContainer
      title="Settings"
      subtitle="System configuration"
      actions={<ActionButtons onSave={() => alert('Settings saved!')} saveLabel="Save Settings" />}
    >
      <SectionCard title="Company Information" icon={Building}>
        <FormGrid>
          <FormInput label="Company Name" defaultValue="Manufacturing Co. Pvt. Ltd." />
          <FormInput label="GSTIN" placeholder="27AABCU9603R1ZX" />
          <FormInput label="Address" placeholder="Company address" />
          <FormInput label="City" placeholder="City" />
          <FormInput label="State" placeholder="State" />
          <FormInput label="Pincode" placeholder="400001" />
          <FormInput label="Phone" placeholder="+91 00000 00000" />
          <FormInput label="Email" type="email" placeholder="info@company.com" />
          <SelectDropdown label="Financial Year" options={['2024-25', '2025-26', '2026-27']} />
        </FormGrid>
      </SectionCard>

      <SectionCard title="Notification Settings" icon={Bell} defaultOpen={false}>
        <FormGrid>
          <SelectDropdown label="Low Stock Alert" options={['Enabled', 'Disabled']} />
          <SelectDropdown label="Email Notifications" options={['Enabled', 'Disabled']} />
          <SelectDropdown label="Rejection Alert" options={['Enabled', 'Disabled']} />
        </FormGrid>
      </SectionCard>

      <SectionCard title="System Settings" icon={Database} defaultOpen={false}>
        <FormGrid>
          <SelectDropdown label="Currency" options={['INR', 'USD', 'EUR']} />
          <SelectDropdown label="Date Format" options={['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']} />
          <SelectDropdown label="Decimal Places" options={['2', '3', '4']} />
          <SelectDropdown label="Tax System" options={['GST', 'VAT', 'None']} />
        </FormGrid>
      </SectionCard>

      <div className="flex justify-end mt-2">
        <ActionButtons onSave={() => alert('Settings saved!')} saveLabel="Save Settings" />
      </div>
    </PageContainer>
  )
}
