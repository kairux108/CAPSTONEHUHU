import api from '../../../services/api';

export type PatientUpcomingAppointment = {
  id: number;
  appointment_number: string;

  doctor: {
    id: number;
    name: string;
  } | null;

  appointment_date: string;
  appointment_time: string;
  appointment_type: string;
  reason_for_visit: string | null;
  status: string;
};

type UpcomingAppointmentResponse = {
  appointment: PatientUpcomingAppointment | null;
};

export async function getUpcomingAppointment() {
  const response =
    await api.get<UpcomingAppointmentResponse>(
      '/patient/appointments/upcoming'
    );

  return response.data.appointment;
}