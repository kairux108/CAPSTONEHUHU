import {
  CircleUserRound,
  UserRoundCheck,
  UserRoundX,
  UsersRound,
} from "lucide-react";

import CuraCard from "../../../common/CuraCard";

const StaffPatientStats = ({
  total,
  active,
  inactive,
  newThisMonth,
}) => (
  <div className="staff-patients-summary">

    <CuraCard className="staff-patient-stat-card">
      <div className="staff-patient-stat-content">

        <div className="staff-patient-stat-icon total">
          <UsersRound size={23} />
        </div>

        <div>
          <strong>{total}</strong>
          <p>Total Patients</p>
          <span>All registered patients</span>
        </div>

      </div>
    </CuraCard>


    <CuraCard className="staff-patient-stat-card">
      <div className="staff-patient-stat-content">

        <div className="staff-patient-stat-icon active">
          <UserRoundCheck size={23} />
        </div>

        <div>
          <strong>{active}</strong>
          <p>Active Patients</p>
          <span>Currently active</span>
        </div>

      </div>
    </CuraCard>


    <CuraCard className="staff-patient-stat-card">
      <div className="staff-patient-stat-content">

        <div className="staff-patient-stat-icon inactive">
          <UserRoundX size={23} />
        </div>

        <div>
          <strong>{inactive}</strong>
          <p>Inactive Patients</p>
          <span>Inactive patient records</span>
        </div>

      </div>
    </CuraCard>


    <CuraCard className="staff-patient-stat-card">
      <div className="staff-patient-stat-content">

        <div className="staff-patient-stat-icon new">
          <CircleUserRound size={23} />
        </div>

        <div>
          <strong>{newThisMonth}</strong>
          <p>New This Month</p>
          <span>Recently registered</span>
        </div>

      </div>
    </CuraCard>

  </div>
);

export default StaffPatientStats;