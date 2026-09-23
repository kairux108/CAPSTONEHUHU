import { useState } from "react";

import {
  Search,
  Bell,
  Users,
  CalendarDays,
  Stethoscope,
  FileText,
  ArrowUp,
  ChevronDown,
  Download,
  Activity,
  Pill,
  ClipboardList,
} from "lucide-react";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [reportType, setReportType] = useState("Patient Summary");
  const [format, setFormat] = useState("PDF");

  const stats = [
    {
      title: "Total Patients",
      value: "1,248",
      change: "12%",
      icon: Users,
      bg: "bg-[#e1f8f2]",
      iconColor: "text-[#0bad92]",
    },
    {
      title: "Total Appointments",
      value: "256",
      change: "8%",
      icon: CalendarDays,
      bg: "bg-[#e5f2ff]",
      iconColor: "text-[#258cff]",
    },
    {
      title: "Total Consultations",
      value: "189",
      change: "15%",
      icon: Stethoscope,
      bg: "bg-[#ffe7eb]",
      iconColor: "text-[#f05f74]",
    },
    {
      title: "Prescriptions Issued",
      value: "312",
      change: "10%",
      icon: FileText,
      bg: "bg-[#e1f8f2]",
      iconColor: "text-[#0bad92]",
    },
  ];

  const diagnoses = [
    ["Hypertension", "28", "15%"],
    ["Upper Respiratory Infection", "24", "13%"],
    ["Type 2 Diabetes", "18", "10%"],
    ["Acute Gastroenteritis", "15", "8%"],
    ["Urinary Tract Infection", "12", "6%"],
  ];

  const activities = [
    {
      date: "Apr 22, 2026 10:30 AM",
      patient: "Emma Wilson",
      type: "Consultation",
      detail: "General Consultation",
      status: "Completed",
    },
    {
      date: "Apr 22, 2026 09:15 AM",
      patient: "James Lee",
      type: "Laboratory",
      detail: "Blood Test",
      status: "Completed",
    },
    {
      date: "Apr 22, 2026 08:45 AM",
      patient: "Sophia Patel",
      type: "Prescription",
      detail: "Maintenance Medication",
      status: "Completed",
    },
    {
      date: "Apr 21, 2026 03:20 PM",
      patient: "Michael Roberts",
      type: "Consultation",
      detail: "Follow-up",
      status: "Completed",
    },
    {
      date: "Apr 21, 2026 11:10 AM",
      patient: "Aisha Khan",
      type: "Consultation",
      detail: "Chronic Care",
      status: "Completed",
    },
  ];

  const handleGenerateReport = () => {
    alert(
      `Dummy report generated!\n\nType: ${reportType}\nFormat: ${format}`
    );
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-5">

      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <div
        className="
          mb-4
          flex flex-col gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div className="relative w-full max-w-xl">
          <Search
            size={16}
            className="
              absolute left-4 top-1/2
              -translate-y-1/2
              text-[#73839a]
            "
          />

          <input
            placeholder="Search patients, appointments, or records..."
            className="
              h-10 w-full
              rounded-2xl
              border border-[#dae7e9]
              bg-white/90
              pl-10 pr-4
              text-[11px]
              text-[#354863]
              shadow-sm
              outline-none
            "
          />
        </div>

        <div className="flex items-center justify-end gap-4">
          <button className="relative text-[#40536f]">
            <Bell size={18} />

            <span
              className="
                absolute -right-1 -top-1
                h-2 w-2
                rounded-full
                bg-red-500
                ring-2 ring-white
              "
            />
          </button>

          <div
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-full
              bg-[#d7f5ed]
              text-[11px]
              font-semibold
              text-[#087c75]
            "
          >
            AD
          </div>

          <div className="hidden sm:block">
            <p className="text-[11px] font-semibold text-[#203450]">
              Admin User
            </p>

            <p className="text-[9px] text-[#728198]">
              Administrator
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          TITLE
      ====================================================== */}

      <div
        className="
          mb-4
          flex flex-col gap-3
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div>
          <h1 className="text-[24px] font-semibold text-[#152b49]">
            Reports
          </h1>

          <p className="mt-1 text-[11px] text-[#6e7f96]">
            View clinic statistics, trends, and operational reports.
          </p>
        </div>

        <button
          className="
            flex h-10
            items-center gap-2
            rounded-lg
            border border-[#dce7e9]
            bg-white
            px-4
            text-[9px]
            text-[#53657d]
          "
        >
          <CalendarDays size={14} />
          Apr 1, 2026 - Apr 22, 2026
          <ChevronDown size={13} />
        </button>
      </div>

      {/* =====================================================
          STATS
      ====================================================== */}

      <div
        className="
          mb-4
          grid grid-cols-1 gap-3
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
                flex min-h-[90px]
                items-center gap-3
                rounded-xl
                border border-white/60
                bg-white/90
                p-4
                shadow-[0_4px_15px_rgba(30,90,90,0.05)]
              "
            >
              <div
                className={`
                  flex h-11 w-11
                  items-center justify-center
                  rounded-xl
                  ${item.bg}
                `}
              >
                <Icon
                  size={21}
                  className={item.iconColor}
                />
              </div>

              <div>
                <p className="text-xl font-semibold leading-none text-[#17304e]">
                  {item.value}
                </p>

                <p className="mt-1 text-[8px] text-[#738299]">
                  {item.title}
                </p>

                <p className="mt-1 flex items-center gap-1 text-[7px] font-medium text-[#16a678]">
                  <ArrowUp size={9} />
                  {item.change} from last month
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* =====================================================
          REPORT TABS
      ====================================================== */}

      <div
        className="
          mb-3
          flex gap-1
          overflow-x-auto
          border-b border-[#dfeaea]
        "
      >
        {[
          "Overview",
          "Appointments",
          "Consultations",
          "Prescriptions",
          "Patient Demographics",
          "Staff Productivity",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              whitespace-nowrap
              px-4 py-2.5
              text-[9px]
              font-medium
              transition

              ${
                activeTab === tab
                  ? "border-b-2 border-[#0bad92] text-[#078b79]"
                  : "text-[#66788e] hover:text-[#078b79]"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* =====================================================
          OVERVIEW
      ====================================================== */}

      {activeTab === "Overview" && (
        <>
          <div
            className="
              mb-4
              grid grid-cols-1 gap-4
              xl:grid-cols-[1.1fr_1.1fr_0.85fr]
            "
          >
            {/* PATIENT VISITS */}

            <ReportCard title="Patient Visits" action="This Month">
              <PatientVisitsChart />
            </ReportCard>

            {/* CONSULTATION TYPE */}

            <ReportCard
              title="Consultations by Visit Type"
            >
              <div className="flex flex-col items-center gap-5 sm:flex-row">
                <DonutChart
                  centerValue="189"
                  centerLabel="Total"
                  gradient="conic-gradient(#13b99a 0 45%, #328ef3 45% 73%, #ffbf36 73% 88%, #f27c75 88% 96%, #a68ceb 96% 100%)"
                />

                <div className="w-full space-y-3">
                  <Legend
                    color="#13b99a"
                    label="General Consultation"
                    value="45% (85)"
                  />

                  <Legend
                    color="#328ef3"
                    label="Follow-up"
                    value="28% (53)"
                  />

                  <Legend
                    color="#ffbf36"
                    label="Chronic Care"
                    value="15% (28)"
                  />

                  <Legend
                    color="#f27c75"
                    label="Health Check-up"
                    value="8% (15)"
                  />

                  <Legend
                    color="#a68ceb"
                    label="Others"
                    value="4% (8)"
                  />
                </div>
              </div>
            </ReportCard>

            {/* DEMOGRAPHICS */}

            <ReportCard title="Patient Demographics">
              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-[8px] font-medium text-[#53657d]">
                    Gender
                  </p>

                  <div className="flex items-center gap-4">
                    <DonutChart
                      small
                      centerValue="1,248"
                      centerLabel="Patients"
                      gradient="conic-gradient(#e68ac0 0 58%, #4194f2 58% 100%)"
                    />

                    <div className="space-y-2">
                      <Legend
                        color="#e68ac0"
                        label="Female"
                        value="58% (724)"
                      />

                      <Legend
                        color="#4194f2"
                        label="Male"
                        value="42% (524)"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-[8px] font-medium text-[#53657d]">
                    Age Group
                  </p>

                  <AgeBar
                    label="0-17"
                    value="12%"
                    width="30%"
                    color="bg-[#73d8c4]"
                  />

                  <AgeBar
                    label="18-29"
                    value="24%"
                    width="55%"
                    color="bg-[#72cbea]"
                  />

                  <AgeBar
                    label="30-44"
                    value="30%"
                    width="70%"
                    color="bg-[#ffcc74]"
                  />

                  <AgeBar
                    label="45-59"
                    value="20%"
                    width="48%"
                    color="bg-[#f5a8ba]"
                  />

                  <AgeBar
                    label="60+"
                    value="14%"
                    width="36%"
                    color="bg-[#b4a2dc]"
                  />
                </div>
              </div>
            </ReportCard>
          </div>

          {/* =================================================
              SECOND ROW
          ================================================== */}

          <div
            className="
              mb-4
              grid grid-cols-1 gap-4
              xl:grid-cols-[1fr_1.15fr_0.85fr]
            "
          >
            {/* TOP DIAGNOSES */}

            <ReportCard
              title="Top 5 Diagnoses"
              action="This Month"
            >
              <div className="space-y-3">
                {diagnoses.map(
                  ([name, count, percent], index) => (
                    <div
                      key={name}
                      className="
                        grid
                        grid-cols-[22px_1fr_auto]
                        items-center
                        gap-2
                      "
                    >
                      <div
                        className="
                          flex h-5 w-5
                          items-center justify-center
                          rounded-full
                          bg-[#dff7f1]
                          text-[8px]
                          font-semibold
                          text-[#078b79]
                        "
                      >
                        {index + 1}
                      </div>

                      <span className="text-[8px] text-[#485b74]">
                        {name}
                      </span>

                      <span className="text-[8px] font-medium text-[#42546d]">
                        {count} ({percent})
                      </span>
                    </div>
                  )
                )}
              </div>
            </ReportCard>

            {/* APPOINTMENT STATUS */}

            <ReportCard title="Appointment Status">
              <div className="flex flex-col items-center gap-5 sm:flex-row">
                <DonutChart
                  centerValue="256"
                  centerLabel="Total"
                  gradient="conic-gradient(#12af8f 0 65%, #3797f2 65% 85%, #ffb92f 85% 95%, #e87478 95% 100%)"
                />

                <div className="w-full space-y-3">
                  <Legend
                    color="#12af8f"
                    label="Completed"
                    value="65% (166)"
                  />

                  <Legend
                    color="#3797f2"
                    label="Scheduled"
                    value="20% (51)"
                  />

                  <Legend
                    color="#ffb92f"
                    label="Cancelled"
                    value="10% (26)"
                  />

                  <Legend
                    color="#e87478"
                    label="No-show"
                    value="5% (13)"
                  />
                </div>
              </div>
            </ReportCard>

            {/* PRESCRIPTION CATEGORY */}

            <ReportCard
              title="Prescriptions by Category"
              action="This Month"
            >
              <div className="space-y-3">
                <PrescriptionBar
                  label="Maintenance"
                  value="35% (109)"
                  width="82%"
                  color="bg-[#4dc4b2]"
                />

                <PrescriptionBar
                  label="Antibiotics"
                  value="25% (78)"
                  width="62%"
                  color="bg-[#78c7e5]"
                />

                <PrescriptionBar
                  label="Pain Relievers"
                  value="20% (62)"
                  width="50%"
                  color="bg-[#ffce68]"
                />

                <PrescriptionBar
                  label="Vitamins & Supplements"
                  value="15% (47)"
                  width="38%"
                  color="bg-[#efa6c2]"
                />

                <PrescriptionBar
                  label="Others"
                  value="5% (16)"
                  width="18%"
                  color="bg-[#a9a0dc]"
                />
              </div>
            </ReportCard>
          </div>

          {/* =================================================
              BOTTOM ROW
          ================================================== */}

          <div
            className="
              grid grid-cols-1 gap-4
              xl:grid-cols-[1.8fr_0.75fr]
            "
          >
            {/* RECENT ACTIVITIES */}

            <section
              className="
                overflow-hidden
                rounded-2xl
                border border-white/60
                bg-white/90
                shadow-[0_4px_18px_rgba(30,90,90,0.06)]
              "
            >
              <div className="flex items-center justify-between px-4 py-4">
                <div className="flex items-center gap-2">
                  <Activity
                    size={14}
                    className="text-[#0bad92]"
                  />

                  <h2 className="text-[10px] font-semibold text-[#203652]">
                    Recent Activities
                  </h2>
                </div>

                <button className="text-[8px] font-medium text-[#278bf1]">
                  View All →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px]">
                  <thead>
                    <tr className="bg-[#f2f8f9]">
                      {[
                        "Date & Time",
                        "Patient",
                        "Type",
                        "Details",
                        "Status",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="
                            px-4 py-2
                            text-left
                            text-[8px]
                            font-medium
                            text-[#718097]
                          "
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {activities.map((item) => (
                      <tr
                        key={`${item.date}-${item.patient}`}
                        className="border-b border-[#edf2f3]"
                      >
                        <td className={cellClass}>
                          {item.date}
                        </td>

                        <td
                          className="
                            px-4 py-2
                            text-[8px]
                            font-medium
                            text-[#344861]
                          "
                        >
                          {item.patient}
                        </td>

                        <td className={cellClass}>
                          {item.type}
                        </td>

                        <td className={cellClass}>
                          {item.detail}
                        </td>

                        <td className="px-4 py-2">
                          <span
                            className="
                              rounded-full
                              bg-[#ddf8e9]
                              px-2 py-1
                              text-[7px]
                              text-[#24955c]
                            "
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* GENERATE REPORT */}

            <section
              className="
                rounded-2xl
                border border-white/60
                bg-white/90
                p-4
                shadow-[0_4px_18px_rgba(30,90,90,0.06)]
              "
            >
              <div className="mb-4 flex items-center gap-2">
                <ClipboardList
                  size={15}
                  className="text-[#0bad92]"
                />

                <h2 className="text-[10px] font-semibold text-[#203652]">
                  Generate Report
                </h2>
              </div>

              <div className="space-y-3">
                <div>
                  <label className={labelClass}>
                    Report Type
                  </label>

                  <select
                    value={reportType}
                    onChange={(event) =>
                      setReportType(event.target.value)
                    }
                    className={inputClass}
                  >
                    <option>Patient Summary</option>
                    <option>Appointment Report</option>
                    <option>Consultation Report</option>
                    <option>Prescription Report</option>
                    <option>Staff Productivity</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    Date Range
                  </label>

                  <button
                    className={`
                      ${inputClass}
                      flex items-center justify-between
                    `}
                  >
                    Apr 1, 2026 - Apr 22, 2026
                    <CalendarDays size={12} />
                  </button>
                </div>

                <div>
                  <label className={labelClass}>
                    Format
                  </label>

                  <select
                    value={format}
                    onChange={(event) =>
                      setFormat(event.target.value)
                    }
                    className={inputClass}
                  >
                    <option>PDF</option>
                    <option>CSV</option>
                    <option>Excel</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateReport}
                  className="
                    mt-2
                    flex h-10
                    w-full
                    items-center justify-center
                    gap-2
                    rounded-lg
                    bg-[#0bad92]
                    text-[9px]
                    font-medium
                    text-white
                    transition
                    hover:bg-[#078f7b]
                  "
                >
                  <Download size={14} />
                  Generate Report
                </button>
              </div>
            </section>
          </div>
        </>
      )}

      {/* =====================================================
          OTHER TABS - DUMMY PLACEHOLDER
      ====================================================== */}

      {activeTab !== "Overview" && (
        <div
          className="
            rounded-2xl
            border border-white/60
            bg-white/90
            p-8
            text-center
            shadow-[0_4px_18px_rgba(30,90,90,0.06)]
          "
        >
          <h2 className="text-lg font-semibold text-[#203652]">
            {activeTab}
          </h2>

          <p className="mt-2 text-[10px] text-[#748399]">
            Dummy {activeTab.toLowerCase()} analytics will appear here.
          </p>
        </div>
      )}
    </div>
  );
};


// =====================================================
// SMALL COMPONENTS
// =====================================================

const ReportCard = ({
  title,
  action,
  children,
}) => {
  return (
    <section
      className="
        rounded-2xl
        border border-white/60
        bg-white/90
        p-4
        shadow-[0_4px_18px_rgba(30,90,90,0.06)]
      "
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[10px] font-semibold text-[#203652]">
          {title}
        </h2>

        {action && (
          <button className="text-[8px] font-medium text-[#278bf1]">
            {action}⌄
          </button>
        )}
      </div>

      {children}
    </section>
  );
};


const PatientVisitsChart = () => {
  return (
    <div className="h-[180px] w-full">
      <svg
        viewBox="0 0 600 210"
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        {[30, 65, 100, 135, 170].map((y) => (
          <line
            key={y}
            x1="30"
            x2="580"
            y1={y}
            y2={y}
            stroke="#e8eeee"
          />
        ))}

        <polyline
          points="
            35,170
            80,145
            125,120
            170,85
            215,130
            260,90
            305,105
            350,62
            395,82
            440,120
            485,82
            530,95
            575,75
          "
          fill="none"
          stroke="#13b99a"
          strokeWidth="3"
        />

        {[
          [35, 170],
          [80, 145],
          [125, 120],
          [170, 85],
          [215, 130],
          [260, 90],
          [305, 105],
          [350, 62],
          [395, 82],
          [440, 120],
          [485, 82],
          [530, 95],
          [575, 75],
        ].map(([x, y]) => (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r="4"
            fill="#13b99a"
          />
        ))}

        {[
          ["Apr 1", 35],
          ["Apr 5", 125],
          ["Apr 10", 215],
          ["Apr 15", 350],
          ["Apr 20", 485],
          ["Apr 22", 575],
        ].map(([label, x]) => (
          <text
            key={label}
            x={x}
            y="202"
            textAnchor="middle"
            fontSize="9"
            fill="#7e8ba0"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
};


const DonutChart = ({
  centerValue,
  centerLabel,
  gradient,
  small = false,
}) => {
  return (
    <div
      className={`
        relative
        flex shrink-0
        items-center justify-center
        rounded-full

        ${
          small
            ? "h-24 w-24"
            : "h-32 w-32"
        }
      `}
      style={{
        background: gradient,
      }}
    >
      <div
        className={`
          flex flex-col
          items-center justify-center
          rounded-full
          bg-white

          ${
            small
              ? "h-16 w-16"
              : "h-[82px] w-[82px]"
          }
        `}
      >
        <span
          className={`
            font-bold
            text-[#18304f]

            ${
              small
                ? "text-sm"
                : "text-xl"
            }
          `}
        >
          {centerValue}
        </span>

        <span className="text-[7px] text-[#7d899b]">
          {centerLabel}
        </span>
      </div>
    </div>
  );
};


const Legend = ({
  color,
  label,
  value,
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: color }}
        />

        <span className="text-[7px] text-[#60718a]">
          {label}
        </span>
      </div>

      <span className="text-[7px] font-medium text-[#41536e]">
        {value}
      </span>
    </div>
  );
};


const AgeBar = ({
  label,
  value,
  width,
  color,
}) => {
  return (
    <div className="mb-2 grid grid-cols-[35px_1fr_35px] items-center gap-2">
      <span className="text-[7px] text-[#64758c]">
        {label}
      </span>

      <div className="h-2 rounded-full bg-[#ecf1f2]">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width }}
        />
      </div>

      <span className="text-right text-[7px] text-[#64758c]">
        {value}
      </span>
    </div>
  );
};


const PrescriptionBar = ({
  label,
  value,
  width,
  color,
}) => {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[7px] text-[#61728a]">
          {label}
        </span>

        <span className="text-[7px] text-[#61728a]">
          {value}
        </span>
      </div>

      <div className="h-2 rounded-full bg-[#edf2f3]">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width }}
        />
      </div>
    </div>
  );
};


const cellClass = `
  px-4 py-2
  text-[8px]
  text-[#5b6d84]
`;

const labelClass = `
  mb-1
  block
  text-[8px]
  font-medium
  text-[#65768c]
`;

const inputClass = `
  h-9
  w-full
  rounded-lg
  border border-[#dce7e9]
  bg-white
  px-3
  text-[8px]
  text-[#53657d]
  outline-none
`;

export default Reports;