import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import {
  getPatientProfile,
  updatePatientProfile,
} from '../services/patientService';

import {
  PatientProfile,
  UpdatePatientProfileData,
} from '../types/patientProfile';

export default function usePatient() {
  const [patient, setPatient] =
    useState<PatientProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadPatient = useCallback(
    async () => {
      try {
        setLoading(true);
        setError(null);

        const profile =
          await getPatientProfile();

        setPatient(profile);
      } catch (err) {
        setPatient(null);

        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              'Unable to load your patient profile.'
          );
        } else {
          setError(
            'Something went wrong while loading your profile.'
          );
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const savePatient = async (
    data: UpdatePatientProfileData
  ) => {
    try {
      setSaving(true);
      setError(null);

      const response =
        await updatePatientProfile(data);

      setPatient(response.patient);

      return {
        success: true,
        message: response.message,
      };
    } catch (err) {
      let message =
        'Unable to update your profile.';

      if (axios.isAxiosError(err)) {
        message =
          err.response?.data?.message ||
          message;
      }

      setError(message);

      return {
        success: false,
        message,
      };
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadPatient();
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