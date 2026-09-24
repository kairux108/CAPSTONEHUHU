import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Clock3,
  FileText,
  Users,
} from "lucide-react";

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

const AdminStats = () => (
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
                <ArrowUp size={11} className="text-[#18b87f]" />
              ) : (
                <ArrowDown size={11} className="text-[#ff4972]" />
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
);

export default AdminStats;
