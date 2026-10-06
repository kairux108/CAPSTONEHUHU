import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import PageHeader from "../common/PageHeader";
import DashboardHome from "./pages/DashboardHome";

const StaffLayout = () => {
  const { pathname } = useLocation();
  const pageDetails = {
    "/staff/dashboard": ["Dashboard", "Overview of clinic operations and patient flow."],
    "/staff/patients": ["Patients", "Search and view patient records."],
    "/staff/appointments": ["Appointments", "Schedule and manage clinic appointments."],
    "/staff/queue": ["Queue", "Manage walk-ins and scheduled patients."],

  };
  const [title, description] = pageDetails[pathname] || pageDetails["/staff/dashboard"];

  return (
    <div className="min-h-screen bg-linear-to-br from-[#cfe7e3] via-[#deeeec] to-[#dfe8f4] text-[#243633] dark:from-[#0d1718] dark:via-[#111d1e] dark:to-[#172129]">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="min-w-0 flex-1">
          <main className="p-4 sm:p-6 lg:p-8">
            <PageHeader title={title} description={description} />
            {pathname === "/staff/dashboard" ? <DashboardHome /> : <Outlet />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default StaffLayout;