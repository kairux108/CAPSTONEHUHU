import { useCallback, useEffect, useState } from "react";

import patientService from "../../../services/patientService";

import StaffPatientStats from "../components/patients/StaffPatientStats";
import StaffPatientFilters from "../components/patients/StaffPatientFilters";
import StaffPatientTable from "../components/patients/StaffPatientTable";
import StaffPatientDetails from "../components/patients/StaffPatientDetails";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sexFilter, setSexFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [page, setPage] = useState(1);

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    new_this_month: 0,
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });


  /*
  |--------------------------------------------------------------------------
  | LOAD PATIENTS
  |--------------------------------------------------------------------------
  */

  const loadPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await patientService.getAll({
        page,
        search: search.trim(),
        status: statusFilter === "all" ? "" : statusFilter,
        sex: sexFilter === "all" ? "" : sexFilter,
        age_group: ageFilter === "all" ? "" : ageFilter,
        sort: sortBy,
      });

      setPatients(data.patients || []);
      setStats(data.stats || {});
      setPagination(data.pagination || {});
    } catch (error) {
      console.error("Failed to load patients:", error);
      setError(error.message || "Unable to load patients.");
    } finally {
      setLoading(false);
    }
  }, [
    page,
    search,
    statusFilter,
    sexFilter,
    ageFilter,
    sortBy,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPatients();
    }, 300);

    return () => clearTimeout(timer);
  }, [loadPatients]);


  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
    setSelectedPatient(null);
  };


  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */

  const getFullName = (patient) =>
    [
      patient?.first_name,
      patient?.middle_name,
      patient?.last_name,
      patient?.suffix,
    ]
      .filter(Boolean)
      .join(" ");

  const getInitials = (patient) =>
    [patient?.first_name, patient?.last_name]
      .filter(Boolean)
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const getAge = (birthDate) => {
    if (!birthDate) return "—";

    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const month = today.getMonth() - birth.getMonth();

    if (
      month < 0 ||
      (month === 0 &&
        today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const getStatusClass = (status) => {
    const normalized = String(status || "")
      .trim()
      .toLowerCase();

    if (normalized === "active") return "active";
    if (normalized === "inactive") return "inactive";

    return "default";
  };


  /*
  |--------------------------------------------------------------------------
  | PAGE
  |--------------------------------------------------------------------------
  */

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
          getFullName={getFullName}
          getInitials={getInitials}
          getAge={getAge}
          getStatusClass={getStatusClass}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={setPage}
        />

        <StaffPatientDetails
          patient={selectedPatient}
          getFullName={getFullName}
          getInitials={getInitials}
          getAge={getAge}
          getStatusClass={getStatusClass}
        />

      </div>

    </div>
  );
};

export default Patients;