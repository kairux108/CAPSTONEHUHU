import { Search, UserPlus } from "lucide-react";
import CuraCard from "../../common/CuraCard";
import { USER_ROLES, USER_STATUSES } from "../../../utils/userUtils";

const ROLE_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: USER_ROLES.ADMIN, label: "Admin" },
  { value: USER_ROLES.STAFF, label: "Staff" },
  { value: USER_ROLES.DOCTOR, label: "Doctor" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: USER_STATUSES.ACTIVE, label: "Active" },
  { value: USER_STATUSES.ON_LEAVE, label: "On Leave" },
  { value: USER_STATUSES.INACTIVE, label: "Inactive" },
];

const SORT_OPTIONS = [
  { value: "name", label: "Sort by: Name" },
  { value: "email", label: "Sort by: Email" },
  { value: "role", label: "Sort by: Role" },
  { value: "newest", label: "Sort by: Newest" },
];

const UserFilters = ({
  search, setSearch,
  roleFilter, setRoleFilter,
  statusFilter, setStatusFilter,
  sortBy, setSortBy,
  onAddUser,
}) => (
  <div className="users-actions-row">
    <CuraCard className="users-filter-card">
      <div className="users-toolbar">
        <label className="users-search-box">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            value={search}
            placeholder="Search by name, role, email, or position..."
            aria-label="Search users"
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <select value={roleFilter} aria-label="Filter users by role" onChange={(e) => setRoleFilter(e.target.value)}>
          {ROLE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>

        <select value={statusFilter} aria-label="Filter users by status" onChange={(e) => setStatusFilter(e.target.value)}>
          {STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>

        <select value={sortBy} aria-label="Sort users" onChange={(e) => setSortBy(e.target.value)}>
          {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </div>
    </CuraCard>

    <button type="button" className="users-add-button" onClick={onAddUser}>
      <UserPlus size={17} aria-hidden="true" />
      <span>Add User</span>
    </button>
  </div>
);

export default UserFilters;