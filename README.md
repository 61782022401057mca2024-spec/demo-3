# Manufacturing ERP — Frontend

A complete Manufacturing ERP frontend built with **ReactJS + Vite + TailwindCSS**.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Tech Stack

- **React 18** + **Vite**
- **TailwindCSS** — utility-first styling
- **React Router v6** — client-side routing
- **Recharts** — dashboard charts
- **Lucide React** — icons
- **clsx** — conditional class names

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── MainLayout.jsx      — app shell
│   │   └── TopNavbar.jsx       — horizontal nav with dropdowns
│   ├── ui/
│   │   └── index.jsx           — all reusable UI components
│   ├── forms/
│   │   └── ItemMasterForm.jsx  — 13-section item master form
│   └── tables/
│       └── DataTable.jsx       — sortable, searchable, paginated table
├── pages/
│   ├── dashboard/              — KPI cards, charts, activity
│   ├── items/                  — all 13 sections
│   ├── purchase/               — sections 1,2,6,8
│   ├── manufacturing/          — sections 1,4,5,6,9
│   ├── customer/               — sections 1,3,7
│   ├── supplier/               — sections 1,2,8
│   ├── dc/                     — Manufacturing/Labour/Subcontract DC
│   ├── invoice/                — Tax/Labour Invoice
│   ├── rejection/              — Rejection Report
│   ├── planning/               — UOM
│   ├── quality/                — Item Group
│   ├── maintenance/            — Rack, Bin
│   ├── reports/                — Reports overview
│   └── settings/               — System settings
├── data/
│   ├── navConfig.js            — horizontal menu structure
│   └── mockData.js             — mock data for all modules
└── index.css                   — Tailwind + global styles
```

---

## 📋 Modules Covered

| Module | Pages | Sections |
|---|---|---|
| **Dashboard** | KPI cards, 3 charts, activity feed | — |
| **Items** | List + Full form (13 sections) | All |
| **Purchase** | List + Form | 1,2,6,8 |
| **Manufacturing** | List + Form | 1,4,5,6,9 |
| **Customer** | List + Form | 1,3,7 |
| **Supplier** | List + Form | 1,2,8 |
| **Manufacturing DC** | List + Form with item table | — |
| **Labour DC** | List + Form | — |
| **Subcontract DC** | List + Form | — |
| **Tax Invoice** | List + Form with totals | — |
| **Labour Invoice** | List + Form | — |
| **Rejection Report** | List + Form | — |
| **Planning / UOM** | List | — |
| **Quality / Item Group** | List | — |
| **Maintenance / Rack** | List | — |
| **Maintenance / Bin** | List | — |
| **Reports** | Overview tiles | — |
| **Settings** | Company, notification, system | — |

---

## 🔌 Backend Integration

All forms use **local state only** — no API calls made.

To connect APIs:
1. Replace `useState(MOCK_DATA)` with `useEffect` + `fetch`/`axios` in list pages
2. Replace `alert('Saved!')` with API `POST`/`PUT` calls in form pages
3. Add React Query or SWR for data fetching and caching

---

## 🎨 Design Highlights

- Clean enterprise SaaS UI with **DM Sans** + **Sora** fonts
- White cards, soft shadows, rounded corners
- Responsive: 3-col (desktop) → 2-col (tablet) → 1-col (mobile)
- Hamburger menu on mobile
- Collapsible accordion sections (no tabs!)
- Sortable, searchable, paginated DataTable
- Inline editable row tables for Section 10–13

---

*Frontend only — backend to be connected separately.*
