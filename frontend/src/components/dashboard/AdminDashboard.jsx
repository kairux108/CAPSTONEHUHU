import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import navigationBg from "../../assets/navigation.png";
import rightNavigationBg from "../../assets/Rightnavigation.png";

import {
  LayoutDashboard,
  CalendarDays,
  Stethoscope,
  Users,
  UserRound,
  Building2,
  BarChart3,
  Settings,
  LogOut,
  HeartPulse,
  Menu,
  X,
} from "lucide-react";

const AdminDashbaord = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin-dashboard",
      end: true,
    },
    {
      name: "Appointments",
      icon: CalendarDays,
      path: "/admin-dashboard/appointments",
    },
    {
      name: "Doctors",
      icon: Stethoscope,
      path: "/admin-dashboard/doctors",
    },
    {
      name: "Staff",
      icon: Users,
      path: "/admin-dashboard/staff",
    },
    {
      name: "Patients",
      icon: UserRound,
      path: "/admin-dashboard/patients",
    },
    {
      name: "Clinics",
      icon: Building2,
      path: "/admin-dashboard/clinics",
    },
    {
      name: "Reports",
      icon: BarChart3,
      path: "/admin-dashboard/reports",
    },
    {
      name: "Settings",
      icon: Settings,
      path: "/admin-dashboard/settings",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("cura_token");
    localStorage.removeItem("cura_user");

    navigate("/");
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#f4fbfa]"
      style={{
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* =====================================================
          MOBILE HEADER
      ====================================================== */}

      <header
        className="
          fixed left-0 right-0 top-0 z-30
          flex h-[65px] items-center justify-between
          border-b border-gray-200
          bg-white
          px-4
          md:hidden
        "
      >
        {/* Mobile Logo */}
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              bg-[#d7f6ef]
            "
          >
            <HeartPulse
              size={23}
              strokeWidth={2}
              className="text-[#079b8d]"
            />
          </div>

          <div>
            <h1 className="text-[17px] font-semibold leading-none text-[#087c75]">
              CURA
            </h1>

            <p className="mt-1 text-[9px] text-[#6f7d91]">
              Care Today for a Healthier Tomorrow
            </p>
          </div>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            text-[#43546f]
            transition-colors duration-200
            hover:bg-[#e6f8f4]
            hover:text-[#079b8d]
          "
        >
          <Menu size={24} />
        </button>
      </header>

      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="
            fixed inset-0 z-40
            bg-black/35
            md:hidden
          "
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        style={{
          backgroundImage: `url(${navigationBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-[230px] flex-col
          overflow-hidden

          transition-transform
          duration-300
          ease-in-out

          md:translate-x-0

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* =================================================
            LOGO
        ================================================== */}

        <div
          className="
            relative
            flex min-h-[105px]
            items-center
            px-5
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-11 w-11
                items-center justify-center
                rounded-xl
                bg-[#d6f5ee]
              "
            >
              <HeartPulse
                size={27}
                strokeWidth={2}
                className="text-[#079b8d]"
              />
            </div>

            <div>
              <h1
                className="
                  text-[20px]
                  font-semibold
                  leading-none
                  tracking-[0.02em]
                  text-[#087c75]
                "
              >
                CURA
              </h1>

              <p
                className="
                  mt-1
                  text-[9px]
                  leading-[13px]
                  text-[#64748b]
                "
              >
                Care Today
                <br />
                for a Healthier Tomorrow
              </p>
            </div>
          </div>

          {/* Mobile Close */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="
              absolute right-3 top-3
              flex h-9 w-9
              items-center justify-center
              rounded-lg
              text-[#536784]
              transition-colors duration-200
              hover:bg-[#dff6f0]
              hover:text-[#079b8d]
              md:hidden
            "
          >
            <X size={21} />
          </button>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================== */}

        <nav className="sidebar-navigation relative flex-1 px-3">
          <div className="space-y-[3px]">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `
                      group
                      flex h-[42px]
                      items-center
                      gap-[13px]

                      rounded-[11px]

                      px-[13px]

                      text-[12px]
                      font-medium

                      transition-all
                      duration-200
                      ease-out

                      ${
                        isActive
                          ? `
                            bg-[#c9f3ea]
                            text-black
                            shadow-[0_2px_8px_rgba(7,156,141,0.08)]
                          `
                          : `
                            text-black
                            hover:bg-[#dcf7f1]
                            hover:text-black
                          `
                      }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={17}
                        strokeWidth={2.15}
                        className={`
                          shrink-0

                          transition-all
                          duration-200

                          ${
                            isActive
                              ? "text-[#079b8d]"
                              : `
                                text-[#50627e]
                                group-hover:text-[#079b8d]
                              `
                          }
                        `}
                      />

                      <span className="leading-none">
                        {item.name}
                      </span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* =================================================
            LOGOUT
        ================================================== */}

        <div className="relative px-3 pb-5">
          <div className="mb-3 h-px bg-[#92cfc4]/25" />

          <button
            onClick={handleLogout}
            className="
              group
              flex h-[42px]
              w-full
              items-center
              gap-[13px]

              rounded-[11px]

              px-[13px]

              text-[12px]
              font-medium

              text-black

              transition-all
              duration-200

              hover:bg-[#dcf7f1]
              hover:text-black
            "
          >
            <LogOut
              size={17}
              strokeWidth={2.15}
              className="
                text-[#50627e]
                transition-colors duration-200
                group-hover:text-[#079b8d]
              "
            />

            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* =====================================================
          RIGHT SIDE
      ====================================================== */}

   <main
  style={{
    backgroundImage: `url(${rightNavigationBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
  className="
    min-h-screen
    pt-16.25
    md:ml-57.5
    md:pt-0
  "
>
  <Outlet />
</main>
    </div>
  );
};

export default AdminDashbaord;