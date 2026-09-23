import { Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import StaffDashboard from "./components/dashboard/StaffDashboard";
import DashboardLayout from "./components/common/DashboardLayout";
import PatientList from "./components/patients/PatientList";
import AppointmentManager from "./components/appointments/AppointmentManager";
import QueueManagement from "./components/queue/QueueManagement";
import ReportsDashboard from "./components/reports/ReportsDashboard";
import AdminDashbaord from "./Components/Dashboard/AdminDashboard";
import DashboardHome from "./Components/Dashboard/Pages/DashboardHome";
import Appointments from "./Components/Dashboard/Pages/Appointments";
import Doctors from "./Components/Dashboard/Pages/Doctors";
import Staff from "./Components/Dashboard/Pages/Staff";
import Patients from "./Components/Dashboard/Pages/Patients";
import Clinics from "./Components/Dashboard/Pages/Clinics";
import Reports from "./Components/Dashboard/Pages/Reports";
import Settings from "./Components/Dashboard/Pages/Settings";

function App() {
  return (
    <Routes>
      {/* ==============================
          LOGIN
      ============================== */}

      <Route path="/" element={<Login />} />

      {/* ==============================
          STAFF DASHBOARD
          Only users with role="staff"
          can access this route.
      ============================== */}

      <Route
        path="/staff-dashboard"
        element={
          <ProtectedRoute allowedRoles={["staff"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StaffDashboard />} />
        <Route path="patients" element={<PatientList />} />
        <Route path="appointments" element={<AppointmentManager />} />
        <Route path="queue" element={<QueueManagement />} />
        <Route path="reports" element={<ReportsDashboard />} />
      </Route>


      {/* ==============================
          ADMIN DASHBOARD
          Only users with role="admin"
          can access these routes.
      ============================== */}

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashbaord />
          </ProtectedRoute>
        }
      >
        {/* DASHBOARD HOME */}
        <Route
          index
          element={<DashboardHome />}
        />

        {/* APPOINTMENTS */}
        <Route
          path="appointments"
          element={<Appointments />}
        />

        {/* DOCTORS */}
        <Route
          path="doctors"
          element={<Doctors />}
        />

        {/* STAFF */}
        <Route
          path="staff"
          element={<Staff />}
        />

        {/* PATIENTS */}
        <Route
          path="patients"
          element={<Patients />}
        />

        {/* CLINICS */}
        <Route
          path="clinics"
          element={<Clinics />}
        />

        {/* REPORTS */}
        <Route
          path="reports"
          element={<Reports />}
        />

        {/* SETTINGS */}
        <Route
          path="settings"
          element={<Settings />}
        />
      </Route>
    </Routes>
  );
}

export default App;