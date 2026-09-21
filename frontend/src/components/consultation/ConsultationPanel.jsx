import {
  CheckCircle2,
  Clock3,
  Save,
  UserRound,
} from "lucide-react";

import {
  useState,
} from "react";

import AISymptomPanel from "./AISymptomPanel";
import DiagnosisForm from "./DiagnosisForm";
import PrescriptionForm from "./PrescriptionForm";
import ConsultationNotes from "./ConsultationNotes";

const CARE_PLAN_TEMPLATES = {
  Migraine: {
    medication: {
      medicine:
        "Clinic-approved migraine medication template",
      strength: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions:
        "Review and complete medication instructions before approval.",
    },

    plan: [
      "Review symptom triggers and warning signs.",
      "Provide appropriate patient education.",
      "Set follow-up schedule when clinically indicated.",
    ],

    followUp:
      "Doctor to determine follow-up interval.",
  },

  Hypertension: {
    medication: {
      medicine:
        "Clinic-approved hypertension medication template",
      strength: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions:
        "Review patient history, current medicines, and contraindications before approval.",
    },

    plan: [
      "Document blood pressure findings.",
      "Review current medications and adherence.",
      "Provide clinic-approved lifestyle counseling.",
      "Set appropriate monitoring and follow-up schedule.",
    ],

    followUp:
      "Doctor to determine monitoring and follow-up interval.",
  },

  "Upper Respiratory Infection": {
    medication: {
      medicine:
        "Clinic-approved respiratory care template",
      strength: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions:
        "Review symptoms and clinical findings before finalizing treatment.",
    },

    plan: [
      "Provide clinic-approved supportive care instructions.",
      "Explain warning signs that require reassessment.",
      "Determine follow-up based on clinical findings.",
    ],

    followUp:
      "Follow-up based on doctor assessment.",
  },
};

const ConsultationPanel = () => {
  const [
    diagnosis,
    setDiagnosis,
  ] = useState({
    name: "",
    notes: "",
    confirmed: false,
  });

  const [
    notes,
    setNotes,
  ] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });

  const [
    prescriptionItems,
    setPrescriptionItems,
  ] = useState([]);

  const [
    carePlan,
    setCarePlan,
  ] = useState({
    suggestions: [],
    followUp: "",
  });

  const [
    saved,
    setSaved,
  ] = useState(false);

  const [
    planStatus,
    setPlanStatus,
  ] = useState("");

  const confirmDiagnosis = () => {
    const diagnosisName =
      diagnosis.name.trim();

    if (!diagnosisName) {
      setPlanStatus(
        "Enter a final diagnosis before confirming."
      );

      return;
    }

    const template =
      CARE_PLAN_TEMPLATES[
        diagnosisName
      ];

    setDiagnosis(
      (previous) => ({
        ...previous,
        confirmed: true,
      })
    );

    if (template) {
      setPrescriptionItems([
        {
          id: Date.now(),
          ...template.medication,
          source:
            "CURA suggestion",
          approved: false,
        },
      ]);

      setCarePlan({
        suggestions:
          template.plan,
        followUp:
          template.followUp,
      });

      setPlanStatus(
        "CURA loaded a clinic-template draft. Review and edit all fields before approval."
      );
    } else {
      setPrescriptionItems([]);

      setCarePlan({
        suggestions: [
          "No matching clinic-approved care template is available.",
          "Doctor may manually create the treatment and follow-up plan.",
        ],
        followUp: "",
      });

      setPlanStatus(
        "Diagnosis confirmed, but no matching care-plan template was found."
      );
    }
  };

  const diagnosisChanged = (
    value
  ) => {
    setDiagnosis(
      (previous) => ({
        ...previous,
        name: value,
        confirmed: false,
      })
    );

    setPlanStatus("");
  };

  const saveConsultation = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <div>
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#18a999]">
            Clinical Workspace
          </p>

          <h2 className="mt-1 text-[22px] font-black text-[#263d3c] dark:text-white">
            Patient Consultation
          </h2>

          <p className="mt-1 text-[12px] text-[#78908e]">
            Review symptoms, confirm diagnosis, and prepare an editable care plan.
          </p>
        </div>

        <button
          type="button"
          onClick={
            saveConsultation
          }
          className="flex items-center gap-2 rounded-[13px] bg-[#18a999] px-5 py-2.5 text-[11px] font-bold text-white hover:bg-[#138f83]"
        >
          {saved ? (
            <CheckCircle2
              size={15}
            />
          ) : (
            <Save size={15} />
          )}

          {saved
            ? "Saved"
            : "Save Consultation"}
        </button>
      </div>

      {/* PATIENT */}

      <section className="mt-5 rounded-[22px] border border-white/60 bg-white/68 p-5 shadow-[0_14px_32px_rgba(44,78,75,0.11)] dark:border-[#29413f] dark:bg-[#172827]/85">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-[16px] bg-[#dff3ee] text-[#18a999] dark:bg-[#17413e] dark:text-[#65d7cb]">
              <UserRound size={20} />
            </div>

            <div>
              <p className="text-[17px] font-black text-[#263d3c] dark:text-white">
                Maria Santos
              </p>

              <p className="mt-1 text-[10px] text-[#78908e]">
                CURA-0001 • Female • 36 years old
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-[13px] bg-[#dff3ee] px-4 py-2 text-[10px] font-bold text-[#117f76] dark:bg-[#17413e] dark:text-[#65d7cb]">
            <Clock3 size={14} />
            Consultation in progress
          </div>
        </div>
      </section>

      {/* AI + DIAGNOSIS */}

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.9fr_1.2fr]">
        <section className="rounded-[22px] border border-white/60 bg-white/68 p-5 shadow-[0_14px_32px_rgba(44,78,75,0.11)] dark:border-[#29413f] dark:bg-[#172827]/85">
          <AISymptomPanel />
        </section>

        <section className="rounded-[22px] border border-white/60 bg-white/68 p-5 shadow-[0_14px_32px_rgba(44,78,75,0.11)] dark:border-[#29413f] dark:bg-[#172827]/85">
          <DiagnosisForm
            diagnosis={
              diagnosis
            }
            setDiagnosis={
              setDiagnosis
            }
            onDiagnosisChange={
              diagnosisChanged
            }
            onConfirmDiagnosis={
              confirmDiagnosis
            }
            planStatus={
              planStatus
            }
          />
        </section>
      </div>

      {/* CARE PLAN */}

      {diagnosis.confirmed && (
        <section className="mt-5 rounded-[22px] border border-white/60 bg-white/68 p-5 shadow-[0_14px_32px_rgba(44,78,75,0.11)] dark:border-[#29413f] dark:bg-[#172827]/85">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#18a999]">
              CURA Care Plan Assistant
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h3 className="text-[17px] font-black text-[#263d3c] dark:text-white">
                Suggested Management Plan
              </h3>

              <span className="rounded-full bg-amber-100 px-3 py-1 text-[8px] font-extrabold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                NOT YET APPROVED
              </span>
            </div>

            <p className="mt-1 text-[10px] text-[#78908e]">
              Generated from a clinic-approved template after diagnosis confirmation.
            </p>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.7fr]">
            <div className="rounded-[17px] bg-[#edf7f4] p-4 dark:bg-[#203331]">
              <p className="text-[9px] font-extrabold uppercase text-[#78908e]">
                Suggested Care Plan
              </p>

              <div className="mt-3 space-y-2">
                {carePlan.suggestions.map(
                  (
                    suggestion,
                    index
                  ) => (
                    <div
                      key={index}
                      className="flex gap-2"
                    >
                      <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#18a999]" />

                      <p className="text-[10px] leading-5 text-[#607b79] dark:text-[#91aaa7]">
                        {
                          suggestion
                        }
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            <label className="rounded-[17px] bg-[#edf7f4] p-4 dark:bg-[#203331]">
              <span className="text-[9px] font-extrabold uppercase text-[#78908e]">
                Follow-up Plan
              </span>

              <textarea
                rows={5}
                value={
                  carePlan.followUp
                }
                onChange={(e) =>
                  setCarePlan(
                    (
                      previous
                    ) => ({
                      ...previous,
                      followUp:
                        e.target
                          .value,
                    })
                  )
                }
                placeholder="Doctor may edit the follow-up plan..."
                className="mt-3 w-full rounded-[12px] border border-white/70 bg-white/60 p-3 text-[10px] text-[#38514f] outline-none focus:border-[#18a999] dark:border-[#29413f] dark:bg-[#172827] dark:text-white"
              />
            </label>
          </div>
        </section>
      )}

      {/* SOAP */}

      <section className="mt-5 rounded-[22px] border border-white/60 bg-white/68 p-5 shadow-[0_14px_32px_rgba(44,78,75,0.11)] dark:border-[#29413f] dark:bg-[#172827]/85">
        <ConsultationNotes
          notes={notes}
          setNotes={setNotes}
        />
      </section>

      {/* PRESCRIPTION */}

      <section className="mt-5 rounded-[22px] border border-white/60 bg-white/68 p-5 shadow-[0_14px_32px_rgba(44,78,75,0.11)] dark:border-[#29413f] dark:bg-[#172827]/85">
        <PrescriptionForm
          items={
            prescriptionItems
          }
          setItems={
            setPrescriptionItems
          }
          diagnosisConfirmed={
            diagnosis.confirmed
          }
        />
      </section>
    </div>
  );
};

export default ConsultationPanel;