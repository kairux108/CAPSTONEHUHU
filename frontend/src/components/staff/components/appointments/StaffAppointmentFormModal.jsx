import { Search, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";

import appointmentService from "../../../../shared/services/appointmentService";
import patientService from "../../../../shared/services/patientService";

import {
  getAppointmentDoctorName,
  getAppointmentPatientName,
} from "../../../../shared/utils/appointmentUtils";

const getLocalDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getLocalTime = () => {
  const date = new Date();
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${hour}:${minute}`;
};

const emptyPatient = {
  first_name: "",
  middle_name: "",
  last_name: "",
  suffix: "",
  birth_date: "",
  sex: "",
  phone_number: "",
  email: "",
  barangay: "",
  city: "Tagum City",
  province: "Davao del Norte",
  blood_type: "",
};

const getInitialAppointmentForm = (appointment) => ({
  doctor_id: appointment?.doctor_id || "",
  appointment_date: appointment?.appointment_date
    ? String(appointment.appointment_date).split("T")[0]
    : getLocalDate(),
  appointment_time: appointment?.appointment_time
    ? String(appointment.appointment_time).slice(0, 5)
    : getLocalTime(),
  reason_for_visit: appointment?.reason_for_visit || "",
});

const StaffAppointmentFormModal = ({
  doctors = [],
  appointment = null,
  onClose,
  onSaved,
}) => {
  const editing = Boolean(appointment);

  const [search, setSearch] = useState("");
  const [patientSearchResult, setPatientSearchResult] = useState({
    keyword: "",
    patients: [],
  });
  const [selectedPatient, setSelectedPatient] = useState(
    appointment?.patient || null
  );

  const [showRegistration, setShowRegistration] = useState(false);
  const [patientForm, setPatientForm] = useState({ ...emptyPatient });
  const [savingPatient, setSavingPatient] = useState(false);

  const [form, setForm] = useState(
    getInitialAppointmentForm(appointment)
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Availability is always fetched from Laravel's shared booking service.
  // Storing a request key prevents slots from a previous doctor/date
  // from being displayed while a new request is in progress.
  const [availability, setAvailability] = useState({
    key: "",
    slots: [],
    loading: false,
    error: "",
  });

  const availabilityKey = form.doctor_id && form.appointment_date
    ? `${form.doctor_id}:${form.appointment_date}`
    : "";

  const currentAvailability = !availabilityKey
    ? { key: "", slots: [], loading: false, error: "" }
    : availability.key === availabilityKey
      ? availability
      : { key: availabilityKey, slots: [], loading: true, error: "" };

  const availableSlots = currentAvailability.slots.filter(
    (slot) => slot.available === true
  );

  // A rescheduled appointment should be able to retain its existing
  // time when the doctor and date have not changed. The availability
  // API marks that time occupied because it sees the appointment itself.
  const originalDate = appointment?.appointment_date
    ? String(appointment.appointment_date).split("T")[0]
    : "";
  const originalTime = appointment?.appointment_time
    ? String(appointment.appointment_time).slice(0, 5)
    : "";

  const sameOriginalDoctorAndDate =
    editing &&
    Boolean(form.doctor_id) &&
    String(form.doctor_id) === String(appointment?.doctor_id ?? "") &&
    form.appointment_date === originalDate;

  const isOriginalTime =
    sameOriginalDoctorAndDate && form.appointment_time === originalTime;

  const selectedSlotAvailable = availableSlots.some(
    (slot) => slot.time === form.appointment_time
  );

  const hasValidTime = !form.doctor_id ||
    (
      !currentAvailability.loading &&
      !currentAvailability.error &&
      (selectedSlotAvailable || isOriginalTime)
    );

  useEffect(() => {
    if (!availabilityKey) {
      return;
    }

    let active = true;
    const key = availabilityKey;
    const [doctorId, appointmentDate] = key.split(":");

    async function loadAvailableSlots() {
      try {
        const data = await appointmentService.getAvailableSlots(
          Number(doctorId),
          appointmentDate
        );

        if (!active) return;

        if (!Array.isArray(data?.slots)) {
          throw new Error("Invalid doctor availability response.");
        }

        setAvailability({
          key,
          slots: data.slots,
          loading: false,
          error: "",
        });
      } catch (requestError) {
        if (!active) return;

        setAvailability({
          key,
          slots: [],
          loading: false,
          error: requestError.message ||
            "Unable to load doctor availability. Please try again.",
        });
      }
    }

    loadAvailableSlots();

    return () => {
      active = false;
    };
  }, [availabilityKey]);

  useEffect(() => {
    if (editing || selectedPatient) return;

    const keyword = search.trim();

    if (keyword.length < 2) return;

    let active = true;
    const timer = setTimeout(async () => {
      try {
        const data = await patientService.getAll({
          search: keyword,
        });
        if (active) {
          setPatientSearchResult({
            keyword,
            patients: data.patients || [],
          });
        }
      } catch (error) {
        if (active) {
          console.error("Patient search failed:", error);
          setPatientSearchResult({ keyword, patients: [] });
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search, editing, selectedPatient]);

  const keyword = search.trim();
  const patients =
    patientSearchResult.keyword === keyword
      ? patientSearchResult.patients
      : [];
  const searching =
    !editing &&
    !selectedPatient &&
    keyword.length >= 2 &&
    patientSearchResult.keyword !== keyword;

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
      // A time selected for one doctor/date must not be reused for another.
      ...(field === "doctor_id" || (field === "appointment_date" && current.doctor_id)
        ? { appointment_time: "" }
        : {}),
    }));
    setError("");
  };

  const updatePatient = (field, value) => {
    setPatientForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const selectPatient = (patient) => {
    if (!patient?.id) {
      setError("Unable to select this patient. Please try again.");
      return;
    }

    setSelectedPatient(patient);
    setSearch(getAppointmentPatientName(patient));
    setShowRegistration(false);
    setError("");
  };

  const clearSelectedPatient = () => {
    setSelectedPatient(null);
    setSearch("");
    setShowRegistration(false);
    setError("");
  };

  const toggleRegistration = () => {
    setShowRegistration((current) => !current);
    setError("");
  };

  const registerPatient = async () => {
    if (
      !patientForm.first_name.trim() ||
      !patientForm.last_name.trim() ||
      !patientForm.birth_date ||
      !patientForm.sex
    ) {
      setError(
        "First name, last name, birth date, and sex are required."
      );
      return;
    }

    try {
      setSavingPatient(true);
      setError("");

      const data = await patientService.create({
        ...patientForm,
        status: "active",
      });

      const newPatient =
        data?.patient || data?.data?.patient || data?.data || data;

      if (!newPatient?.id) {
        throw new Error(
          "Patient was created, but the returned patient record is invalid."
        );
      }

      selectPatient(newPatient);
      setPatientForm({ ...emptyPatient });
    } catch (error) {
      setError(
        error.message || "Unable to register patient."
      );
    } finally {
      setSavingPatient(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!editing && !selectedPatient?.id) {
      setError(
        "Please select a patient from the search results or register a new patient first."
      );
      return;
    }

    if (!form.appointment_date || !form.appointment_time) {
      setError("Appointment date and time are required.");
      return;
    }

    if (!hasValidTime) {
      setError(
        "Please select an available appointment time for the selected doctor."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const appointmentData = {
        doctor_id: form.doctor_id
          ? Number(form.doctor_id)
          : null,
        appointment_date: form.appointment_date,
        appointment_time: form.appointment_time,
        reason_for_visit:
          form.reason_for_visit.trim() || null,
      };

      let data;

      if (editing) {
        data = await appointmentService.update(
          appointment.id,
          appointmentData
        );
      } else {
        data = await appointmentService.create({
          ...appointmentData,
          patient_id: Number(selectedPatient.id),
          appointment_type: "walk_in",
        });
      }

      onSaved(data.appointment || data);
    } catch (error) {
      setError(
        error.message || "Unable to save appointment."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="staff-appointment-modal-backdrop">
      <div className="staff-appointment-modal">
        <div className="staff-appointment-modal-header">
          <div>
            <h2>
              {editing
                ? "Reschedule Appointment"
                : "New Walk-in Appointment"}
            </h2>

            <p>
              {editing
                ? "Update the appointment schedule and assigned doctor."
                : "Search for an existing patient or register a new patient."}
            </p>
          </div>

          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="staff-appointment-modal-body"
        >
          {!editing && (
            <section className="staff-appointment-form-section">
              <h3>Patient</h3>

              {selectedPatient ? (
                <div className="staff-appointment-selected-patient">
                  <div>
                    <strong>
                      {getAppointmentPatientName(selectedPatient)}
                    </strong>

                    <span>
                      {selectedPatient.patient_number || "—"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={clearSelectedPatient}
                  >
                    Change
                  </button>
                </div>
              ) : (
                <>
                  <label className="staff-appointment-patient-search">
                    <Search size={17} />

                    <input
                      type="search"
                      value={search}
                      placeholder="Search patient name, ID or contact..."
                      onChange={(event) => {
                        setSearch(event.target.value);
                        setError("");
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                        }
                      }}
                    />
                  </label>

                  {searching && (
                    <p className="staff-appointment-form-hint">
                      Searching...
                    </p>
                  )}

                  {!searching &&
                    search.trim().length >= 2 &&
                    patients.length === 0 && (
                      <p className="staff-appointment-form-hint">
                        No matching patient found. Select "Register New Patient" below if needed.
                      </p>
                    )}

                  {patients.length > 0 && (
                    <div className="staff-appointment-patient-results">
                      {patients.map((patient) => (
                        <button
                          type="button"
                          key={patient.id}
                          onClick={() => selectPatient(patient)}
                        >
                          <strong>
                            {getAppointmentPatientName(patient)}
                          </strong>

                          <span>
                            {patient.patient_number || "—"}
                            {" • "}
                            {patient.phone_number || "No contact"}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    className="staff-appointment-register-toggle"
                    onClick={toggleRegistration}
                  >
                    <UserPlus size={16} />

                    {showRegistration
                      ? "Hide Patient Registration"
                      : "Patient not found? Register New Patient"}
                  </button>
                </>
              )}
            </section>
          )}

          {showRegistration &&
            !editing &&
            !selectedPatient && (
              <section className="staff-appointment-form-section">
                <h3>Register New Patient</h3>

                <div className="staff-appointment-form-grid">
                  <label>
                    First Name *
                    <input
                      type="text"
                      value={patientForm.first_name}
                      onChange={(event) =>
                        updatePatient(
                          "first_name",
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label>
                    Middle Name
                    <input
                      type="text"
                      value={patientForm.middle_name}
                      onChange={(event) =>
                        updatePatient(
                          "middle_name",
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label>
                    Last Name *
                    <input
                      type="text"
                      value={patientForm.last_name}
                      onChange={(event) =>
                        updatePatient(
                          "last_name",
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label>
                    Suffix
                    <input
                      type="text"
                      value={patientForm.suffix}
                      onChange={(event) =>
                        updatePatient(
                          "suffix",
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label>
                    Birth Date *
                    <input
                      type="date"
                      value={patientForm.birth_date}
                      onChange={(event) =>
                        updatePatient(
                          "birth_date",
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label>
                    Sex *
                    <select
  value={patientForm.sex}
  onChange={(event) => updatePatient("sex", event.target.value)}
>
  <option value="">Select</option>
  <option value="male">Male</option>
  <option value="female">Female</option>
</select>
                  </label>

                  <label>
                    Contact Number
                    <input
                      type="text"
                      value={patientForm.phone_number}
                      onChange={(event) =>
                        updatePatient(
                          "phone_number",
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label>
                    Email
                    <input
                      type="email"
                      value={patientForm.email}
                      onChange={(event) =>
                        updatePatient(
                          "email",
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label>
                    Barangay
                    <input
                      type="text"
                      value={patientForm.barangay}
                      onChange={(event) =>
                        updatePatient(
                          "barangay",
                          event.target.value
                        )
                      }
                    />
                  </label>

                  <label>
                    Blood Type
                    <select
                      value={patientForm.blood_type}
                      onChange={(event) =>
                        updatePatient(
                          "blood_type",
                          event.target.value
                        )
                      }
                    >
                      <option value="">Unknown</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </label>
                </div>

                <button
                  type="button"
                  className="staff-appointment-register-patient"
                  disabled={savingPatient}
                  onClick={registerPatient}
                >
                  {savingPatient
                    ? "Registering..."
                    : "Register & Select Patient"}
                </button>
              </section>
            )}

          <section className="staff-appointment-form-section">
            <h3>Appointment Information</h3>

            <div className="staff-appointment-form-grid">
              <label>
                Date *
                <input
                  type="date"
                  value={form.appointment_date}
                  onChange={(event) =>
                    updateForm(
                      "appointment_date",
                      event.target.value
                    )
                  }
                />
              </label>

              <label className="full">
                Doctor
                <select
                  value={form.doctor_id}
                  onChange={(event) =>
                    updateForm("doctor_id", event.target.value)
                  }
                >
                  <option value="">Unassigned / Assign Later</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {getAppointmentDoctorName(doctor)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Time *
                {form.doctor_id ? (
                  <select
                    value={form.appointment_time}
                    onChange={(event) =>
                      updateForm("appointment_time", event.target.value)
                    }
                    disabled={currentAvailability.loading || Boolean(currentAvailability.error)}
                  >
                    <option value="">
                      {currentAvailability.loading
                        ? "Loading available times..."
                        : "Select an available time"}
                    </option>
                    {sameOriginalDoctorAndDate && originalTime &&
                      !availableSlots.some((slot) => slot.time === originalTime) && (
                        <option value={originalTime}>
                          {originalTime} (current appointment)
                        </option>
                      )}
                    {availableSlots.map((slot) => (
                      <option key={slot.time} value={slot.time}>
                        {slot.time}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="time"
                    value={form.appointment_time}
                    onChange={(event) =>
                      updateForm("appointment_time", event.target.value)
                    }
                  />
                )}
              </label>

              {form.doctor_id && (
                <div className="full staff-appointment-form-hint" role="status">
                  {currentAvailability.loading
                    ? "Checking the doctor's schedule..."
                    : currentAvailability.error
                      ? currentAvailability.error
                      : availableSlots.length === 0 && !sameOriginalDoctorAndDate
                        ? "No appointment slots are available for this doctor on this date. Choose another date or doctor."
                        : `${availableSlots.length} available appointment time(s) for the selected date.`}
                </div>
              )}

              <label className="full">
                Reason for Visit

                <textarea
                  rows="4"
                  value={form.reason_for_visit}
                  placeholder="Example: Fever for 2 days with headache and body pain."
                  onChange={(event) =>
                    updateForm(
                      "reason_for_visit",
                      event.target.value
                    )
                  }
                />
              </label>
            </div>
          </section>

          {error && (
            <div className="staff-appointment-form-error">
              {error}
            </div>
          )}

          <div className="staff-appointment-modal-footer">
            <button
              type="button"
              className="secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary"
              disabled={saving || savingPatient || !hasValidTime}
            >
              {saving
                ? "Saving..."
                : editing
                ? "Save Changes"
                : "Create Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffAppointmentFormModal;
