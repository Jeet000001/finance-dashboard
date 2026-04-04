import { AppProvider, useApp } from "./context/AppContext";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";

function AppContent() {
  const { state, dispatch } = useApp();
  const { activeTab } = state;

  return (
    <div className="min-h-screen bg-[#0f0e17]">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 py-4 bg-[rgba(15,14,23,0.9)] backdrop-blur-md border-b border-[#2d2a45]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-600 to-cyan-500">
            <span className="text-xs font-bold text-white">F</span>
          </div>
          <span className="font-display font-bold text-white">FinFlow</span>
        </div>

        <div className="flex rounded-lg overflow-hidden border border-[#2d2a45]">
          {["viewer", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => dispatch({ type: "SET_ROLE", payload: r })}
              className={`px-3 py-1.5 text-xs font-medium capitalize transition-all
                ${
                  state.role === r
                    ? r === "admin"
                      ? "bg-purple-500/30 text-purple-300"
                      : "bg-cyan-500/15 text-cyan-400"
                    : "bg-transparent text-[#4a4760]"
                }`}
            >
              {r}
            </button>
          ))}
        </div>
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