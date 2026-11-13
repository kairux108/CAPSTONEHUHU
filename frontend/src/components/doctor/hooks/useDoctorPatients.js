
import { useCallback, useEffect, useState } from "react";
import doctorPatientService from "../services/doctorPatientService";

const useDoctorPatients = () => {
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

  const loadPatients = useCallback(
    async (signal) => {
      try {
        setLoading(true);
        setError("");

        const data = await doctorPatientService.getAll(
          {
            page,
            search: search.trim(),
            sex: sexFilter === "all" ? "" : sexFilter,
            age_group: ageFilter === "all" ? "" : ageFilter,
            status: statusFilter === "all" ? "" : statusFilter,
            sort: sortBy,
          },
          signal
        );

        if (signal?.aborted) return;

        setPatients(data.patients || []);
        setStats(data.stats || {});
        setPagination(data.pagination || {});
        setSelectedPatient((current) => {
          if (!current) return null;
          return (
            (data.patients || []).find(
              (patient) => patient.id === current.id
            ) || null
          );
        });
      } catch (err) {
        if (signal?.aborted) return;

        setError(
          err.message || "Unable to load assigned patients."
        );
        setPatients([]);
        setSelectedPatient(null);
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [page, search, sexFilter, ageFilter, statusFilter, sortBy]
  );

  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(() => {
      loadPatients(controller.signal);
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [loadPatients]);

  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
    setSelectedPatient(null);
  };

  return {
    patients,
    loading,
    error,
    stats,
    pagination,
    page,
    setPage,
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
    changeFilter,
    loadPatients,
  };
};

export default useDoctorPatients;
