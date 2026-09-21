import {
  Clock3,
  Megaphone,
  UserRound,
} from "lucide-react";

const NowServingCard = ({
  patient,
}) => {
  if (!patient) {
    return (
      <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[18px] bg-[#edf7f4] p-6 text-center dark:bg-[#203331]">
        <div className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#dff3ee] text-[#18a999] dark:bg-[#17413e] dark:text-[#65d7cb]">
          <Megaphone
            size={18}
          />
        </div>

        <p className="mt-4 text-[11px] font-extrabold text-[#607b79] dark:text-[#91aaa7]">
          No patient currently
          being served.
        </p>

        <p className="mt-1 text-[9px] leading-5 text-[#829b99]">
          Select Call Next or
          manually serve a patient
          from the queue.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[18px] bg-gradient-to-br from-[#18a999] to-[#117f76] p-5 text-white shadow-[0_16px_30px_rgba(24,169,153,0.22)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-white/65">
            Now Serving
          </p>

          <p className="mt-2 text-[34px] font-black leading-none">
            {
              patient.queueNumber
            }
          </p>
        </div>

        <div className="grid h-11 w-11 place-items-center rounded-full bg-white/15">
          <Megaphone size={19} />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3">
          <UserRound
            size={14}
            className="text-white/70"
          />

          <div>
            <p className="text-[8px] uppercase text-white/55">
              Patient
            </p>

            <p className="text-[12px] font-bold">
              {patient.patient}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Clock3
            size={14}
            className="text-white/70"
          />

          <div>
            <p className="text-[8px] uppercase text-white/55">
              Joined
            </p>

            <p className="text-[11px] font-bold">
              {patient.time}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-white/15 px-3 py-1 text-[9px] font-bold">
          {patient.priority}
        </span>

        <span className="rounded-full bg-white/15 px-3 py-1 text-[9px] font-bold">
          {patient.queueType}
        </span>
      </div>
    </div>
  );
};

export default NowServingCard;