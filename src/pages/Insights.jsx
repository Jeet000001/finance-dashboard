import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useApp } from "../context/AppContext";
import { CATEGORIES, monthlyData } from "../data/mockData";
import {
  TrendingUp,
  TrendingDown,
  Award,
  AlertCircle,
  Zap,
  Target,
} from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl px-4 py-3 text-sm bg-[#221f35] border border-[#2d2a45]">
        <p className="font-bold mb-1 text-[#e8e6f0]">{label}</p>

        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: p.color }}
            />
            <span className="text-[#7a7890]">{p.name}:</span>
            <span className="font-medium text-[#e8e6f0]">
              ₹{p.value.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Insights() {
  const { state } = useApp();
  const txns = state.transactions;

  const catTotals = {};
  txns
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
    });

  const sortedCats = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCats[0];
  const lowestCategory = sortedCats[sortedCats.length - 1];

  const totalIncome = txns
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const totalExpense = txns
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const savingsRate =
    totalIncome > 0
      ? (((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)
      : 0;

  const lastTwo = monthlyData.slice(-2);
  const expenseDiff = lastTwo[1].expenses - lastTwo[0].expenses;
  const expensePct = (
    (Math.abs(expenseDiff) / lastTwo[0].expenses) *
    100
  ).toFixed(1);

  const incomeDiff = lastTwo[1].income - lastTwo[0].income;

  const insights = [
    {
      icon: Award,
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
      title: "Highest Spending",
      desc: topCategory
        ? `${CATEGORIES[topCategory[0]]?.icon} ${topCategory[0]} accounts for ₹${topCategory[1].toLocaleString(
            "en-IN",
          )} of your expenses`
        : "No data",
    },
    {
      icon: expenseDiff > 0 ? TrendingUp : TrendingDown,
      color: expenseDiff > 0 ? "#ef4444" : "#22c55e",
      bg: expenseDiff > 0 ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)",
      title: "Monthly Comparison",
      desc: `Expenses ${
        expenseDiff > 0 ? "increased" : "decreased"
      } by ${expensePct}% compared to last month`,
    },
    {
      icon: Target,
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.1)",
      title: "Savings Rate",
      desc: `You're saving ${savingsRate}% of your income`,
    },
    {
      icon: Zap,
      color: "#06b6d4",
      bg: "rgba(6,182,212,0.1)",
      title: "Income Growth",
      desc: `Income ${
        incomeDiff >= 0 ? "grew" : "fell"
      } by ₹${Math.abs(incomeDiff).toLocaleString("en-IN")}`,
    },
    {
      icon: AlertCircle,
      color: "#f97316",
      bg: "rgba(249,115,22,0.1)",
      title: "Lowest Expense Category",
      desc: lowestCategory
        ? `${CATEGORIES[lowestCategory[0]]?.icon} ${lowestCategory[0]}`
        : "No data",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="anim-fade-up">
        <h1 className="font-display font-bold text-white text-2xl">Insights</h1>
        <p className="text-sm mt-1 text-[#4a4760]">
          Smart analysis of your financial patterns
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((ins, i) => {
          const Icon = ins.icon;

          return (
            <div
              key={i}
              className={`rounded-2xl p-5 anim-fade-up delay-${i + 1} bg-[#1a1828] border border-[#2d2a45]`}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: ins.bg }}
                >
                  <Icon size={16} color={ins.color} />
                </div>

                <div>
                  <p className="font-semibold text-sm text-[#e8e6f0]">
                    {ins.title}
                  </p>
                  <p className="text-xs mt-1.5 leading-relaxed text-[#7a7890]">
                    {ins.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl p-5 anim-fade-up delay-3 bg-[#1a1828] border border-[#2d2a45]">
        <h3 className="font-display font-semibold text-white mb-1">
          Monthly Income vs Expenses
        </h3>

        <p className="text-xs mb-5 text-[#4a4760]">Side-by-side comparison</p>

        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#2d2a45"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{ fill: "#4a4760", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: "#4a4760", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => "₹" + v / 1000 + "k"}
            />

            <Tooltip content={<CustomTooltip />} />

            <Bar
              dataKey="income"
              name="Income"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
              fillOpacity={0.85}
            />

            <Bar
              dataKey="expenses"
              name="Expenses"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              fillOpacity={0.85}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-2xl p-5 anim-fade-up delay-4 bg-[#1a1828] border border-[#2d2a45]">
        <h3 className="font-display font-semibold text-white mb-1">
          Expense by Category
        </h3>

        <p className="text-xs mb-5 text-[#4a4760]">Total spend per category</p>

        <div className="space-y-3">
          {sortedCats.map(([name, value]) => {
            const pct = ((value / totalExpense) * 100).toFixed(1);
            const cat = CATEGORIES[name];

            return (
              <div key={name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm flex items-center gap-2 text-[#e8e6f0]">
                    {cat?.icon} {name}
                  </span>

                  <span className="text-xs font-mono text-[#7a7890]">
                    ₹{value.toLocaleString("en-IN")} · {pct}%
                  </span>
                </div>

                <div className="h-2 rounded-full overflow-hidden bg-[#12111e]">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: cat?.color || "#888",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
