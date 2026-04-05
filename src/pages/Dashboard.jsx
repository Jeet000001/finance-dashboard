import SummaryCards from "../components/SummaryCards";
import BalanceChart from "../components/BalanceChart";
import SpendingChart from "../components/SpendingChart";
import RecentTransactions from "../components/RecentTransactions";
import { useApp } from "../context/AppContext";

export default function Dashboard() {
  const { state } = useApp();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      <div className="anim-fade-up">
        <h1 className="font-display font-bold text-white text-2xl">
          {greeting} 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: "#4a4760" }}>
          Here's your financial overview ·{" "}
          {state.role === "admin" ? "Admin Access" : "Viewer Mode"}
        </p>
      </div>
      <SummaryCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <BalanceChart />
        </div>
        <SpendingChart />
      </div>
      <RecentTransactions />
    </div>
  );
}
