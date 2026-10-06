import { Search } from "lucide-react";

import CuraCard from "../../../common/CuraCard";

const StaffPatientFilters = ({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  sexFilter,
  setSexFilter,
  ageFilter,
  setAgeFilter,
  sortBy,
  setSortBy,
}) => (
  <CuraCard className="staff-patients-filter-card">
    <div className="staff-patients-toolbar">

      <label className="staff-patients-search">
        <Search size={17} />

        <input
          type="search"
          value={search}
          placeholder="Search by name, ID number, contact, or email..."
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />
      </label>

      <select
        value={statusFilter}
        onChange={(event) =>
          setStatusFilter(event.target.value)
        }
      >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <select
        value={sexFilter}
        onChange={(event) =>
          setSexFilter(event.target.value)
        }
      >
        <option value="all">All Sex</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <select
        value={ageFilter}
        onChange={(event) =>
          setAgeFilter(event.target.value)
        }
      >
        <option value="all">All Age Groups</option>
        <option value="child">Child</option>
        <option value="adult">Adult</option>
        <option value="senior">Senior</option>
      </select>

      <select
        value={sortBy}
        onChange={(event) =>
          setSortBy(event.target.value)
        }
      >
        <option value="name">Name A-Z</option>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>

    </div>
  </CuraCard>
);

export default StaffPatientFilters;