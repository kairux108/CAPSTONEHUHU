import {
  CheckCircle2,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import {
  useState,
} from "react";

const PrescriptionForm = ({
  items,
  setItems,
  diagnosisConfirmed,
}) => {
  const [
    approved,
    setApproved,
  ] = useState(false);

  const addMedicine = () => {
    setApproved(false);

    setItems((previous) => [
      ...previous,
      {
        id: Date.now(),
        medicine: "",
        strength: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
        source:
          "Doctor-added",
      },
    ]);
  };

  const updateItem = (
    id,
    field,
    value
  ) => {
    setApproved(false);

    setItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                value,
            }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setApproved(false);

    setItems((previous) =>
      previous.filter(
        (item) =>
          item.id !== id
      )
    );
  };

  const approvePlan = () => {
    if (
      !diagnosisConfirmed
    ) {
      return;
    }

    setApproved(true);
  };

  return (
    <div>
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#18a999]">
            Medication Plan
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h3 className="text-[17px] font-black text-[#263d3c] dark:text-white">
              Prescription Draft
            </h3>

            {approved ? (
              <span className="rounded-full bg-[#dff3ee] px-3 py-1 text-[8px] font-extrabold text-[#117f76] dark:bg-[#17413e] dark:text-[#65d7cb]">
                DOCTOR APPROVED
              </span>
            ) : (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-[8px] font-extrabold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                DRAFT
              </span>
            )}
          </div>

          <p className="mt-1 text-[10px] text-[#78908e]">
            Review and edit all suggested fields before final approval.
          </p>
        </div>

        <button
          type="button"
          onClick={
            addMedicine
          }
          className="flex items-center gap-2 rounded-[12px] bg-[#dff3ee] px-4 py-2 text-[10px] font-bold text-[#117f76] hover:bg-[#cfece5] dark:bg-[#17413e] dark:text-[#65d7cb]"
        >
          <Plus size={14} />
          Add Medicine
        </button>
      </div>

      {/* NO DIAGNOSIS */}

      {!diagnosisConfirmed && (
        <div className="mt-5 rounded-[15px] bg-[#edf7f4] p-4 dark:bg-[#203331]">
          <p className="text-[10px] font-bold text-[#607b79] dark:text-[#91aaa7]">
            Confirm the final
            diagnosis first to load
            an available
            clinic-approved care
            template.
          </p>
        </div>
      )}

      {/* MEDICATIONS */}

      <div className="mt-5 space-y-4">
        {items.map(
          (item, index) => (
            <article
              key={item.id}
              className="rounded-[17px] border border-white/60 bg-[#edf7f4]/80 p-4 dark:border-[#29413f] dark:bg-[#203331]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-wide text-[#78908e]">
                    Medication{" "}
                    {index + 1}
                  </p>

                  <p className="mt-1 text-[8px] text-[#8aa09e]">
                    Source:{" "}
                    {item.source ||
                      "Doctor-added"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    removeItem(
                      item.id
                    )
                  }
                  className="grid h-8 w-8 place-items-center rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <Trash2
                    size={14}
                  />
                </button>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <PrescriptionField
                  label="Medication / Template"
                  value={
                    item.medicine
                  }
                  onChange={(
                    value
                  ) =>
                    updateItem(
                      item.id,
                      "medicine",
                      value
                    )
                  }
                  placeholder="Medication"
                />

                <PrescriptionField
                  label="Strength"
                  value={
                    item.strength
                  }
                  onChange={(
                    value
                  ) =>
                    updateItem(
                      item.id,
                      "strength",
                      value
                    )
                  }
                  placeholder="Enter strength"
                />

                <PrescriptionField
                  label="Dosage"
                  value={
                    item.dosage
                  }
                  onChange={(
                    value
                  ) =>
                    updateItem(
                      item.id,
                      "dosage",
                      value
                    )
                  }
                  placeholder="Enter dosage"
                />

                <PrescriptionField
                  label="Frequency"
                  value={
                    item.frequency
                  }
                  onChange={(
                    value
                  ) =>
                    updateItem(
                      item.id,
                      "frequency",
                      value
                    )
                  }
                  placeholder="Enter frequency"
                />

                <PrescriptionField
                  label="Duration"
                  value={
                    item.duration
                  }
                  onChange={(
                    value
                  ) =>
                    updateItem(
                      item.id,
                      "duration",
                      value
                    )
                  }
                  placeholder="Enter duration"
                />

                <PrescriptionField
                  label="Instructions"
                  value={
                    item.instructions
                  }
                  onChange={(
                    value
                  ) =>
                    updateItem(
                      item.id,
                      "instructions",
                      value
                    )
                  }
                  placeholder="Patient instructions"
                />
              </div>
            </article>
          )
        )}
      </div>

      {items.length === 0 &&
        diagnosisConfirmed && (
          <div className="mt-5 rounded-[15px] bg-[#edf7f4] py-8 text-center dark:bg-[#203331]">
            <p className="text-[10px] font-bold text-[#607b79] dark:text-[#91aaa7]">
              No prescription
              template loaded.
            </p>

            <p className="mt-1 text-[9px] text-[#829b99]">
              The doctor can manually
              add medication or use a
              clinic-approved template.
            </p>
          </div>
        )}

      {/* APPROVAL */}

      {diagnosisConfirmed &&
        items.length > 0 && (
          <div className="mt-5 flex flex-col gap-3 rounded-[15px] bg-[#edf7f4] p-4 dark:bg-[#203331] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              {approved ? (
                <CheckCircle2
                  size={17}
                  className="mt-[1px] shrink-0 text-[#18a999]"
                />
              ) : (
                <ShieldCheck
                  size={17}
                  className="mt-[1px] shrink-0 text-[#18a999]"
                />
              )}

              <div>
                <p className="text-[10px] font-extrabold text-[#38514f] dark:text-[#dce8e6]">
                  {approved
                    ? "Prescription approved by doctor"
                    : "Doctor approval required"}
                </p>

                <p className="mt-1 text-[9px] leading-5 text-[#829b99]">
                  Suggestions do not
                  become final medical
                  orders until reviewed
                  and approved by the
                  physician.
                </p>
              </div>
            </div>

            {!approved && (
              <button
                type="button"
                onClick={
                  approvePlan
                }
                className="shrink-0 rounded-[12px] bg-[#18a999] px-4 py-2.5 text-[10px] font-bold text-white hover:bg-[#138f83]"
              >
                Approve Prescription
              </button>
            )}
          </div>
        )}
    </div>
  );
};

const PrescriptionField = ({
  label,
  value,
  onChange,
  placeholder,
}) => (
  <label>
    <span className="mb-2 block text-[9px] font-bold text-[#607b79] dark:text-[#91aaa7]">
      {label}
    </span>

    <input
      value={value || ""}
      onChange={(e) =>
        onChange(
          e.target.value
        )
      }
      placeholder={placeholder}
      className="
        h-10
        w-full
        rounded-[12px]
        border
        border-white/70
        bg-white/65
        px-3
        text-[10px]
        text-[#38514f]
        outline-none

        focus:border-[#18a999]

        dark:border-[#29413f]
        dark:bg-[#172827]
        dark:text-white
      "
    />
  </label>
);

export default PrescriptionForm;