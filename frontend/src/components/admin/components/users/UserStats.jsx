import {
  CalendarDays,
  CircleUserRound,
  UsersRound,
  UserX,
} from "lucide-react";

import CuraCard from "../../../common/CuraCard";

const UserStats = ({
  totalUsers,
  activeToday,
  onLeave,
  inactive,
}) => {
  return (
    <div className="users-summary-row">

      <CuraCard className="users-summary-card">

        <div className="users-summary-content">

          <div className="users-summary-icon total">
            <UsersRound
              size={22}
            />
          </div>

          <div>
            <p className="users-summary-number">
              {totalUsers}
            </p>

            <p className="users-summary-label">
              Total Users
            </p>
          </div>

        </div>

      </CuraCard>


      <CuraCard className="users-summary-card">

        <div className="users-summary-content">

          <div className="users-summary-icon active">
            <CircleUserRound
              size={22}
            />
          </div>

          <div>
            <p className="users-summary-number">
              {activeToday}
            </p>

            <p className="users-summary-label">
              Active Today
            </p>
          </div>

        </div>

      </CuraCard>


      <CuraCard className="users-summary-card">

        <div className="users-summary-content">

          <div className="users-summary-icon leave">
            <CalendarDays
              size={22}
            />
          </div>

          <div>
            <p className="users-summary-number">
              {onLeave}
            </p>

            <p className="users-summary-label">
              On Leave
            </p>
          </div>

        </div>

      </CuraCard>


      <CuraCard className="users-summary-card">

        <div className="users-summary-content">

          <div className="users-summary-icon inactive">
            <UserX
              size={22}
            />
          </div>

          <div>
            <p className="users-summary-number">
              {inactive}
            </p>

            <p className="users-summary-label">
              Inactive
            </p>
          </div>

        </div>

      </CuraCard>

    </div>
  );
};

export default UserStats;