import { useCallback, useEffect, useState } from 'react';

import {
  getPatientMedications,
  type PatientMedication,
} from '../services/medicationService';

/*
|--------------------------------------------------------------------------
| CURA - Patient Medications Hook
|--------------------------------------------------------------------------
|
| Handles:
| - Loading patient medications
| - API errors
| - Manual refreshing
| - Ignoring outdated requests
|
*/

export default function useMedications() {
  const [medications, setMedications] = useState<
    PatientMedication[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null
  );

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    const loadMedications = async () => {
      setLoading(true);
      setError(null);
      setMedications([]);

      try {
        const data = await getPatientMedications();

        if (!active) return;

        setMedications(data);
      } catch {
        if (!active) return;

        setError(
          'Unable to load medications. Please try again.'
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadMedications();

    // Prevent outdated requests from updating state.
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const refreshMedications = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  return {
    medications,
    loading,
    error,
    refreshMedications,
  };
}
