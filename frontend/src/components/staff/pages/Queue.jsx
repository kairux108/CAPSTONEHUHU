import {
  useEffect,
  useMemo,
  useState,
} from "react";

import useQueue from "../../../hooks/useQueue";

import StaffQueueStats from "../queue/StaffQueueStats";
import StaffQueueControls from "../queue/StaffQueueControls";
import StaffQueueTable from "../queue/StaffQueueTable";
import StaffQueueDetails from "../queue/StaffQueueDetails";

import {
  normalizeQueueValue,
} from "../../../utils/queueUtils";

const Queue = () => {
  /*
  |--------------------------------------------------------------------------
  | Queue Hook
  |--------------------------------------------------------------------------
  */

  const {
    queueEntries,
    selectedQueueEntry,
    setSelectedQueueEntry,

    loading,
    error,

    stats,
    pagination,

    loadQueue,
  } = useQueue();

  /*
  |--------------------------------------------------------------------------
  | Filters
  |--------------------------------------------------------------------------
  */

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  /*
  |--------------------------------------------------------------------------
  | Load Queue From Backend
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const timer = setTimeout(() => {
      loadQueue({
        search,
        status:
          statusFilter === "all"
            ? ""
            : statusFilter,
        page,
        per_page: perPage,
      }).catch(() => {
        // Error is already handled by useQueue.
      });
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [
    search,
    statusFilter,
    page,
    perPage,
    loadQueue,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Reset Page When Filters Change
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
  | Walk-in / Scheduled Filter
  |--------------------------------------------------------------------------
  |
  | Search and status are handled by Laravel.
  | Appointment type is filtered here for now.
  |
  */

  const filteredQueue = useMemo(() => {
    if (activeTab === "all") {
      return queueEntries;
    }

    return queueEntries.filter((entry) => {
      const appointmentType =
        normalizeQueueValue(
          entry.appointment?.appointment_type
        );

      return appointmentType === activeTab;
    });
  }, [
    queueEntries,
    activeTab,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Keep Selected Entry Updated
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!selectedQueueEntry) {
      return;
    }

    const updatedEntry =
      queueEntries.find(
        (entry) =>
          Number(entry.id) ===
          Number(selectedQueueEntry.id)
      );

    if (updatedEntry) {
      setSelectedQueueEntry(
        updatedEntry
      );
    } else {
      setSelectedQueueEntry(null);
    }
  }, [
    queueEntries,
    selectedQueueEntry?.id,
    setSelectedQueueEntry,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Change Page
  |--------------------------------------------------------------------------
  */

  const handlePageChange = (
    newPage
  ) => {
    if (
      newPage < 1 ||
      newPage >
        (pagination?.last_page || 1)
    ) {
      return;
    }

    setPage(newPage);
  };

  /*
  |--------------------------------------------------------------------------
  | Change Per Page
  |--------------------------------------------------------------------------
  */

  const handlePerPageChange = (
    value
  ) => {
    setPerPage(value);
    setPage(1);
  };

  return (
    <div className="staff-queue-page">

      {/* QUEUE SUMMARY */}

      <StaffQueueStats
        stats={stats}
      />

      {/* MAIN QUEUE AREA */}

      <div className="staff-queue-main-grid">

        {/* LEFT SIDE */}

        <div className="staff-queue-left">

          <StaffQueueControls
            search={search}
            setSearch={setSearch}

            activeTab={activeTab}
            setActiveTab={
              setActiveTab
            }

            statusFilter={
              statusFilter
            }
            setStatusFilter={
              setStatusFilter
            }
          />

          <StaffQueueTable
            entries={filteredQueue}

            selectedEntry={
              selectedQueueEntry
            }
            setSelectedEntry={
              setSelectedQueueEntry
            }

            loading={loading}
            error={error}

            pagination={
              pagination
            }

            onPageChange={
              handlePageChange
            }

            perPage={perPage}
            setPerPage={
              handlePerPageChange
            }
          />
        </div>

        {/* RIGHT SIDE */}

        <StaffQueueDetails
          entry={
            selectedQueueEntry
          }
        />
      </div>
    </div>
  );
};

export default Queue;