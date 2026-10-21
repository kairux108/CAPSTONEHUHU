import axios from 'axios';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  getUpcomingAppointment,
  PatientUpcomingAppointment,
} from '../services/appointmentService';

export default function useAppointments() {
  const [
    upcomingAppointment,
    setUpcomingAppointment,
  ] = useState<PatientUpcomingAppointment | null>(
    null
  );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadUpcomingAppointment =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const appointment =
          await getUpcomingAppointment();

        setUpcomingAppointment(
          appointment
        );
      } catch (err) {
        setUpcomingAppointment(null);

        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              'Unable to load your appointment.'
          );
        } else {
          setError(
            'Something went wrong while loading your appointment.'
          );
        }
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadUpcomingAppointment();
  }, [loadUpcomingAppointment]);

  return {
    upcomingAppointment,
    loading,
    error,

    refreshAppointments:
      loadUpcomingAppointment,
  };
}