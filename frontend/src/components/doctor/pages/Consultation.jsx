import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  AlertCircle,
  ArrowLeft,
  ClipboardList,
  LoaderCircle,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| Shared Components and Services
|--------------------------------------------------------------------------
*/

import CuraCard from "../../common/CuraCard";
import api from "../../../shared/services/api";
import {
  getDoctorConsultation,
  saveDoctorConsultationDraft,
  startDoctorConsultation,
  completeDoctorConsultation,
} from "../services/doctorConsultationService";

/*
|--------------------------------------------------------------------------
| Doctor Consultation Components
|--------------------------------------------------------------------------
*/

import PatientConsultationHeader from "../components/consultation/PatientConsultationHeader";
import DoctorAISymptomPanel from "../components/consultation/DoctorAISymptomPanel";
import DoctorDiagnosisForm from "../components/consultation/DoctorDiagnosisForm";
import DoctorConsultationNotes from "../components/consultation/DoctorConsultationNotes";
import DoctorCarePlan from "../components/consultation/DoctorCarePlan";
import DoctorPrescriptionForm from "../components/consultation/DoctorPrescriptionForm";
import DoctorPrescriptionIssuance from "../components/consultation/DoctorPrescriptionIssuance";
import DoctorLabRequestForm from "../components/consultation/DoctorLabRequestForm";


/*
|--------------------------------------------------------------------------
| Consultation Draft Workspace
|--------------------------------------------------------------------------
|
| This component is mounted for one selected queue entry.
| Its local drafts are reset when the selected patient changes.
|
*/

const ConsultationWorkspace = ({ context, queueEntryId }) => {
  const patient = context.patient;
  const appointment = context.appointment;
  const queueEntry = context.queue_entry;

  // Keep the queue badge in sync with successful backend transitions.
  // The workspace is remounted when the selected queue entry changes.
  const [queueStatus, setQueueStatus] = useState(queueEntry.status);
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState("");
  const [startSuccess, setStartSuccess] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Diagnosis Draft
  |--------------------------------------------------------------------------
  */

  const [diagnosis, setDiagnosis] = useState({
    name: "",
    notes: "",
    reviewed: false,
  });

  /*
  |--------------------------------------------------------------------------
  | SOAP Notes
  |--------------------------------------------------------------------------
  */

  const [notes, setNotes] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });

  /*
  |--------------------------------------------------------------------------
  | Care Plan
  |--------------------------------------------------------------------------
  */

  const [carePlan, setCarePlan] = useState({
    instructions: "",
    followUp: "",
  });

  /*
  |--------------------------------------------------------------------------
  | Prescription Draft
  |--------------------------------------------------------------------------
  */

  const [prescriptionItems, setPrescriptionItems] =
    useState([]);

  // Load the draft only after the authorized queue context is available.
  // Do not show editable fields until the request finishes: otherwise an
  // in-flight response could overwrite changes typed into an empty form.
  const [draftLoadState, setDraftLoadState] = useState("loading");
  const [draftLoadError, setDraftLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [savedConsultation, setSavedConsultation] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [completionError, setCompletionError] = useState("");
  const [completionSuccess, setCompletionSuccess] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const loadSavedDraft = async () => {
      try {
        const response = await getDoctorConsultation(
          queueEntryId,
          controller.signal
        );

        if (!active) return;

        if (
          response?.queue_entry_id != null &&
          String(response.queue_entry_id) !== String(queueEntryId)
        ) {
          throw new Error("The server returned a different consultation.");
        }

        const saved = response?.consultation;
        setSavedConsultation(saved ?? null);
        if (!saved) {
          setDraftLoadState("empty");
          return;
        }

        setDiagnosis({
          name: saved.diagnosis?.name ?? "",
          notes: saved.diagnosis?.notes ?? "",
          reviewed: Boolean(saved.diagnosis?.reviewed),
        });
        setNotes({
          subjective: saved.subjective ?? "",
          objective: saved.objective ?? "",
          assessment: saved.assessment ?? "",
          plan: saved.plan ?? "",
        });
        setCarePlan({
          instructions: saved.care_instructions ?? "",
          followUp: saved.follow_up_instructions ?? "",
        });
        const savedItems = saved.prescription?.items;
        setPrescriptionItems(
          Array.isArray(savedItems)
            ? savedItems.map((item, index) => ({
                ...item,
                id: item.id ?? `loaded-${index}`,
                medicine: item.medicine ?? "",
                strength: item.strength ?? "",
                dosage: item.dosage ?? "",
                frequency: item.frequency ?? "",
                duration: item.duration ?? "",
                duration_days: item.duration_days ?? null,
                instructions: item.instructions ?? "",
              }))
            : []
        );
        setDraftLoadState("loaded");
      } catch (err) {
        if (!active || controller.signal.aborted) return;
        setDraftLoadError(err.message || "Unable to load saved consultation.");
        setDraftLoadState("error");
      }
    };

    loadSavedDraft();

    return () => {
      active = false;
      controller.abort();
    };
  }, [queueEntryId]);

  /*
  |--------------------------------------------------------------------------
  | AI Analysis
  |--------------------------------------------------------------------------
  |
  | AI integration will be implemented separately.
  | No fabricated predictions are displayed.
  |
  */

  const analysis = null;

  /*
  |--------------------------------------------------------------------------
  | Consultation Eligibility
  |--------------------------------------------------------------------------
  */

  const canDraft = [
    "called",
    "in_consultation",
  ].includes(queueStatus);

  const markUnsaved = () => {
    setCompletionError("");
    setHasUnsavedChanges(true);
    setSaveSuccess("");
    setSaveError("");
  };

  const updateDiagnosis = (value) => {
    setDiagnosis(value);
    markUnsaved();
  };

  const updateNotes = (value) => {
    setNotes(value);
    markUnsaved();
  };

  const updateCarePlan = (value) => {
    setCarePlan(value);
    markUnsaved();
  };

  const updatePrescriptionItems = (items) => {
    // The numeric duration and its description are managed by the form.
    setPrescriptionItems(items);
    markUnsaved();
  };

  const isCompleted = savedConsultation?.status === "completed";
  const canComplete =
    queueStatus === "in_consultation" &&
    draftLoadState === "loaded" &&
    savedConsultation?.status === "draft" &&
    !hasUnsavedChanges &&
    !saving &&
    !starting &&
    !completing;

  const handleStart = async () => {
    if (
      queueStatus !== "called" ||
      !["empty", "loaded"].includes(draftLoadState) ||
      isCompleted ||
      starting ||
      saving ||
      completing
    ) {
      return;
    }

    if (!window.confirm("Start consultation for this patient?")) return;

    setStarting(true);
    setStartError("");
    setStartSuccess("");

    try {
      const response = await startDoctorConsultation(queueEntryId);
      const updatedQueue = response?.queue_entry;

      if (
        String(updatedQueue?.id) !== String(queueEntryId) ||
        updatedQueue?.status !== "in_consultation"
      ) {
        throw new Error("The server did not confirm that the consultation started.");
      }

      setQueueStatus("in_consultation");
      setStartSuccess("Consultation started. The patient is now in consultation.");
    } catch (err) {
      setStartError(err.message || "Unable to start consultation. Refresh to check queue status before retrying.");
    } finally {
      setStarting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!canDraft || isCompleted || saving || starting || completing || !hasUnsavedChanges) return;

    setSaving(true);
    setSaveError("");
    setSaveSuccess("");

    // Only send fields accepted by Laravel; local UI item IDs are excluded.
    const payload = {
      subjective: notes.subjective,
      objective: notes.objective,
      assessment: notes.assessment,
      plan: notes.plan,
      care_instructions: carePlan.instructions,
      follow_up_instructions: carePlan.followUp,
      diagnosis: {
        name: diagnosis.name,
        notes: diagnosis.notes,
        reviewed: diagnosis.reviewed,
      },

      prescription_items: prescriptionItems.map((item) => ({
        // Existing prescription fields
        medicine: String(item.medicine ?? "").trim(),
        strength: item.strength || null,
        dosage: item.dosage || null,
        frequency: item.frequency || null,

        duration_days:
          item.duration_days == null ||
          item.duration_days === ""
            ? null
            : Number(item.duration_days),

        duration: item.duration || null,
        instructions: item.instructions || null,

        // Flexible medication scheduling
        schedule_type: item.schedule_type || null,

        // As-needed (PRN) medication
        as_needed: Boolean(item.as_needed),

        // Fixed administration times
        administration_times:
          item.schedule_type === "fixed"
            ? Array.isArray(item.administration_times)
              ? item.administration_times
              : []
            : null,

        // Recurring hourly interval
        interval_hours:
          item.schedule_type === "interval" &&
          item.interval_hours != null &&
          item.interval_hours !== ""
            ? Number(item.interval_hours)
            : null,

        // Interval context
        interval_scope:
          item.schedule_type === "interval"
            ? item.interval_scope || null
            : null,

        // Before, with, or after meals
        meal_relation: item.meal_relation || null,

        // Additional doctor-provided timing instructions
        timing_instructions:
          String(item.timing_instructions ?? "").trim() || null,
      })),

    };

    try {
      const response = await saveDoctorConsultationDraft(queueEntryId, payload);
      const saved = response?.consultation;

      if (
        saved?.status !== "draft" ||
        String(saved.queue_entry_id) !== String(queueEntryId)
      ) {
        throw new Error("The server did not confirm the expected consultation draft.");
      }

      setSavedConsultation(saved);
      setHasUnsavedChanges(false);
      setDraftLoadState("loaded");
      setSaveSuccess("Consultation draft saved successfully to CURA.");
    } catch (err) {
      const firstValidationError = err?.errors
        ? Object.values(err.errors).flat().find(Boolean)
        : null;

      setSaveError(
        firstValidationError || err.message || "Unable to save consultation draft."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async () => {
    if (!canComplete) return;

    const requiredSoap = ["subjective", "objective", "assessment", "plan"];
    if (requiredSoap.some((field) => !String(notes[field] ?? "").trim())) {
      setCompletionError("Fill in all four SOAP fields before completing the consultation.");
      return;
    }
    if (!diagnosis.name.trim() || !diagnosis.reviewed) {
      setCompletionError("Save a reviewed diagnosis before completing the consultation.");
      return;
    }

    // Completion is final for the normal draft workflow.
    const confirmed = window.confirm(
      "Complete this consultation?\n\n" +
      "You will not be able to edit it as a draft afterward. " +
      "This will also complete the patient’s queue entry. It does NOT issue a prescription."
    );
    if (!confirmed) return;

    setCompleting(true);
    setCompletionError("");
    setCompletionSuccess("");
    setSaveError("");
    try {
      const response = await completeDoctorConsultation(queueEntryId);
      const completed = response?.consultation;
      if (
        completed?.status !== "completed" ||
        String(completed.queue_entry_id) !== String(queueEntryId) ||
        !completed.completed_at ||
        String(response?.queue_entry?.id) !== String(queueEntryId) ||
        response?.queue_entry?.status !== "completed"
      ) {
        throw new Error("The server did not confirm consultation completion.");
      }

      setSavedConsultation(completed);
      setQueueStatus("completed");
      setHasUnsavedChanges(false);
      setSaveSuccess("");
      setStartSuccess("");
      setCompletionSuccess("Consultation and queue completed successfully. All fields are now read-only.");
    } catch (err) {
      const firstValidationError = err?.errors
        ? Object.values(err.errors).flat().find(Boolean)
        : null;
      setCompletionError(
        firstValidationError || err.message || "Unable to complete consultation."
      );
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="space-y-5">

      {/* SELECTED QUEUE INFORMATION */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#78908e]">
            Selected Queue Number
          </p>

          <p className="mt-1 text-lg font-black text-[#18a999]">
            {queueEntry.queue_number || "—"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[#dff3ee] px-4 py-2 text-xs font-bold capitalize text-[#117f76]">
            {String(queueStatus || "unknown").replaceAll("_", " ")}
          </span>

          {queueStatus === "called" && !isCompleted && (
            <button
              type="button"
              onClick={handleStart}
              disabled={starting || saving || completing || !["empty", "loaded"].includes(draftLoadState)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#18a999] px-5 py-3 text-sm font-bold text-white hover:bg-[#138f83] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {starting && <LoaderCircle size={16} className="animate-spin" />}
              {starting ? "Starting..." : "Start Consultation"}
            </button>
          )}
        </div>
      </div>

      {startError && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          Start consultation failed: {startError}
        </p>
      )}
      {startSuccess && (
        <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          {startSuccess}
        </p>
      )}

      {/* REAL PATIENT INFORMATION */}

      <CuraCard className="doctor-consultation-card">
        <PatientConsultationHeader
          patient={patient}
          appointment={appointment}
        />
      </CuraCard>

      {/* QUEUE STATUS NOTICE */}

      {!canDraft && (
        <CuraCard className="doctor-consultation-card">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={19}
              className="shrink-0 text-amber-600"
            />

            <div>
              <p className="text-sm font-bold text-[#38514f]">
                Consultation editing is unavailable
              </p>

              <p className="mt-2 text-sm text-[#78908e]">
                This patient's queue status is not
                currently Called or In Consultation.
                Saved consultation information may be viewed,
                but editing and completion are disabled.
              </p>
            </div>
          </div>
        </CuraCard>
      )}

      {draftLoadState === "loading" ? (
        <CuraCard className="doctor-consultation-card">
          <div role="status" className="flex items-center gap-3 py-6 text-sm text-[#607b79]">
            <LoaderCircle size={19} className="animate-spin text-[#18a999]" />
            Loading saved consultation draft...
          </div>
        </CuraCard>
      ) : draftLoadState === "error" ? (
        <CuraCard className="doctor-consultation-card">
          <div role="alert" className="flex items-start gap-3 py-4 text-sm text-red-700">
            <AlertCircle size={19} className="shrink-0" />
            <div>
              <p className="font-bold">Unable to load saved consultation.</p>
              <p className="mt-1">{draftLoadError}</p>
              <p className="mt-2">Reload this page to try again. Editing is paused to prevent losing a saved draft.</p>
            </div>
          </div>
        </CuraCard>
      ) : (
        <>

          {/* FRONTEND DRAFT NOTICE */}

          <div
            role="status"
            className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4"
          >
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-amber-600"
            />

            <p className="text-xs leading-5 text-amber-800">
              <strong>
                {isCompleted
                  ? "Completed consultation:"
                  : draftLoadState === "loaded"
                    ? "Saved draft loaded:"
                    : "No saved draft found:"}
              </strong>{" "}
              {isCompleted
                ? "This consultation is completed and its fields are read-only. The prescription remains separate."
                : draftLoadState === "loaded"
                  ? "Previously saved consultation information was loaded from CURA. Changes require Save Draft."
                  : "This consultation has not been saved yet. Changes require Save Draft."}
              {" "}Use synthetic test data only.
            </p>
          </div>

          {isCompleted && (
            <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
              Completed at: {savedConsultation.completed_at
                ? new Date(savedConsultation.completed_at).toLocaleString()
                : "Timestamp unavailable"}
            </p>
          )}

          <fieldset disabled={saving || starting || completing || !canDraft || isCompleted} className="min-w-0 space-y-5 border-0 p-0">

          {/* AI ANALYSIS AND DIAGNOSIS */}

          <div className="grid gap-5 xl:grid-cols-2">

            <CuraCard className="doctor-consultation-card">
              <DoctorAISymptomPanel
                analysis={analysis}
              />
            </CuraCard>

            <CuraCard className="doctor-consultation-card">
              <DoctorDiagnosisForm
                diagnosis={diagnosis}
                onChange={updateDiagnosis}
              />
            </CuraCard>

          </div>

          {/* SOAP NOTES */}

          <CuraCard className="doctor-consultation-card">
            <DoctorConsultationNotes
              notes={notes}
              onChange={updateNotes}
            />
          </CuraCard>

          {/* CARE PLAN */}

          <CuraCard className="doctor-consultation-card">
            <DoctorCarePlan
              carePlan={carePlan}
              onChange={updateCarePlan}
            />
          </CuraCard>

          {/* PRESCRIPTION */}

          <CuraCard className="doctor-consultation-card">
            <DoctorPrescriptionForm
              items={prescriptionItems}
              onChange={updatePrescriptionItems}
            />
          </CuraCard>

          </fieldset>

          {/* CONSULTATION ACTIONS */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dceae7] bg-white p-4">
            <p className="text-xs text-[#607b79]">
              {isCompleted
                ? "Consultation completed. Normal draft editing is locked."
                : hasUnsavedChanges
                  ? "You have unsaved changes. Save before completing."
                  : "No unsaved changes."}
              {" "}Completing a consultation does not issue prescriptions.
            </p>
            {!isCompleted && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={!canDraft || saving || starting || completing || !hasUnsavedChanges}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#18a999] px-5 py-3 text-sm font-bold text-white hover:bg-[#138f83] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving && <LoaderCircle size={16} className="animate-spin" />}
                  {saving ? "Saving Draft..." : "Save Draft"}
                </button>
                <button
                  type="button"
                  onClick={handleComplete}
                  disabled={!canComplete}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#263d3c] px-5 py-3 text-sm font-bold text-white hover:bg-[#38514f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {completing && <LoaderCircle size={16} className="animate-spin" />}
                  {completing ? "Completing..." : "Complete Consultation"}
                </button>
              </div>
            )}
          </div>

<DoctorPrescriptionIssuance
  patient={patient}
  consultation={savedConsultation}
  queueEntryId={queueEntryId}
  onIssued={(issuedPrescription) => {
    setSavedConsultation((previous) =>
      previous
        ? {
            ...previous,
            prescription: issuedPrescription,
          }
        : previous
    );
  }}
/>


{/* LABORATORY & DIAGNOSTIC REQUESTS */}
<DoctorLabRequestForm
  queueEntryId={queueEntryId}
  consultation={savedConsultation}
  patient={patient}
/>





          {!isCompleted && savedConsultation?.status !== "draft" && (

            <p className="text-xs text-[#607b79]">
              Save a consultation draft before you can complete it.
            </p>

          )}
          {!isCompleted && hasUnsavedChanges && (
            <p className="text-xs text-[#607b79]">
              Save the latest changes before completing the consultation.
            </p>
          )}
          {saveSuccess && (
            <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              {saveSuccess}
            </p>
          )}
          {saveError && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              Save failed: {saveError}. Your changes remain in the form.
            </p>
          )}
          {completionSuccess && (
            <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              {completionSuccess}
            </p>
          )}
          {completionError && (
            <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              Completion failed: {completionError}
            </p>
          )}

        </>
      )}
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| CURA - Doctor Consultation Page
|--------------------------------------------------------------------------
*/

const Consultation = () => {
  /*
  |--------------------------------------------------------------------------
  | Selected Queue Entry from URL
  |--------------------------------------------------------------------------
  |
  | Example:
  | /doctor/consultation/10
  |
  */

  const { queueEntryId } = useParams();

  /*
  |--------------------------------------------------------------------------
  | API State
  |--------------------------------------------------------------------------
  */

  const [selection, setSelection] = useState(null);
  const [loading, setLoading] = useState(
    Boolean(queueEntryId)
  );
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Load Selected Patient
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const loadConsultation = async () => {
      if (!queueEntryId) {
        setSelection(null);
        setLoading(false);
        setError("");
        return;
      }

      if (!/^[1-9]\d*$/.test(queueEntryId)) {
        setSelection(null);
        setLoading(false);
        setError("Invalid queue entry ID.");
        return;
      }

      setLoading(true);
      setError("");
      setSelection(null);

      try {
        const response = await api(
          `/doctor/queue/${encodeURIComponent(queueEntryId)}`,
          {
            method: "GET",
            signal: controller.signal,
          }
        );

        if (
          !response?.patient ||
          !response?.appointment ||
          !response?.queue_entry
        ) {
          throw new Error(
            "The server returned incomplete consultation information."
          );
        }

        if (active) {
          setSelection({
            id: queueEntryId,
            data: response,
          });
        }
      } catch (err) {
        if (!active || controller.signal.aborted) {
          return;
        }

        if (err.status === 404) {
          setError(
            "This queue entry was not found or is not assigned to you for today's queue."
          );
        } else if (err.status === 403) {
          setError(
            "You are not authorized to view this consultation."
          );
        } else {
          setError(
            err.message ||
              "Unable to load the selected patient."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadConsultation();

    return () => {
      active = false;
      controller.abort();
    };
  }, [queueEntryId]);

  /*
  |--------------------------------------------------------------------------
  | Prevent Stale or Missing Patient Information
  |--------------------------------------------------------------------------
  */

  const context =
    selection &&
    queueEntryId &&
    selection.id === queueEntryId
      ? selection.data
      : null;

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="doctor-consultation space-y-5">

      {/* PAGE INTRODUCTION */}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#18a999]">
            Clinical Workspace
          </p>

          <h2 className="mt-1 text-[22px] font-black text-[#263d3c]">
            Patient Consultation
          </h2>

          <p className="mt-2 text-[13px] text-[#78908e]">
            Review patient information and prepare
            clinician-reviewed consultation drafts.
          </p>
        </div>

        <Link
          to="/doctor/queue"
          className="inline-flex items-center gap-2 rounded-xl border border-[#dceae7] bg-white px-4 py-2.5 text-xs font-bold text-[#38514f] hover:bg-[#edf7f4]"
        >
          <ArrowLeft size={15} />
          Back to My Queue
        </Link>
      </div>

      {/* NO PATIENT SELECTED */}

      {!queueEntryId && (
        <CuraCard className="doctor-consultation-card">
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <ClipboardList
              size={36}
              className="text-[#18a999]"
            />

            <h3 className="text-base font-black text-[#38514f]">
              No Patient Selected
            </h3>

            <p className="max-w-md text-sm text-[#78908e]">
              To start a consultation, open My Queue
              and select an assigned patient.
            </p>

            
<Link
  to="/doctor/queue"
  style={{ color: "#ffffff" }}
  className="mt-2 inline-flex items-center justify-center rounded-xl bg-[#18a999] px-5 py-3 text-xs font-bold hover:bg-[#138f83]"
>
  Go to My Queue
</Link>
 
          </div>
        </CuraCard>
      )}

      {/* LOADING STATE */}

      {queueEntryId && (loading || (
        !context && !error
      )) && (
        <CuraCard className="doctor-consultation-card">
          <div
            role="status"
            className="flex flex-col items-center justify-center gap-3 py-12"
          >
            <LoaderCircle
              size={32}
              className="animate-spin text-[#18a999]"
            />

            <p className="text-sm text-[#78908e]">
              Loading selected patient...
            </p>
          </div>
        </CuraCard>
      )}

      {/* ERROR STATE */}

      {queueEntryId && error && !loading && (
        <CuraCard className="doctor-consultation-card">
          <div
            role="alert"
            className="flex items-start gap-3 py-5"
          >
            <AlertCircle
              size={20}
              className="shrink-0 text-red-600"
            />

            <div>
              <p className="text-sm font-bold text-red-700">
                Unable to Open Consultation
              </p>

              <p className="mt-2 text-sm text-[#78908e]">
                {error}
              </p>

              <Link
                to="/doctor/queue"
                className="mt-4 inline-block text-xs font-bold text-[#18a999]"
              >
                Return to My Queue
              </Link>
            </div>
          </div>
        </CuraCard>
      )}

      {/* AUTHORIZED PATIENT CONSULTATION */}

      {queueEntryId && context && !loading && !error && (
        <ConsultationWorkspace
          key={queueEntryId}
          context={context}
          queueEntryId={queueEntryId}
        />
      )}

    </div>
  );
};

export default Consultation;
