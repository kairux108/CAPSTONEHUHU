import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  UserPlus,
  UsersRound,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import ReportsChart from "./ReportsChart";

const StaffDashboard = () => {
  const navigate = useNavigate();

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

  return (
    <div className="space-y-5">
      {/* TOP SUMMARY */}

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

      {/* MAIN CONTENT */}

      <div className="grid gap-5 xl:grid-cols-[0.82fr_1.35fr]">
        {/* LEFT */}

        <div className="space-y-5">
          {/* QUICK ACTIONS */}

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

              <p
                className="
                  mt-1
                  text-[10px]
                  text-[#78908e]
                "
              >
                Access common staff tasks.
              </p>
            </div>

            <div className="mt-4 space-y-3">
              <QuickAction
                icon={<UserPlus size={17} />}
                title="Register Patient"
                description="Create a new patient record"
                onClick={() =>
                  navigate("/staff-dashboard/patients")
                }
              />

              <QuickAction
                icon={<CalendarDays size={17} />}
                title="Create Appointment"
                description="Schedule a consultation"
                onClick={() =>
                  navigate("/staff-dashboard/appointments")
                }
              />

              <QuickAction
                icon={<UsersRound size={17} />}
                title="Manage Queue"
                description="View walk-ins and scheduled patients"
                onClick={() =>
                  navigate("/staff-dashboard/queue")
                }
              />
            </div>
          </section>

          {/* QUEUE OVERVIEW */}

          <section
            className="
              rounded-[22px]
              bg-gradient-to-br
              from-[#18a999]
              to-[#117f76]
              p-5
              text-white
              shadow-[0_16px_32px_rgba(24,169,153,0.24)]
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p
                  className="
                    text-[9px]
                    font-extrabold
                    uppercase
                    tracking-[0.15em]
                    text-white/65
                  "
                >
                  Queue Overview
                </p>

                <p
                  className="
                    mt-2
                    text-[34px]
                    font-black
                    leading-none
                  "
                >
                  7
                </p>

                <p
                  className="
                    mt-3
                    text-[12px]
                    font-bold
                  "
                >
                  Patients Waiting
                </p>

                <p
                  className="
                    mt-1
                    text-[10px]
                    text-white/70
                  "
                >
                  4 appointments • 3 walk-ins
                </p>
              </div>

              <div
                className="
                  grid
                  h-11
                  w-11
                  place-items-center
                  rounded-full
                  bg-white/15
                "
              >
                <UsersRound size={19} />
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/staff-dashboard/queue")
              }
              className="
                mt-5
                flex
                items-center
                gap-2
                rounded-full
                bg-white
                px-4
                py-2
                text-[10px]
                font-bold
                text-[#117f76]
              "
            >
              Open Queue
              <ArrowRight size={12} />
            </button>
          </section>
        </div>

        {/* RIGHT */}

        <div className="space-y-5">
          {/* ACTIVITY GRAPH */}

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

          {/* RECENT ACTIVITY */}

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
                <p
                  className="
                    text-[9px]
                    font-extrabold
                    uppercase
                    tracking-[0.14em]
                    text-[#18a999]
                  "
                >
                  Recent Activity
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
                  Today
                </h3>
              </div>

              <span
                className="
                  text-[9px]
                  font-bold
                  text-[#8aa09e]
                "
              >
                Live updates
              </span>
            </div>

            <div
              className="
                divide-y
                divide-white/50

                dark:divide-[#29413f]
              "
            >
              {recentActivities.map(
                (activity) => (
                  <div
                    key={
                      activity.id
                    }
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      px-5
                      py-3.5
                      transition

                      hover:bg-[#edf7f4]/50

                      dark:hover:bg-[#203331]
                    "
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className="
                          grid
                          h-9
                          w-9
                          shrink-0
                          place-items-center
                          rounded-[13px]
                          bg-[#dff3ee]
                          text-[#18a999]

                          dark:bg-[#17413e]
                          dark:text-[#65d7cb]
                        "
                      >
                        <CheckCircle2 size={15} />
                      </div>

                      <div className="min-w-0">
                        <p
                          className="
                            truncate
                            text-[11px]
                            font-extrabold
                            text-[#38514f]

                            dark:text-[#dce8e6]
                          "
                        >
                          {activity.title}
                        </p>

                        <p
                          className="
                            mt-1
                            truncate
                            text-[9px]
                            text-[#829b99]
                          "
                        >
                          {activity.detail}
                        </p>
                      </div>
                    </div>

                    <span
                      className="
                        shrink-0
                        text-[9px]
                        font-bold
                        text-[#829b99]
                      "
                    >
                      {activity.time}
                    </span>
                  </div>
                )
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({
  icon,
  value,
  title,
  detail,
}) => (
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

const QuickAction = ({
  icon,
  title,
  description,
  onClick,
}) => (
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

      <p
        className="
          mt-1
          truncate
          text-[9px]
          text-[#829b99]
        "
      >
        {description}
      </p>
    </div>

    <ArrowRight
      size={14}
      className="
        shrink-0
        text-[#78908e]
      "
    />
  </button>
);

export default StaffDashboard;