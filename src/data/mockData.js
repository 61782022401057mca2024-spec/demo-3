// ─── Items ────────────────────────────────────────────────────────────────────
export const MOCK_ITEMS = Array.from({ length: 25 }, (_, i) => ({
  id: `ITM-${String(i + 1).padStart(4, '0')}`,
  itemCode: `ITM-${String(i + 1).padStart(4, '0')}`,
  itemName: ['Steel Shaft', 'Aluminium Bracket', 'Copper Wire', 'Rubber Gasket', 'Bolt M10', 'Nut M10', 'Bearing 6205', 'Gear Set A', 'Drive Shaft', 'Pulley 150mm'][i % 10],
  itemGroup: ['Raw Material', 'Finished Good', 'Semi-Finished', 'Consumable', 'Packing'][i % 5],
  stockUOM: ['Nos', 'Kg', 'Mtr', 'Ltr', 'Set'][i % 5],
  location: ['Store A', 'Store B', 'Store C'][i % 3],
  status: ['Active', 'Active', 'Active', 'Inactive'][i % 4],
  purchaseRate: (100 + i * 23.5).toFixed(2),
  sellingRate: (150 + i * 31.2).toFixed(2),
}))

// ─── Purchases ────────────────────────────────────────────────────────────────
export const MOCK_PURCHASES = Array.from({ length: 15 }, (_, i) => ({
  id: `PO-${String(i + 1).padStart(4, '0')}`,
  itemCode: `ITM-${String((i % 25) + 1).padStart(4, '0')}`,
  itemName: ['Steel Shaft', 'Aluminium Bracket', 'Copper Wire', 'Rubber Gasket', 'Bolt M10'][i % 5],
  supplier: ['Tata Steel', 'Hindalco', 'Precision Parts', 'ABC Metals', 'XYZ Components'][i % 5],
  purchaseRate: (100 + i * 15).toFixed(2),
  status: ['Active', 'Active', 'Inactive'][i % 3],
}))

// ─── Manufacturing ────────────────────────────────────────────────────────────
export const MOCK_MANUFACTURING = Array.from({ length: 15 }, (_, i) => ({
  id: `MFG-${String(i + 1).padStart(4, '0')}`,
  itemCode: `ITM-${String((i % 25) + 1).padStart(4, '0')}`,
  itemName: ['Drive Shaft', 'Gear Box', 'Control Panel', 'Motor Assembly', 'Pump Unit'][i % 5],
  drawingNumber: `DWG-${String(i + 1).padStart(3, '0')}`,
  revisionNumber: `R${i % 5}`,
  status: ['Active', 'Active', 'Inactive'][i % 3],
}))

// ─── Customers ────────────────────────────────────────────────────────────────
export const MOCK_CUSTOMERS = Array.from({ length: 12 }, (_, i) => ({
  id: `CUST-${String(i + 1).padStart(4, '0')}`,
  itemCode: `ITM-${String((i % 25) + 1).padStart(4, '0')}`,
  itemName: ['Drive Shaft', 'Gear Box', 'Control Panel'][i % 3],
  customer: ['Maruti Suzuki', 'Tata Motors', 'Mahindra', 'Bajaj Auto', 'Hero MotoCorp', 'TVS Motors'][i % 6],
  customerPartNumber: `CP-${String(i + 1).padStart(5, '0')}`,
  status: 'Active',
}))

// ─── Suppliers ────────────────────────────────────────────────────────────────
export const MOCK_SUPPLIERS = Array.from({ length: 12 }, (_, i) => ({
  id: `SUP-${String(i + 1).padStart(4, '0')}`,
  itemCode: `ITM-${String((i % 25) + 1).padStart(4, '0')}`,
  itemName: ['Steel Shaft', 'Aluminium Bracket', 'Copper Wire'][i % 3],
  supplier: ['Tata Steel', 'Hindalco', 'Precision Parts', 'ABC Metals', 'XYZ Components'][i % 5],
  supplierPartNumber: `SP-${String(i + 1).padStart(5, '0')}`,
  status: 'Active',
}))

// ─── DC ───────────────────────────────────────────────────────────────────────
export const MOCK_DC = Array.from({ length: 15 }, (_, i) => ({
  id: `DC-${String(i + 1).padStart(4, '0')}`,
  dcNumber: `DC-${String(i + 1).padStart(4, '0')}`,
  dcDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  customer: ['Maruti Suzuki', 'Tata Motors', 'Mahindra'][i % 3],
  referenceNumber: `REF-${String(i + 1).padStart(4, '0')}`,
  status: ['Draft', 'Approved', 'Completed', 'Pending'][i % 4],
  amount: (5000 + i * 1234).toFixed(2),
}))

// ─── Invoices ─────────────────────────────────────────────────────────────────
export const MOCK_INVOICES = Array.from({ length: 12 }, (_, i) => ({
  id: `INV-${String(i + 1).padStart(4, '0')}`,
  invoiceNumber: `INV-${String(i + 1).padStart(4, '0')}`,
  invoiceDate: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  customer: ['Maruti Suzuki', 'Tata Motors', 'Mahindra'][i % 3],
  totalAmount: (10000 + i * 2345).toFixed(2),
  status: ['Draft', 'Approved', 'Paid'][i % 3],
}))

// ─── Rejection ────────────────────────────────────────────────────────────────
export const MOCK_REJECTIONS = Array.from({ length: 10 }, (_, i) => ({
  id: `REJ-${String(i + 1).padStart(4, '0')}`,
  reportNumber: `REJ-${String(i + 1).padStart(4, '0')}`,
  date: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
  itemName: ['Steel Shaft', 'Aluminium Bracket', 'Copper Wire', 'Rubber Gasket', 'Bolt M10'][i % 5],
  batchNumber: `BATCH-${String(i + 1).padStart(3, '0')}`,
  rejectedQuantity: (i + 1) * 5,
  reason: ['Dimensional Error', 'Surface Defect', 'Material Defect', 'Wrong Part'][i % 4],
}))

// ─── UOM ─────────────────────────────────────────────────────────────────────
export const MOCK_UOM = [
  { id: 'UOM-001', uomName: 'Nos', description: 'Numbers', isActive: true },
  { id: 'UOM-002', uomName: 'Kg', description: 'Kilogram', isActive: true },
  { id: 'UOM-003', uomName: 'Mtr', description: 'Meter', isActive: true },
  { id: 'UOM-004', uomName: 'Ltr', description: 'Litre', isActive: true },
  { id: 'UOM-005', uomName: 'Set', description: 'Set', isActive: true },
  { id: 'UOM-006', uomName: 'Box', description: 'Box', isActive: true },
  { id: 'UOM-007', uomName: 'Pcs', description: 'Pieces', isActive: true },
]

// ─── Item Groups ──────────────────────────────────────────────────────────────
export const MOCK_ITEM_GROUPS = [
  { id: 'IG-001', groupName: 'Raw Material', description: 'Basic raw materials', isActive: true },
  { id: 'IG-002', groupName: 'Finished Good', description: 'Final products', isActive: true },
  { id: 'IG-003', groupName: 'Semi-Finished', description: 'Partially processed', isActive: true },
  { id: 'IG-004', groupName: 'Consumable', description: 'Consumable items', isActive: true },
  { id: 'IG-005', groupName: 'Packing', description: 'Packing materials', isActive: true },
]

// ─── Racks ────────────────────────────────────────────────────────────────────
export const MOCK_RACKS = Array.from({ length: 8 }, (_, i) => ({
  id: `RACK-${String(i + 1).padStart(3, '0')}`,
  rackName: `Rack ${String.fromCharCode(65 + i)}`,
  location: ['Store A', 'Store B', 'Store C'][i % 3],
  capacity: (50 + i * 10),
  isActive: true,
}))

// ─── Bins ─────────────────────────────────────────────────────────────────────
export const MOCK_BINS = Array.from({ length: 16 }, (_, i) => ({
  id: `BIN-${String(i + 1).padStart(3, '0')}`,
  binName: `Bin ${String(i + 1).padStart(2, '0')}`,
  rackName: `Rack ${String.fromCharCode(65 + (i % 4))}`,
  capacity: (20 + i * 5),
  isActive: true,
}))

// ─── Dashboard KPIs ───────────────────────────────────────────────────────────
export const DASHBOARD_KPIS = {
  totalItems: 248,
  totalPurchases: 1432,
  totalManufacturingOrders: 86,
  totalCustomers: 34,
  totalSuppliers: 27,
}

export const INVENTORY_TREND = [
  { month: 'Jan', value: 420 }, { month: 'Feb', value: 380 },
  { month: 'Mar', value: 510 }, { month: 'Apr', value: 470 },
  { month: 'May', value: 540 }, { month: 'Jun', value: 590 },
  { month: 'Jul', value: 620 }, { month: 'Aug', value: 580 },
]

export const PURCHASE_TREND = [
  { month: 'Jan', value: 85000 }, { month: 'Feb', value: 72000 },
  { month: 'Mar', value: 95000 }, { month: 'Apr', value: 88000 },
  { month: 'May', value: 112000 }, { month: 'Jun', value: 98000 },
  { month: 'Jul', value: 125000 }, { month: 'Aug', value: 115000 },
]

export const PRODUCTION_OUTPUT = [
  { month: 'Jan', planned: 200, actual: 185 }, { month: 'Feb', planned: 210, actual: 198 },
  { month: 'Mar', planned: 220, actual: 215 }, { month: 'Apr', planned: 230, actual: 220 },
  { month: 'May', planned: 240, actual: 238 }, { month: 'Jun', planned: 250, actual: 245 },
  { month: 'Jul', planned: 260, actual: 255 }, { month: 'Aug', planned: 270, actual: 262 },
]

export const RECENT_ACTIVITY = [
  { id: 1, action: 'New Item Created', module: 'Inventory', user: 'Admin', time: '5 min ago', type: 'create' },
  { id: 2, action: 'DC Approved', module: 'DC Management', user: 'Manager', time: '12 min ago', type: 'approve' },
  { id: 3, action: 'Invoice Generated', module: 'Invoice', user: 'Accounts', time: '28 min ago', type: 'create' },
  { id: 4, action: 'Rejection Report Filed', module: 'Rejection', user: 'QC Team', time: '45 min ago', type: 'report' },
  { id: 5, action: 'Purchase Order Updated', module: 'Purchase', user: 'Admin', time: '1 hr ago', type: 'update' },
  { id: 6, action: 'New Supplier Added', module: 'Inventory', user: 'Admin', time: '2 hr ago', type: 'create' },
]
