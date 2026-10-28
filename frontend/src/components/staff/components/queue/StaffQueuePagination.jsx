
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const StaffQueuePagination = ({
  count = 0,
  pagination,
  onPageChange,
  perPage = 20,
  setPerPage,
  loading = false,
}) => {
  /*
  |--------------------------------------------------------------------------
  | Pagination Data
  |--------------------------------------------------------------------------
  */

  const currentPage =
    pagination?.current_page || 1;

  const lastPage =
    pagination?.last_page || 1;

  const total =
    pagination?.total ?? count;

  /*
  |--------------------------------------------------------------------------
  | Render Pagination
  |--------------------------------------------------------------------------
  */

  return (
    <div className="staff-queue-pagination">

      {/* PATIENT COUNT */}

      <span>
        Showing {count} of {total} patients
      </span>

      {/* PAGE NAVIGATION */}

      <div>
        <button
          type="button"
          disabled={
            loading ||
            currentPage <= 1
          }
          onClick={() =>
            onPageChange?.(currentPage - 1)
          }
          aria-label="Previous queue page"
        >
          <ChevronLeft size={15} />
        </button>

        <button
          type="button"
          className="active"
          disabled
        >
          {currentPage}
        </button>

        <button
          type="button"
          disabled={
            loading ||
            currentPage >= lastPage
          }
          onClick={() =>
            onPageChange?.(currentPage + 1)
          }
          aria-label="Next queue page"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      {/* PATIENTS PER PAGE */}

      <select
        value={perPage}
        disabled={loading}
        aria-label="Patients per page"
        onChange={(event) =>
          setPerPage?.(
            Number(event.target.value)
          )
        }
      >
        <option value={10}>
          10 / page
        </option>

        <option value={20}>
          20 / page
        </option>

        <option value={50}>
          50 / page
        </option>
      </select>

    </div>
  );
};

export default StaffQueuePagination;
