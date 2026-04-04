import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/mockData";

export default function RecentTransactions() {
  const { state, dispatch } = useApp();

  const recent = [...state.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return (
    <div className="rounded-2xl p-5 bg-[#1a1828] border border-[#2d2a45] anim-fade-up delay-5">
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-white">
            Recent Activity
          </h3>
          <p className="text-xs mt-0.5 text-[#4a4760]">
            Latest transactions
          </p>
        </div>

        <button
          onClick={() => dispatch({ type: "SET_TAB", payload: "transactions" })}
          className="text-xs flex items-center gap-1 text-[#7a7890] hover:text-purple-400 transition-colors"
        >
          View all
          <ArrowUpRight size={12} />
        </button>
      </div>

      <div className="space-y-2">
        {recent.map(t => {
          const cat = CATEGORIES[t.category];
          const isIncome = t.type === "income";

          return (
            <div
              key={t.id}
              className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-[#12111e] hover:bg-[#2f2d54] transition-all"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#e8e6f0] truncate">
                  {t.description}
                </p>

                <p className="text-xs text-[#4a4760]">
                  {t.category} ·{" "}
                  {new Date(t.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>

              <div className="flex items-center gap-1">
                {isIncome ? (
                  <ArrowUpRight size={12} className="text-green-500" />
                ) : (
                  <ArrowDownLeft size={12} className="text-red-500" />
                )}

                <span
                  className={`text-sm font-mono font-medium ${
                    isIncome ? "text-green-500" : "text-red-500"
                  }`}
                >
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