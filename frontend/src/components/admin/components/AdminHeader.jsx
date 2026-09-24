import { MapPin } from "lucide-react";

const AdminHeader = () => (
  <div
    className="
      mb-4
      flex flex-col
      justify-between
      gap-3

      sm:flex-row
      sm:items-end
    "
  >
    <div>
      <h1
        className="
          text-[22px]
          font-semibold
          tracking-[-0.02em]
          text-[#152947]

          sm:text-[25px]
        "
      >
        Good morning, Admin!
      </h1>

      <p className="mt-1 text-[12px] text-[#687b94]">
        Here's an overview of your clinic today.
      </p>
    </div>

    <div
      className="
        text-left
        text-[10px]
        text-[#687b94]

        sm:text-right
      "
    >
      <p>Tue, Apr 22, 2026</p>

      <p className="mt-1 flex items-center gap-1 sm:justify-end">
        <MapPin size={11} />
        CURA Main Clinic
      </p>
    </div>
  </div>
);

export default AdminHeader;
