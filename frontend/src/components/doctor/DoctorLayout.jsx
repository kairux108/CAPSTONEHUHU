
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../common/Sidebar";
import PageHeader from "../common/PageHeader";

const DoctorLayout = () => {
  const { pathname } = useLocation();

  const pageDetails = {
    "/doctor/dashboard": [
      "Dashboard",
      "Overview of your appointments and consultations.",
    ],
    "/doctor/patients": [
      "My Patients",
      "View your assigned patients.",
    ],
    "/doctor/appointments": [
      "Appointments",
      "View your scheduled appointments.",
    ],
    "/doctor/schedule": [
      "My Schedule",
      "Manage your working schedule.",
    ],
    "/doctor/queue": [
      "My Queue",
      "Monitor your patient queue.",
    ],
    "/doctor/consultation": [
      "Consultation",
      "Manage patient consultations.",
    ],
    "/doctor/reports": [
      "Reports",
      "Review your consultation reports.",
    ],
  };

  const [title, description] =
    pageDetails[pathname] ||
    pageDetails["/doctor/dashboard"];

  return (
    <div className="dashboard-background dashboard-doctor min-h-screen text-[#243633]">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="min-w-0 flex-1">
          <main className="p-4 sm:p-6 lg:p-8">
            <PageHeader
              title={title}
              description={description}
              showHeading={pathname !== "/doctor/dashboard"}
            />

            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DoctorLayout;
