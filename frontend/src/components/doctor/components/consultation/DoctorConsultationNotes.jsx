
const FIELDS = [
  {
    key: "subjective",
    label: "Subjective",
    hint: "Patient-reported symptoms and history",
  },
  {
    key: "objective",
    label: "Objective",
    hint: "Examination findings and observations",
  },
  {
    key: "assessment",
    label: "Assessment",
    hint: "Clinical impression and reasoning",
  },
  {
    key: "plan",
    label: "Plan",
    hint: "Management and follow-up instructions",
  },
];

const DoctorConsultationNotes = ({
  notes = {},
  onChange = () => {},
}) => {
  return (
    <section className="rounded-[22px] border border-white/70 bg-white/80 p-5 shadow-sm">

      <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#18a999]">
        Clinical Documentation
      </p>

      <h3 className="mt-1 text-lg font-black text-[#263d3c]">
        SOAP Notes
      </h3>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {FIELDS.map(({ key, label, hint }) => (
          <label
            key={key}
            className="block text-xs font-bold text-[#607b79]"
          >
            {label}

            <textarea
              rows={5}
              value={notes[key] || ""}
              onChange={(event) =>
                onChange({
                  ...notes,
                  [key]: event.target.value,
                })
              }
              placeholder={hint}
              className="mt-2 w-full resize-y rounded-xl border border-[#dcece9] bg-[#f8fbfa] p-4 text-sm font-normal text-[#263d3c] outline-none focus:border-[#18a999]"
            />
          </label>
        ))}
      </div>

    </section>
  );
};

export default DoctorConsultationNotes;
