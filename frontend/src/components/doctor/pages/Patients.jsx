
import useDoctorPatients from "../hooks/useDoctorPatients";

import {
  getPatientAddress,
  getPatientAge,
  getPatientFullName,
  getPatientInitials,
  getPatientStatusClass,
} from "../../../shared/utils/patientUtils";

import StaffPatientDetails from "../../staff/components/patients/StaffPatientDetails";
import StaffPatientTable from "../../staff/components/patients/StaffPatientTable";
import DoctorMedicalHistory from "../components/patients/DoctorMedicalHistory";


const Patients = () => {
const {
  patients,
  loading,
  error,
  stats,
  pagination,
  selectedPatient,
  setSelectedPatient,
  setPage,
} = useDoctorPatients();


  return (
    <div className="staff-patients-page">
      {/* Doctor Patients Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#263d3c]">
          My Patients
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Manage your assigned patients and view their
          medical information.
        </p>
      </div>

      {/* Doctor-Specific Statistics */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-emerald-100 bg-white p-5">
          <p className="text-sm text-gray-500">
            Assigned Patients Today
          </p>
          <h3 className="mt-2 text-2xl font-bold text-emerald-700">
            {stats.total ?? 0}
          </h3>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-white p-5">
          <p className="text-sm text-gray-500">
            Active Assigned Patients
          </p>
          <h3 className="mt-2 text-2xl font-bold text-emerald-700">
            {stats.active ?? 0}
          </h3>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-white p-5">
          <p className="text-sm text-gray-500">
            Newly Registered Assigned Patients
          </p>
          <h3 className="mt-2 text-2xl font-bold text-emerald-700">
            {stats.new_this_month ?? 0}
          </h3>
        </div>
      </div>

      {/* Reuse Staff Patient Filters */}

      {/* Patient List and Patient Details */}
      <div className="staff-patients-content-grid">
        <StaffPatientTable
          patients={patients}
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
          getFullName={getPatientFullName}
          getInitials={getPatientInitials}
          getAge={getPatientAge}
          getStatusClass={getPatientStatusClass}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={setPage}
        />

        <StaffPatientDetails
          patient={selectedPatient}
          getFullName={getPatientFullName}
          getInitials={getPatientInitials}
          getAge={getPatientAge}
          getAddress={getPatientAddress}
          getStatusClass={getPatientStatusClass}
        />
      </div>

      {/* Full-Width Medical History */}
      {selectedPatient && (
        <div className="mt-6 min-w-0 w-full">
          <DoctorMedicalHistory
            key={selectedPatient.id}
            patientId={selectedPatient.id}
          />
        </div>
      )}
    </div>
  );
};

export default Patients;
