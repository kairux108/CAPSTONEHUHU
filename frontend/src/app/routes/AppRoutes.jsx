
import { Navigate, Route, Routes } from "react-router-dom";

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

import Login from "../../components/auth/Login";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

import AdminLayout from "../../components/admin/AdminLayout";
import AdminDashboard from "../../components/admin/pages/DashboardHome";
import AdminAppointments from "../../components/admin/pages/Appointments";
import AdminPatients from "../../components/admin/pages/Patients";
import AdminReports from "../../components/admin/pages/Reports";
import AdminSettings from "../../components/admin/pages/Settings";
import AdminUsers from "../../components/admin/pages/Users";

/*
|--------------------------------------------------------------------------
| Doctor
|--------------------------------------------------------------------------
*/

import DoctorLayout from "../../components/doctor/DoctorLayout";

import DoctorDashboard from "../../components/doctor/pages/Dashboard";
import DoctorPatients from "../../components/doctor/pages/Patients";
import DoctorAppointments from "../../components/doctor/pages/Appointments";
import DoctorSchedule from "../../components/doctor/pages/MySchedule";
import DoctorQueue from "../../components/doctor/pages/Queue";
import DoctorConsultation from "../../components/doctor/pages/Consultation";
import DoctorReports from "../../components/doctor/pages/Reports";

/*
|--------------------------------------------------------------------------
| Staff
|--------------------------------------------------------------------------
*/

import StaffLayout from "../../components/staff/StaffLayout";
import StaffDashboard from "../../components/staff/pages/DashboardHome";
import StaffPatients from "../../components/staff/pages/Patients";
import StaffAppointments from "../../components/staff/pages/Appointments";
import StaffQueue from "../../components/staff/pages/Queue";
import StaffReports from "../../components/staff/pages/Reports";

/*
|--------------------------------------------------------------------------
| CURA Application Routes
|--------------------------------------------------------------------------
*/

function AppRoutes() {
  return (
    <Routes>

      {/* =====================================================
          AUTHENTICATION
      ===================================================== */}

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      {/* =====================================================
          ADMIN ROUTES
      ===================================================== */}

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
          element={<Navigate to="dashboard" replace />}
        />

        <Route
          path="dashboard"
          element={<AdminDashboard />}
        />

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

      {/* =====================================================
          DOCTOR ROUTES
      ===================================================== */}

      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorLayout />
          </ProtectedRoute>
        }
      >

        <Route
          index
          element={<Navigate to="dashboard" replace />}
        />

        {/* Doctor Dashboard */}

        <Route
          path="dashboard"
          element={<DoctorDashboard />}
        />

        {/* Doctor Patients */}

        <Route
          path="patients"
          element={<DoctorPatients />}
        />

        {/* Doctor Appointments */}

        <Route
          path="appointments"
          element={<DoctorAppointments />}
        />

        {/* Doctor Schedule */}

        <Route
          path="schedule"
          element={<DoctorSchedule />}
        />

        {/* Doctor Queue */}

        <Route
          path="queue"
          element={<DoctorQueue />}
        />

        {/*
        |--------------------------------------------------------------------------
        | Doctor Consultation
        |--------------------------------------------------------------------------
        |
        | /doctor/consultation
        | No patient selected.
        |
        | /doctor/consultation/:queueEntryId
        | Loads one selected queue entry through
        | the authorized Doctor Queue API.
        |
        */}

        <Route
          path="consultation"
          element={<DoctorConsultation />}
        />

        <Route
          path="consultation/:queueEntryId"
          element={<DoctorConsultation />}
        />

        {/* Doctor Reports */}

        <Route
          path="reports"
          element={<DoctorReports />}
        />

      </Route>

      {/* =====================================================
          STAFF ROUTES
      ===================================================== */}

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
          element={<Navigate to="dashboard" replace />}
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

      {/* =====================================================
          LEGACY REDIRECT
      ===================================================== */}

      <Route
        path="/admin-dashboard"
        element={
          <Navigate
            to="/admin/dashboard"
            replace
          />
        }
      />

      {/* =====================================================
          FALLBACK
      ===================================================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default AppRoutes;
