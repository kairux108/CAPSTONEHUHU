import {
  CalendarDays,
  FileText,
  UserRoundPlus,
} from "lucide-react";

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

const AdminRecentActivity = () => (
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
                <Icon size={17} className="text-[#11aa94]" />
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
);

export default AdminRecentActivity;
