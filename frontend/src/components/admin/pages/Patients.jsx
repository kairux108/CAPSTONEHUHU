import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Download,
  Filter,
  MapPin,
  MoreVertical,
  Phone,
  Search,
  UsersRound,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import CuraCard from "../../common/CuraCard";

const Patients = () => {
  /*
  |--------------------------------------------------------------------------
  | PATIENT DATA
  |--------------------------------------------------------------------------
  |
  | Later this will come from Laravel:
  |
  | const [patients, setPatients] = useState([]);
  |
  */

  const [patients] = useState([]);

  const [search, setSearch] =
    useState("");

  const [genderFilter, setGenderFilter] =
    useState("all");

  const [ageFilter, setAgeFilter] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [activeTab, setActiveTab] =
    useState("all");

  const [selectedPatient, setSelectedPatient] =
    useState(null);

  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */

  const getInitials = (name) => {
    return String(name || "Patient")
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getStatusClass = (status) => {
    const normalized = String(
      status || ""
    )
      .trim()
      .toLowerCase();

    if (normalized === "active") {
      return "active";
    }

    if (normalized === "inactive") {
      return "inactive";
    }

    return "default";
  };

  /*
  |--------------------------------------------------------------------------
  | FILTERED PATIENTS
  |--------------------------------------------------------------------------
  */

  const filteredPatients = useMemo(() => {
    let result = [...patients];

    const query = search
      .trim()
      .toLowerCase();

    if (query) {
      result = result.filter((patient) => {
        return (
          patient?.name
            ?.toLowerCase()
            .includes(query) ||
          patient?.patient_number
            ?.toLowerCase()
            .includes(query) ||
          patient?.phone
            ?.toLowerCase()
            .includes(query)
        );
      });
    }

    if (genderFilter !== "all") {
      result = result.filter(
        (patient) =>
          patient?.gender
            ?.toLowerCase() ===
          genderFilter
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(
        (patient) =>
          patient?.status
            ?.toLowerCase() ===
          statusFilter
      );
    }

    if (activeTab === "active") {
      result = result.filter(
        (patient) =>
          patient?.status
            ?.toLowerCase() ===
          "active"
      );
    }

    if (activeTab === "inactive") {
      result = result.filter(
        (patient) =>
          patient?.status
            ?.toLowerCase() ===
          "inactive"
      );
    }

    if (activeTab === "appointments") {
      result = result.filter(
        (patient) =>
          patient?.has_appointment === true
      );
    }

    if (activeTab === "followup") {
      result = result.filter(
        (patient) =>
          patient?.follow_up_required === true
      );
    }

    return result;
  }, [
    patients,
    search,
    genderFilter,
    ageFilter,
    statusFilter,
    activeTab,
  ]);

  /*
  |--------------------------------------------------------------------------
  | SUMMARY
  |--------------------------------------------------------------------------
  */

  const totalPatients =
    patients.length;

  const newThisMonth =
    patients.filter(
      (patient) =>
        patient?.is_new_this_month
    ).length;

  const scheduledAppointments =
    patients.filter(
      (patient) =>
        patient?.has_appointment
    ).length;

  const followUpPatients =
    patients.filter(
      (patient) =>
        patient?.follow_up_required
    ).length;

  return (
    <div>
      <div className="patients-page">

        {/* =====================================
            SUMMARY CARDS
        ====================================== */}

        <div className="patients-summary-grid">

          <CuraCard className="patients-summary-card">
            <div className="patients-summary-content">

              <div className="patients-summary-icon total">
                <UsersRound size={22} />
              </div>

              <div>
                <p className="patients-summary-number">
                  {totalPatients}
                </p>

                <p className="patients-summary-label">
                  Total Patients
                </p>

                <span>
                  All registered patients
                </span>
              </div>

            </div>
          </CuraCard>


          <CuraCard className="patients-summary-card">
            <div className="patients-summary-content">

              <div className="patients-summary-icon new">
                <CircleUserRound size={22} />
              </div>

              <div>
                <p className="patients-summary-number">
                  {newThisMonth}
                </p>

                <p className="patients-summary-label">
                  New This Month
                </p>
              </div>

            </div>
          </CuraCard>


          <CuraCard className="patients-summary-card">
            <div className="patients-summary-content">

              <div className="patients-summary-icon appointment">
                <CalendarDays size={22} />
              </div>

              <div>
                <p className="patients-summary-number">
                  {scheduledAppointments}
                </p>

                <p className="patients-summary-label">
                  Scheduled Appointments
                </p>

                <span>
                  This month
                </span>
              </div>

            </div>
          </CuraCard>


          <CuraCard className="patients-summary-card">
            <div className="patients-summary-content">

              <div className="patients-summary-icon followup">
                <Clock3 size={22} />
              </div>

              <div>
                <p className="patients-summary-number">
                  {followUpPatients}
                </p>

                <p className="patients-summary-label">
                  Follow-up Patients
                </p>
              </div>

            </div>
          </CuraCard>

        </div>


        {/* =====================================
            PATIENT TABS
        ====================================== */}

        <div className="patients-tabs">

          <button
            type="button"
            className={
              activeTab === "all"
                ? "patient-tab active"
                : "patient-tab"
            }
            onClick={() =>
              setActiveTab("all")
            }
          >
            <UsersRound size={14} />

            All Patients
          </button>


          <button
            type="button"
            className={
              activeTab === "active"
                ? "patient-tab active"
                : "patient-tab"
            }
            onClick={() =>
              setActiveTab("active")
            }
          >
            Active
          </button>


          <button
            type="button"
            className={
              activeTab === "inactive"
                ? "patient-tab active"
                : "patient-tab"
            }
            onClick={() =>
              setActiveTab("inactive")
            }
          >
            Inactive
          </button>


          <button
            type="button"
            className={
              activeTab ===
              "appointments"
                ? "patient-tab active"
                : "patient-tab"
            }
            onClick={() =>
              setActiveTab(
                "appointments"
              )
            }
          >
            <CalendarDays size={14} />

            With Appointments
          </button>


          <button
            type="button"
            className={
              activeTab === "followup"
                ? "patient-tab active"
                : "patient-tab"
            }
            onClick={() =>
              setActiveTab("followup")
            }
          >
            <Clock3 size={14} />

            Follow-up Patients
          </button>

        </div>


        {/* =====================================
            FILTERS
        ====================================== */}

        <CuraCard className="patients-filter-card">

          <div className="patients-toolbar">

            <div className="patients-search">

              <Search size={16} />

              <input
                type="text"
                value={search}
                placeholder="Search patients by name, ID, or contact number..."
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
              />

            </div>


            <select
              value={genderFilter}
              onChange={(event) =>
                setGenderFilter(
                  event.target.value
                )
              }
            >
              <option value="all">
                All Genders
              </option>

              <option value="male">
                Male
              </option>

              <option value="female">
                Female
              </option>
            </select>


            <select
              value={ageFilter}
              onChange={(event) =>
                setAgeFilter(
                  event.target.value
                )
              }
            >
              <option value="all">
                All Age Groups
              </option>

              <option value="child">
                Child
              </option>

              <option value="adult">
                Adult
              </option>

              <option value="senior">
                Senior
              </option>
            </select>


            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >
              <option value="all">
                All Statuses
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>


            <button
              type="button"
              className="patients-filter-button"
            >
              <Filter size={16} />
            </button>


            <button
              type="button"
              className="patients-export-button"
            >
              <Download size={16} />

              Export
            </button>

          </div>

        </CuraCard>


        {/* =====================================
            MAIN CONTENT
        ====================================== */}

        <div className="patients-content-grid">

          {/* LEFT TABLE */}

          <CuraCard className="patients-list-card">

            <div className="patients-table-wrapper">

              <table className="patients-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Contact</th>
                    <th>Last Visit</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredPatients.map(
                    (patient) => (
                      <tr
                        key={patient.id}
                        className={
                          selectedPatient?.id ===
                          patient.id
                            ? "selected"
                            : ""
                        }
                        onClick={() =>
                          setSelectedPatient(
                            patient
                          )
                        }
                      >
                        <td>
                          {patient.patient_number ||
                            "—"}
                        </td>

                        <td>
                          <div className="patient-name-cell">

                            <div className="patient-avatar">
                              {getInitials(
                                patient.name
                              )}
                            </div>

                            <strong>
                              {patient.name}
                            </strong>

                          </div>
                        </td>

                        <td>
                          {patient.age ||
                            "—"}
                        </td>

                        <td>
                          {patient.gender ||
                            "—"}
                        </td>

                        <td>
                          {patient.phone ||
                            "—"}
                        </td>

                        <td>
                          {patient.last_visit ||
                            "—"}
                        </td>

                        <td>
                          <span
                            className={`patient-status ${getStatusClass(
                              patient.status
                            )}`}
                          >
                            {patient.status ||
                              "—"}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="patient-more-button"
                            onClick={(
                              event
                            ) => {
                              event.stopPropagation();
                            }}
                          >
                            <MoreVertical
                              size={16}
                            />
                          </button>
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>


              {filteredPatients.length ===
                0 && (
                <div className="patients-empty">

                  <UsersRound size={32} />

                  <p>
                    No patients found
                  </p>

                  <span>
                    Patient information will
                    appear here.
                  </span>

                </div>
              )}

            </div>


            {/* PAGINATION */}

            <div className="patients-pagination">

              <span>
                Showing{" "}
                {filteredPatients.length}{" "}
                patients
              </span>

              <div className="patients-pagination-controls">

                <button>
                  <ChevronLeft
                    size={15}
                  />
                </button>

                <button className="active">
                  1
                </button>

                <button>
                  <ChevronRight
                    size={15}
                  />
                </button>

              </div>

            </div>

          </CuraCard>


          {/* =================================
              RIGHT PATIENT SUMMARY
          ================================== */}

          <CuraCard className="patient-summary-card">

            {!selectedPatient ? (

              <div className="patient-summary-empty">

                <CircleUserRound
                  size={36}
                />

                <p>
                  Select a patient
                </p>

                <span>
                  Patient details will
                  appear here.
                </span>

              </div>

            ) : (
              <div className="patient-summary">

                {/* HEADER */}

                <div className="patient-summary-header">

                  <div className="patient-summary-avatar">
                    {getInitials(
                      selectedPatient.name
                    )}
                  </div>

                  <div className="patient-summary-heading">

                    <h3>
                      Patient ID:{" "}
                      {selectedPatient.patient_number}
                    </h3>

                    <p>
                      {selectedPatient.age ||
                        "—"}{" "}
                      years old
                      <span>•</span>
                      {selectedPatient.gender ||
                        "—"}
                    </p>

                  </div>

                  <span
                    className={`patient-status ${getStatusClass(
                      selectedPatient.status
                    )}`}
                  >
                    {selectedPatient.status ||
                      "—"}
                  </span>

                </div>
                {/* TABS */}

                <div className="patient-summary-tabs">

                  <button className="active">
                    Overview
                  </button>

                  <button>
                    Appointments
                  </button>

                </div>

                {/* VISIT SUMMARY */}

                <div className="patient-overview-grid">

                  <div className="patient-overview-item">

                    <div className="patient-overview-icon blue">
                      <CalendarDays
                        size={18}
                      />
                    </div>

                    <div>
                      <span>
                        Last Visit
                      </span>

                      <strong>
                        {selectedPatient.last_visit ||
                          "—"}
                      </strong>
                    </div>

                  </div>


                  <div className="patient-overview-item">

                    <div className="patient-overview-icon green">
                      <CalendarDays
                        size={18}
                      />
                    </div>

                    <div>
                      <span>
                        Next Appointment
                      </span>

                      <strong>
                        {selectedPatient.next_appointment ||
                          "—"}
                      </strong>
                    </div>

                  </div>


                  <div className="patient-overview-item">

                    <div className="patient-overview-icon blue">
                      <UsersRound
                        size={18}
                      />
                    </div>

                    <div>
                      <span>
                        Total Visits
                      </span>

                      <strong>
                        {selectedPatient.total_visits ??
                          "—"}
                      </strong>
                    </div>

                  </div>
                  <div className="patient-overview-item">

                    <div className="patient-overview-icon orange">
                      <Clock3
                        size={18}
                      />
                    </div>

                    <div>
                      <span>
                        Follow-up Status
                      </span>

                      <strong>
                        {selectedPatient.follow_up_status ||
                          "—"}
                      </strong>
                    </div>

                  </div>

                </div>
                {/* CONTACT INFORMATION */}

                <div className="patient-contact-section">

                  <h4>
                    <CircleUserRound
                      size={17}
                    />

                    Contact Information
                  </h4>
                  <div className="patient-contact-item">

                    <div className="patient-contact-icon">
                      <Phone size={18} />
                    </div>

                    <div>
                      <span>
                        Contact Number
                      </span>

                      <strong>
                        {selectedPatient.phone ||
                          "—"}
                      </strong>
                    </div>

                  </div>
                  <div className="patient-contact-item">

                    <div className="patient-contact-icon">
                      <MapPin size={18} />
                    </div>

                    <div>
                      <span>
                        Address
                      </span>

                      <strong>
                        {selectedPatient.address ||
                          "—"}
                      </strong>
                    </div>

                  </div>
                  <div className="patient-contact-item emergency">

                    <div className="patient-contact-icon">
                      <Phone size={18} />
                    </div>
                    <div>
                      <span>
                        Emergency Contact
                      </span>

                      <strong>
                        {selectedPatient.emergency_contact_name ||
                          "—"}
                      </strong>

                      <small>
                        {selectedPatient.emergency_contact_number ||
                          ""}
                      </small>
                    </div>

                  </div>

                </div>

              </div>

            )}

          </CuraCard>

        </div>

      </div>
    </div>
  );
};

export default Patients;