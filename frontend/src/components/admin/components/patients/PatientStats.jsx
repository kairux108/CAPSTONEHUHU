import {
  CircleUserRound,
  UserCheck,
  UserX,
  UsersRound,
} from "lucide-react";

import CuraCard from "../../../common/CuraCard";

const PatientStats = ({
  total,
  active,
  inactive,
  newThisMonth,
}) => (
  <div className="patients-summary-grid">

    <CuraCard className="patients-summary-card">
      <div className="patients-summary-content">
        <div className="patients-summary-icon total">
          <UsersRound size={22} />
        </div>

        <div>
          <p className="patients-summary-number">{total}</p>
          <p className="patients-summary-label">
            Total Patients
          </p>
          <span>All registered patients</span>
        </div>
      </div>
    </CuraCard>

    <CuraCard className="patients-summary-card">
      <div className="patients-summary-content">
        <div className="patients-summary-icon new">
          <CircleUserRound size={22} />
        </div>

        <div>
          <p className="patients-summary-number">
            {newThisMonth}
          </p>
          <p className="patients-summary-label">
            New This Month
          </p>
          <span>Recently registered</span>
        </div>
      </div>
    </CuraCard>

    <CuraCard className="patients-summary-card">
      <div className="patients-summary-content">
        <div className="patients-summary-icon appointment">
          <UserCheck size={22} />
        </div>

        <div>
          <p className="patients-summary-number">{active}</p>
          <p className="patients-summary-label">
            Active Patients
          </p>
          <span>Active patient records</span>
        </div>
      </div>
    </CuraCard>

    <CuraCard className="patients-summary-card">
      <div className="patients-summary-content">
        <div className="patients-summary-icon followup">
          <UserX size={22} />
        </div>

        <div>
          <p className="patients-summary-number">
            {inactive}
          </p>
          <p className="patients-summary-label">
            Inactive Patients
          </p>
          <span>Inactive patient records</span>
        </div>
      </div>
    </CuraCard>

  </div>
);

export default PatientStats;