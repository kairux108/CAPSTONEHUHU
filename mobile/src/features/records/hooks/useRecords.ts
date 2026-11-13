
import { useEffect, useState } from 'react';

import {
  getPatientMedicalRecords,
  type PatientMedicalRecord,
} from '../services/recordsService';

/*
|--------------------------------------------------------------------------
| CURA - Patient Medical Records Hook
|--------------------------------------------------------------------------
|
| Handles:
| - Loading medical records
| - Error handling
| - Pagination
| - Refreshing records
|
| The backend identifies the patient from
| the authenticated account.
|
*/

export default function useRecords() {
  const [records, setRecords] = useState<PatientMedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    const loadRecords = async () => {
      setLoading(true);
      setError(null);
      setRecords([]);

      try {
        const data = await getPatientMedicalRecords(page);

        if (!active) return;

        setRecords(data.records.data);
        setTotalPages(data.records.last_page);
        setTotal(data.records.total);
      } catch (err) {
        if (!active) return;

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load medical records.'
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadRecords();

    // Ignore responses from an outdated request.
    return () => {
      active = false;
    };
  }, [page, refreshKey]);

  const nextPage = () => {
    if (loading) return;

    setPage((current) =>
      Math.min(current + 1, totalPages)
    );
  };

  const previousPage = () => {
    if (loading) return;

    setPage((current) => Math.max(1, current - 1));
  };

  const refresh = () => {
    setRefreshKey((current) => current + 1);
  };

  return {
    records,
    loading,
    error,
    page,
    totalPages,
    total,
    nextPage,
    previousPage,
    refresh,
  };
}
