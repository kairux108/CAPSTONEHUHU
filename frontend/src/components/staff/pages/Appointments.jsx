import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Plus } from "lucide-react";

import appointmentService from "../../../services/appointmentService";

import StaffAppointmentStats from "../components/appointments/StaffAppointmentStats";
import StaffAppointmentFilters from "../components/appointments/StaffAppointmentFilters";
import StaffAppointmentCalendar from "../components/appointments/StaffAppointmentCalendar";
import StaffAppointmentTable from "../components/appointments/StaffAppointmentTable";
import StaffAppointmentDetails from "../components/appointments/StaffAppointmentDetails";
import StaffAppointmentFormModal from "../components/appointments/StaffAppointmentFormModal";


const getLocalDate = () => {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


const Appointments = () => {

  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

  const [appointments, setAppointments] =
    useState([]);

  const [doctors, setDoctors] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [busy, setBusy] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("all");

  const [
    typeFilter,
    setTypeFilter,
  ] = useState("all");

  const [
    doctorFilter,
    setDoctorFilter,
  ] = useState("all");

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(
    getLocalDate()
  );

  const [
    selectedAppointment,
    setSelectedAppointment,
  ] = useState(null);

  const [page, setPage] =
    useState(1);

  const [
    formAppointment,
    setFormAppointment,
  ] = useState(null);

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [stats, setStats] =
    useState({
      total_today: 0,
      scheduled_today: 0,
      checked_in_today: 0,
      walk_in_today: 0,
      online_today: 0,
    });

  const [
    pagination,
    setPagination,
  ] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });


  /*
  |--------------------------------------------------------------------------
  | Load Doctors
  |--------------------------------------------------------------------------
  */

  const loadDoctors =
    useCallback(async () => {
      try {
        const data =
          await appointmentService.getDoctors();

        setDoctors(
          data.doctors || []
        );
      } catch (error) {
        console.error(
          "Failed to load doctors:",
          error
        );
      }
    }, []);


  /*
  |--------------------------------------------------------------------------
  | Load Appointments
  |--------------------------------------------------------------------------
  */

  const loadAppointments =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await appointmentService.getAll({
            page,

            search:
              search.trim(),

            status:
              statusFilter === "all"
                ? ""
                : statusFilter,

            type:
              typeFilter === "all"
                ? ""
                : typeFilter,

            doctor_id:
              doctorFilter === "all"
                ? ""
                : doctorFilter,

            date:
              selectedDate || "",
          });

        setAppointments(
          data.appointments || []
        );

        setStats(
          data.stats || {}
        );

        setPagination(
          data.pagination || {}
        );
      } catch (error) {
        console.error(
          "Failed to load appointments:",
          error
        );

        setError(
          error.message ||
            "Unable to load appointments."
        );
      } finally {
        setLoading(false);
      }
    }, [
      page,
      search,
      statusFilter,
      typeFilter,
      doctorFilter,
      selectedDate,
    ]);


  /*
  |--------------------------------------------------------------------------
  | Effects
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        loadAppointments();
      },
      300
    );

    return () =>
      clearTimeout(timer);
  }, [loadAppointments]);


  /*
  |--------------------------------------------------------------------------
  | Filter Change
  |--------------------------------------------------------------------------
  */

  const changeFilter =
    (setter) => (value) => {
      setter(value);

      setPage(1);

      setSelectedAppointment(
        null
      );
    };


  /*
  |--------------------------------------------------------------------------
  | Patient Helpers
  |--------------------------------------------------------------------------
  */

  const getPatientName = (
    patient
  ) =>
    [
      patient?.first_name,
      patient?.middle_name,
      patient?.last_name,
      patient?.suffix,
    ]
      .filter(Boolean)
      .join(" ") ||
    "Unknown Patient";


  const getInitials = (
    patient
  ) =>
    [
      patient?.first_name,
      patient?.last_name,
    ]
      .filter(Boolean)
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "P";


  /*
  |--------------------------------------------------------------------------
  | Doctor Helper
  |--------------------------------------------------------------------------
  */

  const getDoctorName = (
    doctor
  ) =>
    doctor?.name ||
    "Unassigned";


  /*
  |--------------------------------------------------------------------------
  | Date Helpers
  |--------------------------------------------------------------------------
  */

  const formatDate = (
    value
  ) => {
    if (!value) {
      return "—";
    }

    const dateOnly =
      String(value).split("T")[0];

    return new Date(
      `${dateOnly}T00:00:00`
    ).toLocaleDateString(
      "en-PH",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };


  const formatTime = (
    value
  ) => {
    if (!value) {
      return "—";
    }

    const [hour, minute] =
      String(value).split(":");

    const date = new Date();

    date.setHours(
      Number(hour),
      Number(minute),
      0,
      0
    );

    return date.toLocaleTimeString(
      "en-PH",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };


  const formatDateTime = (
    value
  ) => {
    if (!value) {
      return "—";
    }

    return new Date(
      value
    ).toLocaleString(
      "en-PH",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Status Helpers
  |--------------------------------------------------------------------------
  */

  const formatStatus = (
    status
  ) => {
    const labels = {
      scheduled:
        "Scheduled",

      checked_in:
        "Checked In",

      completed:
        "Completed",

      cancelled:
        "Cancelled",

      no_show:
        "No Show",
    };

    return (
      labels[status] ||
      status ||
      "—"
    );
  };


  const formatType = (
    type
  ) => {
    const labels = {
      online:
        "Online",

      walk_in:
        "Walk-in",
    };

    return (
      labels[type] ||
      type ||
      "—"
    );
  };


  const statusClass = (
    status
  ) => {
    if (
      status === "completed"
    ) {
      return "completed";
    }

    if (
      status === "checked_in"
    ) {
      return "progress";
    }

    if (
      status === "scheduled"
    ) {
      return "scheduled";
    }

    if (
      status === "cancelled" ||
      status === "no_show"
    ) {
      return "cancelled";
    }

    return "default";
  };


  /*
  |--------------------------------------------------------------------------
  | New Appointment
  |--------------------------------------------------------------------------
  */

  const openNewAppointment =
    () => {
      setFormAppointment(null);

      setShowForm(true);
    };


  /*
  |--------------------------------------------------------------------------
  | Reschedule
  |--------------------------------------------------------------------------
  */

  const openEditAppointment =
    (appointment) => {
      setFormAppointment(
        appointment
      );

      setShowForm(true);
    };


  /*
  |--------------------------------------------------------------------------
  | Appointment Saved
  |--------------------------------------------------------------------------
  */

  const handleSaved =
    async (appointment) => {
      setShowForm(false);

      setFormAppointment(null);

      setSelectedAppointment(
        appointment
      );

      await loadAppointments();
    };


  /*
  |--------------------------------------------------------------------------
  | Check In
  |--------------------------------------------------------------------------
  */

  const handleCheckIn =
    async (appointment) => {
      const patientName =
        getPatientName(
          appointment.patient
        );

      const confirmed =
        window.confirm(
          `Check in ${patientName}?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setBusy(true);

        const data =
          await appointmentService.checkIn(
            appointment.id
          );

        setSelectedAppointment(
          data.appointment ||
            appointment
        );

        await loadAppointments();
      } catch (error) {
        window.alert(
          error.message ||
            "Unable to check in patient."
        );
      } finally {
        setBusy(false);
      }
    };


  /*
  |--------------------------------------------------------------------------
  | Cancel
  |--------------------------------------------------------------------------
  */

  const handleCancel =
    async (appointment) => {
      const confirmed =
        window.confirm(
          "Cancel this appointment?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setBusy(true);

        const data =
          await appointmentService.update(
            appointment.id,
            {
              status:
                "cancelled",
            }
          );

        setSelectedAppointment(
          data.appointment ||
            appointment
        );

        await loadAppointments();
      } catch (error) {
        window.alert(
          error.message ||
            "Unable to cancel appointment."
        );
      } finally {
        setBusy(false);
      }
    };


  /*
  |--------------------------------------------------------------------------
  | No Show
  |--------------------------------------------------------------------------
  */

  const handleNoShow =
    async (appointment) => {
      const confirmed =
        window.confirm(
          "Mark this patient as no-show?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setBusy(true);

        const data =
          await appointmentService.update(
            appointment.id,
            {
              status:
                "no_show",
            }
          );

        setSelectedAppointment(
          data.appointment ||
            appointment
        );

        await loadAppointments();
      } catch (error) {
        window.alert(
          error.message ||
            "Unable to update appointment."
        );
      } finally {
        setBusy(false);
      }
    };


  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="staff-appointments-page">


      {/* SUMMARY */}

      <StaffAppointmentStats
        stats={stats}
      />


      {/* FILTERS */}

      <StaffAppointmentFilters
  search={search}
  setSearch={changeFilter(setSearch)}

  statusFilter={statusFilter}
  setStatusFilter={changeFilter(setStatusFilter)}

  typeFilter={typeFilter}
  setTypeFilter={changeFilter(setTypeFilter)}

  doctorFilter={doctorFilter}
  setDoctorFilter={changeFilter(setDoctorFilter)}

  selectedDate={selectedDate}
  setSelectedDate={changeFilter(setSelectedDate)}

  doctors={doctors}
  onNewAppointment={openNewAppointment}
/>


      {/* MAIN CONTENT */}

      <div className="staff-appointment-main-grid">

        {/* CALENDAR */}

        <StaffAppointmentCalendar
          selectedDate={
            selectedDate
          }

          setSelectedDate={
            changeFilter(
              setSelectedDate
            )
          }

          appointments={
            appointments
          }
        />


        {/* APPOINTMENT LIST */}

        <StaffAppointmentTable
          appointments={
            appointments
          }

          selectedAppointment={
            selectedAppointment
          }

          setSelectedAppointment={
            setSelectedAppointment
          }

          loading={loading}

          error={error}

          pagination={
            pagination
          }

          onPageChange={
            setPage
          }

          getPatientName={
            getPatientName
          }

          getInitials={
            getInitials
          }

          getDoctorName={
            getDoctorName
          }

          formatTime={
            formatTime
          }

          formatStatus={
            formatStatus
          }

          statusClass={
            statusClass
          }

          formatType={
            formatType
          }
        />


        {/* APPOINTMENT DETAILS */}

        <StaffAppointmentDetails
          appointment={
            selectedAppointment
          }

          getPatientName={
            getPatientName
          }

          getInitials={
            getInitials
          }

          getDoctorName={
            getDoctorName
          }

          formatDate={
            formatDate
          }

          formatTime={
            formatTime
          }

          formatDateTime={
            formatDateTime
          }

          formatStatus={
            formatStatus
          }

          formatType={
            formatType
          }

          statusClass={
            statusClass
          }

          onCheckIn={
            handleCheckIn
          }

          onEdit={
            openEditAppointment
          }

          onCancel={
            handleCancel
          }

          onNoShow={
            handleNoShow
          }

          busy={busy}
        />

      </div>


      {/* NEW / RESCHEDULE APPOINTMENT MODAL */}

      {showForm && (
        <StaffAppointmentFormModal
          doctors={doctors}

          appointment={
            formAppointment
          }

          onClose={() => {
            setShowForm(false);

            setFormAppointment(
              null
            );
          }}

          onSaved={
            handleSaved
          }
        />
      )}

    </div>
  );
};

export default Appointments;