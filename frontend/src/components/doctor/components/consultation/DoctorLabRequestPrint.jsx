import { useState } from "react";
import { createPortal } from "react-dom";

/**
 * CURA laboratory request print preview.
 * Displays ONLY an issued request already returned by the authorized
 * consultation API. It does not create, update, or issue any records.
 *
 * Like CURA's existing prescription print template, this is marked as a
 * TEST DOCUMENT until the clinic's approved letterhead, clinician credentials,
 * and signature workflow are configured.
 */
const formatIssueDate = (dateString) => {
  if (!dateString) return "Unavailable";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Unavailable";
  return date.toLocaleString("en-PH", {
    timeZone: "Asia/Manila",
    dateStyle: "long",
    timeStyle: "short",
  });
};

const nameFromPatient = (patient) =>
  [
    patient?.first_name,
    patient?.middle_name,
    patient?.last_name,
    patient?.suffix,
  ]
    .filter(Boolean)
    .join(" ") || "Patient information unavailable";

const DoctorLabRequestPrint = ({ patient, consultation, labRequest }) => {
  const [showPreview, setShowPreview] = useState(false);

  // Drafts must not be presented as finalized laboratory orders.
  if (labRequest?.status !== "issued") return null;

  const items = Array.isArray(labRequest.items) ? labRequest.items : [];
  const issuingDoctor =
    labRequest.issuing_doctor?.name || "Issuing doctor unavailable";
  const requestingDoctor =
    labRequest.requesting_doctor?.name || "Requesting doctor unavailable";
  const diagnosis = consultation?.diagnosis?.name;

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setShowPreview(true)}
        className="rounded-lg bg-[#263d3c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#38514f]"
      >
        View / Print Laboratory Request
      </button>

      {showPreview &&
        createPortal(
          <div
            id="cura-laboratory-print-portal"
            role="dialog"
            aria-modal="true"
            aria-label={`Laboratory Request #${labRequest.id} Print Preview`}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4"
          >
            <div className="cura-laboratory-modal max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
              <div className="cura-laboratory-controls mb-5 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-lg bg-[#18a999] px-4 py-2 text-sm font-bold text-white"
                >
                  Print Laboratory Request
                </button>
              </div>

              <div
                id="cura-laboratory-print"
                className="bg-white p-6 text-black"
              >
                <header className="border-b-2 border-black pb-5 text-center">
                  <h1 className="text-2xl font-bold">CURA Healthcare System</h1>
                  <p className="mt-1 text-sm font-semibold tracking-wide">
                    LABORATORY &amp; DIAGNOSTIC REQUEST
                  </p>
                  <p className="mt-2 text-xs font-bold">
                    TEST DOCUMENT — NOT VALID FOR LABORATORY PROCESSING
                  </p>
                </header>

                <section className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  <div>
                    <p className="font-bold">Patient Name</p>
                    <p className="mt-1 break-words">{nameFromPatient(patient)}</p>
                  </div>
                  <div>
                    <p className="font-bold">Patient Number</p>
                    <p className="mt-1 break-words">
                      {patient?.patient_number || "Unavailable"}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold">Laboratory Request ID</p>
                    <p className="mt-1">{labRequest.id}</p>
                  </div>
                  <div>
                    <p className="font-bold">Date Issued</p>
                    <p className="mt-1">{formatIssueDate(labRequest.issued_at)}</p>
                  </div>
                </section>

                {diagnosis && (
                  <section className="mt-6 border-t border-gray-300 pt-4 text-sm">
                    <h2 className="font-bold">Recorded Diagnosis</h2>
                    <p className="mt-1 whitespace-pre-wrap break-words">{diagnosis}</p>
                  </section>
                )}

                <section className="mt-6 border-t border-gray-300 pt-4">
                  <h2 className="text-lg font-bold">Requested Examinations</h2>
                  {items.length === 0 ? (
                    <p className="mt-3 text-sm">Examination details unavailable.</p>
                  ) : (
                    <table className="mt-3 w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b-2 border-gray-400">
                          <th className="w-10 py-2 pr-2">#</th>
                          <th className="py-2 pr-3">Examination</th>
                          <th className="w-40 py-2">Category</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr
                            key={item.id ?? index}
                            className="cura-laboratory-print-item border-b border-gray-200"
                          >
                            <td className="py-2 pr-2 align-top">{index + 1}</td>
                            <td className="py-2 pr-3 align-top break-words">
                              {item.test_name || "Examination name unavailable"}
                              {item.notes && (
                                <p className="mt-1 whitespace-pre-wrap text-xs">
                                  Notes: {item.notes}
                                </p>
                              )}
                            </td>
                            <td className="py-2 align-top break-words">
                              {item.is_custom ? "Other (Specify)" : item.category || "Uncategorized"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </section>

                <section className="mt-6 grid gap-5 border-t border-gray-300 pt-4 text-sm">
                  <div>
                    <h2 className="font-bold">Clinical Indication</h2>
                    <p className="mt-1 whitespace-pre-wrap break-words">
                      {labRequest.clinical_indication || "Not recorded"}
                    </p>
                  </div>
                  <div>
                    <h2 className="font-bold">Laboratory Instructions</h2>
                    <p className="mt-1 whitespace-pre-wrap break-words">
                      {labRequest.instructions || "None recorded"}
                    </p>
                  </div>
                </section>

                <footer className="mt-10 grid grid-cols-2 gap-6 border-t border-gray-300 pt-5 text-sm">
                  <div>
                    <p className="font-bold">Requested By</p>
                    <p className="mt-1 break-words">{requestingDoctor}</p>
                  </div>
                  <div>
                    <p className="font-bold">Issued By</p>
                    <p className="mt-1 break-words">{issuingDoctor}</p>
                  </div>
                  <p className="col-span-2 text-xs">
                    Clinician credentials, facility letterhead, and authenticated
                    signature are not yet configured for this print template.
                  </p>
                </footer>
              </div>
            </div>

            <style>{`
              @media print {
                @page { size: A4; margin: 14mm; }
                html, body {
                  height: auto !important;
                  overflow: visible !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  background: white !important;
                }
                body > :not(#cura-laboratory-print-portal) {
                  display: none !important;
                }
                #cura-laboratory-print-portal {
                  position: static !important;
                  display: block !important;
                  inset: auto !important;
                  width: 100% !important;
                  height: auto !important;
                  max-height: none !important;
                  overflow: visible !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  background: white !important;
                }
                .cura-laboratory-modal {
                  position: static !important;
                  display: block !important;
                  width: 100% !important;
                  max-width: none !important;
                  height: auto !important;
                  max-height: none !important;
                  overflow: visible !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  border: 0 !important;
                  border-radius: 0 !important;
                  box-shadow: none !important;
                }
                .cura-laboratory-controls { display: none !important; }
                #cura-laboratory-print {
                  position: static !important;
                  width: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  background: white !important;
                  color: black !important;
                }
                .cura-laboratory-print-item {
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

export default DoctorLabRequestPrint;
