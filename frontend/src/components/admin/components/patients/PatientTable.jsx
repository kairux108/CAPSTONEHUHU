import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import CuraCard from "../../../common/CuraCard";
import FeedbackMessage from "../../../common/FeedbackMessage";

const PatientTable = ({
  patients,
  selectedPatient,
  setSelectedPatient,
  getFullName,
  getInitials,
  getAge,
  getStatusClass,
  loading,
  error,
  pagination,
  onPageChange,
}) => {
  const currentPage = pagination.current_page || 1;
  const lastPage = pagination.last_page || 1;

  return (
    <CuraCard
      title={`Patients${
        pagination.total
          ? ` (${pagination.total})`
          : ""
      }`}
      className="patients-list-card"
    >
      <div className="patients-table-wrapper">

        {loading && (
          <FeedbackMessage
            type="loading"
            title="Loading patients..."
            message="Please wait while patient records are being loaded."
          />
        )}

        {!loading && error && (
          <FeedbackMessage
            type="error"
            title="Unable to load patients"
            message={error}
          />
        )}

        {!loading && !error && patients.length > 0 && (
          <table className="patients-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Sex</th>
                <th>Contact</th>
                <th>Blood Type</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {patients.map((patient) => (
                <tr
                  key={patient.id}
                  className={
                    selectedPatient?.id === patient.id
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setSelectedPatient(patient)
                  }
                >
                  <td>
                    {patient.patient_number || "—"}
                  </td>

                  <td>
                    <div className="patient-name-cell">
                      <div className="patient-avatar">
                        {getInitials(patient)}
                      </div>

                      <strong>
                        {getFullName(patient)}
                      </strong>
                    </div>
                  </td>

                  <td>
                    {getAge(patient.birth_date)}
                  </td>

                  <td>
                    {patient.sex || "—"}
                  </td>

                  <td>
                    {patient.phone_number || "—"}
                  </td>

                  <td>
                    {patient.blood_type || "—"}
                  </td>

                  <td>
                    <span
                      className={`patient-status ${getStatusClass(
                        patient.status
                      )}`}
                    >
                      {patient.status || "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && !error && patients.length === 0 && (
          <FeedbackMessage
            type="empty"
            title="No patients found"
            message="No patient records match the selected filters."
          />
        )}

      </div>

      {!loading && !error && pagination.total > 0 && (
        <div className="patients-pagination">

          <span>
            Showing {patients.length} of{" "}
            {pagination.total} patients
          </span>

          <div className="patients-pagination-controls">

            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() =>
                onPageChange(currentPage - 1)
              }
            >
              <ChevronLeft size={15} />
            </button>

            <button
              type="button"
              className="active"
            >
              {currentPage}
            </button>

            <span>
              of {lastPage}
            </span>

            <button
              type="button"
              disabled={currentPage >= lastPage}
              onClick={() =>
                onPageChange(currentPage + 1)
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

export default PatientTable;