import usePatients from "../../../hooks/usePatients";

import {
  getPatientFullName,
  getPatientInitials,
  getPatientAge,
  getPatientAddress,
  getPatientStatusClass,
} from "../../../utils/patientUtils";

import PatientStats from "../patients/PatientStats";
import PatientFilters from "../patients/PatientFilters";
import PatientTable from "../patients/PatientTable";
import PatientDetails from "../patients/PatientDetails";

const Patients = () => {
  const {
    patients,
    loading,
    error,
    stats,
    pagination,
    selectedPatient,
    setSelectedPatient,
    search,
    setSearch,
    sexFilter,
    setSexFilter,
    ageFilter,
    setAgeFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    setPage,
    changeFilter,
  } = usePatients();

  return (
    <div className="patients-page">
      <PatientStats
        total={stats.total || 0}
        active={stats.active || 0}
        inactive={stats.inactive || 0}
        newThisMonth={stats.new_this_month || 0}
      />

      <PatientFilters
        search={search}
        setSearch={changeFilter(setSearch)}
        sexFilter={sexFilter}
        setSexFilter={changeFilter(setSexFilter)}
        ageFilter={ageFilter}
        setAgeFilter={changeFilter(setAgeFilter)}
        statusFilter={statusFilter}
        setStatusFilter={changeFilter(setStatusFilter)}
        sortBy={sortBy}
        setSortBy={changeFilter(setSortBy)}
      />

      <div className="patients-content-grid">
        <PatientTable
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

        <PatientDetails
          selectedPatient={selectedPatient}
          getFullName={getPatientFullName}
          getInitials={getPatientInitials}
          getAge={getPatientAge}
          getAddress={getPatientAddress}
          getStatusClass={getPatientStatusClass}
        />
      </div>
    </div>
  );
};

export default Patients;