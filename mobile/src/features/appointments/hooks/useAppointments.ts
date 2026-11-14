
import { isAxiosError } from 'axios';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  getUpcomingAppointment,
  PatientUpcomingAppointment,
} from '../services/appointmentService';

// Convert API errors into patient-friendly messages.
function getAppointmentError(error: unknown): string {
  if (isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      'Unable to load your appointment.'
    );
  }

  return 'Something went wrong while loading your appointment.';
}

export default function useAppointments() {
  const [
    upcomingAppointment,
    setUpcomingAppointment,
  ] = useState<PatientUpcomingAppointment | null>(
    null
  );

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // Manual refresh, triggered by the application.
  const loadUpcomingAppointment = useCallback(
    async () => {
      setLoading(true);
      setError(null);

      try {
        const appointment =
          await getUpcomingAppointment();

        setUpcomingAppointment(appointment);
      } catch (err) {
        setUpcomingAppointment(null);
        setError(getAppointmentError(err));
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Initial loading when the hook mounts.
  useEffect(() => {
    let active = true;

    void getUpcomingAppointment()
      .then((appointment) => {
        if (!active) return;

        setUpcomingAppointment(appointment);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active) return;

        setUpcomingAppointment(null);
        setError(getAppointmentError(err));
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    // Ignore responses after the component unmounts.
    return () => {
      active = false;
    };
  }, []);

  return {
    upcomingAppointment,
    loading,
    error,
    refreshAppointments: loadUpcomingAppointment,
  };
}
