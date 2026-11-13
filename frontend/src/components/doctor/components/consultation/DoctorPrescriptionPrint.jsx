import { useState } from "react";
import { createPortal } from "react-dom";

const getScheduleLabel = (scheduleType) => {
  switch (scheduleType) {
    case "fixed":
      return "Fixed administration times";
    case "interval":
      return "Recurring hourly interval";
    case "meal":
      return "Meal-based";
    case "custom":
      return "Custom doctor instructions";
    default:
      return "Not specified";
  }
};

const getMealRelationLabel = (mealRelation) => {
  switch (mealRelation) {
    case "before":
      return "Before meals";
    case "with":
      return "With meals";
    case "after":
      return "After meals";
    default:
      return "Not specified";
  }
};

const DoctorPrescriptionPrint = ({
  patient,
  consultation,
  prescription,
}) => {
  const [showPreview, setShowPreview] = useState(false);

  if (prescription?.status !== "issued") {
    return null;
  }

  const patientName =
    [
      patient?.first_name,
      patient?.middle_name,
      patient?.last_name,
      patient?.suffix,
    ]
      .filter(Boolean)
      .join(" ") || "Patient information unavailable";

  const doctorName =
    prescription.issuing_doctor?.name ||
    "Prescribing doctor unavailable";

  const diagnosis =
    consultation?.diagnosis?.name || "Not recorded";

  const medicines = Array.isArray(prescription.items)
    ? prescription.items
    : [];

  const issueDate = prescription.issued_at
    ? new Date(prescription.issued_at).toLocaleString("en-PH", {
        timeZone: "Asia/Manila",
        dateStyle: "long",
        timeStyle: "short",
      })
    : "Not available";

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setShowPreview(true)}
        className="rounded-xl bg-[#263d3c] px-5 py-3 text-sm font-bold text-white hover:bg-[#38514f]"
      >
        View / Print Prescription
      </button>

      {showPreview &&
        createPortal(
          <div
            id="cura-prescription-print-portal"
            role="dialog"
            aria-modal="true"
            aria-label="Prescription Preview"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
          >
            <div className="cura-prescription-modal max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6">
              {/* PREVIEW CONTROLS */}

              <div className="cura-prescription-controls mb-5 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="rounded-lg border px-4 py-2 text-sm font-semibold"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-lg bg-[#18a999] px-4 py-2 text-sm font-bold text-white"
                >
                  Print Prescription
                </button>
              </div>

              {/* PRINTABLE CONTENT */}

              <div
                id="cura-prescription-print"
                className="bg-white p-6 text-black"
              >
                <div className="border-b-2 border-black pb-5 text-center">
                  <h1 className="text-2xl font-bold">
                    CURA Healthcare System
                  </h1>

                  <p className="mt-1 text-sm">
                    Digital Prescription Summary
                  </p>

                  <p className="mt-2 text-xs font-bold">
                    TEST DOCUMENT — NOT VALID FOR DISPENSING
                  </p>
                </div>

                {/* PATIENT INFORMATION */}

                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-bold">Patient Name</p>
                    <p>{patientName}</p>
                  </div>

                  <div>
                    <p className="font-bold">Patient Number</p>
                    <p>{patient?.patient_number || "Unavailable"}</p>
                  </div>

                  <div>
                    <p className="font-bold">Date Issued</p>
                    <p>{issueDate}</p>
                  </div>

                  <div>
                    <p className="font-bold">Prescription ID</p>
                    <p>{prescription.id}</p>
                  </div>
                </div>

                {/* DIAGNOSIS */}

                <div className="mt-6 border-t pt-4">
                  <p className="text-sm font-bold">Recorded Diagnosis</p>
                  <p className="mt-1 text-sm">{diagnosis}</p>
                </div>

                {/* MEDICATIONS */}

                <div className="mt-6">
                  <h2 className="mb-4 text-xl font-bold">
                    Rx — Prescribed Medications
                  </h2>

                  {medicines.length === 0 ? (
                    <p className="text-sm">
                      No medication details available.
                    </p>
                  ) : (
                    medicines.map((item, index) => (
                      <div
                        key={item.id ?? index}
                        className="cura-medication-print-item mb-4 border-b pb-4 text-sm"
                      >
                        <p className="font-bold">
                          {index + 1}. {item.medicine}
                        </p>

                        <p>
                          Strength: {item.strength || "Not specified"}
                        </p>

                        <p>
                          Dosage: {item.dosage || "Not specified"}
                        </p>

                        <p>
                          Frequency: {item.frequency || "Not specified"}
                        </p>

                        <p>
                          Duration:{" "}
                          {item.duration ||
                            (item.duration_days
                              ? `${item.duration_days} days`
                              : "Not specified")}
                        </p>

                        <p>
                          Instructions: {item.instructions || "Not specified"}
                        </p>

                        {/* Show saved scheduling values without calculating doses. */}
                        <div className="mt-3 space-y-1 rounded-lg border border-gray-300 p-3">
                          <p className="font-bold">Medication Schedule</p>

                          <p>
                            Schedule Type: {getScheduleLabel(item.schedule_type)}
                          </p>

                          {item.schedule_type === "fixed" && (
                            <p>
                              Administration Times (24-hour):{" "}
                              {Array.isArray(item.administration_times) &&
                              item.administration_times.length > 0
                                ? item.administration_times.join(", ")
                                : "Not specified"}
                            </p>
                          )}

                          {item.schedule_type === "interval" && (
                            <>
                              <p>
                                Interval: {item.interval_hours != null
                                  ? `Every ${item.interval_hours} hours`
                                  : "Not specified"}
                              </p>

                              <p>
                                Interval Applies:{" "}
                                {item.interval_scope === "around_clock"
                                  ? "Around the clock"
                                  : item.interval_scope === "while_awake"
                                    ? "While awake"
                                    : "Not specified"}
                              </p>
                            </>
                          )}

                          {(item.schedule_type === "meal" || item.meal_relation) && (
                            <p>
                              Relation to Meals:{" "}
                              {getMealRelationLabel(item.meal_relation)}
                            </p>
                          )}

                          <p className={item.as_needed ? "font-bold" : ""}>
                            Take Only As Needed (PRN):{" "}
                            {item.as_needed === true
                              ? "Yes"
                              : item.as_needed === false
                                ? "No"
                                : "Not specified"}
                          </p>

                          {item.timing_instructions && (
                            <p>
                              Doctor Timing Instructions:{" "}
                              {item.timing_instructions}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* ISSUING DOCTOR */}

                <div className="mt-10 border-t pt-5 text-sm">
                  <p className="font-bold">Issued By</p>
                  <p>{doctorName}</p>

                  <p className="mt-4 text-xs">
                    Prescriber credentials and signature have not been
                    configured for this print layout.
                  </p>
                </div>
              </div>
            </div>

            {/* PRINT STYLES */}

            <style>{`
              @media print {
                @page {
                  size: A4;
                  margin: 14mm;
                }

                html,
                body {
                  height: auto !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  overflow: visible !important;
                  background: white !important;
                }

                /* Remove the dashboard from print layout. */
                body > :not(#cura-prescription-print-portal) {
                  display: none !important;
                }

                /* Print portal replaces the full-screen overlay. */
                #cura-prescription-print-portal {
                  display: block !important;
                  position: static !important;
                  inset: auto !important;
                  width: 100% !important;
                  height: auto !important;
                  max-height: none !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  overflow: visible !important;
                  background: white !important;
                }

                .cura-prescription-modal {
                  display: block !important;
                  position: static !important;
                  width: 100% !important;
                  max-width: none !important;
                  height: auto !important;
                  max-height: none !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  overflow: visible !important;
                  border: 0 !important;
                  border-radius: 0 !important;
                  box-shadow: none !important;
                }

                .cura-prescription-controls {
                  display: none !important;
                }

                #cura-prescription-print {
                  position: static !important;
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  background: white !important;
                  color: black !important;
                }

                .cura-medication-print-item {
                  break-inside: avoid;
                  page-break-inside: avoid;
                }
              }
            `}</style>
          </div>,
          document.body
        )}
    </div>
  );
};

export default DoctorPrescriptionPrint;
