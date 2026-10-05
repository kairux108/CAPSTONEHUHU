import CuraCard from "../../common/CuraCard";

const DashboardHome = () => {
  return (
    <div>
      <div className="admin-dashboard-content">

        {/* ============================
            TOP STAT CARDS
        ============================= */}

        <div className="dashboard-stat-grid">
          <CuraCard className="dashboard-stat-card" />

          <CuraCard className="dashboard-stat-card" />

          <CuraCard className="dashboard-stat-card" />

          <CuraCard className="dashboard-stat-card" />
        </div>


        {/* ============================
            CHART / DISTRIBUTION
        ============================= */}

        <div className="dashboard-main-grid">

          <CuraCard
            title="Patient Visits Overview"
            className="dashboard-panel-large"
          />

          <CuraCard
            title="Patient Distribution"
            className="dashboard-panel-large"
          />

        </div>


        {/* ============================
            APPOINTMENTS / STATISTICS
        ============================= */}

        <div className="dashboard-secondary-grid">

          <CuraCard
            title="Recent Appointments"
            className="dashboard-panel-medium"
          />

          <CuraCard
            title="Clinic Statistics"
            className="dashboard-panel-medium"
          />

        </div>


        {/* ============================
            BOTTOM
        ============================= */}

        <div className="dashboard-bottom-grid">

          <CuraCard
            title="System Activity"
            className="dashboard-panel-bottom"
          />

          <CuraCard
            title="Quick Actions"
            className="dashboard-panel-bottom"
          />

        </div>

      </div>
    </div>
  );
};

export default DashboardHome;