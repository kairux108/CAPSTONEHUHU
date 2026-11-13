
import api from "../../../shared/services/api";

/*
|--------------------------------------------------------------------------
| CURA - Doctor Medical History Service
|--------------------------------------------------------------------------
|
| Retrieves completed patient consultation records.
|
| Laravel verifies:
| - Authenticated doctor
| - Active doctor account
| - Current appointment assignment
|
| Draft prescriptions are not returned.
|
*/

export const getDoctorPatientMedicalHistory = (
  patientId,
  signal
) => {
  const id = String(patientId ?? "");

  if (!/^[1-9]\d*$/.test(id)) {
    throw new Error("Invalid patient ID.");
  }

  return api(
    `/doctor/patients/${encodeURIComponent(id)}/medical-history`,
    {
      method: "GET",
      signal,
    }
  );
};
