import axios from 'axios';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  getPatientProfile,
  updatePatientProfile,
} from '../services/profileService';
import type {
  PatientProfile,
  ProfileFieldErrors,
  ProfileSaveResult,
  UpdatePatientProfileData,
} from '../types/profile.types';

type ApiErrorPayload = {
  message?: unknown;
  errors?: unknown;
};

function getValidationErrors(
  value: unknown
): ProfileFieldErrors | undefined {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const source = value as Record<string, unknown>;
  const fields: (keyof ProfileFieldErrors)[] = [
    'first_name',
    'middle_name',
    'last_name',
    'birth_date',
    'sex',
    'phone_number',
    'email',
    'address',
    'city',
    'province',
    'blood_type',
    'emergency_contact_name',
    'emergency_contact_number',
  ];
  const errors: ProfileFieldErrors = {};

  for (const field of fields) {
    const messages = source[field];

    if (typeof messages === 'string') {
      errors[field] = messages;
    } else if (
      Array.isArray(messages) &&
      typeof messages[0] === 'string'
    ) {
      errors[field] = messages[0];
    }
  }

  return Object.keys(errors).length > 0
    ? errors
    : undefined;
}

function getApiErrorMessage(
  payload: unknown,
  fallback: string
) {
  if (
    payload &&
    typeof payload === 'object' &&
    'message' in payload &&
    typeof (payload as ApiErrorPayload).message === 'string'
  ) {
    return (payload as ApiErrorPayload).message as string;
  }

  return fallback;
}

export default function usePatient() {
  const [patient, setPatient] =
    useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const savingRef = useRef(false);

  const loadPatient = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const profile = await getPatientProfile();
      setPatient(profile);
    } catch (err) {
      setPatient(null);

      if (axios.isAxiosError(err)) {
        setError(
          getApiErrorMessage(
            err.response?.data,
            'Unable to load your patient profile.'
          )
        );
      } else {
        setError(
          'Something went wrong while loading your profile.'
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const savePatient = useCallback(
    async (
      data: UpdatePatientProfileData
    ): Promise<ProfileSaveResult> => {
      if (savingRef.current) {
        return {
          success: false,
          message: 'A profile update is already in progress.',
        };
      }

      savingRef.current = true;

      try {
        setSaving(true);
        setError(null);

        const response = await updatePatientProfile(data);
        setPatient(response.patient);

        return {
          success: true,
          message: response.message,
        };
      } catch (err) {
        let message = 'Unable to update your profile.';
        let fieldErrors: ProfileFieldErrors | undefined;

        if (axios.isAxiosError(err)) {
          message = getApiErrorMessage(
            err.response?.data,
            message
          );

          const payload = err.response?.data as
            | ApiErrorPayload
            | undefined;
          fieldErrors = getValidationErrors(payload?.errors);
        }

        setError(message);

        return {
          success: false,
          message,
          fieldErrors,
        };
      } finally {
        savingRef.current = false;
        setSaving(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadPatient();
  }, [loadPatient]);

  return {
    patient,
    loading,
    saving,
    error,
    refreshPatient: loadPatient,
    savePatient,
  };
}
