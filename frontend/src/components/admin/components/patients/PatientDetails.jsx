import {
  CircleUserRound,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import CuraCard from "../../../common/CuraCard";

const PatientDetails = ({
  selectedPatient,
  getFullName,
  getInitials,
  getAge,
  getAddress,
  getStatusClass,
}) => {
  const formatDate = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleDateString(
      "en-PH",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  return (
    <CuraCard
      title="Patient Details"
      className="patient-summary-card"
    >
      {!selectedPatient ? (
        <div className="patient-summary-empty">
          <CircleUserRound size={36} />
          <p>Select a patient</p>
          <span>
            Patient information will appear here.
          </span>
        </div>
      ) : (
        <div className="patient-summary">

          <div className="patient-summary-header">
            <div className="patient-summary-avatar">
              {getInitials(selectedPatient)}
            </div>

            <div className="patient-summary-heading">
              <h3>
                {getFullName(selectedPatient)}
              </h3>

              <p>
                {selectedPatient.patient_number}
                <span> • </span>
                {getAge(selectedPatient.birth_date)} years
                <span> • </span>
                {selectedPatient.sex || "—"}
              </p>
            </div>

            <span
              className={`patient-status ${getStatusClass(
                selectedPatient.status
              )}`}
            >
              {selectedPatient.status || "—"}
            </span>
          </div>


          <div className="users-details-section">
            <h4>Personal Information</h4>

            <div className="users-information-list">
              <DetailRow
                label="Patient ID"
                value={selectedPatient.patient_number}
              />

              <DetailRow
                label="Birth Date"
                value={formatDate(
                  selectedPatient.birth_date
                )}
              />

              <DetailRow
                label="Age"
                value={`${getAge(
                  selectedPatient.birth_date
                )} years`}
              />

              <DetailRow
                label="Sex"
                value={selectedPatient.sex}
              />

              <DetailRow
                label="Blood Type"
                value={
                  selectedPatient.blood_type || "—"
                }
              />

              <DetailRow
                label="Status"
                value={selectedPatient.status}
              />
            </div>
          </div>


          <div className="patient-contact-section">
            <h4>
              <CircleUserRound size={17} />
              Contact Information
            </h4>

            <div className="patient-contact-item">
              <div className="patient-contact-icon">
                <Phone size={18} />
              </div>

              <div>
                <span>Contact Number</span>
                <strong>
                  {selectedPatient.phone_number ||
                    "—"}
                </strong>
              </div>
            </div>

            <div className="patient-contact-item">
              <div className="patient-contact-icon">
                <Mail size={18} />
              </div>

              <div>
                <span>Email</span>
                <strong>
                  {selectedPatient.email || "—"}
                </strong>
              </div>
            </div>

            <div className="patient-contact-item">
              <div className="patient-contact-icon">
                <MapPin size={18} />
              </div>

              <div>
                <span>Address</span>
                <strong>
                  {getAddress(selectedPatient)}
                </strong>
              </div>
            </div>
          </div>


          <div className="patient-contact-section">
            <h4>Emergency Contact</h4>

            <div className="users-information-list">
              <DetailRow
                label="Name"
                value={
                  selectedPatient
                    .emergency_contact_name || "—"
                }
              />

              <DetailRow
                label="Relationship"
                value={
                  selectedPatient
                    .emergency_contact_relationship ||
                  "—"
                }
              />

              <DetailRow
                label="Phone"
                value={
                  selectedPatient
                    .emergency_contact_phone || "—"
                }
              />
            </div>
          </div>

        </div>
      )}
    </CuraCard>
  );
};

const DetailRow = ({ label, value }) => (
  <div>
    <span>{label}</span>
    <strong>{value || "—"}</strong>
  </div>
);

export default PatientDetails;