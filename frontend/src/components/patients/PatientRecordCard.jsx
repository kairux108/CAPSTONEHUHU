import {
  CalendarDays,
  Droplets,
  Mail,
  MapPin,
  Pencil,
  Phone,
  UserRound,
  X,
} from "lucide-react";

const PatientRecordCard = ({
  patient,
  onClose,
  onEdit,
}) => {
  if (!patient) return null;

  const fullName = [
    patient.firstName,
    patient.middleName,
    patient.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-[720px] overflow-y-auto rounded-[24px] bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-7 py-6">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-100 text-blue-600">
              <UserRound size={27} />
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-blue-500">
                Patient Record
              </p>

              <h2 className="mt-1 text-2xl font-extrabold text-[#153a5d]">
                {fullName}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {patient.patientNumber}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        </div>

        <div className="p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoItem
              icon={<CalendarDays size={17} />}
              label="Birth Date"
              value={patient.birthDate || "Not provided"}
            />

            <InfoItem
              icon={<UserRound size={17} />}
              label="Sex"
              value={patient.sex || "Not provided"}
            />

            <InfoItem
              icon={<Droplets size={17} />}
              label="Blood Type"
              value={patient.bloodType || "Not provided"}
            />

            <InfoItem
              icon={<UserRound size={17} />}
              label="Civil Status"
              value={patient.civilStatus || "Not provided"}
            />

            <InfoItem
              icon={<Phone size={17} />}
              label="Contact Number"
              value={patient.contactNumber || "Not provided"}
            />

            <InfoItem
              icon={<Mail size={17} />}
              label="Email"
              value={patient.email || "Not provided"}
            />
          </div>

          <div className="mt-4">
            <InfoItem
              icon={<MapPin size={17} />}
              label="Address"
              value={patient.address || "Not provided"}
            />
          </div>

          <div className="mt-7">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
              Emergency Contact
            </p>

            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <InfoItem
                icon={<UserRound size={17} />}
                label="Contact Person"
                value={
                  patient.emergencyContact ||
                  "Not provided"
                }
              />

              <InfoItem
                icon={<Phone size={17} />}
                label="Contact Number"
                value={
                  patient.emergencyNumber ||
                  "Not provided"
                }
              />
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#f4f9fd] p-5">
              <p className="text-xs font-semibold text-slate-400">
                Patient Status
              </p>

              <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                {patient.status}
              </span>
            </div>

            <div className="rounded-2xl bg-[#f4f9fd] p-5">
              <p className="text-xs font-semibold text-slate-400">
                Last Visit
              </p>

              <p className="mt-2 font-bold text-[#153a5d]">
                {patient.lastVisit}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-7 py-5">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600"
          >
            Close
          </button>

          <button
            onClick={() => onEdit(patient)}
            className="flex items-center gap-2 rounded-xl bg-[#3185e8] px-5 py-2.5 text-sm font-bold text-white"
          >
            <Pencil size={15} />
            Edit Patient
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-4">
    <div className="mt-[1px] text-blue-500">
      {icon}
    </div>

    <div>
      <p className="text-[11px] font-semibold text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#173957]">
        {value}
      </p>
    </div>
  </div>
);

export default PatientRecordCard;