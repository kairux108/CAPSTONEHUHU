import {
  BarChart3,
  CalendarPlus,
  Settings,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const actions = [
  {
    label: "Add Patient",
    path: "/admin/patients",
    icon: UserPlus,
  },
  {
    label: "New Appointment",
    path: "/admin/appointments",
    icon: CalendarPlus,
  },
  {
    label: "Generate Report",
    path: "/admin/reports",
    icon: BarChart3,
  },
  {
    label: "Manage System",
    path: "/admin/settings",
    icon: Settings,
  },
];

const AdminQuickActions = () => {
  const navigate = useNavigate();

  return (
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
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.label}
              type="button"
              onClick={() => navigate(action.path)}
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
              <Icon size={21} className="text-[#10ad97]" />
              {action.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default AdminQuickActions;
