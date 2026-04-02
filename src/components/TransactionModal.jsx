import { useState, useEffect } from "react";
import { X } from "lucide-react";
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
    if (!form.description.trim()) e.description = "Required";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = "Enter valid amount";
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-md rounded-2xl p-6 anim-scale-in" style={{ background: "#1a1828", border: "1px solid #2d2a45" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-white text-lg">
            {editData ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-white/5" style={{ color: "#7a7890" }}>
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Description */}
          <div>
            <label className="block text-xs mb-1.5 font-medium" style={{ color: "#7a7890" }}>Description</label>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{ background: "#12111e", border: `1px solid ${errors.description ? "#ef4444" : "#2d2a45"}`, color: "#e8e6f0" }}
              placeholder="e.g. Monthly Salary"
            />
            {errors.description && <p className="text-xs mt-1" style={{ color: "#ef4444" }}>{errors.description}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs mb-1.5 font-medium" style={{ color: "#7a7890" }}>Amount (₹)</label>
            <input
              type="number"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all font-mono"
              style={{ background: "#12111e", border: `1px solid ${errors.amount ? "#ef4444" : "#2d2a45"}`, color: "#e8e6f0" }}
              placeholder="0"
            />
            {errors.amount && <p className="text-xs mt-1" style={{ color: "#ef4444" }}>{errors.amount}</p>}
          </div>

          {/* Type + Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1.5 font-medium" style={{ color: "#7a7890" }}>Type</label>
              <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid #2d2a45" }}>
                {["income", "expense"].map(t => (
                  <button
                    key={t}
                    onClick={() => setForm(f => ({ ...f, type: t }))}
                    className="flex-1 py-2.5 text-xs font-medium capitalize transition-all"
                    style={{
                      background: form.type === t ? (t === "income" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)") : "transparent",
                      color: form.type === t ? (t === "income" ? "#22c55e" : "#ef4444") : "#4a4760",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs mb-1.5 font-medium" style={{ color: "#7a7890" }}>Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: "#12111e", border: "1px solid #2d2a45", color: "#e8e6f0" }}
              >
                {Object.keys(CATEGORIES).map(c => (
                  <option key={c} value={c}>{CATEGORIES[c].icon} {c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs mb-1.5 font-medium" style={{ color: "#7a7890" }}>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{ background: "#12111e", border: "1px solid #2d2a45", color: "#e8e6f0" }}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-medium transition-colors"
            style={{ background: "#12111e", color: "#7a7890", border: "1px solid #2d2a45" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)", color: "#fff" }}
          >
            {editData ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}
