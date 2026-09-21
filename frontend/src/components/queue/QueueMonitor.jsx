import {
  AlertTriangle,
  Clock3,
  Timer,
  UserRound,
} from "lucide-react";

const QueueMonitor = ({
  patients,
  onServe,
}) => {
  return (
    <div>
      <div className="border-b border-white/60 px-5 py-4 dark:border-[#29413f]">
        <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#18a999]">
          Dynamic Queue
        </p>

        <h3 className="mt-1 text-[17px] font-black text-[#263d3c] dark:text-white">
          Waiting Patients
        </h3>

        <p className="mt-1 text-[10px] text-[#78908e]">
          Ordered by priority with automatically recalculated waiting times.
        </p>
      </div>

      {patients.length === 0 ? (
        <div className="py-14 text-center">
          <p className="text-[11px] font-bold text-[#607b79] dark:text-[#91aaa7]">
            Queue is currently empty.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/50 dark:divide-[#29413f]">
          {patients.map(
            (
              patient,
              index
            ) => (
              <div
                key={patient.id}
                className={`
                  grid
                  gap-4
                  px-5
                  py-4
                  transition

                  dark:hover:bg-[#203331]

                  lg:grid-cols-[50px_1.3fr_0.8fr_0.8fr_100px]
                  lg:items-center

                  ${
                    patient.priority ===
                    "Urgent"
                      ? "bg-red-50/50 dark:bg-red-950/10"
                      : "hover:bg-[#edf7f4]/50"
                  }
                `}
              >
                {/* POSITION */}

                <div
                  className={`
                    grid
                    h-10
                    w-10
                    place-items-center
                    rounded-[13px]
                    text-[10px]
                    font-black

                    ${
                      patient.priority ===
                      "Urgent"
                        ? "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300"
                        : "bg-[#dff3ee] text-[#117f76] dark:bg-[#17413e] dark:text-[#65d7cb]"
                    }
                  `}
                >
                  {patient.priority ===
                  "Urgent" ? (
                    <AlertTriangle
                      size={16}
                    />
                  ) : (
                    index + 1
                  )}
                </div>

                {/* PATIENT */}

                <div>
                  <div className="flex items-center gap-2">
                    <UserRound
                      size={13}
                      className="text-[#78908e]"
                    />

                    <p className="text-[12px] font-extrabold text-[#38514f] dark:text-[#dce8e6]">
                      {
                        patient.patient
                      }
                    </p>
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span
                      className={`
                        rounded-full
                        px-2.5
                        py-1
                        text-[8px]
                        font-bold

                        ${
                          patient.priority ===
                          "Urgent"
                            ? "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300"
                            : patient.priority ===
                              "Priority"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
                            : "bg-[#dff3ee] text-[#117f76] dark:bg-[#17413e] dark:text-[#65d7cb]"
                        }
                      `}
                    >
                      {
                        patient.priority
                      }
                    </span>

                    <span className="text-[9px] text-[#829b99]">
                      {
                        patient.queueNumber
                      }
                    </span>

                    <span className="text-[9px] text-[#829b99]">
                      {
                        patient.queueType
                      }
                    </span>
                  </div>

                  <p className="mt-1.5 text-[9px] text-[#829b99]">
                    {patient.reason ||
                      "No reason specified"}
                  </p>
                </div>

                {/* ARRIVAL */}

                <div>
                  <p className="text-[8px] font-extrabold uppercase tracking-wide text-[#8aa09e]">
                    Joined
                  </p>

                  <div className="mt-1 flex items-center gap-1.5">
                    <Clock3
                      size={12}
                      className="text-[#18a999]"
                    />

                    <p className="text-[10px] font-bold text-[#607b79] dark:text-[#91aaa7]">
                      {patient.time}
                    </p>
                  </div>
                </div>

                {/* ESTIMATE */}

                <div>
                  <p className="text-[8px] font-extrabold uppercase tracking-wide text-[#8aa09e]">
                    Estimated
                  </p>

                  <p className="mt-1 text-[11px] font-black text-[#38514f] dark:text-white">
                    {
                      patient.estimatedStart
                    }
                  </p>

                  <div className="mt-1 flex items-center gap-1">
                    <Timer
                      size={11}
                      className="text-[#18a999]"
                    />

                    <p className="text-[9px] text-[#78908e]">
                      ~
                      {
                        patient.waitingMinutes
                      }{" "}
                      min
                    </p>
                  </div>
                </div>

                {/* ACTION */}

                <button
                  type="button"
                  onClick={() =>
                    onServe(
                      patient
                    )
                  }
                  className="
                    rounded-[11px]
                    bg-[#18a999]
                    px-3
                    py-2
                    text-[10px]
                    font-bold
                    text-white

                    hover:bg-[#138f83]
                  "
                >
                  Serve
                </button>
              </div>
            )
          )}
        </div>
      )}

      <div className="border-t border-white/60 px-5 py-3 dark:border-[#29413f]">
        <p className="text-[9px] leading-5 text-[#829b99]">
          Waiting times are estimates and may change when urgent cases are added,
          consultation duration changes, or doctor availability is updated.
        </p>
      </div>
    </div>
  );
};

export default QueueMonitor;