
import api from '../../../services/api';

import type {
  BookingDoctor,
  BookingPayload,
  BookingConfirmation,
  TimeSlot,
} from '../types/booking.types';

/*
|--------------------------------------------------------------------------
| Fetch Active Doctors
|--------------------------------------------------------------------------
*/

export async function fetchBookingDoctors(): Promise<BookingDoctor[]> {
  const response = await api.get<{
    doctors: BookingDoctor[];
  }>('/patient/booking/doctors');

  if (!Array.isArray(response.data?.doctors)) {
    throw new Error('Invalid doctor list response.');
  }

  return response.data.doctors;
}

/*
|--------------------------------------------------------------------------
| Fetch Available Appointment Slots
|--------------------------------------------------------------------------
*/

export async function fetchAvailableTimeSlots(
  doctorId: number,
  date: string
): Promise<TimeSlot[]> {
  const response = await api.get<{
    slots: TimeSlot[];
  }>('/patient/booking/availability', {
    params: {
      doctor_id: doctorId,
      date,
    },
  });

  if (!Array.isArray(response.data?.slots)) {
    throw new Error('Invalid booking availability response.');
  }

  return response.data.slots;
}

/*
|--------------------------------------------------------------------------
| Submit Patient Appointment
|--------------------------------------------------------------------------
*/

export async function submitPatientBooking(
  payload: BookingPayload
): Promise<BookingConfirmation> {
  const response = await api.post<{
    message: string;
    appointment: BookingConfirmation;
  }>('/patient/booking', payload);

  const bookingConfirmation = response.data?.appointment;

  if (
    !bookingConfirmation?.id ||
    !bookingConfirmation.appointment_number
  ) {
    throw new Error(
      'Invalid appointment confirmation response.'
    );
  }

  return bookingConfirmation;
}
