import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { monthlyData } from "../data/mockData";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl px-4 py-3 text-sm" style={{ background: "#221f35", border: "1px solid #2d2a45" }}>
        <p className="font-bold mb-2" style={{ color: "#e8e6f0" }}>{label} 2025</p>
        {payload.map(p => (
          <div key={p.dataKey} className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span style={{ color: "#7a7890" }}>{p.name}:</span>
            <span className="font-medium" style={{ color: "#e8e6f0" }}>₹{p.value.toLocaleString("en-IN")}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function BalanceChart() {
  return (
    <div className="rounded-2xl p-5 anim-fade-up delay-4" style={{ background: "#1a1828", border: "1px solid #2d2a45" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-semibold text-white">Balance Trend</h3>
          <p className="text-xs mt-0.5" style={{ color: "#4a4760" }}>6 months overview</p>
        </div>
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1.5" style={{ color: "#22c55e" }}>
            <span className="w-3 h-0.5 inline-block rounded" style={{ background: "#22c55e" }} /> Income
          </span>
          <span className="flex items-center gap-1.5" style={{ color: "#ef4444" }}>
            <span className="w-3 h-0.5 inline-block rounded" style={{ background: "#ef4444" }} /> Expenses
          </span>
          <span className="flex items-center gap-1.5" style={{ color: "#8b5cf6" }}>
            <span className="w-3 h-0.5 inline-block rounded" style={{ background: "#8b5cf6" }} /> Balance
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d2a45" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#4a4760", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#4a4760", fontSize: 11 }} axisLine={false} tickLine={false}
            tickFormatter={v => "₹" + (v / 1000) + "k"} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="income" name="Income" stroke="#22c55e" strokeWidth={2} fill="url(#colorIncome)" dot={false} />
          <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} fill="url(#colorExpenses)" dot={false} />
          <Area type="monotone" dataKey="balance" name="Balance" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#colorBalance)" dot={{ fill: "#8b5cf6", r: 3 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
