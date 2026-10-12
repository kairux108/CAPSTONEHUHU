import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import userService from "../services/userService";

import {
  isUserActiveToday,
  matchesUserSearch,
  normalizeUserStatus,
  sortUsers,
  USER_STATUSES,
} from "../utils/userUtils";

const useUsers = () => {
  // ======================================================
  // DATA STATE
  // ======================================================

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [busy, setBusy] = useState(false);


  // ======================================================
  // FILTER STATE
  // ======================================================

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [sortBy, setSortBy] =
    useState("name");


  // ======================================================
  // SELECTED USER
  // ======================================================

  const [
    selectedUser,
    setSelectedUser,
  ] = useState(null);


  // ======================================================
  // LOAD USERS
  // ======================================================

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await userService.getAll();

      /*
        Supports either:

        [
          { user },
          { user }
        ]

        OR:

        {
          users: [...]
        }

        This makes the frontend safer if the backend
        response is wrapped inside "users".
      */

      const loadedUsers =
        Array.isArray(response)
          ? response
          : response?.users || [];

      setUsers(loadedUsers);

      /*
        Keep selected user synchronized
        after refreshing the list.
      */

      setSelectedUser(
        (currentSelectedUser) => {
          if (!currentSelectedUser) {
            return null;
          }

          return (
            loadedUsers.find(
              (user) =>
                user.id ===
                currentSelectedUser.id
            ) || null
          );
        }
      );
    } catch (error) {
      console.error(
        "Failed to load users:",
        error
      );

      setError(
        error?.message ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  }, []);


  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);


  // ======================================================
  // FILTERED USERS
  // ======================================================

  const filteredUsers = useMemo(() => {
    let result = users.filter((user) =>
      matchesUserSearch(
        user,
        search
      )
    );

    if (roleFilter !== "all") {
      result = result.filter(
        (user) =>
          String(user?.role || "")
            .toLowerCase() ===
          roleFilter
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (user) =>
          normalizeUserStatus(
            user?.status
          ) === statusFilter
      );
    }

    return sortUsers(
      result,
      sortBy
    );
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
    sortBy,
  ]);


  // ======================================================
  // USER STATISTICS
  // ======================================================

  const stats = useMemo(() => {
    const total = users.length;

    const activeToday =
      users.filter(
        isUserActiveToday
      ).length;

    const onLeave =
      users.filter(
        (user) =>
          normalizeUserStatus(
            user?.status
          ) ===
          USER_STATUSES.ON_LEAVE
      ).length;

    const inactive =
      users.filter(
        (user) =>
          normalizeUserStatus(
            user?.status
          ) ===
          USER_STATUSES.INACTIVE
      ).length;

    return {
      total,
      activeToday,
      onLeave,
      inactive,
    };
  }, [users]);


  // ======================================================
  // CREATE USER
  // ======================================================

  const createUser =
    useCallback(
      async (data) => {
        try {
          setBusy(true);
          setError("");

          const response =
            await userService.create(
              data
            );

          await loadUsers();

          return (
            response?.user ||
            response
          );
        } catch (error) {
          console.error(
            "Failed to create user:",
            error
          );

          throw error;
        } finally {
          setBusy(false);
        }
      },
      [loadUsers]
    );


  // ======================================================
  // UPDATE USER
  // ======================================================

  const updateUser =
    useCallback(
      async (id, data) => {
        try {
          setBusy(true);
          setError("");

          const response =
            await userService.update(
              id,
              data
            );

          await loadUsers();

          return (
            response?.user ||
            response
          );
        } catch (error) {
          console.error(
            "Failed to update user:",
            error
          );

          throw error;
        } finally {
          setBusy(false);
        }
      },
      [loadUsers]
    );


  // ======================================================
  // DELETE USER
  // ======================================================

  const deleteUser =
    useCallback(
      async (id) => {
        try {
          setBusy(true);
          setError("");

          await userService.remove(id);

          /*
            Clear details panel if the
            currently selected user
            was deleted.
          */

          setSelectedUser(
            (currentSelectedUser) =>
              currentSelectedUser?.id ===
              id
                ? null
                : currentSelectedUser
          );

          await loadUsers();
        } catch (error) {
          console.error(
            "Failed to delete user:",
            error
          );

          throw error;
        } finally {
          setBusy(false);
        }
      },
      [loadUsers]
    );


  // ======================================================
  // RESET FILTERS
  // ======================================================

  const resetFilters =
    useCallback(() => {
      setSearch("");
      setRoleFilter("all");
      setStatusFilter("all");
      setSortBy("name");
    }, []);


  // ======================================================
  // PUBLIC API OF THIS HOOK
  // ======================================================

  return {
    // Data
    users,
    filteredUsers,
    stats,

    // UI state
    loading,
    busy,
    error,

    // Selection
    selectedUser,
    setSelectedUser,

    // Filters
    search,
    setSearch,

    roleFilter,
    setRoleFilter,

    statusFilter,
    setStatusFilter,

    sortBy,
    setSortBy,

    // Actions
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    resetFilters,
  };
};

export default useUsers;