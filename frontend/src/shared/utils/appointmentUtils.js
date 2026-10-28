export const getAppointmentPatientName = (patient) =>
  [
    patient?.first_name,
    patient?.middle_name,
    patient?.last_name,
    patient?.suffix,
  ].filter(Boolean).join(" ") || "Unknown Patient";

export const getAppointmentPatientInitials = (patient) =>
  [patient?.first_name, patient?.last_name]
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "P";

export const getAppointmentDoctorName = (doctor) =>
  doctor?.name || "Unassigned";

export const formatAppointmentDate = (value) => {
  if (!value) return "—";

  const dateValue = String(value).split("T")[0];
  const [year, month, day] = dateValue.split("-").map(Number);

  if (!year || !month || !day) return "—";

  const date = new Date(year, month - 1, day);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatAppointmentTime = (value) => {
  if (!value) return "—";

  const [hour, minute] = String(value).split(":").map(Number);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return "—";
  }

  const date = new Date();
  date.setHours(hour, minute, 0, 0);

  return date.toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatAppointmentDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatAppointmentLabel = (value) => {
  if (!value) return "—";

  return String(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export const getAppointmentStatusClass = (status) => {
  const normalized = String(status || "").trim().toLowerCase();

  const classes = {
    scheduled: "scheduled",
    checked_in: "checked-in",
    completed: "completed",
    cancelled: "cancelled",
    no_show: "no-show",
  };

  return classes[normalized] || "default";
};
