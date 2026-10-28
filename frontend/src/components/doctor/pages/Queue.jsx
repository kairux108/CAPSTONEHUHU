
import {
  AlertCircle,
  ClipboardList,
  RefreshCw,
  Stethoscope,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import CuraCard from "../../common/CuraCard";
import useDoctorQueue from "../hooks/useDoctorQueue";

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const formatStatus = (status) =>
  String(status || "unknown")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatTime = (value) => {
  if (!value) return "—";

  const [hours, minutes] = String(value)
    .split(":")
    .map(Number);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return String(value);
  }

  const hour12 = hours % 12 || 12;
  const period = hours >= 12 ? "PM" : "AM";

  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
};

const statusStyles = {
  waiting: "bg-amber-50 text-amber-700",
  called: "bg-blue-50 text-blue-700",
  in_consultation: "bg-teal-50 text-teal-700",
  completed: "bg-emerald-50 text-emerald-700",
};

/*
|--------------------------------------------------------------------------
| Doctor Queue Page
|--------------------------------------------------------------------------
*/

const Queue = () => {
  const navigate = useNavigate();

  const {
    queueData,
    loading,
    error,
    page,
    setPage,
    refreshQueue,
  } = useDoctorQueue();

  const entries = queueData?.queue_entries || [];
  const stats = queueData?.stats || {};
  const pagination = queueData?.pagination || {};

  const summary = [
    {
      label: "Total Patients",
      value: stats.total ?? 0,
    },
    {
      label: "Waiting",
      value: stats.waiting ?? 0,
    },
    {
      label: "Called",
      value: stats.called ?? 0,
    },
    {
      label: "In Consultation",
      value: stats.in_consultation ?? 0,
    },
    {
      label: "Completed",
      value: stats.completed ?? 0,
    },
    {
      label: "Emergency",
      value: stats.emergency ?? 0,
    },
  ];

  return (
    <div className="doctor-queue space-y-5">

      {/* PAGE INTRODUCTION */}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#18a999]">
            Doctor Portal
          </p>

          <h2 className="mt-1 text-[22px] font-black text-[#263d3c]">
            My Patient Queue
          </h2>

          <p className="mt-2 text-[13px] text-[#78908e]">
            View patients assigned to your queue today.
          </p>

          {queueData?.date && (
            <p className="mt-1 text-xs text-[#78908e]">
              Queue date: {queueData.date}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={refreshQueue}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-[#18a999] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#138f83] disabled:opacity-60"
        >
          <RefreshCw
            size={15}
            className={loading ? "animate-spin" : ""}
          />

          Refresh Queue
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
        >
          <AlertCircle
            size={18}
            className="shrink-0 text-red-600"
          />

          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* SUMMARY CARDS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {summary.map((item) => (
          <CuraCard key={item.label}>
            <p className="text-xs font-semibold text-[#78908e]">
              {item.label}
            </p>

            <p className="mt-2 text-2xl font-black text-[#263d3c]">
              {loading && !queueData
                ? "..."
                : item.value}
            </p>
          </CuraCard>
        ))}
      </div>

      {/* QUEUE LIST */}

      <CuraCard
        title="Today's Queue"
        action={
          <span className="text-xs text-[#78908e]">
            Read-only
          </span>
        }
      >
        {loading && !queueData ? (
          <div className="py-12 text-center text-sm text-[#78908e]">
            Loading your patient queue...
          </div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-600">
            Unable to display the current queue.
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <ClipboardList
              size={32}
              className="text-[#18a999]"
            />

            <p className="text-sm font-bold text-[#38514f]">
              No patients in your queue
            </p>

            <p className="text-xs text-[#78908e]">
              Assigned patients will appear here
              after they enter today's queue.
            </p>
          </div>
        ) : (
          <>
            {/* QUEUE TABLE */}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#e1edeb] bg-[#edf7f4]">
                    {[
                      "Queue No.",
                      "Patient",
                      "Appointment",
                      "Priority",
                      "Status",
                      "Est. Wait",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-[11px] font-bold text-[#607b79]"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {entries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-[#edf3f1]"
                    >
                      {/* QUEUE NUMBER */}

                      <td className="px-4 py-4 text-xs font-extrabold text-[#18a999]">
                        {entry.queue_number || "—"}
                      </td>

                      {/* PATIENT */}

                      <td className="px-4 py-4">
                        <p className="text-xs font-bold text-[#38514f]">
                          {entry.patient?.name || "Unknown patient"}
                        </p>

                        <p className="mt-1 text-[11px] text-[#78908e]">
                          {entry.patient?.patient_number || "—"}
                        </p>
                      </td>

                      {/* APPOINTMENT */}

                      <td className="px-4 py-4 text-xs text-[#526f6c]">
                        {formatTime(
                          entry.appointment?.appointment_time
                        )}
                      </td>

                      {/* PRIORITY */}

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                            entry.priority === "emergency"
                              ? "bg-red-50 text-red-700"
                              : entry.priority === "priority"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {formatStatus(entry.priority)}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold ${
                            statusStyles[entry.status] ||
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {formatStatus(entry.status)}
                        </span>
                      </td>

                      {/* ESTIMATED WAITING TIME */}

                      <td className="px-4 py-4 text-xs text-[#526f6c]">
                        {entry.estimated_wait_minutes == null
                          ? "—"
                          : `${entry.estimated_wait_minutes} min`}
                      </td>

                      {/* OPEN CONSULTATION */}

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          disabled={
                            loading ||
                            !entry.patient ||
                            !["called", "in_consultation"].includes(entry.status)
                          }
                          onClick={() =>
                            navigate(`/doctor/consultation/${entry.id}`)
                          }
                          title={
                            ["called", "in_consultation"].includes(entry.status)
                              ? "Open this patient's consultation"
                              : "Available after the patient is called"
                          }
                          className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-[#18a999] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#138f83] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Stethoscope size={14} />
                          Open Consultation
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#e1edeb] pt-4">
              <p className="text-xs text-[#78908e]">
                Page {pagination.current_page || page} of{" "}
                {pagination.last_page || 1}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={loading || page <= 1}
                  onClick={() =>
                    setPage((current) => Math.max(1, current - 1))
                  }
                  className="rounded-lg border border-[#dceae7] px-3 py-2 text-xs text-[#526f6c] disabled:opacity-40"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={
                    loading ||
                    page >= (pagination.last_page || 1)
                  }
                  onClick={() =>
                    setPage((current) => current + 1)
                  }
                  className="rounded-lg border border-[#dceae7] px-3 py-2 text-xs text-[#526f6c] disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </CuraCard>

      {/* FOOTER NOTE */}

      <p className="text-xs text-[#78908e]">
        Queue information is read-only in this version.
        Calling patients and changing consultation status
        will be implemented with doctor-specific permissions.
      </p>

    </div>
  );
};

export default Queue;
