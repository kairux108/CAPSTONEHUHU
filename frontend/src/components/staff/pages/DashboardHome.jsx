import ReportsChart from "../../reports/ReportsChart";
import StaffQueueOverview from "../components/StaffQueueOverview";
import StaffQuickActions from "../components/StaffQuickActions";
import StaffRecentActivity from "../components/StaffRecentActivity";
import StaffStats from "../components/StaffStats";

const DashboardHome = () => (
  <div className="space-y-5">
    <StaffStats />

    <div className="grid gap-5 xl:grid-cols-[0.82fr_1.35fr]">
      <div className="space-y-5">
        <StaffQuickActions />
        <StaffQueueOverview />
      </div>

      <div className="space-y-5">
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

        <StaffRecentActivity />
      </div>
    </div>
  </div>
);

export default DashboardHome;
