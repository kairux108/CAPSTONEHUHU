import { useCallback, useState } from "react";
import queueService from "../services/queueService";

const useQueue = () => {
  const [queueEntries, setQueueEntries] = useState([]);
  const [selectedQueueEntry, setSelectedQueueEntry] = useState(null);
  const [nextRecommended, setNextRecommended] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    waiting: 0,
    called: 0,
    in_consultation: 0,
    completed: 0,
    emergency: 0,
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });

  const loadQueue = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError("");

      const data = await queueService.getAll(params);

      setQueueEntries(data.queue_entries || []);
      setNextRecommended(data.next_recommended || null);

      setStats(
        data.stats || {
          total: 0,
          waiting: 0,
          called: 0,
          in_consultation: 0,
          completed: 0,
          emergency: 0,
        }
      );

      setPagination(
        data.pagination || {
          current_page: 1,
          last_page: 1,
          per_page: 20,
          total: 0,
        }
      );

      return data;
    } catch (error) {
      console.error("Failed to load queue:", error);

      setError(
        error.message ||
          "Unable to load queue."
      );

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadQueueEntry = useCallback(async (id) => {
    try {
      setLoading(true);
      setError("");

      const data =
        await queueService.getById(id);

      const queueEntry =
        data.queue_entry || data;

      setSelectedQueueEntry(queueEntry);

      return queueEntry;
    } catch (error) {
      console.error(
        "Failed to load queue entry:",
        error
      );

      setError(
        error.message ||
          "Unable to load queue entry."
      );

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createQueueEntry = async (formData) => {
    try {
      setSaving(true);
      setError("");

      const data =
        await queueService.create(
          formData
        );

      const queueEntry =
        data.queue_entry || data;

      setSelectedQueueEntry(queueEntry);

      setQueueEntries((current) => [
        queueEntry,
        ...current.filter(
          (item) =>
            item.id !== queueEntry.id
        ),
      ]);

      return queueEntry;
    } catch (error) {
      console.error(
        "Failed to add patient to queue:",
        error
      );

      setError(
        error.message ||
          "Unable to add patient to queue."
      );

      throw error;
    } finally {
      setSaving(false);
    }
  };

  const updateQueueEntry = async (
    id,
    formData
  ) => {
    try {
      setSaving(true);
      setError("");

      const data =
        await queueService.update(
          id,
          formData
        );

      const queueEntry =
        data.queue_entry || data;

      setSelectedQueueEntry(queueEntry);

      setQueueEntries((current) =>
        current.map((item) =>
          item.id === queueEntry.id
            ? queueEntry
            : item
        )
      );

      return queueEntry;
    } catch (error) {
      console.error(
        "Failed to update queue entry:",
        error
      );

      setError(
        error.message ||
          "Unable to update queue entry."
      );

      throw error;
    } finally {
      setSaving(false);
    }
  };

  const clearError = () => {
    setError("");
  };

  return {
    queueEntries,

    selectedQueueEntry,
    setSelectedQueueEntry,

    nextRecommended,

    loading,
    saving,
    error,

    stats,
    pagination,

    loadQueue,
    loadQueueEntry,
    createQueueEntry,
    updateQueueEntry,
    clearError,
  };
};

export default useQueue;