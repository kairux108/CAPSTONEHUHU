import { useEffect, useMemo, useState } from "react";
import staffService from "../../../services/staffService";

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
} from "lucide-react";


const Staff = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [sortBy, setSortBy] = useState("Name");

  const [selectedStaffId, setSelectedStaffId] = useState(1);
  const [activeTab, setActiveTab] = useState("Information");
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [staffForm, setStaffForm] = useState({
  name: "",
  role: "",
  position: "",
  department: "",
  phone: "",
  email: "",
  password: "",
  address: "",
  date_hired: "",
  emergency_contact_name: "",
  emergency_contact_number: "",
  status: "Active",
});
  const [submittingStaff, setSubmittingStaff] = useState(false);
  const [staffFormError, setStaffFormError] = useState("");

  // =====================================================
  // DUMMY DATA
  // =====================================================

  // =====================================================
// STAFF DATA FROM LARAVEL API
// =====================================================

const [staffMembers, setStaffMembers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const loadStaff = async () => {
  try {
    const data = await staffService.getAll();
    const records = Array.isArray(data) ? data : data?.data || [];

    const formattedStaff = records.map((staff) => {
      const name = staff.user?.name || "Unknown Staff";

      const initials = name
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

      return {
        id: staff.id,

        name,
        initials,

        staffId: staff.staff_number || "N/A",

        position: staff.position || "Not assigned",

        // Staff sub-role/job position
        role: staff.position || "Staff",

        department:
          staff.department || "Not assigned",

        phone:
          staff.phone || "Not provided",

        email:
          staff.user?.email || "Not provided",

        status:
          staff.status || "Active",

        address:
          staff.address || "Not provided",

        dateHired: staff.date_hired
          ? new Date(
              staff.date_hired
            ).toLocaleDateString()
          : "Not provided",

        emergencyContact:
          [
            staff.emergency_contact_name,
            staff.emergency_contact_number,
          ]
            .filter(Boolean)
            .join(" / ") ||
          "Not provided",
      };
    });

    setStaffMembers(formattedStaff);

    if (formattedStaff.length > 0) {
      setSelectedStaffId((currentId) => {
        const stillExists =
          formattedStaff.some(
            (staff) =>
              staff.id === currentId
          );

        return stillExists
          ? currentId
          : formattedStaff[0].id;
      });
    }
  } catch (err) {
    console.error(
      "Failed to load staff:",
      err
    );

    setError(
      err.message ||
        "Unable to load staff records."
    );
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  // The loader updates component state only after its awaited API request settles.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  loadStaff();
}, []);

const handleStaffFormChange = (event) => {
  const { name, value } = event.target;
  setStaffForm((current) => ({ ...current, [name]: value }));
};

const resetStaffForm = () => {
  setStaffForm({
    name: "",
    position: "",
    department: "",
    phone: "",
    email: "",
    password: "",
    address: "",
    date_hired: "",
    emergency_contact_name: "",
    emergency_contact_number: "",
    status: "Active",
  });
  setStaffFormError("");
};

const handleAddStaff = async () => {
  try {
    setSubmittingStaff(true);
    setStaffFormError("");

    if (!staffForm.name || !staffForm.position || !staffForm.email || !staffForm.password) {
      setStaffFormError("Full name, position, email, and password are required.");
      return;
    }

    await staffService.create(staffForm);
    await loadStaff();
    resetStaffForm();
    setShowAddStaff(false);
  } catch (err) {
    console.error("Add staff error:", err);
    setStaffFormError(err.message || "Unable to create staff account.");
  } finally {
    setSubmittingStaff(false);
  }
};

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
  }, [staffMembers, search, roleFilter, statusFilter, sortBy]);

const selectedStaff =
  staffMembers.find(
    (staff) =>
      staff.id === selectedStaffId
  ) ||
  staffMembers[0] || {
    id: null,
    name: "No Staff Selected",
    initials: "--",
    staffId: "N/A",
    position: "No staff record",
    role: "Staff",
    department: "Not assigned",
    phone: "Not provided",
    email: "Not provided",
    status: "Inactive",
    address: "Not provided",
    dateHired: "Not provided",
    emergencyContact: "Not provided",
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-5">

      {/* =====================================================
          TOP HEADER
      ====================================================== */}

      <div className="
        !hidden
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
          Add Users
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
  value={staffMembers.length}
  title="Total Staff"
  color="blue"
/>

<StaffStat
  icon={UserCheck}
  value={
    staffMembers.filter(
      (staff) =>
        staff.status === "Active"
    ).length
  }
  title="Active Staff"
  color="green"
/>

<StaffStat
  icon={CalendarDays}
  value={
    staffMembers.filter(
      (staff) =>
        staff.status === "On Leave"
    ).length
  }
  title="On Leave"
  color="green"
/>

<StaffStat
  icon={UserX}
  value={
    staffMembers.filter(
      (staff) =>
        staff.status === "Inactive"
    ).length
  }
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

                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-[10px] text-[#718198]">
                      Loading staff...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-[10px] text-red-600">
                      {error}
                    </td>
                  </tr>
                ) : filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-[10px] text-[#718198]">
                      {staffMembers.length > 0
                        ? "No staff match your filters."
                        : "No staff records found."}
                    </td>
                  </tr>
                ) : filteredStaff.map((staff) => (
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
              add {filteredStaff.length} of {staffMembers.length} staff
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
  <div
    className="
      fixed inset-0
      z-[100]
      flex
      items-center justify-center
      bg-black/35
      p-4
    "
  >
    <div
      className="
        max-h-[90vh]
        w-full
        max-w-xl
        overflow-y-auto
        rounded-2xl
        bg-white
        p-5
        shadow-2xl
      "
    >
      {/* HEADER */}

      <div
        className="
          mb-5
          flex
          items-center
          justify-between
        "
      >
        <div>
          <h2
            className="
              text-lg
              font-semibold
              text-[#203652]
            "
          >
            Add Users
          </h2>

          <p
            className="
              text-[10px]
              text-[#7c8a9e]
            "
          >
            Create a CURA Users account and staff profile.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetStaffForm();
            setShowAddStaff(false);
          }}
          className="
            rounded-lg
            p-2
            transition
            hover:bg-[#f1f5f5]
          "
        >
          <X size={19} />
        </button>
      </div>

      {/* ERROR MESSAGE */}

      {staffFormError && (
        <div
          className="
            mb-4
            rounded-lg
            bg-red-50
            px-4
            py-3
            text-[10px]
            text-red-600
          "
        >
          {staffFormError}
        </div>
      )}

      {/* FORM */}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

        {/* FULL NAME */}

        <div className="sm:col-span-2">
          <label className="mb-1 block text-[9px] font-medium text-[#617188]">
            Full Name *
          </label>

          <input
            name="name"
            value={staffForm.name}
            onChange={handleStaffFormChange}
            placeholder="Enter full name"
            className="staff-input"
          />
        </div>

        {/* POSITION */}
<select
  name="role"
  value={staffForm.role}
  onChange={handleStaffFormChange}
  className="staff-input"
>
  <option value="">
    Select role
  </option>

  <option value="admin">
    Admin
  </option>

  <option value="staff">
    Staff
  </option>

  <option value="doctor">
    Doctor
  </option>
</select>

        {/* DEPARTMENT */}

        <div>
          <label className="mb-1 block text-[9px] font-medium text-[#617188]">
            Department
          </label>

          <select
            name="department"
            value={staffForm.department}
            onChange={handleStaffFormChange}
            className="staff-input"
          >
            <option value="Consultation">
              Consultation
            </option>  
            <option value="Maternal and Health Child">
            Maternal and Health Child
            </option>
            
             <option value="Dental">
              Dental
            </option>
          <option value="Laboratory">
              Laboratory
            </option>
            

          </select>
        </div>

        {/* PHONE */}

        <div>
          <label className="mb-1 block text-[9px] font-medium text-[#617188]">
            Contact Number
          </label>

          <input
            name="phone"
            value={staffForm.phone}
            onChange={handleStaffFormChange}
            placeholder="09XXXXXXXXX"
            className="staff-input"
          />
        </div>

        {/* DATE HIRED */}

        <div>
          <label className="mb-1 block text-[9px] font-medium text-[#617188]">
            Date Hired
          </label>

          <input
            type="date"
            name="date_hired"
            value={staffForm.date_hired}
            onChange={handleStaffFormChange}
            className="staff-input"
          />
        </div>

        {/* EMAIL */}

        <div>
          <label className="mb-1 block text-[9px] font-medium text-[#617188]">
            Email *
          </label>

          <input
            type="email"
            name="email"
            value={staffForm.email}
            onChange={handleStaffFormChange}
            placeholder="staff@cura.test"
            className="staff-input"
          />
        </div>

        {/* PASSWORD */}

        <div>
          <label className="mb-1 block text-[9px] font-medium text-[#617188]">
            Temporary Password *
          </label>

          <input
            type="password"
            name="password"
            value={staffForm.password}
            onChange={handleStaffFormChange}
            placeholder="Minimum 8 characters"
            className="staff-input"
          />
        </div>

        {/* ADDRESS */}

        <div className="sm:col-span-2">
          <label className="mb-1 block text-[9px] font-medium text-[#617188]">
            Address
          </label>

          <input
            name="address"
            value={staffForm.address}
            onChange={handleStaffFormChange}
            placeholder="Enter home address"
            className="staff-input"
          />
        </div>

        {/* EMERGENCY CONTACT NAME */}

        <div>
          <label className="mb-1 block text-[9px] font-medium text-[#617188]">
            Emergency Contact
          </label>

          <input
            name="emergency_contact_name"
            value={staffForm.emergency_contact_name}
            onChange={handleStaffFormChange}
            placeholder="Contact person name"
            className="staff-input"
          />
        </div>

        {/* EMERGENCY CONTACT NUMBER */}

        <div>
          <label className="mb-1 block text-[9px] font-medium text-[#617188]">
            Emergency Number
          </label>

          <input
            name="emergency_contact_number"
            value={staffForm.emergency_contact_number}
            onChange={handleStaffFormChange}
            placeholder="09XXXXXXXXX"
            className="staff-input"
          />
        </div>

        {/* STATUS */}

        <div className="sm:col-span-2">
          <label className="mb-1 block text-[9px] font-medium text-[#617188]">
            Status
          </label>

          <select
            name="status"
            value={staffForm.status}
            onChange={handleStaffFormChange}
            className="staff-input"
          >
            <option value="Active">
              Active
            </option>

            <option value="On Leave">
              On Leave
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>
        </div>

      </div>

      {/* BUTTONS */}

      <div
        className="
          mt-5
          flex
          justify-end
          gap-2
        "
      >
        <button
          type="button"
          onClick={() => {
            resetStaffForm();
            setShowAddStaff(false);
          }}
          disabled={submittingStaff}
          className="
            rounded-lg
            border border-[#dce6e9]
            px-4
            py-2
            text-[10px]
            text-[#617188]
            transition
            hover:bg-[#f6f9f9]
            disabled:opacity-50
          "
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleAddStaff}
          disabled={submittingStaff}
          className="
            rounded-lg
            bg-[#0bad92]
            px-4
            py-2
            text-[10px]
            font-medium
            text-white
            transition
            hover:bg-[#09917d]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {submittingStaff
            ? "Creating..."
            : "Add Staff"}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

const getStatusStyle = (status) => {
  const styles = {
    Active: "bg-[#e1f8f2] text-[#078b79]",
    "On Leave": "bg-[#fff4d6] text-[#9a6a00]",
    Inactive: "bg-[#ffe9eb] text-[#c34250]",
  };

  return styles[status] || "bg-[#edf2f3] text-[#64758c]";
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