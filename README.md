# 💰 FinFlow — Finance Dashboard

<div align="center">

![FinFlow Banner](https://img.shields.io/badge/FinFlow-Finance%20Dashboard-7c3aed?style=for-the-badge&logo=react&logoColor=white)

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Recharts](https://img.shields.io/badge/Recharts-2-22c55e?style=flat-square)](https://recharts.org)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**A modern, interactive finance tracking dashboard with role-based access, smart insights, and a stunning dark UI.**

[✨ Live Demo](#) · [🐛 Report Bug](#) · [💡 Request Feature](#)

</div>

---

## 📸 Preview

> Dark-themed finance dashboard with summary cards, interactive charts, transaction management, and AI-style insights — all in one clean interface.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Pages & Functionality](#-pages--functionality)
- [Role-Based Access](#-role-based-access)
- [State Management](#️-state-management)
- [Responsive Design](#-responsive-design)
- [Deployment](#-deployment)
- [Design Decisions](#-design-decisions)
- [Assumptions](#-assumptions)

---

## ✨ Features

### 🏠 Dashboard Overview
- **3 Summary Cards** — Total Balance, Total Income, Total Expenses with savings rate
- **Area Chart** — 6-month income/expense/balance trend (interactive, with custom tooltips)
- **Pie Chart** — Category-wise spending breakdown with percentages
- **Recent Activity** — Latest 6 transactions at a glance with quick navigation

### 📄 Transactions Management
- Full transaction table with **Date, Description, Category, Type, Amount**
- 🔍 **Live Search** — filter by description or category name
- 🎛️ **Type Filter** — All / Income / Expense
- 📂 **Category Filter** — Filter by any of the 10 spending categories
- ↕️ **Sort** — by Date or Amount (ascending/descending toggle)
- 🔄 **Reset Filters** — one-click reset
- 📤 **CSV Export** — download filtered results as a `.csv` file
- ✏️ **Add / Edit / Delete** — available to Admin role only (with form validation)

### 👤 Role-Based UI (Frontend RBAC)
| Role | Capabilities |
|------|-------------|
| 👁️ **Viewer** | View, search, filter, sort, export CSV |
| 🛡️ **Admin** | Everything + Add, Edit, Delete transactions |

Switch roles instantly via the **sidebar toggle** — no backend or login required.

### 💡 Insights
- 🏆 Highest spending category
- 📉 Monthly expense comparison (% change vs. last month)
- 🎯 Savings rate with 20% benchmark feedback
- ⚡ Income growth month-over-month
- 🔻 Lowest expense category
- 📊 Monthly Income vs Expenses **bar chart**
- 📈 Category-wise **progress bars** showing % of total spend

### ⚙️ State Management
- React **Context API + useReducer** — centralized, predictable state
- Manages: transactions, active tab, role, filters, next ID counter
- **localStorage persistence** — all data survives page refreshes

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| [React](https://react.dev) | 19 | UI framework |
| [Vite](https://vitejs.dev) | 6 | Dev server & build tool |
| [Tailwind CSS](https://tailwindcss.com) | 3 | Utility-first styling |
| [Recharts](https://recharts.org) | 2 | Charts (AreaChart, PieChart, BarChart) |
| [Lucide React](https://lucide.dev) | latest | Icon library |
| Context API | built-in | Global state management |
| localStorage | built-in | Client-side persistence |

---

## 📁 Project Structure

```
finance-dashboard/
├── public/
├── src/
│   ├── context/
│   │   └── AppContext.jsx        # Global state — useReducer + localStorage
│   ├── data/
│   │   └── mockData.js           # 60 mock transactions + monthly chart data
│   ├── components/
│   │   ├── Sidebar.jsx           # Desktop nav + role switcher + dark mode
│   │   ├── BottomNav.jsx         # Mobile bottom tab bar
│   │   ├── SummaryCards.jsx      # Balance / Income / Expense cards
│   │   ├── BalanceChart.jsx      # 6-month area chart (Recharts)
│   │   ├── SpendingChart.jsx     # Category pie chart (Recharts)
│   │   ├── RecentTransactions.jsx # Latest 6 transactions widget
│   │   └── TransactionModal.jsx  # Add / Edit modal with validation
│   ├── pages/
│   │   ├── Dashboard.jsx         # Home page — overview
│   │   ├── Transactions.jsx      # Full transaction table + filters
│   │   └── Insights.jsx          # Analytics & insights page
│   ├── App.jsx                   # Root component + routing
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles + animations + fonts
├── tailwind.config.js
├── vite.config.js
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0

Check your versions:
```bash
node --version
npm --version
```

### Installation

```bash
# 1. Clone or unzip the project
cd finance-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production (outputs to `/dist`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## 📖 Pages & Functionality

### 1. Dashboard (`/`)
The home page gives a complete financial snapshot:
- Summary cards dynamically calculate totals from all transactions
- Charts use the `monthlyData` array from `mockData.js`
- "View all" link navigates directly to the Transactions page

### 2. Transactions
- All 60 mock transactions are loaded from `mockData.js` on first run
- Filters are applied in real-time using `useMemo` for performance
- Sorting toggles direction on repeated clicks (e.g., date desc → date asc)
- CSV export downloads the **currently filtered** list (not all transactions)
- Admin users see Edit (✏️) and Delete (🗑️) icons on each row

### 3. Insights
- All insight cards are computed dynamically from the transactions array
- The "savings rate" insight includes actionable feedback based on the 20% rule
- Progress bars animate on first render using CSS transitions

---

## 👤 Role-Based Access

Role switching is **purely frontend** — designed for demonstration purposes.

```
Sidebar → Role Toggle → [ Viewer ] [ Admin ]
```

The selected role is stored in:
1. React Context (active session)
2. `localStorage` (persists on refresh)

**How it affects the UI:**

- In **Viewer** mode: Add Transaction button is hidden; Edit/Delete icons are not rendered
- In **Admin** mode: Full CRUD access; modal opens for Add/Edit with form validation

---

## 🗂️ State Management

All application state lives in `AppContext.jsx`:

```js
{
  transactions: [...],      // All transaction records
  role: "viewer" | "admin", // Current user role
  activeTab: "dashboard",   // Active navigation tab
  filters: {
    type: "all",            // income | expense | all
    category: "all",        // Category name or "all"
    search: "",             // Free-text search query
    sortBy: "date",         // date | amount
    sortDir: "desc",        // asc | desc
  },
  nextId: 61,               // Auto-increment ID for new transactions
}
```

**Actions dispatched:**

| Action | Description |
|--------|-------------|
| `SET_ROLE` | Switch between viewer and admin |
| `SET_TAB` | Navigate between pages |
| `SET_FILTER` | Update any filter field |
| `RESET_FILTERS` | Reset all filters to defaults |
| `ADD_TRANSACTION` | Append a new transaction |
| `EDIT_TRANSACTION` | Update an existing transaction by ID |
| `DELETE_TRANSACTION` | Remove a transaction by ID |

---

## 📱 Responsive Design

| Breakpoint | Layout |
|-----------|--------|
| Mobile (< 768px) | Top header bar + Bottom tab navigation |
| Desktop (≥ 768px) | Fixed sidebar (256px) + main content area |

The dashboard grid adjusts:
- **Mobile**: single column stack
- **Tablet**: 2-column cards
- **Desktop**: 3-column cards, side-by-side charts

---

## 🎨 Design Decisions

| Decision | Reasoning |
|----------|-----------|
| **Dark theme** | Finance apps feel premium and less fatiguing in dark mode |
| **Syne + DM Sans fonts** | Syne adds editorial character to headings; DM Sans is highly readable for data |
| **Purple/violet accent** | Distinct from typical green-only finance palettes; feels modern |
| **Gradient blobs** | Add visual depth without cluttering data |
| **Color coding** | Green = income, Red = expense — universally understood |
| **Context + useReducer** | Predictable state transitions; avoids prop drilling; scalable without Redux overhead |
| **No routing library** | Tab-based navigation is sufficient for a dashboard; avoids unnecessary complexity |

---

## ✅ Bonus Features Implemented

- [x] **localStorage persistence** — data and role survive page refresh
- [x] **CSV Export** — filtered transactions downloadable
- [x] **Page-load animations** — staggered fade-up / slide-in effects
- [x] **Empty state handling** — friendly UI when no results match filters
- [x] **Form validation** — required fields and numeric checks in modal
- [x] **Mobile responsive layout** — fully usable on phones
- [x] **Custom chart tooltips** — formatted with ₹ and category names
- [x] **Savings rate benchmark** — contextual insight vs. 20% rule

---

## 📝 Assumptions Made

- All transaction data is mock/static (60 pre-loaded transactions: Jan–Jun 2025)
- Monthly chart data (`monthlyData`) is pre-computed and not derived from transactions
- Role switching is for demonstration only — no real authentication
- Currency is Indian Rupees (₹) throughout
- "Current month" insights reference the last entry in `monthlyData`

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

---

<div align="center">

Built with ❤️ by Jeet 

</div>