import usePatients from "../../../shared/hooks/usePatients";
import {
  getPatientAddress,
  getPatientAge,
  getPatientFullName,
  getPatientInitials,
  getPatientStatusClass,
} from "../../../shared/utils/patientUtils";

import StaffPatientDetails from "../components/patients/StaffPatientDetails";
import StaffPatientFilters from "../components/patients/StaffPatientFilters";
import StaffPatientStats from "../components/patients/StaffPatientStats";
import StaffPatientTable from "../components/patients/StaffPatientTable";

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
    <div className="staff-patients-page">
      <StaffPatientStats
        total={stats.total || 0}
        active={stats.active || 0}
        inactive={stats.inactive || 0}
        newThisMonth={stats.new_this_month || 0}
      />

      <StaffPatientFilters
        search={search}
        setSearch={changeFilter(setSearch)}
        statusFilter={statusFilter}
        setStatusFilter={changeFilter(setStatusFilter)}
        sexFilter={sexFilter}
        setSexFilter={changeFilter(setSexFilter)}
        ageFilter={ageFilter}
        setAgeFilter={changeFilter(setAgeFilter)}
        sortBy={sortBy}
        setSortBy={changeFilter(setSortBy)}
      />

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
    </div>
  );
};

export default Patients;
