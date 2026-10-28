
import { CalendarDays, UserRound } from "lucide-react";

const formatName = (patient) => {
  if (!patient) return "No patient selected";

  const parts = [
    patient.first_name,
    patient.middle_name,
    patient.last_name,
    patient.suffix,
  ].filter(Boolean);

  return (
    patient.full_name ||
    parts.join(" ") ||
    "Patient name unavailable"
  );
};

const PatientConsultationHeader = ({
  patient = null,
  appointment = null,
}) => {
  return (
    <section className="rounded-[22px] border border-white/70 bg-white/80 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">

        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#dff3ee] text-[#18a999]">
            <UserRound size={22} />
          </div>

          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#18a999]">
              Patient Consultation
            </p>

            <h2 className="mt-1 text-lg font-black text-[#263d3c]">
              {formatName(patient)}
            </h2>

            <p className="mt-1 text-xs text-[#78908e]">
              {patient
                ? [
                    patient.patient_number,
                    patient.sex,
                  ].filter(Boolean).join(" • ") || "Patient record"
                : "Choose an authorized patient from My Queue or Appointments when integration is ready."}
            </p>
          </div>
        </div>

        {appointment?.appointment_date && (
          <div className="flex items-center gap-2 rounded-xl bg-[#edf7f4] px-3 py-2 text-xs font-semibold text-[#42716b]">
            <CalendarDays size={15} />
            {appointment.appointment_date}
          </div>
        )}

      </div>
    </section>
  );
};

export default PatientConsultationHeader;
