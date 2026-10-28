import { useEffect, useState } from "react";

import useStaffAppointments from "../hooks/useStaffAppointments";
import useVitalSigns from "../hooks/useVitalSigns";
import useQueue from "../hooks/useQueue";

import StaffAppointmentStats from "../components/appointments/StaffAppointmentStats";
import StaffAppointmentFilters from "../components/appointments/StaffAppointmentFilters";
import StaffAppointmentCalendar from "../components/appointments/StaffAppointmentCalendar";
import StaffAppointmentTable from "../components/appointments/StaffAppointmentTable";
import StaffAppointmentDetails from "../components/appointments/StaffAppointmentDetails";
import StaffAppointmentFormModal from "../components/appointments/StaffAppointmentFormModal";
import StaffVitalSignsModal from "../components/appointments/StaffVitalSignsModal";

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

  /*
  |--------------------------------------------------------------------------
  | Vital Signs
  |--------------------------------------------------------------------------
  */

  const {
    loadVitalSigns,
    loading: loadingVitals,
  } = useVitalSigns();

  /*
  |--------------------------------------------------------------------------
  | Queue
  |--------------------------------------------------------------------------
  */

  const {
    loadQueue,
    createQueueEntry,
    saving: savingQueue,
  } = useQueue();

  /*
  |--------------------------------------------------------------------------
  | Local State
  |--------------------------------------------------------------------------
  */

  const [vitalsAppointment, setVitalsAppointment] = useState(null);

  const [appointmentVitalSign, setAppointmentVitalSign] =
    useState(null);

  const [appointmentQueueEntry, setAppointmentQueueEntry] =
    useState(null);

  /*
  |--------------------------------------------------------------------------
  | Load Selected Appointment Vital Signs
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let cancelled = false;

    const loadAppointmentVitals = async () => {
      if (!selectedAppointment?.id) {
        setAppointmentVitalSign(null);
        return;
      }

      try {
        setAppointmentVitalSign(null);

        const data = await loadVitalSigns({
          appointment_id: selectedAppointment.id,
        });

        if (!cancelled) {
          setAppointmentVitalSign(
            data.vital_signs?.[0] || null
          );
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load appointment vital signs:",
            error
          );

          setAppointmentVitalSign(null);
        }
      }
    };

    loadAppointmentVitals();

    return () => {
      cancelled = true;
    };
  }, [selectedAppointment?.id, loadVitalSigns]);

  /*
  |--------------------------------------------------------------------------
  | Load Selected Appointment Queue Entry
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let cancelled = false;

    const loadAppointmentQueue = async () => {
      if (
        !selectedAppointment?.id ||
        !selectedAppointment?.appointment_date
      ) {
        setAppointmentQueueEntry(null);
        return;
      }

      try {
        setAppointmentQueueEntry(null);

        const data = await loadQueue({
          date: selectedAppointment.appointment_date,
        });

        const queueEntry = (data.queue_entries || []).find(
          (entry) =>
            Number(entry.appointment_id) ===
            Number(selectedAppointment.id)
        );

        if (!cancelled) {
          setAppointmentQueueEntry(queueEntry || null);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load appointment queue entry:",
            error
          );

          setAppointmentQueueEntry(null);
        }
      }
    };

    loadAppointmentQueue();

    return () => {
      cancelled = true;
    };
  }, [
    selectedAppointment?.id,
    selectedAppointment?.appointment_date,
    loadQueue,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Vital Signs Actions
  |--------------------------------------------------------------------------
  */

  const openVitalSigns = (appointment) => {
    setVitalsAppointment(appointment);
  };

  const closeVitalSigns = () => {
    setVitalsAppointment(null);
  };

  const handleVitalSignsSaved = (vitalSign) => {
    setAppointmentVitalSign(vitalSign);
    closeVitalSigns();
  };

  /*
  |--------------------------------------------------------------------------
  | Queue Actions
  |--------------------------------------------------------------------------
  */

  const handleSendToQueue = async (appointment) => {
    if (!appointment?.id) return;

    const confirmed = window.confirm(
      "Send this patient to the waiting queue?"
    );

    if (!confirmed) return;

    try {
      const queueEntry = await createQueueEntry({
        appointment_id: appointment.id,
        priority: "normal",
      });

      setAppointmentQueueEntry(queueEntry);
    } catch (error) {
      window.alert(
        error.message ||
          "Unable to add patient to queue."
      );
    }
  };

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

          vitalSign={appointmentVitalSign}
          loadingVitals={loadingVitals}

          queueEntry={appointmentQueueEntry}
          savingQueue={savingQueue}

          onCheckIn={handleCheckIn}
          onEdit={openEditAppointment}
          onCancel={handleCancel}
          onNoShow={handleNoShow}
          onRecordVitals={openVitalSigns}
          onSendToQueue={handleSendToQueue}

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

      {vitalsAppointment && (
        <StaffVitalSignsModal
          appointment={vitalsAppointment}
          onClose={closeVitalSigns}
          onSaved={handleVitalSignsSaved}
        />
      )}
    </div>
  );
};

export default Appointments;