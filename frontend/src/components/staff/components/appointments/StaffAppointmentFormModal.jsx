import { Search, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";

import appointmentService from "../../../../services/appointmentService";
import patientService from "../../../../services/patientService";


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


const patientName = (patient) =>
  [
    patient?.first_name,
    patient?.middle_name,
    patient?.last_name,
    patient?.suffix,
  ]
    .filter(Boolean)
    .join(" ");


/*
|--------------------------------------------------------------------------
| IMPORTANT:
| Users table uses one "name" column.
|--------------------------------------------------------------------------
*/

const doctorName = (doctor) =>
  doctor?.name || "Unknown Doctor";


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


const StaffAppointmentFormModal = ({
  doctors,
  appointment = null,
  onClose,
  onSaved,
}) => {
  const editing = Boolean(appointment);

  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);

  const [
    selectedPatient,
    setSelectedPatient,
  ] = useState(
    appointment?.patient || null
  );

  const [searching, setSearching] = useState(false);

  const [
    showRegistration,
    setShowRegistration,
  ] = useState(false);

  const [
    patientForm,
    setPatientForm,
  ] = useState(emptyPatient);

  const [
    savingPatient,
    setSavingPatient,
  ] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  /*
  |--------------------------------------------------------------------------
  | Appointment Form
  |--------------------------------------------------------------------------
  */

  const [form, setForm] = useState({
    doctor_id:
      appointment?.doctor_id || "",

    appointment_date:
      appointment?.appointment_date
        ? String(
            appointment.appointment_date
          ).split("T")[0]
        : getLocalDate(),

    appointment_time:
      appointment?.appointment_time
        ? String(
            appointment.appointment_time
          ).slice(0, 5)
        : getLocalTime(),

    reason_for_visit:
      appointment?.reason_for_visit || "",
  });


  /*
  |--------------------------------------------------------------------------
  | Search Existing Patients
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (editing) return;

    const keyword = search.trim();

    if (keyword.length < 2) {
      setPatients([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearching(true);

        const data =
          await patientService.getAll({
            search: keyword,
            sort: "name",
          });

        setPatients(
          data.patients || []
        );
      } catch (error) {
        console.error(
          "Patient search failed:",
          error
        );
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, editing]);


  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const updateForm = (
    field,
    value
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };


  const updatePatient = (
    field,
    value
  ) => {
    setPatientForm((current) => ({
      ...current,
      [field]: value,
    }));
  };


  /*
  |--------------------------------------------------------------------------
  | Register New Patient
  |--------------------------------------------------------------------------
  */

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

      const data =
        await patientService.create({
          ...patientForm,
          status: "active",
        });

      const newPatient =
        data.patient || data;

      setSelectedPatient(
        newPatient
      );

      setSearch(
        patientName(newPatient)
      );

      setPatients([]);
      setShowRegistration(false);

      setPatientForm({
        ...emptyPatient,
      });
    } catch (error) {
      setError(
        error.message ||
          "Unable to register patient."
      );
    } finally {
      setSavingPatient(false);
    }
  };


  /*
  |--------------------------------------------------------------------------
  | Create / Reschedule Appointment
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (
      !editing &&
      !selectedPatient
    ) {
      setError(
        "Please select or register a patient first."
      );

      return;
    }

    if (
      !form.appointment_date ||
      !form.appointment_time
    ) {
      setError(
        "Appointment date and time are required."
      );

      return;
    }

    try {
      setSaving(true);
      setError("");

      let data;

      /*
      |--------------------------------------------------------------------------
      | Reschedule
      |--------------------------------------------------------------------------
      */

      if (editing) {
        data =
          await appointmentService.update(
            appointment.id,
            {
              doctor_id:
                form.doctor_id
                  ? Number(form.doctor_id)
                  : null,

              appointment_date:
                form.appointment_date,

              appointment_time:
                form.appointment_time,

              reason_for_visit:
                form.reason_for_visit ||
                null,
            }
          );
      }

      /*
      |--------------------------------------------------------------------------
      | New Walk-in
      |--------------------------------------------------------------------------
      */

      else {
        data =
          await appointmentService.create({
            patient_id:
              selectedPatient.id,

            doctor_id:
              form.doctor_id
                ? Number(form.doctor_id)
                : null,

            appointment_date:
              form.appointment_date,

            appointment_time:
              form.appointment_time,

            appointment_type:
              "walk_in",

            reason_for_visit:
              form.reason_for_visit ||
              null,
          });
      }

      onSaved(
        data.appointment || data
      );
    } catch (error) {
      setError(
        error.message ||
          "Unable to save appointment."
      );
    } finally {
      setSaving(false);
    }
  };


  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="staff-appointment-modal-backdrop">
      <div className="staff-appointment-modal">

        {/* HEADER */}

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

          <button
            type="button"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>


        <form
          onSubmit={handleSubmit}
          className="staff-appointment-modal-body"
        >

          {/* PATIENT SEARCH */}

          {!editing && (
            <section className="staff-appointment-form-section">
              <h3>Patient</h3>

              {selectedPatient ? (
                <div className="staff-appointment-selected-patient">
                  <div>
                    <strong>
                      {patientName(
                        selectedPatient
                      )}
                    </strong>

                    <span>
                      {selectedPatient.patient_number}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPatient(null);
                      setSearch("");
                      setPatients([]);
                    }}
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
                      onChange={(event) =>
                        setSearch(
                          event.target.value
                        )
                      }
                    />
                  </label>

                  {searching && (
                    <p className="staff-appointment-form-hint">
                      Searching...
                    </p>
                  )}

                  {patients.length > 0 && (
                    <div className="staff-appointment-patient-results">
                      {patients.map(
                        (patient) => (
                          <button
                            type="button"
                            key={patient.id}
                            onClick={() => {
                              setSelectedPatient(
                                patient
                              );

                              setSearch(
                                patientName(
                                  patient
                                )
                              );

                              setPatients([]);
                              setShowRegistration(false);
                            }}
                          >
                            <strong>
                              {patientName(
                                patient
                              )}
                            </strong>

                            <span>
                              {patient.patient_number}
                              {" • "}
                              {patient.phone_number ||
                                "No contact"}
                            </span>
                          </button>
                        )
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    className="staff-appointment-register-toggle"
                    onClick={() =>
                      setShowRegistration(
                        (value) =>
                          !value
                      )
                    }
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


          {/* REGISTER PATIENT */}

          {showRegistration &&
            !editing &&
            !selectedPatient && (
              <section className="staff-appointment-form-section">
                <h3>
                  Register New Patient
                </h3>

                <div className="staff-appointment-form-grid">

                  <label>
                    First Name *
                    <input
                      type="text"
                      value={
                        patientForm.first_name
                      }
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
                      value={
                        patientForm.middle_name
                      }
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
                      value={
                        patientForm.last_name
                      }
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
                      value={
                        patientForm.suffix
                      }
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
                      value={
                        patientForm.birth_date
                      }
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
                      value={
                        patientForm.sex
                      }
                      onChange={(event) =>
                        updatePatient(
                          "sex",
                          event.target.value
                        )
                      }
                    >
                      <option value="">
                        Select
                      </option>

                      <option value="Male">
                        Male
                      </option>

                      <option value="Female">
                        Female
                      </option>
                    </select>
                  </label>


                  <label>
                    Contact Number
                    <input
                      type="text"
                      value={
                        patientForm.phone_number
                      }
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
                      value={
                        patientForm.email
                      }
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
                      value={
                        patientForm.barangay
                      }
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
                      value={
                        patientForm.blood_type
                      }
                      onChange={(event) =>
                        updatePatient(
                          "blood_type",
                          event.target.value
                        )
                      }
                    >
                      <option value="">
                        Unknown
                      </option>

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
                  disabled={
                    savingPatient
                  }
                  onClick={
                    registerPatient
                  }
                >
                  {savingPatient
                    ? "Registering..."
                    : "Register & Select Patient"}
                </button>
              </section>
            )}


          {/* APPOINTMENT */}

          <section className="staff-appointment-form-section">
            <h3>
              Appointment Information
            </h3>

            <div className="staff-appointment-form-grid">

              <label>
                Date *
                <input
                  type="date"
                  value={
                    form.appointment_date
                  }
                  onChange={(event) =>
                    updateForm(
                      "appointment_date",
                      event.target.value
                    )
                  }
                />
              </label>


              <label>
                Time *
                <input
                  type="time"
                  value={
                    form.appointment_time
                  }
                  onChange={(event) =>
                    updateForm(
                      "appointment_time",
                      event.target.value
                    )
                  }
                />
              </label>


              <label className="full">
                Doctor

                <select
                  value={
                    form.doctor_id
                  }
                  onChange={(event) =>
                    updateForm(
                      "doctor_id",
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Unassigned / Assign Later
                  </option>

                  {doctors.map(
                    (doctor) => (
                      <option
                        value={
                          doctor.id
                        }
                        key={
                          doctor.id
                        }
                      >
                        {doctorName(
                          doctor
                        )}
                      </option>
                    )
                  )}
                </select>
              </label>


              <label className="full">
                Reason for Visit

                <textarea
                  rows="4"
                  value={
                    form.reason_for_visit
                  }
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


          {/* ERROR */}

          {error && (
            <div className="staff-appointment-form-error">
              {error}
            </div>
          )}


          {/* FOOTER */}

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
              disabled={saving}
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