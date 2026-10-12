import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MonitorSmartphone,
  PersonStanding,
} from "lucide-react";

import CuraCard from "../../common/CuraCard";

const StaffAppointmentStats = ({ stats = {} }) => {
  const statsList = [
    {
      label: "Total Today",
      value: stats.total_today || 0,
      description: "Today's appointments",
      icon: CalendarDays,
      variant: "today",
    },
    {
      label: "Scheduled",
      value: stats.scheduled_today || 0,
      description: "Waiting for arrival",
      icon: Clock3,
      variant: "scheduled",
    },
    {
      label: "Checked In",
      value: stats.checked_in_today || 0,
      description: "Currently at clinic",
      icon: CheckCircle2,
      variant: "checked",
    },
    {
      label: "Walk-ins",
      value: stats.walk_in_today || 0,
      description: "Today's walk-ins",
      icon: PersonStanding,
      variant: "walkin",
    },
    {
      label: "Online",
      value: stats.online_today || 0,
      description: "Booked online",
      icon: MonitorSmartphone,
      variant: "online",
    },
  ];

  return (
    <div className="staff-appointments-summary">
      {statsList.map(
        ({ label, value, description, icon: Icon, variant }) => (
          <CuraCard
            key={label}
            className="staff-appointment-stat-card"
          >
            <div className="staff-appointment-stat-content">
              <div
                className={`staff-appointment-stat-icon ${variant}`}
              >
                <Icon size={22} />
              </div>

              <div className="staff-appointment-stat-info">
                <span className="staff-appointment-stat-label">
                  {label}
                </span>

                <strong>{value}</strong>

                <small>{description}</small>
              </div>
            </div>
          </CuraCard>
        )
      )}
    </div>
  );
};

export default StaffAppointmentStats;