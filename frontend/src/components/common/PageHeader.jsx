import {
  Bell,
  Moon,
  Search,
  Sparkles,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const PageHeader = ({
  title = "Dashboard",
  description = "Overview of clinic operations and patient flow.",
  showHeading = true,
}) => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem("cura_dark_mode") === "true",
  );
  const roleName = user?.role || "staff";
  const displayName = user?.name || `CURA ${roleName}`;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("cura_dark_mode", String(darkMode));
  }, [darkMode]);

  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="cura-header">
      <div className="cura-header-left">
        <div className="flex items-center gap-2 text-[13px] text-[#678280] dark:text-[#8aa3a0]">
          <Sparkles size={15} className="text-[#18a999]" />
          <span>
            Welcome back, <strong className="font-bold text-[#324a49] dark:text-[#d7e4e2]">{displayName}</strong>
          </span>
        </div>

        {showHeading && (
          <>
            <h1 className="mt-3 text-[42px] font-black leading-none tracking-[-0.04em] text-[#1d2f3c] dark:text-white">
              {title}
            </h1>
            <p className="mt-2 text-[13px] font-medium text-[#829b99] dark:text-[#708886]">
              {description}
            </p>
          </>
        )}
      </div>

      <div className="cura-header-actions">
        <label className="cura-search">
          <Search size={20} />
          <input type="search" placeholder="Search..." aria-label="Search" />
        </label>

        <button
          type="button"
          className="cura-icon-button"
          onClick={() => setDarkMode((current) => !current)}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={21} /> : <Moon size={21} />}
        </button>

        <button
          type="button"
          className="cura-icon-button cura-notification"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={21} />
          <span className="cura-notification-dot" />
        </button>

        <div className="cura-profile">
          <div className="cura-avatar">{initials}</div>
          <div className="cura-profile-info">
            <p className="cura-profile-name">{displayName}</p>
            <p className="cura-profile-role">{roleName}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;