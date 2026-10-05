import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Search,
  UserPlus,
  UsersRound,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import CuraCard from "../../common/CuraCard";
import BarGraph from "../../common/BarGraph";

const DashboardHome = () => {
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | DASHBOARD DATA
  |--------------------------------------------------------------------------
  |
  | These will be loaded from Laravel later.
  | No hardcoded clinic data for now.
  |
  */

  const stats = {
    todayPatients: null,
    appointments: null,
    waiting: null,
    completed: null,
  };

  const queue = [];
  const appointments = [];
  const recentActivity = [];

  const queueOverview = [];

  return (
    <div className="staff-dashboard">

      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="staff-dashboard-stats">

        {/* TODAY'S PATIENTS */}

        <CuraCard className="staff-stat-card">
          <div className="staff-stat-content">

            <div className="staff-stat-icon patients">
              <UsersRound size={23} />
            </div>

            <div>
              <strong>
                {stats.todayPatients ?? "—"}
              </strong>

              <p>Today's Patients</p>
            </div>

          </div>
        </CuraCard>


        {/* APPOINTMENTS */}

        <CuraCard className="staff-stat-card">
          <div className="staff-stat-content">

            <div className="staff-stat-icon appointments">
              <CalendarDays size={23} />
            </div>

            <div>
              <strong>
                {stats.appointments ?? "—"}
              </strong>

              <p>Appointments</p>
            </div>

          </div>
        </CuraCard>


        {/* WAITING */}

        <CuraCard className="staff-stat-card">
          <div className="staff-stat-content">

            <div className="staff-stat-icon waiting">
              <Clock3 size={23} />
            </div>

            <div>
              <strong>
                {stats.waiting ?? "—"}
              </strong>

              <p>Waiting in Queue</p>
            </div>

          </div>
        </CuraCard>


        {/* COMPLETED */}

        <CuraCard className="staff-stat-card">
          <div className="staff-stat-content">

            <div className="staff-stat-icon completed">
              <CheckCircle2 size={23} />
            </div>

            <div>
              <strong>
                {stats.completed ?? "—"}
              </strong>

              <p>Completed</p>
            </div>

          </div>
        </CuraCard>

      </div>


      {/* =====================================================
          QUEUE SECTION
      ====================================================== */}

      <div className="staff-dashboard-main-grid">

        {/* TODAY'S QUEUE */}

        <CuraCard
          title="Today's Queue"
          action={
            <button
              type="button"
              className="staff-card-link"
              onClick={() =>
                navigate("/staff/queue")
              }
            >
              View All →
            </button>
          }
          className="staff-dashboard-large-card"
        >

          <div className="staff-table-wrapper">

            <table className="staff-dashboard-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Patient</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>ETA</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {queue.map((item) => (
                  <tr key={item.id}>

                    <td>
                      {item.queue_number}
                    </td>

                    <td>
                      {item.patient_name}
                    </td>

                    <td>
                      {item.type}
                    </td>

                    <td>
                      {item.status}
                    </td>

                    <td>
                      {item.eta}
                    </td>

                    <td>
                      •••
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>


            {/* EMPTY STATE */}

            {queue.length === 0 && (
              <div className="staff-empty-state">

                <UsersRound size={33} />

                <p>
                  No queue data yet
                </p>

                <span>
                  Today's patient queue will appear here once data is available.
                </span>

              </div>
            )}

          </div>

        </CuraCard>


        {/* QUEUE OVERVIEW */}

        <CuraCard
          title="Queue Overview"
          className="staff-dashboard-large-card"
        >

          <BarGraph
            data={queueOverview}
            orientation="horizontal"
          />

        </CuraCard>

      </div>


      {/* =====================================================
          APPOINTMENTS + QUICK ACTIONS
      ====================================================== */}

      <div className="staff-dashboard-main-grid">

        {/* TODAY'S APPOINTMENTS */}

        <CuraCard
          title="Today's Appointments"
          action={
            <button
              type="button"
              className="staff-card-link"
              onClick={() =>
                navigate(
                  "/staff/appointments"
                )
              }
            >
              View All →
            </button>
          }
          className="staff-dashboard-large-card"
        >

          <div className="staff-table-wrapper">

            <table className="staff-dashboard-table">

              <thead>
                <tr>
                  <th>Time</th>
                  <th>Patient</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {appointments.map(
                  (appointment) => (
                    <tr
                      key={appointment.id}
                    >

                      <td>
                        {appointment.time}
                      </td>

                      <td>
                        {
                          appointment.patient_name
                        }
                      </td>

                      <td>
                        {appointment.type}
                      </td>

                      <td>
                        {appointment.status}
                      </td>

                      <td>
                        •••
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>


            {/* EMPTY STATE */}

            {appointments.length === 0 && (
              <div className="staff-empty-state">

                <CalendarDays size={33} />

                <p>
                  No appointments yet
                </p>

                <span>
                  Today's scheduled appointments will appear here once data is available.
                </span>

              </div>
            )}

          </div>

        </CuraCard>


        {/* =================================================
            QUICK ACTIONS
        ================================================== */}

        <CuraCard
          title="Quick Actions"
          className="staff-dashboard-large-card"
        >

          <div className="staff-quick-actions">

            {/* WALK-IN */}

            <button
              type="button"
              className="staff-quick-action walkin"
              onClick={() =>
                navigate("/staff/queue")
              }
            >

              <div>
                <UserPlus size={22} />
              </div>

              <span>
                <strong>
                  Add Walk-in Patient
                </strong>

                <small>
                  Add a patient to the queue
                </small>
              </span>

            </button>


            {/* APPOINTMENT */}

            <button
              type="button"
              className="staff-quick-action appointment"
              onClick={() =>
                navigate(
                  "/staff/appointments"
                )
              }
            >

              <div>
                <CalendarDays size={22} />
              </div>

              <span>
                <strong>
                  New Appointment
                </strong>

                <small>
                  Schedule an appointment
                </small>
              </span>

            </button>


            {/* SEARCH PATIENT */}

            <button
              type="button"
              className="staff-quick-action search"
              onClick={() =>
                navigate(
                  "/staff/patients"
                )
              }
            >

              <div>
                <Search size={22} />
              </div>

              <span>
                <strong>
                  Search Patient
                </strong>

                <small>
                  Find an existing patient
                </small>
              </span>

            </button>


            {/* QUEUE */}

            <button
              type="button"
              className="staff-quick-action queue"
              onClick={() =>
                navigate("/staff/queue")
              }
            >

              <div>
                <ClipboardList size={22} />
              </div>

              <span>
                <strong>
                  View Queue
                </strong>

                <small>
                  Open queue management
                </small>
              </span>

            </button>

          </div>

        </CuraCard>

      </div>


      {/* =====================================================
          RECENT ACTIVITY
      ====================================================== */}

      <CuraCard
        title="Recent Activity"
        className="staff-recent-card"
      >

        <div className="staff-table-wrapper">

          <table className="staff-dashboard-table">

            <thead>
              <tr>
                <th>Time</th>
                <th>Activity</th>
                <th>Patient</th>
                <th>Details</th>
                <th>Performed By</th>
              </tr>
            </thead>

            <tbody>

              {recentActivity.map(
                (activity) => (
                  <tr key={activity.id}>

                    <td>
                      {activity.time}
                    </td>

                    <td>
                      {activity.activity}
                    </td>

                    <td>
                      {
                        activity.patient_name
                      }
                    </td>

                    <td>
                      {activity.details}
                    </td>

                    <td>
                      {
                        activity.performed_by
                      }
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>


          {/* EMPTY */}

          {recentActivity.length === 0 && (
            <div className="staff-empty-state staff-activity-empty">

              <Clock3 size={33} />

              <p>
                No recent activity
              </p>

              <span>
                Latest clinic activity will appear here once data is available.
              </span>

            </div>
          )}

        </div>

      </CuraCard>

    </div>
  );
};

export default DashboardHome;