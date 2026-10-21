
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import axios from 'axios';

import type {
  BookingDoctor,
  BookingDraft,
  BookingConfirmation,
  BookingStep,
  TimeSlot,
} from '../types/booking.types';

import {
  fetchBookingDoctors,
  fetchAvailableTimeSlots,
  submitPatientBooking,
} from '../services/bookingService';

import {
  isValidBooking,
} from '../validation/bookingValidation';

/*
|--------------------------------------------------------------------------
| Initial Booking State
|--------------------------------------------------------------------------
*/

const emptyDraft: BookingDraft = {
  doctor: null,
  date: '',
  time: '',
  reason: '',
};

type BookingApiError = {
  message?: string;
  errors?: Record<string, string[]>;
};

/*
|--------------------------------------------------------------------------
| Booking Error Handler
|--------------------------------------------------------------------------
*/

function getSubmissionError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    const data = error.response?.data as
      | BookingApiError
      | undefined;

    if (status === 422) {
      const firstError = Object.values(
        data?.errors ?? {}
      )[0]?.[0];

      return (
        firstError ??
        data?.message ??
        'The selected appointment could not be booked.'
      );
    }

    if (status === 401) {
      return 'Your session has expired. Please log in again.';
    }

    if (status === 403) {
      return 'Your account is not permitted to book appointments.';
    }

    if (status === 409) {
      return 'This appointment time is no longer available.';
    }

    return (
      data?.message ??
      'Unable to confirm the booking. Check your appointments before trying again.'
    );
  }

  return 'Unable to verify the booking. Please check your appointments before trying again.';
}

/*
|--------------------------------------------------------------------------
| CURA Booking Hook
|--------------------------------------------------------------------------
*/

export function useBooking() {
  const [step, setStep] =
    useState<BookingStep>(1);

  const [draft, setDraft] =
    useState<BookingDraft>({ ...emptyDraft });

  const [specialty, setSpecialty] =
    useState<string>('All');

  const [allDoctors, setAllDoctors] =
    useState<BookingDoctor[]>([]);

  const [slots, setSlots] =
    useState<TimeSlot[]>([]);

  const [loadingDoctors, setLoadingDoctors] =
    useState(true);

  const [loadingSlots, setLoadingSlots] =
    useState(false);

  const [doctorsError, setDoctorsError] =
    useState<string | null>(null);

  const [slotsError, setSlotsError] =
    useState<string | null>(null);

  const [doctorsRefreshKey, setDoctorsRefreshKey] =
    useState(0);

  const [slotsRefreshKey, setSlotsRefreshKey] =
    useState(0);

  /*
  |--------------------------------------------------------------------------
  | Appointment Submission State
  |--------------------------------------------------------------------------
  */

  const [submitting, setSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState<string | null>(null);

  const [
    bookingConfirmation,
    setBookingConfirmation,
  ] = useState<BookingConfirmation | null>(null);

  const submittingRef = useRef(false);

  /*
  |--------------------------------------------------------------------------
  | Fetch Active Doctors
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let active = true;

    async function loadDoctors() {
      setLoadingDoctors(true);
      setDoctorsError(null);

      try {
        const data = await fetchBookingDoctors();

        if (!active) return;

        const normalizedDoctors: BookingDoctor[] =
          data.map(doctor => ({
            ...doctor,
            specialty:
              doctor.specialty || 'Not specified',
          }));

        setAllDoctors(normalizedDoctors);
      } catch (error) {
        if (!active) return;

        console.error(
          'Doctor loading failed:',
          error
        );

        setAllDoctors([]);

        setDoctorsError(
          'Unable to load doctors. Check your connection and try again.'
        );
      } finally {
        if (active) {
          setLoadingDoctors(false);
        }
      }
    }

    loadDoctors();

    return () => {
      active = false;
    };
  }, [doctorsRefreshKey]);

  /*
  |--------------------------------------------------------------------------
  | Fetch Available Appointment Slots
  |--------------------------------------------------------------------------
  */

  const doctorId = draft.doctor?.id;
  const selectedDate = draft.date;

  useEffect(() => {
    let active = true;

    if (!doctorId || !selectedDate) {
      setSlots([]);
      setSlotsError(null);
      setLoadingSlots(false);

      return () => {
        active = false;
      };
    }

    async function loadSlots() {
      setLoadingSlots(true);
      setSlots([]);
      setSlotsError(null);

      try {
        const data = await fetchAvailableTimeSlots(
          doctorId!,
          selectedDate
        );

        if (active) {
          setSlots(data);
        }
      } catch (error) {
        if (!active) return;

        console.error(
          'Slot loading failed:',
          error
        );

        setSlots([]);

        setSlotsError(
          'Unable to load appointment times. Please try again.'
        );
      } finally {
        if (active) {
          setLoadingSlots(false);
        }
      }
    }

    loadSlots();

    return () => {
      active = false;
    };
  }, [
    doctorId,
    selectedDate,
    slotsRefreshKey,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Specialty Filtering
  |--------------------------------------------------------------------------
  */

  const doctors = useMemo(() => {
    if (specialty === 'All') {
      return allDoctors;
    }

    return allDoctors.filter(
      doctor => doctor.specialty === specialty
    );
  }, [allDoctors, specialty]);

  const specialties = useMemo<string[]>(() => {
    const known = allDoctors
      .map(doctor => doctor.specialty)
      .filter(
        (value): value is string =>
          typeof value === 'string' &&
          value.length > 0 &&
          value !== 'Not specified'
      );

    return ['All', ...new Set(known)];
  }, [allDoctors]);

  /*
  |--------------------------------------------------------------------------
  | Doctor Selection
  |--------------------------------------------------------------------------
  */

  const clearDoctor = useCallback(() => {
    setDraft(current => ({
      ...current,
      doctor: null,
      date: '',
      time: '',
    }));

    setSlots([]);
    setSubmitError(null);
  }, []);

  const selectDoctor = useCallback(
    (doctor: BookingDoctor) => {
      setDraft(current => ({
        ...current,
        doctor,
        date: '',
        time: '',
      }));

      setSlots([]);
      setSubmitError(null);
    },
    []
  );

  /*
  |--------------------------------------------------------------------------
  | Date Selection
  |--------------------------------------------------------------------------
  */

  const selectDate = useCallback(
    (date: string) => {
      setDraft(current => ({
        ...current,
        date,
        time: '',
      }));

      setSlots([]);
      setSubmitError(null);
    },
    []
  );

  /*
  |--------------------------------------------------------------------------
  | Time Selection
  |--------------------------------------------------------------------------
  */

  const selectTime = useCallback(
    (time: string) => {
      const selectedSlot = slots.find(
        slot => slot.time === time
      );

      if (!selectedSlot?.available) {
        return;
      }

      setDraft(current => ({
        ...current,
        time,
      }));

      setSubmitError(null);
    },
    [slots]
  );

  /*
  |--------------------------------------------------------------------------
  | Reason for Visit
  |--------------------------------------------------------------------------
  */

  const setReason = useCallback(
    (reason: string) => {
      setDraft(current => ({
        ...current,
        reason,
      }));

      setSubmitError(null);
    },
    []
  );

  /*
  |--------------------------------------------------------------------------
  | Booking Validation
  |--------------------------------------------------------------------------
  */

  const selectedSlotAvailable = slots.some(
    slot =>
      slot.time === draft.time &&
      slot.available
  );

  const canReview =
    isValidBooking(draft) &&
    selectedSlotAvailable &&
    !loadingSlots &&
    !slotsError;

  /*
  |--------------------------------------------------------------------------
  | Submit Appointment to Laravel
  |--------------------------------------------------------------------------
  */

  const submitBooking = useCallback(
    async (): Promise<BookingConfirmation | null> => {

      // Prevent rapid duplicate submissions.
      if (submittingRef.current) {
        return null;
      }

      if (
        !draft.doctor ||
        !isValidBooking(draft) ||
        !selectedSlotAvailable ||
        loadingSlots ||
        slotsError
      ) {
        setSubmitError(
          'Please complete the booking details and select an available appointment time.'
        );

        return null;
      }

      submittingRef.current = true;

      setSubmitting(true);
      setSubmitError(null);

      try {
        const confirmation =
          await submitPatientBooking({
            doctor_id: draft.doctor.id,
            appointment_date: draft.date,
            appointment_time: draft.time,
            reason_for_visit: draft.reason.trim(),
          });

        /*
         * Save the real appointment confirmation
         * returned from Laravel.
         */
        setBookingConfirmation(confirmation);

        /*
         * Only proceed to Step 4 after the API
         * confirms successful appointment creation.
         */
        setStep(4);

        return confirmation;

      } catch (error) {
        console.error(
          'Booking submission failed:',
          error
        );

        setSubmitError(
          getSubmissionError(error)
        );

        return null;

      } finally {
        submittingRef.current = false;
        setSubmitting(false);
      }

    },
    [
      draft,
      selectedSlotAvailable,
      loadingSlots,
      slotsError,
    ]
  );

  /*
  |--------------------------------------------------------------------------
  | Navigation
  |--------------------------------------------------------------------------
  */

  const next = useCallback(() => {
    setStep(current => {
      // Step 4 is reserved for confirmed bookings.
      if (current >= 3) {
        return current;
      }

      return (current + 1) as BookingStep;
    });
  }, []);

  const back = useCallback(() => {
    if (submittingRef.current) {
      return;
    }

    setStep(current =>
      Math.max(current - 1, 1) as BookingStep
    );
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Reset Booking
  |--------------------------------------------------------------------------
  */

  const reset = useCallback(() => {
    if (submittingRef.current) {
      return;
    }

    setDraft({ ...emptyDraft });

    setSpecialty('All');

    setSlots([]);

    setBookingConfirmation(null);

    setSubmitError(null);

    setStep(1);
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Retry Functions
  |--------------------------------------------------------------------------
  */

  const retryDoctors = useCallback(() => {
    setDoctorsRefreshKey(
      current => current + 1
    );
  }, []);

  const retrySlots = useCallback(() => {
    setSlotsRefreshKey(
      current => current + 1
    );
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Return Booking State and Actions
  |--------------------------------------------------------------------------
  */

  return {
    step,
    draft,

    specialty,
    specialties,
    doctors,
    slots,

    loadingDoctors,
    loadingSlots,

    doctorsError,
    slotsError,

    submitting,
    submitError,

    bookingConfirmation,

    canReview,

    selectDoctor,
    clearDoctor,
    selectDate,
    selectTime,
    setReason,
    setSpecialty,

    submitBooking,

    next,
    back,
    reset,

    retryDoctors,
    retrySlots,
  };
}
