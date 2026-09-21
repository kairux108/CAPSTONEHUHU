import {
  CalendarDays,
} from "lucide-react";

const AppointmentCalendar = ({
  selectedDate,
  onSelectDate,
}) => {
  const today = new Date();

  const dates = Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date();

      date.setDate(
        today.getDate() + index
      );

      return date;
    }
  );

  const formatDate = (date) => {
    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <section
      className="
        rounded-[22px]
        border
        border-white/60
        bg-white/68
        p-4
        shadow-[0_12px_28px_rgba(44,78,75,0.10)]

        dark:border-[#29413f]
        dark:bg-[#172827]/85
      "
    >
      <div className="flex items-center gap-3">
        <div
          className="
            grid
            h-9
            w-9
            place-items-center
            rounded-[13px]
            bg-[#dff3ee]
            text-[#18a999]

            dark:bg-[#17413e]
            dark:text-[#65d7cb]
          "
        >
          <CalendarDays size={16} />
        </div>

        <div>
          <p
            className="
              text-[9px]
              font-extrabold
              uppercase
              tracking-[0.13em]
              text-[#18a999]
            "
          >
            Select Date
          </p>

          <p
            className="
              mt-0.5
              text-[13px]
              font-bold
              text-[#38514f]
              dark:text-white
            "
          >
            Next 7 Days
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2">
        {dates.map((date) => {
          const value =
            formatDate(date);

          const active =
            selectedDate === value;

          return (
            <button
              type="button"
              key={value}
              onClick={() =>
                onSelectDate(value)
              }
              className={`
                rounded-[14px]
                px-2
                py-2.5
                transition

                ${
                  active
                    ? `
                      bg-[#18a999]
                      text-white
                      shadow-[0_8px_18px_rgba(24,169,153,0.22)]
                    `
                    : `
                      bg-[#edf7f4]
                      text-[#607b79]

                      hover:bg-[#dff3ee]

                      dark:bg-[#203331]
                      dark:text-[#91aaa7]
                      dark:hover:bg-[#25403d]
                    `
                }
              `}
            >
              <p
                className="
                  text-[8px]
                  font-extrabold
                  uppercase
                "
              >
                {date.toLocaleDateString(
                  "en-US",
                  {
                    weekday: "short",
                  }
                )}
              </p>

              <p
                className="
                  mt-1
                  text-[16px]
                  font-black
                "
              >
                {date.getDate()}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default AppointmentCalendar;