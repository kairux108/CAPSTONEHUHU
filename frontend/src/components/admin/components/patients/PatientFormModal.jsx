import { X } from "lucide-react";
import { useEffect, useState } from "react";

const emptyForm = {
  first_name: "",
  middle_name: "",
  last_name: "",
  suffix: "",
  birth_date: "",
  sex: "",
  phone_number: "",
  email: "",
  street_address: "",
  barangay: "",
  city: "Tagum City",
  province: "Davao del Norte",
  blood_type: "",
  emergency_contact_name: "",
  emergency_contact_relationship: "",
  emergency_contact_phone: "",
  status: "active",
};

const PatientFormModal = ({
  open,
  patient,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(patient);

  useEffect(() => {
    if (!open) return;

    setForm({
      first_name: patient?.first_name || "",
      middle_name: patient?.middle_name || "",
      last_name: patient?.last_name || "",
      suffix: patient?.suffix || "",

      birth_date: patient?.birth_date
        ? String(patient.birth_date).slice(0, 10)
        : "",

      sex: patient?.sex || "",
      phone_number: patient?.phone_number || "",
      email: patient?.email || "",
      street_address: patient?.street_address || "",
      barangay: patient?.barangay || "",
      city: patient?.city || "Tagum City",
      province:
        patient?.province || "Davao del Norte",

      blood_type: patient?.blood_type || "",

      emergency_contact_name:
        patient?.emergency_contact_name || "",

      emergency_contact_relationship:
        patient?.emergency_contact_relationship || "",

      emergency_contact_phone:
        patient?.emergency_contact_phone || "",

      status: patient?.status || "active",
    });

    setError("");
  }, [open, patient]);

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.birth_date ||
      !form.sex
    ) {
      setError(
        "First name, last name, birth date and sex are required."
      );

      return;
    }

    try {
      setSaving(true);
      await onSave(form);
    } catch (error) {
      setError(
        error.message || "Unable to save patient."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="user-modal-backdrop"
      onMouseDown={onClose}
    >
      <div
        className="user-modal patient-form-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <div className="user-modal-header">
          <div>
            <h2>
              {isEditing
                ? "Edit Patient"
                : "Register Patient"}
            </h2>

            <p>
              {isEditing
                ? "Update the patient's information."
                : "Register a new patient in CURA."}
            </p>
          </div>

          <button
            type="button"
            className="user-modal-close"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>


        <form onSubmit={handleSubmit}>

          {error && (
            <div className="user-modal-error">
              {error}
            </div>
          )}

          <div className="user-form-grid">

            <label className="user-form-field">
              <span>First Name</span>

              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="First name"
              />
            </label>

            <label className="user-form-field">
              <span>Middle Name</span>

              <input
                name="middle_name"
                value={form.middle_name}
                onChange={handleChange}
                placeholder="Middle name"
              />
            </label>

            <label className="user-form-field">
              <span>Last Name</span>

              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Last name"
              />
            </label>

            <label className="user-form-field">
              <span>Suffix</span>

              <input
                name="suffix"
                value={form.suffix}
                onChange={handleChange}
                placeholder="Jr., Sr., III"
              />
            </label>

            <label className="user-form-field">
              <span>Birth Date</span>

              <input
                type="date"
                name="birth_date"
                value={form.birth_date}
                onChange={handleChange}
              />
            </label>

            <label className="user-form-field">
              <span>Sex</span>

              <select
                name="sex"
                value={form.sex}
                onChange={handleChange}
              >
                <option value="">
                  Select sex
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>
              </select>
            </label>

            <label className="user-form-field">
              <span>Contact Number</span>

              <input
                name="phone_number"
                value={form.phone_number}
                onChange={handleChange}
                placeholder="09XXXXXXXXX"
              />
            </label>

            <label className="user-form-field">
              <span>Email</span>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
              />
            </label>

            <label className="user-form-field user-form-full">
              <span>Street Address</span>

              <input
                name="street_address"
                value={form.street_address}
                onChange={handleChange}
                placeholder="Street / Purok / Sitio"
              />
            </label>

            <label className="user-form-field">
              <span>Barangay</span>

              <input
                name="barangay"
                value={form.barangay}
                onChange={handleChange}
                placeholder="Barangay"
              />
            </label>

            <label className="user-form-field">
              <span>City</span>

              <input
                name="city"
                value={form.city}
                onChange={handleChange}
              />
            </label>

            <label className="user-form-field">
              <span>Province</span>

              <input
                name="province"
                value={form.province}
                onChange={handleChange}
              />
            </label>

            <label className="user-form-field">
              <span>Blood Type</span>

              <select
                name="blood_type"
                value={form.blood_type}
                onChange={handleChange}
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

            <label className="user-form-field">
              <span>Emergency Contact</span>

              <input
                name="emergency_contact_name"
                value={
                  form.emergency_contact_name
                }
                onChange={handleChange}
                placeholder="Full name"
              />
            </label>

            <label className="user-form-field">
              <span>Relationship</span>

              <input
                name="emergency_contact_relationship"
                value={
                  form.emergency_contact_relationship
                }
                onChange={handleChange}
                placeholder="Parent, spouse, sibling..."
              />
            </label>

            <label className="user-form-field">
              <span>Emergency Phone</span>

              <input
                name="emergency_contact_phone"
                value={
                  form.emergency_contact_phone
                }
                onChange={handleChange}
                placeholder="09XXXXXXXXX"
              />
            </label>

            <label className="user-form-field">
              <span>Status</span>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </label>

          </div>


          <div className="user-modal-actions">

            <button
              type="button"
              className="cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Register Patient"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientFormModal;