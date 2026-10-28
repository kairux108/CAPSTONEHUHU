import {
  CalendarDays,
  CircleUserRound,
  UsersRound,
  UserX,
} from "lucide-react";

import CuraCard from "../../../common/CuraCard";

const UserStats = ({
  totalUsers = 0,
  activeToday = 0,
  onLeave = 0,
  inactive = 0,
}) => {
  // ======================================================
  // STAT CONFIGURATION
  // ======================================================

  const stats = [
    {
      key: "total",
      label: "Total Users",
      value: totalUsers,
      icon: UsersRound,
      className: "total",
    },
    {
      key: "active",
      label: "Active Today",
      value: activeToday,
      icon: CircleUserRound,
      className: "active",
    },
    {
      key: "leave",
      label: "On Leave",
      value: onLeave,
      icon: CalendarDays,
      className: "leave",
    },
    {
      key: "inactive",
      label: "Inactive",
      value: inactive,
      icon: UserX,
      className: "inactive",
    },
  ];

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="users-summary-row">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <CuraCard
            key={stat.key}
            className="users-summary-card"
          >
            <div className="users-summary-content">
              <div
                className={`users-summary-icon ${stat.className}`}
              >
                <Icon size={22} />
              </div>

              <div>
                <p className="users-summary-number">
                  {stat.value}
                </p>

                <p className="users-summary-label">
                  {stat.label}
                </p>
              </div>
            </div>
          </CuraCard>
        );
      })}
    </div>
  );
};

export default UserStats;