import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./components/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/common/DashboardLayout";

// ======================================================
// ADMIN
// ======================================================

import AdminLayout from "./components/admin/AdminLayout";
import AdminAppointments from "./components/admin/pages/Appointments";
import AdminUsers from "./components/admin/pages/Users";
import AdminPatients from "./components/admin/pages/Patients";
import AdminReports from "./components/admin/pages/Reports";
import AdminSettings from "./components/admin/pages/Settings";

// ======================================================
// DOCTOR
// ======================================================

import DoctorDashboard from "./components/doctor/DoctorDashboard";
import AppointmentManager from "./components/appointments/AppointmentManager";
import Queue from "./components/staff/pages/Queue";
import ConsultationPanel from "./components/consultation/ConsultationPanel";
import ReportsDashboard from "./components/reports/ReportsDashboard";

// ======================================================
// STAFF
// ======================================================

import StaffLayout from "./components/staff/StaffLayout";
import StaffPatients from "./components/staff/pages/Patients";
import StaffAppointments from "./components/staff/pages/Appointments";
import StaffQueue from "./components/staff/pages/Queue";
import StaffReports from "./components/staff/pages/Reports";

function App() {
  return (
    <Routes>
      {/* ==================================================
          LOGIN
      ================================================== */}

      <Route path="/" element={<Login />} />

      {/* ==================================================
          ADMIN
      ================================================== */}

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={null} />

        <Route
          path="appointments"
          element={<AdminAppointments />}
        />

        <Route
          path="users"
          element={<AdminUsers />}
        />

        <Route
          path="patients"
          element={<AdminPatients />}
        />

        <Route
          path="reports"
          element={<AdminReports />}
        />

        <Route
          path="settings"
          element={<AdminSettings />}
        />
      </Route>

      {/* ==================================================
          DOCTOR
      ================================================== */}

      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route
          path="dashboard"
          element={<DoctorDashboard />}
        />

        <Route
          path="appointments"
          element={<AppointmentManager />}
        />

        <Route
          path="queue"
          element={<Queue />}
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

      {/* ==================================================
          STAFF
      ================================================== */}

      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <StaffLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={null} />

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

      {/* ==================================================
          LEGACY REDIRECTS
      ================================================== */}

      <Route
        path="/admin-dashboard"
        element={<Navigate to="/admin/dashboard" replace />}
      />

      {/* ==================================================
          FALLBACK
      ================================================== */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;