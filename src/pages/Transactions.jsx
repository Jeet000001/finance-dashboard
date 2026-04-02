import { useState, useMemo } from "react";
import { Search, Plus, ArrowUpDown, Trash2, Pencil, ArrowUpRight, ArrowDownLeft, Download, Filter } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/mockData";
import TransactionModal from "../components/TransactionModal";

export default function Transactions() {
  const { state, dispatch } = useApp();
  const { transactions, filters, role } = state;
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const isAdmin = role === "admin";

  const filtered = useMemo(() => {
    let result = [...transactions];
    if (filters.type !== "all") result = result.filter(t => t.type === filters.type);
    if (filters.category !== "all") result = result.filter(t => t.category === filters.category);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      if (filters.sortBy === "date") {
        const diff = new Date(a.date) - new Date(b.date);
        return filters.sortDir === "asc" ? diff : -diff;
      }
      if (filters.sortBy === "amount") {
        const diff = a.amount - b.amount;
        return filters.sortDir === "asc" ? diff : -diff;
      }
      return 0;
    });
    return result;
  }, [transactions, filters]);

  const toggleSort = (field) => {
    if (filters.sortBy === field) {
      dispatch({ type: "SET_FILTER", payload: { sortDir: filters.sortDir === "asc" ? "desc" : "asc" } });
    } else {
      dispatch({ type: "SET_FILTER", payload: { sortBy: field, sortDir: "desc" } });
    }
  };

  const openEdit = (t) => { setEditData(t); setModalOpen(true); };
  const openAdd = () => { setEditData(null); setModalOpen(true); };
  const handleDelete = (id) => { if (confirm("Delete this transaction?")) dispatch({ type: "DELETE_TRANSACTION", payload: id }); };

  const exportCSV = () => {
    const headers = ["Date", "Description", "Category", "Type", "Amount"];
    const rows = filtered.map(t => [t.date, t.description, t.category, t.type, t.amount]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "transactions.csv"; a.click();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between anim-fade-up">
        <div>
          <h1 className="font-display font-bold text-white text-2xl">Transactions</h1>
          <p className="text-sm mt-1" style={{ color: "#4a4760" }}>{filtered.length} of {transactions.length} records</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all"
            style={{ background: "#1a1828", color: "#7a7890", border: "1px solid #2d2a45" }}>
            <Download size={14} /> Export
          </button>
          {isAdmin && (
            <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)", color: "#fff" }}>
              <Plus size={14} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 anim-fade-up delay-1">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] px-4 py-2.5 rounded-xl"
          style={{ background: "#1a1828", border: "1px solid #2d2a45" }}>
          <Search size={15} color="#4a4760" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={e => dispatch({ type: "SET_FILTER", payload: { search: e.target.value } })}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "#e8e6f0" }}
          />
        </div>

        <select
          value={filters.type}
          onChange={e => dispatch({ type: "SET_FILTER", payload: { type: e.target.value } })}
          className="px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: "#1a1828", border: "1px solid #2d2a45", color: "#e8e6f0" }}
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={filters.category}
          onChange={e => dispatch({ type: "SET_FILTER", payload: { category: e.target.value } })}
          className="px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{ background: "#1a1828", border: "1px solid #2d2a45", color: "#e8e6f0" }}
        >
          <option value="all">All Categories</option>
          {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{CATEGORIES[c].icon} {c}</option>)}
        </select>

        <button onClick={() => dispatch({ type: "RESET_FILTERS" })}
          className="px-4 py-2.5 rounded-xl text-sm transition-colors"
          style={{ background: "#1a1828", color: "#7a7890", border: "1px solid #2d2a45" }}>
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden anim-fade-up delay-2" style={{ border: "1px solid #2d2a45" }}>
        {/* Table header */}
        <div className="px-5 py-3 grid gap-4 text-xs font-medium"
          style={{ background: "#12111e", color: "#4a4760", gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr auto" }}>
          <button onClick={() => toggleSort("date")} className="flex items-center gap-1 hover:text-white transition-colors">
            Date <ArrowUpDown size={11} />
          </button>
          <span>Description</span>
          <span>Category</span>
          <span>Type</span>
          <button onClick={() => toggleSort("amount")} className="flex items-center gap-1 hover:text-white transition-colors">
            Amount <ArrowUpDown size={11} />
          </button>
          {isAdmin && <span>Actions</span>}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center" style={{ background: "#1a1828" }}>
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-medium" style={{ color: "#7a7890" }}>No transactions found</p>
            <p className="text-sm mt-1" style={{ color: "#4a4760" }}>Try adjusting your filters</p>
          </div>
        ) : (
          <div style={{ background: "#1a1828" }}>
            {filtered.map((t, i) => {
              const cat = CATEGORIES[t.category];
              const isIncome = t.type === "income";
              return (
                <div
                  key={t.id}
                  className="px-5 py-3.5 grid gap-4 items-center text-sm transition-colors hover:bg-white/[0.02]"
                  style={{
                    gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr auto",
                    borderTop: i > 0 ? "1px solid #1f1d30" : "none",
                  }}
                >
                  <span className="font-mono text-xs" style={{ color: "#7a7890" }}>
                    {new Date(t.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}
                  </span>
                  <span className="font-medium truncate" style={{ color: "#e8e6f0" }}>{t.description}</span>
                  <span className="flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full" style={{ background: cat?.color || "#888" }} />
                    <span style={{ color: "#7a7890" }}>{t.category}</span>
                  </span>
                  <span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium"
                      style={{
                        background: isIncome ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                        color: isIncome ? "#22c55e" : "#ef4444",
                      }}>
                      {isIncome ? <ArrowUpRight size={10} /> : <ArrowDownLeft size={10} />}
                      {t.type}
                    </span>
                  </span>
                  <span className="font-mono font-semibold" style={{ color: isIncome ? "#22c55e" : "#ef4444" }}>
                    {isIncome ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                  </span>
                  {isAdmin && (
                    <div className="flex gap-1.5">
                      <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
                        style={{ color: "#7a7890" }}>
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10"
                        style={{ color: "#7a7890" }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <TransactionModal open={modalOpen} onClose={() => setModalOpen(false)} editData={editData} />
    </div>
  );
}
