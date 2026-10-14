import {
  Filter,
  Search,
} from "lucide-react";

import CuraCard from "../../common/CuraCard";

const StaffQueueControls = ({
  search,
  setSearch,

  activeTab,
  setActiveTab,

  statusFilter,
  setStatusFilter,
}) => {
  return (
    <CuraCard className="staff-queue-controls-card">
      <div className="staff-queue-controls">

        {/* QUEUE TYPE TABS */}

        <div className="staff-queue-tabs">
          <button
            type="button"
            className={
              activeTab === "all"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("all")
            }
          >
            All Queue
          </button>

          <button
            type="button"
            className={
              activeTab === "walk_in"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("walk_in")
            }
          >
            Walk-ins
          </button>

          <button
            type="button"
            className={
              activeTab === "scheduled"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("scheduled")
            }
          >
            Scheduled
          </button>
        </div>

        {/* SEARCH */}

        <label className="staff-queue-search">
          <Search size={16} />

          <input
            type="search"
            value={search}
            placeholder="Search patient or queue number..."
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </label>

        {/* STATUS FILTER */}

        <div className="staff-queue-filter">
          <Filter size={15} />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >
            <option value="all">
              All Status
            </option>

            <option value="waiting">
              Waiting
            </option>

            <option value="called">
              Called
            </option>

            <option value="in_consultation">
              In Consultation
            </option>

            <option value="completed">
              Completed
            </option>

            <option value="cancelled">
              Cancelled
            </option>
          </select>
        </div>

      </div>
    </CuraCard>
  );
};

export default StaffQueueControls;