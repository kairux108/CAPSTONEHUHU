import { useEffect, useRef, useState } from "react";

import {
  createDoctorLabRequestDraft,
  getDoctorLabRequests,
  getDoctorLabTestCatalog,
  issueDoctorLabRequest,
  updateDoctorLabRequestDraft,
} from "../../services/doctorConsultationService";

import DoctorLabRequestPrint from "./DoctorLabRequestPrint";

/**
 * CURA - Laboratory & Diagnostic Requests
 *
 * - Load the active examination catalog and existing requests
 * - Restore the newest saved draft for editing
 * - Create a laboratory request draft, or update that SAME draft
 * - Issue a saved draft only after consultation completion
 * - Show issued requests as read-only with a printable preview
 *
 * The parent component's Consultation Save Draft remains independent.
 */

const getErrorMessage = (error) => {
  const errors = error?.response?.data?.errors ?? error?.errors;
  const firstFieldError = errors && Object.values(errors).flat().find(Boolean);

  return (
    firstFieldError ||
    error?.response?.data?.message ||
    error?.message ||
    "The laboratory request could not be saved."
  );
};

const extractSavedRequestId = (response) => {
  const record =
    response?.lab_request ??
    response?.data?.lab_request ??
    response?.request ??
    response;

  return record?.id == null ? null : Number(record.id);
};

const DoctorLabRequestEditor = ({ queueEntryId, consultation, patient }) => {
  const consultationStatus = consultation?.status ?? null;
  const [categories, setCategories] = useState([]);
  const [selectedTestIds, setSelectedTestIds] = useState([]);
  const [clinicalIndication, setClinicalIndication] = useState("");
  const [instructions, setInstructions] = useState("");
  const [otherEnabled, setOtherEnabled] = useState(false);
  const [customTestText, setCustomTestText] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedRequestResult, setSavedRequestResult] = useState({
    queueEntryId: null,
    labRequests: [],
    error: "",
  });
  const [editingDraftId, setEditingDraftId] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [saveNotice, setSaveNotice] = useState(null);
  const [requiresReload, setRequiresReload] = useState(false);
  const saveInProgress = useRef(false);
  const issueInProgress = useRef(false);

  const isCurrentRequest = savedRequestResult.queueEntryId === queueEntryId;
  const savedLabRequests = isCurrentRequest
    ? savedRequestResult.labRequests
    : [];
  const requestsLoading = Boolean(queueEntryId) && !isCurrentRequest;
  const requestsError = isCurrentRequest ? savedRequestResult.error : "";
  const formDisabled =
    !queueEntryId ||
    loading ||
    requestsLoading ||
    Boolean(requestsError) ||
    saving ||
    issuing;

  // Fetch catalog examinations. Promise callbacks (not the effect body)
  // update React state, which is compatible with the project's Hooks lint rule.
  useEffect(() => {
    const controller = new AbortController();

    getDoctorLabTestCatalog(controller.signal)
      .then((response) => {
        if (controller.signal.aborted) return;
        if (!Array.isArray(response?.categories)) {
          throw new Error("Invalid laboratory catalog response.");
        }
        setCategories(response.categories);
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(getErrorMessage(err));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  // GET includes both draft and issued lab requests. Restore only a draft;
  // issued requests must never be editable through the draft endpoint.
  useEffect(() => {
    if (!queueEntryId) return;

    const controller = new AbortController();

    getDoctorLabRequests(queueEntryId, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) return;
        if (!Array.isArray(response?.lab_requests)) {
          throw new Error("Invalid laboratory request response.");
        }

        const records = response.lab_requests;
        const draft = records.find((record) => record.status === "draft");

        setSavedRequestResult({
          queueEntryId,
          labRequests: records,
          error: "",
        });

        if (draft) {
          const items = Array.isArray(draft.items) ? draft.items : [];
          const catalogIds = items
            .filter((item) => item.lab_test_catalog_id != null && !item.is_custom)
            .map((item) => Number(item.lab_test_catalog_id));
          const names = items
            .filter((item) => item.is_custom || item.lab_test_catalog_id == null)
            .map((item) => String(item.test_name ?? "").trim())
            .filter(Boolean);

          setEditingDraftId(Number(draft.id));
          setSelectedTestIds(catalogIds);
          setOtherEnabled(names.length > 0);
          setCustomTestText(names.join("\n"));
          setClinicalIndication(draft.clinical_indication ?? "");
          setInstructions(draft.instructions ?? "");
        } else {
          setEditingDraftId(null);
          setSelectedTestIds([]);
          setOtherEnabled(false);
          setCustomTestText("");
          setClinicalIndication("");
          setInstructions("");
        }
        setDirty(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setSavedRequestResult({
          queueEntryId,
          labRequests: [],
          error: getErrorMessage(err),
        });
      });

    return () => controller.abort();
  }, [queueEntryId]);

  const onEdit = () => {
    setDirty(true);
    setSaveNotice(null);
  };

  const toggleTest = (testId) => {
    setSelectedTestIds((previous) =>
      previous.includes(testId)
        ? previous.filter((id) => id !== testId)
        : [...previous, testId]
    );
    onEdit();
  };

  const customTests = otherEnabled
    ? customTestText
        .split(/\r?\n/)
        .map((name) => name.trim())
        .filter(Boolean)
    : [];

  const totalSelected = selectedTestIds.length + customTests.length;
  const activeCatalogIds = new Set(
    categories.flatMap((group) =>
      (group.tests ?? []).map((test) => Number(test.id))
    )
  );
  const unavailableTestIds = selectedTestIds.filter(
    (id) => !activeCatalogIds.has(id)
  );
  const draftCount = savedLabRequests.filter(
    (request) => request.status === "draft"
  ).length;
  const issuedRequests = savedLabRequests.filter(
    (request) => request.status === "issued"
  );
  const issuedCount = issuedRequests.length;
  const cannotSave = formDisabled || Boolean(error) || requiresReload;
  const cannotIssue =
    cannotSave ||
    !editingDraftId ||
    dirty ||
    consultationStatus !== "completed" ||
    Boolean(saveNotice?.type === "error");

  const handleSave = async () => {
    // The ref also blocks a double-click before React has re-rendered.
    if (saveInProgress.current || cannotSave) return;

    if (totalSelected === 0) {
      setSaveNotice({
        type: "error",
        text: "Select at least one catalog examination or custom examination.",
      });
      return;
    }

    if (customTests.length > 20 || customTests.some((name) => name.length > 255)) {
      setSaveNotice({
        type: "error",
        text: "Use no more than 20 custom examinations, with 255 characters or fewer per name.",
      });
      return;
    }

    const normalizedNames = customTests.map((name) => name.toLowerCase());
    if (new Set(normalizedNames).size !== normalizedNames.length) {
      setSaveNotice({
        type: "error",
        text: "Remove duplicate custom examinations (names are case-insensitive).",
      });
      return;
    }

    if (unavailableTestIds.length > 0) {
      setSaveNotice({
        type: "error",
        text: "Remove unavailable catalog examinations before saving.",
      });
      return;
    }

    const payload = {
      catalog_test_ids: selectedTestIds,
      custom_tests: customTests,
      clinical_indication: clinicalIndication.trim() || null,
      instructions: instructions.trim() || null,
    };

    saveInProgress.current = true;
    setSaving(true);
    setSaveNotice(null);

    let mutationStarted = false;
    try {
      mutationStarted = true;
      const response = editingDraftId
        ? await updateDoctorLabRequestDraft(queueEntryId, editingDraftId, payload)
        : await createDoctorLabRequestDraft(queueEntryId, payload);

      const returnedId = extractSavedRequestId(response);
      const refreshed = await getDoctorLabRequests(queueEntryId);
      if (!Array.isArray(refreshed?.lab_requests)) {
        throw new Error("Unable to verify saved laboratory requests.");
      }

      const records = refreshed.lab_requests;
      const previouslyKnownIds = new Set(savedLabRequests.map((r) => Number(r.id)));
      const confirmedDraft = records.find((request) => {
        if (request.status !== "draft") return false;
        if (editingDraftId) return Number(request.id) === Number(editingDraftId);
        if (returnedId != null) return Number(request.id) === returnedId;
        return !previouslyKnownIds.has(Number(request.id));
      });

      if (!confirmedDraft) {
        throw new Error(
          "The request response could not be verified. Refresh before trying to save again."
        );
      }

      setSavedRequestResult({
        queueEntryId,
        labRequests: records,
        error: "",
      });
      setEditingDraftId(Number(confirmedDraft.id));
      setDirty(false);
      setSaveNotice({
        type: "success",
        text: `Laboratory draft #${confirmedDraft.id} saved and verified.`,
      });
    } catch (err) {
      // The server may have committed a POST even if the connection was lost.
      // Require a reload rather than risk a duplicate laboratory request.
      const httpStatus = Number(
        err?.response?.status ?? err?.status ?? err?.statusCode
      );
      const definitelyRejected = httpStatus === 400 || httpStatus === 422;
      const uncertainSave = mutationStarted && !definitelyRejected;
      if (uncertainSave) setRequiresReload(true);
      setSaveNotice({
        type: "error",
        text: uncertainSave
          ? `${getErrorMessage(err)} Refresh this page and check the saved requests before trying again.`
          : getErrorMessage(err),
      });
    } finally {
      saveInProgress.current = false;
      setSaving(false);
    }
  };

  // Server remains authoritative: it must validate ownership, draft status,
  // confirmation, and consultation completion. This UI check is only a guard.
  const handleIssue = async () => {
    if (issueInProgress.current || cannotIssue) return;

    const draftId = editingDraftId;
    const confirmed = window.confirm(
      `Issue laboratory request #${draftId}? This finalizes the request and it can no longer be edited.`
    );
    if (!confirmed) return;

    issueInProgress.current = true;
    setIssuing(true);
    setSaveNotice(null);

    try {
      await issueDoctorLabRequest(queueEntryId, draftId);
      const refreshed = await getDoctorLabRequests(queueEntryId);
      if (!Array.isArray(refreshed?.lab_requests)) {
        throw new Error("Unable to verify issued laboratory requests.");
      }
      const records = refreshed.lab_requests;
      const issued = records.find(
        (record) =>
          Number(record.id) === Number(draftId) && record.status === "issued"
      );
      if (!issued || !issued.issued_at || issued.issued_by == null) {
        throw new Error(
          "The issued request could not be verified. Refresh this page before trying another action."
        );
      }

      setSavedRequestResult({ queueEntryId, labRequests: records, error: "" });
      setEditingDraftId(null);
      setSelectedTestIds([]);
      setOtherEnabled(false);
      setCustomTestText("");
      setClinicalIndication("");
      setInstructions("");
      setDirty(false);
      setSaveNotice({
        type: "success",
        text: `Laboratory request #${draftId} issued and verified. It is now read-only.`,
      });
    } catch (err) {
      // The issue operation could have succeeded despite a lost response.
      // Do not permit another issue/save until the page is reloaded.
      setRequiresReload(true);
      setSaveNotice({
        type: "error",
        text: `${getErrorMessage(err)} Refresh this page to verify the request status before taking another action.`,
      });
    } finally {
      issueInProgress.current = false;
      setIssuing(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#dceae7] bg-white p-5">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-[#263d3c]">
          Laboratory &amp; Diagnostic Requests
        </h3>
        <p className="mt-1 text-sm text-[#607b79]">
          Select laboratory examinations or specify additional tests requested
          for the patient.
        </p>
      </div>

      <div className="mb-4 rounded-xl bg-[#f3faf8] p-3">
        {!queueEntryId ? (
          <p className="text-sm text-[#607b79]">
            Select a consultation to check saved laboratory requests.
          </p>
        ) : requestsLoading ? (
          <p role="status" className="text-sm text-[#607b79]">
            Checking saved laboratory requests...
          </p>
        ) : requestsError ? (
          <p role="alert" className="text-sm text-red-700">
            {requestsError}
          </p>
        ) : (
          <div className="space-y-1 text-sm text-[#263d3c]">
            <p className="font-medium">
              Existing laboratory requests: {savedLabRequests.length}
            </p>
            <p className="text-xs text-[#607b79]">
              Drafts: {draftCount} | Issued: {issuedCount}
              {editingDraftId ? ` | Editing draft #${editingDraftId}` : ""}
            </p>
            {draftCount > 1 && (
              <p className="text-xs text-amber-700">
                Multiple drafts exist. This form edits the latest draft only.
              </p>
            )}
          </div>
        )}
      </div>

      {loading && (
        <p role="status" className="text-sm text-[#607b79]">
          Loading laboratory examinations...
        </p>
      )}

      {error && (
        <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          {categories.length === 0 && (
            <p className="mb-4 text-sm text-amber-700">
              No active laboratory examinations are available.
            </p>
          )}

          <fieldset disabled={formDisabled} className="min-w-0">
            <div className="grid gap-4 lg:grid-cols-2">
              {categories.map((category) => (
                <fieldset
                  key={category.name}
                  className="rounded-xl border border-[#dceae7] p-4"
                >
                  <legend className="px-2 text-sm font-bold text-[#263d3c]">
                    {category.name}
                  </legend>
                  <div className="space-y-3">
                    {(category.tests ?? []).map((test) => {
                      const testId = Number(test.id);
                      return (
                        <label
                          key={testId}
                          className="flex cursor-pointer items-start gap-3 text-sm text-[#38514f]"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTestIds.includes(testId)}
                            onChange={() => toggleTest(testId)}
                            className="mt-1 accent-[#18a999]"
                          />
                          <span>{test.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-[#dceae7] p-4">
              <label className="flex items-center gap-3 text-sm font-bold text-[#263d3c]">
                <input
                  type="checkbox"
                  checked={otherEnabled}
                  onChange={(event) => {
                    setOtherEnabled(event.target.checked);
                    onEdit();
                  }}
                  className="accent-[#18a999]"
                />
                Other (Specify)
              </label>
              {otherEnabled && (
                <div className="mt-3">
                  <label
                    htmlFor="cura-custom-lab-tests"
                    className="mb-2 block text-sm text-[#607b79]"
                  >
                    Enter one examination per line.
                  </label>
                  <textarea
                    id="cura-custom-lab-tests"
                    value={customTestText}
                    onChange={(event) => {
                      setCustomTestText(event.target.value);
                      onEdit();
                    }}
                    rows={4}
                    placeholder={
                      "Additional examination 1\nAdditional examination 2"
                    }
                    className="w-full rounded-xl border border-[#dceae7] p-3 text-sm outline-none focus:border-[#18a999]"
                  />
                </div>
              )}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div>
                <label
                  htmlFor="cura-lab-indication"
                  className="mb-2 block text-sm font-bold text-[#263d3c]"
                >
                  Clinical Indication
                </label>
                <textarea
                  id="cura-lab-indication"
                  value={clinicalIndication}
                  onChange={(event) => {
                    setClinicalIndication(event.target.value);
                    onEdit();
                  }}
                  rows={3}
                  maxLength={2000}
                  placeholder="Reason for requesting these examinations..."
                  className="w-full rounded-xl border border-[#dceae7] p-3 text-sm outline-none focus:border-[#18a999]"
                />
              </div>
              <div>
                <label
                  htmlFor="cura-lab-instructions"
                  className="mb-2 block text-sm font-bold text-[#263d3c]"
                >
                  Laboratory Instructions
                </label>
                <textarea
                  id="cura-lab-instructions"
                  value={instructions}
                  onChange={(event) => {
                    setInstructions(event.target.value);
                    onEdit();
                  }}
                  rows={3}
                  maxLength={2000}
                  placeholder="Additional instructions for the laboratory..."
                  className="w-full rounded-xl border border-[#dceae7] p-3 text-sm outline-none focus:border-[#18a999]"
                />
              </div>
            </div>
          </fieldset>

          {unavailableTestIds.length > 0 && (
            <div role="alert" className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
              This saved draft includes {unavailableTestIds.length} inactive or
              missing catalog examination(s). Remove them before updating.
              <button
                type="button"
                disabled={formDisabled}
                onClick={() => {
                  setSelectedTestIds((previous) =>
                    previous.filter((id) => activeCatalogIds.has(id))
                  );
                  onEdit();
                }}
                className="ml-2 font-semibold underline disabled:opacity-50"
              >
                Remove unavailable selections
              </button>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#f3faf8] p-4">
            <div>
              <p className="text-sm font-bold text-[#263d3c]">
                Selected examinations: {totalSelected}
              </p>
              <p className="mt-1 text-xs text-[#607b79]">
                Catalog: {selectedTestIds.length} | Custom: {customTests.length}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                editingDraftId && !dirty
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {saving
                ? "Saving..."
                : editingDraftId && !dirty
                  ? `Draft #${editingDraftId} saved`
                  : "Not Saved"}
            </span>
          </div>

          {saveNotice && (
            <p
              role={saveNotice.type === "error" ? "alert" : "status"}
              className={`mt-4 rounded-xl p-3 text-sm ${
                saveNotice.type === "error"
                  ? "bg-red-50 text-red-700"
                  : "bg-emerald-50 text-emerald-800"
              }`}
            >
              {saveNotice.text}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
            {requiresReload && (
              <span className="text-sm text-amber-700">
                Refresh to verify the last save or issue before trying again.
              </span>
            )}
            <button
              type="button"
              disabled={cannotSave}
              onClick={handleSave}
              className="rounded-xl bg-[#18a999] px-5 py-3 text-sm font-semibold text-white hover:bg-[#148d80] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving Laboratory Draft..."
                : editingDraftId
                  ? "Update Laboratory Draft"
                  : "Save Laboratory Draft"}
            </button>
            {editingDraftId && (
              <button
                type="button"
                disabled={cannotIssue}
                onClick={handleIssue}
                className="rounded-xl bg-[#263d3c] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1c302f] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {issuing ? "Issuing Laboratory Request..." : "Issue Laboratory Request"}
              </button>
            )}
          </div>
          {editingDraftId && consultationStatus !== "completed" && (
            <p className="mt-2 text-right text-xs text-amber-700">
              Complete the consultation before issuing this laboratory request.
            </p>
          )}
          {editingDraftId && dirty && consultationStatus === "completed" && (
            <p className="mt-2 text-right text-xs text-amber-700">
              Save your laboratory changes before issuing the request.
            </p>
          )}
          <p className="mt-2 text-right text-xs text-[#607b79]">
            Laboratory drafts are independent from consultation drafts.
            Issued requests are final and available to print below.
          </p>
          {issuedRequests.length > 0 && (
            <section className="mt-5 rounded-xl border border-[#dceae7] p-4">
              <h4 className="mb-3 text-sm font-bold text-[#263d3c]">
                Issued Laboratory Requests (read-only)
              </h4>
              <div className="space-y-3">
                {issuedRequests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-lg bg-[#f3faf8] p-3 text-sm text-[#263d3c]"
                  >
                    <p className="font-semibold">Request #{request.id} — Issued</p>
                    <p className="mt-1 text-xs text-[#607b79]">
                      {Array.isArray(request.items) ? request.items.length : 0} examination(s)
                      {request.issued_at
                        ? ` | Issued: ${new Date(request.issued_at).toLocaleString()}`
                        : ""}
                    </p>
                    <ul className="mt-2 list-inside list-disc text-xs text-[#38514f]">
                      {(request.items ?? []).map((item) => (
                        <li key={item.id}>{item.test_name}</li>
                      ))}
                    </ul>
                    <DoctorLabRequestPrint
                      patient={patient}
                      consultation={consultation}
                      labRequest={request}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

// Remount the editor on queue change so one patient's unsaved selections can
// never be displayed as another patient's laboratory request.
const DoctorLabRequestForm = ({ queueEntryId, consultation, patient }) => (
  <DoctorLabRequestEditor
    key={queueEntryId ?? "no-consultation"}
    queueEntryId={queueEntryId}
    consultation={consultation}
    patient={patient}
  />
);

export default DoctorLabRequestForm;
