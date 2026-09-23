import { useMemo, useState } from "react";

import {
  Search,
  Bell,
  Plus,
  Users,
  UserPlus,
  Clock3,
  CalendarDays,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  Pencil,
  ChevronLeft,
  ChevronRight,
  X,
  HeartPulse,
  Pill,
  Stethoscope,
  CalendarPlus,
  Download,
  ClipboardList,
} from "lucide-react";

const Patients = () => {
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("All Genders");
  const [ageFilter, setAgeFilter] = useState("All Age Groups");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const [activeTab, setActiveTab] = useState("All Patients");
  const [selectedPatientId, setSelectedPatientId] = useState(1);
  const [detailTab, setDetailTab] = useState("Overview");

  const [showAddPatient, setShowAddPatient] = useState(false);

  // =====================================================
  // DUMMY DATA
  // =====================================================

  const patients = [
    {
      id: 1,
      patientId: "PT-00421",
      name: "Emma Wilson",
      initials: "EW",
      age: 32,
      gender: "Female",
      contact: "0917 123 4567",
      email: "emma.wilson@email.com",
      address: "Purok 1, Tagum City",
      status: "Active",
      lastVisit: "Apr 22, 2026",
      appointment: true,
      prescription: true,
      bloodType: "O+",
      allergies: "None",
      conditions: "Hypertension",
      emergencyContact: "John Wilson / 0917 888 9999",
      totalConsultations: 8,
      totalPrescriptions: 5,
      nextAppointment: "May 10, 2026",
    },
    {
      id: 2,
      patientId: "PT-00422",
      name: "James Lee",
      initials: "JL",
      age: 45,
      gender: "Male",
      contact: "0917 234 5678",
      email: "james.lee@email.com",
      address: "Apokon, Tagum City",
      status: "Active",
      lastVisit: "Apr 20, 2026",
      appointment: true,
      prescription: false,
      bloodType: "A+",
      allergies: "Penicillin",
      conditions: "None",
      emergencyContact: "Anna Lee / 0918 123 4567",
      totalConsultations: 5,
      totalPrescriptions: 2,
      nextAppointment: "May 8, 2026",
    },
    {
      id: 3,
      patientId: "PT-00423",
      name: "Sophia Patel",
      initials: "SP",
      age: 28,
      gender: "Female",
      contact: "0917 345 6789",
      email: "sophia@email.com",
      address: "Mankilam, Tagum City",
      status: "Active",
      lastVisit: "Apr 19, 2026",
      appointment: false,
      prescription: true,
      bloodType: "B+",
      allergies: "None",
      conditions: "Asthma",
      emergencyContact: "Raj Patel / 0919 456 7890",
      totalConsultations: 6,
      totalPrescriptions: 4,
      nextAppointment: "None",
    },
    {
      id: 4,
      patientId: "PT-00424",
      name: "Michael Roberts",
      initials: "MR",
      age: 61,
      gender: "Male",
      contact: "0917 456 7890",
      email: "michael@email.com",
      address: "Magugpo, Tagum City",
      status: "Active",
      lastVisit: "Apr 18, 2026",
      appointment: true,
      prescription: true,
      bloodType: "AB+",
      allergies: "None",
      conditions: "Diabetes",
      emergencyContact: "Mary Roberts / 0920 234 5678",
      totalConsultations: 12,
      totalPrescriptions: 9,
      nextAppointment: "May 4, 2026",
    },
    {
      id: 5,
      patientId: "PT-00425",
      name: "Aisha Khan",
      initials: "AK",
      age: 36,
      gender: "Female",
      contact: "0917 567 8901",
      email: "aisha@email.com",
      address: "Visayan Village, Tagum City",
      status: "Active",
      lastVisit: "Apr 17, 2026",
      appointment: false,
      prescription: true,
      bloodType: "O+",
      allergies: "None",
      conditions: "None",
      emergencyContact: "Ali Khan / 0921 345 6789",
      totalConsultations: 3,
      totalPrescriptions: 2,
      nextAppointment: "None",
    },
    {
      id: 6,
      patientId: "PT-00426",
      name: "Daniel Chen",
      initials: "DC",
      age: 50,
      gender: "Male",
      contact: "0917 678 9012",
      email: "daniel@email.com",
      address: "La Filipina, Tagum City",
      status: "Active",
      lastVisit: "Apr 16, 2026",
      appointment: true,
      prescription: false,
      bloodType: "A-",
      allergies: "Seafood",
      conditions: "Hypertension",
      emergencyContact: "Linda Chen / 0922 456 7890",
      totalConsultations: 7,
      totalPrescriptions: 3,
      nextAppointment: "May 6, 2026",
    },
    {
      id: 7,
      patientId: "PT-00427",
      name: "Lily Tan",
      initials: "LT",
      age: 29,
      gender: "Female",
      contact: "0917 789 0123",
      email: "lily@email.com",
      address: "Tagum City",
      status: "Active",
      lastVisit: "Apr 15, 2026",
      appointment: true,
      prescription: false,
      bloodType: "B+",
      allergies: "None",
      conditions: "None",
      emergencyContact: "Peter Tan / 0923 567 8901",
      totalConsultations: 4,
      totalPrescriptions: 1,
      nextAppointment: "May 2, 2026",
    },
    {
      id: 8,
      patientId: "PT-00428",
      name: "Ravi Kumar",
      initials: "RK",
      age: 40,
      gender: "Male",
      contact: "0917 890 1234",
      email: "ravi@email.com",
      address: "Tagum City",
      status: "Inactive",
      lastVisit: "Apr 14, 2026",
      appointment: false,
      prescription: false,
      bloodType: "O-",
      allergies: "None",
      conditions: "None",
      emergencyContact: "Mina Kumar / 0924 678 9012",
      totalConsultations: 2,
      totalPrescriptions: 0,
      nextAppointment: "None",
    },
    {
      id: 9,
      patientId: "PT-00429",
      name: "Natalie Park",
      initials: "NP",
      age: 27,
      gender: "Female",
      contact: "0917 901 2345",
      email: "natalie@email.com",
      address: "Tagum City",
      status: "Active",
      lastVisit: "Apr 14, 2026",
      appointment: true,
      prescription: true,
      bloodType: "A+",
      allergies: "None",
      conditions: "Migraine",
      emergencyContact: "Chris Park / 0925 789 0123",
      totalConsultations: 5,
      totalPrescriptions: 4,
      nextAppointment: "May 5, 2026",
    },
    {
      id: 10,
      patientId: "PT-00430",
      name: "Thomas Brown",
      initials: "TB",
      age: 55,
      gender: "Male",
      contact: "0917 012 3456",
      email: "thomas@email.com",
      address: "Tagum City",
      status: "Active",
      lastVisit: "Apr 12, 2026",
      appointment: true,
      prescription: true,
      bloodType: "O+",
      allergies: "None",
      conditions: "Diabetes",
      emergencyContact: "Anne Brown / 0926 890 1234",
      totalConsultations: 10,
      totalPrescriptions: 8,
      nextAppointment: "May 7, 2026",
    },
  ];

  // =====================================================
  // FILTERING
  // =====================================================

  const filteredPatients = useMemo(() => {
    let result = [...patients];

    const keyword = search.trim().toLowerCase();

    if (keyword) {
      result = result.filter((patient) =>
        [
          patient.patientId,
          patient.name,
          patient.email,
          patient.contact,
        ]
          .join(" ")
          .toLowerCase()
          .includes(keyword)
      );
    }

    if (genderFilter !== "All Genders") {
      result = result.filter(
        (patient) => patient.gender === genderFilter
      );
    }

    if (statusFilter !== "All Statuses") {
      result = result.filter(
        (patient) => patient.status === statusFilter
      );
    }

    if (ageFilter === "18 - 30") {
      result = result.filter(
        (patient) => patient.age >= 18 && patient.age <= 30
      );
    }

    if (ageFilter === "31 - 50") {
      result = result.filter(
        (patient) => patient.age >= 31 && patient.age <= 50
      );
    }

    if (ageFilter === "51+") {
      result = result.filter(
        (patient) => patient.age >= 51
      );
    }

    if (activeTab === "Active") {
      result = result.filter(
        (patient) => patient.status === "Active"
      );
    }

    if (activeTab === "Inactive") {
      result = result.filter(
        (patient) => patient.status === "Inactive"
      );
    }

    if (activeTab === "With Appointments") {
      result = result.filter(
        (patient) => patient.appointment
      );
    }

    if (activeTab === "With Prescriptions") {
      result = result.filter(
        (patient) => patient.prescription
      );
    }

    return result;
  }, [
    search,
    genderFilter,
    statusFilter,
    ageFilter,
    activeTab,
  ]);

  const selectedPatient =
    patients.find(
      (patient) => patient.id === selectedPatientId
    ) || patients[0];

  const statusStyle = (status) => {
    if (status === "Active") {
      return "bg-[#ddf8e9] text-[#24955c]";
    }

    return "bg-[#ffe3e6] text-[#d85764]";
  };

  // =====================================================
  // EXPORT DUMMY CSV
  // =====================================================

  const exportPatients = () => {
    const header =
      "Patient ID,Name,Age,Gender,Contact,Status,Last Visit\n";

    const rows = filteredPatients
      .map(
        (patient) =>
          `${patient.patientId},${patient.name},${patient.age},${patient.gender},${patient.contact},${patient.status},${patient.lastVisit}`
      )
      .join("\n");

    const blob = new Blob([header + rows], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "cura-patients.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-5">

      {/* TOP HEADER */}

      <div className="
        mb-4
        flex flex-col gap-4
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
            placeholder="Search patients, appointments, or records..."
            className="
              h-10 w-full
              rounded-2xl
              border border-[#dae7e9]
              bg-white/90
              pl-10 pr-4
              text-[11px]
              shadow-sm
              outline-none
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

            <p className="text-[9px] text-[#728198]">
              Administrator
            </p>
          </div>
        </div>
      </div>

      {/* TITLE */}

      <div className="
        mb-4
        flex flex-col gap-3
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
            Patients
          </h1>

          <p className="mt-1 text-[11px] text-[#6e7f96]">
            Manage patient records, view history, and more.
          </p>
        </div>

        <button
          onClick={() => setShowAddPatient(true)}
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
            transition
            hover:bg-[#078f7b]
          "
        >
          <Plus size={16} />
          Add Patient
        </button>
      </div>

      {/* STATISTICS */}

      <div className="
        mb-4
        grid grid-cols-1 gap-3
        sm:grid-cols-2
        xl:grid-cols-4
      ">
        <PatientStat
          icon={Users}
          value="1,248"
          title="Total Patients"
          color="blue"
        />

        <PatientStat
          icon={UserPlus}
          value="86"
          title="New This Month"
          note="↑ 12% from last month"
          color="green"
        />

        <PatientStat
          icon={Clock3}
          value="142"
          title="With Active Prescription"
          color="red"
        />

        <PatientStat
          icon={CalendarDays}
          value="256"
          title="Scheduled Appointments"
          color="orange"
        />
      </div>

      {/* PATIENT TABS */}

      <div className="
        mb-3
        flex gap-1
        overflow-x-auto
        border-b border-[#dfeaea]
      ">
        {[
          "All Patients",
          "Active",
          "Inactive",
          "With Appointments",
          "With Prescriptions",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              whitespace-nowrap
              px-4 py-2.5
              text-[9px]
              font-medium
              transition

              ${
                activeTab === tab
                  ? "border-b-2 border-[#0bad92] text-[#078b79]"
                  : "text-[#66788e] hover:text-[#078b79]"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* SEARCH + FILTERS */}

      <div className="
        mb-3
        grid grid-cols-1
        gap-2
        rounded-xl
        bg-white/85
        p-3
        shadow-sm
        md:grid-cols-[1fr_150px_150px_150px_auto]
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
            placeholder="Search patients by name, ID, or contact..."
            className="
              h-10 w-full
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
          value={genderFilter}
          onChange={(event) =>
            setGenderFilter(event.target.value)
          }
          className={selectClass}
        >
          <option>All Genders</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <select
          value={ageFilter}
          onChange={(event) =>
            setAgeFilter(event.target.value)
          }
          className={selectClass}
        >
          <option>All Age Groups</option>
          <option>18 - 30</option>
          <option>31 - 50</option>
          <option>51+</option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className={selectClass}
        >
          <option>All Statuses</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <button
          onClick={exportPatients}
          className="
            flex h-10
            items-center justify-center
            gap-2
            rounded-lg
            border border-[#81d8cc]
            bg-white
            px-4
            text-[9px]
            font-medium
            text-[#078b79]
            transition
            hover:bg-[#e7f8f4]
          "
        >
          <Download size={14} />
          Export
        </button>
      </div>

      {/* MAIN CONTENT */}

      <div className="
        grid grid-cols-1
        gap-4
        xl:grid-cols-[1.45fr_1fr]
      ">

        {/* PATIENT TABLE */}

        <section className="
          overflow-hidden
          rounded-2xl
          border border-white/60
          bg-white/90
          shadow-[0_4px_18px_rgba(30,90,90,0.06)]
        ">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">

              <thead>
                <tr className="bg-[#f2f8f9]">
                  <th className="px-3 py-2">
                    <input type="checkbox" />
                  </th>

                  {[
                    "ID",
                    "Name",
                    "Age",
                    "Gender",
                    "Contact",
                    "Last Visit",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="
                        px-3 py-2
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
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    onClick={() =>
                      setSelectedPatientId(patient.id)
                    }
                    className={`
                      cursor-pointer
                      border-b border-[#edf2f3]
                      transition
                      hover:bg-[#f4fbfa]

                      ${
                        selectedPatientId === patient.id
                          ? "bg-[#f0faf8] border-l-2 border-l-[#10ae97]"
                          : ""
                      }
                    `}
                  >
                    <td
                      className="px-3 py-2.5"
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                    >
                      <input type="checkbox" />
                    </td>

                    <td className="
                      px-3 py-2.5
                      text-[8px]
                      text-[#536880]
                    ">
                      {patient.patientId}
                    </td>

                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="
                          flex h-7 w-7
                          items-center justify-center
                          rounded-full
                          bg-[#e6f3ff]
                          text-[8px]
                          font-semibold
                          text-[#278bf1]
                        ">
                          {patient.initials}
                        </div>

                        <span className="
                          text-[9px]
                          font-semibold
                          text-[#253a58]
                        ">
                          {patient.name}
                        </span>
                      </div>
                    </td>

                    <td className={tableText}>
                      {patient.age}
                    </td>

                    <td className={tableText}>
                      {patient.gender}
                    </td>

                    <td className={tableText}>
                      {patient.contact}
                    </td>

                    <td className={tableText}>
                      {patient.lastVisit}
                    </td>

                    <td className="px-3 py-2.5">
                      <span
                        className={`
                          rounded-full
                          px-2 py-1
                          text-[8px]
                          ${statusStyle(patient.status)}
                        `}
                      >
                        {patient.status}
                      </span>
                    </td>

                    <td className="px-3 py-2.5">
                      <button
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                        className="
                          text-[#6f8096]
                          hover:text-[#087c75]
                        "
                      >
                        <MoreVertical size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          <div className="
            flex flex-col gap-3
            border-t border-[#edf2f3]
            px-4 py-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          ">
            <p className="text-[8px] text-[#748299]">
              Showing 1 to {filteredPatients.length} of 1,248 patients
            </p>

            <div className="flex items-center gap-2">
              <button className={pageButton}>
                <ChevronLeft size={13} />
              </button>

              <button className="
                flex h-7 w-7
                items-center justify-center
                rounded-md
                bg-[#d9f8f1]
                text-[9px]
                text-[#087c75]
              ">
                1
              </button>

              {[2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={pageButton}
                >
                  {page}
                </button>
              ))}

              <span className="text-[8px] text-[#738198]">
                ...
              </span>

              <button className={pageButton}>
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </section>

        {/* PATIENT DETAILS */}

        <section className="
          rounded-2xl
          border border-white/60
          bg-white/90
          p-4
          shadow-[0_4px_18px_rgba(30,90,90,0.06)]
        ">

          <div className="mb-4 flex items-start gap-3">
            <div className="
              flex h-14 w-14
              shrink-0
              items-center justify-center
              rounded-full
              bg-[#dff3ff]
              text-sm
              font-semibold
              text-[#258cff]
            ">
              {selectedPatient.initials}
            </div>

            <div className="flex-1">
              <div className="
                flex items-start
                justify-between
                gap-2
              ">
                <div>
                  <h3 className="
                    text-[13px]
                    font-semibold
                    text-[#203652]
                  ">
                    {selectedPatient.name}
                  </h3>

                  <p className="
                    mt-1
                    text-[8px]
                    text-[#8290a3]
                  ">
                    ID: {selectedPatient.patientId}
                  </p>
                </div>

                <span
                  className={`
                    rounded-full
                    px-2 py-1
                    text-[8px]
                    ${statusStyle(
                      selectedPatient.status
                    )}
                  `}
                >
                  {selectedPatient.status}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4 space-y-2">
            <PatientInfo
              icon={Users}
              value={`${selectedPatient.age} years old • ${selectedPatient.gender}`}
            />

            <PatientInfo
              icon={Phone}
              value={selectedPatient.contact}
            />

            <PatientInfo
              icon={Mail}
              value={selectedPatient.email}
            />

            <PatientInfo
              icon={MapPin}
              value={selectedPatient.address}
            />
          </div>

          <div className="mb-4 flex justify-end">
            <button
              onClick={() =>
                alert(
                  `Edit ${selectedPatient.name}`
                )
              }
              className="
                flex items-center gap-2
                rounded-lg
                border border-[#79d7c9]
                px-3 py-2
                text-[9px]
                font-medium
                text-[#078b79]
                hover:bg-[#e5f8f4]
              "
            >
              <Pencil size={13} />
              Edit Patient
            </button>
          </div>

          {/* DETAIL TABS */}

          <div className="
            mb-4
            flex
            overflow-x-auto
            border-b border-[#e8efef]
          ">
            {[
              "Overview",
              "Medical History",
              "Prescriptions",
              "Appointments",
              "Documents",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setDetailTab(tab)
                }
                className={`
                  whitespace-nowrap
                  px-3 py-2
                  text-[8px]
                  font-medium

                  ${
                    detailTab === tab
                      ? "border-b-2 border-[#11ad96] text-[#078b79]"
                      : "text-[#718198]"
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>

          {detailTab === "Overview" && (
            <div className="grid grid-cols-2 gap-3">

              <InfoCard
                icon={HeartPulse}
                title="Blood Type"
                value={selectedPatient.bloodType}
              />

              <InfoCard
                icon={CalendarDays}
                title="Last Visit"
                value={selectedPatient.lastVisit}
              />

              <InfoCard
                icon={ClipboardList}
                title="Known Allergies"
                value={selectedPatient.allergies}
              />

              <InfoCard
                icon={CalendarPlus}
                title="Next Appointment"
                value={selectedPatient.nextAppointment}
              />

              <InfoCard
                icon={HeartPulse}
                title="Chronic Conditions"
                value={selectedPatient.conditions}
              />

              <InfoCard
                icon={Stethoscope}
                title="Total Consultations"
                value={selectedPatient.totalConsultations}
              />

              <InfoCard
                icon={Phone}
                title="Emergency Contact"
                value={selectedPatient.emergencyContact}
              />

              <InfoCard
                icon={Pill}
                title="Total Prescriptions"
                value={selectedPatient.totalPrescriptions}
              />

            </div>
          )}

          {detailTab === "Medical History" && (
            <SimplePanel>
              Medical history records for {selectedPatient.name} will appear here.
            </SimplePanel>
          )}

          {detailTab === "Prescriptions" && (
            <SimplePanel>
              Prescription history for {selectedPatient.name} will appear here.
            </SimplePanel>
          )}

          {detailTab === "Appointments" && (
            <SimplePanel>
              Appointment history for {selectedPatient.name} will appear here.
            </SimplePanel>
          )}

          {detailTab === "Documents" && (
            <SimplePanel>
              Uploaded patient documents will appear here.
            </SimplePanel>
          )}

          {/* QUICK ACTIONS */}

          <div className="
            mt-4
            grid grid-cols-1
            gap-2
            sm:grid-cols-3
          ">
            <ActionButton
              icon={Stethoscope}
              text="New Consultation"
              onClick={() =>
                alert(
                  `New consultation for ${selectedPatient.name}`
                )
              }
            />

            <ActionButton
              icon={Pill}
              text="New Prescription"
              onClick={() =>
                alert(
                  `New prescription for ${selectedPatient.name}`
                )
              }
            />

            <ActionButton
              icon={CalendarPlus}
              text="Schedule Appointment"
              onClick={() =>
                alert(
                  `Schedule appointment for ${selectedPatient.name}`
                )
              }
            />
          </div>

        </section>
      </div>

      {/* ADD PATIENT MODAL */}

      {showAddPatient && (
        <div className="
          fixed inset-0
          z-[100]
          flex items-center justify-center
          bg-black/35
          p-4
        ">
          <div className="
            max-h-[90vh]
            w-full max-w-lg
            overflow-y-auto
            rounded-2xl
            bg-white
            p-5
            shadow-2xl
          ">
            <div className="
              mb-5
              flex items-center justify-between
            ">
              <div>
                <h2 className="
                  text-lg
                  font-semibold
                  text-[#203652]
                ">
                  Add Patient
                </h2>

                <p className="
                  text-[10px]
                  text-[#7c8a9e]
                ">
                  Create a dummy patient record.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowAddPatient(false)
                }
              >
                <X size={19} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              <PatientInput placeholder="First name" />
              <PatientInput placeholder="Last name" />

              <PatientInput
                type="number"
                placeholder="Age"
              />

              <select className={modalInput}>
                <option>Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>

              <PatientInput placeholder="Contact number" />

              <PatientInput
                type="email"
                placeholder="Email"
              />

              <div className="sm:col-span-2">
                <PatientInput placeholder="Address" />
              </div>

            </div>

            <div className="
              mt-5
              flex justify-end
              gap-2
            ">
              <button
                onClick={() =>
                  setShowAddPatient(false)
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
                  setShowAddPatient(false)
                }
                className="
                  rounded-lg
                  bg-[#0bad92]
                  px-4 py-2
                  text-[10px]
                  text-white
                "
              >
                Add Patient
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};


// =====================================================
// REUSABLE COMPONENTS
// =====================================================

const PatientStat = ({
  icon: Icon,
  value,
  title,
  note,
  color,
}) => {
  const colors = {
    blue: {
      bg: "bg-[#e7f3ff]",
      icon: "text-[#278bf1]",
    },
    green: {
      bg: "bg-[#e1f8f2]",
      icon: "text-[#0bad92]",
    },
    red: {
      bg: "bg-[#ffe9eb]",
      icon: "text-[#f05d6c]",
    },
    orange: {
      bg: "bg-[#fff0db]",
      icon: "text-[#ff9d32]",
    },
  };

  const style = colors[color];

  return (
    <div className="
      flex min-h-[90px]
      items-center gap-3
      rounded-xl
      border border-white/60
      bg-white/90
      p-4
      shadow-[0_4px_15px_rgba(30,90,90,0.05)]
    ">
      <div
        className={`
          flex h-11 w-11
          items-center justify-center
          rounded-xl
          ${style.bg}
        `}
      >
        <Icon
          size={21}
          className={style.icon}
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

        {note && (
          <p className="
            mt-1
            text-[7px]
            font-medium
            text-[#19a878]
          ">
            {note}
          </p>
        )}
      </div>
    </div>
  );
};


const PatientInfo = ({
  icon: Icon,
  value,
}) => {
  return (
    <div className="flex items-center gap-2">
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


const InfoCard = ({
  icon: Icon,
  title,
  value,
}) => {
  return (
    <div className="
      flex gap-3
      rounded-xl
      bg-[#f3faf9]
      p-3
    ">
      <div className="
        flex h-8 w-8
        shrink-0
        items-center justify-center
        rounded-lg
        bg-[#e0f7f2]
      ">
        <Icon
          size={15}
          className="text-[#0bad92]"
        />
      </div>

      <div>
        <p className="
          text-[7px]
          text-[#7c899b]
        ">
          {title}
        </p>

        <p className="
          mt-1
          text-[8px]
          font-medium
          text-[#40536d]
        ">
          {value}
        </p>
      </div>
    </div>
  );
};


const ActionButton = ({
  icon: Icon,
  text,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="
        flex h-10
        items-center justify-center
        gap-2
        rounded-lg
        border border-[#7bd7c9]
        bg-white
        text-[8px]
        font-medium
        text-[#078b79]
        transition
        hover:bg-[#e6f8f4]
      "
    >
      <Icon size={13} />
      {text}
    </button>
  );
};


const SimplePanel = ({ children }) => {
  return (
    <div className="
      rounded-xl
      bg-[#f3faf9]
      p-4
      text-[9px]
      text-[#53657d]
    ">
      {children}
    </div>
  );
};


const PatientInput = ({
  type = "text",
  placeholder,
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={modalInput}
    />
  );
};


const selectClass = `
  h-10
  rounded-lg
  border border-[#dce7e9]
  bg-white
  px-3
  text-[10px]
  text-[#53657d]
  outline-none
`;

const tableText = `
  px-3 py-2.5
  text-[8px]
  text-[#536880]
`;

const pageButton = `
  flex h-7 w-7
  items-center justify-center
  rounded-md
  border border-[#dce7e9]
  text-[8px]
  text-[#63748b]
`;

const modalInput = `
  h-10
  w-full
  rounded-lg
  border border-[#dce6e9]
  bg-white
  px-3
  text-[10px]
  outline-none
  focus:border-[#79d7c9]
`;

export default Patients;
