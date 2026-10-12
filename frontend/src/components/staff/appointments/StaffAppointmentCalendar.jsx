import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import CuraCard from "../../common/CuraCard";

const getLocalDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const StaffAppointmentCalendar = ({
  selectedDate,
  setSelectedDate,
  appointments = [],
}) => {
  const selected = selectedDate
    ? new Date(`${selectedDate}T00:00:00`)
    : new Date();

  const [viewDate, setViewDate] = useState(
    new Date(selected.getFullYear(), selected.getMonth(), 1)
  );

  useEffect(() => {
    if (!selectedDate) return;

    const date = new Date(`${selectedDate}T00:00:00`);

    setViewDate(
      new Date(date.getFullYear(), date.getMonth(), 1)
    );
  }, [selectedDate]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [
    ...Array(firstDay).fill(null),
    ...Array.from(
      { length: daysInMonth },
      (_, index) => index + 1
    ),
  ];

  const formatCalendarDate = (day) => {
    const monthValue = String(month + 1).padStart(2, "0");
    const dayValue = String(day).padStart(2, "0");

    return `${year}-${monthValue}-${dayValue}`;
  };

  const appointmentDates = useMemo(
    () =>
      new Set(
        appointments
          .map((appointment) =>
            String(
              appointment.appointment_date || ""
            ).split("T")[0]
          )
          .filter(Boolean)
      ),
    [appointments]
  );

  const previousMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setSelectedDate(getLocalDate());
  };

  return (
    <CuraCard className="staff-appointment-calendar-card">
      <div className="staff-calendar-header">
        <h3>
          {viewDate.toLocaleDateString("en-PH", {
            month: "long",
            year: "numeric",
          })}
        </h3>

        <div>
          <button type="button" onClick={previousMonth}>
            <ChevronLeft size={15} />
          </button>

          <button type="button" onClick={nextMonth}>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="staff-calendar-weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
          (day) => (
            <span key={day}>{day}</span>
          )
        )}
      </div>

      <div className="staff-calendar-grid">
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} />;
          }

          const date = formatCalendarDate(day);
          const active = selectedDate === date;
          const hasAppointment = appointmentDates.has(date);

          return (
            <button
              type="button"
              key={date}
              className={active ? "active" : ""}
              onClick={() => setSelectedDate(date)}
            >
              {day}
              {hasAppointment && <i />}
            </button>
          );
        })}
      </div>

      <div className="staff-calendar-quick">
        <h4>Quick Filters</h4>

        <button type="button" onClick={goToToday}>
          Today
        </button>
      </div>
    </CuraCard>
  );
};

export default StaffAppointmentCalendar;