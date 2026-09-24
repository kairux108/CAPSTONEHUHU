import { CheckCircle2 } from "lucide-react";

const recentActivities = [
  {
    id: 1,
    title: "New patient registered",
    detail: "Maria Santos",
    time: "8:15 AM",
  },
  {
    id: 2,
    title: "Appointment confirmed",
    detail: "John Dela Cruz",
    time: "8:40 AM",
  },
  {
    id: 3,
    title: "Walk-in added to queue",
    detail: "Angela Reyes",
    time: "9:05 AM",
  },
  {
    id: 4,
    title: "Consultation completed",
    detail: "Paolo Villanueva",
    time: "9:30 AM",
  },
];

const StaffRecentActivity = () => (
  <section
    className="
      overflow-hidden
      rounded-[22px]
      border
      border-white/60
      bg-white/68
      shadow-[0_14px_32px_rgba(44,78,75,0.11)]

      dark:border-[#29413f]
      dark:bg-[#172827]/85
    "
  >
    <div
      className="
        flex
        items-center
        justify-between
        border-b
        border-white/60
        px-5
        py-4

        dark:border-[#29413f]
      "
    >
      <div>
        <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#18a999]">
          Recent Activity
        </p>
        <h3 className="mt-1 text-[17px] font-black text-[#263d3c] dark:text-white">
          Today
        </h3>
      </div>
      <span className="text-[9px] font-bold text-[#8aa09e]">Live updates</span>
    </div>

    <div className="divide-y divide-white/50 dark:divide-[#29413f]">
      {recentActivities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center justify-between gap-4 px-5 py-3.5 transition hover:bg-[#edf7f4]/50 dark:hover:bg-[#203331]"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-[13px] bg-[#dff3ee] text-[#18a999] dark:bg-[#17413e] dark:text-[#65d7cb]">
              <CheckCircle2 size={15} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-extrabold text-[#38514f] dark:text-[#dce8e6]">
                {activity.title}
              </p>
              <p className="mt-1 truncate text-[9px] text-[#829b99]">
                {activity.detail}
              </p>
            </div>
          </div>
          <span className="shrink-0 text-[9px] font-bold text-[#829b99]">
            {activity.time}
          </span>
        </div>
      ))}
    </div>
  </section>
);

export default StaffRecentActivity;
