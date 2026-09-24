import {
  Navigate,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./components/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

import DashboardLayout from "./components/common/DashboardLayout";

// ==============================
// ADMIN
// ==============================
import AdminDashboard from "./components/admin/AdminDashboard";
import Appointments from "./components/admin/pages/Appointments";
import Doctors from "./components/admin/pages/Doctors";
import Staff from "./components/admin/pages/Staff";
import Patients from "./components/admin/pages/Patients";
import Clinics from "./components/admin/pages/Clinics";
import Reports from "./components/admin/pages/Reports";
import Settings from "./components/admin/pages/Settings";

// ==============================
// DOCTOR
// ==============================
import DoctorDashboard from "./components/doctor/DoctorDashboard";

// ==============================
// STAFF
// ==============================
import StaffDashboard from "./components/staff/StaffDashboard";
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

const RoleFallback = () => {
  const { user } = useAuth();
  const role = String(user?.role || "")
    .trim()
    .toLowerCase();

  const destinations = {
    admin: "/admin/dashboard",
    doctor: "/doctor/dashboard",
    staff: "/staff/dashboard",
  };

  return (
    <Navigate
      to={destinations[role] || "/"}
      replace
    />
  );
};

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
          element={<AdminDashboard />}
        />

        <Route
          path="appointments"
          element={<Appointments />}
        />

        <Route
          path="doctors"
          element={<Doctors />}
        />

        <Route
          path="staff"
          element={<Staff />}
        />

        <Route
          path="patients"
          element={<Patients />}
        />

        <Route
          path="clinics"
          element={<Clinics />}
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
          element={<StaffDashboard />}
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
          OLD ROUTE REDIRECTS
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

      <Route
        path="/doctor-dashboard"
        element={
          <Navigate
            to="/doctor/dashboard"
            replace
          />
        }
      />

      <Route
        path="/staff-dashboard"
        element={
          <Navigate
            to="/staff/dashboard"
            replace
          />
        }
      />

      {/* ==============================
          UNKNOWN ROUTE
      ============================== */}
      <Route
        path="*"
        element={<RoleFallback />}
      />

    </Routes>
  );
}

export default App;