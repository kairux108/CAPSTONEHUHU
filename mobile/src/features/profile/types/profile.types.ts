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

export type ProfileFormValues = {
  first_name: string;
  middle_name: string;
  last_name: string;
  birth_date: string;
  sex: 'male' | 'female' | '';
  phone_number: string;
  email: string;
  address: string;
  city: string;
  province: string;
  blood_type: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
};

export type ProfileFieldErrors = Partial<
  Record<keyof ProfileFormValues, string>
>;

export type ProfileSaveResult = {
  success: boolean;
  message: string;
  fieldErrors?: ProfileFieldErrors;
};
