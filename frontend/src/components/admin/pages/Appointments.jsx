import useAppointments from "../hooks/useAppointments";

import AppointmentStats from "../components/appointments/AppointmentStats";
import AppointmentFilters from "../components/appointments/AppointmentFilters";
import AppointmentTable from "../components/appointments/AppointmentTable";
import AppointmentCalendar from "../components/appointments/AppointmentCalendar";
import AppointmentDetails from "../components/appointments/AppointmentDetails";

const Appointments = () => {
  const {
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
    setPage,
    changeFilter,
  } = useAppointments();

  const changeTab = (status = "all", type = "all") => {
    setStatusFilter(status);
    setTypeFilter(type);
    setPage(1);
    setSelectedAppointment(null);
  };

  const changePage = (newPage) => {
    setPage(newPage);
    setSelectedAppointment(null);
  };

  return (
    <div className="appointments-page">
      <AppointmentStats
        total={stats.total_today || 0}
        scheduled={stats.scheduled_today || 0}
        checkedIn={stats.checked_in_today || 0}
        walkIn={stats.walk_in_today || 0}
        online={stats.online_today || 0}
      />

      {/* TABS */}
      <div className="appointments-topbar">
        <div className="appointments-tabs">
          <button
            type="button"
            className={`appointment-tab ${
              statusFilter === "all" && typeFilter === "all" ? "active" : ""
            }`}
            onClick={() => changeTab("all", "all")}
          >
            All Appointments
          </button>

          <button
            type="button"
            className={`appointment-tab ${
              statusFilter === "scheduled" && typeFilter === "all" ? "active" : ""
            }`}
            onClick={() => changeTab("scheduled", "all")}
          >
            Scheduled
          </button>

          <button
            type="button"
            className={`appointment-tab ${
              statusFilter === "all" && typeFilter === "walk_in" ? "active" : ""
            }`}
            onClick={() => changeTab("all", "walk_in")}
          >
            Walk-ins
          </button>

          <button
            type="button"
            className={`appointment-tab ${
              statusFilter === "all" && typeFilter === "online" ? "active" : ""
            }`}
            onClick={() => changeTab("all", "online")}
          >
            Online
          </button>

          <button
            type="button"
            className={`appointment-tab ${
              statusFilter === "completed" && typeFilter === "all" ? "active" : ""
            }`}
            onClick={() => changeTab("completed", "all")}
          >
            Completed
          </button>

          <button
            type="button"
            className={`appointment-tab ${
              statusFilter === "cancelled" && typeFilter === "all" ? "active" : ""
            }`}
            onClick={() => changeTab("cancelled", "all")}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <AppointmentFilters
        date={selectedDate}
        setDate={changeFilter(setSelectedDate)}
        doctorFilter={doctorFilter}
        setDoctorFilter={changeFilter(setDoctorFilter)}
        typeFilter={typeFilter}
        setTypeFilter={changeFilter(setTypeFilter)}
        statusFilter={statusFilter}
        setStatusFilter={changeFilter(setStatusFilter)}
        doctors={doctors}
      />

      {/* CALENDAR + TABLE + DETAILS */}
      <div className="appointments-bottom-layout">
        <AppointmentCalendar
          selectedDate={selectedDate}
          setSelectedDate={changeFilter(setSelectedDate)}
          appointments={appointments}
        />

        <AppointmentTable
          appointments={appointments}
          selectedAppointment={selectedAppointment}
          setSelectedAppointment={setSelectedAppointment}
          loading={loading}
          error={error}
          pagination={{
            ...pagination,
            onPageChange: changePage,
          }}
        />

        <AppointmentDetails appointment={selectedAppointment} />
      </div>
    </div>
  );
};

export default Appointments;