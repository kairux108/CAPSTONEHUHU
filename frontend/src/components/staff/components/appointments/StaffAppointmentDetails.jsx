import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ListOrdered,
  XCircle,
} from "lucide-react";

import CuraCard from "../../../common/CuraCard";

import {
  getAppointmentPatientName,
  getAppointmentPatientInitials,
  getAppointmentDoctorName,
  formatAppointmentDate,
  formatAppointmentTime,
  formatAppointmentDateTime,
  formatAppointmentLabel,
} from "../../../../shared/utils/appointmentUtils";
import { getStaffAppointmentStatusClass } from "../../utils/appointmentUtils";

import {
  formatBloodPressure,
  formatOxygenSaturation,
  formatTemperature,
  formatHeartRate,
  formatRespiratoryRate,
  formatWeight,
  formatHeight,
  formatVitalDateTime,
} from "../../utils/vitalSignUtils";

const DetailRow = ({ label, value }) => (
  <div className="staff-appointment-detail-row">
    <span>{label}</span>
    <strong>{value || "—"}</strong>
  </div>
);

const VitalRow = ({ label, value }) => (
  <div className="staff-appointment-vital-row">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const QueueRow = ({ label, value }) => (
  <div className="staff-appointment-queue-row">
    <span>{label}</span>
    <strong>{value || "—"}</strong>
  </div>
);

const StaffAppointmentDetails = ({
  appointment,
  vitalSign,
  loadingVitals,

  queueEntry,
  savingQueue,
  onSendToQueue,

  onCheckIn,
  onEdit,
  onCancel,
  onNoShow,
  onRecordVitals,

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
            Select an appointment from the list to view its details.
          </p>
        </div>
      ) : (
        <div className="staff-appointment-details">

          {/* PATIENT PROFILE */}

          <div className="staff-appointment-detail-profile">
            <div className="staff-appointment-detail-avatar">
              {getAppointmentPatientInitials(
                appointment.patient
              )}
            </div>

            <div>
              <h3>
                {getAppointmentPatientName(
                  appointment.patient
                )}
              </h3>

              <p>
                {appointment.patient?.patient_number || "—"}
              </p>
            </div>

            <span
              className={`staff-appointment-status ${getStaffAppointmentStatusClass(
                appointment.status
              )}`}
            >
              {formatAppointmentLabel(
                appointment.status
              )}
            </span>
          </div>

          {/* APPOINTMENT INFORMATION */}

          <div className="staff-appointment-detail-list">
            <DetailRow
              label="Appointment Number"
              value={appointment.appointment_number}
            />

            <DetailRow
              label="Date"
              value={formatAppointmentDate(
                appointment.appointment_date
              )}
            />

            <DetailRow
              label="Time"
              value={formatAppointmentTime(
                appointment.appointment_time
              )}
            />

            <DetailRow
              label="Appointment Type"
              value={formatAppointmentLabel(
                appointment.appointment_type
              )}
            />

            <DetailRow
              label="Status"
              value={formatAppointmentLabel(
                appointment.status
              )}
            />

            <DetailRow
              label="Doctor"
              value={getAppointmentDoctorName(
                appointment.doctor
              )}
            />

            <DetailRow
              label="Contact"
              value={
                appointment.patient?.phone_number || "—"
              }
            />

            <DetailRow
              label="Checked In"
              value={
                appointment.checked_in_at
                  ? formatAppointmentDateTime(
                      appointment.checked_in_at
                    )
                  : "Not checked in"
              }
            />
          </div>

          {/* REASON FOR VISIT */}

          <div className="staff-appointment-reason">
            <span>Reason for Visit</span>

            <p>
              {appointment.reason_for_visit ||
                "No reason provided."}
            </p>
          </div>

          {/* CHECKED-IN WORKFLOW */}

          {appointment.status === "checked_in" && (
            <>
              {/* VITAL SIGNS */}

              {loadingVitals ? (
                <div className="staff-appointment-vitals-loading">
                  Loading vital signs...
                </div>
              ) : vitalSign ? (
                <>
                  <div className="staff-appointment-vitals-header">
                    <div className="staff-appointment-vitals-title">
                      <div className="staff-appointment-vitals-icon">
                        <Activity size={17} />
                      </div>

                      <div>
                        <strong>
                          Vital Signs Recorded
                        </strong>

                        <p>
                          {formatVitalDateTime(
                            vitalSign.created_at
                          )}
                        </p>
                      </div>
                    </div>

                    <CheckCircle2 size={19} />
                  </div>

                  <div className="staff-appointment-vitals-grid">
                    <VitalRow
                      label="Blood Pressure"
                      value={formatBloodPressure(
                        vitalSign.blood_pressure_systolic,
                        vitalSign.blood_pressure_diastolic
                      )}
                    />

                    <VitalRow
                      label="SpO₂"
                      value={formatOxygenSaturation(
                        vitalSign.oxygen_saturation
                      )}
                    />

                    <VitalRow
                      label="Temperature"
                      value={formatTemperature(
                        vitalSign.temperature
                      )}
                    />

                    <VitalRow
                      label="Heart Rate"
                      value={formatHeartRate(
                        vitalSign.heart_rate
                      )}
                    />

                    <VitalRow
                      label="Respiratory Rate"
                      value={formatRespiratoryRate(
                        vitalSign.respiratory_rate
                      )}
                    />

                    <VitalRow
                      label="Weight"
                      value={formatWeight(
                        vitalSign.weight
                      )}
                    />

                    <VitalRow
                      label="Height"
                      value={formatHeight(
                        vitalSign.height
                      )}
                    />
                  </div>

                  {vitalSign.recorder?.name && (
                    <div className="staff-appointment-vitals-recorder">
                      Recorded by{" "}
                      <strong>
                        {vitalSign.recorder.name}
                      </strong>
                    </div>
                  )}
                </>
              ) : (
                <div className="staff-appointment-next-step">
                  <CheckCircle2 size={18} />

                  <div>
                    <strong>
                      Patient checked in
                    </strong>

                    <p>
                      Patient is ready for the queue.
                      Vital signs may be recorded if
                      needed.
                    </p>
                  </div>
                </div>
              )}

              {/* QUEUE INFORMATION */}

              {queueEntry && (
                <div className="staff-appointment-queue-summary">
                  <div className="staff-appointment-queue-header">
                    <div className="staff-appointment-queue-title">
                      <div className="staff-appointment-queue-icon">
                        <ListOrdered size={17} />
                      </div>

                      <div>
                        <strong>
                          Patient in Queue
                        </strong>

                        <p>
                          Waiting for the next available
                          consultation.
                        </p>
                      </div>
                    </div>

                    <CheckCircle2 size={19} />
                  </div>

                  <div className="staff-appointment-queue-grid">
                    <QueueRow
                      label="Queue Number"
                      value={queueEntry.queue_number}
                    />

                    <QueueRow
                      label="Status"
                      value={formatAppointmentLabel(
                        queueEntry.status
                      )}
                    />

                    <QueueRow
                      label="Priority"
                      value={formatAppointmentLabel(
                        queueEntry.priority
                      )}
                    />

                    <QueueRow
                      label="Doctor"
                      value={
                        queueEntry.doctor?.name ||
                        appointment.doctor?.name ||
                        "Unassigned"
                      }
                    />

                    <QueueRow
                      label="Estimated Wait"
                      value={
                        queueEntry.estimated_wait_minutes !=
                        null
                          ? `${queueEntry.estimated_wait_minutes} min`
                          : "Not available"
                      }
                    />

                    <QueueRow
                      label="Queued At"
                      value={formatAppointmentDateTime(
                        queueEntry.queued_at
                      )}
                    />
                  </div>
                </div>
              )}

              {/* CHECKED-IN ACTIONS */}

              {!loadingVitals && (
                <div className="staff-appointment-detail-actions">

                  {/* QUEUE IS NOW THE MAIN ACTION */}

                  {!queueEntry && (
                    <button
                      type="button"
                      className="complete"
                      disabled={
                        busy || savingQueue
                      }
                      onClick={() =>
                        onSendToQueue(
                          appointment
                        )
                      }
                    >
                      <ListOrdered size={15} />

                      {savingQueue
                        ? "Sending..."
                        : "Send to Queue"}
                    </button>
                  )}

                  {/* VITAL SIGNS ARE OPTIONAL */}

                  <button
                    type="button"
                    className="reschedule"
                    disabled={
                      busy || savingQueue
                    }
                    onClick={() =>
                      onRecordVitals(
                        appointment
                      )
                    }
                  >
                    <Activity size={15} />

                    {vitalSign
                      ? "Edit Vital Signs"
                      : "Record Vital Signs"}
                  </button>
                </div>
              )}
            </>
          )}

          {/* SCHEDULED APPOINTMENT ACTIONS */}

          {appointment.status === "scheduled" && (
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