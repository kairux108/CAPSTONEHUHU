export const normalizeRole = (role) =>
  String(role || "")
    .trim()
    .toLowerCase();

export const getRoleLandingPath = (role) => {
  const rolePaths = {
    admin: "/admin/dashboard",
    doctor: "/doctor/dashboard",
    staff: "/staff/dashboard",
  };

  return rolePaths[normalizeRole(role)] || null;
};
