import { LayoutDashboard, ArrowLeftRight, Lightbulb, ShieldCheck, Shield, Sun, Moon, TrendingUp } from "lucide-react";
import { useApp } from "../context/AppContext";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { id: "insights", label: "Insights", icon: Lightbulb },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const { activeTab, role, darkMode } = state;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col z-40" style={{ background: "#0d0c15", borderRight: "1px solid #2d2a45" }}>
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}>
          <TrendingUp size={18} color="#fff" />
        </div>
        <div>
          <p className="font-display font-bold text-white text-lg leading-none">FinFlow</p>
          <p className="text-xs mt-0.5" style={{ color: "#6b6888" }}>Finance Dashboard</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => dispatch({ type: "SET_TAB", payload: id })}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: active ? "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.1))" : "transparent",
                color: active ? "#a78bfa" : "#7a7890",
                border: active ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent",
              }}
            >
              <Icon size={18} />
              {label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#7c3aed" }} />}
            </button>
          );
        })}
      </nav>

      {/* Role Switcher */}
      <div className="px-4 py-4" style={{ borderTop: "1px solid #2d2a45" }}>
        <p className="text-xs mb-2 px-1" style={{ color: "#4a4760" }}>ROLE</p>
        <div className="flex rounded-xl overflow-hidden" style={{ border: "1px solid #2d2a45" }}>
          {["viewer", "admin"].map(r => (
            <button
              key={r}
              onClick={() => dispatch({ type: "SET_ROLE", payload: r })}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all capitalize"
              style={{
                background: role === r ? (r === "admin" ? "rgba(124,58,237,0.3)" : "rgba(6,182,212,0.15)") : "transparent",
                color: role === r ? (r === "admin" ? "#a78bfa" : "#06b6d4") : "#4a4760",
              }}
            >
              {r === "admin" ? <ShieldCheck size={13} /> : <Shield size={13} />}
              {r}
            </button>
          ))}
        </div>
        <p className="text-xs mt-2 px-1" style={{ color: "#4a4760" }}>
          {role === "admin" ? "✏️ Can add & edit" : "👁️ View only mode"}
        </p>
      </div>

      {/* Dark mode toggle */}
      <div className="px-4 pb-5">
        <button
          onClick={() => dispatch({ type: "TOGGLE_DARK" })}
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs transition-all"
          style={{ background: "#1a1828", color: "#7a7890", border: "1px solid #2d2a45" }}
        >
          {darkMode ? <Sun size={13} /> : <Moon size={13} />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </aside>
  );
}
