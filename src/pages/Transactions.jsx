import { useState, useMemo } from "react";
import {
  Search, Plus, ArrowUpDown, Trash2, Pencil,
  ArrowUpRight, ArrowDownLeft, Download, SlidersHorizontal, X
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/mockData";
import TransactionModal from "../components/TransactionModal";

export default function Transactions() {
  const { state, dispatch } = useApp();
  const { transactions, filters, role } = state;
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const isAdmin = role === "admin";

  const filtered = useMemo(() => {
    let result = [...transactions];
    if (filters.type !== "all") result = result.filter(t => t.type === filters.type);
    if (filters.category !== "all") result = result.filter(t => t.category === filters.category);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
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
  const openAdd  = () => { setEditData(null); setModalOpen(true); };
  const handleDelete = (id) => {
    if (confirm("Delete this transaction?"))
      dispatch({ type: "DELETE_TRANSACTION", payload: id });
  };

  const exportCSV = () => {
    const headers = ["Date", "Description", "Category", "Type", "Amount"];
    const rows = filtered.map(t => [t.date, t.description, t.category, t.type, t.amount]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "transactions.csv"; a.click();
  };

  const activeFilterCount = [
    filters.type !== "all",
    filters.category !== "all",
    filters.search !== "",
  ].filter(Boolean).length;

  return (
    <div className="space-y-4 sm:space-y-5">

      {/* ── PAGE HEADER ── */}
      <div className="flex items-start sm:items-center justify-between gap-3 anim-fade-up">
        <div>
          <h1 className="font-display font-bold text-white text-xl sm:text-2xl">
            Transactions
          </h1>
          <p className="text-xs sm:text-sm mt-0.5 text-[#4a4760]">
            {filtered.length} of {transactions.length} records
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Export — icon only on mobile */}
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-2.5 sm:px-4 py-2.5 rounded-xl text-sm
                       bg-[#1a1828] text-[#7a7890] border border-[#2d2a45]
                       hover:text-white hover:border-[#3d3a55] transition-all"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Add — icon + text on all sizes */}
          {isAdmin && (
            <button
              onClick={openAdd}
              className="flex items-center gap-1.5 px-2.5 sm:px-4 py-2.5 rounded-xl text-sm font-medium
                         bg-gradient-to-r from-violet-600 to-purple-800 text-white
                         hover:opacity-90 active:scale-95 transition-all"
            >
              <Plus size={14} />
              <span className="hidden xs:inline sm:inline">Add</span>
              <span className="hidden sm:inline">Transaction</span>
            </button>
          )}
        </div>
      </div>

      {/* ── SEARCH + FILTER BAR ── */}
      <div className="space-y-2 anim-fade-up delay-1">

        {/* Row 1: Search + Filter toggle */}
        <div className="flex gap-2">
          {/* Search */}
          <div className="flex items-center gap-2 flex-1 px-3 sm:px-4 py-2.5 rounded-xl
                          bg-[#1a1828] border border-[#2d2a45]">
            <Search size={14} className="text-[#4a4760] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={e => dispatch({ type: "SET_FILTER", payload: { search: e.target.value } })}
              className="flex-1 bg-transparent outline-none text-sm text-[#e8e6f0]
                         placeholder:text-[#3d3a55] min-w-0"
            />
            {filters.search && (
              <button
                onClick={() => dispatch({ type: "SET_FILTER", payload: { search: "" } })}
                className="text-[#4a4760] hover:text-white transition-colors flex-shrink-0"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter toggle button — mobile */}
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`sm:hidden flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm
                        border transition-all relative
                        ${showFilters
                          ? "bg-violet-600/20 border-violet-500/40 text-violet-400"
                          : "bg-[#1a1828] border-[#2d2a45] text-[#7a7890]"}`}
          >
            <SlidersHorizontal size={14} />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full
                               bg-violet-600 text-white text-[10px] font-bold
                               flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Row 2: Filters — always visible on desktop, toggle on mobile */}
        <div className={`
          flex-wrap gap-2
          ${showFilters ? "flex" : "hidden sm:flex"}
        `}>
          <select
            value={filters.type}
            onChange={e => dispatch({ type: "SET_FILTER", payload: { type: e.target.value } })}
            className="flex-1 sm:flex-none px-3 py-2.5 rounded-xl text-sm outline-none
                       bg-[#1a1828] border border-[#2d2a45] text-[#e8e6f0]
                       min-w-[120px] cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={filters.category}
            onChange={e => dispatch({ type: "SET_FILTER", payload: { category: e.target.value } })}
            className="flex-1 sm:flex-none px-3 py-2.5 rounded-xl text-sm outline-none
                       bg-[#1a1828] border border-[#2d2a45] text-[#e8e6f0]
                       min-w-[140px] cursor-pointer"
          >
            <option value="all">All Categories</option>
            {Object.keys(CATEGORIES).map(c => (
              <option key={c} value={c}>{CATEGORIES[c].icon} {c}</option>
            ))}
          </select>

          {/* Sort — mobile only (desktop uses column headers) */}
          <select
            value={`${filters.sortBy}-${filters.sortDir}`}
            onChange={e => {
              const [sortBy, sortDir] = e.target.value.split("-");
              dispatch({ type: "SET_FILTER", payload: { sortBy, sortDir } });
            }}
            className="flex-1 sm:hidden px-3 py-2.5 rounded-xl text-sm outline-none
                       bg-[#1a1828] border border-[#2d2a45] text-[#e8e6f0]
                       min-w-[140px] cursor-pointer"
          >
            <option value="date-desc">Date: Newest</option>
            <option value="date-asc">Date: Oldest</option>
            <option value="amount-desc">Amount: High</option>
            <option value="amount-asc">Amount: Low</option>
          </select>

          <button
            onClick={() => { dispatch({ type: "RESET_FILTERS" }); setShowFilters(false); }}
            className="px-3 py-2.5 rounded-xl text-sm bg-[#1a1828] text-[#7a7890]
                       border border-[#2d2a45] hover:text-white hover:border-[#3d3a55] transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      {/* ── TABLE (desktop md+) ── */}
      <div className="hidden md:block rounded-2xl overflow-hidden border border-[#2d2a45] anim-fade-up delay-2">

        {/* Table header */}
        <div
          className="px-5 py-3 grid gap-4 text-xs font-medium text-[#4a4760] bg-[#12111e]"
          style={{ gridTemplateColumns: isAdmin ? "1fr 2fr 1fr 1fr 1fr auto" : "1fr 2fr 1fr 1fr 1fr" }}
        >
          <button
            onClick={() => toggleSort("date")}
            className="flex items-center gap-1 hover:text-white transition-colors w-fit"
          >
            Date
            <ArrowUpDown size={11} className={filters.sortBy === "date" ? "text-violet-400" : ""} />
          </button>
          <span>Description</span>
          <span>Category</span>
          <span>Type</span>
          <button
            onClick={() => toggleSort("amount")}
            className="flex items-center gap-1 hover:text-white transition-colors w-fit"
          >
            Amount
            <ArrowUpDown size={11} className={filters.sortBy === "amount" ? "text-violet-400" : ""} />
          </button>
          {isAdmin && <span>Actions</span>}
        </div>

        {/* Table rows */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="bg-[#1a1828]">
            {filtered.map((t, i) => {
              const cat = CATEGORIES[t.category];
              const isIncome = t.type === "income";
              return (
                <div
                  key={t.id}
                  className="px-5 py-3.5 grid gap-4 items-center text-sm
                             hover:bg-white/[0.02] transition-colors"
                  style={{
                    gridTemplateColumns: isAdmin ? "1fr 2fr 1fr 1fr 1fr auto" : "1fr 2fr 1fr 1fr 1fr",
                    borderTop: i > 0 ? "1px solid #1f1d30" : "none",
                  }}
                >
                  <span className="font-mono text-xs text-[#7a7890]">
                    {new Date(t.date).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "2-digit",
                    })}
                  </span>
                  <span className="font-medium truncate text-[#e8e6f0]">{t.description}</span>
                  <span className="flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: cat?.color || "#888" }} />
                    <span className="text-[#7a7890] truncate">{t.category}</span>
                  </span>
                  <span>
                    <TypeBadge isIncome={isIncome} />
                  </span>
                  <span
                    className="font-mono font-semibold"
                    style={{ color: isIncome ? "#22c55e" : "#ef4444" }}
                  >
                    {isIncome ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                  </span>
                  {isAdmin && (
                    <RowActions
                      onEdit={() => openEdit(t)}
                      onDelete={() => handleDelete(t.id)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── CARDS (mobile < md) ── */}
      <div className="md:hidden space-y-2 anim-fade-up delay-2">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map(t => {
            const cat = CATEGORIES[t.category];
            const isIncome = t.type === "income";
            return (
              <div
                key={t.id}
                className="bg-[#1a1828] border border-[#2d2a45] rounded-2xl px-4 py-3.5
                           hover:border-[#3d3a55] transition-all"
              >
                {/* Card top row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Category icon */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center
                                 text-base flex-shrink-0"
                      style={{ background: "#12111e" }}
                    >
                      {cat?.icon || "💰"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#e8e6f0] truncate">
                        {t.description}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-[#4a4760]">
                          <span className="w-1.5 h-1.5 rounded-full"
                            style={{ background: cat?.color || "#888" }} />
                          {t.category}
                        </span>
                        <span className="text-[#2d2a45]">·</span>
                        <span className="text-xs text-[#4a4760]">
                          {new Date(t.date).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amount + type */}
                  <div className="text-right flex-shrink-0">
                    <p
                      className="text-sm font-mono font-bold"
                      style={{ color: isIncome ? "#22c55e" : "#ef4444" }}
                    >
                      {isIncome ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                    </p>
                    <div className="flex justify-end mt-1">
                      <TypeBadge isIncome={isIncome} />
                    </div>
                  </div>
                </div>

                {/* Admin actions */}
                {isAdmin && (
                  <div className="flex justify-end gap-2 mt-3 pt-2.5 border-t border-[#1f1d30]">
                    <button
                      onClick={() => openEdit(t)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                                 text-[#7a7890] bg-[#12111e] border border-[#2d2a45]
                                 hover:text-white hover:border-[#3d3a55] transition-all"
                    >
                      <Pencil size={11} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs
                                 text-[#7a7890] bg-[#12111e] border border-[#2d2a45]
                                 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5
                                 transition-all"
                    >
                      <Trash2 size={11} /> Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editData={editData}
      />
    </div>
  );
}

function TypeBadge({ isIncome }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium
        ${isIncome
          ? "bg-emerald-500/10 text-emerald-400"
          : "bg-red-500/10 text-red-400"}`}
    >
      {isIncome
        ? <ArrowUpRight size={10} />
        : <ArrowDownLeft size={10} />}
      {isIncome ? "income" : "expense"}
    </span>
  );
}

function RowActions({ onEdit, onDelete }) {
  return (
    <div className="flex gap-1">
      <button
        onClick={onEdit}
        className="p-1.5 rounded-lg text-[#7a7890] hover:text-white
                   hover:bg-white/5 transition-all"
      >
        <Pencil size={13} />
      </button>
      <button
        onClick={onDelete}
        className="p-1.5 rounded-lg text-[#7a7890] hover:text-red-400
                   hover:bg-red-500/10 transition-all"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-16 text-center bg-[#1a1828] rounded-2xl border border-[#2d2a45]">
      <p className="text-4xl mb-3">🔍</p>
      <p className="font-medium text-[#7a7890]">No transactions found</p>
      <p className="text-sm mt-1 text-[#4a4760]">Try adjusting your filters</p>
    </div>
  );
}