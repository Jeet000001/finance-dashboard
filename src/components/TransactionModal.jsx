import { useState, useEffect } from "react";
import { X, IndianRupee, Calendar, Tag, AlignLeft, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/mockData";

const emptyForm = {
  description: "",
  amount: "",
  category: "Food",
  type: "expense",
  date: new Date().toISOString().slice(0, 10),
};

export default function TransactionModal({ open, onClose, editData }) {
  const { dispatch } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) setForm({ ...editData, amount: String(editData.amount) });
    else setForm(emptyForm);
    setErrors({});
  }, [editData, open]);

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      e.amount = "Enter a valid amount";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const payload = { ...form, amount: Number(form.amount) };
    if (editData) dispatch({ type: "EDIT_TRANSACTION", payload });
    else dispatch({ type: "ADD_TRANSACTION", payload });
    onClose();
  };

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!open) return null;

  return (
    <div
      onClick={handleBackdrop}
      className="
        fixed inset-0 z-50
        flex items-end sm:items-center justify-center
        px-0 sm:px-4 md:px-6
        bg-black/70 backdrop-blur-sm
      "
    >
      {/* Modal container */}
      <div
        className="
          relative w-full
          sm:max-w-md md:max-w-lg lg:max-w-xl
          rounded-t-3xl sm:rounded-2xl
          bg-[#1a1828] border border-[#2d2a45]
          shadow-2xl shadow-black/60
          overflow-hidden
          animate-[fadeUp_0.25s_ease]
        "
        style={{ maxHeight: "95dvh" }}
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-[#2d2a45]" />
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(95dvh - 20px)" }}>
          <div className="px-4 sm:px-6 pt-3 sm:pt-6 pb-5 sm:pb-6 space-y-5">

            {/* ── Header ── */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                  {editData ? "Edit Transaction" : "New Transaction"}
                </h2>
                <p className="text-[11px] sm:text-xs mt-0.5 text-[#4a4760]">
                  {editData ? "Update the details below" : "Fill in the details below"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="
                  p-2 rounded-xl
                  text-[#7a7890] hover:text-white
                  bg-transparent hover:bg-white/5
                  transition-all duration-150
                  flex-shrink-0
                "
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* ── Type Toggle ── */}
            <div>
              <label className="block text-xs mb-2 font-medium text-[#7a7890] uppercase tracking-wide">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "income",  label: "Income",  Icon: ArrowUpCircle,   active: "bg-emerald-500/15 border-emerald-500/40 text-emerald-400" },
                  { value: "expense", label: "Expense", Icon: ArrowDownCircle, active: "bg-red-500/15 border-red-500/40 text-red-400" },
                ].map(({ value, label, Icon, active }) => (
                  <button
                    key={value}
                    onClick={() => setForm(f => ({ ...f, type: value }))}
                    className={`
                      flex items-center justify-center gap-2
                      py-3 sm:py-3.5 px-3
                      rounded-xl border text-sm font-semibold
                      transition-all duration-150
                      ${form.type === value ? active : "border-[#2d2a45] text-[#4a4760] hover:border-[#3d3a55] hover:text-[#7a7890]"}
                    `}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Description ── */}
            <div>
              <label className="block text-xs mb-1.5 font-medium text-[#7a7890] uppercase tracking-wide">
                Description
              </label>
              <div className="relative">
                <AlignLeft
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a4760] pointer-events-none"
                />
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="e.g. Monthly Salary, House Rent..."
                  className={`
                    w-full pl-10 pr-4
                    py-3 sm:py-3.5
                    text-sm rounded-xl outline-none
                    bg-[#12111e] text-[#e8e6f0]
                    placeholder:text-[#3d3a55]
                    border transition-all
                    focus:border-violet-500/60 focus:bg-[#14132a]
                    ${errors.description ? "border-red-500/70" : "border-[#2d2a45]"}
                  `}
                />
              </div>
              {errors.description && (
                <p className="text-[11px] mt-1.5 text-red-400 flex items-center gap-1">
                  <span>⚠</span> {errors.description}
                </p>
              )}
            </div>

            {/* ── Amount ── */}
            <div>
              <label className="block text-xs mb-1.5 font-medium text-[#7a7890] uppercase tracking-wide">
                Amount
              </label>
              <div className="relative">
                <IndianRupee
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a4760] pointer-events-none"
                />
                <input
                  type="number"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="0"
                  min="0"
                  className={`
                    w-full pl-10 pr-4
                    py-3 sm:py-3.5
                    text-sm rounded-xl outline-none font-mono
                    bg-[#12111e] text-[#e8e6f0]
                    placeholder:text-[#3d3a55]
                    border transition-all
                    focus:border-violet-500/60 focus:bg-[#14132a]
                    ${errors.amount ? "border-red-500/70" : "border-[#2d2a45]"}
                  `}
                />
              </div>
              {errors.amount && (
                <p className="text-[11px] mt-1.5 text-red-400 flex items-center gap-1">
                  <span>⚠</span> {errors.amount}
                </p>
              )}
            </div>

            {/* ── Category + Date (side-by-side on sm+) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Category */}
              <div>
                <label className="block text-xs mb-1.5 font-medium text-[#7a7890] uppercase tracking-wide">
                  Category
                </label>
                <div className="relative">
                  <Tag
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a4760] pointer-events-none z-10"
                  />
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="
                      w-full pl-10 pr-4
                      py-3 sm:py-3.5
                      text-sm rounded-xl outline-none
                      bg-[#12111e] text-[#e8e6f0]
                      border border-[#2d2a45]
                      transition-all appearance-none cursor-pointer
                      focus:border-violet-500/60 focus:bg-[#14132a]
                    "
                  >
                    {Object.keys(CATEGORIES).map(c => (
                      <option key={c} value={c} style={{ background: "#1a1828" }}>
                        {CATEGORIES[c].icon} {c}
                      </option>
                    ))}
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#4a4760] text-xs">
                    ▾
                  </div>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs mb-1.5 font-medium text-[#7a7890] uppercase tracking-wide">
                  Date
                </label>
                <div className="relative">
                  <Calendar
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a4760] pointer-events-none"
                  />
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="
                      w-full pl-10 pr-4
                      py-3 sm:py-3.5
                      text-sm rounded-xl outline-none
                      bg-[#12111e] text-[#e8e6f0]
                      border border-[#2d2a45]
                      transition-all
                      focus:border-violet-500/60 focus:bg-[#14132a]
                      [color-scheme:dark]
                    "
                  />
                </div>
              </div>
            </div>

            {/* ── Action Buttons ── */}
            <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 pt-1">
              <button
                onClick={onClose}
                className="
                  flex-1 py-3 sm:py-3.5
                  rounded-xl text-sm font-medium
                  bg-[#12111e] text-[#7a7890]
                  border border-[#2d2a45]
                  hover:bg-[#1b1a2b] hover:text-white
                  transition-all duration-150
                "
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="
                  flex-1 py-3 sm:py-3.5
                  rounded-xl text-sm font-bold text-white
                  bg-gradient-to-r from-violet-600 to-purple-800
                  hover:opacity-90 hover:shadow-lg hover:shadow-violet-900/40
                  active:scale-[0.98]
                  transition-all duration-150
                "
              >
                {editData ? "Save Changes" : "Add Transaction"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}