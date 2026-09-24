import {
  ArrowRight,
  CalendarDays,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const StaffQuickActions = () => {
  const navigate = useNavigate();

  return (
    <section
      className="
        rounded-[22px]
        border
        border-white/60
        bg-white/68
        p-5
        shadow-[0_14px_32px_rgba(44,78,75,0.11)]
        backdrop-blur-xl

        dark:border-[#29413f]
        dark:bg-[#172827]/85
      "
    >
      <div>
        <p
          className="
            text-[9px]
            font-extrabold
            uppercase
            tracking-[0.14em]
            text-[#18a999]
          "
        >
          Quick Actions
        </p>

        <h3
          className="
            mt-1
            text-[17px]
            font-black
            text-[#263d3c]
            dark:text-white
          "
        >
          Clinic Operations
        </h3>

        <p className="mt-1 text-[10px] text-[#78908e]">
          Access common staff tasks.
        </p>
      </div>

      <div className="mt-4 space-y-3">
        <QuickAction
          icon={<UserPlus size={17} />}
          title="Register Patient"
          description="Create a new patient record"
          onClick={() => navigate("/staff/patients")}
        />
        <QuickAction
          icon={<CalendarDays size={17} />}
          title="Create Appointment"
          description="Schedule a consultation"
          onClick={() => navigate("/staff/appointments")}
        />
        <QuickAction
          icon={<UsersRound size={17} />}
          title="Manage Queue"
          description="View walk-ins and scheduled patients"
          onClick={() => navigate("/staff/queue")}
        />
      </div>
    </section>
  );
};

const QuickAction = ({ icon, title, description, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="
      flex
      w-full
      items-center
      gap-3
      rounded-[16px]
      bg-[#edf7f4]
      px-4
      py-3
      text-left
      transition

      hover:bg-[#dff3ee]

      dark:bg-[#203331]
      dark:hover:bg-[#25403d]
    "
  >
    <div
      className="
        grid
        h-9
        w-9
        shrink-0
        place-items-center
        rounded-[13px]
        bg-white/70
        text-[#18a999]

        dark:bg-[#17413e]
        dark:text-[#65d7cb]
      "
    >
      {icon}
    </div>

    <div className="min-w-0 flex-1">
      <p
        className="
          text-[11px]
          font-extrabold
          text-[#38514f]

          dark:text-[#dce8e6]
        "
      >
        {title}
      </p>

      <p className="mt-1 truncate text-[9px] text-[#829b99]">
        {description}
      </p>
    </div>

    <ArrowRight size={14} className="shrink-0 text-[#78908e]" />
  </button>
);

export default StaffQuickActions;
