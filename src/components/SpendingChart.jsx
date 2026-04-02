import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/mockData";

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="600">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0];
    return (
      <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "#221f35", border: "1px solid #2d2a45" }}>
        <p className="font-bold" style={{ color: "#e8e6f0" }}>{d.name}</p>
        <p style={{ color: "#7a7890" }}>₹{d.value.toLocaleString("en-IN")}</p>
      </div>
    );
  }
  return null;
};

export default function SpendingChart() {
  const { state } = useApp();
  const expenses = state.transactions.filter(t => t.type === "expense");

  const categoryTotals = {};
  expenses.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const data = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value, color: CATEGORIES[name]?.color || "#888" }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);

  return (
    <div className="rounded-2xl p-5 anim-fade-up delay-5" style={{ background: "#1a1828", border: "1px solid #2d2a45" }}>
      <div className="mb-4">
        <h3 className="font-display font-semibold text-white">Spending Breakdown</h3>
        <p className="text-xs mt-0.5" style={{ color: "#4a4760" }}>By category</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-1.5 mt-2">
        {data.map(d => (
          <div key={d.name} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span style={{ color: "#7a7890" }}>{CATEGORIES[d.name]?.icon} {d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
