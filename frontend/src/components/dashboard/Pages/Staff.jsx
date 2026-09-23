import { useMemo, useState } from "react";

import {
  Search,
  Bell,
  Plus,
  Users,
  UserCheck,
  CalendarDays,
  UserX,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Pencil,
  ChevronLeft,
  ChevronRight,
  X,
  ShieldCheck,
  Clock3,
  BriefcaseBusiness,
} from "lucide-react";

const Staff = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [sortBy, setSortBy] = useState("Name");

  const [selectedStaffId, setSelectedStaffId] = useState(1);
  const [activeTab, setActiveTab] = useState("Information");
  const [showAddStaff, setShowAddStaff] = useState(false);

  // =====================================================
  // DUMMY DATA
  // =====================================================

  const staffMembers = [
    {
      id: 1,
      name: "Maria Santos",
      initials: "MS",
      staffId: "ST-001",
      position: "Clinic Staff",
      role: "Staff",
      department: "Front Desk",
      phone: "0917 123 4567",
      email: "maria.santos@clinic.com",
      status: "Active",
      address: "Purok 3, Tagum City",
      dateHired: "Jan 15, 2024",
      emergencyContact: "0917 999 8888 / Juan Santos",
    },
    {
      id: 2,
      name: "John Dela Cruz",
      initials: "JD",
      staffId: "ST-002",
      position: "Nurse",
      role: "Nurse",
      department: "Nursing",
      phone: "0917 234 5678",
      email: "john.delacruz@clinic.com",
      status: "Active",
      address: "Apokon, Tagum City",
      dateHired: "Mar 10, 2024",
      emergencyContact: "0918 111 2233",
    },
    {
      id: 3,
      name: "Ana Reyes",
      initials: "AR",
      staffId: "ST-003",
      position: "Pharmacist",
      role: "Pharmacist",
      department: "Pharmacy",
      phone: "0917 345 6789",
      email: "ana.reyes@clinic.com",
      status: "Active",
      address: "Mankilam, Tagum City",
      dateHired: "Apr 5, 2024",
      emergencyContact: "0918 222 3344",
    },
    {
      id: 4,
      name: "Peter Tan",
      initials: "PT",
      staffId: "ST-004",
      position: "Medical Assistant",
      role: "Assistant",
      department: "Consultation",
      phone: "0917 456 7890",
      email: "peter.tan@clinic.com",
      status: "On Leave",
      address: "Magugpo, Tagum City",
      dateHired: "Feb 18, 2024",
      emergencyContact: "0919 333 4455",
    },
    {
      id: 5,
      name: "Lisa Gomez",
      initials: "LG",
      staffId: "ST-005",
      position: "Encoder",
      role: "Records Staff",
      department: "Records",
      phone: "0917 567 8901",
      email: "lisa.gomez@clinic.com",
      status: "Active",
      address: "Visayan Village, Tagum City",
      dateHired: "May 12, 2024",
      emergencyContact: "0920 444 5566",
    },
    {
      id: 6,
      name: "Mark Lim",
      initials: "ML",
      staffId: "ST-006",
      position: "Lab Technician",
      role: "Technician",
      department: "Laboratory",
      phone: "0917 678 9012",
      email: "mark.lim@clinic.com",
      status: "Active",
      address: "La Filipina, Tagum City",
      dateHired: "Jun 8, 2024",
      emergencyContact: "0921 555 6677",
    },
    {
      id: 7,
      name: "Jenny Park",
      initials: "JP",
      staffId: "ST-007",
      position: "Billing Staff",
      role: "Billing",
      department: "Finance",
      phone: "0917 789 0123",
      email: "jenny.park@clinic.com",
      status: "Active",
      address: "Tagum City",
      dateHired: "Jul 21, 2024",
      emergencyContact: "0922 666 7788",
    },
    {
      id: 8,
      name: "Carlo Pena",
      initials: "CP",
      staffId: "ST-008",
      position: "Utility Staff",
      role: "Utility",
      department: "Maintenance",
      phone: "0917 890 1234",
      email: "carlo.pena@clinic.com",
      status: "Inactive",
      address: "Tagum City",
      dateHired: "Aug 3, 2024",
      emergencyContact: "0923 777 8899",
    },
  ];

  // =====================================================
  // FILTERING
  // =====================================================

  const filteredStaff = useMemo(() => {
    let result = [...staffMembers];

    const keyword = search.trim().toLowerCase();

    if (keyword) {
      result = result.filter((staff) =>
        [
          staff.name,
          staff.position,
          staff.role,
          staff.department,
          staff.email,
        ]
          .join(" ")
          .toLowerCase()
          .includes(keyword)
      );
    }

    if (roleFilter !== "All Roles") {
      result = result.filter(
        (staff) => staff.role === roleFilter
      );
    }

    if (statusFilter !== "All Statuses") {
      result = result.filter(
        (staff) => staff.status === statusFilter
      );
    }

    if (sortBy === "Name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (sortBy === "Position") {
      result.sort((a, b) =>
        a.position.localeCompare(b.position)
      );
    }

    if (sortBy === "Department") {
      result.sort((a, b) =>
        a.department.localeCompare(b.department)
      );
    }

    return result;
  }, [search, roleFilter, statusFilter, sortBy]);

  const selectedStaff =
    staffMembers.find(
      (staff) => staff.id === selectedStaffId
    ) || staffMembers[0];

  const getStatusStyle = (status) => {
    if (status === "Active") {
      return "bg-[#ddf8e9] text-[#24955c]";
    }

    if (status === "On Leave") {
      return "bg-[#fff0cb] text-[#c88920]";
    }

    return "bg-[#ffe3e6] text-[#d85764]";
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-5">

      {/* =====================================================
          TOP HEADER
      ====================================================== */}

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
            type="text"
            placeholder="Search patients, appointments, or records..."
            className="
              h-10 w-full
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

      {/* =====================================================
          TITLE
      ====================================================== */}

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
            Staff
          </h1>

          <p className="mt-1 text-[11px] text-[#6e7f96]">
            Manage clinic staff, roles, and access.
          </p>
        </div>

        <button
          onClick={() => setShowAddStaff(true)}
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
          Add Staff
        </button>
      </div>

      {/* =====================================================
          STATS
      ====================================================== */}

      <div className="
        mb-4
        grid grid-cols-1 gap-3
        sm:grid-cols-2
        xl:grid-cols-4
      ">

        <StaffStat
          icon={Users}
          value="12"
          title="Total Staff"
          color="blue"
        />

        <StaffStat
          icon={UserCheck}
          value="10"
          title="Active Staff"
          color="green"
        />

        <StaffStat
          icon={CalendarDays}
          value="1"
          title="On Leave"
          color="green"
        />

        <StaffStat
          icon={UserX}
          value="1"
          title="Inactive"
          color="red"
        />

      </div>

      {/* =====================================================
          SEARCH + FILTERS
      ====================================================== */}

      <div className="
        mb-3
        grid grid-cols-1
        gap-2
        rounded-xl
        bg-white/85
        p-3
        shadow-sm
        md:grid-cols-[1fr_160px_150px_150px]
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
            placeholder="Search staff by name, position, or email..."
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
          value={roleFilter}
          onChange={(event) =>
            setRoleFilter(event.target.value)
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
          <option>All Roles</option>
          <option>Staff</option>
          <option>Nurse</option>
          <option>Pharmacist</option>
          <option>Assistant</option>
          <option>Records Staff</option>
          <option>Technician</option>
          <option>Billing</option>
          <option>Utility</option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
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
          <option>Inactive</option>
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

          <option value="Position">
            Sort by: Position
          </option>

          <option value="Department">
            Sort by: Department
          </option>
        </select>

      </div>

      {/* =====================================================
          MAIN AREA
      ====================================================== */}

      <div className="
        grid grid-cols-1
        gap-4
        xl:grid-cols-[1.45fr_1fr]
      ">

        {/* =================================================
            STAFF TABLE
        ================================================== */}

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
              Staff Members

              <span className="
                ml-1
                font-normal
                text-[#718198]
              ">
                ({filteredStaff.length})
              </span>
            </h2>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[760px]">

              <thead>
                <tr className="bg-[#f2f8f9]">
                  {[
                    "Name",
                    "Position / Role",
                    "Department",
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

                {filteredStaff.map((staff) => (
                  <tr
                    key={staff.id}
                    onClick={() =>
                      setSelectedStaffId(staff.id)
                    }
                    className={`
                      cursor-pointer
                      border-b
                      border-[#edf2f3]
                      transition
                      hover:bg-[#f4fbfa]

                      ${
                        selectedStaffId === staff.id
                          ? "bg-[#f0faf8] border-l-2 border-l-[#10ae97]"
                          : ""
                      }
                    `}
                  >

                    {/* NAME */}

                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">

                        <div className="
                          flex h-8 w-8
                          shrink-0
                          items-center justify-center
                          rounded-full
                          bg-[#e6f3ff]
                          text-[9px]
                          font-semibold
                          text-[#278bf1]
                        ">
                          {staff.initials}
                        </div>

                        <div>
                          <p className="
                            text-[9px]
                            font-semibold
                            text-[#253a58]
                          ">
                            {staff.name}
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* POSITION */}

                    <td className="
                      px-4 py-2.5
                      text-[8px]
                      text-[#536880]
                    ">
                      {staff.position}
                    </td>

                    {/* DEPARTMENT */}

                    <td className="
                      px-4 py-2.5
                      text-[8px]
                      text-[#536880]
                    ">
                      {staff.department}
                    </td>

                    {/* CONTACT */}

                    <td className="px-4 py-2.5">
                      <p className="
                        text-[8px]
                        text-[#52657d]
                      ">
                        {staff.phone}
                      </p>

                      <p className="
                        text-[7px]
                        text-[#8996a7]
                      ">
                        {staff.email}
                      </p>
                    </td>

                    {/* STATUS */}

                    <td className="px-4 py-2.5">
                      <span
                        className={`
                          rounded-full
                          px-2 py-1
                          text-[8px]

                          ${getStatusStyle(
                            staff.status
                          )}
                        `}
                      >
                        {staff.status}
                      </span>
                    </td>

                    {/* ACTIONS */}

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
                        <MoreVertical size={15} />
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

          {/* FOOTER */}

          <div className="
            flex
            items-center
            justify-between
            border-t
            border-[#edf2f3]
            px-4 py-3
          ">

            <p className="text-[8px] text-[#748299]">
              Showing 1 to {filteredStaff.length} of 12 staff
            </p>

            <div className="flex items-center gap-2">

              <button className="
                flex h-7 w-7
                items-center justify-center
                rounded-md
                border border-[#dce7e9]
              ">
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

              <button className="
                flex h-7 w-7
                items-center justify-center
                rounded-md
                border border-[#dce7e9]
              ">
                2
              </button>

              <button className="
                flex h-7 w-7
                items-center justify-center
                rounded-md
                border border-[#dce7e9]
              ">
                <ChevronRight size={13} />
              </button>

            </div>

          </div>

        </section>

        {/* =================================================
            SELECTED STAFF DETAILS
        ================================================== */}

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
            flex items-start gap-3
          ">

            <div className="
              flex h-14 w-14
              shrink-0
              items-center justify-center
              rounded-full
              bg-[#dff4f0]
              text-sm
              font-semibold
              text-[#078b79]
            ">
              {selectedStaff.initials}
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
                    {selectedStaff.name}
                  </h3>

                  <p className="
                    mt-0.5
                    text-[9px]
                    text-[#64758c]
                  ">
                    {selectedStaff.position}
                  </p>

                  <p className="
                    mt-1
                    text-[8px]
                    text-[#8896a8]
                  ">
                    ID: {selectedStaff.staffId}
                  </p>
                </div>

                <span
                  className={`
                    rounded-full
                    px-2 py-1
                    text-[8px]

                    ${getStatusStyle(
                      selectedStaff.status
                    )}
                  `}
                >
                  {selectedStaff.status}
                </span>

              </div>

            </div>

          </div>

          {/* CONTACT */}

          <div className="mb-4 space-y-2">

            <StaffContact
              icon={Phone}
              value={selectedStaff.phone}
            />

            <StaffContact
              icon={Mail}
              value={selectedStaff.email}
            />

            <StaffContact
              icon={MapPin}
              value={selectedStaff.address}
            />

          </div>

          <div className="mb-4 flex justify-end">

            <button className="
              flex items-center gap-2
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
              Edit Staff
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
              "Information",
              "Schedule",
              "Permissions",
              "Activity Log",
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

          {/* INFORMATION */}

          {activeTab === "Information" && (
            <div className="space-y-3">

              <InformationRow
                label="Full Name"
                value={selectedStaff.name}
              />

              <InformationRow
                label="Position"
                value={selectedStaff.position}
              />

              <InformationRow
                label="Role"
                value={selectedStaff.role}
              />

              <InformationRow
                label="Department"
                value={selectedStaff.department}
              />

              <InformationRow
                label="Date Hired"
                value={selectedStaff.dateHired}
              />

              <InformationRow
                label="Status"
                value={selectedStaff.status}
              />

              <InformationRow
                label="Address"
                value={selectedStaff.address}
              />

              <InformationRow
                label="Emergency Contact"
                value={selectedStaff.emergencyContact}
              />

            </div>
          )}

          {/* SCHEDULE */}

          {activeTab === "Schedule" && (
            <div className="space-y-3">

              <ScheduleRow
                day="Monday"
                time="8:00 AM - 5:00 PM"
              />

              <ScheduleRow
                day="Tuesday"
                time="8:00 AM - 5:00 PM"
              />

              <ScheduleRow
                day="Wednesday"
                time="8:00 AM - 5:00 PM"
              />

              <ScheduleRow
                day="Thursday"
                time="8:00 AM - 5:00 PM"
              />

              <ScheduleRow
                day="Friday"
                time="8:00 AM - 5:00 PM"
              />

            </div>
          )}

          {/* PERMISSIONS */}

          {activeTab === "Permissions" && (
            <div className="space-y-2">

              <PermissionItem text="View patient records" />
              <PermissionItem text="Manage appointments" />
              <PermissionItem text="Access reports" />
              <PermissionItem text="Manage queue" />

            </div>
          )}

          {/* ACTIVITY */}

          {activeTab === "Activity Log" && (
            <div className="space-y-3">

              <ActivityItem
                title="Logged into CURA"
                time="Today • 8:02 AM"
              />

              <ActivityItem
                title="Updated patient record"
                time="Today • 9:15 AM"
              />

              <ActivityItem
                title="Created appointment"
                time="Yesterday • 3:22 PM"
              />

            </div>
          )}

        </section>

      </div>

      {/* =====================================================
          ADD STAFF MODAL
      ====================================================== */}

      {showAddStaff && (
        <div className="
          fixed inset-0
          z-[100]
          flex
          items-center justify-center
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
                  Add Staff
                </h2>

                <p className="
                  text-[10px]
                  text-[#7c8a9e]
                ">
                  Create a dummy staff account.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowAddStaff(false)
                }
              >
                <X size={19} />
              </button>

            </div>

            <div className="space-y-3">

              <input
                placeholder="Full name"
                className="staff-input"
              />

              <input
                placeholder="Position"
                className="staff-input"
              />

              <select className="staff-input">
                <option>Select role</option>
                <option>Staff</option>
                <option>Nurse</option>
                <option>Pharmacist</option>
                <option>Assistant</option>
              </select>

              <input
                placeholder="Department"
                className="staff-input"
              />

              <input
                placeholder="Contact number"
                className="staff-input"
              />

              <input
                type="email"
                placeholder="Email"
                className="staff-input"
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
                  setShowAddStaff(false)
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
                  setShowAddStaff(false)
                }
                className="
                  rounded-lg
                  bg-[#0bad92]
                  px-4 py-2
                  text-[10px]
                  text-white
                "
              >
                Add Staff
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

const StaffStat = ({
  icon: Icon,
  value,
  title,
  color,
}) => {
  const colors = {
    blue: {
      background: "bg-[#e7f3ff]",
      icon: "text-[#278bf1]",
    },
    green: {
      background: "bg-[#e1f8f2]",
      icon: "text-[#0bad92]",
    },
    red: {
      background: "bg-[#ffe9eb]",
      icon: "text-[#f06b77]",
    },
  };

  const style = colors[color];

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

      <div
        className={`
          flex h-10 w-10
          items-center justify-center
          rounded-xl
          ${style.background}
        `}
      >
        <Icon
          size={20}
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
      </div>

    </div>
  );
};


const StaffContact = ({
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


const InformationRow = ({
  label,
  value,
}) => {
  return (
    <div className="
      grid
      grid-cols-[110px_1fr]
      gap-3
    ">

      <span className="
        text-[8px]
        font-medium
        text-[#718096]
      ">
        {label}
      </span>

      <span className="
        text-[8px]
        text-[#41546e]
      ">
        {value}
      </span>

    </div>
  );
};


const ScheduleRow = ({
  day,
  time,
}) => {
  return (
    <div className="
      flex
      items-center
      justify-between
      rounded-lg
      bg-[#f3faf9]
      p-3
    ">

      <div className="flex items-center gap-2">
        <CalendarDays
          size={14}
          className="text-[#0bad92]"
        />

        <span className="
          text-[9px]
          font-medium
          text-[#40536d]
        ">
          {day}
        </span>
      </div>

      <span className="
        text-[8px]
        text-[#718096]
      ">
        {time}
      </span>

    </div>
  );
};


const PermissionItem = ({ text }) => {
  return (
    <div className="
      flex
      items-center
      gap-3
      rounded-lg
      bg-[#f3faf9]
      p-3
    ">

      <ShieldCheck
        size={16}
        className="text-[#0bad92]"
      />

      <span className="
        text-[9px]
        text-[#40536d]
      ">
        {text}
      </span>

    </div>
  );
};


const ActivityItem = ({
  title,
  time,
}) => {
  return (
    <div className="
      flex items-center
      gap-3
      rounded-lg
      bg-[#f3faf9]
      p-3
    ">

      <div className="
        flex h-8 w-8
        items-center justify-center
        rounded-full
        bg-[#ddf7f1]
      ">
        <Clock3
          size={14}
          className="text-[#0bad92]"
        />
      </div>

      <div>
        <p className="
          text-[9px]
          font-medium
          text-[#40536d]
        ">
          {title}
        </p>

        <p className="
          mt-0.5
          text-[7px]
          text-[#8592a5]
        ">
          {time}
        </p>
      </div>

    </div>
  );
};

export default Staff;