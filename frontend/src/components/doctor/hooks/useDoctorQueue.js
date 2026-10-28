
import { useEffect, useState } from "react";

import doctorQueueService from "../services/doctorQueueService";

/*
|--------------------------------------------------------------------------
| CURA - Doctor Queue Hook
|--------------------------------------------------------------------------
*/

const useDoctorQueue = () => {
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const loadQueue = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await doctorQueueService.getQueue({
          page,
          signal: controller.signal,
        });

        if (active) {
          setQueueData(response);
        }
      } catch (err) {
        if (active && !controller.signal.aborted) {
          setError(
            err.message || "Unable to load doctor queue."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadQueue();

    return () => {
      active = false;
      controller.abort();
    };
  }, [page, refreshKey]);

  const refreshQueue = () => {
    setRefreshKey((current) => current + 1);
  };

  return {
    queueData,
    loading,
    error,
    page,
    setPage,
    refreshQueue,
  };
};

export default useDoctorQueue;
