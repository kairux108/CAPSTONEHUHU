import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../../components/auth/Login";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminAppointments from "../../components/admin/pages/Appointments";
import AdminDashboard from "../../components/admin/pages/DashboardHome";
import AdminPatients from "../../components/admin/pages/Patients";
import AdminReports from "../../components/admin/pages/Reports";
import AdminSettings from "../../components/admin/pages/Settings";
import AdminUsers from "../../components/admin/pages/Users";
import AppointmentManager from "../../components/appointments/AppointmentManager";
import DashboardLayout from "../../components/common/DashboardLayout";
import DoctorDashboard from "../../components/doctor/DoctorDashboard";
import ConsultationPanel from "../../components/consultation/ConsultationPanel";
import ReportsDashboard from "../../components/reports/ReportsDashboard";
import StaffLayout from "../../components/staff/StaffLayout";
import StaffAppointments from "../../components/staff/pages/Appointments";
import StaffDashboard from "../../components/staff/pages/DashboardHome";
import StaffPatients from "../../components/staff/pages/Patients";
import StaffQueue from "../../components/staff/pages/Queue";
import StaffReports from "../../components/staff/pages/Reports";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="patients" element={<AdminPatients />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="patients" element={<AdminPatients />} />
        <Route path="appointments" element={<AppointmentManager />} />
        <Route path="queue" element={<StaffQueue />} />
        <Route path="consultation" element={<ConsultationPanel />} />
        <Route path="reports" element={<ReportsDashboard />} />
      </Route>

      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <StaffLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="patients" element={<StaffPatients />} />
        <Route path="appointments" element={<StaffAppointments />} />
        <Route path="queue" element={<StaffQueue />} />
        <Route path="reports" element={<StaffReports />} />
      </Route>

      <Route
        path="/admin-dashboard"
        element={<Navigate to="/admin/dashboard" replace />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
