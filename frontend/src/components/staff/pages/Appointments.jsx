import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MoreVertical,
  Plus,
  Search,
  XCircle,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import CuraCard from "../../common/CuraCard";

const Appointments = () => {
  /*
  |--------------------------------------------------------------------------
  | DATA
  |--------------------------------------------------------------------------
  |
  | Later replace this with Laravel API data.
  | No fake appointments for now.
  |
  */

  const [appointments] = useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [typeFilter, setTypeFilter] =
    useState("all");

  const [doctorFilter, setDoctorFilter] =
    useState("all");

  const [selectedDate, setSelectedDate] =
    useState(
      new Date()
        .toISOString()
        .split("T")[0]
    );

  const [
    selectedAppointment,
    setSelectedAppointment,
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

  const formatDate = (value) => {
    if (!value) {
      return "—";
    }

    return new Date(
      `${value}T00:00:00`
    ).toLocaleDateString(
      "en-PH",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  const formatTime = (value) => {
    if (!value) {
      return "—";
    }

    const [hour, minute] =
      value.split(":");

    const date = new Date();

    date.setHours(
      Number(hour),
      Number(minute),
      0,
      0
    );

    return date.toLocaleTimeString(
      "en-PH",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  const getInitials = (name) => {
    return String(name || "Patient")
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const statusClass = (status) => {
    const value =
      normalize(status);

    if (value === "completed") {
      return "completed";
    }

    if (
      value === "in progress" ||
      value === "ongoing"
    ) {
      return "progress";
    }

    if (value === "waiting") {
      return "waiting";
    }

    if (value === "scheduled") {
      return "scheduled";
    }

    if (
      value === "cancelled" ||
      value === "no show"
    ) {
      return "cancelled";
    }

    return "default";
  };

  /*
  |--------------------------------------------------------------------------
  | SUMMARY
  |--------------------------------------------------------------------------
  */

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const todayAppointments =
    appointments.filter(
      (item) =>
        item.date === today
    );

  const todayCount =
    todayAppointments.length;

  const ongoingCount =
    todayAppointments.filter(
      (item) =>
        [
          "ongoing",
          "in progress",
          "waiting",
        ].includes(
          normalize(item.status)
        )
    ).length;

  const completedCount =
    todayAppointments.filter(
      (item) =>
        normalize(item.status) ===
        "completed"
    ).length;

  const cancelledCount =
    todayAppointments.filter(
      (item) =>
        [
          "cancelled",
          "no show",
        ].includes(
          normalize(item.status)
        )
    ).length;

  /*
  |--------------------------------------------------------------------------
  | FILTER OPTIONS
  |--------------------------------------------------------------------------
  */

  const doctors = [
    ...new Set(
      appointments
        .map(
          (item) =>
            item.doctor_name
        )
        .filter(Boolean)
    ),
  ];

  const appointmentTypes = [
    ...new Set(
      appointments
        .map(
          (item) =>
            item.appointment_type
        )
        .filter(Boolean)
    ),
  ];

  /*
  |--------------------------------------------------------------------------
  | FILTERED APPOINTMENTS
  |--------------------------------------------------------------------------
  */

  const filteredAppointments =
    useMemo(() => {
      let result =
        [...appointments];

      const keyword =
        normalize(search);

      if (selectedDate) {
        result = result.filter(
          (item) =>
            item.date ===
            selectedDate
        );
      }

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
        statusFilter !== "all"
      ) {
        result = result.filter(
          (item) =>
            normalize(
              item.status
            ) === statusFilter
        );
      }

      if (
        typeFilter !== "all"
      ) {
        result = result.filter(
          (item) =>
            item.appointment_type ===
            typeFilter
        );
      }

      if (
        doctorFilter !== "all"
      ) {
        result = result.filter(
          (item) =>
            item.doctor_name ===
            doctorFilter
        );
      }

      return result.sort(
        (a, b) =>
          String(a.time || "")
            .localeCompare(
              String(
                b.time || ""
              )
            )
      );
    }, [
      appointments,
      search,
      statusFilter,
      typeFilter,
      doctorFilter,
      selectedDate,
    ]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
    setDoctorFilter("all");
    setSelectedDate(today);
  };

  return (
    <div className="staff-appointments-page">

      {/* ===================================================
          SUMMARY
      ==================================================== */}

      <div className="staff-appointments-summary">

        <AppointmentStat
          icon={
            <CalendarDays
              size={23}
            />
          }
          variant="today"
          value={todayCount}
          label="Today's Appointments"
        />

        <AppointmentStat
          icon={
            <Clock3 size={23} />
          }
          variant="progress"
          value={ongoingCount}
          label="Ongoing / In Progress"
        />

        <AppointmentStat
          icon={
            <CheckCircle2
              size={23}
            />
          }
          variant="completed"
          value={completedCount}
          label="Completed Today"
        />

        <AppointmentStat
          icon={
            <XCircle size={23} />
          }
          variant="cancelled"
          value={cancelledCount}
          label="Cancelled / No Show"
        />

      </div>


      {/* ===================================================
          FILTER BAR
      ==================================================== */}

      <CuraCard className="staff-appointment-filter-card">

        <div className="staff-appointment-toolbar">

          <button
            type="button"
            className="staff-new-appointment"
          >
            <Plus size={17} />

            New Appointment
          </button>


          <label className="staff-appointment-search">

            <Search size={16} />

            <input
              type="search"
              placeholder="Search by patient name, ID number, or contact..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

          </label>


          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >
            <option value="all">
              All Status
            </option>

            <option value="scheduled">
              Scheduled
            </option>

            <option value="waiting">
              Waiting
            </option>

            <option value="in progress">
              In Progress
            </option>

            <option value="completed">
              Completed
            </option>

            <option value="cancelled">
              Cancelled
            </option>
          </select>


          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(
                event.target.value
              )
            }
          >
            <option value="all">
              All Appointment Types
            </option>

            {appointmentTypes.map(
              (type) => (
                <option
                  value={type}
                  key={type}
                >
                  {type}
                </option>
              )
            )}
          </select>


          <select
            value={doctorFilter}
            onChange={(event) =>
              setDoctorFilter(
                event.target.value
              )
            }
          >
            <option value="all">
              All Doctors
            </option>

            {doctors.map(
              (doctor) => (
                <option
                  value={doctor}
                  key={doctor}
                >
                  {doctor}
                </option>
              )
            )}
          </select>


          <input
            type="date"
            className="staff-appointment-date"
            value={selectedDate}
            onChange={(event) =>
              setSelectedDate(
                event.target.value
              )
            }
          />


          <button
            type="button"
            className="staff-appointment-clear"
            onClick={clearFilters}
          >
            Clear
          </button>

        </div>

      </CuraCard>


      {/* ===================================================
          MAIN AREA
      ==================================================== */}

      <div className="staff-appointment-main-grid">

        {/* =================================================
            CALENDAR
        ================================================== */}

        <AppointmentCalendar
          selectedDate={
            selectedDate
          }
          setSelectedDate={
            setSelectedDate
          }
          appointments={
            appointments
          }
        />


        {/* =================================================
            APPOINTMENT LIST
        ================================================== */}

        <CuraCard
          title={`Today's Appointments (${filteredAppointments.length})`}
          className="staff-appointment-list-card"
        >

          <div className="staff-appointment-table-wrapper">

            <table className="staff-appointment-table">

              <thead>
                <tr>
                  <th>Time</th>
                  <th>Patient</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Doctor</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredAppointments.map(
                  (appointment) => (
                    <tr
                      key={
                        appointment.id
                      }
                      className={
                        selectedAppointment
                          ?.id ===
                        appointment.id
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        setSelectedAppointment(
                          appointment
                        )
                      }
                    >

                      <td>
                        {formatTime(
                          appointment.time
                        )}
                      </td>


                      <td>
                        <div className="staff-appointment-patient">

                          <div className="staff-appointment-avatar">
                            {getInitials(
                              appointment.patient_name
                            )}
                          </div>

                          <div>
                            <strong>
                              {
                                appointment.patient_name
                              }
                            </strong>

                            <span>
                              {
                                appointment.patient_number
                              }
                            </span>
                          </div>

                        </div>
                      </td>


                      <td>
                        <span className="staff-appointment-type">
                          {appointment.appointment_type ||
                            "—"}
                        </span>
                      </td>


                      <td>
                        <span
                          className={`staff-appointment-status ${statusClass(
                            appointment.status
                          )}`}
                        >
                          {appointment.status ||
                            "—"}
                        </span>
                      </td>


                      <td>
                        {appointment.doctor_name ||
                          "—"}
                      </td>


                      <td>
                        <button
                          type="button"
                          className="staff-appointment-more"
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


            {filteredAppointments.length ===
              0 && (
              <div className="staff-appointment-empty">

                <CalendarDays
                  size={35}
                />

                <p>
                  No appointments found
                </p>

                <span>
                  Appointments for the
                  selected date will
                  appear here.
                </span>

              </div>
            )}

          </div>


          {/* PAGINATION */}

          <div className="staff-appointment-pagination">

            <span>
              Showing{" "}
              {
                filteredAppointments.length
              }{" "}
              appointments
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


        {/* =================================================
            APPOINTMENT DETAILS
        ================================================== */}

        <CuraCard
          title="Appointment Details"
          className="staff-appointment-detail-card"
        >

          {!selectedAppointment ? (

            <div className="staff-appointment-detail-empty">

              <CalendarDays
                size={40}
              />

              <h3>
                No appointment selected
              </h3>

              <p>
                Select an appointment
                from the list to view
                its details.
              </p>

            </div>

          ) : (

            <div className="staff-appointment-details">

              {/* PATIENT */}

              <div className="staff-appointment-detail-profile">

                <div className="staff-appointment-detail-avatar">
                  {getInitials(
                    selectedAppointment.patient_name
                  )}
                </div>

                <div>
                  <h3>
                    {
                      selectedAppointment.patient_name
                    }
                  </h3>

                  <p>
                    {
                      selectedAppointment.patient_number
                    }
                  </p>
                </div>

                <span
                  className={`staff-appointment-status ${statusClass(
                    selectedAppointment.status
                  )}`}
                >
                  {selectedAppointment.status}
                </span>

              </div>


              {/* DETAILS */}

              <div className="staff-appointment-detail-list">

                <AppointmentDetail
                  label="Date"
                  value={formatDate(
                    selectedAppointment.date
                  )}
                />

                <AppointmentDetail
                  label="Time"
                  value={formatTime(
                    selectedAppointment.time
                  )}
                />

                <AppointmentDetail
                  label="Appointment Type"
                  value={
                    selectedAppointment.appointment_type ||
                    "—"
                  }
                />

                <AppointmentDetail
                  label="Status"
                  value={
                    selectedAppointment.status ||
                    "—"
                  }
                />

                <AppointmentDetail
                  label="Doctor"
                  value={
                    selectedAppointment.doctor_name ||
                    "—"
                  }
                />

                <AppointmentDetail
                  label="Notes"
                  value={
                    selectedAppointment.notes ||
                    "—"
                  }
                />

              </div>


              {/* ACTIONS */}

              <div className="staff-appointment-detail-actions">

                <button
                  type="button"
                  className="complete"
                >
                  <CheckCircle2
                    size={15}
                  />

                  Mark as Completed
                </button>

                <button
                  type="button"
                  className="reschedule"
                >
                  <CalendarDays
                    size={15}
                  />

                  Reschedule
                </button>

                <button
                  type="button"
                  className="cancel"
                >
                  <XCircle
                    size={15}
                  />

                  Cancel Appointment
                </button>

              </div>

            </div>

          )}

        </CuraCard>

      </div>

    </div>
  );
};


/* =========================================================
   SUMMARY CARD
========================================================= */

const AppointmentStat = ({
  icon,
  value,
  label,
  variant,
}) => (
  <CuraCard className="staff-appointment-stat-card">

    <div className="staff-appointment-stat-content">

      <div
        className={`staff-appointment-stat-icon ${variant}`}
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
      </div>

    </div>

  </CuraCard>
);


/* =========================================================
   DETAIL ROW
========================================================= */

const AppointmentDetail = ({
  label,
  value,
}) => (
  <div className="staff-appointment-detail-row">

    <span>
      {label}
    </span>

    <strong>
      {value}
    </strong>

  </div>
);


/* =========================================================
   SIMPLE CALENDAR
========================================================= */

const AppointmentCalendar = ({
  selectedDate,
  setSelectedDate,
  appointments,
}) => {
  const selected =
    selectedDate
      ? new Date(
          `${selectedDate}T00:00:00`
        )
      : new Date();

  const [viewDate, setViewDate] =
    useState(
      new Date(
        selected.getFullYear(),
        selected.getMonth(),
        1
      )
    );

  const year =
    viewDate.getFullYear();

  const month =
    viewDate.getMonth();

  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const days = [];

  for (
    let index = 0;
    index < firstDay;
    index++
  ) {
    days.push(null);
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    days.push(day);
  }

  const formatCalendarDate = (
    day
  ) => {
    const date = new Date(
      year,
      month,
      day
    );

    return [
      date.getFullYear(),
      String(
        date.getMonth() + 1
      ).padStart(2, "0"),
      String(
        date.getDate()
      ).padStart(2, "0"),
    ].join("-");
  };

  const appointmentDates =
    new Set(
      appointments.map(
        (item) => item.date
      )
    );

  const previousMonth = () => {
    setViewDate(
      new Date(
        year,
        month - 1,
        1
      )
    );
  };

  const nextMonth = () => {
    setViewDate(
      new Date(
        year,
        month + 1,
        1
      )
    );
  };

  return (
    <CuraCard className="staff-appointment-calendar-card">

      <div className="staff-calendar-header">

        <h3>
          {viewDate.toLocaleDateString(
            "en-PH",
            {
              month: "long",
              year: "numeric",
            }
          )}
        </h3>

        <div>

          <button
            type="button"
            onClick={
              previousMonth
            }
          >
            <ChevronLeft
              size={15}
            />
          </button>

          <button
            type="button"
            onClick={nextMonth}
          >
            <ChevronRight
              size={15}
            />
          </button>

        </div>

      </div>


      <div className="staff-calendar-weekdays">

        {[
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
        ].map((day) => (
          <span key={day}>
            {day}
          </span>
        ))}

      </div>


      <div className="staff-calendar-grid">

        {days.map(
          (day, index) => {
            if (!day) {
              return (
                <div
                  key={`empty-${index}`}
                />
              );
            }

            const date =
              formatCalendarDate(
                day
              );

            const active =
              selectedDate ===
              date;

            const hasAppointment =
              appointmentDates.has(
                date
              );

            return (
              <button
                type="button"
                key={date}
                className={
                  active
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setSelectedDate(
                    date
                  )
                }
              >
                {day}

                {hasAppointment && (
                  <i />
                )}
              </button>
            );
          }
        )}

      </div>


      <div className="staff-calendar-quick">

        <h4>
          Quick Filters
        </h4>

        <button
          type="button"
          onClick={() => {
            const now =
              new Date();

            setSelectedDate(
              now
                .toISOString()
                .split("T")[0]
            );
          }}
        >
          Today
        </button>

      </div>

    </CuraCard>
  );
};


export default Appointments;