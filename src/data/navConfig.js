import {
  LayoutDashboard, FileText, Receipt,
  Package, BarChart3, Settings, Beaker, Wrench,
  Building2, BookOpen, ShoppingCart,
  TrendingUp, Hammer, AlertTriangle, Users, Truck,
} from 'lucide-react'

export const NAV_MENU = [
  // ── Dashboard ─────────────────────────────────────────────────────────────
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },

  // ── Master (moved to top) ──────────────────────────────────────────────────
  {
    label: 'Master',
    icon: BookOpen,
    children: [
      {
        label: 'Inventory',
        icon: Package,
        children: [
          {
            label: 'Items',
            path: '/inventory/items',
            children: [
              { label: 'Purchase',            path: '/inventory/purchase' },
              { label: 'Manufacturing',       path: '/inventory/manufacturing' },
              { label: 'Customer / Supplier', path: '/inventory/customer' },
            ],
          },
        ],
      },
      {
        label: 'Planning',
        icon: BarChart3,
        children: [
          { label: 'UOM', path: '/planning/uom' },
        ],
      },
      {
        label: 'Quality',
        icon: Beaker,
        children: [
          { label: 'Item Group', path: '/quality/item-group' },
        ],
      },
      {
        label: 'Maintenance',
        icon: Wrench,
        children: [
          { label: 'Rack', path: '/maintenance/rack' },
          { label: 'Bin',  path: '/maintenance/bin' },
        ],
      },
      { label: 'Customer',     icon: Users,    path: '/master/customer' },
      { label: 'Supplier',     icon: Truck,    path: '/master/supplier' },
      { label: 'Company Info', icon: Building2, path: '/company-info' },
    ],
  },

  // ── Sales ──────────────────────────────────────────────────────────────────
  {
    label: 'Sales',
    icon: TrendingUp,
    children: [
      { label: 'Sales DC',     path: '/sales/dc' },
      { label: 'Tax Invoice',  path: '/invoice/tax' },
      { label: 'Sale Invoice', path: '/invoice/sale' },
    ],
  },

  // ── Sub Contractor ─────────────────────────────────────────────────────────
  {
    label: 'Sub Contractor',
    icon: Hammer,
    children: [
      { label: 'Subcontractor DC', path: '/subcontractor/dc' },
    ],
  },

  // ── Purchase ───────────────────────────────────────────────────────────────
  {
    label: 'Purchase',
    icon: ShoppingCart,
    children: [
      {
        label: 'Job Work',
        children: [
          { label: 'JODC', path: '/purchase/jobwork/jodc' },
        ],
      },
      { label: 'Labour Invoice', path: '/purchase/labour-invoice' },
    ],
  },

  // ── Reports ────────────────────────────────────────────────────────────────
  {
    label: 'Reports',
    icon: BarChart3,
    children: [
      { label: 'Rejection Report', icon: AlertTriangle, path: '/rejection' },
      { label: 'Reports',          icon: BarChart3,     path: '/reports' },
    ],
  },

  // ── Settings ───────────────────────────────────────────────────────────────
  { label: 'Settings', icon: Settings, path: '/settings' },
]
