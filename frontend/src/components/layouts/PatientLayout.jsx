

import { Link, useLocation, Outlet } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  {
    name: "Overview",
    href: "/patient/overview",
    icon: HomeIcon,
  },
  {
    name: "Doctors",
    href: "/patient/doctors",
    icon: UserGroupIcon,
  },
  {
    name: "Appointments",
    href: "/patient/appointment",
    icon: CalendarDaysIcon,
  },
  {
    name: "Patient Profile",
    href: "/patient/profile",
    icon: UserIcon,
  },
];

export default function PatientLayout({ children }) {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#0f111a] text-white flex">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-[#141620] border-r border-gray-800 fixed left-0 top-0 bottom-0 flex flex-col">

        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">
            Hospital Management
          </h1>

          <p className="text-xs text-gray-500 mt-1">
            Patient Portal
          </p>
        </div>

        {/* Navigation */}
        <nav className="px-4 mt-4 space-y-2 flex-1">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#1c1d30] text-indigo-400"
                    : "text-gray-400 hover:text-gray-100 hover:bg-gray-800"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive
                      ? "text-indigo-400"
                      : "text-gray-400"
                  }`}
                />

                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-5 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="ml-64 flex-1 min-h-screen">

        {/* Top Header */}
        <header className="h-16 border-b border-gray-800 bg-[#141620] flex items-center justify-between px-8">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Patient Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-indigo-400" />
            </div>

            <span className="text-sm text-gray-300">
              Patient
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children || <Outlet />}
        </div>

      </main>
    </div>
  );
}
