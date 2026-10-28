
import {
  Activity,
  RefreshCw,
} from "lucide-react";

import useDoctorDashboard from "../hooks/useDoctorDashboard";

import DashboardStats from "../components/DashboardStats";
import NextPatientCard from "../components/NextPatientCard";
import AppointmentList from "../components/AppointmentList";
import CurrentConsultationCard from "../components/CurrentConsultationCard";

/*
|--------------------------------------------------------------------------
| Formatting Helpers
|--------------------------------------------------------------------------
*/

const getPatientName = (patient) => {
  if (!patient) return "Patient unavailable";

  return (
    [
      patient.first_name,
      patient.middle_name,
      patient.last_name,
    ]
      .filter(Boolean)
      .join(" ") ||
    patient.patient_number ||
    "Patient unavailable"
  );
};

const formatTime = (value) => {
  if (!value) return "Not set";

  const match = String(value).match(
    /^(\d{1,2}):(\d{2})/
  );

  if (!match) return "Not set";

  const hour = Number(match[1]);

  if (hour < 0 || hour > 23) {
    return "Not set";
  }

  const minute = match[2];

  return `${hour % 12 || 12}:${minute} ${
    hour >= 12 ? "PM" : "AM"
  }`;
};

const formatRecordedTime = (value) => {
  if (!value) return "Not recorded";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not recorded";
  }

  return date.toLocaleTimeString("en-PH", {
    timeZone: "Asia/Manila",
    hour: "numeric",
    minute: "2-digit",
  });
};

/*
|--------------------------------------------------------------------------
| Doctor Dashboard Page
|--------------------------------------------------------------------------
*/

const Dashboard = () => {
  const {
    dashboard,
    loading,
    error,
    refreshDashboard,
  } = useDoctorDashboard();

  /*
  |--------------------------------------------------------------------------
  | Dashboard Data
  |--------------------------------------------------------------------------
  */

  const summary = dashboard?.summary || {};

  const appointments = Array.isArray(
    dashboard?.appointments
  )
    ? dashboard.appointments
    : [];

  const queueEntries = Array.isArray(
    dashboard?.queue_entries
  )
    ? dashboard.queue_entries
    : [];

  const nextPatient = dashboard?.next_patient;

  const currentPatient = dashboard?.current_patient;

  /*
  |--------------------------------------------------------------------------
  | Format Appointments
  |--------------------------------------------------------------------------
  */

  const appointmentRows = appointments.map(
    (appointment) => ({
      id: appointment.id,

      appointmentNumber:
        appointment.appointment_number,

      patientName: getPatientName(
        appointment.patient
      ),

      time: formatTime(
        appointment.appointment_time
      ),

      reason: appointment.reason_for_visit,

      status: appointment.status,
    })
  );

  /*
  |--------------------------------------------------------------------------
  | Calculate Average Consultation Duration
  |--------------------------------------------------------------------------
  */

  const durations = queueEntries
    .filter(
      (entry) =>
        entry.status === "completed" &&
        entry.consultation_started_at &&
        entry.completed_at
    )
    .map((entry) => {
      const start = Date.parse(
        entry.consultation_started_at
      );

      const end = Date.parse(
        entry.completed_at
      );

      return (end - start) / 60000;
    })
    .filter(
      (minutes) =>
        Number.isFinite(minutes) &&
        minutes > 0
    );

  const averageDuration =
    durations.length > 0
      ? Math.round(
          durations.reduce(
            (sum, value) => sum + value,
            0
          ) / durations.length
        )
      : null;

  /*
  |--------------------------------------------------------------------------
  | Queue Progress
  |--------------------------------------------------------------------------
  */

  const completed = Number(
    summary.completed ?? 0
  );

  const total = queueEntries.length;

  const completionPercent =
    total > 0
      ? Math.min(
          100,
          Math.round((completed / total) * 100)
        )
      : 0;

  /*
  |--------------------------------------------------------------------------
  | Dashboard Layout
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-5">

      {/* PAGE HEADER */}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#18a999]">
            Doctor Workspace
          </p>

          <h2 className="mt-1 text-xl font-black text-[#263d3c]">
            {dashboard?.doctor?.name
              ? `Welcome, ${dashboard.doctor.name}`
              : "My Dashboard"}
          </h2>

          <p className="mt-1 text-xs text-[#78908e]">
            Your daily appointments and
            consultation overview
            {dashboard?.date
              ? ` — ${dashboard.date}`
              : ""}
          </p>
        </div>

        <button
          type="button"
          onClick={refreshDashboard}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-[#18a999] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#138f83] disabled:opacity-60"
        >
          <RefreshCw
            size={15}
            className={
              loading ? "animate-spin" : ""
            }
          />

          Refresh
        </button>
      </div>

      {/* LOADING */}

      {loading && (
        <div className="rounded-2xl bg-white/75 p-8 text-center text-sm text-[#607b79]">
          Loading doctor dashboard...
        </div>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-5"
        >
          <p className="text-sm font-bold text-red-700">
            Unable to load dashboard
          </p>

          <p className="mt-2 text-xs text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={refreshDashboard}
            className="mt-4 rounded-lg bg-[#18a999] px-4 py-2 text-xs font-bold text-white"
          >
            Try Again
          </button>
        </div>
      )}

      {/* DASHBOARD CONTENT */}

      {!loading && !error && dashboard && (
        <>
          {/* SUMMARY */}

          <DashboardStats
            summary={summary}
            averageDuration={averageDuration}
          />

          <div className="grid gap-5 xl:grid-cols-[1.35fr_0.8fr]">

            {/* LEFT COLUMN */}

            <div className="space-y-5">
              <NextPatientCard
                patientName={getPatientName(
                  nextPatient?.appointment?.patient
                )}
                queueNumber={
                  nextPatient?.queue_number
                }
                appointmentTime={
                  nextPatient
                    ? formatTime(
                        nextPatient.appointment
                          ?.appointment_time
                      )
                    : null
                }
                status={nextPatient?.status}
              />

              <AppointmentList
                appointments={appointmentRows}
              />
            </div>

            {/* RIGHT COLUMN */}

            <div className="space-y-5">
              <section className="rounded-[22px] border border-white/60 bg-white/75 p-5 shadow-[0_14px_32px_rgba(44,78,75,0.11)]">
                <div className="flex items-center gap-2">
                  <Activity
                    size={18}
                    className="text-[#18a999]"
                  />

                  <h3 className="text-lg font-black text-[#263d3c]">
                    Today's Progress
                  </h3>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <p className="text-xs font-bold text-[#607b79]">
                    Completed Queue
                  </p>

                  <p className="text-xs font-black text-[#38514f]">
                    {completed} / {total}
                  </p>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#dcece8]">
                  <div
                    className="h-full rounded-full bg-[#18a999]"
                    style={{
                      width: `${completionPercent}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-xs text-[#78908e]">
                  {summary.in_consultation ?? 0} in
                  consultation,{" "}
                  {summary.called ?? 0} called,{" "}
                  {summary.waiting ?? 0} waiting.
                </p>
              </section>

              <CurrentConsultationCard
                patientName={getPatientName(
                  currentPatient?.appointment?.patient
                )}
                queueNumber={
                  currentPatient?.queue_number
                }
                startedAt={formatRecordedTime(
                  currentPatient?.consultation_started_at
                )}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
