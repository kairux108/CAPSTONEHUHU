import { ArrowRight, UsersRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StaffQueueOverview = () => {
  const navigate = useNavigate();

  return (
    <section
      className="
        rounded-[22px]
        bg-gradient-to-br
        from-[#18a999]
        to-[#117f76]
        p-5
        text-white
        shadow-[0_16px_32px_rgba(24,169,153,0.24)]
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-white/65">
            Queue Overview
          </p>
          <p className="mt-2 text-[34px] font-black leading-none">7</p>
          <p className="mt-3 text-[12px] font-bold">Patients Waiting</p>
          <p className="mt-1 text-[10px] text-white/70">
            4 appointments • 3 walk-ins
          </p>
        </div>

        <div className="grid h-11 w-11 place-items-center rounded-full bg-white/15">
          <UsersRound size={19} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate("/staff/queue")}
        className="
          mt-5
          flex
          items-center
          gap-2
          rounded-full
          bg-white
          px-4
          py-2
          text-[10px]
          font-bold
          text-[#117f76]
        "
      >
        Open Queue
        <ArrowRight size={12} />
      </button>
    </section>
  );
};

export default StaffQueueOverview;
