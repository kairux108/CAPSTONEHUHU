import { Navigate, Routes, Route,} from "react-router-dom";
import Login from "./components/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/common/DashboardLayout";
import AdminLayout from "./components/admin/AdminLayout";

// ==============================
// ADMIN
// ==============================
import Appointments from "./components/admin/pages/Appointments";
import Users from "./components/admin/pages/Users";
import Patients from "./components/admin/pages/Patients";
import Reports from "./components/admin/pages/Reports";
import Settings from "./components/admin/pages/Settings";

// ==============================
// DOCTOR
// ==============================
import DoctorDashboard from "./components/doctor/DoctorDashboard";

// ==============================
// STAFF
// ==============================
import StaffLayout from "./components/staff/StaffLayout";
import StaffPatients from "./components/staff/pages/Patients";
import StaffAppointments from "./components/staff/pages/Appointments";
import StaffQueue from "./components/staff/pages/Queue";
import StaffReports from "./components/staff/pages/Reports";

// ==============================
// SHARED MODULES
// ==============================
import PatientList from "./components/patients/PatientList";
import AppointmentManager from "./components/appointments/AppointmentManager";
import QueueManagement from "./components/queue/QueueManagement";
import ConsultationPanel from "./components/consultation/ConsultationPanel";
import ReportsDashboard from "./components/reports/ReportsDashboard";

function App() {
  return (
    <Routes>

      {/* ==============================
          LOGIN
      ============================== */}
      <Route
        path="/"
        element={<Login />}
      />

      {/* ==============================
          ADMIN
      ============================== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Navigate
              to="dashboard"
              replace
            />
          }
        />

        <Route
          path="dashboard"
          element={null}
        />

        <Route
          path="appointments"
          element={<Appointments />}
        />

        <Route
          path="users"
          element={<Users />}
        />

        <Route
          path="patients"
          element={<Patients />}
        />

        <Route
          path="reports"
          element={<Reports />}
        />

        <Route
          path="settings"
          element={<Settings />}
        />
      </Route>

      {/* ==============================
          DOCTOR
      ============================== */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Navigate
              to="dashboard"
              replace
            />
          }
        />

        <Route
          path="dashboard"
          element={<DoctorDashboard />}
        />

        <Route
          path="patients"
          element={<PatientList />}
        />

        <Route
          path="appointments"
          element={<AppointmentManager />}
        />

        <Route
          path="queue"
          element={<QueueManagement />}
        />

        <Route
          path="consultation"
          element={<ConsultationPanel />}
        />

        <Route
          path="reports"
          element={<ReportsDashboard />}
        />
      </Route>

      {/* ==============================
          STAFF
      ============================== */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <StaffLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Navigate
              to="dashboard"
              replace
            />
          }
        />

        <Route
          path="dashboard"
          element={null}
        />

        <Route
          path="patients"
          element={<StaffPatients />}
        />

        <Route
          path="appointments"
          element={<StaffAppointments />}
        />

        <Route
          path="queue"
          element={<StaffQueue />}
        />

        <Route
          path="reports"
          element={<StaffReports />}
        />
      </Route>

      {/* ==============================
      ============================== */}
      <Route
        path="/admin-dashboard"
        element={
          <Navigate
            to="/admin/dashboard"
            replace
          />
        }
      />

     

    </Routes>
  );
}

export default App;