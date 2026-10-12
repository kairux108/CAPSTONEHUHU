import useStaffAppointments from "../../../hooks/useStaffAppointments";

import StaffAppointmentStats from "../appointments/StaffAppointmentStats";
import StaffAppointmentFilters from "../appointments/StaffAppointmentFilters";
import StaffAppointmentCalendar from "../appointments/StaffAppointmentCalendar";
import StaffAppointmentTable from "../appointments/StaffAppointmentTable";
import StaffAppointmentDetails from "../appointments/StaffAppointmentDetails";
import StaffAppointmentFormModal from "../appointments/StaffAppointmentFormModal";

const Appointments = () => {
  const {
    appointments,
    doctors,
    loading,
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
  } = useStaffAppointments();

  return (
    <div className="staff-appointments-page">
      <StaffAppointmentStats stats={stats} />

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

      <div className="staff-appointment-main-grid">
        <StaffAppointmentCalendar
          selectedDate={selectedDate}
          setSelectedDate={changeFilter(setSelectedDate)}
          appointments={appointments}
        />

        <StaffAppointmentTable
          appointments={appointments}
          selectedAppointment={selectedAppointment}
          setSelectedAppointment={setSelectedAppointment}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={changePage}
        />

        <StaffAppointmentDetails
          appointment={selectedAppointment}
          onCheckIn={handleCheckIn}
          onEdit={openEditAppointment}
          onCancel={handleCancel}
          onNoShow={handleNoShow}
          busy={busy}
        />
      </div>

      {showForm && (
        <StaffAppointmentFormModal
          doctors={doctors}
          appointment={formAppointment}
          onClose={closeForm}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

export default Appointments;