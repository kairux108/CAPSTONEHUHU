
import {
  LayoutDashboard,
  CalendarDays,
  CalendarClock,
  Stethoscope,
  UsersRound,
  UserRound,
  ClipboardList,
  FileText,
  Settings,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| CURA Navigation Configuration
|--------------------------------------------------------------------------
|
| Each role has its own navigation.
| The shared Sidebar automatically reads the correct group.
|
*/

export const navigationConfig = {

  /*
  |--------------------------------------------------------------------------
  | Admin Navigation - UNCHANGED
  |--------------------------------------------------------------------------
  */

  admin: [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Appointments",
      path: "/admin/appointments",
      icon: CalendarDays,
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: UsersRound,
    },
    {
      label: "Patients",
      path: "/admin/patients",
      icon: UserRound,
    },
    {
      label: "Reports",
      path: "/admin/reports",
      icon: FileText,
    },
    {
      label: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ],

  /*
  |--------------------------------------------------------------------------
  | Doctor Navigation - UPDATED
  |--------------------------------------------------------------------------
  */

  doctor: [
    {
      label: "Dashboard",
      path: "/doctor/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Schedule",
      path: "/doctor/schedule",
      icon: CalendarClock,
    },
    {
      label: "Appointments",
      path: "/doctor/appointments",
      icon: CalendarDays,
    },
    {
      label: "My Patients",
      path: "/doctor/patients",
      icon: UserRound,
    },
    {
      label: "My Queue",
      path: "/doctor/queue",
      icon: ClipboardList,
    },
    {
      label: "Consultation",
      path: "/doctor/consultation",
      icon: Stethoscope,
    },
    {
      label: "Reports",
      path: "/doctor/reports",
      icon: FileText,
    },
  ],

  /*
  |--------------------------------------------------------------------------
  | Staff Navigation - UNCHANGED
  |--------------------------------------------------------------------------
  */

  staff: [
    {
      label: "Dashboard",
      path: "/staff/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Patients",
      path: "/staff/patients",
      icon: UserRound,
    },
    {
      label: "Appointments",
      path: "/staff/appointments",
      icon: CalendarDays,
    },
    {
      label: "Queue",
      path: "/staff/queue",
      icon: ClipboardList,
    },
  ],
};
