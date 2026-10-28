import { useEffect, useState } from "react";
import { Activity, X } from "lucide-react";

import useVitalSigns from "../../hooks/useVitalSigns";
import { getAppointmentPatientName } from "../../../../shared/utils/appointmentUtils";

const emptyForm = {
  blood_pressure_systolic: "",
  blood_pressure_diastolic: "",
  oxygen_saturation: "",
  temperature: "",
  heart_rate: "",
  respiratory_rate: "",
  weight: "",
  height: "",
};

const StaffVitalSignsModal = ({
  appointment,
  onClose,
  onSaved,
}) => {
  const {
    loadVitalSigns,
    createVitalSign,
    updateVitalSign,
    saving,
  } = useVitalSigns();

  const [form, setForm] = useState(emptyForm);
  const [existingVitalSign, setExistingVitalSign] = useState(null);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadExisting = async () => {
      if (!appointment?.id) return;

      try {
        setLoadingExisting(true);
        setError("");

        const data = await loadVitalSigns({
          appointment_id: appointment.id,
        });

        const vitalSign = data.vital_signs?.[0] || null;

        if (vitalSign) {
          setExistingVitalSign(vitalSign);

          setForm({
            blood_pressure_systolic:
              vitalSign.blood_pressure_systolic ?? "",

            blood_pressure_diastolic:
              vitalSign.blood_pressure_diastolic ?? "",

            oxygen_saturation:
              vitalSign.oxygen_saturation ?? "",

            temperature:
              vitalSign.temperature ?? "",

            heart_rate:
              vitalSign.heart_rate ?? "",

            respiratory_rate:
              vitalSign.respiratory_rate ?? "",

            weight:
              vitalSign.weight ?? "",

            height:
              vitalSign.height ?? "",
          });
        }
      } catch (error) {
        console.error("Failed to load appointment vital signs:", error);

        setError(
          error.message ||
            "Unable to load existing vital signs."
        );
      } finally {
        setLoadingExisting(false);
      }
    };

    loadExisting();
  }, [appointment?.id, loadVitalSigns]);

  const updateForm = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  };

  const numberOrNull = (value) => {
    if (value === "" || value === null || value === undefined) {
      return null;
    }

    return Number(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!appointment?.id) {
      setError("Appointment information is missing.");
      return;
    }

    const hasSystolic = form.blood_pressure_systolic !== "";
    const hasDiastolic = form.blood_pressure_diastolic !== "";

    if (hasSystolic !== hasDiastolic) {
      setError(
        "Please enter both systolic and diastolic blood pressure."
      );
      return;
    }

    const hasMeasurement = Object.values(form).some(
      (value) => value !== ""
    );

    if (!hasMeasurement) {
      setError("Please enter at least one vital sign.");
      return;
    }

    const payload = {
      blood_pressure_systolic: numberOrNull(
        form.blood_pressure_systolic
      ),

      blood_pressure_diastolic: numberOrNull(
        form.blood_pressure_diastolic
      ),

      oxygen_saturation: numberOrNull(
        form.oxygen_saturation
      ),

      temperature: numberOrNull(form.temperature),

      heart_rate: numberOrNull(form.heart_rate),

      respiratory_rate: numberOrNull(
        form.respiratory_rate
      ),

      weight: numberOrNull(form.weight),

      height: numberOrNull(form.height),
    };

    try {
      setError("");

      let vitalSign;

      if (existingVitalSign) {
        vitalSign = await updateVitalSign(
          existingVitalSign.id,
          payload
        );
      } else {
        vitalSign = await createVitalSign({
          appointment_id: appointment.id,
          ...payload,
        });
      }

      onSaved?.(vitalSign);
      onClose();
    } catch (error) {
      setError(
        error.message || "Unable to save vital signs."
      );
    }
  };

  if (!appointment) return null;

  return (
    <div className="staff-vitals-modal-overlay">
      <div className="staff-vitals-modal">
        <div className="staff-vitals-modal-header">
          <div>
            <div className="staff-vitals-modal-title">
              <Activity size={20} />

              <h2>
                {existingVitalSign
                  ? "Edit Vital Signs"
                  : "Record Vital Signs"}
              </h2>
            </div>

            <p>
              {getAppointmentPatientName(
                appointment.patient
              )}
            </p>
          </div>

          <button
            type="button"
            className="staff-vitals-modal-close"
            onClick={onClose}
            disabled={saving}
          >
            <X size={20} />
          </button>
        </div>

        {loadingExisting ? (
          <div className="staff-vitals-loading">
            Loading vital signs...
          </div>
        ) : (
          <form
            className="staff-vitals-form"
            onSubmit={handleSubmit}
          >
            {error && (
              <div className="staff-vitals-error">
                {error}
              </div>
            )}

            <div className="staff-vitals-section">
              <h3>Blood Pressure</h3>

              <div className="staff-vitals-bp-grid">
                <label>
                  Systolic
                  <div className="staff-vitals-input-unit">
                    <input
                      type="number"
                      min="1"
                      max="400"
                      value={form.blood_pressure_systolic}
                      onChange={(event) =>
                        updateForm(
                          "blood_pressure_systolic",
                          event.target.value
                        )
                      }
                      placeholder="120"
                    />

                    <span>mmHg</span>
                  </div>
                </label>

                <label>
                  Diastolic
                  <div className="staff-vitals-input-unit">
                    <input
                      type="number"
                      min="1"
                      max="300"
                      value={form.blood_pressure_diastolic}
                      onChange={(event) =>
                        updateForm(
                          "blood_pressure_diastolic",
                          event.target.value
                        )
                      }
                      placeholder="80"
                    />

                    <span>mmHg</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="staff-vitals-form-grid">
              <label>
                Oxygen Saturation
                <div className="staff-vitals-input-unit">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.oxygen_saturation}
                    onChange={(event) =>
                      updateForm(
                        "oxygen_saturation",
                        event.target.value
                      )
                    }
                    placeholder="98"
                  />

                  <span>%</span>
                </div>
              </label>

              <label>
                Temperature
                <div className="staff-vitals-input-unit">
                  <input
                    type="number"
                    min="20"
                    max="50"
                    step="0.1"
                    value={form.temperature}
                    onChange={(event) =>
                      updateForm(
                        "temperature",
                        event.target.value
                      )
                    }
                    placeholder="36.7"
                  />

                  <span>°C</span>
                </div>
              </label>

              <label>
                Heart Rate
                <div className="staff-vitals-input-unit">
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={form.heart_rate}
                    onChange={(event) =>
                      updateForm(
                        "heart_rate",
                        event.target.value
                      )
                    }
                    placeholder="75"
                  />

                  <span>bpm</span>
                </div>
              </label>

              <label>
                Respiratory Rate
                <div className="staff-vitals-input-unit">
                  <input
                    type="number"
                    min="1"
                    max="150"
                    value={form.respiratory_rate}
                    onChange={(event) =>
                      updateForm(
                        "respiratory_rate",
                        event.target.value
                      )
                    }
                    placeholder="18"
                  />

                  <span>/min</span>
                </div>
              </label>

              <label>
                Weight
                <div className="staff-vitals-input-unit">
                  <input
                    type="number"
                    min="0.1"
                    max="1000"
                    step="0.1"
                    value={form.weight}
                    onChange={(event) =>
                      updateForm(
                        "weight",
                        event.target.value
                      )
                    }
                    placeholder="65.5"
                  />

                  <span>kg</span>
                </div>
              </label>

              <label>
                Height
                <div className="staff-vitals-input-unit">
                  <input
                    type="number"
                    min="10"
                    max="300"
                    step="0.1"
                    value={form.height}
                    onChange={(event) =>
                      updateForm(
                        "height",
                        event.target.value
                      )
                    }
                    placeholder="170"
                  />

                  <span>cm</span>
                </div>
              </label>
            </div>

            <div className="staff-vitals-note">
              Vital signs should reflect the actual measurements
              taken from the patient. Leave measurements blank if
              they were not taken.
            </div>

            <div className="staff-vitals-modal-actions">
              <button
                type="button"
                className="staff-vitals-cancel-btn"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="staff-vitals-save-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : existingVitalSign
                    ? "Update Vital Signs"
                    : "Save Vital Signs"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default StaffVitalSignsModal;