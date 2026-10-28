
import { CalendarClock } from "lucide-react";

const MySchedule = () => {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/75 p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <CalendarClock
          size={24}
          className="text-[#18a999]"
        />

        <h2 className="text-xl font-bold text-[#263d3c]">
          My Schedule
        </h2>
      </div>

      <p className="mt-4 text-sm text-[#607b79]">
        Doctor schedule management will be
        implemented here.
      </p>
    </div>
  );
};

export default MySchedule;
