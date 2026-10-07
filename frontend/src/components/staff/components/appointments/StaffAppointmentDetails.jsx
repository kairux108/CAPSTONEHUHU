import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import CuraCard from "../../../common/CuraCard";

const DetailRow = ({
  label,
  value,
}) => (
  <div className="staff-appointment-detail-row">
    <span>{label}</span>
    <strong>{value || "—"}</strong>
  </div>
);

const StaffAppointmentDetails = ({
  appointment,
  getPatientName,
  getInitials,
  getDoctorName,
  formatDate,
  formatTime,
  formatStatus,
  formatType,
  formatDateTime,
  statusClass,
  onCheckIn,
  onEdit,
  onCancel,
  onNoShow,
  busy,
}) => {
  return (
    <CuraCard
      title="Appointment Details"
      className="staff-appointment-detail-card"
    >
      {!appointment ? (
        <div className="staff-appointment-detail-empty">
          <CalendarDays size={40} />

          <h3>No appointment selected</h3>

          <p>
            Select an appointment from the
            list to view its details.
          </p>
        </div>
      ) : (
        <div className="staff-appointment-details">

          <div className="staff-appointment-detail-profile">

            <div className="staff-appointment-detail-avatar">
              {getInitials(
                appointment.patient
              )}
            </div>

            <div>
              <h3>
                {getPatientName(
                  appointment.patient
                )}
              </h3>

              <p>
                {appointment.patient
                  ?.patient_number ||
                  "—"}
              </p>
            </div>

            <span
              className={`staff-appointment-status ${statusClass(
                appointment.status
              )}`}
            >
              {formatStatus(
                appointment.status
              )}
            </span>

          </div>

          <div className="staff-appointment-detail-list">

            <DetailRow
              label="Appointment Number"
              value={
                appointment.appointment_number
              }
            />

            <DetailRow
              label="Date"
              value={formatDate(
                appointment.appointment_date
              )}
            />

            <DetailRow
              label="Time"
              value={formatTime(
                appointment.appointment_time
              )}
            />

            <DetailRow
              label="Appointment Type"
              value={formatType(
                appointment.appointment_type
              )}
            />

            <DetailRow
              label="Status"
              value={formatStatus(
                appointment.status
              )}
            />

            <DetailRow
              label="Doctor"
              value={getDoctorName(
                appointment.doctor
              )}
            />

            <DetailRow
              label="Contact"
              value={
                appointment.patient
                  ?.phone_number || "—"
              }
            />

            <DetailRow
              label="Checked In"
              value={
                appointment.checked_in_at
                  ? formatDateTime(
                      appointment.checked_in_at
                    )
                  : "Not checked in"
              }
            />

          </div>

          <div className="staff-appointment-reason">
            <span>Reason for Visit</span>

            <p>
              {appointment.reason_for_visit ||
                "No reason provided."}
            </p>
          </div>

          {appointment.status ===
            "checked_in" && (
            <div className="staff-appointment-next-step">
              <CheckCircle2 size={18} />

              <div>
                <strong>
                  Patient checked in
                </strong>

                <p>
                  Next step: record the
                  patient's vital signs.
                </p>
              </div>
            </div>
          )}

          {appointment.status ===
            "scheduled" && (
            <div className="staff-appointment-detail-actions">

              <button
                type="button"
                className="complete"
                disabled={busy}
                onClick={() =>
                  onCheckIn(appointment)
                }
              >
                <CheckCircle2 size={15} />
                Check In
              </button>

              <button
                type="button"
                className="reschedule"
                disabled={busy}
                onClick={() =>
                  onEdit(appointment)
                }
              >
                <Clock3 size={15} />
                Reschedule
              </button>

              <button
                type="button"
                className="cancel"
                disabled={busy}
                onClick={() =>
                  onCancel(appointment)
                }
              >
                <XCircle size={15} />
                Cancel
              </button>

              <button
                type="button"
                className="cancel"
                disabled={busy}
                onClick={() =>
                  onNoShow(appointment)
                }
              >
                No Show
              </button>

            </div>
          )}

        </div>
      )}
    </CuraCard>
  );
};

export default StaffAppointmentDetails;