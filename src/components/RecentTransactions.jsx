import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/mockData";

export default function RecentTransactions() {
  const { state, dispatch } = useApp();
  const recent = [...state.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return (
    <div className="rounded-2xl p-5 anim-fade-up delay-5" style={{ background: "#1a1828", border: "1px solid #2d2a45" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-white">Recent Activity</h3>
          <p className="text-xs mt-0.5" style={{ color: "#4a4760" }}>Latest transactions</p>
        </div>
        <button
          onClick={() => dispatch({ type: "SET_TAB", payload: "transactions" })}
          className="text-xs flex items-center gap-1 transition-colors hover:text-purple-400"
          style={{ color: "#7a7890" }}
        >
          View all <ArrowUpRight size={12} />
        </button>
      </div>

      <div className="space-y-2">
        {recent.map(t => {
          const cat = CATEGORIES[t.category];
          const isIncome = t.type === "income";
          return (
            <div
              key={t.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
              style={{ background: "#12111e" }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                style={{ background: "#1a1828" }}>
                {cat?.icon || "💰"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "#e8e6f0" }}>{t.description}</p>
                <p className="text-xs" style={{ color: "#4a4760" }}>
                  {t.category} · {new Date(t.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {isIncome
                  ? <ArrowUpRight size={12} color="#22c55e" />
                  : <ArrowDownLeft size={12} color="#ef4444" />}
                <span className="text-sm font-mono font-medium" style={{ color: isIncome ? "#22c55e" : "#ef4444" }}>
                  {isIncome ? "+" : "-"}₹{t.amount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
