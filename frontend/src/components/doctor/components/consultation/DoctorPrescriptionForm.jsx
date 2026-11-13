import { Plus, Trash2 } from "lucide-react";

/*
|--------------------------------------------------------------------------
| CURA - Doctor Prescription Draft
|--------------------------------------------------------------------------
| This component edits local draft state. It does not issue prescriptions,
| generate medication reminders, or decide medication timing.
*/

const FIELDS = [
  ["medicine", "Medication"],
  ["strength", "Strength"],
  ["dosage", "Dosage"],
  ["frequency", "Frequency"],
  ["duration_days", "Duration (Days)"],
  ["duration", "Duration Description"],
  ["instructions", "Instructions"],
];

const SCHEDULE_TYPES = [
  ["", "Not specified (existing prescription format)"],
  ["fixed", "Fixed clock times"],
  ["interval", "Recurring hourly interval"],
  ["meal", "Meal-based"],
  ["custom", "Custom doctor instructions"],
];

const INPUT_CLASS =
  "mt-2 w-full rounded-xl border border-[#dcece9] bg-white px-3 py-2.5 text-sm font-normal text-[#263d3c] outline-none focus:border-[#18a999]";

const LABEL_CLASS = "text-xs font-bold text-[#607b79]";

const newItem = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  medicine: "",
  strength: "",
  dosage: "",
  frequency: "",
  duration_days: "",
  duration: "",
  instructions: "",
  schedule_type: "",
  as_needed: false,
  administration_times: [],
  interval_hours: null,
  interval_scope: null,
  meal_relation: null,
  timing_instructions: "",
});

const getTimes = (item) =>
  Array.isArray(item.administration_times)
    ? item.administration_times
    : [];

const DoctorPrescriptionForm = ({ items = [], onChange = () => {} }) => {
  const add = () => {
    onChange([...items, newItem()]);
  };

  const remove = (id) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const edit = (id, field, value) => {
    onChange(
      items.map((item) => {
        if (item.id !== id) return item;

        if (field === "duration_days") {
          return {
            ...item,
            duration_days: value,
            duration:
              value === ""
                ? ""
                : `${value} ${Number(value) === 1 ? "day" : "days"}`,
          };
        }

        if (field === "schedule_type") {
          // Clear stale values when the doctor switches primary timing types.
          // meal_relation and timing_instructions may supplement other types.
          return {
            ...item,
            schedule_type: value,
            administration_times:
              value === "fixed"
                ? getTimes(item).length > 0
                  ? getTimes(item)
                  : [""]
                : [],
            interval_hours:
              value === "interval" ? (item.interval_hours ?? null) : null,
            interval_scope:
              value === "interval" ? (item.interval_scope ?? null) : null,
          };
        }

        return { ...item, [field]: value };
      })
    );
  };

  const addTime = (id) => {
    onChange(
      items.map((item) =>
        item.id === id
          ? { ...item, administration_times: [...getTimes(item), ""] }
          : item
      )
    );
  };

  const editTime = (id, timeIndex, value) => {
    onChange(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              administration_times: getTimes(item).map((time, index) =>
                index === timeIndex ? value : time
              ),
            }
          : item
      )
    );
  };

  const removeTime = (id, timeIndex) => {
    onChange(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              administration_times: getTimes(item).filter(
                (_, index) => index !== timeIndex
              ),
            }
          : item
      )
    );
  };

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
        Medication entries are saved when you click Save Draft. They remain
        drafts and are not issued prescriptions.
      </p>

      {items.length === 0 && (
        <p className="mt-5 rounded-xl bg-[#edf7f4] p-4 text-sm text-[#607b79]">
          No medications added. Prescriptions are optional and must be reviewed
          by an authorized physician.
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

            {/* Keep every existing prescription field unchanged. */}
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {FIELDS.map(([field, label]) => (
                <label key={field} className={LABEL_CLASS}>
                  {label}
                  <input
                    type={field === "duration_days" ? "number" : "text"}
                    min={field === "duration_days" ? 1 : undefined}
                    max={field === "duration_days" ? 3650 : undefined}
                    step={field === "duration_days" ? 1 : undefined}
                    value={item[field] ?? ""}
                    onChange={(event) =>
                      edit(item.id, field, event.target.value)
                    }
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className={INPUT_CLASS}
                  />
                </label>
              ))}
            </div>

            {/* Scheduling is optional for legacy prescription drafts. */}
            <div className="mt-4 rounded-2xl border border-[#dcece9] bg-white p-4">
              <p className="text-xs font-extrabold uppercase tracking-wide text-[#117f76]">
                Medication Timing
              </p>
              <p className="mt-1 text-xs leading-5 text-[#78908e]">
                Enter the doctor's intended schedule. CURA does not calculate
                dose times or prescribe an interval automatically.
              </p>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <label className={LABEL_CLASS}>
                  Primary schedule type
                  <select
                    value={item.schedule_type ?? ""}
                    onChange={(event) =>
                      edit(item.id, "schedule_type", event.target.value)
                    }
                    className={INPUT_CLASS}
                  >
                    {SCHEDULE_TYPES.map(([value, label]) => (
                      <option
                        key={value || "unspecified"}
                        value={value}
                        disabled={value === "interval" && Boolean(item.as_needed)}
                      >
                        {label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 rounded-xl border border-[#dcece9] bg-[#f8fbfa] px-3 py-3 text-sm font-semibold text-[#38514f]">
                    <input
                      type="checkbox"
                      checked={Boolean(item.as_needed)}
                      disabled={item.schedule_type === "interval"}
                      onChange={(event) =>
                        edit(item.id, "as_needed", event.target.checked)
                      }
                      className="h-4 w-4 accent-[#18a999]"
                    />
                    Take only as needed (PRN)
                  </label>
                  {item.schedule_type === "interval" && (
                    <p className="mt-1 text-xs text-amber-700">
                      A recurring interval cannot also be PRN. Choose Custom
                      for as-needed instructions.
                    </p>
                  )}
                </div>
              </div>

              {item.schedule_type === "fixed" && (
                <div className="mt-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className={LABEL_CLASS}>Administration times (required)</p>
                    <button
                      type="button"
                      onClick={() => addTime(item.id)}
                      disabled={getTimes(item).length >= 12}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#117f76] disabled:opacity-50"
                    >
                      <Plus size={14} />
                      Add time
                    </button>
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                    {getTimes(item).map((time, timeIndex) => (
                      <div key={`${item.id}-time-${timeIndex}`} className="flex items-center gap-2">
                        <input
                          type="time"
                          aria-label={`Medication ${index + 1} time ${timeIndex + 1}`}
                          value={time}
                          onChange={(event) =>
                            editTime(item.id, timeIndex, event.target.value)
                          }
                          className="w-full rounded-xl border border-[#dcece9] bg-white px-3 py-2.5 text-sm text-[#263d3c] outline-none focus:border-[#18a999]"
                        />
                        <button
                          type="button"
                          onClick={() => removeTime(item.id, timeIndex)}
                          aria-label={`Remove time ${timeIndex + 1}`}
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                  {getTimes(item).length === 0 && (
                    <p className="mt-2 text-xs text-amber-700">
                      Add at least one time before saving this schedule.
                    </p>
                  )}
                </div>
              )}

              {item.schedule_type === "interval" && (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <label className={LABEL_CLASS}>
                    Every N hours (required)
                    <input
                      type="number"
                      min="1"
                      max="168"
                      step="1"
                      value={item.interval_hours ?? ""}
                      onChange={(event) =>
                        edit(
                          item.id,
                          "interval_hours",
                          event.target.value === "" ? null : Number(event.target.value)
                        )
                      }
                      className={INPUT_CLASS}
                    />
                  </label>
                  <label className={LABEL_CLASS}>
                    Interval applies (required)
                    <select
                      value={item.interval_scope ?? ""}
                      onChange={(event) =>
                        edit(item.id, "interval_scope", event.target.value || null)
                      }
                      className={INPUT_CLASS}
                    >
                      <option value="">Select interval scope</option>
                      <option value="around_clock">Around the clock</option>
                      <option value="while_awake">While awake</option>
                    </select>
                  </label>
                </div>
              )}

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <label className={LABEL_CLASS}>
                  Relation to meals {item.schedule_type === "meal" ? "(required)" : "(optional)"}
                  <select
                    value={item.meal_relation ?? ""}
                    onChange={(event) =>
                      edit(item.id, "meal_relation", event.target.value || null)
                    }
                    className={INPUT_CLASS}
                  >
                    <option value="">Not specified</option>
                    <option value="before">Before meals</option>
                    <option value="with">With meals</option>
                    <option value="after">After meals</option>
                  </select>
                </label>

                <label className={LABEL_CLASS}>
                  Timing instructions {item.schedule_type === "custom" ? "(required)" : "(optional)"}
                  <textarea
                    rows={3}
                    maxLength={10000}
                    value={item.timing_instructions ?? ""}
                    onChange={(event) =>
                      edit(item.id, "timing_instructions", event.target.value)
                    }
                    placeholder="Doctor-specified timing, including PRN guidance if applicable"
                    className={INPUT_CLASS}
                  />
                </label>
              </div>

              {item.as_needed && (
                <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
                  PRN means take only when needed, as prescribed. Recurring
                  dose reminders must not be generated from this entry.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DoctorPrescriptionForm;
