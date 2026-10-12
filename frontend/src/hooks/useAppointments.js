import { useCallback, useEffect, useState } from "react";
import appointmentService from "../services/appointmentService";

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

  const loadDoctors = useCallback(async () => {
    try {
      const data = await appointmentService.getDoctors();
      setDoctors(data.doctors || []);
    } catch (error) {
      console.error("Failed to load doctors:", error);
    }
  }, []);

  // ======================================================
  // LOAD APPOINTMENTS
  // ======================================================

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await appointmentService.getAll({
        page,
        status: statusFilter === "all" ? "" : statusFilter,
        type: typeFilter === "all" ? "" : typeFilter,
        doctor_id: doctorFilter === "all" ? "" : doctorFilter,
        date: selectedDate || "",
      });

      setAppointments(data.appointments || []);
      setStats(data.stats || {});
      setPagination(data.pagination || {});
    } catch (error) {
      console.error("Failed to load appointments:", error);
      setError(error.message || "Unable to load appointments.");
    } finally {
      setLoading(false);
    }
  }, [
    page,
    statusFilter,
    typeFilter,
    doctorFilter,
    selectedDate,
  ]);

  // ======================================================
  // EFFECTS
  // ======================================================

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

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
    loading,
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