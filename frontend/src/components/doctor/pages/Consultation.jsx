
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

/*
|--------------------------------------------------------------------------
| Consultation Draft Workspace
|--------------------------------------------------------------------------
|
| This component is mounted for one selected queue entry.
| Its local drafts are reset when the selected patient changes.
|
*/

const ConsultationWorkspace = ({ context }) => {
  const patient = context.patient;
  const appointment = context.appointment;
  const queueEntry = context.queue_entry;

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
  ].includes(queueEntry.status);

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

        <span className="rounded-full bg-[#dff3ee] px-4 py-2 text-xs font-bold capitalize text-[#117f76]">
          {String(queueEntry.status || "unknown")
            .replaceAll("_", " ")}
        </span>
      </div>

      {/* REAL PATIENT INFORMATION */}

      <CuraCard className="doctor-consultation-card">
        <PatientConsultationHeader
          patient={patient}
          appointment={appointment}
        />
      </CuraCard>

      {/* QUEUE STATUS NOTICE */}

      {!canDraft ? (
        <CuraCard className="doctor-consultation-card">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={19}
              className="shrink-0 text-amber-600"
            />

            <div>
              <p className="text-sm font-bold text-[#38514f]">
                Consultation drafting is unavailable
              </p>

              <p className="mt-2 text-sm text-[#78908e]">
                This patient's queue status is not
                currently Called or In Consultation.
                The patient's information is visible,
                but consultation drafting is disabled.
              </p>
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
              <strong>Frontend Draft Mode:</strong>{" "}
              Patient information was loaded from CURA.
              Diagnosis, SOAP notes, care plan, and
              prescription entries are not yet saved
              to PostgreSQL. Do not enter real clinical
              notes until secure saving is implemented.
            </p>
          </div>

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
                onChange={setDiagnosis}
              />
            </CuraCard>

          </div>

          {/* SOAP NOTES */}

          <CuraCard className="doctor-consultation-card">
            <DoctorConsultationNotes
              notes={notes}
              onChange={setNotes}
            />
          </CuraCard>

          {/* CARE PLAN */}

          <CuraCard className="doctor-consultation-card">
            <DoctorCarePlan
              carePlan={carePlan}
              onChange={setCarePlan}
            />
          </CuraCard>

          {/* PRESCRIPTION */}

          <CuraCard className="doctor-consultation-card">
            <DoctorPrescriptionForm
              items={prescriptionItems}
              onChange={setPrescriptionItems}
            />
          </CuraCard>

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
        />
      )}

    </div>
  );
};

export default Consultation;
