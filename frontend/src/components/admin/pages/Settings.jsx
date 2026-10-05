import {
  Bell,
  Bot,
  Building2,
  CalendarDays,
  Database,
  Save,
  Settings2,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { useState } from "react";

import CuraCard from "../../common/CuraCard";

const Settings = () => {
  const [activeSection, setActiveSection] =
    useState("general");

  const [settings, setSettings] = useState({
    clinic_name: "",
    clinic_phone: "",
    clinic_email: "",
    clinic_address: "",

    opening_time: "",
    closing_time: "",
    appointment_duration: "",
    allow_walk_ins: true,
    emergency_priority: true,
    queue_eta: true,

    appointment_reminders: true,
    queue_notifications: true,
    system_notifications: true,

    ai_symptom_analysis: true,
    ai_intake_questions: true,
    voice_to_text: true,
    anatomy_module: true,

    require_strong_password: true,
    session_timeout: "",
    audit_logging: true,

    automatic_backup: false,
  });

  const updateSetting = (
    field,
    value
  ) => {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const renderToggle = (
    field,
    title,
    description
  ) => (
    <div className="settings-toggle-row">
      <div>
        <p>{title}</p>

        <span>
          {description}
        </span>
      </div>

      <button
        type="button"
        className={
          settings[field]
            ? "settings-switch active"
            : "settings-switch"
        }
        onClick={() =>
          updateSetting(
            field,
            !settings[field]
          )
        }
      >
        <span />
      </button>
    </div>
  );

  return (
    <div>
      <div className="settings-layout">

        {/* ===========================
            LEFT NAVIGATION
        ============================ */}

        <CuraCard className="settings-navigation-card">

          <nav className="settings-navigation">

            <button
              className={
                activeSection === "general"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveSection(
                  "general"
                )
              }
            >
              <Building2 size={17} />
              General
            </button>


            <button
              className={
                activeSection ===
                "appointments"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveSection(
                  "appointments"
                )
              }
            >
              <CalendarDays
                size={17}
              />

              Appointments & Queue
            </button>


            <button
              className={
                activeSection ===
                "notifications"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveSection(
                  "notifications"
                )
              }
            >
              <Bell size={17} />

              Notifications
            </button>


            <button
              className={
                activeSection ===
                "security"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveSection(
                  "security"
                )
              }
            >
              <ShieldCheck
                size={17}
              />

              Security & Access
            </button>


            <button
              className={
                activeSection === "ai"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveSection("ai")
              }
            >
              <Bot size={17} />

              AI Features
            </button>


            <button
              className={
                activeSection === "data"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveSection(
                  "data"
                )
              }
            >
              <Database size={17} />

              Data & Privacy
            </button>


            <button
              className={
                activeSection ===
                "system"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveSection(
                  "system"
                )
              }
            >
              <Settings2 size={17} />

              System
            </button>

          </nav>

        </CuraCard>


        {/* ===========================
            RIGHT CONTENT
        ============================ */}

        <div className="settings-content">

          {/* GENERAL */}

          {activeSection ===
            "general" && (
            <CuraCard title="Clinic Information">

              <div className="settings-form-grid">

                <div className="settings-field">
                  <label>
                    Clinic Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter clinic name"
                    value={
                      settings.clinic_name
                    }
                    onChange={(e) =>
                      updateSetting(
                        "clinic_name",
                        e.target.value
                      )
                    }
                  />
                </div>


                <div className="settings-field">
                  <label>
                    Contact Number
                  </label>

                  <input
                    type="text"
                    placeholder="Enter contact number"
                    value={
                      settings.clinic_phone
                    }
                    onChange={(e) =>
                      updateSetting(
                        "clinic_phone",
                        e.target.value
                      )
                    }
                  />
                </div>


                <div className="settings-field">
                  <label>
                    Clinic Email
                  </label>

                  <input
                    type="email"
                    placeholder="Enter clinic email"
                    value={
                      settings.clinic_email
                    }
                    onChange={(e) =>
                      updateSetting(
                        "clinic_email",
                        e.target.value
                      )
                    }
                  />
                </div>


                <div className="settings-field full">
                  <label>
                    Clinic Address
                  </label>

                  <textarea
                    placeholder="Enter clinic address"
                    value={
                      settings.clinic_address
                    }
                    onChange={(e) =>
                      updateSetting(
                        "clinic_address",
                        e.target.value
                      )
                    }
                  />
                </div>

              </div>

            </CuraCard>
          )}


          {/* APPOINTMENTS */}

          {activeSection ===
            "appointments" && (
            <>
              <CuraCard title="Clinic Schedule">

                <div className="settings-form-grid">

                  <div className="settings-field">
                    <label>
                      Opening Time
                    </label>

                    <input
                      type="time"
                      value={
                        settings.opening_time
                      }
                      onChange={(e) =>
                        updateSetting(
                          "opening_time",
                          e.target.value
                        )
                      }
                    />
                  </div>


                  <div className="settings-field">
                    <label>
                      Closing Time
                    </label>

                    <input
                      type="time"
                      value={
                        settings.closing_time
                      }
                      onChange={(e) =>
                        updateSetting(
                          "closing_time",
                          e.target.value
                        )
                      }
                    />
                  </div>


                  <div className="settings-field">
                    <label>
                      Appointment Duration
                    </label>

                    <select
                      value={
                        settings.appointment_duration
                      }
                      onChange={(e) =>
                        updateSetting(
                          "appointment_duration",
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Select duration
                      </option>

                      <option value="15">
                        15 minutes
                      </option>

                      <option value="30">
                        30 minutes
                      </option>

                      <option value="45">
                        45 minutes
                      </option>

                      <option value="60">
                        60 minutes
                      </option>
                    </select>
                  </div>

                </div>

              </CuraCard>


              <CuraCard title="Queue Management">

                <div className="settings-toggle-list">

                  {renderToggle(
                    "allow_walk_ins",
                    "Allow Walk-ins",
                    "Allow staff to add walk-in patients to the clinic queue."
                  )}

                  {renderToggle(
                    "queue_eta",
                    "Queue ETA",
                    "Automatically calculate estimated patient waiting time."
                  )}

                  {renderToggle(
                    "emergency_priority",
                    "Emergency Priority",
                    "Allow urgent patients to receive priority in the queue."
                  )}

                </div>

              </CuraCard>
            </>
          )}


          {/* NOTIFICATIONS */}

          {activeSection ===
            "notifications" && (
            <CuraCard title="Notification Settings">

              <div className="settings-toggle-list">

                {renderToggle(
                  "appointment_reminders",
                  "Appointment Reminders",
                  "Send reminders for scheduled appointments."
                )}

                {renderToggle(
                  "queue_notifications",
                  "Queue Notifications",
                  "Notify patients when their queue status changes."
                )}

                {renderToggle(
                  "system_notifications",
                  "System Alerts",
                  "Display important system notifications to users."
                )}

              </div>

            </CuraCard>
          )}


          {/* SECURITY */}

          {activeSection ===
            "security" && (
            <>
              <CuraCard title="Security">

                <div className="settings-toggle-list">

                  {renderToggle(
                    "require_strong_password",
                    "Strong Password Requirement",
                    "Require stronger passwords for CURA accounts."
                  )}

                  {renderToggle(
                    "audit_logging",
                    "Audit Logging",
                    "Record important account and system actions."
                  )}

                </div>

              </CuraCard>


              <CuraCard title="Session Control">

                <div className="settings-field settings-small-field">

                  <label>
                    Session Timeout
                  </label>

                  <select
                    value={
                      settings.session_timeout
                    }
                    onChange={(e) =>
                      updateSetting(
                        "session_timeout",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select timeout
                    </option>

                    <option value="15">
                      15 minutes
                    </option>

                    <option value="30">
                      30 minutes
                    </option>

                    <option value="60">
                      1 hour
                    </option>
                  </select>

                </div>

              </CuraCard>
            </>
          )}


          {/* AI */}

          {activeSection === "ai" && (
            <CuraCard title="AI & Consultation Features">

              <div className="settings-toggle-list">

                {renderToggle(
                  "ai_symptom_analysis",
                  "AI Symptom Analysis",
                  "Allow CURA to provide decision-support suggestions from confirmed symptoms."
                )}

                {renderToggle(
                  "ai_intake_questions",
                  "AI Intake Questions",
                  "Use doctor-approved questions during patient pre-consultation."
                )}

                {renderToggle(
                  "voice_to_text",
                  "Voice-to-Text",
                  "Allow voice input when collecting patient symptoms."
                )}

                {renderToggle(
                  "anatomy_module",
                  "Interactive Anatomy",
                  "Enable the doctor-side anatomy-assisted patient education module."
                )}

              </div>

            </CuraCard>
          )}


          {/* DATA */}

          {activeSection ===
            "data" && (
            <>
              <CuraCard title="Data & Privacy">

                <div className="settings-information-box">

                  <ShieldCheck
                    size={21}
                  />

                  <div>
                    <strong>
                      Patient Data Protection
                    </strong>

                    <p>
                      CURA should protect
                      patient information
                      according to system
                      access permissions and
                      applicable privacy
                      requirements.
                    </p>
                  </div>

                </div>

              </CuraCard>


              <CuraCard title="Backup">

                <div className="settings-toggle-list">

                  {renderToggle(
                    "automatic_backup",
                    "Automatic Backup",
                    "Allow the system to perform scheduled database backups when backend support is configured."
                  )}

                </div>

              </CuraCard>
            </>
          )}


          {/* SYSTEM */}

          {activeSection ===
            "system" && (
            <>
              <CuraCard title="System Information">

                <div className="settings-system-grid">

                  <div>
                    <span>
                      Application
                    </span>

                    <strong>
                      CURA
                    </strong>
                  </div>


                  <div>
                    <span>
                      Environment
                    </span>

                    <strong>
                      —
                    </strong>
                  </div>


                  <div>
                    <span>
                      Database
                    </span>

                    <strong>
                      PostgreSQL
                    </strong>
                  </div>


                  <div>
                    <span>
                      Backend Status
                    </span>

                    <strong>
                      —
                    </strong>
                  </div>

                </div>

              </CuraCard>


              <CuraCard title="System Administration">

                <div className="settings-system-actions">

                  <button type="button">
                    <Database size={16} />

                    View Backup Status
                  </button>

                  <button type="button">
                    <UsersRound size={16} />

                    View Audit Logs
                  </button>

                </div>

              </CuraCard>
            </>
          )}


          {/* SAVE */}

          <div className="settings-save-row">

            <button
              type="button"
              className="settings-save-button"
            >
              <Save size={16} />

              Save Changes
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Settings;