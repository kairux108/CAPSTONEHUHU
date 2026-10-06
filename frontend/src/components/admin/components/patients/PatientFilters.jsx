import { Search } from "lucide-react";

import CuraCard from "../../../common/CuraCard";

const PatientFilters = ({
  search,
  setSearch,
  sexFilter,
  setSexFilter,
  ageFilter,
  setAgeFilter,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
}) => (
  <CuraCard className="patients-filter-card">
    <div className="patients-toolbar">

      <div className="patients-search">
        <Search size={17} />

        <input
          type="text"
          value={search}
          placeholder="Search by name, patient ID, email or contact..."
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <select
        className="patients-filter-select"
        value={sexFilter}
        onChange={(event) => setSexFilter(event.target.value)}
      >
        <option value="all">All Sex</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <select
        className="patients-filter-select"
        value={ageFilter}
        onChange={(event) => setAgeFilter(event.target.value)}
      >
        <option value="all">All Ages</option>
        <option value="child">Child</option>
        <option value="adult">Adult</option>
        <option value="senior">Senior</option>
      </select>

      <select
        className="patients-filter-select"
        value={statusFilter}
        onChange={(event) => setStatusFilter(event.target.value)}
      >
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <select
        className="patients-sort-select"
        value={sortBy}
        onChange={(event) => setSortBy(event.target.value)}
      >
        <option value="name">Name A-Z</option>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>

    </div>
  </CuraCard>
);

export default PatientFilters;