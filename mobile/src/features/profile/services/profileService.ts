import api from '../../../services/api';
import type {
  PatientProfileResponse,
  UpdatePatientProfileData,
  UpdatePatientProfileResponse,
} from '../types/profile.types';

export async function getPatientProfile() {
  const response = await api.get<PatientProfileResponse>(
    '/patient/profile'
  );

  return response.data.patient;
}

export async function updatePatientProfile(
  data: UpdatePatientProfileData
) {
  const response = await api.patch<UpdatePatientProfileResponse>(
    '/patient/profile',
    data
  );

  return response.data;
}
