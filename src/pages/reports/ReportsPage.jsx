import { PageContainer } from '../../components/ui/index'
import { BarChart2, FileText, TrendingUp, Package, ShoppingCart, Factory } from 'lucide-react'

const REPORTS = [
  { icon: Package, label: 'Inventory Report', description: 'Current stock levels and valuations' },
  { icon: ShoppingCart, label: 'Purchase Report', description: 'Purchase order summary and trends' },
  { icon: Factory, label: 'Manufacturing Report', description: 'Production output and efficiency' },
  { icon: TrendingUp, label: 'Sales Report', description: 'Sales performance and customer analysis' },
  { icon: FileText, label: 'DC Summary Report', description: 'Delivery challan summary' },
  { icon: FileText, label: 'Invoice Report', description: 'Invoice and payment status' },
  { icon: BarChart2, label: 'Rejection Analysis', description: 'Quality rejection trends' },
  { icon: BarChart2, label: 'Supplier Performance', description: 'Supplier delivery and quality metrics' },
]

export default function ReportsPage() {
  return (
    <PageContainer title="Reports" subtitle="Business intelligence and reporting">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {REPORTS.map(r => (
          <button
            key={r.label}
            className="card text-left hover:shadow-card-hover transition-shadow duration-200 group"
            onClick={() => alert(`${r.label} — to be connected with backend`)}
          >
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary-100 transition-colors">
              <r.icon size={20} className="text-primary-600" />
            </div>
            <p className="text-sm font-semibold text-slate-700 mb-1 font-display">{r.label}</p>
            <p className="text-xs text-slate-500">{r.description}</p>
          </button>
        ))}
      </div>
    </PageContainer>
  )
}
