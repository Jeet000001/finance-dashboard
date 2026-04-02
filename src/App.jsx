import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";

function AppContent() {
  const { state } = useApp();
  const { activeTab } = state;

  return (
    <div className="min-h-screen" style={{ background: "#0f0e17" }}>
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-4"
        style={{ background: "rgba(15,14,23,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid #2d2a45" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}>
            <span className="text-xs font-bold text-white">F</span>
          </div>
          <span className="font-display font-bold text-white">FinFlow</span>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-lg font-medium"
          style={{
            background: state.role === "admin" ? "rgba(124,58,237,0.15)" : "rgba(6,182,212,0.1)",
            color: state.role === "admin" ? "#a78bfa" : "#06b6d4",
            border: `1px solid ${state.role === "admin" ? "rgba(124,58,237,0.3)" : "rgba(6,182,212,0.2)"}`,
          }}>
          {state.role}
        </span>
      </div>

      <main className="md:ml-64 px-4 md:px-8 pt-20 md:pt-6 pb-24 md:pb-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "transactions" && <Transactions />}
          {activeTab === "insights" && <Insights />}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
