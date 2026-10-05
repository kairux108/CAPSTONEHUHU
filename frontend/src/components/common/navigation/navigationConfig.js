import {
  LayoutDashboard,
  CalendarDays,
  Stethoscope,
  UsersRound,
  UserRound,
  ClipboardList,
  FileText,
  Settings,
} from "lucide-react";

export const navigationConfig = {
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

  doctor: [
    {
      label: "Dashboard",
      path: "/doctor/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Patients",
      path: "/doctor/patients",
      icon: UserRound,
    },
    {
      label: "Appointments",
      path: "/doctor/appointments",
      icon: CalendarDays,
    },
    {
      label: "Queue",
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