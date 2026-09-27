import ReportsChart from "../../reports/ReportsChart";
import AdminQuickActions from "../components/AdminQuickActions";
import AdminRecentActivity from "../components/AdminRecentActivity";
import AdminStats from "../components/AdminStats";

const DashboardHome = () => (
  <div className="space-y-5">
    <AdminStats />
    <AdminQuickActions />

    <div className="grid gap-5 xl:grid-cols-[1.35fr_0.82fr]">
      <section
        className="
          rounded-[22px]
          border
          border-white/60
          bg-white/68
          p-5
          shadow-[0_14px_32px_rgba(44,78,75,0.11)]

          dark:border-[#29413f]
          dark:bg-[#172827]/85
        "
      >
        <ReportsChart />
      </section>

      <AdminRecentActivity />
    </div>
  </div>
);

export default DashboardHome;
