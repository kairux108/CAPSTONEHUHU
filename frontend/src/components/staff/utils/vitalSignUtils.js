export const formatBloodPressure = (systolic, diastolic) => {
  if (systolic == null && diastolic == null) return "—";
  if (systolic == null || diastolic == null) return "Incomplete";

  return `${systolic}/${diastolic} mmHg`;
};

export const formatOxygenSaturation = (value) => {
  if (value == null || value === "") return "—";
  return `${value}%`;
};

export const formatTemperature = (value) => {
  if (value == null || value === "") return "—";
  return `${Number(value).toFixed(1)} °C`;
};

export const formatHeartRate = (value) => {
  if (value == null || value === "") return "—";
  return `${value} bpm`;
};

export const formatRespiratoryRate = (value) => {
  if (value == null || value === "") return "—";
  return `${value} breaths/min`;
};

export const formatWeight = (value) => {
  if (value == null || value === "") return "—";
  return `${Number(value).toFixed(1)} kg`;
};

export const formatHeight = (value) => {
  if (value == null || value === "") return "—";
  return `${Number(value).toFixed(1)} cm`;
};

export const formatVitalDateTime = (value) => {
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

export const hasVitalSigns = (vitalSign) => {
  if (!vitalSign) return false;

  return [
    vitalSign.blood_pressure_systolic,
    vitalSign.blood_pressure_diastolic,
    vitalSign.oxygen_saturation,
    vitalSign.temperature,
    vitalSign.heart_rate,
    vitalSign.respiratory_rate,
    vitalSign.weight,
    vitalSign.height,
  ].some(
    (value) =>
      value !== null &&
      value !== undefined &&
      value !== ""
  );
};