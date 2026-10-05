import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Mail,
  MapPin,
  MoreVertical,
  Phone,
  Search,
  UserRoundCheck,
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
  | DATA
  |--------------------------------------------------------------------------
  |
  | Later this will come from Laravel /api/patients.
  | No fake patient records for now.
  |
  */

  const [patients] = useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [sexFilter, setSexFilter] =
    useState("all");

  const [ageFilter, setAgeFilter] =
    useState("all");

  const [
    selectedPatient,
    setSelectedPatient,
  ] = useState(null);


  /* =========================================================
     HELPERS
  ========================================================= */

  const getFullName = (patient) => {
    return [
      patient?.first_name,
      patient?.middle_name,
      patient?.last_name,
      patient?.suffix,
    ]
      .filter(Boolean)
      .join(" ");
  };


  const getInitials = (patient) => {
    const name = getFullName(patient);

    return String(name || "Patient")
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };


  const calculateAge = (birthDate) => {
    if (!birthDate) {
      return null;
    }

    const birth =
      new Date(birthDate);

    const today =
      new Date();

    let age =
      today.getFullYear() -
      birth.getFullYear();

    const month =
      today.getMonth() -
      birth.getMonth();

    if (
      month < 0 ||
      (
        month === 0 &&
        today.getDate() <
          birth.getDate()
      )
    ) {
      age--;
    }

    return age;
  };


  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date)
      .toLocaleDateString(
        "en-PH",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );
  };


  const getStatusClass = (status) => {
    const normalized =
      String(status || "")
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


  /* =========================================================
     SUMMARY
  ========================================================= */

  const totalPatients =
    patients.length;


  const activePatients =
    patients.filter(
      (patient) =>
        String(
          patient.status || ""
        ).toLowerCase() ===
        "active"
    ).length;


  const newThisMonth =
    patients.filter((patient) => {
      if (!patient.created_at) {
        return false;
      }

      const created =
        new Date(
          patient.created_at
        );

      const today =
        new Date();

      return (
        created.getMonth() ===
          today.getMonth() &&
        created.getFullYear() ===
          today.getFullYear()
      );
    }).length;


  /*
   * This will come from the appointment API later.
   */
  const appointmentsToday = null;


  /* =========================================================
     FILTER
  ========================================================= */

  const filteredPatients =
    useMemo(() => {
      let result =
        [...patients];

      const keyword =
        search
          .trim()
          .toLowerCase();


      if (keyword) {
        result = result.filter(
          (patient) => {
            const fullName =
              getFullName(
                patient
              ).toLowerCase();

            return (
              fullName.includes(
                keyword
              ) ||
              patient
                ?.patient_number
                ?.toLowerCase()
                .includes(
                  keyword
                ) ||
              patient
                ?.phone_number
                ?.toLowerCase()
                .includes(
                  keyword
                ) ||
              patient
                ?.email
                ?.toLowerCase()
                .includes(
                  keyword
                )
            );
          }
        );
      }


      if (
        statusFilter !==
        "all"
      ) {
        result = result.filter(
          (patient) =>
            String(
              patient.status ||
                ""
            ).toLowerCase() ===
            statusFilter
        );
      }


      if (
        sexFilter !==
        "all"
      ) {
        result = result.filter(
          (patient) =>
            String(
              patient.sex || ""
            ).toLowerCase() ===
            sexFilter
        );
      }


      if (
        ageFilter !==
        "all"
      ) {
        result = result.filter(
          (patient) => {
            const age =
              calculateAge(
                patient.birth_date
              );

            if (
              age === null
            ) {
              return false;
            }

            if (
              ageFilter ===
              "child"
            ) {
              return age < 18;
            }

            if (
              ageFilter ===
              "adult"
            ) {
              return (
                age >= 18 &&
                age < 60
              );
            }

            if (
              ageFilter ===
              "senior"
            ) {
              return age >= 60;
            }

            return true;
          }
        );
      }


      return result;
    }, [
      patients,
      search,
      statusFilter,
      sexFilter,
      ageFilter,
    ]);


  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setSexFilter("all");
    setAgeFilter("all");
  };


  return (
    <div className="staff-patients-page">

      {/* =====================================================
          SUMMARY
      ====================================================== */}

      <div className="staff-patients-summary">

        <CuraCard className="staff-patient-stat-card">

          <div className="staff-patient-stat-content">

            <div className="staff-patient-stat-icon total">
              <UsersRound
                size={23}
              />
            </div>

            <div>
              <strong>
                {totalPatients}
              </strong>

              <p>
                Total Patients
              </p>

              <span>
                All registered patients
              </span>
            </div>

          </div>

        </CuraCard>


        <CuraCard className="staff-patient-stat-card">

          <div className="staff-patient-stat-content">

            <div className="staff-patient-stat-icon active">
              <UserRoundCheck
                size={23}
              />
            </div>

            <div>
              <strong>
                {activePatients}
              </strong>

              <p>
                Active Patients
              </p>

              <span>
                Currently active
              </span>
            </div>

          </div>

        </CuraCard>


        <CuraCard className="staff-patient-stat-card">

          <div className="staff-patient-stat-content">

            <div className="staff-patient-stat-icon appointment">
              <CalendarDays
                size={23}
              />
            </div>

            <div>
              <strong>
                {appointmentsToday ??
                  "—"}
              </strong>

              <p>
                Appointments Today
              </p>

              <span>
                Scheduled visits
              </span>
            </div>

          </div>

        </CuraCard>


        <CuraCard className="staff-patient-stat-card">

          <div className="staff-patient-stat-content">

            <div className="staff-patient-stat-icon new">
              <CircleUserRound
                size={23}
              />
            </div>

            <div>
              <strong>
                {newThisMonth}
              </strong>

              <p>
                New This Month
              </p>

              <span>
                Recently registered
              </span>
            </div>

          </div>

        </CuraCard>

      </div>


      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="staff-patients-content-grid">

        {/* =================================================
            LEFT SIDE
        ================================================== */}

        <CuraCard className="staff-patients-list-card">

          {/* FILTERS */}

          <div className="staff-patients-toolbar">

            <label className="staff-patients-search">

              <Search size={17} />

              <input
                type="search"
                value={search}
                placeholder="Search by name, ID number, contact, or email..."
                onChange={(event) =>
                  setSearch(
                    event
                      .target
                      .value
                  )
                }
              />

            </label>


            <select
              value={
                statusFilter
              }
              onChange={(event) =>
                setStatusFilter(
                  event
                    .target
                    .value
                )
              }
            >
              <option value="all">
                All Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </select>


            <select
              value={
                sexFilter
              }
              onChange={(event) =>
                setSexFilter(
                  event
                    .target
                    .value
                )
              }
            >
              <option value="all">
                All Sex
              </option>

              <option value="male">
                Male
              </option>

              <option value="female">
                Female
              </option>
            </select>


            <select
              value={
                ageFilter
              }
              onChange={(event) =>
                setAgeFilter(
                  event
                    .target
                    .value
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


            <button
              type="button"
              className="staff-patients-clear"
              onClick={
                clearFilters
              }
            >
              Clear
            </button>

          </div>


          {/* =================================================
              TABLE
          ================================================== */}

          <div className="staff-patients-table-wrapper">

            <table className="staff-patients-table">

              <thead>
                <tr>
                  <th>
                    ID Number
                  </th>

                  <th>
                    Patient Name
                  </th>

                  <th>
                    Age
                  </th>

                  <th>
                    Sex
                  </th>

                  <th>
                    Contact Number
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>
                </tr>
              </thead>


              <tbody>

                {filteredPatients.map(
                  (patient) => {
                    const age =
                      calculateAge(
                        patient.birth_date
                      );

                    return (
                      <tr
                        key={
                          patient.id
                        }
                        className={
                          selectedPatient
                            ?.id ===
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
                          {
                            patient.patient_number
                          }
                        </td>


                        <td>
                          <div className="staff-patient-name-cell">

                            <div className="staff-patient-avatar">

                              {getInitials(
                                patient
                              )}

                            </div>

                            <strong>
                              {getFullName(
                                patient
                              )}
                            </strong>

                          </div>
                        </td>


                        <td>
                          {age ??
                            "—"}
                        </td>


                        <td>
                          {patient.sex ||
                            "—"}
                        </td>


                        <td>
                          {patient.phone_number ||
                            "—"}
                        </td>


                        <td>

                          <span
                            className={`staff-patient-status ${getStatusClass(
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
                            className="staff-patient-more"
                            onClick={(
                              event
                            ) =>
                              event.stopPropagation()
                            }
                          >
                            <MoreVertical
                              size={16}
                            />
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>


            {/* EMPTY */}

            {filteredPatients
              .length ===
              0 && (
              <div className="staff-patients-empty">

                <div className="staff-patients-empty-icon">

                  <UsersRound
                    size={34}
                  />

                  <Search
                    size={18}
                  />

                </div>

                <p>
                  No patients found
                </p>

                <span>
                  Patient records will
                  appear here once data
                  is available.
                </span>

              </div>
            )}

          </div>


          {/* =================================================
              PAGINATION
          ================================================== */}

          <div className="staff-patients-pagination">

            <span>
              Showing{" "}
              {
                filteredPatients
                  .length
              }{" "}
              of{" "}
              {
                patients.length
              }{" "}
              patients
            </span>


            <div className="staff-patients-pagination-controls">

              <button
                type="button"
              >
                <ChevronLeft
                  size={15}
                />
              </button>

              <button
                type="button"
                className="active"
              >
                1
              </button>

              <button
                type="button"
              >
                <ChevronRight
                  size={15}
                />
              </button>

            </div>


            <select defaultValue="10">
              <option value="10">
                10 / page
              </option>

              <option value="20">
                20 / page
              </option>

              <option value="50">
                50 / page
              </option>
            </select>

          </div>

        </CuraCard>


        {/* =================================================
            RIGHT SIDE - DETAILS
        ================================================== */}

        <CuraCard
          title="Patient Details"
          className="staff-patient-details-card"
        >

          {!selectedPatient ? (

            <div className="staff-patient-details-empty">

              <div className="staff-patient-details-empty-avatar">
                <CircleUserRound
                  size={43}
                />
              </div>

              <h3>
                No patient selected
              </h3>

              <p>
                Select a patient from
                the list to view their
                details.
              </p>


              <div className="staff-patient-detail-placeholder">

                <DetailPlaceholder
                  icon={
                    <CircleUserRound
                      size={17}
                    />
                  }
                  title="Personal Information"
                />

                <DetailPlaceholder
                  icon={
                    <Phone
                      size={17}
                    />
                  }
                  title="Contact Information"
                />

                <DetailPlaceholder
                  icon={
                    <UserRoundCheck
                      size={17}
                    />
                  }
                  title="Patient Status"
                />

                <DetailPlaceholder
                  icon={
                    <CalendarDays
                      size={17}
                    />
                  }
                  title="Registration Information"
                />

              </div>

            </div>

          ) : (

            <PatientDetails
              patient={
                selectedPatient
              }
              age={
                calculateAge(
                  selectedPatient
                    .birth_date
                )
              }
              fullName={
                getFullName(
                  selectedPatient
                )
              }
              initials={
                getInitials(
                  selectedPatient
                )
              }
              formatDate={
                formatDate
              }
              statusClass={
                getStatusClass(
                  selectedPatient
                    .status
                )
              }
            />

          )}

        </CuraCard>

      </div>

    </div>
  );
};


/* =========================================================
   SELECTED PATIENT DETAILS
========================================================= */

const PatientDetails = ({
  patient,
  age,
  fullName,
  initials,
  formatDate,
  statusClass,
}) => {
  const address = [
    patient.street_address,
    patient.barangay,
    patient.city,
    patient.province,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="staff-patient-details">

      {/* PROFILE */}

      <div className="staff-patient-details-profile">

        <div className="staff-patient-details-avatar">
          {initials}
        </div>

        <div className="staff-patient-details-heading">

          <h3>
            {fullName}
          </h3>

          <p>
            {patient.patient_number}
          </p>

        </div>

        <span
          className={`staff-patient-status ${statusClass}`}
        >
          {patient.status ||
            "—"}
        </span>

      </div>


      {/* PERSONAL INFORMATION */}

      <DetailSection
        icon={
          <CircleUserRound
            size={17}
          />
        }
        title="Personal Information"
      >

        <DetailRow
          label="Full Name"
          value={fullName}
        />

        <DetailRow
          label="Birth Date"
          value={formatDate(
            patient.birth_date
          )}
        />

        <DetailRow
          label="Age"
          value={
            age !== null
              ? `${age} years old`
              : "—"
          }
        />

        <DetailRow
          label="Sex"
          value={
            patient.sex ||
            "—"
          }
        />

      </DetailSection>


      {/* CONTACT */}

      <DetailSection
        icon={
          <Phone size={17} />
        }
        title="Contact Information"
      >

        <DetailRow
          label="Phone"
          value={
            patient.phone_number ||
            "—"
          }
        />

        <DetailRow
          label="Email"
          value={
            patient.email ||
            "—"
          }
        />

        <DetailRow
          label="Address"
          value={
            address || "—"
          }
        />

      </DetailSection>


      {/* STATUS */}

      <DetailSection
        icon={
          <UserRoundCheck
            size={17}
          />
        }
        title="Patient Status"
      >

        <DetailRow
          label="Status"
          value={
            patient.status ||
            "—"
          }
        />

      </DetailSection>


      {/* REGISTRATION */}

      <DetailSection
        icon={
          <CalendarDays
            size={17}
          />
        }
        title="Registration Information"
      >

        <DetailRow
          label="Patient ID"
          value={
            patient.patient_number ||
            "—"
          }
        />

        <DetailRow
          label="Date Registered"
          value={formatDate(
            patient.created_at
          )}
        />

      </DetailSection>


      {/* EMERGENCY CONTACT */}

      <DetailSection
        icon={<Phone size={17} />}
        title="Emergency Contact"
      >

        <DetailRow
          label="Name"
          value={
            patient
              .emergency_contact_name ||
            "—"
          }
        />

        <DetailRow
          label="Relationship"
          value={
            patient
              .emergency_contact_relationship ||
            "—"
          }
        />

        <DetailRow
          label="Contact Number"
          value={
            patient
              .emergency_contact_phone ||
            "—"
          }
        />

      </DetailSection>

    </div>
  );
};


const DetailSection = ({
  icon,
  title,
  children,
}) => (
  <section className="staff-patient-detail-section">

    <h4>
      {icon}
      {title}
    </h4>

    <div className="staff-patient-detail-rows">
      {children}
    </div>

  </section>
);


const DetailRow = ({
  label,
  value,
}) => (
  <div className="staff-patient-detail-row">

    <span>
      {label}
    </span>

    <strong>
      {value}
    </strong>

  </div>
);


const DetailPlaceholder = ({
  icon,
  title,
}) => (
  <div className="staff-patient-placeholder-section">

    <div>
      {icon}

      <span>
        {title}
      </span>
    </div>

    <i />
    <i />

  </div>
);


export default Patients;