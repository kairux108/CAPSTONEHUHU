
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import useQueue from "./useQueue";

/*
|--------------------------------------------------------------------------
| Queue Action Configuration
|--------------------------------------------------------------------------
*/

const QUEUE_ACTIONS = {
  call: {
    from: "waiting",
    to: "called",
    confirm: "Call this patient now?",
    invalid: "Only waiting patients can be called.",
    error: "Unable to call patient.",
  },

  start: {
    from: "called",
    to: "in_consultation",
    confirm: "Start consultation for this patient?",
    invalid: "Only called patients can begin consultation.",
    error: "Unable to start consultation.",
  },

  complete: {
    from: "in_consultation",
    to: "completed",
    confirm:
      "Mark this patient's queue service as completed?",
    invalid:
      "Only patients in consultation can be marked completed.",
    error: "Unable to complete the queue entry.",
  },
};

/*
|--------------------------------------------------------------------------
| Staff Queue Controller
|--------------------------------------------------------------------------
*/

const useStaffQueueController = () => {
  /*
  |--------------------------------------------------------------------------
  | Existing Queue Hook
  |--------------------------------------------------------------------------
  */

  const {
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
    updateQueueEntry,
  } = useQueue();

  /*
  |--------------------------------------------------------------------------
  | Filter State
  |--------------------------------------------------------------------------
  */

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  /*
  |--------------------------------------------------------------------------
  | Build Queue Filters
  |--------------------------------------------------------------------------
  */

  const queueFilters = useMemo(
    () => ({
      search: search.trim(),

      status:
        statusFilter === "all"
          ? ""
          : statusFilter,

      appointment_type:
        activeTab === "all"
          ? ""
          : activeTab,

      page,
      per_page: perPage,
    }),
    [
      search,
      statusFilter,
      activeTab,
      page,
      perPage,
    ]
  );

  /*
  |--------------------------------------------------------------------------
  | Load Queue From Laravel
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const timer = setTimeout(() => {
      loadQueue(queueFilters).catch(() => {
        // The existing useQueue hook handles errors.
      });
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [loadQueue, queueFilters]);

  /*
  |--------------------------------------------------------------------------
  | Reset Pagination When Filters Change
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setPage(1);
  }, [
    search,
    statusFilter,
    activeTab,
    perPage,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Synchronize Selected Patient
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!selectedQueueEntry) {
      return;
    }

    const updatedEntry = queueEntries.find(
      (entry) =>
        Number(entry.id) ===
        Number(selectedQueueEntry.id)
    );

    if (updatedEntry) {
      if (updatedEntry !== selectedQueueEntry) {
        setSelectedQueueEntry(updatedEntry);
      }
    } else if (!loading) {
      setSelectedQueueEntry(null);
    }
  }, [
    queueEntries,
    selectedQueueEntry,
    setSelectedQueueEntry,
    loading,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Pagination Actions
  |--------------------------------------------------------------------------
  */

  const handlePageChange = (newPage) => {
    const lastPage = pagination?.last_page || 1;

    if (newPage < 1 || newPage > lastPage) {
      return;
    }

    setPage(newPage);
  };

  const handlePerPageChange = (value) => {
    setPerPage(value);
    setPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | Refresh Queue After Status Update
  |--------------------------------------------------------------------------
  */

  const refreshQueue = useCallback(async () => {
    try {
      await loadQueue(queueFilters);
    } catch (error) {
      console.error(
        "Queue updated, but refresh failed:",
        error
      );
    }
  }, [loadQueue, queueFilters]);

  /*
  |--------------------------------------------------------------------------
  | Shared Queue Status Handler
  |--------------------------------------------------------------------------
  */

  const handleQueueAction = useCallback(
    async (entry, actionType) => {
      if (saving) {
        return false;
      }

      const action = QUEUE_ACTIONS[actionType];

      if (!action) {
        return false;
      }

      /*
       * Validate the current queue status.
       */
      if (
        !entry ||
        entry.status !== action.from
      ) {
        window.alert(action.invalid);
        return false;
      }

      /*
       * Confirm action with staff.
       */
      const confirmed = window.confirm(
        action.confirm
      );

      if (!confirmed) {
        return false;
      }

      /*
       * Update Laravel and PostgreSQL.
       */
      try {
        await updateQueueEntry(entry.id, {
          status: action.to,
        });
      } catch (error) {
        console.error(
          `Queue action failed: ${actionType}`,
          error
        );

        window.alert(
          error.message || action.error
        );

        return false;
      }

      /*
       * Reload updated queue and statistics.
       */
      await refreshQueue();

      return true;
    },
    [
      saving,
      updateQueueEntry,
      refreshQueue,
    ]
  );

  /*
  |--------------------------------------------------------------------------
  | Call Patient
  |--------------------------------------------------------------------------
  */

  const handleCallPatient = useCallback(
    (entry) => handleQueueAction(entry, "call"),
    [handleQueueAction]
  );

  /*
  |--------------------------------------------------------------------------
  | Start Consultation
  |--------------------------------------------------------------------------
  */

  const handleStartConsultation = useCallback(
    (entry) => handleQueueAction(entry, "start"),
    [handleQueueAction]
  );

  /*
  |--------------------------------------------------------------------------
  | Complete Consultation
  |--------------------------------------------------------------------------
  */

  const handleCompleteConsultation = useCallback(
    (entry) => handleQueueAction(entry, "complete"),
    [handleQueueAction]
  );

  /*
  |--------------------------------------------------------------------------
  | Expose Data and Actions to Queue Page
  |--------------------------------------------------------------------------
  */

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

    search,
    setSearch,
    activeTab,
    setActiveTab,
    statusFilter,
    setStatusFilter,

    perPage,

    handlePageChange,
    handlePerPageChange,

    handleCallPatient,
    handleStartConsultation,
    handleCompleteConsultation,
  };
};

export default useStaffQueueController;
