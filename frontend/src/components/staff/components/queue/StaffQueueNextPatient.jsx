import {
  CalendarClock,
  Clock3,
  UserRoundCheck,
} from "lucide-react";

import CuraCard from "../../../common/CuraCard";

import {
  formatQueueNumber,
  getQueuePatientName,
  getQueuePatientNumber,
  getQueueTypeLabel,
} from "../../utils/queueUtils";

import {
  formatAppointmentTime,
} from "../../../../shared/utils/appointmentUtils";

const StaffQueueNextPatient = ({
  recommendation,
}) => {
  if (!recommendation?.queue_entry) {
    return (
      <CuraCard className="staff-queue-next-card">
        <div className="staff-queue-next-empty">
          <Clock3 size={22} />

          <div>
            <strong>
              No Patient Recommended
            </strong>

            <p>
              There are currently no waiting
              patients in the queue.
            </p>
          </div>
        </div>
      </CuraCard>
    );
  }

  const entry =
    recommendation.queue_entry;

  const appointment =
    entry.appointment;

  return (
    <CuraCard className="staff-queue-next-card">
      <div className="staff-queue-next-header">
        <div>
          <span className="staff-queue-next-label">
            NEXT RECOMMENDED PATIENT
          </span>

          <h3>
            {getQueuePatientName(entry)}
          </h3>

          <p>
            {getQueuePatientNumber(entry)}
          </p>
        </div>

        <div className="staff-queue-next-number">
          {formatQueueNumber(
            entry.queue_number
          )}
        </div>
      </div>

      <div className="staff-queue-next-info">
        <div>
          <UserRoundCheck size={17} />

          <span>
            {getQueueTypeLabel(entry)}
          </span>
        </div>

        {appointment?.appointment_type ===
          "online" && (
          <div>
            <CalendarClock size={17} />

            <span>
              Appointment{" "}
              {formatAppointmentTime(
                appointment.appointment_time
              )}
            </span>
          </div>
        )}

        {recommendation.protected_window_start && (
          <div>
            <Clock3 size={17} />

            <span>
              Priority window{" "}
              {formatAppointmentTime(
                recommendation.protected_window_start
              )}
            </span>
          </div>
        )}
      </div>

      <div className="staff-queue-next-reason">
        <strong>
          Why this patient?
        </strong>

        <p>
          {recommendation.reason}
        </p>
      </div>
    </CuraCard>
  );
};

export default StaffQueueNextPatient;