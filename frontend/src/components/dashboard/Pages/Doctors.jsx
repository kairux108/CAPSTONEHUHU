import { useMemo, useState } from "react";

import {
  Search,
  Bell,
  Plus,
  Users,
  UserCheck,
  CalendarDays,
  Clock3,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Pencil,
  ChevronLeft,
  ChevronRight,
  X,
  Stethoscope,
} from "lucide-react";

const Doctors = () => {
  const [search, setSearch] = useState("");
  const [specialtyFilter, setSpecialtyFilter] =
    useState("All Specialties");
  const [statusFilter, setStatusFilter] =
    useState("All Statuses");
  const [sortBy, setSortBy] = useState("Name");

  const [selectedDoctorId, setSelectedDoctorId] =
    useState(1);

  const [activeTab, setActiveTab] =
    useState("Schedule");

  const [showAddDoctor, setShowAddDoctor] =
    useState(false);

  // =====================================================
  // DUMMY DOCTORS
  // =====================================================

  const doctors = [
    {
      id: 1,
      name: "Dr. Sarah Reyes",
      specialty: "General Medicine",
      phone: "0917 123 4567",
      email: "sarah.reyes@clinic.com",
      status: "Active",
      doctorId: "DR-001",
      initials: "SR",
      address: "St. Mary's Clinic, Tagum City",
      consultations: 84,
    },
    {
      id: 2,
      name: "Dr. Mark Dela Cruz",
      specialty: "Internal Medicine",
      phone: "0917 234 5678",
      email: "mark.delacruz@clinic.com",
      status: "Active",
      doctorId: "DR-002",
      initials: "MD",
      address: "CURA Main Clinic, Tagum City",
      consultations: 73,
    },
    {
      id: 3,
      name: "Dr. Anna Lim",
      specialty: "Pediatrics",
      phone: "0917 345 6789",
      email: "anna.lim@clinic.com",
      status: "Active",
      doctorId: "DR-003",
      initials: "AL",
      address: "CURA Main Clinic, Tagum City",
      consultations: 69,
    },
    {
      id: 4,
      name: "Dr. James Tan",
      specialty: "Family Medicine",
      phone: "0917 456 7890",
      email: "james.tan@clinic.com",
      status: "Active",
      doctorId: "DR-004",
      initials: "JT",
      address: "St. Mary's Clinic, Tagum City",
      consultations: 65,
    },
    {
      id: 5,
      name: "Dr. Karen Sato",
      specialty: "Obstetrics & Gynecology",
      phone: "0917 567 8901",
      email: "karen.sato@clinic.com",
      status: "On Leave",
      doctorId: "DR-005",
      initials: "KS",
      address: "CURA Main Clinic, Tagum City",
      consultations: 58,
    },
    {
      id: 6,
      name: "Dr. Michael Cruz",
      specialty: "Surgery",
      phone: "0917 678 9012",
      email: "michael.cruz@clinic.com",
      status: "Active",
      doctorId: "DR-006",
      initials: "MC",
      address: "St. Mary's Clinic, Tagum City",
      consultations: 51,
    },
    {
      id: 7,
      name: "Dr. Patricia Gomez",
      specialty: "Dermatology",
      phone: "0917 789 0123",
      email: "patricia.gomez@clinic.com",
      status: "Active",
      doctorId: "DR-007",
      initials: "PG",
      address: "CURA Main Clinic, Tagum City",
      consultations: 47,
    },
    {
      id: 8,
      name: "Dr. Robert Kim",
      specialty: "Cardiology",
      phone: "0917 890 1234",
      email: "robert.kim@clinic.com",
      status: "On Leave",
      doctorId: "DR-008",
      initials: "RK",
      address: "St. Mary's Clinic, Tagum City",
      consultations: 44,
    },
  ];

  const schedule = [
    {
      time: "08:00 AM",
      patient: "Emma Wilson",
      type: "General Consultation",
      initials: "EW",
      status: "In Room",
    },
    {
      time: "09:00 AM",
      patient: "James Lee",
      type: "Follow-up",
      initials: "JL",
      status: "Waiting",
    },
    {
      time: "10:00 AM",
      patient: "Daniel Chen",
      type: "General Consultation",
      initials: "DC",
      status: "Scheduled",
    },
    {
      time: "11:30 AM",
      patient: "Natalie Park",
      type: "Follow-up",
      initials: "NP",
      status: "Scheduled",
    },
    {
      time: "01:00 PM",
      patient: "Thomas Brown",
      type: "Chronic Care",
      initials: "TB",
      status: "Scheduled",
    },
  ];

  // =====================================================
  // FILTERING
  // =====================================================

  const filteredDoctors = useMemo(() => {
    let result = [...doctors];

    const keyword = search.toLowerCase().trim();

    if (keyword) {
      result = result.filter((doctor) =>
        [
          doctor.name,
          doctor.specialty,
          doctor.email,
          doctor.phone,
        ]
          .join(" ")
          .toLowerCase()
          .includes(keyword)
      );
    }

    if (specialtyFilter !== "All Specialties") {
      result = result.filter(
        (doctor) =>
          doctor.specialty === specialtyFilter
      );
    }

    if (statusFilter !== "All Statuses") {
      result = result.filter(
        (doctor) =>
          doctor.status === statusFilter
      );
    }

    if (sortBy === "Name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (sortBy === "Specialty") {
      result.sort((a, b) =>
        a.specialty.localeCompare(b.specialty)
      );
    }

    if (sortBy === "Consultations") {
      result.sort(
        (a, b) =>
          b.consultations - a.consultations
      );
    }

    return result;
  }, [
    search,
    specialtyFilter,
    statusFilter,
    sortBy,
  ]);

  const selectedDoctor =
    doctors.find(
      (doctor) =>
        doctor.id === selectedDoctorId
    ) || doctors[0];

  const statusStyle = (status) => {
    if (status === "Active") {
      return "bg-[#ddf8e9] text-[#24955c]";
    }

    return "bg-[#fff0cb] text-[#c88920]";
  };

  const appointmentStatusStyle = (status) => {
    if (status === "In Room") {
      return "bg-[#ddf8e8] text-[#26945d]";
    }

    if (status === "Waiting") {
      return "bg-[#fff1c9] text-[#c4881a]";
    }

    return "bg-[#e1f1ff] text-[#3186ca]";
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-5">

      {/* ============================================
          TOP HEADER
      ============================================= */}

      <div className="
        mb-4
        flex flex-col
        gap-4
        lg:flex-row
        lg:items-center
        lg:justify-between
      ">
        <div className="relative w-full max-w-xl">
          <Search
            size={16}
            className="
              absolute left-4 top-1/2
              -translate-y-1/2
              text-[#73839a]
            "
          />

          <input
            type="text"
            placeholder="Search patients, appointments, or records..."
            className="
              h-10
              w-full
              rounded-2xl
              border border-[#dae7e9]
              bg-white/90
              pl-10 pr-4
              text-[11px]
              text-[#354863]
              shadow-sm
              outline-none

              focus:border-[#89d9cb]
            "
          />
        </div>

        <div className="
          flex items-center
          justify-end
          gap-4
        ">
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
            bg-[#d7f5ed]
            text-[11px]
            font-semibold
            text-[#087c75]
          ">
            AD
          </div>

          <div className="hidden sm:block">
            <p className="
              text-[11px]
              font-semibold
              text-[#203450]
            ">
              Admin User
            </p>

            <p className="
              text-[9px]
              text-[#728198]
            ">
              Administrator
            </p>
          </div>
        </div>
      </div>

      {/* ============================================
          TITLE
      ============================================= */}

      <div className="
        mb-4
        flex flex-col
        gap-3

        sm:flex-row
        sm:items-end
        sm:justify-between
      ">
        <div>
          <h1 className="
            text-[24px]
            font-semibold
            text-[#152b49]
          ">
            Doctors
          </h1>

          <p className="
            mt-1
            text-[11px]
            text-[#6e7f96]
          ">
            Manage clinic doctors and their information.
          </p>
        </div>

        <button
          onClick={() =>
            setShowAddDoctor(true)
          }
          className="
            flex h-10
            items-center
            justify-center
            gap-2

            rounded-lg

            bg-[#08a88f]

            px-4

            text-[11px]
            font-medium
            text-white

            transition
            hover:bg-[#078f7b]
          "
        >
          <Plus size={16} />
          Add Doctor
        </button>
      </div>

      {/* ============================================
          STATISTICS
      ============================================= */}

      <div className="
        mb-4
        grid grid-cols-1
        gap-3

        sm:grid-cols-2
        xl:grid-cols-4
      ">

        <StatCard
          icon={Users}
          value="8"
          title="Total Doctors"
        />

        <StatCard
          icon={UserCheck}
          value="6"
          title="Active Doctors"
        />

        <StatCard
          icon={CalendarDays}
          value="2"
          title="On Leave"
        />

        <StatCard
          icon={Clock3}
          value="12"
          title="Avg. Appointments/Day"
        />

      </div>

      {/* ============================================
          SEARCH & FILTERS
      ============================================= */}

      <div className="
        mb-3
        grid grid-cols-1
        gap-2

        rounded-xl
        bg-white/85

        p-3
        shadow-sm

        md:grid-cols-[1fr_170px_150px_150px]
      ">
        <div className="relative">
          <Search
            size={14}
            className="
              absolute left-3 top-1/2
              -translate-y-1/2
              text-[#76869c]
            "
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search doctors by name, specialty, or email..."
            className="
              h-10
              w-full
              rounded-lg
              border border-[#dce7e9]
              bg-white

              pl-9 pr-3

              text-[10px]

              outline-none
            "
          />
        </div>

        <select
          value={specialtyFilter}
          onChange={(event) =>
            setSpecialtyFilter(
              event.target.value
            )
          }
          className="
            h-10
            rounded-lg
            border border-[#dce7e9]
            bg-white
            px-3
            text-[10px]
            text-[#53657d]
            outline-none
          "
        >
          <option>All Specialties</option>
          <option>General Medicine</option>
          <option>Internal Medicine</option>
          <option>Pediatrics</option>
          <option>Family Medicine</option>
          <option>
            Obstetrics & Gynecology
          </option>
          <option>Surgery</option>
          <option>Dermatology</option>
          <option>Cardiology</option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
          className="
            h-10
            rounded-lg
            border border-[#dce7e9]
            bg-white
            px-3
            text-[10px]
            text-[#53657d]
            outline-none
          "
        >
          <option>All Statuses</option>
          <option>Active</option>
          <option>On Leave</option>
        </select>

        <select
          value={sortBy}
          onChange={(event) =>
            setSortBy(event.target.value)
          }
          className="
            h-10
            rounded-lg
            border border-[#dce7e9]
            bg-white
            px-3
            text-[10px]
            text-[#53657d]
            outline-none
          "
        >
          <option value="Name">
            Sort by: Name
          </option>

          <option value="Specialty">
            Sort by: Specialty
          </option>

          <option value="Consultations">
            Sort by: Consultations
          </option>
        </select>
      </div>

      {/* ============================================
          CONTENT GRID
      ============================================= */}

      <div className="
        grid grid-cols-1
        gap-4

        xl:grid-cols-[1.35fr_1fr]
      ">

        {/* ========================================
            DOCTOR TABLE
        ========================================= */}

        <section className="
          overflow-hidden

          rounded-2xl

          border border-white/60

          bg-white/90

          shadow-[0_4px_18px_rgba(30,90,90,0.06)]
        ">

          <div className="px-4 py-4">
            <h2 className="
              text-[11px]
              font-semibold
              text-[#203652]
            ">
              Doctors
              <span className="
                ml-1
                font-normal
                text-[#718198]
              ">
                ({filteredDoctors.length})
              </span>
            </h2>
          </div>

          <div className="overflow-x-auto">

            <table className="
              w-full
              min-w-[670px]
            ">

              <thead>
                <tr className="bg-[#f2f8f9]">

                  {[
                    "Name",
                    "Specialty",
                    "Contact",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="
                        px-4 py-2
                        text-left
                        text-[8px]
                        font-medium
                        text-[#718097]
                      "
                    >
                      {heading}
                    </th>
                  ))}

                </tr>
              </thead>

              <tbody>
                {filteredDoctors.map(
                  (doctor) => (
                    <tr
                      key={doctor.id}
                      onClick={() =>
                        setSelectedDoctorId(
                          doctor.id
                        )
                      }
                      className={`
                        cursor-pointer

                        border-b
                        border-[#edf2f3]

                        transition-colors

                        hover:bg-[#f4fbfa]

                        ${
                          selectedDoctorId ===
                          doctor.id
                            ? "bg-[#f0faf8] border-l-2 border-l-[#10ae97]"
                            : ""
                        }
                      `}
                    >

                      {/* NAME */}

                      <td className="px-4 py-2.5">
                        <div className="
                          flex
                          items-center
                          gap-2
                        ">
                          <div className="
                            flex h-8 w-8
                            shrink-0
                            items-center
                            justify-center

                            rounded-full

                            bg-[#e6f3ff]

                            text-[9px]
                            font-semibold
                            text-[#278bf1]
                          ">
                            {doctor.initials}
                          </div>

                          <div>
                            <p className="
                              text-[9px]
                              font-semibold
                              text-[#253a58]
                            ">
                              {doctor.name}
                            </p>

                            <p className="
                              text-[8px]
                              text-[#8190a4]
                            ">
                              ID: {doctor.doctorId}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SPECIALTY */}

                      <td className="
                        px-4 py-2.5
                        text-[8px]
                        text-[#536880]
                      ">
                        {doctor.specialty}
                      </td>

                      {/* CONTACT */}

                      <td className="
                        px-4 py-2.5
                      ">
                        <p className="
                          text-[8px]
                          text-[#52657d]
                        ">
                          {doctor.phone}
                        </p>

                        <p className="
                          text-[7px]
                          text-[#8996a7]
                        ">
                          {doctor.email}
                        </p>
                      </td>

                      {/* STATUS */}

                      <td className="px-4 py-2.5">
                        <span
                          className={`
                            rounded-full
                            px-2 py-1
                            text-[8px]

                            ${statusStyle(
                              doctor.status
                            )}
                          `}
                        >
                          {doctor.status}
                        </span>
                      </td>

                      {/* ACTION */}

                      <td className="px-4 py-2.5">
                        <button
                          onClick={(event) =>
                            event.stopPropagation()
                          }
                          className="
                            text-[#6f8096]
                            hover:text-[#087c75]
                          "
                        >
                          <MoreVertical
                            size={15}
                          />
                        </button>
                      </td>

                    </tr>
                  )
                )}
              </tbody>

            </table>

          </div>

          {/* TABLE FOOTER */}

          <div className="
            flex
            items-center
            justify-between

            border-t border-[#edf2f3]

            px-4 py-3
          ">
            <p className="
              text-[8px]
              text-[#748299]
            ">
              Showing 1 to{" "}
              {filteredDoctors.length} of{" "}
              {doctors.length} doctors
            </p>

            <div className="
              flex items-center gap-2
            ">
              <button className="
                flex h-7 w-7
                items-center
                justify-center
                rounded-md
                border border-[#dce7e9]
              ">
                <ChevronLeft size={13} />
              </button>

              <button className="
                flex h-7 w-7
                items-center
                justify-center

                rounded-md

                bg-[#d9f8f1]

                text-[9px]
                text-[#087c75]
              ">
                1
              </button>

              <button className="
                flex h-7 w-7
                items-center
                justify-center
                rounded-md
                border border-[#dce7e9]
              ">
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

        </section>

        {/* ========================================
            DOCTOR DETAILS
        ========================================= */}

        <section className="
          rounded-2xl

          border border-white/60

          bg-white/90

          p-4

          shadow-[0_4px_18px_rgba(30,90,90,0.06)]
        ">

          {/* PROFILE */}

          <div className="
            mb-4
            flex
            items-start
            gap-3
          ">

            <div className="
              flex h-14 w-14
              shrink-0
              items-center
              justify-center

              rounded-full

              bg-[#dff4f0]

              text-sm
              font-semibold
              text-[#078b79]
            ">
              {selectedDoctor.initials}
            </div>

            <div className="flex-1">

              <div className="
                flex
                items-start
                justify-between
                gap-2
              ">

                <div>
                  <h3 className="
                    text-[13px]
                    font-semibold
                    text-[#203652]
                  ">
                    {selectedDoctor.name}
                  </h3>

                  <p className="
                    mt-0.5
                    text-[9px]
                    text-[#64758c]
                  ">
                    {selectedDoctor.specialty}
                  </p>

                  <p className="
                    mt-1
                    text-[8px]
                    text-[#8896a8]
                  ">
                    ID:{" "}
                    {selectedDoctor.doctorId}
                  </p>
                </div>

                <span
                  className={`
                    rounded-full
                    px-2 py-1
                    text-[8px]

                    ${statusStyle(
                      selectedDoctor.status
                    )}
                  `}
                >
                  {selectedDoctor.status}
                </span>

              </div>

            </div>
          </div>

          {/* CONTACT */}

          <div className="
            mb-4
            space-y-2
          ">

            <DoctorInfo
              icon={Phone}
              value={selectedDoctor.phone}
            />

            <DoctorInfo
              icon={Mail}
              value={selectedDoctor.email}
            />

            <DoctorInfo
              icon={MapPin}
              value={selectedDoctor.address}
            />

          </div>

          <div className="mb-4 flex justify-end">
            <button className="
              flex items-center
              gap-2

              rounded-lg

              border border-[#79d7c9]

              px-3 py-2

              text-[9px]
              font-medium
              text-[#078b79]

              transition

              hover:bg-[#e5f8f4]
            ">
              <Pencil size={13} />
              Edit Information
            </button>
          </div>

          {/* TABS */}

          <div className="
            mb-4
            flex
            overflow-x-auto

            border-b
            border-[#e8efef]
          ">

            {[
              "Schedule",
              "Profile",
              "Specialization",
              "Consultations",
              "Reports",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab)
                }
                className={`
                  whitespace-nowrap

                  px-3 py-2

                  text-[8px]
                  font-medium

                  ${
                    activeTab === tab
                      ? "border-b-2 border-[#11ad96] text-[#078b79]"
                      : "text-[#718198]"
                  }
                `}
              >
                {tab}
              </button>
            ))}

          </div>

          {/* SCHEDULE */}

          {activeTab === "Schedule" && (
            <>
              <div className="
                mb-3
                flex
                items-center
                justify-between
              ">
                <h4 className="
                  text-[10px]
                  font-semibold
                  text-[#203652]
                ">
                  Today's Schedule
                </h4>

                <span className="
                  text-[8px]
                  text-[#7a899c]
                ">
                  Sep 20, 2026
                </span>
              </div>

              <div className="space-y-2">

                {schedule.map((item) => (
                  <div
                    key={`${item.time}-${item.patient}`}
                    className="
                      grid
                      grid-cols-[58px_1fr_auto]
                      items-center
                      gap-2

                      rounded-lg

                      p-2

                      transition

                      hover:bg-[#f4faf9]
                    "
                  >

                    <span className="
                      text-[8px]
                      text-[#66778e]
                    ">
                      {item.time}
                    </span>

                    <div className="
                      flex
                      items-center
                      gap-2
                    ">
                      <div className="
                        flex h-7 w-7
                        items-center
                        justify-center

                        rounded-full

                        bg-[#e7f2ff]

                        text-[8px]
                        font-semibold
                        text-[#258cff]
                      ">
                        {item.initials}
                      </div>

                      <div>
                        <p className="
                          text-[9px]
                          font-medium
                          text-[#263a57]
                        ">
                          {item.patient}
                        </p>

                        <p className="
                          text-[7px]
                          text-[#8391a3]
                        ">
                          {item.type}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`
                        rounded-full

                        px-2 py-1

                        text-[7px]

                        ${appointmentStatusStyle(
                          item.status
                        )}
                      `}
                    >
                      {item.status}
                    </span>

                  </div>
                ))}

              </div>

              <div className="
                mt-4
                flex
                justify-end
              ">
                <button className="
                  flex items-center
                  gap-2

                  rounded-lg

                  border border-[#6fd5c5]

                  px-3 py-2

                  text-[8px]
                  font-medium
                  text-[#078b79]

                  hover:bg-[#e3f7f3]
                ">
                  <CalendarDays size={13} />
                  View Full Schedule
                </button>
              </div>
            </>
          )}

          {/* PROFILE TAB */}

          {activeTab === "Profile" && (
            <div className="
              rounded-xl
              bg-[#f3faf9]
              p-4
            ">
              <p className="
                text-[10px]
                text-[#52657d]
              ">
                Doctor profile information will
                appear here.
              </p>
            </div>
          )}

          {activeTab ===
            "Specialization" && (
            <div className="
              rounded-xl
              bg-[#f3faf9]
              p-4
            ">
              <p className="
                text-[10px]
                text-[#52657d]
              ">
                Specialty:{" "}
                {selectedDoctor.specialty}
              </p>
            </div>
          )}

          {activeTab ===
            "Consultations" && (
            <div className="
              rounded-xl
              bg-[#f3faf9]
              p-4
            ">
              <p className="
                text-[10px]
                text-[#52657d]
              ">
                Total consultations:{" "}
                {
                  selectedDoctor.consultations
                }
              </p>
            </div>
          )}

          {activeTab === "Reports" && (
            <div className="
              rounded-xl
              bg-[#f3faf9]
              p-4
            ">
              <p className="
                text-[10px]
                text-[#52657d]
              ">
                Doctor reports will appear
                here.
              </p>
            </div>
          )}

        </section>

      </div>

      {/* ============================================
          ADD DOCTOR MODAL
      ============================================= */}

      {showAddDoctor && (
        <div className="
          fixed inset-0
          z-[100]

          flex
          items-center
          justify-center

          bg-black/35

          p-4
        ">

          <div className="
            w-full
            max-w-md

            rounded-2xl

            bg-white

            p-5

            shadow-2xl
          ">

            <div className="
              mb-5
              flex
              items-center
              justify-between
            ">

              <div>
                <h2 className="
                  text-lg
                  font-semibold
                  text-[#203652]
                ">
                  Add Doctor
                </h2>

                <p className="
                  text-[10px]
                  text-[#7c8a9e]
                ">
                  Create a dummy doctor record.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowAddDoctor(false)
                }
              >
                <X size={19} />
              </button>

            </div>

            <div className="space-y-3">

              <input
                placeholder="Doctor name"
                className="doctor-input"
              />

              <select className="doctor-input">
                <option>
                  Select specialty
                </option>
                <option>
                  General Medicine
                </option>
                <option>
                  Internal Medicine
                </option>
                <option>Pediatrics</option>
                <option>Cardiology</option>
              </select>

              <input
                placeholder="Contact number"
                className="doctor-input"
              />

              <input
                type="email"
                placeholder="Email address"
                className="doctor-input"
              />

            </div>

            <div className="
              mt-5
              flex
              justify-end
              gap-2
            ">

              <button
                onClick={() =>
                  setShowAddDoctor(false)
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
                  setShowAddDoctor(false)
                }
                className="
                  rounded-lg
                  bg-[#0bad92]
                  px-4 py-2
                  text-[10px]
                  text-white
                "
              >
                Add Doctor
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};


// =====================================================
// SMALL COMPONENTS
// =====================================================

const StatCard = ({
  icon: Icon,
  value,
  title,
}) => {
  return (
    <div className="
      flex min-h-[85px]
      items-center
      gap-3

      rounded-xl

      border border-white/60

      bg-white/90

      p-4

      shadow-[0_4px_15px_rgba(30,90,90,0.05)]
    ">
      <div className="
        flex h-10 w-10
        items-center
        justify-center

        rounded-xl

        bg-[#e4f8f4]
      ">
        <Icon
          size={20}
          className="text-[#0bad92]"
        />
      </div>

      <div>
        <p className="
          text-xl
          font-semibold
          leading-none
          text-[#17304e]
        ">
          {value}
        </p>

        <p className="
          mt-1
          text-[8px]
          text-[#738299]
        ">
          {title}
        </p>
      </div>
    </div>
  );
};


const DoctorInfo = ({
  icon: Icon,
  value,
}) => {
  return (
    <div className="
      flex
      items-center
      gap-2
    ">
      <Icon
        size={13}
        className="text-[#687a91]"
      />

      <span className="
        text-[8px]
        text-[#53657d]
      ">
        {value}
      </span>
    </div>
  );
};

export default Doctors;