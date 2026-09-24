import {
  CalendarDays,
  ClipboardCheck,
  Download,
  TrendingUp,
  UsersRound,
} from "lucide-react";

import ReportsChart from "./ReportsChart";

const ReportsDashboard = () => {
  const stats = [
    {
      label:
        "Total Patients",
      value: "1,284",
      helper: "Registered",
      icon: (
        <UsersRound size={18} />
      ),
    },
    {
      label:
        "Consultations",
      value: "386",
      helper: "This month",
      icon: (
        <ClipboardCheck
          size={18}
        />
      ),
    },
    {
      label:
        "Appointments",
      value: "412",
      helper: "This month",
      icon: (
        <CalendarDays
          size={18}
        />
      ),
    },
    {
      label:
        "Completion Rate",
      value: "91%",
      helper:
        "Consultations",
      icon: (
        <TrendingUp size={18} />
      ),
    },
  ];

  const breakdown = [
    {
      name:
        "General Consultation",
      count: 164,
      percent: 90,
    },
    {
      name:
        "Follow-up Consultation",
      count: 92,
      percent: 65,
    },
    {
      name:
        "Walk-in Consultation",
      count: 78,
      percent: 52,
    },
    {
      name: "Other",
      count: 52,
      percent: 34,
    },
  ];

  return (
    <div>
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#18a999]">
            Clinic Analytics
          </p>

          <h2 className="mt-1 text-[22px] font-black text-[#263d3c] dark:text-white">
            Reports
          </h2>

          <p className="mt-1 text-[12px] text-[#78908e]">
            Review patient activity and clinic performance.
          </p>
        </div>

        <button
          type="button"
          className="
            flex
            items-center
            gap-2
            rounded-[13px]
            bg-[#18a999]
            px-5
            py-2.5
            text-[11px]
            font-bold
            text-white

            hover:bg-[#138f83]
          "
        >
          <Download size={15} />
          Export Report
        </button>
      </div>

      {/* SUMMARY */}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <ReportCard
            key={stat.label}
            {...stat}
          />
        ))}
      </div>

      {/* CHARTS */}

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.3fr_0.8fr]">
        <section className="rounded-[22px] border border-white/60 bg-white/68 p-5 shadow-[0_14px_32px_rgba(44,78,75,0.11)] dark:border-[#29413f] dark:bg-[#172827]/85">
          <ReportsChart />
        </section>

        <section className="rounded-[22px] border border-white/60 bg-white/68 p-5 shadow-[0_14px_32px_rgba(44,78,75,0.11)] dark:border-[#29413f] dark:bg-[#172827]/85">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#18a999]">
            Consultation Types
          </p>

          <h3 className="mt-1 text-[17px] font-black text-[#263d3c] dark:text-white">
            Activity Breakdown
          </h3>

          <div className="mt-6 space-y-5">
            {breakdown.map(
              (item) => (
                <div
                  key={
                    item.name
                  }
                >
                  <div className="flex justify-between">
                    <span className="text-[10px] font-bold text-[#607b79] dark:text-[#91aaa7]">
                      {
                        item.name
                      }
                    </span>

                    <span className="text-[10px] font-black text-[#38514f] dark:text-white">
                      {
                        item.count
                      }
                    </span>
                  </div>

                  <div className="mt-2 h-[7px] overflow-hidden rounded-full bg-[#dcece8] dark:bg-[#29413f]">
                    <div
                      className="h-full rounded-full bg-[#18a999]"
                      style={{
                        width: `${item.percent}%`,
                      }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      </div>

      {/* MONTHLY */}

      <section className="mt-5 overflow-hidden rounded-[22px] border border-white/60 bg-white/68 shadow-[0_14px_32px_rgba(44,78,75,0.11)] dark:border-[#29413f] dark:bg-[#172827]/85">
        <div className="border-b border-white/60 px-5 py-4 dark:border-[#29413f]">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#18a999]">
            Monthly Summary
          </p>

          <h3 className="mt-1 text-[17px] font-black text-[#263d3c] dark:text-white">
            Clinic Performance
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead className="bg-[#edf7f4]/70 dark:bg-[#122120]">
              <tr>
                <Head>
                  Month
                </Head>
                <Head>
                  Patients
                </Head>
                <Head>
                  Appointments
                </Head>
                <Head>
                  Walk-ins
                </Head>
                <Head>
                  Completed
                </Head>
              </tr>
            </thead>

            <tbody>
              {[
                [
                  "September",
                  386,
                  249,
                  137,
                  351,
                ],
                [
                  "August",
                  342,
                  218,
                  124,
                  309,
                ],
                [
                  "July",
                  319,
                  201,
                  118,
                  287,
                ],
              ].map((row) => (
                <tr
                  key={row[0]}
                  className="border-t border-white/50 hover:bg-[#edf7f4]/50 dark:border-[#29413f] dark:hover:bg-[#203331]"
                >
                  {row.map(
                    (
                      value,
                      index
                    ) => (
                      <td
                        key={
                          index
                        }
                        className={`
                          px-5
                          py-3.5
                          text-[11px]

                          ${
                            index === 0
                              ? "font-extrabold text-[#38514f] dark:text-white"
                              : "text-[#607b79] dark:text-[#91aaa7]"
                          }
                        `}
                      >
                        {
                          value
                        }
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const ReportCard = ({
  icon,
  label,
  value,
  helper,
}) => (
  <article className="rounded-[19px] border border-white/60 bg-white/68 px-4 py-4 shadow-[0_10px_24px_rgba(44,78,75,0.10)] dark:border-[#29413f] dark:bg-[#172827]/85">
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#dff3ee] text-[#18a999] dark:bg-[#17413e] dark:text-[#65d7cb]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-end justify-between gap-2">
          <p className="text-[11px] font-bold text-[#607b79] dark:text-[#91aaa7]">
            {label}
          </p>

          <p className="text-[23px] font-black leading-none text-[#263d3c] dark:text-white">
            {value}
          </p>
        </div>

        <p className="mt-2 text-[9px] text-[#8aa09e]">
          {helper}
        </p>
      </div>
    </div>
  </article>
);

const Head = ({
  children,
}) => (
  <th className="px-5 py-3 text-left text-[8px] font-extrabold uppercase tracking-[0.1em] text-[#829b99]">
    {children}
  </th>
);

export default ReportsDashboard;