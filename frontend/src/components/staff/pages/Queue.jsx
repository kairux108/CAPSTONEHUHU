
import useStaffQueueController from "../../../hooks/useStaffQueueController";

import StaffQueueStats from "../queue/StaffQueueStats";
import StaffQueueNextPatient from "../queue/StaffQueueNextPatient";
import StaffQueueControls from "../queue/StaffQueueControls";
import StaffQueueTable from "../queue/StaffQueueTable";
import StaffQueueDetails from "../queue/StaffQueueDetails";

/*
|--------------------------------------------------------------------------
| CURA - Staff Queue Page
|--------------------------------------------------------------------------
*/

const Queue = () => {
  /*
  |--------------------------------------------------------------------------
  | Staff Queue Controller
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
  } = useStaffQueueController();

  /*
  |--------------------------------------------------------------------------
  | Render Staff Queue
  |--------------------------------------------------------------------------
  */

  return (
    <div className="staff-queue-page">

      {/* QUEUE SUMMARY */}

      <StaffQueueStats
        stats={stats}
      />

      {/* NEXT RECOMMENDED PATIENT */}

      <StaffQueueNextPatient
        recommendation={nextRecommended}
      />

      {/* MAIN QUEUE AREA */}

      <div className="staff-queue-main-grid">

        {/* LEFT SIDE */}

        <div className="staff-queue-left">

          {/* SEARCH AND FILTERS */}

          <StaffQueueControls
            search={search}
            setSearch={setSearch}

            activeTab={activeTab}
            setActiveTab={setActiveTab}

            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          {/* QUEUE TABLE */}

          <StaffQueueTable
            entries={queueEntries}

            selectedEntry={selectedQueueEntry}
            setSelectedEntry={
              setSelectedQueueEntry
            }

            loading={loading}
            error={error}

            pagination={pagination}
            onPageChange={
              handlePageChange
            }

            perPage={perPage}
            setPerPage={
              handlePerPageChange
            }

            saving={saving}

            onCallPatient={
              handleCallPatient
            }

            onStartConsultation={
              handleStartConsultation
            }

            onCompleteConsultation={
              handleCompleteConsultation
            }
          />

        </div>

        {/* RIGHT SIDE */}

        <StaffQueueDetails
          entry={selectedQueueEntry}
        />

      </div>
    </div>
  );
};

export default Queue;
