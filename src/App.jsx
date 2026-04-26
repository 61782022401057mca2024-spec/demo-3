import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import LoginPage from './pages/auth/LoginPage'
import { clearAuth, getCurrentUser, getStoredToken } from './lib/api'

import DashboardPage         from './pages/dashboard/DashboardPage'
import ItemsPage             from './pages/items/ItemsPage'
import ItemFormPage          from './pages/items/ItemFormPage'
import PurchasePage          from './pages/purchase/PurchasePage'
import PurchaseFormPage      from './pages/purchase/PurchaseFormPage'
import ManufacturingPage     from './pages/manufacturing/ManufacturingPage'
import ManufacturingFormPage from './pages/manufacturing/ManufacturingFormPage'
import CustomerPage          from './pages/customer/CustomerPage'
import CustomerFormPage      from './pages/customer/CustomerFormPage'
import ManufacturingDCPage   from './pages/dc/ManufacturingDCPage'
import LabourDCPage          from './pages/dc/LabourDCPage'
import SalesDCPage           from './pages/dc/SalesDCPage'
import DCFormPage            from './pages/dc/DCFormPage'
import TaxInvoicePage        from './pages/invoice/TaxInvoicePage'
import SaleInvoicePage       from './pages/invoice/SaleInvoicePage'
import LabourInvoicePage     from './pages/invoice/LabourInvoicePage'
import InvoiceFormPage       from './pages/invoice/InvoiceFormPage'
import RejectionReportPage   from './pages/rejection/RejectionReportPage'
import RejectionFormPage     from './pages/rejection/RejectionFormPage'
import UOMPage               from './pages/planning/UOMPage'
import ItemGroupPage         from './pages/quality/ItemGroupPage'
import RackPage              from './pages/maintenance/RackPage'
import BinPage               from './pages/maintenance/BinPage'
import ReportsPage           from './pages/reports/ReportsPage'
import SettingsPage          from './pages/settings/SettingsPage'
import CompanyInfoPage       from './pages/company/CompanyInfoPage'
import CustomerCreationPage  from './pages/master/CustomerPage'
import SupplierCreationPage  from './pages/master/SupplierPage'
import ComingSoon            from './pages/ComingSoon'

export default function App() {
  const [authLoading, setAuthLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function bootstrapAuth() {
      const token = getStoredToken()

      if (!token) {
        setAuthLoading(false)
        return
      }

      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch {
        clearAuth()
        setUser(null)
      } finally {
        setAuthLoading(false)
      }
    }

    bootstrapAuth()
  }, [])

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f6edf4', color: '#5a3850', fontFamily: 'DM Sans, sans-serif', fontSize: '18px', fontWeight: '700' }}>
        Loading ManufactERP...
      </div>
    )
  }

  if (!user) {
    return <LoginPage onAuthenticated={setUser} />
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />

        <Route path="inventory/items"              element={<ItemsPage />} />
        <Route path="inventory/items/new"          element={<ItemFormPage />} />
        <Route path="inventory/items/:id"          element={<ItemFormPage />} />
        <Route path="inventory/purchase"           element={<PurchasePage />} />
        <Route path="inventory/purchase/new"       element={<PurchaseFormPage />} />
        <Route path="inventory/purchase/:id"       element={<PurchaseFormPage />} />
        <Route path="inventory/manufacturing"      element={<ManufacturingPage />} />
        <Route path="inventory/manufacturing/new"  element={<ManufacturingFormPage />} />
        <Route path="inventory/manufacturing/:id"  element={<ManufacturingFormPage />} />
        <Route path="inventory/customer"           element={<CustomerPage />} />
        <Route path="inventory/customer/new"       element={<CustomerFormPage />} />
        <Route path="inventory/customer/:id"       element={<CustomerFormPage />} />

        <Route path="sales/dc"                     element={<SalesDCPage />} />
        <Route path="sales/dc/new"                 element={<DCFormPage type="Sales DC" />} />
        <Route path="sales/dc/:id"                 element={<DCFormPage type="Sales DC" />} />
        <Route path="sales/tax-invoice"            element={<ComingSoon title="Tax Invoice (Sales)" />} />
        <Route path="sales/sale-invoice"           element={<ComingSoon title="Sale Invoice" />} />

        <Route path="subcontractor/dc"             element={<ComingSoon title="Subcontractor DC" />} />

        <Route path="purchase/jobwork/jodc"        element={<ComingSoon title="Job Work - JODC" />} />
        <Route path="purchase/labour-invoice"      element={<ComingSoon title="Labour Invoice (Purchase)" />} />

        <Route path="dc/manufacturing"             element={<ManufacturingDCPage />} />
        <Route path="dc/manufacturing/new"         element={<DCFormPage type="Manufacturing DC" />} />
        <Route path="dc/manufacturing/:id"         element={<DCFormPage type="Manufacturing DC" />} />
        <Route path="dc/labour"                    element={<LabourDCPage />} />
        <Route path="dc/labour/new"                element={<DCFormPage type="Labour DC" />} />
        <Route path="dc/labour/:id"                element={<DCFormPage type="Labour DC" />} />

        <Route path="invoice/tax"                  element={<TaxInvoicePage />} />
        <Route path="invoice/tax/new"              element={<InvoiceFormPage type="Tax Invoice" />} />
        <Route path="invoice/tax/:id"              element={<InvoiceFormPage type="Tax Invoice" />} />
        <Route path="invoice/sale"                 element={<SaleInvoicePage />} />
        <Route path="invoice/sale/new"             element={<InvoiceFormPage type="Sale Invoice" />} />
        <Route path="invoice/sale/:id"             element={<InvoiceFormPage type="Sale Invoice" />} />
        <Route path="invoice/labour"               element={<LabourInvoicePage />} />
        <Route path="invoice/labour/new"           element={<InvoiceFormPage type="Labour Invoice" />} />
        <Route path="invoice/labour/:id"           element={<InvoiceFormPage type="Labour Invoice" />} />

        <Route path="rejection"                    element={<RejectionReportPage />} />
        <Route path="rejection/new"                element={<RejectionFormPage />} />
        <Route path="rejection/:id"                element={<RejectionFormPage />} />

        <Route path="planning/uom"                 element={<UOMPage />} />
        <Route path="quality/item-group"           element={<ItemGroupPage />} />
        <Route path="maintenance/rack"             element={<RackPage />} />
        <Route path="maintenance/bin"              element={<BinPage />} />

        <Route path="payroll/employee"             element={<ComingSoon title="Employee (Payroll)" />} />
        <Route path="user/employee"                element={<ComingSoon title="Employee (Users)" />} />

        <Route path="reports"                      element={<ReportsPage />} />
        <Route path="settings"                     element={<SettingsPage />} />
        <Route path="company-info"                 element={<CompanyInfoPage />} />
        <Route path="master/customer"              element={<CustomerCreationPage />} />
        <Route path="master/supplier"              element={<SupplierCreationPage />} />
      </Route>
    </Routes>
  )
}
