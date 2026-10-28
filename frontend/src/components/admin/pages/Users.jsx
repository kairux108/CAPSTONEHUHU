import { useState } from "react";

import useUsers from "../hooks/useUsers";
import { getUserInitials, getUserStatusClass } from "../utils/userUtils";

import UserStats from "../components/users/UserStats";
import UserFilters from "../components/users/UserFilters";
import UserTable from "../components/users/UserTable";
import UserDetails from "../components/users/UserDetails";
import UserFormModal from "../components/users/UserFormModal";

const Users = () => {
  // ======================================================
  // USER DATA + BUSINESS LOGIC
  // ======================================================

  const {
    users,
    filteredUsers,
    stats,
    loading,
    busy,
    error,
    selectedUser,
    setSelectedUser,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    createUser,
    updateUser,
  } = useUsers();

  // ======================================================
  // MODAL
  // ======================================================

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (busy) return;

    setShowModal(false);
    setEditingUser(null);
  };

  const handleSaveUser = async (formData) => {
    const savedUser = editingUser
      ? await updateUser(editingUser.id, formData)
      : await createUser(formData);

    if (savedUser?.id) setSelectedUser(savedUser);

    setShowModal(false);
    setEditingUser(null);
  };

  // ======================================================
  // PAGE
  // ======================================================

  return (
    <div className="users-page">
      <UserStats
        totalUsers={stats.total}
        activeToday={stats.activeToday}
        onLeave={stats.onLeave}
        inactive={stats.inactive}
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
          getInitials={getUserInitials}
          getStatusClass={getUserStatusClass}
          loading={loading}
          error={error}
          onEditUser={handleEditUser}
        />

        <UserDetails
          selectedUser={selectedUser}
          getInitials={getUserInitials}
          getStatusClass={getUserStatusClass}
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