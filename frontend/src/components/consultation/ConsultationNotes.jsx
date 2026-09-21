const ConsultationNotes = ({
  notes,
  setNotes,
}) => {
  const fields = [
    {
      name: "subjective",
      label: "Subjective",
      placeholder:
        "Patient symptoms and complaints...",
    },
    {
      name: "objective",
      label: "Objective",
      placeholder:
        "Clinical findings and observations...",
    },
    {
      name: "assessment",
      label: "Assessment",
      placeholder:
        "Clinical assessment...",
    },
    {
      name: "plan",
      label: "Plan",
      placeholder:
        "Treatment plan and follow-up...",
    },
  ];

  return (
    <div>
      <p
        className="
          text-[10px]
          font-extrabold
          uppercase
          tracking-[0.14em]
          text-[#159f98]
        "
      >
        Medical Documentation
      </p>

      <h3
        className="
          mt-1
          text-[18px]
          font-black
          text-[#263d3c]
          dark:text-white
        "
      >
        SOAP Notes
      </h3>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {fields.map(
          (field) => (
            <label
              key={
                field.name
              }
            >
              <span
                className="
                  text-[11px]
                  font-bold
                  text-[#607b79]

                  dark:text-[#91aaa7]
                "
              >
                {
                  field.label
                }
              </span>

              <textarea
                rows={4}
                value={
                  notes[
                    field.name
                  ]
                }
                onChange={(e) =>
                  setNotes(
                    (prev) => ({
                      ...prev,
                      [field.name]:
                        e.target
                          .value,
                    })
                  )
                }
                placeholder={
                  field.placeholder
                }
                className="
                  mt-2
                  w-full
                  rounded-[14px]
                  border
                  border-white/70
                  bg-white/60
                  p-4
                  text-[12px]
                  text-[#425c59]
                  outline-none

                  focus:border-[#58c5bc]

                  dark:border-[#29413f]
                  dark:bg-[#203331]
                  dark:text-white
                "
              />
            </label>
          )
        )}
      </div>
    </div>
  );
};

export default ConsultationNotes;