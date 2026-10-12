import { ChevronLeft, ChevronRight } from "lucide-react";

import CuraCard from "../../common/CuraCard";
import FeedbackMessage from "../../common/FeedbackMessage";

import {
  getAppointmentPatientName,
  getAppointmentPatientInitials,
  getAppointmentDoctorName,
  formatAppointmentTime,
  formatAppointmentLabel,
  getStaffAppointmentStatusClass,
} from "../../../utils/appointmentUtils";

const StaffAppointmentTable = ({
  appointments = [],
  selectedAppointment,
  setSelectedAppointment,
  loading,
  error,
  pagination = {},
  onPageChange,
}) => {
  const currentPage = pagination.current_page || 1;
  const lastPage = pagination.last_page || 1;

  return (
    <CuraCard
      title={`Appointments (${pagination.total || 0})`}
      className="staff-appointment-list-card"
    >
      <div className="staff-appointment-table-wrapper">
        {loading && (
          <FeedbackMessage
            type="loading"
            title="Loading appointments..."
            message="Please wait while appointment records are being loaded."
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
          <table className="staff-appointment-table">
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
                  className={
                    selectedAppointment?.id === appointment.id
                      ? "selected"
                      : ""
                  }
                  onClick={() => setSelectedAppointment(appointment)}
                >
                  <td>
                    {formatAppointmentTime(
                      appointment.appointment_time
                    )}
                  </td>

                  <td>
                    <div className="staff-appointment-patient">
                      <div className="staff-appointment-avatar">
                        {getAppointmentPatientInitials(
                          appointment.patient
                        )}
                      </div>

                      <div>
                        <strong>
                          {getAppointmentPatientName(
                            appointment.patient
                          )}
                        </strong>

                        <span>
                          {appointment.patient?.patient_number || "—"}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="staff-appointment-type">
                      {formatAppointmentLabel(
                        appointment.appointment_type
                      )}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`staff-appointment-status ${getStaffAppointmentStatusClass(
                        appointment.status
                      )}`}
                    >
                      {formatAppointmentLabel(
                        appointment.status
                      )}
                    </span>
                  </td>

                  <td>
                    {getAppointmentDoctorName(
                      appointment.doctor
                    )}
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
            message="No appointments match the selected date and filters."
          />
        )}
      </div>

      {!loading && !error && pagination.total > 0 && (
        <div className="staff-appointment-pagination">
          <span>
            Showing {appointments.length} of{" "}
            {pagination.total} appointments
          </span>

          <div>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() =>
                onPageChange?.(currentPage - 1)
              }
            >
              <ChevronLeft size={15} />
            </button>

            <button type="button" className="active">
              {currentPage}
            </button>

            <span>of {lastPage}</span>

            <button
              type="button"
              disabled={currentPage >= lastPage}
              onClick={() =>
                onPageChange?.(currentPage + 1)
              }
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </CuraCard>
  );
};

export default StaffAppointmentTable;