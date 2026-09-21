import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

import Login from "./components/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import DashboardLayout from "./components/common/DashboardLayout";

import DoctorDashboard from "./components/dashboard/DoctorDashboard";
import StaffDashboard from "./components/dashboard/StaffDashboard";

import PatientList from "./components/patients/PatientList";

import AppointmentManager from "./components/appointments/AppointmentManager";

import QueueManagement from "./components/queue/QueueManagement";

import ConsultationPanel from "./components/consultation/ConsultationPanel";

import ReportsDashboard from "./components/reports/ReportsDashboard";

const AppRoutes = () => {
  const {
    user,
    isAuthenticated,
  } = useAuth();

  const getDashboardRoute = () => {
    if (!user) {
      return "/login";
    }

    if (user.role === "Doctor") {
      return "/doctor/dashboard";
    }

    if (user.role === "Staff") {
      return "/staff/dashboard";
    }

    return "/login";
  };

  return (
    <Routes>
      {/* LOGIN */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate
              to={getDashboardRoute()}
              replace
            />
          ) : (
            <Login />
          )
        }
      />

      {/* PROTECTED CURA APPLICATION */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* ========================= */}
        {/* DOCTOR DASHBOARD */}
        {/* ========================= */}

        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Doctor",
              ]}
            >
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        {/* ========================= */}
        {/* STAFF DASHBOARD */}
        {/* ========================= */}

        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Staff",
              ]}
            >
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        {/* ========================= */}
        {/* PATIENT MANAGEMENT */}
        {/* Doctor + Staff */}
        {/* ========================= */}

        <Route
          path="/patients"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Doctor",
                "Staff",
              ]}
            >
              <PatientList />
            </ProtectedRoute>
          }
        />

        {/* ========================= */}
        {/* APPOINTMENTS */}
        {/* Doctor + Staff */}
        {/* ========================= */}

        <Route
          path="/appointments"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Doctor",
                "Staff",
              ]}
            >
              <AppointmentManager />
            </ProtectedRoute>
          }
        />

        {/* ========================= */}
        {/* QUEUE MANAGEMENT */}
        {/* Doctor + Staff */}
        {/* ========================= */}

        <Route
          path="/queue"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Doctor",
                "Staff",
              ]}
            >
              <QueueManagement />
            </ProtectedRoute>
          }
        />

        {/* ========================= */}
        {/* CONSULTATION */}
        {/* Doctor only */}
        {/* ========================= */}

        <Route
          path="/consultation"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Doctor",
              ]}
            >
              <ConsultationPanel />
            </ProtectedRoute>
          }
        />

        {/* ========================= */}
        {/* REPORTS */}
        {/* Doctor + Staff */}
        {/* ========================= */}

        <Route
          path="/reports"
          element={
            <ProtectedRoute
              allowedRoles={[
                "Doctor",
                "Staff",
              ]}
            >
              <ReportsDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ========================= */}
      {/* ROOT */}
      {/* ========================= */}

      <Route
        path="/"
        element={
          <Navigate
            to={
              isAuthenticated
                ? getDashboardRoute()
                : "/login"
            }
            replace
          />
        }
      />

      {/* ========================= */}
      {/* UNKNOWN ROUTES */}
      {/* ========================= */}

      <Route
        path="*"
        element={
          <Navigate
            to={
              isAuthenticated
                ? getDashboardRoute()
                : "/login"
            }
            replace
          />
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;