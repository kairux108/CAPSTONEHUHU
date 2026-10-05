import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import PageHeader from "./PageHeader";

const DashboardLayout = () => {
  const { pathname } = useLocation();
  const pageDetails = {
    "/doctor/dashboard": ["Dashboard", "Your clinic overview and patient flow."],
    "/doctor/patients": ["Patients", "Review and manage clinic patient records."],
    "/doctor/appointments": ["Appointments", "Review and manage scheduled appointments."],
    "/doctor/queue": ["Queue", "Monitor patients waiting for care."],
    "/doctor/consultation": ["Consultation", "Review and document patient consultations."],
    "/doctor/reports": ["Reports", "Review clinic activity and performance."],
    "/staff/dashboard": ["Dashboard", "Overview of clinic operations and patient flow."],
    "/staff/patients": ["Patients", "Register, search, and manage patient records."],
    "/staff/appointments": ["Appointments", "Schedule and manage clinic appointments."],
    "/staff/queue": ["Queue", "Manage walk-ins and scheduled patients."],
    "/staff/reports": ["Reports", "Review clinic activity and performance."],
  };
  const [title, description] = pageDetails[pathname] || pageDetails["/staff/dashboard"];

  return (
    <div
      className="
        min-h-screen
        bg-linear-to-br
        from-[#cfe7e3]
        via-[#deeeec]
        to-[#dfe8f4]

        dark:from-[#0d1718]
        dark:via-[#111d1e]
        dark:to-[#172129]
      "
    >
      <div className="flex min-h-screen">
        {/* SIDEBAR */}

        <Sidebar />

        {/* MAIN AREA */}

        <div className="min-w-0 flex-1">
          <div className="px-7 pt-7">
            <PageHeader
              title={title}
              description={description}
              showHeading={pathname.startsWith("/staff/") || pathname.endsWith("/dashboard")}
            />
          </div>

          <main className="px-7 pb-7 pt-5">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;