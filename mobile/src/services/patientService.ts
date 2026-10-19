import {
  PatientProfileResponse,
  UpdatePatientProfileData,
  UpdatePatientProfileResponse,
} from '../types/patientProfile';

import api from './api';

export async function getPatientProfile() {
  const response =
    await api.get<PatientProfileResponse>(
      '/patient/profile'
    );

  return response.data.patient;
}

export async function updatePatientProfile(
  data: UpdatePatientProfileData
) {
  const response =
    await api.patch<UpdatePatientProfileResponse>(
      '/patient/profile',
      data
    );

  return response.data;
}