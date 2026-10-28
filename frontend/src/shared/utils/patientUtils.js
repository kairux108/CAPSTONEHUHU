export const getPatientFullName = (patient) =>
  [
    patient?.first_name,
    patient?.middle_name,
    patient?.last_name,
    patient?.suffix,
  ].filter(Boolean).join(" ");

export const getPatientInitials = (patient) =>
  [patient?.first_name, patient?.last_name]
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const getPatientAge = (birthDate) => {
  if (!birthDate) return "—";

  const birth = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDifference = today.getMonth() - birth.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
};

export const getPatientAddress = (patient) =>
  [
    patient?.street_address,
    patient?.barangay,
    patient?.city,
    patient?.province,
  ].filter(Boolean).join(", ") || "—";

export const getPatientStatusClass = (status) => {
  const normalized = String(status || "").trim().toLowerCase();

  if (normalized === "active") return "active";
  if (normalized === "inactive") return "inactive";

  return "default";
};