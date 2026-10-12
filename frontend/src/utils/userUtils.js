// ======================================================
// USER UTILITIES
// Pure helper functions only.
// No React hooks. No API calls.
// ======================================================

export const USER_ROLES = Object.freeze({
  ADMIN: "admin",
  STAFF: "staff",
  DOCTOR: "doctor",
});

export const USER_STATUSES = Object.freeze({
  ACTIVE: "active",
  ON_LEAVE: "on_leave",
  INACTIVE: "inactive",
});

// ======================================================
// NORMALIZE STATUS
// ======================================================

export const normalizeUserStatus = (status) => {
  return String(status || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
};

// ======================================================
// USER INITIALS
// ======================================================

export const getUserInitials = (name) => {
  const cleanName = String(name || "").trim();

  if (!cleanName) {
    return "U";
  }

  return cleanName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

// ======================================================
// ROLE LABEL
// ======================================================

export const getUserRoleLabel = (role) => {
  const normalizedRole = String(role || "")
    .trim()
    .toLowerCase();

  const labels = {
    [USER_ROLES.ADMIN]: "Admin",
    [USER_ROLES.STAFF]: "Staff",
    [USER_ROLES.DOCTOR]: "Doctor",
  };

  return labels[normalizedRole] || "Unknown";
};

// ======================================================
// STATUS LABEL
// ======================================================

export const getUserStatusLabel = (status) => {
  const normalized = normalizeUserStatus(status);

  const labels = {
    [USER_STATUSES.ACTIVE]: "Active",
    [USER_STATUSES.ON_LEAVE]: "On Leave",
    [USER_STATUSES.INACTIVE]: "Inactive",
  };

  return labels[normalized] || "Unknown";
};

// ======================================================
// STATUS CSS CLASS
// ======================================================

export const getUserStatusClass = (status) => {
  const normalized = normalizeUserStatus(status);

  switch (normalized) {
    case USER_STATUSES.ACTIVE:
      return "active";

    case USER_STATUSES.ON_LEAVE:
      return "leave";

    case USER_STATUSES.INACTIVE:
      return "inactive";

    default:
      return "default";
  }
};

// ======================================================
// STAFF POSITION
// ======================================================

export const getUserPosition = (user) => {
  return user?.staff_profile?.position || "—";
};

// ======================================================
// ACTIVE TODAY
// ======================================================

export const isUserActiveToday = (user) => {
  if (!user?.last_active_at) {
    return false;
  }

  const lastActive = new Date(user.last_active_at);

  if (Number.isNaN(lastActive.getTime())) {
    return false;
  }

  const today = new Date();

  return (
    lastActive.getFullYear() === today.getFullYear() &&
    lastActive.getMonth() === today.getMonth() &&
    lastActive.getDate() === today.getDate()
  );
};

// ======================================================
// FORMAT DATE
// ======================================================

export const formatUserDate = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ======================================================
// FORMAT DATE + TIME
// ======================================================

export const formatUserDateTime = (value) => {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

// ======================================================
// USER SEARCH
// ======================================================

export const matchesUserSearch = (user, search) => {
  const query = String(search || "")
    .trim()
    .toLowerCase();

  if (!query) {
    return true;
  }

  const searchableValues = [
    user?.name,
    user?.email,
    user?.role,
    user?.staff_profile?.position,
  ];

  return searchableValues.some((value) =>
    String(value || "")
      .toLowerCase()
      .includes(query)
  );
};

// ======================================================
// USER SORT
// ======================================================

export const sortUsers = (users = [], sortBy = "name") => {
  const list = [...users];

  return list.sort((a, b) => {
    switch (sortBy) {
      case "email":
        return String(a?.email || "").localeCompare(
          String(b?.email || "")
        );

      case "role":
        return String(a?.role || "").localeCompare(
          String(b?.role || "")
        );

      case "newest": {
        const aDate = new Date(a?.created_at || 0).getTime();
        const bDate = new Date(b?.created_at || 0).getTime();

        return bDate - aDate;
      }

      case "name":
      default:
        return String(a?.name || "").localeCompare(
          String(b?.name || "")
        );
    }
  });
};