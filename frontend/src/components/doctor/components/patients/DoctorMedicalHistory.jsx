
import { useEffect, useState } from "react";
import {
  ClipboardList,
  Stethoscope,
  Pill,
} from "lucide-react";

import { getDoctorPatientMedicalHistory } from "../../services/doctorMedicalHistoryService";

const formatDate = (value) => {
  if (!value) return "Not recorded";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not recorded";
  }

  return date.toLocaleDateString("en-PH", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const Detail = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-xs font-semibold text-gray-500">
      {label}
    </p>

    <p className="whitespace-pre-wrap text-sm text-gray-700">
      {value || "Not recorded"}
    </p>
  </div>
);

const DoctorMedicalHistory = ({ patientId }) => {
 const [loading, setLoading] = useState(Boolean(patientId));
  const [error, setError] = useState("");
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);


useEffect(() => {
  if (!patientId) return;

  const controller = new AbortController();

  const loadHistory = async () => {
    try {

        const data = await getDoctorPatientMedicalHistory(
          patientId,
          controller.signal
        );

        if (controller.signal.aborted) return;

        if (
          String(data?.patient?.id) !== String(patientId) ||
          !Array.isArray(data?.history?.data)
        ) {
          throw new Error("Invalid medical history response.");
        }

        setRecords(data.history.data);
        setTotal(data.history.total ?? data.history.data.length);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err.status === 403 || err.status === 404
            ? "Medical history is unavailable for this patient assignment."
            : err.message || "Unable to load medical history."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadHistory();

    return () => controller.abort();
  }, [patientId]);

  if (!patientId) return null;

  return (
    <section className="mt-5 rounded-2xl border border-emerald-100 bg-white p-5">
      <div className="mb-5 flex items-center gap-3">
        <ClipboardList className="text-emerald-600" size={20} />

        <div>
          <h3 className="font-bold text-[#263d3c]">
            Medical History
          </h3>
          <p className="text-xs text-gray-500">
            Completed consultations and issued prescriptions
          </p>
        </div>
      </div>

      {loading && (
        <p role="status" className="text-sm text-gray-500">
          Loading medical history...
        </p>
      )}

      {!loading && error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && records.length === 0 && (
        <p className="rounded-lg bg-emerald-50 p-4 text-sm text-gray-600">
          No completed consultations recorded for this patient.
        </p>
      )}

      {!loading && !error && records.map((record) => (
        <article
          key={record.consultation_id}
          className="mb-4 rounded-xl border border-gray-200 p-4"
        >
          <div className="mb-4 flex items-center gap-2">
            <Stethoscope size={18} className="text-emerald-600" />

            <div>
              <h4 className="text-sm font-bold text-[#263d3c]">
                Consultation #{record.consultation_id}
              </h4>

              <p className="text-xs text-gray-500">
                {formatDate(record.completed_at)}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Detail
              label="Attending Doctor"
              value={record.doctor?.name}
            />
            <Detail
              label="Diagnosis"
              value={record.diagnosis?.name}
            />
          </div>

          <div className="mt-4 border-t pt-4">
            <h5 className="mb-3 text-sm font-bold">
              SOAP Notes
            </h5>

            <div className="grid gap-4 sm:grid-cols-2">
              <Detail
                label="Subjective"
                value={record.soap_notes?.subjective}
              />
              <Detail
                label="Objective"
                value={record.soap_notes?.objective}
              />
              <Detail
                label="Assessment"
                value={record.soap_notes?.assessment}
              />
              <Detail
                label="Plan"
                value={record.soap_notes?.plan}
              />
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <h5 className="mb-3 text-sm font-bold">
              Care Plan
            </h5>

            <div className="grid gap-4">
              <Detail
                label="Care Instructions"
                value={record.care_plan?.instructions}
              />
              <Detail
                label="Follow-up Instructions"
                value={record.care_plan?.follow_up}
              />
            </div>
          </div>

          <div className="mt-4 border-t pt-4">
            <div className="mb-3 flex items-center gap-2">
              <Pill size={17} className="text-emerald-600" />
              <h5 className="text-sm font-bold">
                Issued Prescription
              </h5>
            </div>

            {!record.prescription ? (
              <p className="text-sm text-gray-500">
                No issued prescription recorded.
              </p>
            ) : (
              <div className="space-y-3">
                <Detail
                  label="Issued By"
                  value={record.prescription.issued_by}
                />

                {(record.prescription.items || []).map(
                  (item, index) => (
                    <div
                      key={index}
                      className="rounded-lg bg-emerald-50 p-3"
                    >
                      <p className="text-sm font-bold text-emerald-900">
                        {item.medicine}
                      </p>

                      <div className="mt-2 grid gap-2 sm:grid-cols-2">
                        <Detail label="Strength" value={item.strength} />
                        <Detail label="Dosage" value={item.dosage} />
                        <Detail label="Frequency" value={item.frequency} />
                        <Detail
                          label="Duration"
                          value={
                            item.duration ||
                            (item.duration_days
                              ? `${item.duration_days} days`
                              : null)
                          }
                        />
                        <Detail
                          label="Instructions"
                          value={item.instructions}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </article>
      ))}

      {!loading && !error && total > records.length && (
        <p className="text-xs text-gray-500">
          Showing the latest {records.length} of {total} consultations.
          Older records will be available when pagination is added.
        </p>
      )}
    </section>
  );
};

export default DoctorMedicalHistory;
