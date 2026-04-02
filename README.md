# 💰 FinFlow — Finance Dashboard

A modern, interactive finance dashboard built with **React**, **Tailwind CSS**, and **Recharts**.

## 🚀 Setup

```bash
npm install
npm run dev        # Development → http://localhost:5173
npm run build      # Production build
```

## ✨ Features

### Dashboard
- Summary cards: Total Balance, Income, Expenses with savings rate
- 6-month area chart (balance/income/expense trend)
- Pie chart: spending breakdown by category
- Recent activity list

### Transactions
- Full list with search, filter (type + category), sort (date/amount)
- CSV Export
- Add / Edit / Delete — Admin only

### Role-Based UI
| Role | Permissions |
|------|-------------|
| Viewer | View, filter, search, export |
| Admin | Everything + Add, Edit, Delete |

Switch roles via sidebar toggle (no backend needed).

### Insights
- Highest & lowest spending category
- Monthly expense comparison with % change
- Savings rate with 20% benchmark
- Income growth MoM
- Category progress bars + bar chart comparison

### State Management
- React Context + useReducer
- localStorage persistence (data survives refresh)

### Responsive
- Desktop: fixed sidebar
- Mobile: top header + bottom navigation

## 🛠️ Tech Stack
- React 19 + Vite
- Tailwind CSS v3
- Recharts (AreaChart, PieChart, BarChart)
- Lucide React icons
- Context API + localStorage

## 📁 Structure
```
src/
├── context/AppContext.jsx      ← Global state
├── data/mockData.js            ← 60 sample transactions
├── components/
│   ├── Sidebar.jsx
│   ├── BottomNav.jsx
│   ├── SummaryCards.jsx
│   ├── BalanceChart.jsx
│   ├── SpendingChart.jsx
│   ├── RecentTransactions.jsx
│   └── TransactionModal.jsx
└── pages/
    ├── Dashboard.jsx
    ├── Transactions.jsx
    └── Insights.jsx
```

## 🎨 Design
Dark theme with purple/violet accents. Syne (display) + DM Sans (body) fonts. Color-coded: green = income, red = expense.

## ✅ Bonus Features Implemented
- localStorage persistence
- CSV export
- Page-load animations
- Empty state handling
- Form validation
- Mobile responsive layout
