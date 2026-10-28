import CuraCard from "../../../common/CuraCard";

const AppointmentFilters = ({
  date,
  setDate,
  doctorFilter,
  setDoctorFilter,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  doctors = [],
}) => (
  <CuraCard className="appointments-filter-card">
    <div className="appointments-filters">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <select
        value={doctorFilter}
        onChange={(e) => setDoctorFilter(e.target.value)}
      >
        <option value="all">All Doctors</option>

        {doctors.map((doctor) => (
          <option key={doctor.id} value={doctor.id}>
            {doctor.name}
          </option>
        ))}
      </select>

      <select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
      >
        <option value="all">All Visit Types</option>
        <option value="walk_in">Walk-in</option>
        <option value="online">Online</option>
      </select>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="all">All Statuses</option>
        <option value="scheduled">Scheduled</option>
        <option value="checked_in">Checked In</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
        <option value="no_show">No Show</option>
      </select>
    </div>
  </CuraCard>
);

export default AppointmentFilters;