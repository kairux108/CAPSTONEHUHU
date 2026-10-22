
import { useEffect } from "react";

import {
  CheckCircle2,
  PhoneCall,
  Stethoscope,
  X,
} from "lucide-react";

import {
  formatQueueLabel,
  formatQueueNumber,
  getQueuePatientName,
} from "../../../utils/queueUtils";

import "./StaffQueueActionsModal.css";

/*
|--------------------------------------------------------------------------
| Queue Status Messages
|--------------------------------------------------------------------------
*/

const getStatusMessage = (status) => {
  switch (status) {
    case "waiting":
      return "This patient is ready to be called.";

    case "called":
      return "This patient is ready for consultation.";

    case "in_consultation":
      return "Consultation in progress. Ready to complete.";

    case "completed":
      return "This queue entry has been completed.";

    default:
      return "No available action for this queue status.";
  }
};

/*
|--------------------------------------------------------------------------
| Queue Actions Modal
|--------------------------------------------------------------------------
*/

const StaffQueueActionsModal = ({
  entry,
  saving = false,
  onCallPatient,
  onStartConsultation,
  onCompleteConsultation,
  onClose,
}) => {
  /*
  |--------------------------------------------------------------------------
  | Close Modal With Escape
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!entry) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !saving) {
        onClose?.();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [entry, saving, onClose]);

  /*
  |--------------------------------------------------------------------------
  | Hide Modal When No Entry Selected
  |--------------------------------------------------------------------------
  */

  if (!entry) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | Queue Action Availability
  |--------------------------------------------------------------------------
  */

  const canCall =
    entry.status === "waiting" &&
    !saving &&
    Boolean(onCallPatient);

  const canStartConsultation =
    entry.status === "called" &&
    !saving &&
    Boolean(onStartConsultation);

  const canCompleteConsultation =
    entry.status === "in_consultation" &&
    !saving &&
    Boolean(onCompleteConsultation);

  /*
  |--------------------------------------------------------------------------
  | Execute Queue Action
  |--------------------------------------------------------------------------
  */

  const performAction = async (allowed, callback) => {
    if (!allowed || !callback) {
      return;
    }

    const success = await callback(entry);

    if (success) {
      onClose?.();
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Render Modal
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className="cura-queue-actions-overlay"
      role="presentation"
      onClick={() => {
        if (!saving) {
          onClose?.();
        }
      }}
    >
      <div
        className="cura-queue-actions-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cura-queue-actions-title"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* MODAL HEADER */}

        <div className="cura-queue-actions-header">

          <h3 id="cura-queue-actions-title">
            Queue Actions
          </h3>

          <button
            className="cura-queue-actions-dismiss"
            type="button"
            onClick={() => onClose?.()}
            disabled={saving}
            aria-label="Close queue actions"
          >
            <X size={20} />
          </button>

        </div>

        {/* PATIENT INFORMATION */}

        <div className="cura-queue-actions-patient">

          <strong>
            {getQueuePatientName(entry)}
          </strong>

          <span>
            {formatQueueNumber(
              entry.queue_number
            )}

            {" • "}

            {formatQueueLabel(
              entry.status
            )}
          </span>

        </div>

        {/* QUEUE ACTION BUTTONS */}

        <div className="cura-queue-actions-buttons">

          {/* CALL PATIENT */}

          <button
            className="cura-queue-actions-primary"
            type="button"
            disabled={!canCall}
            onClick={() =>
              performAction(
                canCall,
                onCallPatient
              )
            }
          >
            <PhoneCall size={17} />

            {saving && entry.status === "waiting"
              ? "Calling..."
              : "Call Patient"}
          </button>

          {/* START CONSULTATION */}

          <button
            className="cura-queue-actions-primary cura-queue-actions-start"
            type="button"
            disabled={!canStartConsultation}
            onClick={() =>
              performAction(
                canStartConsultation,
                onStartConsultation
              )
            }
          >
            <Stethoscope size={17} />

            {saving && entry.status === "called"
              ? "Starting..."
              : "Start Consultation"}
          </button>

          {/* COMPLETE CONSULTATION */}

          <button
            className="cura-queue-actions-primary"
            type="button"
            disabled={!canCompleteConsultation}
            onClick={() =>
              performAction(
                canCompleteConsultation,
                onCompleteConsultation
              )
            }
          >
            <CheckCircle2 size={17} />

            {saving &&
            entry.status === "in_consultation"
              ? "Completing..."
              : "Complete Consultation"}
          </button>

        </div>

        {/* STATUS MESSAGE */}

        <p className="cura-queue-actions-message">
          {getStatusMessage(entry.status)}
        </p>

        {/* CLOSE MODAL */}

        <button
          className="cura-queue-actions-close"
          type="button"
          disabled={saving}
          onClick={() => onClose?.()}
        >
          Close
        </button>

      </div>
    </div>
  );
};

export default StaffQueueActionsModal;
