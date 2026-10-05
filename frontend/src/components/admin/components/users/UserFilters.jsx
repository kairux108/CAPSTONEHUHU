import {
  Search,
  UserPlus,
} from "lucide-react";

import CuraCard from "../../../common/CuraCard";

const UserFilters = ({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  onAddUser,
}) => {
  return (
    <div className="users-actions-row">

      <CuraCard className="users-filter-card">

        <div className="users-toolbar">

          {/* SEARCH */}

          <div className="users-search-box">

            <Search size={16} />

            <input
              type="text"
              value={search}
              placeholder="Search by name, role, or email..."
              onChange={(
                event
              ) =>
                setSearch(
                  event.target
                    .value
                )
              }
            />

          </div>


          {/* ROLE */}

          <select
            value={
              roleFilter
            }
            onChange={(
              event
            ) =>
              setRoleFilter(
                event.target
                  .value
              )
            }
          >
            <option value="all">
              All Roles
            </option>

            <option value="admin">
              Admin
            </option>

            <option value="staff">
              Staff
            </option>

            <option value="doctor">
              Doctor
            </option>
          </select>


          {/* STATUS */}

          <select
            value={
              statusFilter
            }
            onChange={(
              event
            ) =>
              setStatusFilter(
                event.target
                  .value
              )
            }
          >
            <option value="all">
              All Statuses
            </option>

            <option value="active">
              Active
            </option>

            <option value="on_leave">
              On Leave
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>


          {/* SORT */}

          <select
            value={sortBy}
            onChange={(
              event
            ) =>
              setSortBy(
                event.target
                  .value
              )
            }
          >
            <option value="name">
              Sort by: Name
            </option>

            <option value="email">
              Sort by: Email
            </option>

            <option value="role">
              Sort by: Role
            </option>

            <option value="newest">
              Sort by: Newest
            </option>
          </select>

        </div>

      </CuraCard>


      <button
        type="button"
        className="users-add-button"
        onClick={onAddUser}
      >
        <UserPlus size={17} />

        Add User
      </button>

    </div>
  );
};

export default UserFilters;