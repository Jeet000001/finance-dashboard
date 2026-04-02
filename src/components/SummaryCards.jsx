import { Wallet, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { useApp } from "../context/AppContext";

function fmt(n) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function SummaryCards() {
  const { state } = useApp();
  const txns = state.transactions;

  const income = txns.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = txns.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = income - expenses;
  const savingsRate = income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0;

  const cards = [
    {
      label: "Total Balance",
      value: fmt(balance),
      sub: `${savingsRate}% savings rate`,
      icon: Wallet,
      gradient: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)",
      glow: "rgba(124,58,237,0.3)",
      textColor: "#c4b5fd",
    },
    {
      label: "Total Income",
      value: fmt(income),
      sub: `${txns.filter(t => t.type === "income").length} transactions`,
      icon: TrendingUp,
      gradient: "linear-gradient(135deg, #16a34a 0%, #14532d 100%)",
      glow: "rgba(34,197,94,0.2)",
      textColor: "#86efac",
    },
    {
      label: "Total Expenses",
      value: fmt(expenses),
      sub: `${txns.filter(t => t.type === "expense").length} transactions`,
      icon: TrendingDown,
      gradient: "linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)",
      glow: "rgba(239,68,68,0.2)",
      textColor: "#fca5a5",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`relative rounded-2xl p-5 overflow-hidden anim-fade-up delay-${i + 1}`}
            style={{ background: "#1a1828", border: "1px solid #2d2a45", boxShadow: `0 0 40px ${card.glow}` }}
          >
            {/* Gradient blob */}
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-20 blur-xl"
              style={{ background: card.gradient }} />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card.gradient }}>
                  <Icon size={18} color="#fff" />
                </div>
                <ArrowUpRight size={14} color="#4a4760" />
              </div>
              <p className="text-xs mb-1 font-medium" style={{ color: "#7a7890" }}>{card.label}</p>
              <p className="text-2xl font-display font-bold" style={{ color: card.textColor }}>{card.value}</p>
              <p className="text-xs mt-1" style={{ color: "#4a4760" }}>{card.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
