import {
  Eye,
  Pencil,
  Plus,
  Search,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import PatientRegistrationForm from "./PatientRegistrationForm";
import PatientRecordCard from "./PatientRecordCard";
import patientService from "../../services/patientService";

const PatientList = () => {
  const [patients, setPatients] =
    useState(() =>
      patientService.getAll()
    );

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

  const [showForm, setShowForm] =
    useState(false);

  const [
    selectedPatient,
    setSelectedPatient,
  ] = useState(null);

  const [
    editingPatient,
    setEditingPatient,
  ] = useState(null);

  const filteredPatients =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      return patients.filter(
        (patient) => {
          const fullName =
            `${patient.firstName} ${patient.middleName || ""} ${patient.lastName}`.toLowerCase();

          const matchSearch =
            !keyword ||
            fullName.includes(
              keyword
            ) ||
            patient.patientNumber
              ?.toLowerCase()
              .includes(keyword);

          const matchStatus =
            statusFilter === "All" ||
            patient.status ===
              statusFilter;

          return (
            matchSearch &&
            matchStatus
          );
        }
      );
    }, [
      patients,
      search,
      statusFilter,
    ]);

  const active =
    patients.filter(
      (patient) =>
        patient.status ===
        "Active"
    ).length;

  const handleCreate = (
    data
  ) => {
    patientService.create(data);

    setPatients(
      patientService.getAll()
    );

    setShowForm(false);
  };

  const handleUpdate = (
    data
  ) => {
    patientService.update(
      editingPatient.id,
      data
    );

    setPatients(
      patientService.getAll()
    );

    setEditingPatient(null);
    setShowForm(false);
  };

  const handleEdit = (
    patient
  ) => {
    setSelectedPatient(null);
    setEditingPatient(patient);
    setShowForm(true);
  };

  return (
    <div>
      {/* PAGE HEADER */}

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#18a999]">
            Patient Management
          </p>

          <h2 className="mt-1 text-[22px] font-black text-[#263d3c] dark:text-white">
            Patients
          </h2>

          <p className="mt-1 text-[12px] text-[#78908e]">
            Register, search, and manage clinic patient records.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPatient(null);
            setShowForm(true);
          }}
          className="
            flex
            items-center
            gap-2
            rounded-[13px]
            bg-[#18a999]
            px-5
            py-2.5
            text-[11px]
            font-bold
            text-white
            shadow-[0_9px_20px_rgba(24,169,153,0.22)]

            hover:bg-[#138f83]
          "
        >
          <Plus size={15} />
          Add Patient
        </button>
      </div>

      {/* STATS */}

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <StatCard
          icon={<UsersRound size={18} />}
          title="Total Patients"
          value={patients.length}
          detail="Registered records"
        />

        <StatCard
          icon={
            <UserRoundCheck
              size={18}
            />
          }
          title="Active Patients"
          value={active}
          detail="Currently active"
        />

        <StatCard
          icon={<Search size={18} />}
          title="Results"
          value={
            filteredPatients.length
          }
          detail="Matching your filters"
        />
      </div>

      {/* PATIENT TABLE */}

      <section className="mt-5 overflow-hidden rounded-[22px] border border-white/60 bg-white/68 shadow-[0_14px_32px_rgba(44,78,75,0.11)] dark:border-[#29413f] dark:bg-[#172827]/85">
        <div className="flex flex-col gap-3 border-b border-white/60 p-5 dark:border-[#29413f] md:flex-row md:items-center md:justify-between">
          <div className="flex h-10 w-full max-w-[350px] items-center gap-3 rounded-[13px] bg-[#edf7f4] px-4 dark:bg-[#203331]">
            <Search
              size={15}
              className="text-[#78908e]"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search patient..."
              className="w-full bg-transparent text-[11px] text-[#38514f] outline-none dark:text-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="h-10 rounded-[13px] bg-[#edf7f4] px-4 text-[11px] font-bold text-[#607b79] outline-none dark:bg-[#203331] dark:text-[#91aaa7]"
          >
            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-[#edf7f4]/70 dark:bg-[#122120]">
              <tr>
                <Head>
                  Patient
                </Head>
                <Head>
                  Patient No.
                </Head>
                <Head>
                  Contact
                </Head>
                <Head>
                  Sex
                </Head>
                <Head>
                  Last Visit
                </Head>
                <Head>
                  Status
                </Head>
                <Head>
                  Action
                </Head>
              </tr>
            </thead>

            <tbody>
              {filteredPatients.map(
                (patient) => (
                  <PatientRow
                    key={patient.id}
                    patient={
                      patient
                    }
                    onView={() =>
                      setSelectedPatient(
                        patient
                      )
                    }
                    onEdit={() =>
                      handleEdit(
                        patient
                      )
                    }
                  />
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showForm && (
        <PatientRegistrationForm
          patient={
            editingPatient
          }
          onSave={
            editingPatient
              ? handleUpdate
              : handleCreate
          }
          onCancel={() => {
            setShowForm(false);
            setEditingPatient(
              null
            );
          }}
        />
      )}

      {selectedPatient && (
        <PatientRecordCard
          patient={
            selectedPatient
          }
          onClose={() =>
            setSelectedPatient(
              null
            )
          }
          onEdit={
            handleEdit
          }
        />
      )}
    </div>
  );
};

const StatCard = ({
  icon,
  title,
  value,
  detail,
}) => (
  <article className="rounded-[19px] border border-white/60 bg-white/68 px-4 py-4 shadow-[0_10px_24px_rgba(44,78,75,0.10)] dark:border-[#29413f] dark:bg-[#172827]/85">
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#dff3ee] text-[#18a999] dark:bg-[#17413e] dark:text-[#65d7cb]">
        {icon}
      </div>

      <div>
        <div className="flex items-end gap-2">
          <p className="text-[24px] font-black leading-none text-[#263d3c] dark:text-white">
            {value}
          </p>

          <p className="text-[11px] font-bold text-[#607b79] dark:text-[#91aaa7]">
            {title}
          </p>
        </div>

        <p className="mt-2 text-[9px] text-[#8aa09e]">
          {detail}
        </p>
      </div>
    </div>
  </article>
);

const PatientRow = ({
  patient,
  onView,
  onEdit,
}) => {
  const name = [
    patient.firstName,
    patient.middleName,
    patient.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <tr className="border-t border-white/50 hover:bg-[#edf7f4]/50 dark:border-[#29413f] dark:hover:bg-[#203331]">
      <td className="px-5 py-3.5 text-[12px] font-extrabold text-[#38514f] dark:text-white">
        {name}
      </td>

      <Cell>
        {patient.patientNumber}
      </Cell>

      <Cell>
        {patient.contactNumber ||
          "—"}
      </Cell>

      <Cell>
        {patient.sex}
      </Cell>

      <Cell>
        {patient.lastVisit}
      </Cell>

      <td className="px-5 py-3.5">
        <span className="rounded-full bg-[#dff3ee] px-3 py-1 text-[9px] font-bold text-[#117f76] dark:bg-[#17413e] dark:text-[#65d7cb]">
          {patient.status}
        </span>
      </td>

      <td className="px-5 py-3.5">
        <div className="flex gap-1">
          <button
            onClick={onView}
            className="grid h-8 w-8 place-items-center rounded-xl text-[#78908e] hover:bg-[#dff3ee] hover:text-[#18a999]"
          >
            <Eye size={14} />
          </button>

          <button
            onClick={onEdit}
            className="grid h-8 w-8 place-items-center rounded-xl text-[#78908e] hover:bg-[#dff3ee] hover:text-[#18a999]"
          >
            <Pencil size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const Head = ({
  children,
}) => (
  <th className="px-5 py-3 text-left text-[8px] font-extrabold uppercase tracking-[0.1em] text-[#829b99]">
    {children}
  </th>
);

const Cell = ({
  children,
}) => (
  <td className="px-5 py-3.5 text-[11px] text-[#607b79] dark:text-[#91aaa7]">
    {children}
  </td>
);

export default PatientList;