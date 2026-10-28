import {
  CheckCircle2,
  Clock3,
  Stethoscope,
  UsersRound,
} from "lucide-react";

import CuraCard from "../../../common/CuraCard";

const QueueStat = ({
  icon,
  variant,
  value,
  label,
  helper,
}) => (
  <CuraCard className="staff-queue-stat-card">
    <div className="staff-queue-stat-content">
      <div
        className={`staff-queue-stat-icon ${variant}`}
      >
        {icon}
      </div>

      <div>
        <strong>{value}</strong>
        <p>{label}</p>
        <span>{helper}</span>
      </div>
    </div>
  </CuraCard>
);

const StaffQueueStats = ({ stats }) => {
  const total =
    stats?.total ?? 0;

  const waiting =
    stats?.waiting ?? 0;

  const consulting =
    stats?.in_consultation ?? 0;

  const completed =
    stats?.completed ?? 0;

  return (
    <div className="staff-queue-summary">
      <QueueStat
        icon={<UsersRound size={23} />}
        variant="total"
        value={total}
        label="Total in Queue"
        helper="Patients for today"
      />

      <QueueStat
        icon={<Clock3 size={23} />}
        variant="waiting"
        value={waiting}
        label="Waiting"
        helper="Not yet called"
      />

      <QueueStat
        icon={<Stethoscope size={23} />}
        variant="consulting"
        value={consulting}
        label="Now Consulting"
        helper="With doctor"
      />

      <QueueStat
        icon={<CheckCircle2 size={23} />}
        variant="completed"
        value={completed}
        label="Completed"
        helper="For today"
      />
    </div>
  );
};

export default StaffQueueStats;