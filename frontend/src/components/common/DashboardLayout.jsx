import {
  useEffect,
  useState,
} from "react";

import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = () => {
  const [darkMode, setDarkMode] =
    useState(() => {
      return (
        localStorage.getItem(
          "cura_dark_mode"
        ) === "true"
      );
    });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem(
      "cura_dark_mode",
      String(darkMode)
    );
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-[#cfe7e3]
        via-[#deeeec]
        to-[#dfe8f4]

        dark:from-[#0d1718]
        dark:via-[#111d1e]
        dark:to-[#172129]
      "
    >
      <div className="flex min-h-screen">
        {/* SIDEBAR */}

        <Sidebar
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />

        {/* MAIN AREA */}

        <div className="min-w-0 flex-1">
          <div className="px-7 pt-7">
            <Navbar
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          </div>

          <main className="px-7 pb-7 pt-5">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;