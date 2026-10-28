
import {
  Clock3,
  Stethoscope,
  UserRound,
} from "lucide-react";

const NextPatientCard = ({
  patientName,
  queueNumber,
  appointmentTime,
  status,
}) => {
  const hasPatient = Boolean(queueNumber);

  return (
    <section className="rounded-[22px] border border-white/60 bg-white/75 p-5 shadow-[0_14px_32px_rgba(44,78,75,0.11)]">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#dff3ee] text-[#18a999]">
          <Stethoscope size={21} />
        </div>

        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#18a999]">
            Next Consultation
          </p>

          <h3 className="mt-1 text-lg font-black text-[#263d3c]">
            {hasPatient
              ? patientName
              : "No patient waiting"}
          </h3>

          <p className="mt-1 text-xs text-[#78908e]">
            {hasPatient
              ? "Assigned to your queue"
              : "No patient has been called or is waiting."}
          </p>
        </div>
      </div>

      {hasPatient && (
        <div className="mt-5 grid gap-3 rounded-2xl bg-[#edf7f4] p-4 sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <UserRound
              size={16}
              className="text-[#18a999]"
            />

            <div>
              <p className="text-[10px] text-[#78908e]">
                Queue
              </p>

              <p className="text-xs font-bold text-[#38514f]">
                {queueNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock3
              size={16}
              className="text-[#18a999]"
            />

            <div>
              <p className="text-[10px] text-[#78908e]">
                Appointment
              </p>

              <p className="text-xs font-bold text-[#38514f]">
                {appointmentTime || "Not set"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-[10px] text-[#78908e]">
              Status
            </p>

            <p className="text-xs font-bold capitalize text-[#117f76]">
              {status || "Waiting"}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default NextPatientCard;
