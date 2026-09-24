import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  UsersRound,
} from "lucide-react";

const StaffStats = () => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    <SummaryCard
      icon={<UsersRound size={18} />}
      value="126"
      title="Patients"
      detail="Total registered"
    />
    <SummaryCard
      icon={<CalendarDays size={18} />}
      value="18"
      title="Appointments"
      detail="Scheduled today"
    />
    <SummaryCard
      icon={<Clock3 size={18} />}
      value="7"
      title="Waiting"
      detail="Current queue"
    />
    <SummaryCard
      icon={<CheckCircle2 size={18} />}
      value="11"
      title="Completed"
      detail="Finished today"
    />
  </div>
);

const SummaryCard = ({ icon, value, title, detail }) => (
  <article
    className="
      rounded-[19px]
      border
      border-white/60
      bg-white/68
      px-4
      py-4
      shadow-[0_10px_24px_rgba(44,78,75,0.10)]
      backdrop-blur-xl
      transition-all
      duration-200

      hover:-translate-y-[1px]
      hover:shadow-[0_14px_28px_rgba(44,78,75,0.14)]

      dark:border-[#29413f]
      dark:bg-[#172827]/85
    "
  >
    <div className="flex items-center gap-3">
      <div
        className="
          grid
          h-10
          w-10
          shrink-0
          place-items-center
          rounded-[14px]
          bg-[#dff3ee]
          text-[#18a999]

          dark:bg-[#17413e]
          dark:text-[#65d7cb]
        "
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-end justify-between gap-2">
          <p
            className="
              text-[24px]
              font-black
              leading-none
              text-[#263d3c]

              dark:text-white
            "
          >
            {value}
          </p>

          <p
            className="
              truncate
              text-[11px]
              font-bold
              text-[#607b79]

              dark:text-[#91aaa7]
            "
          >
            {title}
          </p>
        </div>

        <p
          className="
            mt-2
            truncate
            text-[9px]
            text-[#8aa09e]
          "
        >
          {detail}
        </p>
      </div>
    </div>
  </article>
);

export default StaffStats;
