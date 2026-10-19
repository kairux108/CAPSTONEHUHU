import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import PageHeader from "../common/PageHeader";

const AdminLayout = () => {
  const { pathname } = useLocation();
  const pageDetails = {
    "/admin/dashboard": ["Dashboard", "Overview of clinic operations and patient flow."],
    "/admin/appointments": ["Appointments", "Manage and track all clinic appointments."],
    "/admin/users": ["Users", "Manage CURA user accounts, roles, and access."],
    "/admin/patients": ["Patients", "Manage patient records, appointments, and follow-up activity."],
    "/admin/reports": ["Reports", "Monitor clinic performance and generate insights."],
    "/admin/settings": ["Settings", "Manage CURA system preferences, clinic configuration, security, and features."],
  };
  const [title, description] = pageDetails[pathname] || pageDetails["/admin/dashboard"];

  return (
    <div className="dashboard-background dashboard-admin min-h-screen text-[#243633]">
      <div className="flex min-h-screen">
       
        <Sidebar />

        <div className="min-w-0 flex-1">
          <main className="p-4 sm:p-6 lg:p-8">
            <PageHeader title={title} description={description} />
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;