import {
  CalendarDays,
  ClipboardList,
  Clock3,
  Phone,
  Stethoscope,
  UserRound,
} from "lucide-react";

import CuraCard from "../../../common/CuraCard";

import {
  formatAppointmentDate,
  formatAppointmentTime,
} from "../../../../shared/utils/appointmentUtils";

import {
  calculateQueuePatientAge,
  formatFullQueueNumber,
  formatQueueDate,
  formatQueueDateTime,
  formatQueueEta,
  formatQueueLabel,
  formatQueueTime,
  getQueueDoctorName,
  getQueuePatientAddress,
  getQueuePatientBirthDate,
  getQueuePatientEmail,
  getQueuePatientInitials,
  getQueuePatientName,
  getQueuePatientNumber,
  getQueuePatientPhone,
  getQueuePriorityReason,
  getQueueReasonForVisit,
  getQueueStatusClass,
  getQueueTypeLabel,
} from "../../utils/queueUtils";

const QueueDetailRow = ({ label, value }) => (
  <div className="staff-queue-detail-row">
    <span>{label}</span>
    <strong>{value || "—"}</strong>
  </div>
);

const QueueDetailSection = ({
  icon,
  title,
  children,
}) => (
  <section className="staff-queue-detail-section">
    <h4>
      {icon}
      {title}
    </h4>

    {children}
  </section>
);

const StaffQueueDetails = ({ entry }) => {
  if (!entry) {
    return (
      <CuraCard
        title="Patient Details"
        className="staff-queue-detail-card"
      >
        <div className="staff-queue-detail-empty">
          <UserRound size={42} />

          <h3>No patient selected</h3>

          <p>
            Select a patient from the queue to view details.
          </p>
        </div>
      </CuraCard>
    );
  }

  const patient =
    entry.appointment?.patient;

  const birthDate =
    getQueuePatientBirthDate(entry);

  const age =
    calculateQueuePatientAge(birthDate);

  return (
    <CuraCard
      title="Patient Details"
      className="staff-queue-detail-card"
    >
      <div className="staff-queue-details">

        {/* PATIENT PROFILE */}

        <div className="staff-queue-detail-profile">
          <div className="staff-queue-detail-avatar">
            {getQueuePatientInitials(entry)}
          </div>

          <div>
            <h3>
              {getQueuePatientName(entry)}
            </h3>

            <p>
              {getQueuePatientNumber(entry)}
            </p>
          </div>

          <span
            className={`staff-queue-status ${getQueueStatusClass(
              entry.status
            )}`}
          >
            {formatQueueLabel(entry.status)}
          </span>
        </div>

        {/* PERSONAL INFORMATION */}

        <QueueDetailSection
          icon={<UserRound size={17} />}
          title="Personal Information"
        >
          <QueueDetailRow
            label="Birth Date"
            value={
              birthDate
                ? formatQueueDate(birthDate)
                : "—"
            }
          />

          <QueueDetailRow
            label="Age"
            value={
              age !== null
                ? `${age} years old`
                : "—"
            }
          />

          <QueueDetailRow
            label="Sex"
            value={formatQueueLabel(
              patient?.sex
            )}
          />

          <QueueDetailRow
            label="Blood Type"
            value={
              patient?.blood_type || "—"
            }
          />
        </QueueDetailSection>

        {/* CONTACT INFORMATION */}

        <QueueDetailSection
          icon={<Phone size={17} />}
          title="Contact Information"
        >
          <QueueDetailRow
            label="Phone Number"
            value={getQueuePatientPhone(
              entry
            )}
          />

          <QueueDetailRow
            label="Email"
            value={getQueuePatientEmail(
              entry
            )}
          />

          <QueueDetailRow
            label="Address"
            value={getQueuePatientAddress(
              entry
            )}
          />
        </QueueDetailSection>

        {/* APPOINTMENT INFORMATION */}

        <QueueDetailSection
          icon={<CalendarDays size={17} />}
          title="Appointment Information"
        >
          <QueueDetailRow
            label="Appointment Number"
            value={
              entry.appointment
                ?.appointment_number ||
              "—"
            }
          />

          <QueueDetailRow
            label="Type"
            value={getQueueTypeLabel(
              entry
            )}
          />

          <QueueDetailRow
            label="Date"
            value={formatAppointmentDate(
              entry.appointment
                ?.appointment_date
            )}
          />

          <QueueDetailRow
            label="Time"
            value={formatAppointmentTime(
              entry.appointment
                ?.appointment_time
            )}
          />

          <QueueDetailRow
            label="Reason for Visit"
            value={getQueueReasonForVisit(
              entry
            )}
          />
        </QueueDetailSection>

        {/* QUEUE INFORMATION */}

        <QueueDetailSection
          icon={<ClipboardList size={17} />}
          title="Queue Information"
        >
          <QueueDetailRow
            label="Queue Number"
            value={formatFullQueueNumber(
              entry.queue_number
            )}
          />

          <QueueDetailRow
            label="Status"
            value={formatQueueLabel(
              entry.status
            )}
          />

          <QueueDetailRow
            label="Priority"
            value={formatQueueLabel(
              entry.priority
            )}
          />

          {entry.priority !== "normal" && (
            <QueueDetailRow
              label="Priority Reason"
              value={getQueuePriorityReason(
                entry
              )}
            />
          )}

          <QueueDetailRow
            label="Time In"
            value={formatQueueTime(
              entry.queued_at
            )}
          />

          <QueueDetailRow
            label="Estimated Wait"
            value={formatQueueEta(
              entry.estimated_wait_minutes
            )}
          />

          <QueueDetailRow
            label="Assigned Doctor"
            value={getQueueDoctorName(
              entry
            )}
          />

          <QueueDetailRow
            label="Doctor Available"
            value={
              entry.doctor_available_at
                ? formatQueueDateTime(
                    entry.doctor_available_at
                  )
                : "Not available"
            }
          />
        </QueueDetailSection>

        {/* QUEUE TIMELINE */}

        <QueueDetailSection
          icon={<Clock3 size={17} />}
          title="Queue Timeline"
        >
          <QueueDetailRow
            label="Queued"
            value={formatQueueDateTime(
              entry.queued_at
            )}
          />

          <QueueDetailRow
            label="Called"
            value={
              entry.called_at
                ? formatQueueDateTime(
                    entry.called_at
                  )
                : "Not called yet"
            }
          />

          <QueueDetailRow
            label="Consultation Started"
            value={
              entry.consultation_started_at
                ? formatQueueDateTime(
                    entry.consultation_started_at
                  )
                : "Not started"
            }
          />

          <QueueDetailRow
            label="Completed"
            value={
              entry.completed_at
                ? formatQueueDateTime(
                    entry.completed_at
                  )
                : "Not completed"
            }
          />
        </QueueDetailSection>

        {/* CLINICAL NOTE */}

        <QueueDetailSection
          icon={<Stethoscope size={17} />}
          title="Visit Information"
        >
          <p className="staff-queue-notes">
            {getQueueReasonForVisit(entry)}
          </p>
        </QueueDetailSection>
      </div>
    </CuraCard>
  );
};

export default StaffQueueDetails;