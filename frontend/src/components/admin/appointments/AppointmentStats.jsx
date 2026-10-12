import {
  CalendarCheck,
  CalendarDays,
  Clock3,
  MonitorSmartphone,
  UserRoundPlus,
} from "lucide-react";

import CuraCard from "../../common/CuraCard";

const AppointmentStats = ({
  total = 0,
  scheduled = 0,
  checkedIn = 0,
  walkIn = 0,
  online = 0,
}) => {
  const stats = [
    { label: "Total Today", value: total, icon: CalendarDays, className: "total" },
    { label: "Scheduled", value: scheduled, icon: Clock3, className: "scheduled" },
    { label: "Checked In", value: checkedIn, icon: CalendarCheck, className: "checked-in" },
    { label: "Walk-ins", value: walkIn, icon: UserRoundPlus, className: "walk-in" },
    { label: "Online", value: online, icon: MonitorSmartphone, className: "online" },
  ];

  return (
    <div className="appointments-summary-grid">
      {stats.map(({ label, value, icon: Icon, className }) => (
        <CuraCard key={label} className="appointments-summary-card">
          <div className="appointments-summary-content">
            <div className={`appointments-summary-icon ${className}`}>
              <Icon size={21} />
            </div>

            <div>
              <p className="appointments-summary-number">{value}</p>
              <p className="appointments-summary-label">{label}</p>
            </div>
          </div>
        </CuraCard>
      ))}
    </div>
  );
};

export default AppointmentStats;