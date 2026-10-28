import { useCallback, useEffect, useState } from "react";
import patientService from "../services/patientService";

const usePatients = () => {
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
  }, [page, search, sexFilter, ageFilter, statusFilter, sortBy]);

  useEffect(() => {
    const timer = setTimeout(loadPatients, 300);
    return () => clearTimeout(timer);
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

export default usePatients;