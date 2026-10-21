
export type Specialty = {
  id: string;
  name: string;
};

export type BookingDoctor = {
  id: number;
  name: string;
  specialty?: string;
  description?: string;
};

export type BookingStep = 1 | 2 | 3 | 4;

export type BookingDraft = {
  doctor: BookingDoctor | null;
  date: string;
  time: string;
  reason: string;
};

export type TimeSlot = {
  time: string;
  available: boolean;
};

export type BookingPayload = {
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  reason_for_visit: string;
};

export type BookingConfirmation = {
  id: number;
  appointment_number: string;
  status: string;
};
