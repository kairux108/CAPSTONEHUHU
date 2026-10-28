import { useCallback, useEffect, useRef, useState } from "react";
import appointmentService from "../../../shared/services/appointmentService";

const getLocalDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadedFilterKey, setLoadedFilterKey] = useState(null);
  const latestAppointmentRequest = useRef(0);

  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(getLocalDate());

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [page, setPage] = useState(1);

  const [stats, setStats] = useState({
    total_today: 0,
    scheduled_today: 0,
    checked_in_today: 0,
    walk_in_today: 0,
    online_today: 0,
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });

  // ======================================================
  // LOAD DOCTORS
  // ======================================================

  // ======================================================
  // LOAD APPOINTMENTS
  // ======================================================

  const filterKey = JSON.stringify([
    page,
    statusFilter,
    typeFilter,
    doctorFilter,
    selectedDate,
  ]);

  const fetchAppointments = useCallback(() => appointmentService.getAll({
    page,
    status: statusFilter === "all" ? "" : statusFilter,
    type: typeFilter === "all" ? "" : typeFilter,
    doctor_id: doctorFilter === "all" ? "" : doctorFilter,
    date: selectedDate || "",
  }), [
    page,
    statusFilter,
    typeFilter,
    doctorFilter,
    selectedDate,
  ]);

  const loadAppointments = useCallback(async () => {
    const requestId = ++latestAppointmentRequest.current;
    setLoading(true);
    setError("");

    try {
      const data = await fetchAppointments();
      if (requestId !== latestAppointmentRequest.current) return;

      setAppointments(data.appointments || []);
      setStats(data.stats || {});
      setPagination(data.pagination || {});
      setError("");
      setLoadedFilterKey(filterKey);
    } catch (error) {
      if (requestId === latestAppointmentRequest.current) {
        console.error("Failed to load appointments:", error);
        setError(error.message || "Unable to load appointments.");
        setLoadedFilterKey(filterKey);
      }
    } finally {
      if (requestId === latestAppointmentRequest.current) {
        setLoading(false);
      }
    }
  }, [fetchAppointments, filterKey]);

  // ======================================================
  // EFFECTS
  // ======================================================

  useEffect(() => {
    let active = true;

    const fetchDoctors = async () => {
      try {
        const data = await appointmentService.getDoctors();
        if (active) setDoctors(data.doctors || []);
      } catch (error) {
        if (active) console.error("Failed to load doctors:", error);
      }
    };

    fetchDoctors();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const requestId = ++latestAppointmentRequest.current;

    const fetch = async () => {
      try {
        const data = await fetchAppointments();
        if (!active || requestId !== latestAppointmentRequest.current) return;

        setAppointments(data.appointments || []);
        setStats(data.stats || {});
        setPagination(data.pagination || {});
        setError("");
        setLoadedFilterKey(filterKey);
      } catch (error) {
        if (active && requestId === latestAppointmentRequest.current) {
          console.error("Failed to load appointments:", error);
          setError(error.message || "Unable to load appointments.");
          setLoadedFilterKey(filterKey);
        }
      } finally {
        if (active && requestId === latestAppointmentRequest.current) {
          setLoading(false);
        }
      }
    };

    fetch();

    return () => {
      active = false;
    };
  }, [fetchAppointments, filterKey]);

  // ======================================================
  // FILTER CHANGE
  // ======================================================

  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
    setSelectedAppointment(null);
  };

  return {
    appointments,
    doctors,
    loading: loading || loadedFilterKey !== filterKey,
    error,
    stats,
    pagination,

    selectedAppointment,
    setSelectedAppointment,

    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    doctorFilter,
    setDoctorFilter,
    selectedDate,
    setSelectedDate,

    page,
    setPage,

    changeFilter,
    loadAppointments,
  };
};

export default useAppointments;