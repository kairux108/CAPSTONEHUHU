import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  MoreVertical,
} from "lucide-react";

import CuraCard from "../../common/CuraCard";

import {
  formatQueueEta,
  formatQueueLabel,
  formatQueueNumber,
  formatQueueTime,
  getQueueDoctorName,
  getQueuePatientInitials,
  getQueuePatientName,
  getQueuePatientNumber,
  getQueueStatusClass,
  getQueueTypeClass,
  getQueueTypeLabel,
} from "../../../utils/queueUtils";

const StaffQueueTable = ({
  entries = [],
  selectedEntry,
  setSelectedEntry,

  loading,
  error,

  pagination,
  onPageChange,

  perPage = 20,
  setPerPage,
}) => {
  const currentPage =
    pagination?.current_page || 1;

  const lastPage =
    pagination?.last_page || 1;

  const total =
    pagination?.total ?? entries.length;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange?.(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < lastPage) {
      onPageChange?.(currentPage + 1);
    }
  };

  return (
    <CuraCard
      title={`Today's Queue (${total})`}
      action={
        <span className="staff-queue-live">
          <i />
          Live
        </span>
      }
      className="staff-queue-list-card"
    >
      <div className="staff-queue-table-wrapper">
        {loading ? (
          <div className="staff-queue-empty">
            <ClipboardList size={36} />

            <p>Loading queue...</p>

            <span>
              Please wait while CURA retrieves today's queue.
            </span>
          </div>
        ) : error ? (
          <div className="staff-queue-empty">
            <ClipboardList size={36} />

            <p>Unable to load queue</p>

            <span>{error}</span>
          </div>
        ) : entries.length === 0 ? (
          <div className="staff-queue-empty">
            <ClipboardList size={36} />

            <p>No patients in queue</p>

            <span>
              Today's queue will appear here once patients are added.
            </span>
          </div>
        ) : (
          <table className="staff-queue-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Type</th>
                <th>Time In</th>
                <th>Status</th>
                <th>Doctor</th>
                <th>ETA</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.id}
                  className={
                    selectedEntry?.id === entry.id
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setSelectedEntry?.(entry)
                  }
                >
                  <td>
                    <span className="staff-queue-number">
                      {formatQueueNumber(
                        entry.queue_number
                      )}
                    </span>
                  </td>

                  <td>
                    <div className="staff-queue-patient">
                      <div className="staff-queue-avatar">
                        {getQueuePatientInitials(
                          entry
                        )}
                      </div>

                      <div>
                        <strong>
                          {getQueuePatientName(
                            entry
                          )}
                        </strong>

                        <span>
                          {getQueuePatientNumber(
                            entry
                          )}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`staff-queue-type ${getQueueTypeClass(
                        entry
                      )}`}
                    >
                      {getQueueTypeLabel(
                        entry
                      )}
                    </span>
                  </td>

                  <td>
                    {formatQueueTime(
                      entry.queued_at
                    )}
                  </td>

                  <td>
                    <span
                      className={`staff-queue-status ${getQueueStatusClass(
                        entry.status
                      )}`}
                    >
                      {formatQueueLabel(
                        entry.status
                      )}
                    </span>
                  </td>

                  <td>
                    {getQueueDoctorName(
                      entry
                    )}
                  </td>

                  <td>
                    {formatQueueEta(
                      entry.estimated_wait_minutes
                    )}
                  </td>

                  <td>
                    <button
                      type="button"
                      className="staff-queue-more"
                      onClick={(event) => {
                        event.stopPropagation();

                        setSelectedEntry?.(
                          entry
                        );
                      }}
                    >
                      <MoreVertical
                        size={16}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="staff-queue-pagination">
        <span>
          Showing {entries.length} of{" "}
          {total} patients
        </span>

        <div>
          <button
            type="button"
            disabled={
              loading ||
              currentPage <= 1
            }
            onClick={handlePrevious}
          >
            <ChevronLeft size={15} />
          </button>

          <button
            type="button"
            className="active"
            disabled
          >
            {currentPage}
          </button>

          <button
            type="button"
            disabled={
              loading ||
              currentPage >= lastPage
            }
            onClick={handleNext}
          >
            <ChevronRight size={15} />
          </button>
        </div>

        <select
          value={perPage}
          disabled={loading}
          onChange={(event) =>
            setPerPage?.(
              Number(event.target.value)
            )
          }
        >
          <option value={10}>
            10 / page
          </option>

          <option value={20}>
            20 / page
          </option>

          <option value={50}>
            50 / page
          </option>
        </select>
      </div>
    </CuraCard>
  );
};

export default StaffQueueTable;