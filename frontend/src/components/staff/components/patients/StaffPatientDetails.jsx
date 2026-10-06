import {
  CalendarDays,
  CircleUserRound,
  Phone,
  UserRoundCheck,
} from "lucide-react";

import CuraCard from "../../../common/CuraCard";

const StaffPatientDetails = ({
  patient,
  getFullName,
  getInitials,
  getAge,
  getStatusClass,
}) => {
  const formatDate = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getAddress = (patient) =>
    [
      patient?.street_address,
      patient?.barangay,
      patient?.city,
      patient?.province,
    ]
      .filter(Boolean)
      .join(", ") || "—";

  return (
    <CuraCard
      title="Patient Details"
      className="staff-patient-details-card"
    >
      {!patient ? (
        <div className="staff-patient-details-empty">

          <div className="staff-patient-details-empty-avatar">
            <CircleUserRound size={43} />
          </div>

          <h3>No patient selected</h3>

          <p>
            Select a patient from the list to view their details.
          </p>

          <div className="staff-patient-detail-placeholder">

            <DetailPlaceholder
              icon={<CircleUserRound size={17} />}
              title="Personal Information"
            />

            <DetailPlaceholder
              icon={<Phone size={17} />}
              title="Contact Information"
            />

            <DetailPlaceholder
              icon={<UserRoundCheck size={17} />}
              title="Patient Status"
            />

            <DetailPlaceholder
              icon={<CalendarDays size={17} />}
              title="Registration Information"
            />

          </div>
        </div>
      ) : (
        <div className="staff-patient-details">

          <div className="staff-patient-details-profile">

            <div className="staff-patient-details-avatar">
              {getInitials(patient)}
            </div>

            <div className="staff-patient-details-heading">
              <h3>{getFullName(patient)}</h3>
              <p>{patient.patient_number}</p>
            </div>

            <span
              className={`staff-patient-status ${getStatusClass(
                patient.status
              )}`}
            >
              {patient.status || "—"}
            </span>

          </div>


          <DetailSection
            icon={<CircleUserRound size={17} />}
            title="Personal Information"
          >
            <DetailRow
              label="Full Name"
              value={getFullName(patient)}
            />

            <DetailRow
              label="Birth Date"
              value={formatDate(patient.birth_date)}
            />

            <DetailRow
              label="Age"
              value={`${getAge(patient.birth_date)} years old`}
            />

            <DetailRow
              label="Sex"
              value={patient.sex || "—"}
            />

            <DetailRow
              label="Blood Type"
              value={patient.blood_type || "—"}
            />
          </DetailSection>


          <DetailSection
            icon={<Phone size={17} />}
            title="Contact Information"
          >
            <DetailRow
              label="Phone"
              value={patient.phone_number || "—"}
            />

            <DetailRow
              label="Email"
              value={patient.email || "—"}
            />

            <DetailRow
              label="Address"
              value={getAddress(patient)}
            />
          </DetailSection>


          <DetailSection
            icon={<UserRoundCheck size={17} />}
            title="Patient Status"
          >
            <DetailRow
              label="Status"
              value={patient.status || "—"}
            />
          </DetailSection>


          <DetailSection
            icon={<CalendarDays size={17} />}
            title="Registration Information"
          >
            <DetailRow
              label="Patient ID"
              value={patient.patient_number || "—"}
            />

            <DetailRow
              label="Date Registered"
              value={formatDate(patient.created_at)}
            />
          </DetailSection>


          <DetailSection
            icon={<Phone size={17} />}
            title="Emergency Contact"
          >
            <DetailRow
              label="Name"
              value={
                patient.emergency_contact_name || "—"
              }
            />

            <DetailRow
              label="Relationship"
              value={
                patient.emergency_contact_relationship || "—"
              }
            />

            <DetailRow
              label="Contact Number"
              value={
                patient.emergency_contact_phone || "—"
              }
            />
          </DetailSection>

        </div>
      )}
    </CuraCard>
  );
};


const DetailSection = ({
  icon,
  title,
  children,
}) => (
  <section className="staff-patient-detail-section">

    <h4>
      {icon}
      {title}
    </h4>

    <div className="staff-patient-detail-rows">
      {children}
    </div>

  </section>
);


const DetailRow = ({ label, value }) => (
  <div className="staff-patient-detail-row">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);


const DetailPlaceholder = ({
  icon,
  title,
}) => (
  <div className="staff-patient-placeholder-section">

    <div>
      {icon}
      <span>{title}</span>
    </div>

    <i />
    <i />

  </div>
);

export default StaffPatientDetails;