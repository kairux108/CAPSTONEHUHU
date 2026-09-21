import {
  Save,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

const emptyForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  sex: "",
  birthDate: "",
  contactNumber: "",
  email: "",
  address: "",
  bloodType: "",
  civilStatus: "",
  emergencyContact: "",
  emergencyNumber: "",
};

const PatientRegistrationForm = ({
  patient,
  onSave,
  onCancel,
}) => {
  const [form, setForm] =
    useState(emptyForm);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (patient) {
      setForm({
        firstName: patient.firstName || "",
        middleName: patient.middleName || "",
        lastName: patient.lastName || "",
        sex: patient.sex || "",
        birthDate: patient.birthDate || "",
        contactNumber: patient.contactNumber || "",
        email: patient.email || "",
        address: patient.address || "",
        bloodType: patient.bloodType || "",
        civilStatus: patient.civilStatus || "",
        emergencyContact: patient.emergencyContact || "",
        emergencyNumber: patient.emergencyNumber || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [patient]);

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.sex ||
      !form.birthDate
    ) {
      setError(
        "First name, last name, sex, and birth date are required."
      );
      return;
    }

    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-[850px] overflow-y-auto rounded-[26px] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-7 py-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-blue-500">
              Patient Management
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-[#153a5d]">
              {patient
                ? "Edit Patient"
                : "Register New Patient"}
            </h2>
          </div>

          <button
            onClick={onCancel}
            className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-7"
        >
          <SectionTitle>
            Personal Information
          </SectionTitle>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Input
              label="First Name *"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First name"
            />

            <Input
              label="Middle Name"
              name="middleName"
              value={form.middleName}
              onChange={handleChange}
              placeholder="Middle name"
            />

            <Input
              label="Last Name *"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last name"
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Select
              label="Sex *"
              name="sex"
              value={form.sex}
              onChange={handleChange}
              options={[
                "Male",
                "Female",
              ]}
            />

            <Input
              label="Birth Date *"
              name="birthDate"
              type="date"
              value={form.birthDate}
              onChange={handleChange}
            />

            <Select
              label="Civil Status"
              name="civilStatus"
              value={form.civilStatus}
              onChange={handleChange}
              options={[
                "Single",
                "Married",
                "Widowed",
                "Separated",
              ]}
            />
          </div>

          <div className="mt-4">
            <Select
              label="Blood Type"
              name="bloodType"
              value={form.bloodType}
              onChange={handleChange}
              options={[
                "A+",
                "A-",
                "B+",
                "B-",
                "AB+",
                "AB-",
                "O+",
                "O-",
              ]}
            />
          </div>

          <div className="mt-8">
            <SectionTitle>
              Contact Information
            </SectionTitle>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input
              label="Contact Number"
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              placeholder="09XXXXXXXXX"
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="patient@example.com"
            />
          </div>

          <div className="mt-4">
            <Input
              label="Home Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Complete address"
            />
          </div>

          <div className="mt-8">
            <SectionTitle>
              Emergency Contact
            </SectionTitle>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input
              label="Contact Person"
              name="emergencyContact"
              value={form.emergencyContact}
              onChange={handleChange}
              placeholder="Emergency contact name"
            />

            <Input
              label="Contact Number"
              name="emergencyNumber"
              value={form.emergencyNumber}
              onChange={handleChange}
              placeholder="09XXXXXXXXX"
            />
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-8 flex justify-end gap-3 border-t border-slate-200 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-[#3185e8] px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-600"
            >
              <Save size={16} />

              {patient
                ? "Save Changes"
                : "Register Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SectionTitle = ({
  children,
}) => (
  <h3 className="text-sm font-extrabold text-[#153a5d]">
    {children}
  </h3>
);

const Input = ({
  label,
  ...props
}) => (
  <label className="block">
    <span className="mb-2 block text-xs font-bold text-[#35536c]">
      {label}
    </span>

    <input
      {...props}
      className="h-11 w-full rounded-xl border border-slate-200 bg-[#f9fbfd] px-4 text-sm text-[#173957] outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
    />
  </label>
);

const Select = ({
  label,
  options,
  ...props
}) => (
  <label className="block">
    <span className="mb-2 block text-xs font-bold text-[#35536c]">
      {label}
    </span>

    <select
      {...props}
      className="h-11 w-full rounded-xl border border-slate-200 bg-[#f9fbfd] px-4 text-sm text-[#173957] outline-none focus:border-blue-400"
    >
      <option value="">
        Select
      </option>

      {options.map((option) => (
        <option
          key={option}
          value={option}
        >
          {option}
        </option>
      ))}
    </select>
  </label>
);

export default PatientRegistrationForm;