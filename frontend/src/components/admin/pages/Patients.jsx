import { useCallback, useEffect, useState } from "react";

import patientService from "../../../services/patientService";

import PatientStats from "../components/patients/PatientStats";
import PatientFilters from "../components/patients/PatientFilters";
import PatientTable from "../components/patients/PatientTable";
import PatientDetails from "../components/patients/PatientDetails";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sexFilter, setSexFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
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
        sex: sexFilter === "all" ? "" : sexFilter,
        age_group: ageFilter === "all" ? "" : ageFilter,
        status: statusFilter === "all" ? "" : statusFilter,
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
    sexFilter,
    ageFilter,
    statusFilter,
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
  | FILTER HELPERS
  |--------------------------------------------------------------------------
  */

  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
    setSelectedPatient(null);
  };


  /*
  |--------------------------------------------------------------------------
  | DISPLAY HELPERS
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

    const monthDifference =
      today.getMonth() - birth.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
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
          getFullName={getFullName}
          getInitials={getInitials}
          getAge={getAge}
          getStatusClass={getStatusClass}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={setPage}
        />

        <PatientDetails
          selectedPatient={selectedPatient}
          getFullName={getFullName}
          getInitials={getInitials}
          getAge={getAge}
          getAddress={getAddress}
          getStatusClass={getStatusClass}
        />

      </div>

    </div>
  );
};

export default Patients;