
import { useNavigate } from "react-router-dom";

import {
  ArrowUp,
  MoreVertical,
  Stethoscope,
  Users,
  Pill,
  ClipboardPlus,
} from "lucide-react";

import AdminHeader from "../components/AdminHeader";
import AdminQuickActions from "../components/AdminQuickActions";
import AdminRecentActivity from "../components/AdminRecentActivity";
import AdminStats from "../components/AdminStats";

const DashboardHome = () => {
  const navigate = useNavigate();

  // =====================================================
  // AUTHENTICATION TEST
  // =====================================================



  // =====================================================
  // DUMMY DATA
  // =====================================================

  const appointments = [
    {
      time: "08:30 AM",
      patient: "Emma Wilson",
      type: "Consultation",
      status: "In Room",
    },
    {
      time: "09:00 AM",
      patient: "James Lee",
      type: "Follow-up",
      status: "Waiting",
    },
    {
      time: "09:30 AM",
      patient: "Sophia Patel",
      type: "Consultation",
      status: "Scheduled",
    },
    {
      time: "10:00 AM",
      patient: "Michael Roberts",
      type: "Chronic Care",
      status: "Scheduled",
    },
    {
      time: "10:30 AM",
      patient: "Aisha Khan",
      type: "Follow-up",
      status: "Scheduled",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "In Room":
        return "bg-[#dff8e8] text-[#27945b]";

      case "Waiting":
        return "bg-[#fff2cc] text-[#c4881a]";

      default:
        return "bg-[#e3f2ff] text-[#3287c9]";
    }
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-5">
      <AdminHeader />
      <AdminStats />

      {/* =====================================================
          CHARTS
      ====================================================== */}

      <div
        className="
          mb-4
          grid
          grid-cols-1
          gap-4

          xl:grid-cols-[1.55fr_1fr]
        "
      >
        {/* PATIENT VISITS */}

        <section
          className="
            rounded-2xl
            border border-white/60
            bg-white/90
            p-4
            shadow-[0_4px_18px_rgba(30,90,90,0.06)]
            backdrop-blur-sm
          "
        >
          <div
            className="
              mb-3
              flex flex-col
              gap-2

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <h2 className="text-[12px] font-semibold text-[#1e3353]">
              Patient Visits Overview
            </h2>

            <div className="flex items-center gap-4 text-[9px] text-[#718199]">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#18c3a6]" />
                Appointments
              </span>

              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#3b9cff]" />
                Walk-ins
              </span>
            </div>
          </div>

          {/* SVG CHART */}

          <div className="h-[190px] w-full overflow-hidden">
            <svg
              viewBox="0 0 700 230"
              className="h-full w-full"
              preserveAspectRatio="none"
            >
              {/* GRID */}

              {[35, 75, 115, 155, 195].map((y) => (
                <line
                  key={y}
                  x1="30"
                  y1={y}
                  x2="680"
                  y2={y}
                  stroke="#e8eef1"
                  strokeWidth="1"
                />
              ))}

              {/* GREEN AREA */}

              <defs>
                <linearGradient
                  id="visitGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#38d3b4"
                    stopOpacity="0.28"
                  />

                  <stop
                    offset="100%"
                    stopColor="#38d3b4"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>

              <path
                d="
                  M40,148
                  L140,128
                  L240,82
                  L340,90
                  L440,137
                  L540,140
                  L640,168
                  L640,195
                  L40,195
                  Z
                "
                fill="url(#visitGradient)"
              />

              {/* APPOINTMENT LINE */}

              <polyline
                points="
                  40,148
                  140,128
                  240,82
                  340,90
                  440,137
                  540,140
                  640,168
                "
                fill="none"
                stroke="#18bfa2"
                strokeWidth="3"
              />

              {/* WALK-IN LINE */}

              <polyline
                points="
                  40,175
                  140,166
                  240,142
                  340,143
                  440,160
                  540,164
                  640,184
                "
                fill="none"
                stroke="#3297f5"
                strokeWidth="3"
              />

              {/* POINTS */}

              {[
                [40, 148],
                [140, 128],
                [240, 82],
                [340, 90],
                [440, 137],
                [540, 140],
                [640, 168],
              ].map(([x, y]) => (
                <circle
                  key={`a-${x}`}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="white"
                  stroke="#18bfa2"
                  strokeWidth="2"
                />
              ))}

              {[
                [40, 175],
                [140, 166],
                [240, 142],
                [340, 143],
                [440, 160],
                [540, 164],
                [640, 184],
              ].map(([x, y]) => (
                <circle
                  key={`w-${x}`}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="white"
                  stroke="#3297f5"
                  strokeWidth="2"
                />
              ))}

              {/* DAYS */}

              {[
                ["Mon", 40],
                ["Tue", 140],
                ["Wed", 240],
                ["Thu", 340],
                ["Fri", 440],
                ["Sat", 540],
                ["Sun", 640],
              ].map(([day, x]) => (
                <text
                  key={day}
                  x={x}
                  y="217"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#7c899c"
                >
                  {day}
                </text>
              ))}
            </svg>
          </div>
        </section>

        {/* PATIENT DISTRIBUTION */}

        <section
          className="
            rounded-2xl
            border border-white/60
            bg-white/90
            p-4
            shadow-[0_4px_18px_rgba(30,90,90,0.06)]
            backdrop-blur-sm
          "
        >
          <h2 className="mb-5 text-[12px] font-semibold text-[#1e3353]">
            Patient Distribution
          </h2>

          <div
            className="
              flex flex-col
              items-center
              justify-center
              gap-5

              sm:flex-row
            "
          >
            {/* DONUT */}

            <div
              className="
                relative
                flex h-32 w-32
                shrink-0
                items-center justify-center
                rounded-full
              "
              style={{
                background:
                  "conic-gradient(#2dc9b1 0 23%, #3298ef 23% 81%, #f08ac0 81% 95%, #b6bfd0 95% 100%)",
              }}
            >
              <div
                className="
                  flex h-[82px] w-[82px]
                  flex-col
                  items-center justify-center
                  rounded-full
                  bg-white
                "
              >
                <span className="text-xl font-bold text-[#18304f]">
                  124
                </span>

                <span className="text-[9px] text-[#7c899b]">
                  Total
                </span>
              </div>
            </div>

            <div className="w-full space-y-3">
              {[
                ["New Patients", "28 (23%)", "#2dc9b1"],
                ["Returning Patients", "72 (58%)", "#3298ef"],
                ["Follow-up", "18 (14%)", "#f08ac0"],
                ["Others", "6 (5%)", "#b6bfd0"],
              ].map(([label, value, color]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-5"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />

                    <span className="text-[10px] text-[#64758d]">
                      {label}
                    </span>
                  </div>

                  <span className="text-[10px] font-medium text-[#41536e]">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* =====================================================
          APPOINTMENTS + CLINIC STATISTICS
      ====================================================== */}

      <div
        className="
          mb-4
          grid
          grid-cols-1
          gap-4

          xl:grid-cols-[1.55fr_1fr]
        "
      >
        {/* RECENT APPOINTMENTS */}

        <section
          className="
            overflow-hidden
            rounded-2xl
            border border-white/60
            bg-white/90
            shadow-[0_4px_18px_rgba(30,90,90,0.06)]
            backdrop-blur-sm
          "
        >
          <div className="flex items-center justify-between px-4 pb-3 pt-4">
            <h2 className="text-[12px] font-semibold text-[#1e3353]">
              Recent Appointments
            </h2>

            <button
              onClick={() =>
                navigate("/admin/appointments")
              }
              className="
                text-[10px]
                font-medium
                text-[#258cff]
                transition

                hover:text-[#087c75]
              "
            >
              View All →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="bg-[#f2f8f9] text-left">
                  <th className="px-4 py-2 text-[9px] font-medium text-[#718097]">
                    Time
                  </th>

                  <th className="px-4 py-2 text-[9px] font-medium text-[#718097]">
                    Patient
                  </th>

                  <th className="px-4 py-2 text-[9px] font-medium text-[#718097]">
                    Type
                  </th>

                  <th className="px-4 py-2 text-[9px] font-medium text-[#718097]">
                    Status
                  </th>

                  <th className="px-4 py-2 text-[9px] font-medium text-[#718097]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appointment) => (
                  <tr
                    key={`${appointment.time}-${appointment.patient}`}
                    className="
                      border-b border-[#edf2f3]
                      transition-colors

                      last:border-none

                      hover:bg-[#f8fcfb]
                    "
                  >
                    <td className="px-4 py-2.5 text-[10px] text-[#62738a]">
                      {appointment.time}
                    </td>

                    <td className="px-4 py-2.5 text-[10px] font-medium text-[#263b58]">
                      {appointment.patient}
                    </td>

                    <td className="px-4 py-2.5 text-[10px] text-[#62738a]">
                      {appointment.type}
                    </td>

                    <td className="px-4 py-2.5">
                      <span
                        className={`
                          rounded-full
                          px-2.5 py-1
                          text-[9px]

                          ${getStatusStyle(
                            appointment.status
                          )}
                        `}
                      >
                        {appointment.status}
                      </span>
                    </td>

                    <td className="px-4 py-2.5">
                      <button className="text-[#72839a] hover:text-[#087c75]">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}

                {appointments.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-8 text-center text-[11px] text-[#8492a4]"
                    >
                      No appointments match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* CLINIC STATISTICS */}

        <section
          className="
            rounded-2xl
            border border-white/60
            bg-white/90
            p-4
            shadow-[0_4px_18px_rgba(30,90,90,0.06)]
            backdrop-blur-sm
          "
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[12px] font-semibold text-[#1e3353]">
              Clinic Statistics
            </h2>

            <button className="text-[9px] text-[#7a899c]">
              This Month
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              {
                value: "256",
                title: "Consultations",
                change: "+12%",
                icon: Stethoscope,
              },
              {
                value: "48",
                title: "New Patients",
                change: "+8%",
                icon: Users,
              },
              {
                value: "312",
                title: "Prescriptions",
                change: "+20%",
                icon: Pill,
              },
              {
                value: "15",
                title: "Medical Certificates",
                change: "+7%",
                icon: ClipboardPlus,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="
                    rounded-xl
                    bg-[#effafa]
                    p-3
                  "
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      size={19}
                      className="text-[#12b9a1]"
                    />

                    <div>
                      <p className="text-lg font-semibold leading-none text-[#1b3250]">
                        {item.value}
                      </p>

                      <p className="mt-1 text-[9px] text-[#66778d]">
                        {item.title}
                      </p>
                    </div>
                  </div>

                  <p className="mt-2 flex items-center gap-1 text-[9px] font-medium text-[#14b87f]">
                    <ArrowUp size={10} />
                    {item.change}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* =====================================================
          ACTIVITY + QUICK ACTIONS
      ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          pb-5

          xl:grid-cols-[1fr_1.05fr]
        "
      >
        <AdminRecentActivity />
        <AdminQuickActions />
      </div>
    </div>
  );
};

export default DashboardHome;