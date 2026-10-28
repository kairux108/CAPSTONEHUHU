
import {
  Stethoscope,
  UserRound,
} from "lucide-react";

const CurrentConsultationCard = ({
  patientName,
  queueNumber,
  startedAt,
}) => {
  const isConsulting = Boolean(queueNumber);

  return (
    <section className="rounded-[22px] bg-gradient-to-br from-[#18a999] to-[#117f76] p-5 text-white shadow-[0_16px_32px_rgba(24,169,153,0.24)]">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-white/75">
          Now Consulting
        </p>

        <Stethoscope size={20} />
      </div>

      <p className="mt-4 text-[32px] font-black">
        {queueNumber || "—"}
      </p>

      <div className="mt-3 flex items-center gap-2">
        <UserRound size={16} />

        <p className="text-sm font-bold">
          {isConsulting
            ? patientName
            : "No active consultation"}
        </p>
      </div>

      <p className="mt-2 text-xs text-white/80">
        {isConsulting
          ? `Started: ${startedAt}`
          : "Waiting for the next consultation."}
      </p>
    </section>
  );
};

export default CurrentConsultationCard;
