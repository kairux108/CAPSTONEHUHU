import { CircleUserRound, Mail } from "lucide-react";

import CuraCard from "../../../common/CuraCard";

const UserDetails = ({
  selectedUser,
  getInitials,
  getStatusClass,
}) => {
  const formatDate = (value) => {
    if (!value) return "—";

    return new Date(value).toLocaleString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const position = selectedUser?.staff_profile?.position;

  return (
    <CuraCard
      title="User Details"
      className="users-details-card"
    >
      {!selectedUser ? (
        <div className="users-details-empty">
          <CircleUserRound size={34} />
          <p>Select a user</p>
          <span>User information will appear here.</span>
        </div>
      ) : (
        <div className="users-details">

          {/* PROFILE */}

          <div className="users-details-profile">
            <div className="users-details-avatar">
              {getInitials(selectedUser.name)}
            </div>

            <div className="users-details-heading">
              <h3>{selectedUser.name}</h3>

              <p>
                {selectedUser.role === "staff"
                  ? position || "Staff"
                  : selectedUser.role}
              </p>
            </div>

            <span
              className={`users-status ${getStatusClass(
                selectedUser.status
              )}`}
            >
              {selectedUser.status || "—"}
            </span>
          </div>


          {/* CONTACT */}

          <div className="users-contact-list">
            {selectedUser.email && (
              <div>
                <Mail size={14} />
                <span>{selectedUser.email}</span>
              </div>
            )}
          </div>


          {/* INFORMATION */}

          <div className="users-details-section">
            <h4>Information</h4>

            <div className="users-information-list">
              <DetailRow
                label="Full Name"
                value={selectedUser.name}
              />

              <DetailRow
                label="Role"
                value={selectedUser.role}
              />

              {selectedUser.role === "staff" && (
                <DetailRow
                  label="Position"
                  value={position || "Not assigned"}
                />
              )}

              <DetailRow
                label="Status"
                value={selectedUser.status || "—"}
              />

              <DetailRow
                label="Email"
                value={selectedUser.email}
              />

              <DetailRow
                label="Last Active"
                value={formatDate(selectedUser.last_active_at)}
              />

              <DetailRow
                label="Created"
                value={formatDate(selectedUser.created_at)}
              />
            </div>
          </div>

        </div>
      )}
    </CuraCard>
  );
};

const DetailRow = ({ label, value }) => (
  <div>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

export default UserDetails;