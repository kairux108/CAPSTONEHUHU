
import { CalendarDays } from "lucide-react";

const Appointments = () => {
  return (
    <div className="space-y-5">
      <div className="rounded-[22px] border border-white/60 bg-white/75 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dff3ee] text-[#18a999]">
            <CalendarDays size={23} />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#18a999]">
              Doctor Portal
            </p>

            <h2 className="mt-1 text-xl font-black text-[#263d3c]">
              My Appointments
            </h2>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-[#edf7f4] p-5">
          <p className="text-sm font-bold text-[#38514f]">
            Doctor Appointments
          </p>

          <p className="mt-2 text-sm text-[#607b79]">
            This module will display appointments
            assigned to the logged-in doctor.
          </p>

          <p className="mt-3 text-xs text-[#78908e]">
            Appointment records are not connected yet.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
