
import {
  CheckCircle2,
  Stethoscope,
} from "lucide-react";

const DoctorDiagnosisForm = ({
  diagnosis = {
    name: "",
    notes: "",
    reviewed: false,
  },
  onChange = () => {},
}) => {
  const update = (field, value) =>
    onChange({
      ...diagnosis,
      [field]: value,
      reviewed: false,
    });

  return (
    <section className="rounded-[22px] border border-white/70 bg-white/80 p-5 shadow-sm">

      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#dff3ee] text-[#18a999]">
          <Stethoscope size={20} />
        </div>

        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#18a999]">
            Physician Assessment
          </p>

          <h3 className="text-lg font-black text-[#263d3c]">
            Diagnosis Draft
          </h3>
        </div>
      </div>

      <label className="mt-5 block text-xs font-bold text-[#607b79]">
        Diagnosis

        <input
          type="text"
          value={diagnosis.name || ""}
          onChange={(event) =>
            update("name", event.target.value)
          }
          placeholder="Enter physician-assessed diagnosis"
          maxLength={255}
          className="mt-2 w-full rounded-xl border border-[#dcece9] bg-[#f8fbfa] px-4 py-3 text-sm font-normal text-[#263d3c] outline-none focus:border-[#18a999]"
        />
      </label>

      <label className="mt-4 block text-xs font-bold text-[#607b79]">
        Supporting assessment notes

        <textarea
          rows={4}
          value={diagnosis.notes || ""}
          onChange={(event) =>
            update("notes", event.target.value)
          }
          placeholder="Document relevant clinical findings..."
          className="mt-2 w-full rounded-xl border border-[#dcece9] bg-[#f8fbfa] p-4 text-sm font-normal text-[#263d3c] outline-none focus:border-[#18a999]"
        />
      </label>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

        <button
          type="button"
          disabled={
            !diagnosis.name?.trim() ||
            diagnosis.reviewed
          }
          onClick={() =>
            onChange({
              ...diagnosis,
              reviewed: true,
            })
          }
          className="rounded-xl bg-[#18a999] px-4 py-2.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          Mark Draft as Reviewed
        </button>

        {diagnosis.reviewed && (
          <span className="flex items-center gap-2 text-xs font-bold text-[#118b80]">
            <CheckCircle2 size={16} />
            Reviewed locally
          </span>
        )}

      </div>

      <p className="mt-3 text-xs text-[#78908e]">
        Review status is only held in browser memory.
        It is not a signed or saved clinical diagnosis.
      </p>

    </section>
  );
};

export default DoctorDiagnosisForm;
