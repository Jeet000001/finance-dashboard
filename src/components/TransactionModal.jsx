import { useState, useEffect } from "react";
import {
  X,
  IndianRupee,
  AlignLeft,
  Tag,
  Calendar,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
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
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    const payload = { ...form, amount: Number(form.amount) };
    if (editData) dispatch({ type: "EDIT_TRANSACTION", payload });
    else dispatch({ type: "ADD_TRANSACTION", payload });
    onClose();
  };

  if (!open) return null;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="
        fixed inset-0 z-50
        flex items-end sm:items-center justify-center
        bg-black/70 backdrop-blur-sm
      "
    >
      <div
        className="
          w-full
          sm:w-[480px] md:w-[520px] lg:w-[560px]
          sm:mx-4
          rounded-t-[24px] sm:rounded-2xl
          bg-[#1a1828] border border-[#2d2a45]
          overflow-hidden
          max-h-[92dvh] sm:max-h-[90vh]
          flex flex-col
        "
        style={{ animation: "fadeUp 0.22s ease" }}
      >
        <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="w-9 h-1 rounded-full bg-[#2d2a45]" />
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="px-4 sm:px-6 pt-3 sm:pt-6 pb-5 sm:pb-6 space-y-4 sm:space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[15px] sm:text-base font-bold text-white leading-snug">
                  {editData ? "Edit Transaction" : "Add Transaction"}
                </h2>
                <p className="text-[11px] sm:text-xs mt-0.5 text-[#4a4760]">
                  {editData
                    ? "Update the details below"
                    : "Fill in the details below"}
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="
                  w-8 h-8 flex-shrink-0
                  flex items-center justify-center
                  rounded-xl text-[#7a7890]
                  hover:bg-white/5 hover:text-white
                  transition-all
                "
              >
                <X size={17} />
              </button>
            </div>

            <div>
              <p className="text-[10px] sm:text-[11px] font-medium text-[#7a7890] uppercase tracking-widest mb-2">
                Transaction Type
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    value: "income",
                    label: "Income",
                    Icon: ArrowUpCircle,
                    activeClass:
                      "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
                  },
                  {
                    value: "expense",
                    label: "Expense",
                    Icon: ArrowDownCircle,
                    activeClass: "border-red-500/40 bg-red-500/10 text-red-400",
                  },
                ].map(({ value, label, activeClass }) => (
                  <button
                    key={value}
                    onClick={() => setForm((f) => ({ ...f, type: value }))}
                    className={`
                      flex items-center justify-center gap-2
                      py-2.5 sm:py-3 rounded-xl border
                      text-xs sm:text-sm font-semibold
                      transition-all duration-150
                      ${
                        form.type === value
                          ? activeClass
                          : "border-[#2d2a45] text-[#4a4760] hover:border-[#3d3a55] hover:text-[#7a7890]"
                      }
                    `}
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] sm:text-[11px] font-medium text-[#7a7890] uppercase tracking-widest mb-1.5">
                Description
              </label>
              <div className="relative">
                <AlignLeft
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a4760] pointer-events-none"
                />
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="e.g. Monthly Salary, House Rent..."
                  className={`
                    w-full pl-9 pr-3
                    py-2.5 sm:py-3
                    text-sm rounded-xl outline-none
                    bg-[#12111e] text-[#e8e6f0]
                    placeholder:text-[#3d3a55]
                    border transition-all
                    focus:border-violet-500/50 focus:bg-[#13122a]
                    ${errors.description ? "border-red-500/60" : "border-[#2d2a45]"}
                  `}
                />
              </div>
              {errors.description && (
                <p className="text-[11px] mt-1 text-red-400">
                  ⚠ {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[10px] sm:text-[11px] font-medium text-[#7a7890] uppercase tracking-widest mb-1.5">
                Amount
              </label>
              <div className="relative">
                <IndianRupee
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a4760] pointer-events-none"
                />
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, amount: e.target.value }))
                  }
                  placeholder="0"
                  min="0"
                  className={`
                    w-full pl-9 pr-3
                    py-2.5 sm:py-3
                    text-sm rounded-xl outline-none font-mono
                    bg-[#12111e] text-[#e8e6f0]
                    placeholder:text-[#3d3a55]
                    border transition-all
                    focus:border-violet-500/50 focus:bg-[#13122a]
                    ${errors.amount ? "border-red-500/60" : "border-[#2d2a45]"}
                  `}
                />
              </div>
              {errors.amount && (
                <p className="text-[11px] mt-1 text-red-400">
                  ⚠ {errors.amount}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-[10px] sm:text-[11px] font-medium text-[#7a7890] uppercase tracking-widest mb-1.5">
                  Category
                </label>
                <div className="relative">
                  <Tag
                    size={13}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a4760] pointer-events-none z-10"
                  />
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value }))
                    }
                    className="
                      w-full pl-9 pr-8
                      py-2.5 sm:py-3
                      text-sm rounded-xl outline-none
                      bg-[#12111e] text-[#e8e6f0]
                      border border-[#2d2a45]
                      appearance-none cursor-pointer
                      transition-all
                      focus:border-violet-500/50 focus:bg-[#13122a]
                    "
                  >
                    {Object.keys(CATEGORIES).map((c) => (
                      <option
                        key={c}
                        value={c}
                        style={{ background: "#1a1828" }}
                      >
                        {CATEGORIES[c].icon} {c}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4a4760] text-xs pointer-events-none">
                    ▾
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] sm:text-[11px] font-medium text-[#7a7890] uppercase tracking-widest mb-1.5">
                  Date
                </label>
                <div className="relative">
                  <Calendar
                    size={13}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4a4760] pointer-events-none"
                  />
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, date: e.target.value }))
                    }
                    className="
                      w-full pl-9 pr-3
                      py-2.5 sm:py-3
                      text-sm rounded-xl outline-none
                      bg-[#12111e] text-[#e8e6f0]
                      border border-[#2d2a45]
                      transition-all
                      focus:border-violet-500/50 focus:bg-[#13122a]
                      [color-scheme:dark]
                    "
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 pt-1">
              <button
                onClick={onClose}
                className="
                  flex-1 py-3 sm:py-3.5
                  rounded-xl text-sm font-medium
                  bg-[#12111e] text-[#7a7890]
                  border border-[#2d2a45]
                  hover:bg-[#1c1b2e] hover:text-white
                  transition-all
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
                  hover:opacity-90 active:scale-[0.98]
                  transition-all
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
