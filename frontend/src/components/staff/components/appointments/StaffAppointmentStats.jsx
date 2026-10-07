import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MonitorSmartphone,
  PersonStanding,
} from "lucide-react";

import CuraCard from "../../../common/CuraCard";

const AppointmentStat = ({
  icon,
  value,
  label,
  description,
  variant,
}) => (
  <CuraCard className="staff-appointment-stat-card">
    <div className="staff-appointment-stat-content">
      <div className={`staff-appointment-stat-icon ${variant}`}>
        {icon}
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
);

const StaffAppointmentStats = ({ stats }) => (
  <div className="staff-appointments-summary">
    <AppointmentStat
      icon={<CalendarDays size={22} />}
      variant="today"
      value={stats.total_today || 0}
      label="Total Today"
      description="Today's appointments"
    />

    <AppointmentStat
      icon={<Clock3 size={22} />}
      variant="scheduled"
      value={stats.scheduled_today || 0}
      label="Scheduled"
      description="Waiting for arrival"
    />

    <AppointmentStat
      icon={<CheckCircle2 size={22} />}
      variant="checked"
      value={stats.checked_in_today || 0}
      label="Checked In"
      description="Currently at clinic"
    />

    <AppointmentStat
      icon={<PersonStanding size={22} />}
      variant="walkin"
      value={stats.walk_in_today || 0}
      label="Walk-ins"
      description="Today's walk-ins"
    />

    <AppointmentStat
      icon={<MonitorSmartphone size={22} />}
      variant="online"
      value={stats.online_today || 0}
      label="Online"
      description="Booked online"
    />
  </div>
);

export default StaffAppointmentStats;