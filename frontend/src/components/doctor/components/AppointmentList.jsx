
import { CalendarDays } from "lucide-react";

const StatusBadge = ({ status }) => {
  const normalized = String(
    status || "unknown"
  ).toLowerCase();

  const styles = {
    scheduled: "bg-blue-100 text-blue-700",
    checked_in: "bg-amber-100 text-amber-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    no_show: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-bold ${
        styles[normalized] ||
        "bg-gray-100 text-gray-600"
      }`}
    >
      {normalized
        .replaceAll("_", " ")
        .replace(/\b\w/g, (letter) =>
          letter.toUpperCase()
        )}
    </span>
  );
};

const AppointmentList = ({
  appointments = [],
}) => {
  const visible = appointments.slice(0, 6);

  return (
    <section className="overflow-hidden rounded-[22px] border border-white/60 bg-white/75 shadow-[0_14px_32px_rgba(44,78,75,0.11)]">
      <div className="flex items-center justify-between border-b border-[#e5efec] px-5 py-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#18a999]">
            Today's Schedule
          </p>

          <h3 className="mt-1 text-lg font-black text-[#263d3c]">
            Upcoming Appointments
          </h3>
        </div>

        <CalendarDays
          size={19}
          className="text-[#18a999]"
        />
      </div>

      {visible.length === 0 ? (
        <div className="p-8 text-center">
          <CalendarDays
            size={26}
            className="mx-auto text-[#a0b6b2]"
          />

          <p className="mt-3 text-sm font-bold text-[#38514f]">
            No appointments today
          </p>

          <p className="mt-1 text-xs text-[#78908e]">
            You have no assigned appointments for
            the selected day.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead className="bg-[#edf7f4]">
              <tr className="text-[10px] uppercase text-[#607b79]">
                <th className="px-5 py-3">
                  Patient
                </th>
                <th className="px-5 py-3">
                  Time
                </th>
                <th className="px-5 py-3">
                  Reason
                </th>
                <th className="px-5 py-3">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#e5efec]">
              {visible.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-5 py-3">
                    <p className="text-xs font-bold text-[#38514f]">
                      {appointment.patientName}
                    </p>

                    <p className="mt-1 text-[10px] text-[#78908e]">
                      {appointment.appointmentNumber}
                    </p>
                  </td>

                  <td className="px-5 py-3 text-xs font-medium text-[#607b79]">
                    {appointment.time}
                  </td>

                  <td className="px-5 py-3 text-xs text-[#607b79]">
                    {appointment.reason ||
                      "Not specified"}
                  </td>

                  <td className="px-5 py-3">
                    <StatusBadge
                      status={appointment.status}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {appointments.length > 6 && (
        <p className="border-t border-[#e5efec] px-5 py-3 text-xs text-[#78908e]">
          Showing 6 of {appointments.length} appointments.
        </p>
      )}
    </section>
  );
};

export default AppointmentList;
