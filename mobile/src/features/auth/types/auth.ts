export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  last_active_at?: string | null;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  message: string;
  token: string;
  user: AuthUser;
};

export type RegisterCredentials = {
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  birth_date: string;
  sex: 'male' | 'female';
  phone_number: string;
  email: string;
  password: string;
};

export type RegisteredPatient = {
  id: number;
  patient_number: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  birth_date: string;
  sex: string;
  phone_number: string | null;
};

export type RegisterResponse = {
  message: string;
  user: AuthUser;
  patient: RegisteredPatient;
};