import {
  CalendarDays,
  Clock3,
  Eye,
  Plus,
  Search,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import AppointmentCalendar from "./AppointmentCalendar";

const patients = [
  "Maria Santos",
  "John Dela Cruz",
  "Angela Reyes",
];

const doctors = [
  "Dr. Andrea Cruz",
  "Dr. Michael Santos",
];

const today = new Date()
  .toISOString()
  .split("T")[0];

const initialAppointments = [
  {
    id: 1,
    number: "APT-0001",
    patient: "Maria Santos",
    doctor: "Dr. Andrea Cruz",
    date: today,
    time: "09:00",
    reason: "General Consultation",
    status: "Confirmed",
  },
  {
    id: 2,
    number: "APT-0002",
    patient: "John Dela Cruz",
    doctor: "Dr. Michael Santos",
    date: today,
    time: "10:30",
    reason: "Follow-up Checkup",
    status: "Pending",
  },
  {
    id: 3,
    number: "APT-0003",
    patient: "Angela Reyes",
    doctor: "Dr. Andrea Cruz",
    date: today,
    time: "11:15",
    reason: "Headache and dizziness",
    status: "Confirmed",
  },
];

const AppointmentManager = () => {
  const [
    appointments,
    setAppointments,
  ] = useState(
    initialAppointments
  );

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(today);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    selectedAppointment,
    setSelectedAppointment,
  ] = useState(null);

  const filtered =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      return appointments.filter(
        (appointment) => {
          const matchesDate =
            appointment.date ===
            selectedDate;

          const matchesSearch =
            appointment.patient
              .toLowerCase()
              .includes(keyword) ||
            appointment.number
              .toLowerCase()
              .includes(keyword) ||
            appointment.doctor
              .toLowerCase()
              .includes(keyword);

          return (
            matchesDate &&
            matchesSearch
          );
        }
      );
    }, [
      appointments,
      selectedDate,
      search,
    ]);

  const confirmed =
    appointments.filter(
      (item) =>
        item.status ===
        "Confirmed"
    ).length;

  const pending =
    appointments.filter(
      (item) =>
        item.status === "Pending"
    ).length;

  const addAppointment = (
    data
  ) => {
    const id =
      appointments.length + 1;

    setAppointments((prev) => [
      ...prev,
      {
        ...data,
        id,
        number: `APT-${String(
          id
        ).padStart(4, "0")}`,
        status: "Pending",
      },
    ]);

    setShowForm(false);
  };

  return (
    <div>
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p
            className="
              text-[10px]
              font-extrabold
              uppercase
              tracking-[0.14em]
              text-[#18a999]
            "
          >
            Clinic Schedule
          </p>

          <h2
            className="
              mt-1
              text-[22px]
              font-black
              text-[#263d3c]

              dark:text-white
            "
          >
            Appointment Management
          </h2>

          <p
            className="
              mt-1
              text-[12px]
              text-[#78908e]
            "
          >
            Manage patient appointments and doctor schedules.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowForm(true)
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
            transition

            hover:bg-[#138f83]
          "
        >
          <Plus size={16} />
          New Appointment
        </button>
      </div>

      {/* TOP CARDS */}

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <StatCard
          icon={
            <CalendarDays
              size={18}
            />
          }
          label="Appointments"
          value={
            appointments.length
          }
          helper="Total scheduled records"
        />

        <StatCard
          icon={
            <UsersRound
              size={18}
            />
          }
          label="Confirmed"
          value={confirmed}
          helper="Ready for consultation"
        />

        <StatCard
          icon={
            <Clock3
              size={18}
            />
          }
          label="Pending"
          value={pending}
          helper="Needs confirmation"
        />
      </div>

      {/* CALENDAR */}

      <div className="mt-5">
        <AppointmentCalendar
          selectedDate={
            selectedDate
          }
          onSelectDate={
            setSelectedDate
          }
        />
      </div>

      {/* APPOINTMENT TABLE */}

      <section
        className="
          mt-5
          overflow-hidden
          rounded-[22px]
          border
          border-white/60
          bg-white/68
          shadow-[0_14px_32px_rgba(44,78,75,0.11)]
          backdrop-blur-xl

          dark:border-[#29413f]
          dark:bg-[#172827]/85
        "
      >
        {/* TABLE HEADER */}

        <div
          className="
            flex
            flex-col
            gap-4
            border-b
            border-white/60
            px-5
            py-4

            dark:border-[#29413f]

            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          <div>
            <p
              className="
                text-[9px]
                font-extrabold
                uppercase
                tracking-[0.14em]
                text-[#18a999]
              "
            >
              Appointment List
            </p>

            <h3
              className="
                mt-1
                text-[16px]
                font-black
                text-[#263d3c]

                dark:text-white
              "
            >
              Scheduled Patients
            </h3>
          </div>

          <div
            className="
              flex
              h-10
              w-full
              max-w-[330px]
              items-center
              gap-3
              rounded-[13px]
              bg-[#edf7f4]
              px-4

              dark:bg-[#203331]
            "
          >
            <Search
              size={15}
              className="text-[#78908e]"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search appointment..."
              className="
                w-full
                bg-transparent
                text-[11px]
                text-[#38514f]
                outline-none
                placeholder:text-[#8aa09e]

                dark:text-[#dce8e6]
              "
            />
          </div>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead
              className="
                bg-[#edf7f4]/70

                dark:bg-[#122120]
              "
            >
              <tr>
                <Head>
                  Patient
                </Head>

                <Head>
                  Appointment
                </Head>

                <Head>
                  Doctor
                </Head>

                <Head>
                  Time
                </Head>

                <Head>
                  Reason
                </Head>

                <Head>
                  Status
                </Head>

                <Head>
                  Action
                </Head>
              </tr>
            </thead>

            <tbody>
              {filtered.map(
                (appointment) => (
                  <tr
                    key={
                      appointment.id
                    }
                    className="
                      border-t
                      border-white/50
                      transition

                      hover:bg-[#edf7f4]/50

                      dark:border-[#29413f]
                      dark:hover:bg-[#203331]
                    "
                  >
                    {/* PATIENT */}

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            grid
                            h-9
                            w-9
                            place-items-center
                            rounded-[13px]
                            bg-[#dff3ee]
                            text-[#18a999]

                            dark:bg-[#17413e]
                            dark:text-[#65d7cb]
                          "
                        >
                          <UserRound
                            size={
                              15
                            }
                          />
                        </div>

                        <p
                          className="
                            text-[12px]
                            font-extrabold
                            text-[#38514f]

                            dark:text-[#dce8e6]
                          "
                        >
                          {
                            appointment.patient
                          }
                        </p>
                      </div>
                    </td>

                    <Cell>
                      {
                        appointment.number
                      }
                    </Cell>

                    <Cell>
                      {
                        appointment.doctor
                      }
                    </Cell>

                    <Cell>
                      {
                        appointment.time
                      }
                    </Cell>

                    <Cell>
                      {
                        appointment.reason
                      }
                    </Cell>

                    <td className="px-5 py-3.5">
                      <StatusBadge
                        status={
                          appointment.status
                        }
                      />
                    </td>

                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedAppointment(
                            appointment
                          )
                        }
                        className="
                          grid
                          h-8
                          w-8
                          place-items-center
                          rounded-[11px]
                          bg-[#edf7f4]
                          text-[#607b79]
                          transition

                          hover:bg-[#dff3ee]
                          hover:text-[#18a999]

                          dark:bg-[#203331]
                          dark:text-[#91aaa7]
                        "
                      >
                        <Eye
                          size={
                            14
                          }
                        />
                      </button>
                    </td>
                  </tr>
                )
              )}

              {filtered.length ===
                0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="
                      py-14
                      text-center
                      text-[11px]
                      text-[#78908e]
                    "
                  >
                    No appointments found for this date.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* NEW APPOINTMENT MODAL */}

      {showForm && (
        <AppointmentForm
          selectedDate={
            selectedDate
          }
          onCancel={() =>
            setShowForm(false)
          }
          onSave={
            addAppointment
          }
        />
      )}

      {/* DETAILS MODAL */}

      {selectedAppointment && (
        <AppointmentDetails
          appointment={
            selectedAppointment
          }
          onClose={() =>
            setSelectedAppointment(
              null
            )
          }
        />
      )}
    </div>
  );
};

/* ------------------------------ */
/* STAT CARD */
/* ------------------------------ */

const StatCard = ({
  icon,
  label,
  value,
  helper,
}) => (
  <article
    className="
      rounded-[19px]
      border
      border-white/60
      bg-white/68
      px-4
      py-4
      shadow-[0_10px_24px_rgba(44,78,75,0.10)]
      backdrop-blur-xl
      transition-all
      duration-200

      hover:-translate-y-[1px]
      hover:shadow-[0_14px_28px_rgba(44,78,75,0.14)]

      dark:border-[#29413f]
      dark:bg-[#172827]/85
    "
  >
    <div className="flex items-center gap-3">
      <div
        className="
          grid
          h-10
          w-10
          shrink-0
          place-items-center
          rounded-[14px]
          bg-[#dff3ee]
          text-[#18a999]

          dark:bg-[#17413e]
          dark:text-[#65d7cb]
        "
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-end justify-between gap-2">
          <p
            className="
              truncate
              text-[11px]
              font-bold
              text-[#607b79]

              dark:text-[#91aaa7]
            "
          >
            {label}
          </p>

          <p
            className="
              shrink-0
              text-[24px]
              font-black
              leading-none
              text-[#263d3c]

              dark:text-white
            "
          >
            {value}
          </p>
        </div>

        <p
          className="
            mt-2
            truncate
            text-[9px]
            font-medium
            text-[#8aa09e]
          "
        >
          {helper}
        </p>
      </div>
    </div>
  </article>
);

/* ------------------------------ */
/* TABLE */
/* ------------------------------ */

const Head = ({
  children,
}) => (
  <th
    className="
      px-5
      py-3
      text-left
      text-[8px]
      font-extrabold
      uppercase
      tracking-[0.11em]
      text-[#829b99]
    "
  >
    {children}
  </th>
);

const Cell = ({
  children,
}) => (
  <td
    className="
      px-5
      py-3.5
      text-[11px]
      font-medium
      text-[#607b79]

      dark:text-[#91aaa7]
    "
  >
    {children}
  </td>
);

const StatusBadge = ({
  status,
}) => (
  <span
    className={`
      inline-flex
      rounded-full
      px-3
      py-1
      text-[9px]
      font-bold

      ${
        status === "Confirmed"
          ? `
            bg-[#dff3ee]
            text-[#117f76]

            dark:bg-[#17413e]
            dark:text-[#65d7cb]
          `
          : `
            bg-[#fff1d9]
            text-[#b7791f]

            dark:bg-[#47361b]
            dark:text-[#f2c56c]
          `
      }
    `}
  >
    {status}
  </span>
);

/* ------------------------------ */
/* NEW APPOINTMENT MODAL */
/* ------------------------------ */

const AppointmentForm = ({
  selectedDate,
  onCancel,
  onSave,
}) => {
  const [form, setForm] =
    useState({
      patient: "",
      doctor: "",
      date: selectedDate,
      time: "",
      reason: "",
    });

  const change = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (
      !form.patient ||
      !form.doctor ||
      !form.date ||
      !form.time
    ) {
      return;
    }

    onSave(form);
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[120]
        flex
        items-center
        justify-center
        bg-[#173332]/25
        p-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full
          max-w-[620px]
          rounded-[24px]
          border
          border-white/70
          bg-[#eff8f6]/95
          p-6
          shadow-[0_30px_70px_rgba(28,62,59,0.25)]

          dark:border-[#29413f]
          dark:bg-[#172827]
        "
      >
        <div className="flex items-start justify-between">
          <div>
            <p
              className="
                text-[9px]
                font-extrabold
                uppercase
                tracking-[0.14em]
                text-[#18a999]
              "
            >
              Scheduling
            </p>

            <h2
              className="
                mt-1
                text-[20px]
                font-black
                text-[#263d3c]

                dark:text-white
              "
            >
              New Appointment
            </h2>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="
              grid
              h-9
              w-9
              place-items-center
              rounded-[12px]
              bg-white/55
              text-[#78908e]

              hover:bg-white

              dark:bg-[#203331]
            "
          >
            <X size={17} />
          </button>
        </div>

        <form
          onSubmit={submit}
          className="mt-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <SelectField
              label="Patient"
              name="patient"
              value={form.patient}
              onChange={change}
              options={patients}
            />

            <SelectField
              label="Doctor"
              name="doctor"
              value={form.doctor}
              onChange={change}
              options={doctors}
            />

            <InputField
              label="Date"
              name="date"
              type="date"
              value={form.date}
              onChange={change}
            />

            <InputField
              label="Time"
              name="time"
              type="time"
              value={form.time}
              onChange={change}
            />
          </div>

          <div className="mt-4">
            <InputField
              label="Reason for Visit"
              name="reason"
              value={form.reason}
              onChange={change}
              placeholder="Enter consultation reason"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="
                rounded-[12px]
                bg-[#edf7f4]
                px-5
                py-2.5
                text-[11px]
                font-bold
                text-[#607b79]

                dark:bg-[#203331]
                dark:text-[#91aaa7]
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                rounded-[12px]
                bg-[#18a999]
                px-5
                py-2.5
                text-[11px]
                font-bold
                text-white
                shadow-[0_8px_18px_rgba(24,169,153,0.20)]

                hover:bg-[#138f83]
              "
            >
              Create Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ------------------------------ */
/* DETAILS MODAL */
/* ------------------------------ */

const AppointmentDetails = ({
  appointment,
  onClose,
}) => (
  <div
    className="
      fixed
      inset-0
      z-[120]
      flex
      items-center
      justify-center
      bg-[#173332]/25
      p-4
      backdrop-blur-sm
    "
  >
    <div
      className="
        w-full
        max-w-[480px]
        rounded-[24px]
        border
        border-white/70
        bg-[#eff8f6]/95
        p-6
        shadow-[0_30px_70px_rgba(28,62,59,0.25)]

        dark:border-[#29413f]
        dark:bg-[#172827]
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className="
              text-[9px]
              font-extrabold
              uppercase
              tracking-[0.14em]
              text-[#18a999]
            "
          >
            Appointment
          </p>

          <h2
            className="
              mt-1
              text-[20px]
              font-black
              text-[#263d3c]

              dark:text-white
            "
          >
            {appointment.patient}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="
            grid
            h-9
            w-9
            place-items-center
            rounded-[12px]
            bg-white/55
            text-[#78908e]

            dark:bg-[#203331]
          "
        >
          <X size={17} />
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Detail
          label="Appointment No."
          value={
            appointment.number
          }
        />

        <Detail
          label="Status"
          value={
            appointment.status
          }
        />

        <Detail
          label="Doctor"
          value={
            appointment.doctor
          }
        />

        <Detail
          label="Date"
          value={
            appointment.date
          }
        />

        <Detail
          label="Time"
          value={
            appointment.time
          }
        />

        <Detail
          label="Reason"
          value={
            appointment.reason
          }
        />
      </div>
    </div>
  </div>
);

/* ------------------------------ */
/* FORM COMPONENTS */
/* ------------------------------ */

const InputField = ({
  label,
  ...props
}) => (
  <label>
    <span
      className="
        mb-2
        block
        text-[10px]
        font-bold
        text-[#607b79]

        dark:text-[#91aaa7]
      "
    >
      {label}
    </span>

    <input
      {...props}
      className="
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
        focus:ring-4
        focus:ring-[#dff3ee]

        dark:border-[#29413f]
        dark:bg-[#203331]
        dark:text-white
        dark:focus:ring-[#17413e]
      "
    />
  </label>
);

const SelectField = ({
  label,
  options,
  ...props
}) => (
  <label>
    <span
      className="
        mb-2
        block
        text-[10px]
        font-bold
        text-[#607b79]

        dark:text-[#91aaa7]
      "
    >
      {label}
    </span>

    <select
      {...props}
      className="
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
      "
    >
      <option value="">
        Select
      </option>

      {options.map(
        (option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        )
      )}
    </select>
  </label>
);

const Detail = ({
  label,
  value,
}) => (
  <div
    className="
      rounded-[14px]
      bg-[#edf7f4]
      p-3.5

      dark:bg-[#203331]
    "
  >
    <p
      className="
        text-[8px]
        font-extrabold
        uppercase
        tracking-wide
        text-[#8aa09e]
      "
    >
      {label}
    </p>

    <p
      className="
        mt-1
        text-[11px]
        font-bold
        text-[#38514f]

        dark:text-[#dce8e6]
      "
    >
      {value || "—"}
    </p>
  </div>
);

export default AppointmentManager;