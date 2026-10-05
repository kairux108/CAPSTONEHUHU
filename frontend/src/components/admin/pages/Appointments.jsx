import CuraCard from "../../common/CuraCard";

const Appointments = () => {
  return (
    <div>
      <div className="appointments-page">

        {/* =====================================
            TOP NAVIGATION
        ====================================== */}

        <div className="appointments-topbar">

          <div className="appointments-tabs">
            <button className="appointment-tab active">
              All Appointments
            </button>

            <button className="appointment-tab">
              Scheduled
            </button>

            <button className="appointment-tab">
              Walk-ins
            </button>

            <button className="appointment-tab">
              Completed
            </button>

            <button className="appointment-tab">
              Cancelled
            </button>
          </div>

          <button className="appointment-add-button">
            + New Appointment
          </button>

        </div>


        {/* =====================================
            MAIN LAYOUT
        ====================================== */}

        <div className="appointments-layout">

          {/* =================================
              LEFT SIDE
          ================================== */}

          <div className="appointments-left">

            {/* FILTERS */}

            <CuraCard className="appointments-filter-card">
              <div className="appointments-filters">

                <select>
                  <option>Choose Date</option>
                </select>

                <select>
                  <option>All Doctors</option>
                </select>

                <select>
                  <option>All Visit Types</option>
                </select>

                <select>
                  <option>All Statuses</option>
                </select>

              </div>
            </CuraCard>


            {/* APPOINTMENTS TABLE */}

            <CuraCard title="Appointments">

              <div className="appointments-table-wrapper">

                <table className="appointments-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Visit Type</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {/* No data yet */}
                  </tbody>
                </table>

                <div className="appointments-empty">
                  No appointments available.
                </div>

              </div>

            </CuraCard>

          </div>


          {/* =================================
              RIGHT SIDE
          ================================== */}

          <div className="appointments-right">

            {/* CALENDAR */}

            <CuraCard
              title="Calendar"
              className="appointments-calendar-card"
            >
              <div className="appointments-empty-box">
                Calendar
              </div>
            </CuraCard>


            {/* APPOINTMENT DETAILS */}

            <CuraCard
              title="Appointment Details"
              className="appointments-details-card"
            >
              <div className="appointments-empty-box">
                Select an appointment to view details.
              </div>
            </CuraCard>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Appointments;