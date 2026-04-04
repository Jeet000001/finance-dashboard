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
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden bg-[#0d0c15] border-t border-[#2d2a45] pb-[env(safe-area-inset-bottom)]">
      {tabs.map(({ id, label, icon: Icon }) => {
        const active = activeTab === id;

        return (
          <button
            key={id}
            onClick={() => dispatch({ type: "SET_TAB", payload: id })}
            className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs transition-all duration-200 ${
              active ? "text-violet-400 scale-105" : "text-[#4a4760]"
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
