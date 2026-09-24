import { useState } from "react";

import {
  Search,
  Bell,
  Settings as SettingsIcon,
  ShieldCheck,
  Building2,
  SlidersHorizontal,
  Save,
  LockKeyhole,
  Pencil,
  Users,
  BellRing,
  Plug,
  Database,
  Upload,
} from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("General");

  const [systemName, setSystemName] = useState("CURA");
  const [tagline, setTagline] = useState(
    "Care Today for a Healthier Tomorrow"
  );
  const [timezone, setTimezone] = useState(
    "(UTC+08:00) Manila, Philippines"
  );
  const [dateFormat, setDateFormat] = useState(
    "September 21, 2026 (MMMM DD, YYYY)"
  );
  const [timeFormat, setTimeFormat] = useState(
    "12-hour (AM/PM)"
  );
  const [language, setLanguage] = useState("English");

  const [sessionTimeout, setSessionTimeout] =
    useState("30 minutes");

  const [maxLoginAttempts, setMaxLoginAttempts] =
    useState("5 attempts");

  const [passwordExpiration, setPasswordExpiration] =
    useState("90 days");

  const [twoFactor, setTwoFactor] = useState(false);

  const [preferences, setPreferences] = useState({
    onlineAppointments: true,
    patientRegistration: true,
    appointmentApproval: false,
    queueNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
  });

  const tabs = [
    "General",
    "Users & Roles",
    "Clinic Information",
    "System Preferences",
    "Security",
    "Notifications",
    "Integrations",
    "Backup & Data",
  ];

  const togglePreference = (key) => {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const saveGeneralSettings = () => {
    alert("General settings saved successfully.");
  };

  const savePreferences = () => {
    alert("System preferences saved successfully.");
  };

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-5">

      {/* =====================================================
          TOP HEADER
      ====================================================== */}

      <div
        className="
          !hidden
          mb-4
          flex flex-col gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div className="relative w-full max-w-xl">
          <Search
            size={16}
            className="
              absolute left-4 top-1/2
              -translate-y-1/2
              text-[#73839a]
            "
          />

          <input
            placeholder="Search patients, appointments, or records..."
            className="
              h-10 w-full
              rounded-2xl
              border border-[#dae7e9]
              bg-white/90
              pl-10 pr-4
              text-[11px]
              text-[#354863]
              shadow-sm
              outline-none
            "
          />
        </div>

        <div className="flex items-center justify-end gap-4">

          <button className="relative text-[#40536f]">
            <Bell size={18} />

            <span
              className="
                absolute -right-1 -top-1
                h-2 w-2
                rounded-full
                bg-red-500
                ring-2 ring-white
              "
            />
          </button>

          <div
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-full
              bg-[#d7f5ed]
              text-[11px]
              font-semibold
              text-[#087c75]
            "
          >
            AD
          </div>

          <div className="hidden sm:block">
            <p className="text-[11px] font-semibold text-[#203450]">
              Admin User
            </p>

            <p className="text-[9px] text-[#728198]">
              Administrator
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          TITLE
      ====================================================== */}

      <div className="mb-4">
        <h1 className="text-[24px] font-semibold text-[#152b49]">
          Settings
        </h1>

        <p className="mt-1 text-[11px] text-[#6e7f96]">
          Manage system preferences, users, security, and more.
        </p>
      </div>

      {/* =====================================================
          SETTINGS TABS
      ====================================================== */}

      <div
        className="
          mb-4
          flex gap-1
          overflow-x-auto
          border-b border-[#dfeaea]
        "
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              whitespace-nowrap
              px-4 py-2.5
              text-[9px]
              font-medium
              transition

              ${
                activeTab === tab
                  ? "border-b-2 border-[#0bad92] text-[#078b79]"
                  : "text-[#66788e] hover:text-[#078b79]"
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* =====================================================
          GENERAL
      ====================================================== */}

      {activeTab === "General" && (
        <div
          className="
            grid grid-cols-1
            gap-4
            xl:grid-cols-[1fr_1.1fr]
          "
        >
          {/* LEFT */}

          <div className="space-y-4">

            {/* GENERAL SETTINGS */}

            <SettingsCard
              icon={SettingsIcon}
              title="General Settings"
              description="Basic system configuration and preferences."
            >
              <div className="space-y-3">

                <SettingsField
                  label="System Name"
                  value={systemName}
                  onChange={(e) =>
                    setSystemName(e.target.value)
                  }
                />

                <SettingsField
                  label="Tagline"
                  value={tagline}
                  onChange={(e) =>
                    setTagline(e.target.value)
                  }
                />

                <SettingsSelect
                  label="Timezone"
                  value={timezone}
                  onChange={(e) =>
                    setTimezone(e.target.value)
                  }
                  options={[
                    "(UTC+08:00) Manila, Philippines",
                    "(UTC+09:00) Tokyo",
                    "(UTC+08:00) Singapore",
                  ]}
                />

                <SettingsSelect
                  label="Date Format"
                  value={dateFormat}
                  onChange={(e) =>
                    setDateFormat(e.target.value)
                  }
                  options={[
                    "September 21, 2026 (MMMM DD, YYYY)",
                    "09/21/2026 (MM/DD/YYYY)",
                    "21/09/2026 (DD/MM/YYYY)",
                  ]}
                />

                <SettingsSelect
                  label="Time Format"
                  value={timeFormat}
                  onChange={(e) =>
                    setTimeFormat(e.target.value)
                  }
                  options={[
                    "12-hour (AM/PM)",
                    "24-hour",
                  ]}
                />

                <SettingsSelect
                  label="Default Language"
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value)
                  }
                  options={[
                    "English",
                    "Filipino",
                    "Cebuano",
                  ]}
                />

                <div className="flex justify-end pt-2">
                  <button
                    onClick={saveGeneralSettings}
                    className="
                      flex h-9
                      items-center gap-2
                      rounded-lg
                      bg-[#0bad92]
                      px-4
                      text-[9px]
                      font-medium
                      text-white
                      transition
                      hover:bg-[#078f7b]
                    "
                  >
                    <Save size={13} />
                    Save Changes
                  </button>
                </div>

              </div>
            </SettingsCard>

            {/* SECURITY */}

            <SettingsCard
              icon={ShieldCheck}
              title="Security Settings"
              description="Manage security and access settings."
              action={
                <button
                  className="
                    flex items-center gap-2
                    rounded-lg
                    border border-[#75d4c6]
                    px-3 py-2
                    text-[8px]
                    font-medium
                    text-[#078b79]
                    hover:bg-[#e8f8f5]
                  "
                >
                  <LockKeyhole size={12} />
                  Change Password
                </button>
              }
            >
              <div className="space-y-3">

                <SettingsSelect
                  label="Session Timeout"
                  value={sessionTimeout}
                  onChange={(e) =>
                    setSessionTimeout(e.target.value)
                  }
                  options={[
                    "15 minutes",
                    "30 minutes",
                    "1 hour",
                    "2 hours",
                  ]}
                />

                <SettingsSelect
                  label="Maximum Login Attempts"
                  value={maxLoginAttempts}
                  onChange={(e) =>
                    setMaxLoginAttempts(e.target.value)
                  }
                  options={[
                    "3 attempts",
                    "5 attempts",
                    "10 attempts",
                  ]}
                />

                <SettingsSelect
                  label="Password Expiration"
                  value={passwordExpiration}
                  onChange={(e) =>
                    setPasswordExpiration(e.target.value)
                  }
                  options={[
                    "30 days",
                    "60 days",
                    "90 days",
                    "Never",
                  ]}
                />

                <div
                  className="
                    grid
                    grid-cols-[120px_1fr]
                    items-center
                    gap-3
                  "
                >
                  <span className={fieldLabel}>
                    Two-Factor Authentication
                  </span>

                  <div className="flex items-center gap-3">
                    <Toggle
                      enabled={twoFactor}
                      onClick={() =>
                        setTwoFactor(!twoFactor)
                      }
                    />

                    <span className="text-[7px] text-[#7c899d]">
                      Enable 2FA for administrator accounts.
                    </span>
                  </div>
                </div>

              </div>
            </SettingsCard>

          </div>

          {/* RIGHT */}

          <div className="space-y-4">

            {/* CLINIC INFORMATION */}

            <SettingsCard
              icon={Building2}
              title="Clinic Information"
              description="Update your clinic details and contact information."
              action={
                <button
                  className="
                    flex items-center gap-2
                    rounded-lg
                    border border-[#75d4c6]
                    px-3 py-2
                    text-[8px]
                    font-medium
                    text-[#078b79]
                    hover:bg-[#e8f8f5]
                  "
                >
                  <Pencil size={12} />
                  Edit Information
                </button>
              }
            >
              <div
                className="
                  grid grid-cols-1
                  gap-4
                  sm:grid-cols-[110px_1fr]
                "
              >

                <div
                  className="
                    flex min-h-[120px]
                    flex-col
                    items-center justify-center
                    rounded-xl
                    bg-[#effaf8]
                  "
                >
                  <div
                    className="
                      flex h-12 w-12
                      items-center justify-center
                      rounded-xl
                      bg-[#d6f6ef]
                    "
                  >
                    <StethoscopeLogo />
                  </div>

                  <p className="mt-2 text-lg font-bold text-[#17304e]">
                    CURA
                  </p>
                </div>

                <div className="space-y-2">
                  <InfoRow
                    label="Clinic Name"
                    value="St. Mary's Clinic"
                  />

                  <InfoRow
                    label="Address"
                    value="Purok 1, Tagum City, Davao del Norte"
                  />

                  <InfoRow
                    label="Contact Number"
                    value="0917 123 4567"
                  />

                  <InfoRow
                    label="Email Address"
                    value="clinic@stmarys.com"
                  />

                  <InfoRow
                    label="Website"
                    value="https://www.stmarysclinic.com"
                  />

                  <InfoRow
                    label="Operating Hours"
                    value="Mon - Fri, 8:00 AM - 5:00 PM"
                  />
                </div>
              </div>

              <button
                className="
                  mt-3
                  flex items-center gap-2
                  rounded-lg
                  border border-[#75d4c6]
                  px-3 py-2
                  text-[8px]
                  font-medium
                  text-[#078b79]
                  hover:bg-[#e8f8f5]
                "
              >
                <Upload size={12} />
                Change Logo
              </button>
            </SettingsCard>

            {/* SYSTEM PREFERENCES */}

            <SettingsCard
              icon={SlidersHorizontal}
              title="System Preferences"
              description="Configure system behavior and features."
              action={
                <button
                  onClick={savePreferences}
                  className="
                    flex items-center gap-2
                    rounded-lg
                    border border-[#75d4c6]
                    px-3 py-2
                    text-[8px]
                    font-medium
                    text-[#078b79]
                    hover:bg-[#e8f8f5]
                  "
                >
                  <Save size={12} />
                  Save Preferences
                </button>
              }
            >
              <div className="space-y-3">

                <PreferenceRow
                  title="Enable Online Appointments"
                  description="Allow patients to book appointments online."
                  enabled={preferences.onlineAppointments}
                  onClick={() =>
                    togglePreference(
                      "onlineAppointments"
                    )
                  }
                />

                <PreferenceRow
                  title="Enable Patient Registration"
                  description="Allow new patient registration through the system."
                  enabled={preferences.patientRegistration}
                  onClick={() =>
                    togglePreference(
                      "patientRegistration"
                    )
                  }
                />

                <PreferenceRow
                  title="Require Appointment Approval"
                  description="Appointments need admin/staff approval before confirmation."
                  enabled={preferences.appointmentApproval}
                  onClick={() =>
                    togglePreference(
                      "appointmentApproval"
                    )
                  }
                />

                <PreferenceRow
                  title="Enable Queue Notifications"
                  description="Send notifications for queue updates."
                  enabled={preferences.queueNotifications}
                  onClick={() =>
                    togglePreference(
                      "queueNotifications"
                    )
                  }
                />

                <PreferenceRow
                  title="Enable Email Notifications"
                  description="Send system notifications through email."
                  enabled={preferences.emailNotifications}
                  onClick={() =>
                    togglePreference(
                      "emailNotifications"
                    )
                  }
                />

                <PreferenceRow
                  title="Enable SMS Notifications"
                  description="Send system notifications via SMS."
                  enabled={preferences.smsNotifications}
                  onClick={() =>
                    togglePreference(
                      "smsNotifications"
                    )
                  }
                />

                <PreferenceRow
                  title="Maintenance Mode"
                  description="Temporarily restrict system access."
                  enabled={preferences.maintenanceMode}
                  onClick={() =>
                    togglePreference(
                      "maintenanceMode"
                    )
                  }
                />

              </div>
            </SettingsCard>

          </div>
        </div>
      )}

      {/* =====================================================
          USERS & ROLES
      ====================================================== */}

      {activeTab === "Users & Roles" && (
        <PlaceholderPage
          icon={Users}
          title="Users & Roles"
          description="Manage CURA user accounts, roles, and permissions."
        />
      )}

      {/* =====================================================
          CLINIC INFORMATION
      ====================================================== */}

      {activeTab === "Clinic Information" && (
        <PlaceholderPage
          icon={Building2}
          title="Clinic Information"
          description="Manage clinic identity, contact details, facilities, and operating schedules."
        />
      )}

      {/* =====================================================
          SYSTEM PREFERENCES
      ====================================================== */}

      {activeTab === "System Preferences" && (
        <PlaceholderPage
          icon={SlidersHorizontal}
          title="System Preferences"
          description="Configure appointment, queue, registration, and other CURA behavior."
        />
      )}

      {/* =====================================================
          SECURITY
      ====================================================== */}

      {activeTab === "Security" && (
        <PlaceholderPage
          icon={ShieldCheck}
          title="Security"
          description="Configure authentication, password rules, session security, and access policies."
        />
      )}

      {/* =====================================================
          NOTIFICATIONS
      ====================================================== */}

      {activeTab === "Notifications" && (
        <PlaceholderPage
          icon={BellRing}
          title="Notifications"
          description="Configure email, SMS, appointment, prescription, and queue notifications."
        />
      )}

      {/* =====================================================
          INTEGRATIONS
      ====================================================== */}

      {activeTab === "Integrations" && (
        <PlaceholderPage
          icon={Plug}
          title="Integrations"
          description="Manage external services and CURA integrations."
        />
      )}

      {/* =====================================================
          BACKUP
      ====================================================== */}

      {activeTab === "Backup & Data" && (
        <PlaceholderPage
          icon={Database}
          title="Backup & Data"
          description="Manage database backups, exports, retention, and recovery."
        />
      )}

    </div>
  );
};


// =====================================================
// COMPONENTS
// =====================================================

const SettingsCard = ({
  icon: Icon,
  title,
  description,
  action,
  children,
}) => {
  return (
    <section
      className="
        rounded-2xl
        border border-white/60
        bg-white/90
        p-4
        shadow-[0_4px_18px_rgba(30,90,90,0.06)]
      "
    >
      <div
        className="
          mb-4
          flex flex-col
          gap-3
          sm:flex-row
          sm:items-start
          sm:justify-between
        "
      >
        <div className="flex items-start gap-3">

          <div
            className="
              flex h-9 w-9
              shrink-0
              items-center justify-center
              rounded-xl
              bg-[#e5f7f3]
            "
          >
            <Icon
              size={18}
              className="text-[#087c75]"
            />
          </div>

          <div>
            <h2 className="text-[11px] font-semibold text-[#203652]">
              {title}
            </h2>

            <p className="mt-1 text-[8px] text-[#7a899c]">
              {description}
            </p>
          </div>

        </div>

        {action}
      </div>

      {children}
    </section>
  );
};


const SettingsField = ({
  label,
  value,
  onChange,
}) => {
  return (
    <div
      className="
        grid grid-cols-1
        gap-1.5
        sm:grid-cols-[120px_1fr]
        sm:items-center
        sm:gap-3
      "
    >
      <label className={fieldLabel}>
        {label}
      </label>

      <input
        value={value}
        onChange={onChange}
        className={fieldInput}
      />
    </div>
  );
};


const SettingsSelect = ({
  label,
  value,
  onChange,
  options,
}) => {
  return (
    <div
      className="
        grid grid-cols-1
        gap-1.5
        sm:grid-cols-[120px_1fr]
        sm:items-center
        sm:gap-3
      "
    >
      <label className={fieldLabel}>
        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
        className={fieldInput}
      >
        {options.map((option) => (
          <option key={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};


const PreferenceRow = ({
  title,
  description,
  enabled,
  onClick,
}) => {
  return (
    <div className="flex items-start gap-3">

      <Toggle
        enabled={enabled}
        onClick={onClick}
      />

      <div>
        <p className="text-[9px] font-medium text-[#40536d]">
          {title}
        </p>

        <p className="mt-0.5 text-[7px] text-[#8491a3]">
          {description}
        </p>
      </div>

    </div>
  );
};


const Toggle = ({
  enabled,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative
        h-5 w-9
        shrink-0
        rounded-full
        transition-colors

        ${
          enabled
            ? "bg-[#0bad92]"
            : "bg-[#cbd5df]"
        }
      `}
    >
      <span
        className={`
          absolute top-0.5
          h-4 w-4
          rounded-full
          bg-white
          shadow-sm
          transition-all

          ${
            enabled
              ? "left-[18px]"
              : "left-0.5"
          }
        `}
      />
    </button>
  );
};


const InfoRow = ({
  label,
  value,
}) => {
  return (
    <div
      className="
        grid
        grid-cols-[100px_1fr]
        gap-3
      "
    >
      <span className="text-[7px] font-medium text-[#728096]">
        {label}
      </span>

      <span className="text-[8px] text-[#40536d]">
        {value}
      </span>
    </div>
  );
};


const PlaceholderPage = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <section
      className="
        rounded-2xl
        border border-white/60
        bg-white/90
        p-8
        shadow-[0_4px_18px_rgba(30,90,90,0.06)]
      "
    >
      <div
        className="
          mx-auto
          flex h-14 w-14
          items-center justify-center
          rounded-2xl
          bg-[#e4f8f4]
        "
      >
        <Icon
          size={25}
          className="text-[#0bad92]"
        />
      </div>

      <h2
        className="
          mt-4
          text-center
          text-lg
          font-semibold
          text-[#203652]
        "
      >
        {title}
      </h2>

      <p
        className="
          mx-auto
          mt-2
          max-w-lg
          text-center
          text-[10px]
          text-[#728198]
        "
      >
        {description}
      </p>
    </section>
  );
};


const StethoscopeLogo = () => {
  return (
    <div className="text-2xl font-bold text-[#0bad92]">
      ✚
    </div>
  );
};


const fieldLabel = `
  text-[8px]
  font-medium
  text-[#566981]
`;

const fieldInput = `
  h-9
  w-full
  rounded-lg
  border border-[#dbe6e8]
  bg-white
  px-3
  text-[8px]
  text-[#40536d]
  outline-none
  transition

  focus:border-[#78d4c6]
  focus:ring-2
  focus:ring-[#ccefe8]/40
`;

export default Settings;