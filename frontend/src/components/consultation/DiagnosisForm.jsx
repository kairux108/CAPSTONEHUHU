import {
  CheckCircle2,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

const DiagnosisForm = ({
  diagnosis,
  setDiagnosis,
  onDiagnosisChange,
  onConfirmDiagnosis,
  planStatus,
}) => {
  const suggestedDiagnoses = [
    "Migraine",
    "Hypertension",
    "Upper Respiratory Infection",
  ];

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-[15px] bg-[#dff3ee] text-[#18a999] dark:bg-[#17413e] dark:text-[#65d7cb]">
          <Stethoscope size={19} />
        </div>

        <div>
          <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#18a999]">
            Physician Assessment
          </p>

          <h3 className="mt-1 text-[17px] font-black text-[#263d3c] dark:text-white">
            Final Diagnosis
          </h3>
        </div>
      </div>

      {/* DIAGNOSIS */}

      <div className="mt-5">
        <label>
          <span className="text-[10px] font-bold text-[#607b79] dark:text-[#91aaa7]">
            Diagnosis
          </span>

          <input
            list="cura-diagnosis-list"
            value={
              diagnosis.name
            }
            onChange={(e) =>
              onDiagnosisChange(
                e.target.value
              )
            }
            disabled={
              diagnosis.confirmed
            }
            placeholder="Type or select final diagnosis"
            className="
              mt-2
              h-10
              w-full
              rounded-[12px]
              border
              border-white/70
              bg-white/65
              px-3
              text-[11px]
              text-[#38514f]
              outline-none

              focus:border-[#18a999]

              disabled:opacity-70

              dark:border-[#29413f]
              dark:bg-[#203331]
              dark:text-white
            "
          />

          <datalist id="cura-diagnosis-list">
            {suggestedDiagnoses.map(
              (item) => (
                <option
                  key={item}
                  value={item}
                />
              )
            )}
          </datalist>
        </label>
      </div>

      {/* NOTES */}

      <div className="mt-4">
        <label>
          <span className="text-[10px] font-bold text-[#607b79] dark:text-[#91aaa7]">
            Assessment Notes
          </span>

          <textarea
            rows={4}
            value={
              diagnosis.notes
            }
            onChange={(e) =>
              setDiagnosis(
                (
                  previous
                ) => ({
                  ...previous,
                  notes:
                    e.target
                      .value,
                })
              )
            }
            placeholder="Clinical assessment and supporting findings..."
            className="
              mt-2
              w-full
              rounded-[12px]
              border
              border-white/70
              bg-white/65
              p-3
              text-[11px]
              text-[#38514f]
              outline-none

              focus:border-[#18a999]

              dark:border-[#29413f]
              dark:bg-[#203331]
              dark:text-white
            "
          />
        </label>
      </div>

      {/* CONFIRM */}

      {!diagnosis.confirmed ? (
        <button
          type="button"
          onClick={
            onConfirmDiagnosis
          }
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#18a999] py-2.5 text-[10px] font-bold text-white hover:bg-[#138f83]"
        >
          <ShieldCheck
            size={15}
          />

          Confirm Final Diagnosis
        </button>
      ) : (
        <div className="mt-4 flex items-center justify-between rounded-[13px] bg-[#dff3ee] px-4 py-3 dark:bg-[#17413e]">
          <div className="flex items-center gap-2">
            <CheckCircle2
              size={15}
              className="text-[#18a999]"
            />

            <p className="text-[10px] font-bold text-[#117f76] dark:text-[#65d7cb]">
              Final diagnosis confirmed
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setDiagnosis(
                (
                  previous
                ) => ({
                  ...previous,
                  confirmed:
                    false,
                })
              )
            }
            className="text-[9px] font-bold text-[#607b79] dark:text-[#91aaa7]"
          >
            Edit Diagnosis
          </button>
        </div>
      )}

      {planStatus && (
        <p className="mt-3 rounded-[12px] bg-[#edf7f4] px-3 py-2.5 text-[9px] leading-5 text-[#607b79] dark:bg-[#203331] dark:text-[#91aaa7]">
          {planStatus}
        </p>
      )}
    </div>
  );
};

export default DiagnosisForm;