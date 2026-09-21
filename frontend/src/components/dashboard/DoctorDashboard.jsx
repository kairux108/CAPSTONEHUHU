import {
  Activity,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Stethoscope,
  UsersRound,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const appointments = [
    {
      id: 1,
      patient: "Maria Santos",
      time: "09:00 AM",
      reason: "General Consultation",
      status: "Waiting",
    },
    {
      id: 2,
      patient: "John Dela Cruz",
      time: "10:30 AM",
      reason: "Follow-up Checkup",
      status: "Scheduled",
    },
    {
      id: 3,
      patient: "Angela Reyes",
      time: "11:15 AM",
      reason: "Headache and dizziness",
      status: "Scheduled",
    },
    {
      id: 4,
      patient: "Paolo Villanueva",
      time: "01:00 PM",
      reason: "Medication Review",
      status: "Scheduled",
    },
  ];

  return (
    <div className="space-y-5">

      {/* SUMMARY STRIP */}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={<CalendarDays size={18} />}
          value="12"
          title="Appointments"
          detail="4 remaining today"
        />

        <SummaryCard
          icon={<UsersRound size={18} />}
          value="6"
          title="Waiting"
          detail="2 appointments • 4 walk-ins"
        />

        <SummaryCard
          icon={<CheckCircle2 size={18} />}
          value="8"
          title="Completed"
          detail="67% of today's schedule"
        />

        <SummaryCard
          icon={<Clock3 size={18} />}
          value="18m"
          title="Avg. Consultation"
          detail="2 min faster than yesterday"
        />
      </div>

      {/* MAIN CONTENT */}

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.8fr]">

        {/* LEFT */}

        <div className="space-y-5">

          {/* NEXT PATIENT */}

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
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="
                    grid
                    h-12
                    w-12
                    place-items-center
                    rounded-[16px]
                    bg-[#dff3ee]
                    text-[#18a999]

                    dark:bg-[#17413e]
                    dark:text-[#65d7cb]
                  "
                >
                  <Stethoscope size={20} />
                </div>

                <div>
                  <p
                    className="
                      text-[9px]
                      font-extrabold
                      uppercase
                      tracking-[0.15em]
                      text-[#18a999]
                    "
                  >
                    Next Consultation
                  </p>

                  <h3
                    className="
                      mt-1
                      text-[19px]
                      font-black
                      text-[#263d3c]
                      dark:text-white
                    "
                  >
                    Maria Santos
                  </h3>

                  <p
                    className="
                      mt-1
                      text-[11px]
                      text-[#78908e]
                    "
                  >
                    CURA-0001 • General Consultation
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <InfoChip
                  label="Queue"
                  value="A-005"
                />

                <InfoChip
                  label="Time"
                  value="09:00 AM"
                />
              </div>
            </div>

            <div
              className="
                mt-5
                flex
                flex-col
                gap-3
                rounded-[17px]
                bg-[#edf7f4]
                p-4

                dark:bg-[#203331]

                md:flex-row
                md:items-center
                md:justify-between
              "
            >
              <div>
                <p
                  className="
                    text-[10px]
                    font-bold
                    text-[#78908e]
                  "
                >
                  Submitted symptoms
                </p>

                <p
                  className="
                    mt-1
                    text-[12px]
                    font-bold
                    text-[#38514f]
                    dark:text-[#dce8e6]
                  "
                >
                  Headache • Dizziness • Light sensitivity
                </p>
              </div>

              <button
                onClick={() => navigate("/consultation")}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-[12px]
                  bg-[#18a999]
                  px-4
                  py-2.5
                  text-[11px]
                  font-bold
                  text-white
                  transition

                  hover:bg-[#138f83]
                "
              >
                Start Consultation
                <ArrowRight size={13} />
              </button>
            </div>
          </section>

          {/* APPOINTMENTS */}

          <section
            className="
              overflow-hidden
              rounded-[22px]
              border
              border-white/60
              bg-white/68
              shadow-[0_14px_32px_rgba(44,78,75,0.11)]
              backdrop-blur-xl

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
                  Today's Schedule
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
                  Upcoming Appointments
                </h3>
              </div>

              <button
                onClick={() => navigate("/appointments")}
                className="
                  text-[10px]
                  font-bold
                  text-[#18a999]
                "
              >
                View all
              </button>
            </div>

            <div>
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="
                    grid
                    gap-3
                    border-b
                    border-white/50
                    px-5
                    py-3.5

                    last:border-b-0

                    dark:border-[#29413f]

                    md:grid-cols-[1.3fr_0.6fr_1.2fr_0.7fr]
                    md:items-center
                  "
                >
                  <div>
                    <p
                      className="
                        text-[12px]
                        font-extrabold
                        text-[#38514f]
                        dark:text-[#dce8e6]
                      "
                    >
                      {appointment.patient}
                    </p>
                  </div>

                  <p className="text-[11px] font-bold text-[#78908e]">
                    {appointment.time}
                  </p>

                  <p className="text-[11px] text-[#78908e]">
                    {appointment.reason}
                  </p>

                  <StatusBadge status={appointment.status} />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT */}

        <div className="space-y-5">

          {/* TODAY PROGRESS */}

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
            <div className="flex items-center justify-between">
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
                  Today's Progress
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
                  Clinic Activity
                </h3>
              </div>

              <Activity
                size={18}
                className="text-[#18a999]"
              />
            </div>

            <div className="mt-5 space-y-5">
              <ProgressItem
                label="Consultations Completed"
                value="8 / 12"
                percent={67}
              />

              <ProgressItem
                label="Queue Processed"
                value="11 / 17"
                percent={65}
              />

              <ProgressItem
                label="Prescriptions Issued"
                value="7"
                percent={58}
              />
            </div>
          </section>

          {/* MINI METRICS */}

          <div className="grid grid-cols-2 gap-3">
            <MiniMetric
              icon={<FileText size={17} />}
              value="7"
              title="Prescriptions"
              subtitle="Today"
            />

            <MiniMetric
              icon={<Clock3 size={17} />}
              value="2"
              title="Follow-ups"
              subtitle="Pending"
            />

            <MiniMetric
              icon={<UsersRound size={17} />}
              value="4"
              title="Walk-ins"
              subtitle="Today"
            />

            <MiniMetric
              icon={<Stethoscope size={17} />}
              value="3"
              title="AI Assisted"
              subtitle="Consultations"
            />
          </div>

          {/* QUEUE CARD */}

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
                  Now Serving
                </p>

                <p
                  className="
                    mt-2
                    text-[34px]
                    font-black
                    leading-none
                  "
                >
                  A-005
                </p>

                <p className="mt-3 text-[13px] font-bold">
                  Maria Santos
                </p>

                <p className="mt-1 text-[10px] text-white/70">
                  General Consultation
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
              onClick={() => navigate("/queue")}
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
              Manage Queue
              <ArrowRight size={12} />
            </button>
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
      rounded-[20px]
      border
      border-white/60
      bg-white/68
      px-4
      py-4
      shadow-[0_10px_24px_rgba(44,78,75,0.10)]
      backdrop-blur-xl
      transition

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

      <div className="min-w-0">
        <div className="flex items-end gap-2">
          <p
            className="
              text-[26px]
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
              pb-[2px]
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
            font-medium
            text-[#8aa09e]
          "
        >
          {detail}
        </p>
      </div>
    </div>
  </article>
);

const MiniMetric = ({
  icon,
  value,
  title,
  subtitle,
}) => (
  <article
    className="
      rounded-[18px]
      border
      border-white/60
      bg-white/65
      p-4
      shadow-[0_9px_20px_rgba(44,78,75,0.08)]

      dark:border-[#29413f]
      dark:bg-[#172827]/85
    "
  >
    <div className="flex items-center justify-between">
      <div
        className="
          grid
          h-9
          w-9
          place-items-center
          rounded-[13px]
          bg-[#dff3ee]
          text-[#18a999]

          dark:bg-[#17413e]
          dark:text-[#65d7cb]
        "
      >
        {icon}
      </div>

      <span
        className="
          text-[22px]
          font-black
          text-[#263d3c]
          dark:text-white
        "
      >
        {value}
      </span>
    </div>

    <p
      className="
        mt-3
        text-[10px]
        font-extrabold
        text-[#38514f]
        dark:text-[#dce8e6]
      "
    >
      {title}
    </p>

    <p className="mt-1 text-[9px] text-[#829b99]">
      {subtitle}
    </p>
  </article>
);

const InfoChip = ({
  label,
  value,
}) => (
  <div
    className="
      min-w-[82px]
      rounded-[13px]
      bg-[#edf7f4]
      px-3
      py-2

      dark:bg-[#203331]
    "
  >
    <p
      className="
        text-[8px]
        font-extrabold
        uppercase
        text-[#8aa09e]
      "
    >
      {label}
    </p>

    <p
      className="
        mt-1
        text-[11px]
        font-black
        text-[#38514f]
        dark:text-[#dce8e6]
      "
    >
      {value}
    </p>
  </div>
);

const ProgressItem = ({
  label,
  value,
  percent,
}) => (
  <div>
    <div className="flex items-center justify-between">
      <p
        className="
          text-[10px]
          font-bold
          text-[#607b79]
          dark:text-[#91aaa7]
        "
      >
        {label}
      </p>

      <p
        className="
          text-[10px]
          font-black
          text-[#38514f]
          dark:text-white
        "
      >
        {value}
      </p>
    </div>

    <div
      className="
        mt-2
        h-[7px]
        overflow-hidden
        rounded-full
        bg-[#dcece8]

        dark:bg-[#29413f]
      "
    >
      <div
        className="
          h-full
          rounded-full
          bg-gradient-to-r
          from-[#18a999]
          to-[#117f76]
        "
        style={{
          width: `${percent}%`,
        }}
      />
    </div>
  </div>
);

const StatusBadge = ({
  status,
}) => (
  <span
    className={`
      inline-flex
      w-fit
      rounded-full
      px-3
      py-1
      text-[9px]
      font-bold

      ${
        status === "Waiting"
          ? `
            bg-[#fff1d9]
            text-[#b7791f]

            dark:bg-[#47361b]
            dark:text-[#f2c56c]
          `
          : `
            bg-[#dff3ee]
            text-[#117f76]

            dark:bg-[#17413e]
            dark:text-[#65d7cb]
          `
      }
    `}
  >
    {status}
  </span>
);

export default DoctorDashboard;