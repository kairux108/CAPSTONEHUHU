
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Bell,
  Users,
  CalendarDays,
  Clock3,
  FileText,
  MapPin,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Stethoscope,
  UserRoundPlus,
  Pill,
  ClipboardPlus,
  UserPlus,
  CalendarPlus,
  BarChart3,
  Settings,
  Activity,
  X,
} from "lucide-react";

const DashboardHome = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  // =====================================================
  // AUTHENTICATION TEST
  // =====================================================



  // =====================================================
  // DUMMY DATA
  // =====================================================

  const stats = [
    {
      title: "Patients",
      value: "124",
      icon: Users,
      change: "+12%",
      note: "from last week",
      positive: true,
      iconBg: "bg-[#e7f4ff]",
      iconColor: "text-[#258cff]",
    },
    {
      title: "Today's Appointments",
      value: "32",
      icon: CalendarDays,
      change: "+8%",
      note: "from yesterday",
      positive: true,
      iconBg: "bg-[#dcfaf4]",
      iconColor: "text-[#00b89c]",
    },
    {
      title: "Patients in Queue",
      value: "6",
      icon: Clock3,
      change: "+25%",
      note: "from yesterday",
      positive: false,
      iconBg: "bg-[#fff0f3]",
      iconColor: "text-[#ff4778]",
    },
    {
      title: "Prescriptions Issued",
      value: "48",
      icon: FileText,
      change: "+15%",
      note: "from last week",
      positive: true,
      iconBg: "bg-[#fff7e6]",
      iconColor: "text-[#f4aa22]",
    },
  ];

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

  const activities = [
    {
      title: "New patient registered",
      description: "John Dela Cruz",
      time: "10 minutes ago",
      icon: UserRoundPlus,
    },
    {
      title: "Appointment completed",
      description: "Maria Santos",
      time: "22 minutes ago",
      icon: CalendarDays,
    },
    {
      title: "Prescription created",
      description: "Patient #PT-0042",
      time: "35 minutes ago",
      icon: FileText,
    },
  ];

  const filteredAppointments = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return appointments;
    }

    return appointments.filter((appointment) =>
      Object.values(appointment)
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [search]);

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

      {/* =====================================================
          TOP HEADER
      ====================================================== */}

      <div className="relative mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* SEARCH */}

        <div className="relative w-full lg:max-w-xl">
          <Search
            size={17}
            className="
              absolute left-4 top-1/2
              -translate-y-1/2
              text-[#7b8aa5]
            "
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search patients, appointments, or records..."
            className="
              h-11
              w-full
              rounded-2xl
              border border-[#dce8ec]
              bg-white/90
              pl-11 pr-16
              text-[12px]
              text-[#253653]
              shadow-sm
              outline-none

              transition-all

              placeholder:text-[#9ba8ba]

              focus:border-[#91dacf]
              focus:ring-4
              focus:ring-[#bcefe6]/30
            "
          />

          <span
            className="
              absolute right-4 top-1/2
              -translate-y-1/2
              text-[10px]
              text-[#8b98aa]
            "
          >
            Ctrl + K
          </span>
        </div>

        {/* ADMIN PROFILE */}

        <div className="flex items-center justify-end gap-4">

          {/* Notifications */}

          <div className="relative">

            <button
              onClick={() =>
                setShowNotifications((previous) => !previous)
              }
              className="
                relative
                flex h-10 w-10
                items-center justify-center
                rounded-full
                text-[#38506e]
                transition

                hover:bg-white/80
              "
            >
              <Bell size={19} />

              <span
                className="
                  absolute right-2 top-2
                  h-2 w-2
                  rounded-full
                  bg-[#ff4d6d]
                  ring-2 ring-white
                "
              />
            </button>

            {showNotifications && (
              <div
                className="
                  absolute right-0 top-12
                  z-30
                  w-72
                  rounded-2xl
                  border border-[#dfe9eb]
                  bg-white
                  p-4
                  shadow-xl
                "
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#213555]">
                    Notifications
                  </h3>

                  <button
                    onClick={() =>
                      setShowNotifications(false)
                    }
                    className="text-[#8190a5]"
                  >
                    <X size={17} />
                  </button>
                </div>

                <div className="space-y-3 text-[11px] text-[#5f718a]">
                  <div className="rounded-xl bg-[#f3fbf9] p-3">
                    New appointment request received.
                  </div>

                  <div className="rounded-xl bg-[#f3fbf9] p-3">
                    Dr. Santos updated availability.
                  </div>

                  <div className="rounded-xl bg-[#f3fbf9] p-3">
                    New patient record created.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Avatar */}

          <div
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-full
              bg-[#d7f5ed]
              text-xs
              font-semibold
              text-[#087c75]
            "
          >
            AD
          </div>

          <div className="hidden sm:block">
            <p className="text-[12px] font-semibold text-[#172c4b]">
              Admin User
            </p>

            <p className="text-[10px] text-[#7e8da2]">
              Administrator
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          GREETING
      ====================================================== */}

      <div
        className="
          mb-4
          flex flex-col
          justify-between
          gap-3

          sm:flex-row
          sm:items-end
        "
      >
        <div>
          <h1
            className="
              text-[22px]
              font-semibold
              tracking-[-0.02em]
              text-[#152947]

              sm:text-[25px]
            "
          >
            Good morning, Admin!
          </h1>

          <p className="mt-1 text-[12px] text-[#687b94]">
            Here's an overview of your clinic today.
          </p>
        </div>

        <div
          className="
            text-left
            text-[10px]
            text-[#687b94]

            sm:text-right
          "
        >
          <p>Tue, Apr 22, 2026</p>

          <p className="mt-1 flex items-center gap-1 sm:justify-end">
            <MapPin size={11} />
            CURA Main Clinic
          </p>
        </div>
      </div>

      {/* =====================================================
          STAT CARDS
      ====================================================== */}

      <div
        className="
          mb-4
          grid
          grid-cols-1
          gap-3

          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="
                flex
                min-h-[102px]
                items-center
                gap-4

                rounded-2xl
                border border-white/60

                bg-white/90

                p-4

                shadow-[0_4px_18px_rgba(30,90,90,0.06)]

                backdrop-blur-sm
              "
            >
              <div
                className={`
                  flex h-12 w-12
                  shrink-0
                  items-center justify-center

                  rounded-xl

                  ${stat.iconBg}
                `}
              >
                <Icon
                  size={23}
                  strokeWidth={2}
                  className={stat.iconColor}
                />
              </div>

              <div>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold text-[#162947]">
                    {stat.value}
                  </p>

                  <p className="mb-1 text-[10px] text-[#6d7c91]">
                    {stat.title}
                  </p>
                </div>

                <div className="mt-1 flex items-center gap-1">

                  {stat.positive ? (
                    <ArrowUp
                      size={11}
                      className="text-[#18b87f]"
                    />
                  ) : (
                    <ArrowDown
                      size={11}
                      className="text-[#ff4972]"
                    />
                  )}

                  <span
                    className={`
                      text-[9px]
                      font-semibold

                      ${
                        stat.positive
                          ? "text-[#18b87f]"
                          : "text-[#ff4972]"
                      }
                    `}
                  >
                    {stat.change}
                  </span>

                  <span className="text-[9px] text-[#8a99aa]">
                    {stat.note}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
                navigate("/admin-dashboard/appointments")
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
                {filteredAppointments.map((appointment) => (
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

                {filteredAppointments.length === 0 && (
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
        {/* SYSTEM ACTIVITY */}

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
          <h2 className="mb-3 text-[12px] font-semibold text-[#1e3353]">
            System Activity
          </h2>

          <div className="space-y-3">
            {activities.map((activity) => {
              const Icon = activity.icon;

              return (
                <div
                  key={activity.title}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4

                    rounded-xl
                    p-2

                    transition

                    hover:bg-[#f3faf9]
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex h-9 w-9
                        items-center justify-center
                        rounded-full
                        bg-[#e1f8f3]
                      "
                    >
                      <Icon
                        size={17}
                        className="text-[#11aa94]"
                      />
                    </div>

                    <div>
                      <p className="text-[10px] font-medium text-[#263b58]">
                        {activity.title}
                      </p>

                      <p className="text-[9px] text-[#7a899c]">
                        {activity.description}
                      </p>
                    </div>
                  </div>

                  <span className="text-[9px] text-[#8e9aac]">
                    {activity.time}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* QUICK ACTIONS */}

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
          <h2 className="mb-3 text-[12px] font-semibold text-[#079b8d]">
            Quick Actions
          </h2>

          <div
            className="
              grid
              grid-cols-2
              gap-3

              sm:grid-cols-4
            "
          >
            <button
              onClick={() =>
                navigate("/admin-dashboard/patients")
              }
              className="
                flex min-h-[74px]
                flex-col
                items-center justify-center
                gap-2

                rounded-xl
                bg-[#effaf8]

                text-[9px]
                font-medium
                text-[#33706b]

                transition-all

                hover:-translate-y-0.5
                hover:bg-[#d9f6ef]
                hover:shadow-md
              "
            >
              <UserPlus
                size={21}
                className="text-[#10ad97]"
              />
              Add Patient
            </button>

            <button
              onClick={() =>
                navigate("/admin-dashboard/appointments")
              }
              className="
                flex min-h-[74px]
                flex-col
                items-center justify-center
                gap-2

                rounded-xl
                bg-[#effaf8]

                text-[9px]
                font-medium
                text-[#33706b]

                transition-all

                hover:-translate-y-0.5
                hover:bg-[#d9f6ef]
                hover:shadow-md
              "
            >
              <CalendarPlus
                size={21}
                className="text-[#10ad97]"
              />
              New Appointment
            </button>

            <button
              onClick={() =>
                navigate("/admin-dashboard/reports")
              }
              className="
                flex min-h-[74px]
                flex-col
                items-center justify-center
                gap-2

                rounded-xl
                bg-[#effaf8]

                text-[9px]
                font-medium
                text-[#33706b]

                transition-all

                hover:-translate-y-0.5
                hover:bg-[#d9f6ef]
                hover:shadow-md
              "
            >
              <BarChart3
                size={21}
                className="text-[#10ad97]"
              />
              Generate Report
            </button>

            <button
              onClick={() =>
                navigate("/admin-dashboard/settings")
              }
              className="
                flex min-h-[74px]
                flex-col
                items-center justify-center
                gap-2

                rounded-xl
                bg-[#effaf8]

                text-[9px]
                font-medium
                text-[#33706b]

                transition-all

                hover:-translate-y-0.5
                hover:bg-[#d9f6ef]
                hover:shadow-md
              "
            >
              <Settings
                size={21}
                className="text-[#10ad97]"
              />
              Manage System
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardHome;