export const normalizeQueueValue = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

export const formatQueueLabel = (value) => {
  if (!value) return "—";

  return String(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

export const getQueuePatientName = (entry) => {
  const patient = entry?.appointment?.patient;

  if (!patient) return "Unknown Patient";

  return [
    patient.first_name,
    patient.middle_name,
    patient.last_name,
    patient.suffix,
  ]
    .filter(Boolean)
    .join(" ");
};

export const getQueuePatientInitials = (entry) => {
  const patient = entry?.appointment?.patient;

  if (!patient) return "P";

  return [patient.first_name, patient.last_name]
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export const getQueuePatientNumber = (entry) =>
  entry?.appointment?.patient?.patient_number || "—";

export const getQueuePatientPhone = (entry) =>
  entry?.appointment?.patient?.phone_number || "—";

export const getQueuePatientEmail = (entry) =>
  entry?.appointment?.patient?.email || "—";

export const getQueuePatientAddress = (entry) => {
  const patient = entry?.appointment?.patient;

  if (!patient) return "—";

  const address = [
    patient.street_address,
    patient.barangay,
    patient.city,
    patient.province,
  ]
    .filter(Boolean)
    .join(", ");

  return address || "—";
};

export const getQueuePatientBirthDate = (entry) =>
  entry?.appointment?.patient?.birth_date || null;

export const calculateQueuePatientAge = (birthDate) => {
  if (!birthDate) return null;

  const birth = new Date(birthDate);

  if (Number.isNaN(birth.getTime())) {
    return null;
  }

  const today = new Date();

  let age =
    today.getFullYear() -
    birth.getFullYear();

  const monthDifference =
    today.getMonth() -
    birth.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 &&
      today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age >= 0 ? age : null;
};

export const getQueueDoctorName = (entry) =>
  entry?.doctor?.name ||
  entry?.appointment?.doctor?.name ||
  "Unassigned";

export const getQueueType = (entry) =>
  entry?.appointment?.appointment_type || null;

export const getQueueTypeLabel = (entry) => {
  const type = getQueueType(entry);

  if (!type) return "—";

  if (type === "walk_in") {
    return "Walk-in";
  }

  return formatQueueLabel(type);
};

export const getQueueTypeClass = (entry) => {
  const type = normalizeQueueValue(
    getQueueType(entry)
  );

  if (type === "walk_in") {
    return "walkin";
  }

  return "scheduled";
};

export const getQueueStatusClass = (status) => {
  const value = normalizeQueueValue(status);

  const classes = {
    waiting: "waiting",
    called: "called",
    in_consultation: "consulting",
    completed: "completed",
    cancelled: "cancelled",
  };

  return classes[value] || "default";
};

export const getQueuePriorityClass = (priority) => {
  const value = normalizeQueueValue(priority);

  const classes = {
    normal: "normal",
    priority: "priority",
    emergency: "emergency",
  };

  return classes[value] || "normal";
};

export const formatQueueNumber = (queueNumber) => {
  if (!queueNumber) return "—";

  const parts = String(queueNumber).split("-");

  if (parts.length >= 3) {
    return `Q-${parts[parts.length - 1]}`;
  }

  return queueNumber;
};

export const formatFullQueueNumber = (queueNumber) =>
  queueNumber || "—";

export const formatQueueTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatQueueDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatQueueDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatQueueEta = (minutes) => {
  if (
    minutes === null ||
    minutes === undefined ||
    minutes === ""
  ) {
    return "Not available";
  }

  const value = Number(minutes);

  if (Number.isNaN(value)) {
    return "Not available";
  }

  if (value === 0) {
    return "Now";
  }

  if (value === 1) {
    return "1 min";
  }

  return `${value} mins`;
};

export const getQueueReasonForVisit = (entry) =>
  entry?.appointment?.reason_for_visit ||
  "No reason provided.";

export const getQueuePriorityReason = (entry) =>
  entry?.priority_reason ||
  "No priority reason provided.";

export const isQueueActive = (status) =>
  [
    "waiting",
    "called",
    "in_consultation",
  ].includes(normalizeQueueValue(status));

export const isQueueCompleted = (status) =>
  normalizeQueueValue(status) ===
  "completed";

export const isQueueCancelled = (status) =>
  normalizeQueueValue(status) ===
  "cancelled";