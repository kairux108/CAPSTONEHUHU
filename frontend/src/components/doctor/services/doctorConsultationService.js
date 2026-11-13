
import api from "../../../shared/services/api";

/**
 * CURA - Doctor Consultation Service
 *
 * Retrieve saved consultation data from Laravel.
 */
export const getDoctorConsultation = (
  queueEntryId,
  signal
) => {
  return api(
    `/doctor/consultations/${encodeURIComponent(queueEntryId)}`,
    {
      method: "GET",
      signal,
    }
  );
};

/**
 * CURA - Save Doctor Consultation Draft
 *
 * Saves SOAP notes, diagnosis information,
 * care instructions, and prescription drafts.
 *
 * Does not complete the consultation,
 * change queue status, or issue prescriptions.
 */
export const saveDoctorConsultationDraft = (
  queueEntryId,
  payload
) => {
  return api(
    `/doctor/consultations/${encodeURIComponent(queueEntryId)}/draft`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
};

/**
 * CURA - Start Doctor Consultation
 *
 * Changes the patient queue status:
 * "called" -> "in_consultation".
 *
 * Records the consultation start timestamp.
 *
 * Does not finalize the consultation
 * or issue prescriptions.
 */
export const startDoctorConsultation = (
  queueEntryId
) => {
  return api(
    `/doctor/consultations/${encodeURIComponent(queueEntryId)}/start`,
    {
      method: "POST",
    }
  );
};

/**
 * CURA - Complete Doctor Consultation
 *
 * Finalizes a consultation with complete
 * SOAP notes and a reviewed diagnosis.
 *
 * Changes both records:
 * Consultation: "draft" -> "completed"
 * Queue: "in_consultation" -> "completed"
 *
 * Both updates are handled within the
 * same Laravel database transaction.
 *
 * Does not issue prescriptions.
 */
export const completeDoctorConsultation = (
  queueEntryId
) => {
  return api(
    `/doctor/consultations/${encodeURIComponent(queueEntryId)}/complete`,
    {
      method: "POST",
      body: JSON.stringify({
        confirm_completion: true,
      }),
    }
  );
};

/**
 * CURA - Issue Digital Prescription
 *
 * The assigned doctor issues a saved prescription
 * after completing the consultation.
 *
 * Laravel verifies:
 * - Assigned doctor
 * - Completed consultation
 * - Existing prescription draft
 * - At least one medicine
 * - No previous issuance
 */
export const issueDoctorPrescription = (
  queueEntryId
) => {
  return api(
    `/doctor/consultations/${encodeURIComponent(queueEntryId)}/prescription/issue`,
    {
      method: "POST",
      body: JSON.stringify({
        confirm_issue: true,
      }),
    }
  );
};

/**
 * CURA - Get Laboratory Test Catalog
 *
 * Retrieves active laboratory and diagnostic
 * examinations grouped by category.
 */
export const getDoctorLabTestCatalog = (signal) => {
  return api("/doctor/lab-tests", {
    method: "GET",
    signal,
  });
};

/**
 * CURA - Create Laboratory Request Draft
 *
 * Supports multiple catalog examinations
 * and custom examinations (Other - Specify).
 */
export const createDoctorLabRequestDraft = (
  queueEntryId,
  payload
) => {
  return api(
    `/doctor/consultations/${encodeURIComponent(queueEntryId)}/lab-requests/draft`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
};

/**
 * CURA - Update Laboratory Request Draft
 *
 * Updates an existing draft without creating
 * another laboratory request.
 *
 * The payload must contain all examinations
 * the doctor wants to retain.
 */
export const updateDoctorLabRequestDraft = (
  queueEntryId,
  labRequestId,
  payload
) => {
  return api(
    `/doctor/consultations/${encodeURIComponent(queueEntryId)}/lab-requests/${encodeURIComponent(labRequestId)}/draft`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    }
  );
};

/**
 * CURA - Issue Laboratory Request
 *
 * Requires a completed consultation and
 * explicit doctor confirmation.
 *
 * Issued requests cannot be edited.
 */
export const issueDoctorLabRequest = (
  queueEntryId,
  labRequestId
) => {
  return api(
    `/doctor/consultations/${encodeURIComponent(queueEntryId)}/lab-requests/${encodeURIComponent(labRequestId)}/issue`,
    {
      method: "POST",
      body: JSON.stringify({
        confirm_issue: true,
      }),
    }
  );
};

/**
 * CURA - Retrieve Doctor Laboratory Requests
 *
 * Loads all laboratory requests associated with
 * the selected consultation.
 *
 * Includes:
 * - Draft laboratory requests
 * - Issued laboratory requests
 * - Catalog examinations
 * - Custom examinations (Other - Specify)
 *
 * Laravel verifies doctor authorization.
 */
export const getDoctorLabRequests = (
  queueEntryId,
  signal
) => {
  return api(
    `/doctor/consultations/${encodeURIComponent(queueEntryId)}/lab-requests`,
    {
      method: "GET",
      signal,
    }
  );
};
