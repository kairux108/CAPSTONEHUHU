import api from '../../../services/api';

/*
|--------------------------------------------------------------------------
| CURA - Patient Medication Service
|--------------------------------------------------------------------------
| Read-only access to medications from issued prescriptions.
| Patient identity is determined by Laravel authentication.
*/

export type PatientMedication = {
  id: number;
  prescription_id: number;

  medicine: string;
  strength: string | null;
  dosage: string | null;
  frequency: string | null;
  duration_days: number | null;
  duration: string | null;
  instructions: string | null;

  schedule_type: string | null;
  as_needed: boolean;
  administration_times: string[] | null;
  interval_hours: number | null;
  interval_scope: string | null;
  meal_relation: string | null;
  timing_instructions: string | null;

  issued_at: string | null;
};

type PatientMedicationsResponse = {
  medications: PatientMedication[];
};

/*
|--------------------------------------------------------------------------
| Retrieve Patient Medications
|--------------------------------------------------------------------------
*/

export async function getPatientMedications(): Promise<
  PatientMedication[]
> {
  const response = await api.get<PatientMedicationsResponse>(
    '/patient/medications'
  );

  if (!Array.isArray(response.data?.medications)) {
    throw new Error('Invalid medication response.');
  }

  return response.data.medications;
}
