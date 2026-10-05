import {
  ArrowRightLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock3,
  Filter,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
  Search,
  Stethoscope,
  UserRound,
  UsersRound,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import CuraCard from "../../common/CuraCard";

const Queue = () => {
  /*
  |--------------------------------------------------------------------------
  | QUEUE DATA
  |--------------------------------------------------------------------------
  |
  | Later:
  | const data = await queueService.getToday();
  |
  */

  const [queueEntries] = useState([]);

  const [search, setSearch] =
    useState("");

  const [activeTab, setActiveTab] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [
    selectedEntry,
    setSelectedEntry,
  ] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */

  const normalize = (value) =>
    String(value || "")
      .trim()
      .toLowerCase();

  const getInitials = (name) =>
    String(name || "Patient")
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const formatTime = (value) => {
    if (!value) {
      return "—";
    }

    return value;
  };

  const getStatusClass = (status) => {
    const value =
      normalize(status);

    if (value === "waiting") {
      return "waiting";
    }

    if (
      value === "now consulting" ||
      value === "consulting"
    ) {
      return "consulting";
    }

    if (value === "completed") {
      return "completed";
    }

    if (value === "scheduled") {
      return "scheduled";
    }

    return "default";
  };

  const getTypeClass = (type) => {
    return normalize(type) ===
      "walk-in"
      ? "walkin"
      : "scheduled";
  };

  /*
  |--------------------------------------------------------------------------
  | STATS
  |--------------------------------------------------------------------------
  */

  const totalInQueue =
    queueEntries.filter(
      (item) =>
        normalize(item.status) !==
        "completed"
    ).length;

  const waitingCount =
    queueEntries.filter(
      (item) =>
        normalize(item.status) ===
        "waiting"
    ).length;

  const consultingCount =
    queueEntries.filter((item) =>
      [
        "consulting",
        "now consulting",
      ].includes(
        normalize(item.status)
      )
    ).length;

  const completedCount =
    queueEntries.filter(
      (item) =>
        normalize(item.status) ===
        "completed"
    ).length;

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const filteredQueue =
    useMemo(() => {
      let result =
        [...queueEntries];

      const keyword =
        normalize(search);

      if (keyword) {
        result = result.filter(
          (item) =>
            normalize(
              item.patient_name
            ).includes(keyword) ||
            normalize(
              item.patient_number
            ).includes(keyword) ||
            normalize(
              item.contact_number
            ).includes(keyword)
        );
      }

      if (
        activeTab === "walkin"
      ) {
        result = result.filter(
          (item) =>
            normalize(
              item.queue_type
            ) === "walk-in"
        );
      }

      if (
        activeTab === "scheduled"
      ) {
        result = result.filter(
          (item) =>
            normalize(
              item.queue_type
            ) === "scheduled"
        );
      }

      if (
        statusFilter !== "all"
      ) {
        result = result.filter(
          (item) =>
            normalize(
              item.status
            ) === statusFilter
        );
      }

      return result.sort(
        (a, b) =>
          Number(
            a.queue_number
          ) -
          Number(
            b.queue_number
          )
      );
    }, [
      queueEntries,
      search,
      activeTab,
      statusFilter,
    ]);

  return (
    <div className="staff-queue-page">

      {/* =====================================================
          SUMMARY
      ====================================================== */}

      <div className="staff-queue-summary">

        <QueueStat
          icon={
            <UsersRound size={23} />
          }
          variant="total"
          value={totalInQueue}
          label="Total in Queue"
          helper="Waiting for consultation"
        />

        <QueueStat
          icon={
            <Clock3 size={23} />
          }
          variant="waiting"
          value={waitingCount}
          label="Waiting"
          helper="Not yet called"
        />

        <QueueStat
          icon={
            <Stethoscope size={23} />
          }
          variant="consulting"
          value={consultingCount}
          label="Now Consulting"
          helper="With doctor"
        />

        <QueueStat
          icon={
            <CheckCircle2 size={23} />
          }
          variant="completed"
          value={completedCount}
          label="Completed"
          helper="For today"
        />

      </div>


      {/* =====================================================
          MAIN LAYOUT
      ====================================================== */}

      <div className="staff-queue-main-grid">

        {/* =================================================
            LEFT
        ================================================== */}

        <div className="staff-queue-left">

          {/* TABS + SEARCH */}

          <CuraCard className="staff-queue-controls-card">

            <div className="staff-queue-controls">

              <div className="staff-queue-tabs">

                <button
                  type="button"
                  className={
                    activeTab === "all"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveTab(
                      "all"
                    )
                  }
                >
                  All Queue
                </button>

                <button
                  type="button"
                  className={
                    activeTab === "walkin"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveTab(
                      "walkin"
                    )
                  }
                >
                  Walk-ins
                </button>

                <button
                  type="button"
                  className={
                    activeTab ===
                    "scheduled"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setActiveTab(
                      "scheduled"
                    )
                  }
                >
                  Scheduled
                </button>

              </div>


              <label className="staff-queue-search">

                <Search size={16} />

                <input
                  type="search"
                  value={search}
                  placeholder="Search by name, ID number, or contact..."
                  onChange={(event) =>
                    setSearch(
                      event.target
                        .value
                    )
                  }
                />

              </label>


              <div className="staff-queue-filter">

                <Filter size={15} />

                <select
                  value={
                    statusFilter
                  }
                  onChange={(event) =>
                    setStatusFilter(
                      event.target
                        .value
                    )
                  }
                >
                  <option value="all">
                    All Status
                  </option>

                  <option value="waiting">
                    Waiting
                  </option>

                  <option value="now consulting">
                    Now Consulting
                  </option>

                  <option value="completed">
                    Completed
                  </option>
                </select>

              </div>

            </div>

          </CuraCard>


          {/* ===============================================
              QUEUE TABLE
          ================================================ */}

          <CuraCard
            title={`Today's Queue (${filteredQueue.length})`}
            action={
              <span className="staff-queue-live">
                <i />
                Live
              </span>
            }
            className="staff-queue-list-card"
          >

            <div className="staff-queue-table-wrapper">

              <table className="staff-queue-table">

                <thead>
                  <tr>
                    <th>#</th>
                    <th>Patient</th>
                    <th>Type</th>
                    <th>Time In</th>
                    <th>Status</th>
                    <th>Doctor</th>
                    <th>ETA</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredQueue.map(
                    (item) => (
                      <tr
                        key={item.id}
                        className={
                          selectedEntry
                            ?.id ===
                          item.id
                            ? "selected"
                            : ""
                        }
                        onClick={() =>
                          setSelectedEntry(
                            item
                          )
                        }
                      >

                        <td>
                          <span className="staff-queue-number">
                            {
                              item.queue_number
                            }
                          </span>
                        </td>


                        <td>
                          <div className="staff-queue-patient">

                            <div className="staff-queue-avatar">
                              {getInitials(
                                item.patient_name
                              )}
                            </div>

                            <div>
                              <strong>
                                {
                                  item.patient_name
                                }
                              </strong>

                              <span>
                                {
                                  item.patient_number
                                }
                              </span>
                            </div>

                          </div>
                        </td>


                        <td>
                          <span
                            className={`staff-queue-type ${getTypeClass(
                              item.queue_type
                            )}`}
                          >
                            {item.queue_type ||
                              "—"}
                          </span>
                        </td>


                        <td>
                          {formatTime(
                            item.time_in
                          )}
                        </td>


                        <td>
                          <span
                            className={`staff-queue-status ${getStatusClass(
                              item.status
                            )}`}
                          >
                            {item.status ||
                              "—"}
                          </span>
                        </td>


                        <td>
                          {item.doctor_name ||
                            "—"}
                        </td>


                        <td>
                          {item.eta ||
                            "—"}
                        </td>


                        <td>
                          <button
                            type="button"
                            className="staff-queue-more"
                            onClick={(
                              event
                            ) =>
                              event.stopPropagation()
                            }
                          >
                            <MoreVertical
                              size={16}
                            />
                          </button>
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>


              {filteredQueue.length ===
                0 && (
                <div className="staff-queue-empty">

                  <ClipboardList
                    size={36}
                  />

                  <p>
                    No patients in queue
                  </p>

                  <span>
                    Today's queue will
                    appear here once
                    patients are added.
                  </span>

                </div>
              )}

            </div>


            {/* PAGINATION */}

            <div className="staff-queue-pagination">

              <span>
                Showing{" "}
                {filteredQueue.length}{" "}
                patients
              </span>

              <div>
                <button>
                  <ChevronLeft
                    size={15}
                  />
                </button>

                <button className="active">
                  1
                </button>

                <button>
                  <ChevronRight
                    size={15}
                  />
                </button>
              </div>

              <select defaultValue="10">
                <option value="10">
                  10 / page
                </option>

                <option value="20">
                  20 / page
                </option>

                <option value="50">
                  50 / page
                </option>
              </select>

            </div>

          </CuraCard>

        </div>


        {/* =================================================
            RIGHT DETAILS
        ================================================== */}

        <CuraCard
          title="Patient Details"
          className="staff-queue-detail-card"
        >

          {!selectedEntry ? (

            <div className="staff-queue-detail-empty">

              <UserRound size={42} />

              <h3>
                No patient selected
              </h3>

              <p>
                Select a patient from
                the queue to view
                details.
              </p>

            </div>

          ) : (

            <QueuePatientDetails
              entry={
                selectedEntry
              }
              initials={getInitials(
                selectedEntry.patient_name
              )}
              statusClass={
                getStatusClass(
                  selectedEntry.status
                )
              }
            />

          )}

        </CuraCard>

      </div>

    </div>
  );
};


/* =========================================================
   STAT CARD
========================================================= */

const QueueStat = ({
  icon,
  variant,
  value,
  label,
  helper,
}) => (
  <CuraCard className="staff-queue-stat-card">

    <div className="staff-queue-stat-content">

      <div
        className={`staff-queue-stat-icon ${variant}`}
      >
        {icon}
      </div>

      <div>
        <strong>
          {value}
        </strong>

        <p>
          {label}
        </p>

        <span>
          {helper}
        </span>
      </div>

    </div>

  </CuraCard>
);


/* =========================================================
   DETAILS
========================================================= */

const QueuePatientDetails = ({
  entry,
  initials,
  statusClass,
}) => (
  <div className="staff-queue-details">

    {/* PROFILE */}

    <div className="staff-queue-detail-profile">

      <div className="staff-queue-detail-avatar">
        {initials}
      </div>

      <div>
        <h3>
          {entry.patient_name}
        </h3>

        <p>
          {entry.patient_number}
        </p>
      </div>

      <span
        className={`staff-queue-status ${statusClass}`}
      >
        {entry.status}
      </span>

    </div>


    {/* PERSONAL */}

    <QueueDetailSection
      icon={
        <UserRound size={17} />
      }
      title="Personal Information"
    >

      <QueueDetailRow
        label="Birth Date"
        value={
          entry.birth_date ||
          "—"
        }
      />

      <QueueDetailRow
        label="Age"
        value={
          entry.age
            ? `${entry.age} years old`
            : "—"
        }
      />

      <QueueDetailRow
        label="Sex"
        value={
          entry.sex || "—"
        }
      />

    </QueueDetailSection>


    {/* CONTACT */}

    <QueueDetailSection
      icon={
        <Phone size={17} />
      }
      title="Contact Information"
    >

      <QueueDetailRow
        label="Phone Number"
        value={
          entry.contact_number ||
          "—"
        }
      />

      <QueueDetailRow
        label="Email"
        value={
          entry.email || "—"
        }
      />

      <QueueDetailRow
        label="Address"
        value={
          entry.address || "—"
        }
      />

    </QueueDetailSection>


    {/* QUEUE INFO */}

    <QueueDetailSection
      icon={
        <ClipboardList
          size={17}
        />
      }
      title="Queue Information"
    >

      <QueueDetailRow
        label="Queue Number"
        value={
          entry.queue_number ||
          "—"
        }
      />

      <QueueDetailRow
        label="Type"
        value={
          entry.queue_type ||
          "—"
        }
      />

      <QueueDetailRow
        label="Priority"
        value={
          entry.priority ||
          "Normal"
        }
      />

      <QueueDetailRow
        label="Time In"
        value={
          entry.time_in || "—"
        }
      />

      <QueueDetailRow
        label="ETA"
        value={
          entry.eta || "—"
        }
      />

      <QueueDetailRow
        label="Assigned Doctor"
        value={
          entry.doctor_name ||
          "—"
        }
      />

    </QueueDetailSection>


    {/* NOTES */}

    <QueueDetailSection
      icon={
        <Stethoscope
          size={17}
        />
      }
      title="Notes"
    >

      <p className="staff-queue-notes">
        {entry.notes ||
          "No notes available."}
      </p>

    </QueueDetailSection>


    {/* ACTIONS */}

    <div className="staff-queue-detail-actions">

      <button
        type="button"
        className="transfer"
      >
        <ArrowRightLeft
          size={15}
        />

        Transfer to Another Doctor
      </button>

      <button
        type="button"
        className="complete"
      >
        <CheckCircle2
          size={15}
        />

        Mark as Completed
      </button>

    </div>

  </div>
);


const QueueDetailSection = ({
  icon,
  title,
  children,
}) => (
  <section className="staff-queue-detail-section">

    <h4>
      {icon}

      {title}
    </h4>

    {children}

  </section>
);


const QueueDetailRow = ({
  label,
  value,
}) => (
  <div className="staff-queue-detail-row">

    <span>
      {label}
    </span>

    <strong>
      {value}
    </strong>

  </div>
);


export default Queue;