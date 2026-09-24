import {
  HeartPulse,
  LogOut,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import { navigationConfig } from "./navigation/navigationConfig";

const Sidebar = () => {
  const {
    user,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  // Standardize role:
  // Admin -> admin
  // Doctor -> doctor
  // Staff -> staff
  const role = user?.role?.toLowerCase();

  // Get navigation based on logged-in role
  const links = navigationConfig[role] || [];

  const panelTitle = {
    admin: "Admin Panel",
    doctor: "Doctor Panel",
    staff: "Staff Panel",
  };

  const handleLogout = () => {
    logout();

    navigate("/");
  };

  return (
    <aside
      className="
        sticky
        left-0
        top-0
        flex
        h-screen
        w-[245px]
        shrink-0
        flex-col
        border-r
        border-white/45
        bg-[#e9f3f1]/88
        px-5
        py-7
        backdrop-blur-xl

        dark:border-[#294040]
        dark:bg-[#132020]/95
      "
    >
      {/* LOGO */}
      <div className="flex items-center gap-3 px-2">
        <div
          className="
            grid
            h-11
            w-11
            place-items-center
            rounded-[15px]
            bg-gradient-to-br
            from-[#18b7ae]
            to-[#0798a6]
            text-white
            shadow-[0_10px_22px_rgba(13,148,136,0.22)]
          "
        >
          <HeartPulse size={21} />
        </div>

        <div>
          <h1
            className="
              text-[22px]
              font-black
              tracking-tight
              text-[#1c2b39]
              dark:text-white
            "
          >
            CURA
          </h1>

          <p
            className="
              text-[11px]
              font-medium
              text-[#7a9391]
              dark:text-[#78908e]
            "
          >
            Healthcare System
          </p>
        </div>
      </div>

      {/* PANEL TITLE */}
      <p
        className="
          mt-10
          px-3
          text-[11px]
          font-extrabold
          uppercase
          tracking-[0.18em]
          text-[#839b99]
          dark:text-[#69817f]
        "
      >
        {panelTitle[role] || "CURA Panel"}
      </p>

      {/* NAVIGATION */}
      <nav className="mt-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `
                  flex
                  h-[50px]
                  items-center
                  gap-4
                  rounded-[14px]
                  px-4
                  text-[14px]
                  font-bold
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? `
                        bg-gradient-to-r
                        from-[#18b7ae]
                        to-[#079fb4]
                        text-white
                        shadow-[0_10px_24px_rgba(13,148,136,0.22)]
                      `
                      : `
                        text-[#5c7474]
                        hover:bg-white/45
                        hover:text-[#1e3a3a]

                        dark:text-[#8fa6a4]
                        dark:hover:bg-[#1c3030]
                        dark:hover:text-white
                      `
                  }
                `
              }
            >
              <Icon
                size={18}
                strokeWidth={2}
              />

              {link.label}
            </NavLink>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="mt-auto">
        <button
          type="button"
          onClick={handleLogout}
          className="
            flex
            h-11
            w-full
            items-center
            gap-3
            rounded-[12px]
            px-4
            text-[12px]
            font-bold
            text-[#78908e]
            transition

            hover:bg-red-50
            hover:text-red-500

            dark:text-[#78908e]
            dark:hover:bg-red-500/10
            dark:hover:text-red-400
          "
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;