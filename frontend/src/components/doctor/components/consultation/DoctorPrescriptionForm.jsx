
import { Plus, Trash2 } from "lucide-react";

const FIELDS = [
  ["medicine", "Medication"],
  ["strength", "Strength"],
  ["dosage", "Dosage"],
  ["frequency", "Frequency"],
  ["duration", "Duration"],
  ["instructions", "Instructions"],
];

const newItem = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  medicine: "",
  strength: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
});

const DoctorPrescriptionForm = ({
  items = [],
  onChange = () => {},
}) => {
  const add = () =>
    onChange([
      ...items,
      newItem(),
    ]);

  const remove = (id) =>
    onChange(
      items.filter((item) => item.id !== id)
    );

  const edit = (id, field, value) =>
    onChange(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );

  return (
    <section className="rounded-[22px] border border-white/70 bg-white/80 p-5 shadow-sm">

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#18a999]">
            Medication Plan
          </p>

          <h3 className="mt-1 text-lg font-black text-[#263d3c]">
            Prescription Draft
          </h3>
        </div>

        <button
          type="button"
          onClick={add}
          className="flex items-center gap-2 rounded-xl bg-[#dff3ee] px-4 py-2.5 text-xs font-bold text-[#117f76] hover:bg-[#cfece5]"
        >
          <Plus size={15} />
          Add Medicine
        </button>
      </div>

      <p className="mt-2 text-xs text-[#78908e]">
        Local draft only. No prescription is issued,
        approved, or saved to the patient record.
      </p>

      {items.length === 0 && (
        <p className="mt-5 rounded-xl bg-[#edf7f4] p-4 text-sm text-[#607b79]">
          No medications added. Prescriptions are optional
          and must be reviewed by an authorized physician.
        </p>
      )}

      <div className="mt-4 space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-2xl border border-[#dcece9] bg-[#f8fbfa] p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-[#38514f]">
                Medication {index + 1}
              </p>

              <button
                type="button"
                onClick={() => remove(item.id)}
                aria-label={`Remove medication ${index + 1}`}
                className="rounded-lg p-2 text-red-500 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {FIELDS.map(([field, label]) => (
                <label
                  key={field}
                  className="text-xs font-bold text-[#607b79]"
                >
                  {label}

                  <input
                    type="text"
                    value={item[field] || ""}
                    onChange={(event) =>
                      edit(
                        item.id,
                        field,
                        event.target.value
                      )
                    }
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className="mt-2 w-full rounded-xl border border-[#dcece9] bg-white px-3 py-2.5 text-sm font-normal text-[#263d3c] outline-none focus:border-[#18a999]"
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default DoctorPrescriptionForm;
