
import { ClipboardList } from "lucide-react";

const DoctorCarePlan = ({
  carePlan = {},
  onChange = () => {},
}) => {
  return (
    <section className="rounded-[22px] border border-white/70 bg-white/80 p-5 shadow-sm">

      <div className="flex items-center gap-3">
        <ClipboardList
          size={20}
          className="text-[#18a999]"
        />

        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#18a999]">
            Physician Plan
          </p>

          <h3 className="text-lg font-black text-[#263d3c]">
            Care Plan Draft
          </h3>
        </div>
      </div>

      <label className="mt-5 block text-xs font-bold text-[#607b79]">
        Management instructions

        <textarea
          rows={4}
          value={carePlan.instructions || ""}
          onChange={(event) =>
            onChange({
              ...carePlan,
              instructions: event.target.value,
            })
          }
          placeholder="Enter clinician-reviewed management instructions..."
          className="mt-2 w-full rounded-xl border border-[#dcece9] bg-[#f8fbfa] p-4 text-sm font-normal text-[#263d3c] outline-none focus:border-[#18a999]"
        />
      </label>

      <label className="mt-4 block text-xs font-bold text-[#607b79]">
        Follow-up plan

        <textarea
          rows={3}
          value={carePlan.followUp || ""}
          onChange={(event) =>
            onChange({
              ...carePlan,
              followUp: event.target.value,
            })
          }
          placeholder="Follow-up date, monitoring, or reassessment plan..."
          className="mt-2 w-full rounded-xl border border-[#dcece9] bg-[#f8fbfa] p-4 text-sm font-normal text-[#263d3c] outline-none focus:border-[#18a999]"
        />
      </label>

      <p className="mt-3 text-xs text-[#78908e]">
        No care plan is generated or approved automatically.
        Templates can be connected after clinical review
        and backend validation.
      </p>

    </section>
  );
};

export default DoctorCarePlan;
