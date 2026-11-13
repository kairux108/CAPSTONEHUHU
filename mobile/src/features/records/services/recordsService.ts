
import api from '../../../services/api';

/*
|--------------------------------------------------------------------------
| CURA - Patient Medical Records Service
|--------------------------------------------------------------------------
|
| Retrieves medical records belonging to the
| authenticated patient.
|
| Uses the existing mobile API client.
|
*/

// Medication details from an issued prescription.
export type PatientRecordMedication = {
  medicine: string;
  strength: string | null;
  dosage: string | null;
  frequency: string | null;
  duration_days: number | null;
  duration: string | null;
  instructions: string | null;
};

// Issued prescription.
export type PatientRecordPrescription = {
  id: number;
  status: string;
  issued_at: string | null;
  medications: PatientRecordMedication[];
};

// One completed consultation record.
export type PatientMedicalRecord = {
  consultation_id: number;
  completed_at: string | null;
  doctor_name: string | null;

  diagnosis: {
    name: string;
  } | null;

  care_instructions: string | null;
  follow_up_instructions: string | null;

  prescription: PatientRecordPrescription | null;
};

// Laravel pagination response.
export type PatientRecordsPagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: PatientMedicalRecord[];
};

// Complete API response.
export type PatientMedicalRecordsResponse = {
  patient: {
    id: number;
    patient_number: string;
  };

  records: PatientRecordsPagination;
};

/*
|--------------------------------------------------------------------------
| Get Patient Medical Records
|--------------------------------------------------------------------------
|
| Laravel determines patient identity from the
| authenticated account.
|
| No patient ID is supplied by the mobile app.
|
*/

export async function getPatientMedicalRecords(
  page: number = 1
): Promise<PatientMedicalRecordsResponse> {
  const response =
    await api.get<PatientMedicalRecordsResponse>(
      '/patient/medical-records',
      {
        params: {
          page,
        },
      }
    );

  return response.data;
}
