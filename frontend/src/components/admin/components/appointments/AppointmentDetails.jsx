import {
  CalendarDays,
  CircleUserRound,
  Clock3,
  Stethoscope,
} from "lucide-react";

import CuraCard from "../../../common/CuraCard";

import {
  getAppointmentPatientName,
  getAppointmentDoctorName,
  formatAppointmentDate,
  formatAppointmentTime,
  formatAppointmentLabel,
  getAppointmentStatusClass,
} from "../../../../shared/utils/appointmentUtils";

const AppointmentDetails = ({ appointment }) => (
  <CuraCard title="Appointment Details" className="appointments-details-card">
    {!appointment ? (
      <div className="appointments-details-empty">
        <CalendarDays size={34} />
        <p>Select an appointment</p>
        <span>Appointment information will appear here.</span>
      </div>
    ) : (
      <div className="appointments-details">
        <div className="appointments-details-header">
          <CircleUserRound size={35} />

          <div>
            <h3>{getAppointmentPatientName(appointment.patient)}</h3>
            <p>{appointment.appointment_number || "—"}</p>
          </div>

          <span
            className={`appointment-status ${getAppointmentStatusClass(
              appointment.status
            )}`}
          >
            {formatAppointmentLabel(appointment.status)}
          </span>
        </div>

        <div className="appointments-details-list">
          <DetailRow
            icon={<CalendarDays size={16} />}
            label="Date"
            value={formatAppointmentDate(appointment.appointment_date)}
          />

          <DetailRow
            icon={<Clock3 size={16} />}
            label="Time"
            value={formatAppointmentTime(appointment.appointment_time)}
          />

          <DetailRow
            icon={<Stethoscope size={16} />}
            label="Doctor"
            value={getAppointmentDoctorName(appointment.doctor)}
          />

          <DetailRow
            label="Visit Type"
            value={formatAppointmentLabel(appointment.appointment_type)}
          />

          <DetailRow
            label="Status"
            value={formatAppointmentLabel(appointment.status)}
          />

          <DetailRow
            label="Reason for Visit"
            value={appointment.reason_for_visit || "—"}
          />
        </div>
      </div>
    )}
  </CuraCard>
);

const DetailRow = ({ icon, label, value }) => (
  <div className="appointment-detail-row">
    {icon && <div className="appointment-detail-icon">{icon}</div>}

    <div>
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  </div>
);

export default AppointmentDetails;