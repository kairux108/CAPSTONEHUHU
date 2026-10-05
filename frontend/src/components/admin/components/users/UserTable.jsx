import { MoreVertical } from "lucide-react";

import CuraCard from "../../../common/CuraCard";
import FeedbackMessage from "../../../common/FeedbackMessage";

const UserTable = ({
  users,
  filteredUsers,
  selectedUser,
  setSelectedUser,
  getInitials,
  getStatusClass,
  loading,
  error,
  onEditUser,
}) => {
  return (
    <CuraCard
      title={`Users${users.length ? ` (${users.length})` : ""}`}
      className="users-list-card"
    >
      <div className="users-table-wrapper">

        {loading && (
          <FeedbackMessage
            type="loading"
            title="Loading users..."
            message="Please wait while user accounts are being loaded."
          />
        )}

        {!loading && error && (
          <FeedbackMessage
            type="error"
            title="Unable to load users"
            message={error}
          />
        )}

        {!loading && !error && filteredUsers.length > 0 && (
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className={selectedUser?.id === user.id ? "selected" : ""}
                  onClick={() => setSelectedUser(user)}
                >
                  <td>
                    <div className="users-name-cell">
                      <div className="users-table-avatar">
                        {getInitials(user.name)}
                      </div>

                      <div>
                        <p>{user.name}</p>

                        {user.staff_profile?.position && (
                          <span>{user.staff_profile.position}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="users-role">{user.role}</span>
                  </td>

                  <td>{user.email}</td>

                  <td>
                    <span
                      className={`users-status ${getStatusClass(
                        user.status
                      )}`}
                    >
                      {user.status || "—"}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="users-more-button"
                      title="Edit user"
                      onClick={(event) => {
                        event.stopPropagation();
                        onEditUser(user);
                      }}
                    >
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && !error && filteredUsers.length === 0 && (
          <FeedbackMessage
            type="empty"
            title="No users found"
            message={
              users.length
                ? "No users match the selected filters."
                : "No user accounts are available."
            }
          />
        )}

      </div>
    </CuraCard>
  );
};

export default UserTable;