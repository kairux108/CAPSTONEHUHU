
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  UsersRound,
} from "lucide-react";

const DashboardStats = ({
  summary = {},
  averageDuration = null,
}) => {
  const cards = [
    {
      title: "Appointments",
      value: summary.appointments_today ?? 0,
      subtitle: "Assigned to you today",
      icon: CalendarDays,
    },
    {
      title: "Waiting Patients",
      value: summary.waiting ?? 0,
      subtitle: `${summary.called ?? 0} already called`,
      icon: UsersRound,
    },
    {
      title: "Completed",
      value: summary.completed ?? 0,
      subtitle: "Completed queue consultations",
      icon: CheckCircle2,
    },
    {
      title: "Avg. Consultation",
      value:
        averageDuration === null
          ? "—"
          : `${averageDuration}m`,
      subtitle: "Based on recorded consultations",
      icon: Clock3,
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-[20px] border border-white/60 bg-white/75 p-4 shadow-[0_10px_24px_rgba(44,78,75,0.10)]"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#dff3ee] text-[#18a999]">
                <Icon size={19} />
              </div>

              <div>
                <p className="text-[25px] font-black text-[#263d3c]">
                  {card.value}
                </p>

                <p className="text-[11px] font-bold text-[#607b79]">
                  {card.title}
                </p>
              </div>
            </div>

            <p className="mt-3 text-[10px] text-[#78908e]">
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
