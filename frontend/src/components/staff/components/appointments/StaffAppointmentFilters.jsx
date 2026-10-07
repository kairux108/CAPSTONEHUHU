import { Plus, Search } from "lucide-react";
import CuraCard from "../../../common/CuraCard";

const getDoctorName = (doctor) =>
  doctor?.name || "Unknown Doctor";

const StaffAppointmentFilters = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  doctorFilter,
  setDoctorFilter,
  selectedDate,
  setSelectedDate,
  doctors,
  onNewAppointment,
}) => {
  return (
    <CuraCard className="staff-appointment-filter-card">
      <div className="staff-appointment-toolbar">

        <label className="staff-appointment-search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Search patient, ID, contact, or appointment..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </label>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
        >
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="checked_in">Checked In</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no_show">No Show</option>
        </select>

        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(event.target.value)
          }
        >
          <option value="all">All Types</option>
          <option value="walk_in">Walk-in</option>
          <option value="online">Online</option>
        </select>

        <select
          value={doctorFilter}
          onChange={(event) =>
            setDoctorFilter(event.target.value)
          }
        >
          <option value="all">All Doctors</option>

          {doctors.map((doctor) => (
            <option
              key={doctor.id}
              value={doctor.id}
            >
              {getDoctorName(doctor)}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="staff-appointment-date"
          value={selectedDate}
          onChange={(event) =>
            setSelectedDate(event.target.value)
          }
        />

        <button
          type="button"
          className="staff-new-appointment-inline"
          onClick={onNewAppointment}
        >
          <Plus size={17} />
          <span>New Appointment</span>
        </button>

      </div>
    </CuraCard>
  );
};

export default StaffAppointmentFilters;