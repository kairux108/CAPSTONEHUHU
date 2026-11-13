
import { useState } from "react";
import { issueDoctorPrescription } from "../../services/doctorConsultationService";
import DoctorPrescriptionPrint from "./DoctorPrescriptionPrint";

const DoctorPrescriptionIssuance = ({
 consultation,
  queueEntryId,
  onIssued,
  patient,
}) => {
  const [issuing, setIssuing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const prescription = consultation?.prescription;
  const items = prescription?.items ?? [];

  const isCompleted = consultation?.status === "completed";
  const isIssued = prescription?.status === "issued";

  const canIssue =
    isCompleted &&
    prescription?.status === "draft" &&
    Array.isArray(items) &&
    items.length > 0 &&
    !issuing;

  const handleIssue = async () => {
    if (!canIssue) return;

    const confirmed = window.confirm(
      "Issue this digital prescription?\n\n" +
      "Please verify all medication details before continuing.\n\n" +
      "Issuance is final and cannot be repeated."
    );

    if (!confirmed) return;

    setIssuing(true);
    setError("");
    setSuccess("");

    try {
      const response = await issueDoctorPrescription(queueEntryId);
      const issuedPrescription = response?.prescription;

      if (
        issuedPrescription?.status !== "issued" ||
        String(issuedPrescription?.id) !== String(prescription.id) ||
        !issuedPrescription?.issued_at
      ) {
        throw new Error(
          "The server did not confirm prescription issuance."
        );
      }

      onIssued(issuedPrescription);

      setSuccess("Digital prescription issued successfully.");
    } catch (err) {
      const validationError = err?.errors
        ? Object.values(err.errors).flat().find(Boolean)
        : null;

      setError(
        validationError ||
        err.message ||
        "Unable to issue prescription."
      );
    } finally {
      setIssuing(false);
    }
  };

  // Issuance is available only after consultation completion.
  if (!isCompleted) return null;

  return (
    <div className="rounded-2xl border border-[#dceae7] bg-white p-5">
      <h3 className="text-base font-bold text-[#263d3c]">
        Digital Prescription
      </h3>


{isIssued ? (
  <>
    <div className="mt-3 rounded-xl bg-emerald-50 p-4">
      <p className="font-bold text-emerald-800">
        Prescription Issued
      </p>

      <p className="mt-2 text-sm text-emerald-800">
        Issued by:{" "}
        {prescription.issuing_doctor?.name ||
          `Doctor #${prescription.issued_by}`}
      </p>

      <p className="mt-1 text-sm text-emerald-800">
        Issued at:{" "}
        {prescription.issued_at
          ? new Date(prescription.issued_at).toLocaleString()
          : "Unavailable"}
      </p>
    </div>

    <DoctorPrescriptionPrint
      patient={patient}
      consultation={consultation}
      prescription={prescription}
    />
  </>
) : !prescription ? (

        <p className="mt-3 text-sm text-amber-700">
          No prescription draft was created for this consultation.
        </p>
      ) : !Array.isArray(items) || items.length === 0 ? (
        <p className="mt-3 text-sm text-amber-700">
          This prescription has no medication items and cannot be issued.
        </p>
      ) : prescription.status === "draft" ? (
        <div className="mt-4">
          <p className="mb-3 text-sm text-[#607b79]">
            Prescription draft is ready for the doctor's final review.
            Medications: {items.length}
          </p>

          <button
            type="button"
            onClick={handleIssue}
            disabled={!canIssue}
            className="rounded-xl bg-[#18a999] px-5 py-3 text-sm font-bold text-white hover:bg-[#138f83] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {issuing ? "Issuing Prescription..." : "Issue Prescription"}
          </button>
        </div>
      ) : (
        <p className="mt-3 text-sm text-[#607b79]">
          Prescription status: {prescription.status}
        </p>
      )}

      {success && (
        <p role="status" className="mt-3 text-sm text-emerald-700">
          {success}
        </p>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
};

export default DoctorPrescriptionIssuance;
