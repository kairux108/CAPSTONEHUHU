
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import doctorDashboardService from "../services/doctorDashboardService";

const useDoctorDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const fetchDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          await doctorDashboardService.getDashboard({
            signal: controller.signal,
          });

        if (!controller.signal.aborted) {
          setDashboard(response);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err?.message ||
              "Failed to load doctor dashboard."
          );

          setDashboard(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      controller.abort();
    };
  }, [refreshKey]);

  const refreshDashboard = useCallback(() => {
    setRefreshKey((previous) => previous + 1);
  }, []);

  return {
    dashboard,
    loading,
    error,
    refreshDashboard,
  };
};

export default useDoctorDashboard;
