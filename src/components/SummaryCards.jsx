import { Wallet, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useEffect, useState } from "react";

function fmt(n) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function SummaryCards() {
  const { state } = useApp();
  const txns = state.transactions;

  const income = txns
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const expenses = txns
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const balance = income - expenses;

  const savingsRate =
    income > 0 ? (((income - expenses) / income) * 100).toFixed(1) : 0;

  const [animatedIncome, setAnimatedIncome] = useState(0);
  const [animatedExpenses, setAnimatedExpenses] = useState(0);
  const [animatedBalance, setAnimatedBalance] = useState(0);

  useEffect(() => {
    const duration = 800;

    const animateValue = (start, end, setter) => {
      let startTime = null;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;

        const percentage = Math.min(progress / duration, 1);
        const value = Math.floor(start + (end - start) * percentage);

        setter(value);

        if (percentage < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    };

    animateValue(0, income, setAnimatedIncome);
    animateValue(0, expenses, setAnimatedExpenses);
    animateValue(0, balance, setAnimatedBalance);
  }, [income, expenses, balance]);

  const cards = [
    {
      label: "Total Balance",
      value: animatedBalance,
      sub: `${savingsRate}% savings rate`,
      icon: Wallet,
      iconBg: "bg-violet-600",
      textColor: "text-violet-300",
    },
    {
      label: "Total Income",
      value: animatedIncome,
      sub: `${txns.filter((t) => t.type === "income").length} transactions`,
      icon: TrendingUp,
      iconBg: "bg-green-500",
      textColor: "text-green-300",
    },
    {
      label: "Total Expenses",
      value: animatedExpenses,
      sub: `${txns.filter((t) => t.type === "expense").length} transactions`,
      icon: TrendingDown,
      iconBg: "bg-red-500",
      textColor: "text-red-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="relative rounded-2xl p-5 overflow-hidden bg-[#1a1828] border border-[#2d2a45] hover:border-violet-500/30 transition-all duration-300 shadow-lg"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.iconBg}`}
                >
                  <Icon size={18} className="text-white" />
                </div>

                <ArrowUpRight size={14} className="text-gray-500" />
              </div>

              <p className="text-xs mb-1 font-medium text-gray-400">
                {card.label}
              </p>

              <p className={`text-2xl font-bold ${card.textColor}`}>
                {fmt(card.value)}
              </p>

              <p className="text-xs mt-1 text-gray-500">{card.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}