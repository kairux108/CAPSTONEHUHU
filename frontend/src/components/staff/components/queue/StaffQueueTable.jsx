
import { useState } from "react";
import { ClipboardList, MoreVertical } from "lucide-react";

import CuraCard from "../../../common/CuraCard";
import StaffQueuePagination from "./StaffQueuePagination";
import StaffQueueActionsModal from "./StaffQueueActionsModal";

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
} from "../../utils/queueUtils";

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
  onCallPatient,
  onStartConsultation,
  onCompleteConsultation,
  saving = false,
}) => {
  /*
  |--------------------------------------------------------------------------
  | Local State
  |--------------------------------------------------------------------------
  */

  const [actionEntry, setActionEntry] = useState(null);

  const total = pagination?.total ?? entries.length;

  /*
  |--------------------------------------------------------------------------
  | Open Queue Actions
  |--------------------------------------------------------------------------
  */

  const openActions = (entry) => {
    if (saving) return;

    setSelectedEntry?.(entry);
    setActionEntry(entry);
  };

  /*
  |--------------------------------------------------------------------------
  | Render Queue Table
  |--------------------------------------------------------------------------
  */

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
      {/* QUEUE TABLE */}

      <div className="staff-queue-table-wrapper">

        {loading ? (
          <div className="staff-queue-empty">
            <ClipboardList size={36} />

            <p>Loading queue...</p>

            <span>
              Please wait while CURA retrieves
              today's queue.
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
              Today's queue will appear here once
              patients are added.
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
                  {/* QUEUE NUMBER */}

                  <td>
                    <span className="staff-queue-number">
                      {formatQueueNumber(
                        entry.queue_number
                      )}
                    </span>
                  </td>

                  {/* PATIENT */}

                  <td>
                    <div className="staff-queue-patient">

                      <div className="staff-queue-avatar">
                        {getQueuePatientInitials(entry)}
                      </div>

                      <div>
                        <strong>
                          {getQueuePatientName(entry)}
                        </strong>

                        <span>
                          {getQueuePatientNumber(entry)}
                        </span>
                      </div>

                    </div>
                  </td>

                  {/* APPOINTMENT TYPE */}

                  <td>
                    <span
                      className={`staff-queue-type ${getQueueTypeClass(
                        entry
                      )}`}
                    >
                      {getQueueTypeLabel(entry)}
                    </span>
                  </td>

                  {/* TIME IN */}

                  <td>
                    {formatQueueTime(entry.queued_at)}
                  </td>

                  {/* STATUS */}

                  <td>
                    <span
                      className={`staff-queue-status ${getQueueStatusClass(
                        entry.status
                      )}`}
                    >
                      {formatQueueLabel(entry.status)}
                    </span>
                  </td>

                  {/* DOCTOR */}

                  <td>
                    {getQueueDoctorName(entry)}
                  </td>

                  {/* ESTIMATED WAIT */}

                  <td>
                    {formatQueueEta(
                      entry.estimated_wait_minutes
                    )}
                  </td>

                  {/* ACTIONS */}

                  <td>
                    <button
                      type="button"
                      className="staff-queue-more"
                      title="Queue Actions"
                      aria-label={`Open actions for ${getQueuePatientName(
                        entry
                      )}`}
                      disabled={saving}
                      onClick={(event) => {
                        event.stopPropagation();
                        openActions(entry);
                      }}
                    >
                      <MoreVertical size={16} />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

      {/* PAGINATION COMPONENT */}

      <StaffQueuePagination
        count={entries.length}
        pagination={pagination}
        onPageChange={onPageChange}
        perPage={perPage}
        setPerPage={setPerPage}
        loading={loading}
      />

      {/* QUEUE ACTIONS MODAL */}

      <StaffQueueActionsModal
        entry={actionEntry}
        saving={saving}
        onCallPatient={onCallPatient}
        onStartConsultation={onStartConsultation}
        onCompleteConsultation={onCompleteConsultation}
        onClose={() => setActionEntry(null)}
      />

    </CuraCard>
  );
};

export default StaffQueueTable;
