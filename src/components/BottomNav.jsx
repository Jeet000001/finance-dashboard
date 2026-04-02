import { LayoutDashboard, ArrowLeftRight, Lightbulb } from "lucide-react";
import { useApp } from "../context/AppContext";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { id: "insights", label: "Insights", icon: Lightbulb },
];

export default function BottomNav() {
  const { state, dispatch } = useApp();
  const { activeTab } = state;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden"
      style={{ background: "#0d0c15", borderTop: "1px solid #2d2a45", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {tabs.map(({ id, label, icon: Icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => dispatch({ type: "SET_TAB", payload: id })}
            className="flex-1 flex flex-col items-center py-3 gap-1 text-xs transition-all"
            style={{ color: active ? "#a78bfa" : "#4a4760" }}
          >
            <Icon size={20} />
            <span className="text-xs">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
