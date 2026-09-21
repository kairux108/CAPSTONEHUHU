import {
  Bell,
  Moon,
  Search,
  Sparkles,
  Sun,
} from "lucide-react";

import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({
  darkMode,
  toggleDarkMode,
}) => {
  const { user } = useAuth();
  const location = useLocation();

  const isDashboard =
    location.pathname === "/doctor/dashboard" ||
    location.pathname === "/staff/dashboard";

  const initials = (
    user?.name || "CURA User"
  )
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const dashboardDescription =
    user?.role === "Doctor"
      ? "Overview of doctor activities and clinic performance."
      : "Overview of clinic operations and patient flow.";

  return (
    <header
      className={`
        flex
        gap-5

        ${
          isDashboard
            ? `
              flex-col
              lg:flex-row
              lg:items-start
              lg:justify-between
            `
            : `
              items-center
              justify-end
            `
        }
      `}
    >
      {/* DASHBOARD TITLE ONLY */}

      {isDashboard && (
        <div>
          <div className="flex items-center gap-2 text-[13px] text-[#678280] dark:text-[#8aa3a0]">
            <Sparkles
              size={15}
              className="text-[#18a999]"
            />

            <span>
              Welcome back,{" "}
              <strong className="font-bold text-[#324a49] dark:text-[#d7e4e2]">
                {user?.name ||
                  (user?.role === "Staff"
                    ? "CURA Staff"
                    : "CURA Doctor")}
              </strong>
            </span>
          </div>

          <h1
            className="
              mt-3
              text-[42px]
              font-black
              leading-none
              tracking-[-0.04em]
              text-[#1d2f3c]

              dark:text-white
            "
          >
            Dashboard
          </h1>

          <p className="mt-2 text-[13px] font-medium text-[#829b99] dark:text-[#708886]">
            {dashboardDescription}
          </p>
        </div>
      )}

      {/* RIGHT ACTIONS */}

      <div className="flex items-center gap-2">
        {/* SEARCH */}

        <div
          className="
            hidden
            h-10
            w-[210px]
            items-center
            gap-3
            rounded-[13px]
            bg-white/35
            px-4

            dark:bg-[#192929]

            md:flex
          "
        >
          <Search
            size={15}
            className="text-[#829b99]"
          />

          <input
            type="text"
            placeholder="Search..."
            className="
              w-full
              bg-transparent
              text-[11px]
              text-[#38504f]
              outline-none
              placeholder:text-[#8ca3a1]

              dark:text-[#d5e3e1]
            "
          />
        </div>

        {/* DARK MODE */}

        <button
          type="button"
          onClick={toggleDarkMode}
          className="
            grid
            h-10
            w-10
            place-items-center
            rounded-[13px]
            bg-white/35
            text-[#66817e]
            transition

            hover:bg-white/60
            hover:text-[#18a999]

            dark:bg-[#192929]
            dark:text-[#9ab0ad]
            dark:hover:bg-[#203331]
          "
        >
          {darkMode ? (
            <Sun size={16} />
          ) : (
            <Moon size={16} />
          )}
        </button>

        {/* NOTIFICATION */}

        <button
          type="button"
          className="
            relative
            grid
            h-10
            w-10
            place-items-center
            rounded-[13px]
            bg-white/35
            text-[#66817e]
            transition

            hover:bg-white/60
            hover:text-[#18a999]

            dark:bg-[#192929]
            dark:text-[#9ab0ad]
          "
        >
          <Bell size={16} />

          <span className="absolute right-[8px] top-[8px] h-[5px] w-[5px] rounded-full bg-[#18a999]" />
        </button>

        {/* PROFILE */}

        <div
          className="
            ml-1
            flex
            h-10
            items-center
            gap-3
            rounded-[13px]
            bg-white/35
            px-2
            pr-3

            dark:bg-[#192929]
          "
        >
          <div
            className="
              grid
              h-8
              w-8
              place-items-center
              rounded-full
              bg-[#dff3ee]
              text-[10px]
              font-black
              text-[#117f76]

              dark:bg-[#17413e]
              dark:text-[#65d7cb]
            "
          >
            {initials}
          </div>

          <div className="hidden xl:block">
            <p className="max-w-[110px] truncate text-[10px] font-extrabold text-[#36504f] dark:text-[#d4e3e0]">
              {user?.name || "CURA User"}
            </p>

            <p className="text-[9px] text-[#829b99] dark:text-[#718a87]">
              {user?.role || "Member"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;