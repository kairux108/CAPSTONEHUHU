export type PatientProfile = {
  id: number;
  patient_number: string;

  first_name: string;
  middle_name: string | null;
  last_name: string;

  birth_date: string;
  sex: string;

  phone_number: string | null;
  email: string | null;

  address: string | null;
  city: string | null;
  province: string | null;

  blood_type: string | null;

  emergency_contact_name: string | null;
  emergency_contact_number: string | null;

  status: string;
};

export type PatientProfileResponse = {
  patient: PatientProfile;
};

export type UpdatePatientProfileData = {
  first_name: string;
  middle_name: string | null;
  last_name: string;

  birth_date: string;
  sex: 'male' | 'female';

  phone_number: string;
  email: string;

  address: string | null;
  city: string | null;
  province: string | null;

  blood_type: string | null;

  emergency_contact_name: string | null;
  emergency_contact_number: string | null;
};

export type UpdatePatientProfileResponse = {
  message: string;
  patient: PatientProfile;
};