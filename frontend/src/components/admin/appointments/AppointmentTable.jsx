import { ChevronLeft, ChevronRight } from "lucide-react";

import CuraCard from "../../common/CuraCard";
import FeedbackMessage from "../../common/FeedbackMessage";

import {
  getAppointmentPatientName,
  getAppointmentPatientInitials,
  getAppointmentDoctorName,
  formatAppointmentTime,
  formatAppointmentLabel,
  getAppointmentStatusClass,
} from "../../../utils/appointmentUtils";

const AppointmentTable = ({
  appointments = [],
  selectedAppointment,
  setSelectedAppointment,
  loading,
  error,
  pagination = {},
}) => {
  const currentPage = pagination.current_page || 1;
  const lastPage = pagination.last_page || 1;
  const onPageChange = pagination.onPageChange;

  return (
    <CuraCard
      title={`Appointments${pagination.total ? ` (${pagination.total})` : ""}`}
      className="appointments-list-card"
    >
      <div className="appointments-table-wrapper">
        {loading && (
          <FeedbackMessage
            type="loading"
            title="Loading appointments..."
            message="Please wait while appointments are being loaded."
          />
        )}

        {!loading && error && (
          <FeedbackMessage
            type="error"
            title="Unable to load appointments"
            message={error}
          />
        )}

        {!loading && !error && appointments.length > 0 && (
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Patient</th>
                <th>Type</th>
                <th>Status</th>
                <th>Doctor</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className={selectedAppointment?.id === appointment.id ? "selected" : ""}
                  onClick={() => setSelectedAppointment(appointment)}
                >
                  <td className="appointment-time">
                    {formatAppointmentTime(appointment.appointment_time)}
                  </td>

                  <td>
                    <div className="appointment-patient-cell">
                      <div className="appointment-patient-avatar">
                        {getAppointmentPatientInitials(appointment.patient)}
                      </div>

                      <div className="appointment-patient-info">
                        <strong>{getAppointmentPatientName(appointment.patient)}</strong>
                        <span>{appointment.patient?.patient_number || "—"}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className={`appointment-type ${appointment.appointment_type || ""}`}>
                      {formatAppointmentLabel(appointment.appointment_type)}
                    </span>
                  </td>

                  <td>
                    <span className={`appointment-status ${getAppointmentStatusClass(appointment.status)}`}>
                      {formatAppointmentLabel(appointment.status)}
                    </span>
                  </td>

                  <td className="appointment-doctor">
                    {getAppointmentDoctorName(appointment.doctor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && !error && appointments.length === 0 && (
          <FeedbackMessage
            type="empty"
            title="No appointments found"
            message="No appointments match the selected filters."
          />
        )}
      </div>

      {!loading && !error && pagination.total > 0 && (
        <div className="appointments-pagination">
          <span>
            Showing {appointments.length} of {pagination.total} appointments
          </span>

          <div className="appointments-pagination-controls">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange?.(currentPage - 1)}
            >
              <ChevronLeft size={15} />
            </button>

            <span>Page {currentPage} of {lastPage}</span>

            <button
              type="button"
              disabled={currentPage >= lastPage}
              onClick={() => onPageChange?.(currentPage + 1)}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </CuraCard>
  );
};

export default AppointmentTable;