import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Plus,
  RefreshCw,
  Stethoscope,
  UsersRound,
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import { useAuth } from "../../context/AuthContext";

import NowServingCard from "./NowServingCard";
import QueueMonitor from "./QueueMonitor";

const PRIORITY_ORDER = {
  Urgent: 1,
  Priority: 2,
  Appointment: 3,
  "Walk-in": 4,
};

const initialQueue = [
  {
    id: 1,
    queueNumber: "A-001",
    patient: "Maria Santos",
    queueType: "Appointment",
    priority: "Appointment",
    time: "8:10 AM",
    reason: "General Consultation",
  },
  {
    id: 2,
    queueNumber: "W-001",
    patient: "John Dela Cruz",
    queueType: "Walk-in",
    priority: "Walk-in",
    time: "8:15 AM",
    reason: "Follow-up",
  },
  {
    id: 3,
    queueNumber: "P-001",
    patient: "Angela Reyes",
    queueType: "Walk-in",
    priority: "Priority",
    time: "8:20 AM",
    reason: "Priority consultation",
  },
  {
    id: 4,
    queueNumber: "A-002",
    patient: "Paolo Villanueva",
    queueType: "Appointment",
    priority: "Appointment",
    time: "8:30 AM",
    reason: "Medication Review",
  },
];

const QueueManagement = () => {
  const { user } = useAuth();

  const [queue, setQueue] =
    useState(initialQueue);

  const [
    nowServing,
    setNowServing,
  ] = useState(null);

  const [
    completed,
    setCompleted,
  ] = useState(8);

  const [
    doctorArrival,
    setDoctorArrival,
  ] = useState("09:30");

  const [
    averageConsultation,
    setAverageConsultation,
  ] = useState(15);

  const [
    showAddPatient,
    setShowAddPatient,
  ] = useState(false);

  const [
    queueNotice,
    setQueueNotice,
  ] = useState("");

  const sortedQueue =
    useMemo(() => {
      return [...queue].sort(
        (a, b) => {
          const priorityDifference =
            PRIORITY_ORDER[
              a.priority
            ] -
            PRIORITY_ORDER[
              b.priority
            ];

          if (
            priorityDifference !==
            0
          ) {
            return priorityDifference;
          }

          return a.id - b.id;
        }
      );
    }, [queue]);

  const calculatedQueue =
    useMemo(() => {
      const now = new Date();

      const [
        hours,
        minutes,
      ] = doctorArrival
        .split(":")
        .map(Number);

      const arrivalDate =
        new Date(now);

      arrivalDate.setHours(
        hours,
        minutes,
        0,
        0
      );

      let firstAvailableTime =
        arrivalDate > now
          ? new Date(
              arrivalDate
            )
          : new Date(now);

      if (nowServing) {
        firstAvailableTime =
          new Date(
            firstAvailableTime.getTime() +
              averageConsultation *
                60 *
                1000
          );
      }

      return sortedQueue.map(
        (patient, index) => {
          const estimatedTime =
            new Date(
              firstAvailableTime.getTime() +
                index *
                  averageConsultation *
                  60 *
                  1000
            );

          const waitingMinutes =
            Math.max(
              0,
              Math.ceil(
                (estimatedTime -
                  now) /
                  60000
              )
            );

          return {
            ...patient,

            estimatedStart:
              estimatedTime.toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute:
                    "2-digit",
                }
              ),

            waitingMinutes,
          };
        }
      );
    }, [
      sortedQueue,
      doctorArrival,
      averageConsultation,
      nowServing,
    ]);

  const urgentCount =
    queue.filter(
      (patient) =>
        patient.priority ===
        "Urgent"
    ).length;

  const servePatient = (
    patient
  ) => {
    if (nowServing) {
      setQueueNotice(
        "Complete the current consultation before serving another patient."
      );

      return;
    }

    setNowServing(patient);

    setQueue((previous) =>
      previous.filter(
        (item) =>
          item.id !==
          patient.id
      )
    );

    setQueueNotice(
      `${patient.patient} is now being served. Queue estimates were recalculated.`
    );
  };

  const callNext = () => {
    if (
      nowServing ||
      calculatedQueue.length ===
        0
    ) {
      return;
    }

    servePatient(
      calculatedQueue[0]
    );
  };

  const completeConsultation =
    () => {
      if (!nowServing) {
        return;
      }

      setCompleted(
        (previous) =>
          previous + 1
      );

      setNowServing(null);

      setQueueNotice(
        "Consultation completed. Waiting times were automatically recalculated."
      );
    };

  const addPatient = (
    form
  ) => {
    const id = Date.now();

    const urgentNumber =
      queue.filter(
        (item) =>
          item.priority ===
          "Urgent"
      ).length + 1;

    const priorityNumber =
      queue.filter(
        (item) =>
          item.priority ===
          "Priority"
      ).length + 1;

    const appointmentNumber =
      queue.filter(
        (item) =>
          item.queueType ===
          "Appointment"
      ).length + 1;

    const walkInNumber =
      queue.filter(
        (item) =>
          item.queueType ===
          "Walk-in"
      ).length + 1;

    let queueNumber = "";

    if (
      form.priority ===
      "Urgent"
    ) {
      queueNumber = `U-${String(
        urgentNumber
      ).padStart(3, "0")}`;
    } else if (
      form.priority ===
      "Priority"
    ) {
      queueNumber = `P-${String(
        priorityNumber
      ).padStart(3, "0")}`;
    } else if (
      form.queueType ===
      "Appointment"
    ) {
      queueNumber = `A-${String(
        appointmentNumber
      ).padStart(3, "0")}`;
    } else {
      queueNumber = `W-${String(
        walkInNumber
      ).padStart(3, "0")}`;
    }

    const patient = {
      id,
      queueNumber,
      patient: form.patient,
      queueType:
        form.queueType,
      priority:
        form.priority,
      reason: form.reason,
      time:
        new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
    };

    setQueue((previous) => [
      ...previous,
      patient,
    ]);

    if (
      form.priority ===
      "Urgent"
    ) {
      setQueueNotice(
        `URGENT: ${form.patient} was moved to the highest queue priority. Waiting-time estimates were recalculated.`
      );
    } else {
      setQueueNotice(
        `${form.patient} was added to the queue.`
      );
    }

    setShowAddPatient(false);
  };

  return (
    <div>
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#18a999]">
            Patient Flow
          </p>

          <h2 className="mt-1 text-[22px] font-black text-[#263d3c] dark:text-white">
            Queue Management
          </h2>

          <p className="mt-1 text-[12px] text-[#78908e]">
            Dynamic priority queue with automatic waiting-time estimation.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={callNext}
            disabled={
              Boolean(
                nowServing
              ) ||
              calculatedQueue.length ===
                0
            }
            className="
              flex
              items-center
              gap-2
              rounded-[13px]
              bg-[#18a999]
              px-5
              py-2.5
              text-[11px]
              font-bold
              text-white
              shadow-[0_9px_20px_rgba(24,169,153,0.22)]

              hover:bg-[#138f83]

              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            <UsersRound
              size={15}
            />

            Call Next
          </button>

          <button
            type="button"
            onClick={() =>
              setShowAddPatient(
                true
              )
            }
            className="
              flex
              items-center
              gap-2
              rounded-[13px]
              bg-[#edf7f4]
              px-5
              py-2.5
              text-[11px]
              font-bold
              text-[#607b79]

              hover:bg-[#dff3ee]

              dark:bg-[#203331]
              dark:text-[#91aaa7]
            "
          >
            <Plus size={15} />

            Add Patient
          </button>
        </div>
      </div>

      {/* URGENT ALERT */}

      {urgentCount > 0 && (
        <div
          className="
            mt-5
            flex
            flex-col
            gap-3
            rounded-[17px]
            border
            border-red-200
            bg-red-50/80
            px-5
            py-4

            dark:border-red-900/50
            dark:bg-red-950/20

            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-[13px] bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400">
              <AlertTriangle
                size={18}
              />
            </div>

            <div>
              <p className="text-[11px] font-extrabold text-red-700 dark:text-red-300">
                Urgent patient in
                queue
              </p>

              <p className="mt-1 text-[10px] text-red-500 dark:text-red-400">
                Urgent cases are
                moved ahead according
                to clinic-approved
                triage rules.
              </p>
            </div>
          </div>

          <span className="w-fit rounded-full bg-red-100 px-3 py-1.5 text-[10px] font-black text-red-600 dark:bg-red-500/15 dark:text-red-300">
            {urgentCount} urgent
          </span>
        </div>
      )}

      {/* DOCTOR ARRIVAL */}

      <section
        className="
          mt-5
          rounded-[22px]
          border
          border-white/60
          bg-white/68
          p-5
          shadow-[0_12px_28px_rgba(44,78,75,0.10)]

          dark:border-[#29413f]
          dark:bg-[#172827]/85
        "
      >
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-[15px] bg-[#dff3ee] text-[#18a999] dark:bg-[#17413e] dark:text-[#65d7cb]">
              <Stethoscope
                size={18}
              />
            </div>

            <div>
              <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#18a999]">
                Doctor Availability
              </p>

              <h3 className="mt-1 text-[16px] font-black text-[#263d3c] dark:text-white">
                Estimated Doctor
                Arrival
              </h3>

              <p className="mt-1 text-[10px] text-[#78908e]">
                Waiting-time
                estimates automatically
                update when the doctor
                ETA changes.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <label>
              <span className="mb-2 block text-[9px] font-bold uppercase text-[#78908e]">
                Doctor ETA
              </span>

              <input
                type="time"
                value={
                  doctorArrival
                }
                onChange={(e) => {
                  setDoctorArrival(
                    e.target.value
                  );

                  setQueueNotice(
                    "Doctor arrival time updated. Waiting times were automatically recalculated."
                  );
                }}
                disabled={
                  user?.role !==
                  "Staff"
                }
                className="
                  h-10
                  rounded-[12px]
                  border
                  border-white/70
                  bg-[#edf7f4]
                  px-4
                  text-[11px]
                  font-bold
                  text-[#38514f]
                  outline-none

                  disabled:cursor-not-allowed
                  disabled:opacity-60

                  dark:border-[#29413f]
                  dark:bg-[#203331]
                  dark:text-white
                "
              />
            </label>

            <label>
              <span className="mb-2 block text-[9px] font-bold uppercase text-[#78908e]">
                Avg. Consult
              </span>

              <div className="flex h-10 items-center rounded-[12px] bg-[#edf7f4] px-3 dark:bg-[#203331]">
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={
                    averageConsultation
                  }
                  onChange={(e) => {
                    setAverageConsultation(
                      Math.max(
                        5,
                        Number(
                          e.target
                            .value
                        ) || 5
                      )
                    );

                    setQueueNotice(
                      "Average consultation duration updated. Waiting times were recalculated."
                    );
                  }}
                  disabled={
                    user?.role !==
                    "Staff"
                  }
                  className="w-12 bg-transparent text-[11px] font-black text-[#38514f] outline-none dark:text-white"
                />

                <span className="text-[9px] text-[#78908e]">
                  min
                </span>
              </div>
            </label>

            <div className="rounded-[12px] bg-[#dff3ee] px-4 py-2.5 dark:bg-[#17413e]">
              <p className="text-[8px] font-extrabold uppercase text-[#78908e]">
                Managed by
              </p>

              <p className="mt-1 text-[10px] font-bold text-[#117f76] dark:text-[#65d7cb]">
                Clinic Staff
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NOTICE */}

      {queueNotice && (
        <div className="mt-4 flex items-center justify-between gap-4 rounded-[15px] bg-[#edf7f4] px-4 py-3 dark:bg-[#203331]">
          <div className="flex items-center gap-2">
            <RefreshCw
              size={14}
              className="shrink-0 text-[#18a999]"
            />

            <p className="text-[10px] font-semibold text-[#607b79] dark:text-[#91aaa7]">
              {queueNotice}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setQueueNotice("")
            }
            className="text-[#78908e]"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* STATS */}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <QueueStat
          icon={
            <Clock3 size={17} />
          }
          value={
            calculatedQueue.length
          }
          title="Waiting"
          detail="Patients in queue"
        />

        <QueueStat
          icon={
            <UsersRound
              size={17}
            />
          }
          value={
            nowServing ? 1 : 0
          }
          title="Serving"
          detail="Current consultation"
        />

        <QueueStat
          icon={
            <CheckCircle2
              size={17}
            />
          }
          value={completed}
          title="Completed"
          detail="Finished today"
        />

        <QueueStat
          icon={
            <AlertTriangle
              size={17}
            />
          }
          value={urgentCount}
          title="Urgent"
          detail="Highest priority"
          urgent={
            urgentCount > 0
          }
        />
      </div>

      {/* MAIN QUEUE */}

      <div className="mt-5 grid gap-5 xl:grid-cols-[310px_1fr]">
        <div>
          <section className="rounded-[22px] border border-white/60 bg-white/68 p-4 shadow-[0_14px_32px_rgba(44,78,75,0.11)] dark:border-[#29413f] dark:bg-[#172827]/85">
            <NowServingCard
              patient={
                nowServing
              }
            />
          </section>

          {nowServing && (
            <button
              type="button"
              onClick={
                completeConsultation
              }
              className="
                mt-3
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-[13px]
                bg-[#18a999]
                py-2.5
                text-[11px]
                font-bold
                text-white

                hover:bg-[#138f83]
              "
            >
              <CheckCircle2
                size={15}
              />

              Complete Consultation
            </button>
          )}
        </div>

        <section className="overflow-hidden rounded-[22px] border border-white/60 bg-white/68 shadow-[0_14px_32px_rgba(44,78,75,0.11)] dark:border-[#29413f] dark:bg-[#172827]/85">
          <QueueMonitor
            patients={
              calculatedQueue
            }
            onServe={
              servePatient
            }
          />
        </section>
      </div>

      {showAddPatient && (
        <AddQueuePatientModal
          onClose={() =>
            setShowAddPatient(
              false
            )
          }
          onSave={addPatient}
        />
      )}
    </div>
  );
};

const QueueStat = ({
  icon,
  value,
  title,
  detail,
  urgent = false,
}) => (
  <article
    className={`
      rounded-[19px]
      border
      px-4
      py-4
      shadow-[0_10px_24px_rgba(44,78,75,0.10)]

      ${
        urgent
          ? `
            border-red-200
            bg-red-50/80
            dark:border-red-900/50
            dark:bg-red-950/20
          `
          : `
            border-white/60
            bg-white/68
            dark:border-[#29413f]
            dark:bg-[#172827]/85
          `
      }
    `}
  >
    <div className="flex items-center gap-3">
      <div
        className={`
          grid
          h-10
          w-10
          place-items-center
          rounded-[14px]

          ${
            urgent
              ? "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400"
              : "bg-[#dff3ee] text-[#18a999] dark:bg-[#17413e] dark:text-[#65d7cb]"
          }
        `}
      >
        {icon}
      </div>

      <div>
        <div className="flex items-end gap-2">
          <p
            className={`
              text-[24px]
              font-black
              leading-none

              ${
                urgent
                  ? "text-red-600 dark:text-red-300"
                  : "text-[#263d3c] dark:text-white"
              }
            `}
          >
            {value}
          </p>

          <p className="text-[10px] font-bold text-[#607b79] dark:text-[#91aaa7]">
            {title}
          </p>
        </div>

        <p className="mt-2 text-[9px] text-[#8aa09e]">
          {detail}
        </p>
      </div>
    </div>
  </article>
);

const AddQueuePatientModal = ({
  onClose,
  onSave,
}) => {
  const [form, setForm] =
    useState({
      patient: "",
      queueType: "Walk-in",
      priority: "Walk-in",
      reason: "",
    });

  const change = (e) => {
    const {
      name,
      value,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (
      name === "queueType" &&
      value === "Appointment"
    ) {
      setForm((previous) => ({
        ...previous,
        queueType:
          "Appointment",
        priority:
          previous.priority ===
            "Urgent" ||
          previous.priority ===
            "Priority"
            ? previous.priority
            : "Appointment",
      }));
    }

    if (
      name === "queueType" &&
      value === "Walk-in"
    ) {
      setForm((previous) => ({
        ...previous,
        queueType: "Walk-in",
        priority:
          previous.priority ===
            "Urgent" ||
          previous.priority ===
            "Priority"
            ? previous.priority
            : "Walk-in",
      }));
    }
  };

  const submit = (e) => {
    e.preventDefault();

    if (
      !form.patient.trim()
    ) {
      return;
    }

    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#173332]/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[520px] rounded-[24px] border border-white/70 bg-[#eff8f6]/95 p-6 shadow-2xl dark:border-[#29413f] dark:bg-[#172827]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#18a999]">
              Queue Entry
            </p>

            <h2 className="mt-1 text-[19px] font-black text-[#263d3c] dark:text-white">
              Add Patient
            </h2>

            <p className="mt-1 text-[10px] text-[#78908e]">
              Assign queue type and clinic priority.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl bg-white/60 text-[#78908e] dark:bg-[#203331]"
          >
            <X size={16} />
          </button>
        </div>

        <form
          onSubmit={submit}
          className="mt-6 space-y-4"
        >
          <FieldLabel label="Patient Name">
            <input
              name="patient"
              value={
                form.patient
              }
              onChange={change}
              placeholder="Enter patient name"
              className={inputClass}
            />
          </FieldLabel>

          <div className="grid gap-4 sm:grid-cols-2">
            <FieldLabel label="Queue Type">
              <select
                name="queueType"
                value={
                  form.queueType
                }
                onChange={change}
                className={inputClass}
              >
                <option value="Walk-in">
                  Walk-in
                </option>

                <option value="Appointment">
                  Appointment
                </option>
              </select>
            </FieldLabel>

            <FieldLabel label="Priority">
              <select
                name="priority"
                value={
                  form.priority
                }
                onChange={change}
                className={inputClass}
              >
                <option
                  value={
                    form.queueType ===
                    "Appointment"
                      ? "Appointment"
                      : "Walk-in"
                  }
                >
                  Normal
                </option>

                <option value="Priority">
                  Priority
                </option>

                <option value="Urgent">
                  Urgent
                </option>
              </select>
            </FieldLabel>
          </div>

          {form.priority ===
            "Urgent" && (
            <div className="flex gap-3 rounded-[14px] border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/20">
              <AlertTriangle
                size={17}
                className="shrink-0 text-red-500"
              />

              <p className="text-[10px] leading-5 text-red-600 dark:text-red-300">
                Urgent status should
                only be assigned
                according to the
                clinic's approved
                triage process. This
                patient will move to
                the top of the queue.
              </p>
            </div>
          )}

          <FieldLabel label="Reason for Visit">
            <textarea
              name="reason"
              rows={3}
              value={form.reason}
              onChange={change}
              placeholder="Enter consultation reason"
              className="
                w-full
                rounded-[12px]
                border
                border-white/70
                bg-white/65
                p-3
                text-[11px]
                text-[#38514f]
                outline-none

                focus:border-[#18a999]

                dark:border-[#29413f]
                dark:bg-[#203331]
                dark:text-white
              "
            />
          </FieldLabel>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[12px] bg-[#edf7f4] px-5 py-2.5 text-[11px] font-bold text-[#607b79] dark:bg-[#203331] dark:text-[#91aaa7]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-[12px] bg-[#18a999] px-5 py-2.5 text-[11px] font-bold text-white hover:bg-[#138f83]"
            >
              Add to Queue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FieldLabel = ({
  label,
  children,
}) => (
  <label className="block">
    <span className="mb-2 block text-[10px] font-bold text-[#607b79] dark:text-[#91aaa7]">
      {label}
    </span>

    {children}
  </label>
);

const inputClass = `
  h-10
  w-full
  rounded-[12px]
  border
  border-white/70
  bg-white/65
  px-3
  text-[11px]
  text-[#38514f]
  outline-none
  focus:border-[#18a999]
  dark:border-[#29413f]
  dark:bg-[#203331]
  dark:text-white
`;

export default QueueManagement;