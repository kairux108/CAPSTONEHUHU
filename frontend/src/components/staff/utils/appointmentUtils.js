export const getStaffAppointmentStatusClass = (status) => {
  const normalized = String(status || "").trim().toLowerCase();

  const classes = {
    scheduled: "scheduled",
    checked_in: "progress",
    completed: "completed",
    cancelled: "cancelled",
    no_show: "cancelled",
  };

  return classes[normalized] || "default";
};
