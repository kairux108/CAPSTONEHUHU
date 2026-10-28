import { useCallback, useEffect, useRef, useState } from "react";

import appointmentService from "../../../shared/services/appointmentService";
import { getAppointmentPatientName } from "../../../shared/utils/appointmentUtils";

const getLocalDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const useStaffAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loadedFilterKey, setLoadedFilterKey] = useState(null);
  const latestAppointmentRequest = useRef(0);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(getLocalDate());

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [page, setPage] = useState(1);

  const [formAppointment, setFormAppointment] = useState(null);
  const [showForm, setShowForm] = useState(false);

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

  /* ======================================================
     LOAD DOCTORS
  ====================================================== */

  /* ======================================================
     LOAD APPOINTMENTS
  ====================================================== */

  const filterKey = JSON.stringify([
    page,
    search,
    statusFilter,
    typeFilter,
    doctorFilter,
    selectedDate,
  ]);

  const fetchAppointments = useCallback(() => appointmentService.getAll({
    page,
    search: search.trim(),
    status: statusFilter === "all" ? "" : statusFilter,
    type: typeFilter === "all" ? "" : typeFilter,
    doctor_id: doctorFilter === "all" ? "" : doctorFilter,
    date: selectedDate || "",
  }), [
    page,
    search,
    statusFilter,
    typeFilter,
    doctorFilter,
    selectedDate,
  ]);

  const applyAppointmentData = useCallback((data) => {
    setAppointments(data.appointments || []);
    setStats(data.stats || {});
    setPagination(data.pagination || {});
  }, []);

  const loadAppointments = useCallback(async () => {
    const requestId = ++latestAppointmentRequest.current;
    setLoading(true);
    setError("");

    try {
      const data = await fetchAppointments();
      if (requestId !== latestAppointmentRequest.current) return;

      applyAppointmentData(data);
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
  }, [applyAppointmentData, fetchAppointments, filterKey]);

  /* ======================================================
     EFFECTS
  ====================================================== */

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
    const timer = setTimeout(async () => {
      const requestId = ++latestAppointmentRequest.current;

      try {
        const data = await fetchAppointments();
        if (!active || requestId !== latestAppointmentRequest.current) return;

        applyAppointmentData(data);
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
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [applyAppointmentData, fetchAppointments, filterKey]);

  /* ======================================================
     FILTERS / PAGINATION
  ====================================================== */

  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
    setSelectedAppointment(null);
  };

  const changePage = (newPage) => {
    setPage(newPage);
    setSelectedAppointment(null);
  };

  /* ======================================================
     APPOINTMENT FORM
  ====================================================== */

  const openNewAppointment = () => {
    setFormAppointment(null);
    setShowForm(true);
  };

  const openEditAppointment = (appointment) => {
    setFormAppointment(appointment);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormAppointment(null);
  };

  const handleSaved = async (appointment) => {
    closeForm();
    setSelectedAppointment(appointment);
    await loadAppointments();
  };

  /* ======================================================
     CHECK IN
  ====================================================== */

  const handleCheckIn = async (appointment) => {
    const patientName = getAppointmentPatientName(appointment.patient);

    const confirmed = window.confirm(
      `Check in ${patientName}?`
    );

    if (!confirmed) return;

    try {
      setBusy(true);

      const data = await appointmentService.checkIn(
        appointment.id
      );

      setSelectedAppointment(
        data.appointment || appointment
      );

      await loadAppointments();
    } catch (error) {
      window.alert(
        error.message || "Unable to check in patient."
      );
    } finally {
      setBusy(false);
    }
  };

  /* ======================================================
     CANCEL
  ====================================================== */

  const handleCancel = async (appointment) => {
    const confirmed = window.confirm(
      "Cancel this appointment?"
    );

    if (!confirmed) return;

    try {
      setBusy(true);

      const data = await appointmentService.update(
        appointment.id,
        { status: "cancelled" }
      );

      setSelectedAppointment(
        data.appointment || appointment
      );

      await loadAppointments();
    } catch (error) {
      window.alert(
        error.message || "Unable to cancel appointment."
      );
    } finally {
      setBusy(false);
    }
  };

  /* ======================================================
     NO SHOW
  ====================================================== */

  const handleNoShow = async (appointment) => {
    const confirmed = window.confirm(
      "Mark this patient as no-show?"
    );

    if (!confirmed) return;

    try {
      setBusy(true);

      const data = await appointmentService.update(
        appointment.id,
        { status: "no_show" }
      );

      setSelectedAppointment(
        data.appointment || appointment
      );

      await loadAppointments();
    } catch (error) {
      window.alert(
        error.message || "Unable to update appointment."
      );
    } finally {
      setBusy(false);
    }
  };

  return {
    appointments,
    doctors,
    loading: loading || loadedFilterKey !== filterKey,
    error,
    busy,
    stats,
    pagination,

    search,
    setSearch,

    statusFilter,
    setStatusFilter,

    typeFilter,
    setTypeFilter,

    doctorFilter,
    setDoctorFilter,

    selectedDate,
    setSelectedDate,

    selectedAppointment,
    setSelectedAppointment,

    page,
    setPage,

    formAppointment,
    showForm,

    changeFilter,
    changePage,

    openNewAppointment,
    openEditAppointment,
    closeForm,
    handleSaved,
    handleCheckIn,
    handleCancel,
    handleNoShow,

    loadAppointments,
  };
};

export default useStaffAppointments;