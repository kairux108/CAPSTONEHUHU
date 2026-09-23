import { useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";

const Appointments = () => {
  const [activeTab, setActiveTab] = useState("All Appointments");

  const [doctorFilter, setDoctorFilter] = useState("All Doctors");
  const [typeFilter, setTypeFilter] = useState("All Visit Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const [selectedDate, setSelectedDate] = useState(20);

  const [showNewAppointment, setShowNewAppointment] = useState(false);

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const appointments = [
    {
      id: 1,
      time: "08:00 AM",
      patient: "Emma Wilson",
      patientId: "PT-00421",
      age: 32,
      gender: "F",
      initials: "EM",
      doctor: "Dr. Sarah Reyes",
      type: "General Consultation",
      status: "In Room",
      contact: "0917 123 4567",
      email: "emma.wilson@email.com",
      address: "Purok 1, Tagum City",
      reason: "Regular check-up and consultation",
      date: "Sep 20, 2026",
    },
    {
      id: 2,
      time: "08:30 AM",
      patient: "James Lee",
      patientId: "PT-00387",
      age: 45,
      gender: "M",
      initials: "JL",
      doctor: "Dr. Mark Dela Cruz",
      type: "Follow-up",
      status: "Waiting",
      contact: "0918 234 5678",
      email: "james.lee@email.com",
      address: "Tagum City",
      reason: "Follow-up consultation",
      date: "Sep 20, 2026",
    },
    {
      id: 3,
      time: "09:00 AM",
      patient: "Sophia Patel",
      patientId: "PT-00456",
      age: 28,
      gender: "F",
      initials: "SP",
      doctor: "Dr. Anna Lim",
      type: "General Consultation",
      status: "Scheduled",
      contact: "0919 345 6789",
      email: "sophia@email.com",
      address: "Apokon, Tagum City",
      reason: "General consultation",
      date: "Sep 20, 2026",
    },
    {
      id: 4,
      time: "09:30 AM",
      patient: "Michael Roberts",
      patientId: "PT-00312",
      age: 61,
      gender: "M",
      initials: "MR",
      doctor: "Dr. James Tan",
      type: "Chronic Care",
      status: "Scheduled",
      contact: "0920 456 7890",
      email: "michael@email.com",
      address: "Visayan Village, Tagum City",
      reason: "Chronic care monitoring",
      date: "Sep 20, 2026",
    },
    {
      id: 5,
      time: "10:00 AM",
      patient: "Aisha Khan",
      patientId: "PT-00498",
      age: 35,
      gender: "F",
      initials: "AN",
      doctor: "Dr. Sarah Reyes",
      type: "Follow-up",
      status: "Scheduled",
      contact: "0921 567 8901",
      email: "aisha@email.com",
      address: "Mankilam, Tagum City",
      reason: "Follow-up consultation",
      date: "Sep 20, 2026",
    },
    {
      id: 6,
      time: "10:30 AM",
      patient: "Daniel Chen",
      patientId: "PT-00411",
      age: 50,
      gender: "M",
      initials: "DC",
      doctor: "Dr. Anna Lim",
      type: "General Consultation",
      status: "Scheduled",
      contact: "0922 678 9012",
      email: "daniel@email.com",
      address: "Magugpo, Tagum City",
      reason: "General consultation",
      date: "Sep 20, 2026",
    },
    {
      id: 7,
      time: "11:00 AM",
      patient: "Lily Tan",
      patientId: "PT-00462",
      age: 29,
      gender: "F",
      initials: "LT",
      doctor: "Dr. Anna Lim",
      type: "Health Check-up",
      status: "Scheduled",
      contact: "0923 789 0123",
      email: "lily@email.com",
      address: "La Filipina, Tagum City",
      reason: "Routine health check-up",
      date: "Sep 20, 2026",
    },
    {
      id: 8,
      time: "11:30 AM",
      patient: "Ravi Kumar",
      patientId: "PT-00473",
      age: 40,
      gender: "M",
      initials: "RK",
      doctor: "Dr. James Tan",
      type: "Follow-up",
      status: "Scheduled",
      contact: "0924 890 1234",
      email: "ravi@email.com",
      address: "Tagum City",
      reason: "Follow-up consultation",
      date: "Sep 20, 2026",
    },
  ];

  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      const matchDoctor =
        doctorFilter === "All Doctors" ||
        item.doctor === doctorFilter;

      const matchType =
        typeFilter === "All Visit Types" ||
        item.type === typeFilter;

      const matchStatus =
        statusFilter === "All Statuses" ||
        item.status === statusFilter;

      let matchTab = true;

      if (activeTab === "Scheduled") {
        matchTab = item.status === "Scheduled";
      }

      if (activeTab === "Walk-ins") {
        matchTab = item.type === "Walk-in";
      }

      if (activeTab === "Completed") {
        matchTab = item.status === "Completed";
      }

      if (activeTab === "Cancelled") {
        matchTab = item.status === "Cancelled";
      }

      return matchDoctor && matchType && matchStatus && matchTab;
    });
  }, [
    activeTab,
    doctorFilter,
    typeFilter,
    statusFilter,
  ]);

  const currentAppointment =
    selectedAppointment || appointments[0];

  const statusStyle = (status) => {
    if (status === "In Room") {
      return "bg-[#dff8e8] text-[#26945d]";
    }

    if (status === "Waiting") {
      return "bg-[#fff2c9] text-[#c4881a]";
    }

    if (status === "Completed") {
      return "bg-[#e3f7ef] text-[#168b6d]";
    }

    if (status === "Cancelled") {
      return "bg-[#ffe4e7] text-[#d95864]";
    }

    return "bg-[#e1f1ff] text-[#3186ca]";
  };

  const calendarDays = [
    30, 31,
    1, 2, 3, 4, 5,
    6, 7, 8, 9, 10, 11, 12,
    13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30,
  ];

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-5">

      {/* ================= TOP BAR ================= */}

      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="relative w-full max-w-xl">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71819a]"
          />

          <input
            type="text"
            placeholder="Search patients, appointments, or records..."
            className="
              h-10 w-full
              rounded-2xl
              border border-[#d9e6e9]
              bg-white/90
              pl-10 pr-4
              text-[11px]
              outline-none
              shadow-sm
              focus:border-[#99dcd1]
            "
          />
        </div>

        <div className="flex items-center justify-end gap-4">

          <button className="relative text-[#40536f]">
            <Bell size={18} />

            <span className="
              absolute -right-1 -top-1
              h-2 w-2
              rounded-full
              bg-red-500
              ring-2 ring-white
            " />
          </button>

          <div className="
            flex h-9 w-9
            items-center justify-center
            rounded-full
            bg-[#d8f5ee]
            text-[11px]
            font-semibold
            text-[#087c75]
          ">
            AD
          </div>

          <div className="hidden sm:block">
            <p className="text-[11px] font-semibold text-[#1e3150]">
              Admin User
            </p>

            <p className="text-[9px] text-[#718199]">
              Administrator
            </p>
          </div>

        </div>
      </div>


      {/* ================= PAGE TITLE ================= */}

      <div className="
        mb-4
        flex flex-col gap-3
        sm:flex-row
        sm:items-end
        sm:justify-between
      ">

        <div>
          <h1 className="
            text-[23px]
            font-semibold
            text-[#152b49]
          ">
            Appointments
          </h1>

          <p className="mt-1 text-[11px] text-[#6e7f96]">
            Manage and track all clinic appointments.
          </p>
        </div>

        <button
          onClick={() => setShowNewAppointment(true)}
          className="
            flex h-10
            items-center justify-center
            gap-2
            rounded-lg
            bg-[#08a88f]
            px-4
            text-[11px]
            font-medium
            text-white
            shadow-sm
            transition
            hover:bg-[#078f7b]
          "
        >
          <Plus size={16} />
          New Appointment
        </button>

      </div>


      {/* ================= TABS ================= */}

      <div className="
        mb-4
        flex gap-2
        overflow-x-auto
        rounded-xl
        bg-white/40
        p-1
      ">

        {[
          "All Appointments",
          "Scheduled",
          "Walk-ins",
          "Completed",
          "Cancelled",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              whitespace-nowrap
              rounded-lg
              px-4 py-2
              text-[10px]
              font-medium
              transition

              ${
                activeTab === tab
                  ? "bg-[#dff8f2] text-[#078a79]"
                  : "text-[#586b84] hover:bg-[#edf8f6]"
              }
            `}
          >
            {tab}
          </button>
        ))}

      </div>


      {/* ================= MAIN GRID ================= */}

      <div className="
        grid grid-cols-1
        gap-4
        xl:grid-cols-[1.7fr_0.85fr]
      ">

        {/* ================= LEFT ================= */}

        <div>

          {/* FILTERS */}

          <div className="
            mb-3
            grid grid-cols-1
            gap-2
            rounded-xl
            bg-white/85
            p-3
            shadow-sm

            sm:grid-cols-2
            lg:grid-cols-4
          ">

            <button className="
              flex h-10
              items-center gap-2
              rounded-lg
              border border-[#dfe9eb]
              bg-white
              px-3
              text-[10px]
              text-[#52657d]
            ">
              <CalendarDays size={15} />
              Sep 20, 2026
            </button>


            <select
              value={doctorFilter}
              onChange={(e) =>
                setDoctorFilter(e.target.value)
              }
              className="
                h-10
                rounded-lg
                border border-[#dfe9eb]
                bg-white
                px-3
                text-[10px]
                text-[#52657d]
                outline-none
              "
            >
              <option>All Doctors</option>
              <option>Dr. Sarah Reyes</option>
              <option>Dr. Mark Dela Cruz</option>
              <option>Dr. Anna Lim</option>
              <option>Dr. James Tan</option>
            </select>


            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value)
              }
              className="
                h-10
                rounded-lg
                border border-[#dfe9eb]
                bg-white
                px-3
                text-[10px]
                text-[#52657d]
                outline-none
              "
            >
              <option>All Visit Types</option>
              <option>General Consultation</option>
              <option>Follow-up</option>
              <option>Chronic Care</option>
              <option>Health Check-up</option>
            </select>


            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="
                h-10
                rounded-lg
                border border-[#dfe9eb]
                bg-white
                px-3
                text-[10px]
                text-[#52657d]
                outline-none
              "
            >
              <option>All Statuses</option>
              <option>Scheduled</option>
              <option>Waiting</option>
              <option>In Room</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>

          </div>


          {/* TABLE */}

          <section className="
            overflow-hidden
            rounded-2xl
            border border-white/60
            bg-white/90
            shadow-[0_4px_18px_rgba(30,90,90,0.06)]
          ">

            <div className="px-4 py-4">
              <h2 className="text-[11px] font-semibold text-[#203652]">
                Appointments
                <span className="ml-1 font-normal text-[#728199]">
                  ({filteredAppointments.length})
                </span>
              </h2>
            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead>
                  <tr className="bg-[#f2f8f9]">

                    {[
                      "Time",
                      "Patient",
                      "Doctor",
                      "Visit Type",
                      "Status",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="
                          px-4 py-2
                          text-left
                          text-[9px]
                          font-medium
                          text-[#708097]
                        "
                      >
                        {heading}
                      </th>
                    ))}

                  </tr>
                </thead>


                <tbody>

                  {filteredAppointments.map((item) => (

                    <tr
                      key={item.id}
                      onClick={() =>
                        setSelectedAppointment(item)
                      }
                      className="
                        cursor-pointer
                        border-b border-[#edf2f3]
                        transition
                        hover:bg-[#f6fcfa]
                      "
                    >

                      <td className="px-4 py-2.5 text-[9px] text-[#536880]">
                        {item.time}
                      </td>


                      <td className="px-4 py-2.5">

                        <div className="flex items-center gap-2">

                          <div className="
                            flex h-8 w-8
                            items-center justify-center
                            rounded-full
                            bg-[#e5f1ff]
                            text-[9px]
                            font-semibold
                            text-[#258cff]
                          ">
                            {item.initials}
                          </div>

                          <div>
                            <p className="text-[9px] font-semibold text-[#253a58]">
                              {item.patient}
                            </p>

                            <p className="text-[8px] text-[#8190a4]">
                              ID: {item.patientId} • {item.age} yrs • {item.gender}
                            </p>
                          </div>

                        </div>

                      </td>


                      <td className="px-4 py-2.5 text-[9px] text-[#536880]">
                        {item.doctor}
                      </td>


                      <td className="px-4 py-2.5 text-[9px] text-[#536880]">
                        {item.type}
                      </td>


                      <td className="px-4 py-2.5">
                        <span
                          className={`
                            rounded-full
                            px-2.5 py-1
                            text-[8px]
                            ${statusStyle(item.status)}
                          `}
                        >
                          {item.status}
                        </span>
                      </td>


                      <td className="px-4 py-2.5">
                        <button
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                          className="text-[#6e8097]"
                        >
                          <MoreVertical size={15} />
                        </button>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>


            {/* PAGINATION */}

            <div className="
              flex flex-col gap-3
              border-t border-[#edf2f3]
              px-4 py-3

              sm:flex-row
              sm:items-center
              sm:justify-between
            ">

              <p className="text-[9px] text-[#6d7c92]">
                Showing 1 to {filteredAppointments.length} of 32 appointments
              </p>


              <div className="flex items-center gap-2">

                <button className="
                  flex h-7 w-7
                  items-center justify-center
                  rounded-md
                  border border-[#dfe8eb]
                ">
                  <ChevronLeft size={13} />
                </button>

                {[1, 2, 3, 4].map((page) => (
                  <button
                    key={page}
                    className={`
                      flex h-7 w-7
                      items-center justify-center
                      rounded-md
                      text-[9px]

                      ${
                        page === 1
                          ? "bg-[#d9f8f1] text-[#078b79]"
                          : "text-[#66778e]"
                      }
                    `}
                  >
                    {page}
                  </button>
                ))}

                <button className="
                  flex h-7 w-7
                  items-center justify-center
                  rounded-md
                  border border-[#dfe8eb]
                ">
                  <ChevronRight size={13} />
                </button>

              </div>

            </div>

          </section>

        </div>


        {/* ================= RIGHT ================= */}

        <div className="space-y-4">

          {/* CALENDAR */}

          <section className="
            rounded-2xl
            border border-white/60
            bg-white/90
            p-4
            shadow-[0_4px_18px_rgba(30,90,90,0.06)]
          ">

            <div className="mb-4 flex items-center justify-between">

              <h3 className="text-[12px] font-semibold text-[#203652]">
                September 2026
              </h3>

              <div className="flex gap-2">
                <ChevronLeft size={15} />
                <ChevronRight size={15} />
              </div>

            </div>


            <div className="
              mb-2
              grid grid-cols-7
              text-center
              text-[8px]
              text-[#8492a4]
            ">

              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day) => (
                  <span key={day}>{day}</span>
                )
              )}

            </div>


            <div className="grid grid-cols-7 gap-1">

              {calendarDays.map((day, index) => (

                <button
                  key={`${day}-${index}`}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    flex h-7
                    items-center justify-center
                    rounded-full
                    text-[8px]

                    ${
                      selectedDate === day
                        ? "bg-[#0caf96] text-white"
                        : "text-[#52657d] hover:bg-[#e5f7f3]"
                    }
                  `}
                >
                  {day}
                </button>

              ))}

            </div>

          </section>


          {/* SELECTED APPOINTMENT */}

          <section className="
            rounded-2xl
            border border-white/60
            bg-white/90
            p-4
            shadow-[0_4px_18px_rgba(30,90,90,0.06)]
          ">

            <div className="mb-4 flex items-center gap-3">

              <div className="
                flex h-10 w-10
                items-center justify-center
                rounded-full
                bg-[#e4f1ff]
                text-[11px]
                font-semibold
                text-[#258cff]
              ">
                {currentAppointment.initials}
              </div>

              <div className="flex-1">
                <p className="text-[12px] font-semibold text-[#203652]">
                  {currentAppointment.patient}
                </p>

                <p className="text-[9px] text-[#8090a4]">
                  ID: {currentAppointment.patientId}
                </p>
              </div>

              <span
                className={`
                  rounded-full
                  px-2 py-1
                  text-[8px]
                  ${statusStyle(
                    currentAppointment.status
                  )}
                `}
              >
                {currentAppointment.status}
              </span>

            </div>


            {/* DETAIL TABS */}

            <div className="
              mb-4
              flex border-b border-[#e9efef]
            ">

              <button className="
                border-b-2
                border-[#13ad96]
                px-3 py-2
                text-[9px]
                font-medium
                text-[#0c927f]
              ">
                Details
              </button>

              <button className="
                px-3 py-2
                text-[9px]
                text-[#758499]
              ">
                Notes
              </button>

              <button className="
                px-3 py-2
                text-[9px]
                text-[#758499]
              ">
                History
              </button>

            </div>


            <div className="space-y-3">

              <Detail
                icon={CalendarDays}
                label="Date & Time"
                value={`${currentAppointment.date} - ${currentAppointment.time}`}
              />

              <Detail
                icon={Stethoscope}
                label="Doctor"
                value={currentAppointment.doctor}
              />

              <Detail
                icon={UserRound}
                label="Visit Type"
                value={currentAppointment.type}
              />

              <Detail
                icon={Phone}
                label="Contact Number"
                value={currentAppointment.contact}
              />

              <Detail
                icon={Mail}
                label="Email"
                value={currentAppointment.email}
              />

              <Detail
                icon={MapPin}
                label="Address"
                value={currentAppointment.address}
              />

              <Detail
                icon={Clock3}
                label="Reason for Visit"
                value={currentAppointment.reason}
              />

            </div>


            {/* ACTION BUTTONS */}

            <div className="
              mt-5
              grid grid-cols-3
              gap-2
            ">

              <button className="
                h-9
                rounded-lg
                border border-[#39bda9]
                text-[9px]
                font-medium
                text-[#0b9883]
                transition
                hover:bg-[#e5f8f4]
              ">
                Reschedule
              </button>

              <button className="
                h-9
                rounded-lg
                border border-[#ff8a91]
                text-[9px]
                font-medium
                text-[#dd5964]
                transition
                hover:bg-[#fff0f1]
              ">
                Cancel
              </button>

              <button className="
                h-9
                rounded-lg
                bg-[#0bad92]
                text-[9px]
                font-medium
                text-white
                transition
                hover:bg-[#08967f]
              ">
                Edit
              </button>

            </div>

          </section>

        </div>

      </div>


      {/* ================= NEW APPOINTMENT MODAL ================= */}

      {showNewAppointment && (

        <div className="
          fixed inset-0 z-[100]
          flex items-center justify-center
          bg-black/35
          p-4
        ">

          <div className="
            w-full max-w-md
            rounded-2xl
            bg-white
            p-5
            shadow-2xl
          ">

            <div className="mb-5 flex items-center justify-between">

              <div>
                <h2 className="text-lg font-semibold text-[#203652]">
                  New Appointment
                </h2>

                <p className="text-[10px] text-[#7c8a9e]">
                  Add a dummy appointment.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowNewAppointment(false)
                }
              >
                <X size={19} />
              </button>

            </div>


            <div className="space-y-3">

              <input
                placeholder="Patient name"
                className="
                  h-10 w-full
                  rounded-lg
                  border border-[#dce6e9]
                  px-3
                  text-[11px]
                  outline-none
                "
              />

              <select className="
                h-10 w-full
                rounded-lg
                border border-[#dce6e9]
                px-3
                text-[11px]
                outline-none
              ">
                <option>Select doctor</option>
                <option>Dr. Sarah Reyes</option>
                <option>Dr. Anna Lim</option>
              </select>

              <input
                type="date"
                className="
                  h-10 w-full
                  rounded-lg
                  border border-[#dce6e9]
                  px-3
                  text-[11px]
                  outline-none
                "
              />

              <input
                type="time"
                className="
                  h-10 w-full
                  rounded-lg
                  border border-[#dce6e9]
                  px-3
                  text-[11px]
                  outline-none
                "
              />

            </div>


            <div className="mt-5 flex justify-end gap-2">

              <button
                onClick={() =>
                  setShowNewAppointment(false)
                }
                className="
                  rounded-lg
                  border border-[#dce6e9]
                  px-4 py-2
                  text-[10px]
                  text-[#617188]
                "
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  setShowNewAppointment(false)
                }
                className="
                  rounded-lg
                  bg-[#0bad92]
                  px-4 py-2
                  text-[10px]
                  text-white
                "
              >
                Create Appointment
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};


const Detail = ({ icon: Icon, label, value }) => {
  return (
    <div className="
      grid grid-cols-[18px_90px_1fr]
      items-start
      gap-2
    ">

      <Icon
        size={14}
        className="mt-0.5 text-[#60738d]"
      />

      <span className="text-[8px] font-medium text-[#596b83]">
        {label}
      </span>

      <span className="text-[8px] text-[#40526d]">
        {value}
      </span>

    </div>
  );
};

export default Appointments;