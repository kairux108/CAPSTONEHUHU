import { useEffect, useMemo, useState } from "react";

import userService from "../../../services/userService";

import UserStats from "../components/users/UserStats";
import UserFilters from "../components/users/UserFilters";
import UserTable from "../components/users/UserTable";
import UserDetails from "../components/users/UserDetails";
import UserFormModal from "../components/users/UserFormModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [selectedUser, setSelectedUser] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);


  /*
  |--------------------------------------------------------------------------
  | LOAD USERS
  |--------------------------------------------------------------------------
  */

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await userService.getAll();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Failed to load users:", error);
      setError(error.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);


  /*
  |--------------------------------------------------------------------------
  | ADD / EDIT USER
  |--------------------------------------------------------------------------
  */

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleSaveUser = async (formData) => {
    const data = editingUser
      ? await userService.update(editingUser.id, formData)
      : await userService.create(formData);

    await loadUsers();

    if (data?.user) setSelectedUser(data.user);

    handleCloseModal();
  };


  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */

  const normalizeStatus = (status) =>
    String(status || "")
      .trim()
      .toLowerCase()
      .replaceAll(" ", "_");

  const isActiveToday = (user) => {
    if (!user?.last_active_at) return false;

    const today = new Date().toDateString();
    const lastActive = new Date(user.last_active_at).toDateString();

    return today === lastActive;
  };

  const getInitials = (name) =>
    String(name || "User")
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const getStatusClass = (status) => {
    const normalized = normalizeStatus(status);

    if (normalized === "active") return "active";
    if (normalized === "on_leave") return "leave";
    if (normalized === "inactive") return "inactive";

    return "default";
  };


  /*
  |--------------------------------------------------------------------------
  | SUMMARY
  |--------------------------------------------------------------------------
  */

  const totalUsers = users.length;

  const activeToday = users.filter((user) =>
    isActiveToday(user)
  ).length;

  const onLeave = users.filter(
    (user) => normalizeStatus(user.status) === "on_leave"
  ).length;

  const inactive = users.filter(
    (user) => normalizeStatus(user.status) === "inactive"
  ).length;


  /*
  |--------------------------------------------------------------------------
  | FILTER + SORT
  |--------------------------------------------------------------------------
  */

  const filteredUsers = useMemo(() => {
    let result = [...users];
    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((user) =>
        user?.name?.toLowerCase().includes(query) ||
        user?.email?.toLowerCase().includes(query) ||
        user?.role?.toLowerCase().includes(query) ||
        user?.staff_profile?.position?.toLowerCase().includes(query)
      );
    }

    if (roleFilter !== "all") {
      result = result.filter(
        (user) => user?.role?.toLowerCase() === roleFilter
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (user) => normalizeStatus(user?.status) === statusFilter
      );
    }

    result.sort((a, b) => {
      if (sortBy === "email") {
        return String(a.email || "").localeCompare(
          String(b.email || "")
        );
      }

      if (sortBy === "role") {
        return String(a.role || "").localeCompare(
          String(b.role || "")
        );
      }

      if (sortBy === "newest") {
        return (
          new Date(b.created_at || 0) -
          new Date(a.created_at || 0)
        );
      }

      return String(a.name || "").localeCompare(
        String(b.name || "")
      );
    });

    return result;
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
    sortBy,
  ]);


  /*
  |--------------------------------------------------------------------------
  | PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <div className="users-page">

      <UserStats
        totalUsers={totalUsers}
        activeToday={activeToday}
        onLeave={onLeave}
        inactive={inactive}
      />

      <UserFilters
        search={search}
        setSearch={setSearch}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onAddUser={handleAddUser}
      />

      <div className="users-content-grid">

        <UserTable
          users={users}
          filteredUsers={filteredUsers}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          getInitials={getInitials}
          getStatusClass={getStatusClass}
          loading={loading}
          error={error}
          onEditUser={handleEditUser}
        />

        <UserDetails
          selectedUser={selectedUser}
          getInitials={getInitials}
          getStatusClass={getStatusClass}
        />

      </div>

      <UserFormModal
        open={showModal}
        user={editingUser}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
      />

    </div>
  );
};

export default Users;