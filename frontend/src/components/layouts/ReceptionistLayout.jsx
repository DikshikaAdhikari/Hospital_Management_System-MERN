import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Squares2X2Icon,
  UsersIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import ProfileModal from "../common/ProfileModal";
import { getCurrentUser, getInitial, logout } from "../../utils/authUtils";

export default function ReceptionistLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const user = getCurrentUser();

  const navigation = [
    { name: "Overview", href: "/receptionist/overview", icon: Squares2X2Icon },
    { name: "Appointments", href: "/receptionist/patients", icon: UsersIcon },
    { name: "Doctors", href: "/receptionist/doctors", icon: UserGroupIcon },
  ];

  const handleLogout = () => logout(navigate);

  return (
    <div className="flex h-screen bg-[#0f111a] text-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-[#141523] border-r border-gray-800 flex flex-col justify-between">
        <div>
          <div className="h-20 flex items-center px-6">
            <span className="text-xl font-bold flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-black">
                M
              </span>
              MediCare HMS
            </span>
          </div>

          <div className="px-6 py-2">
            <span className="text-xs font-bold text-indigo-500 tracking-wider">RECEPTIONIST</span>
          </div>

          <nav className="px-4 mt-4 space-y-2">
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
                      isActive ? "text-indigo-400" : "text-gray-400"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-500 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="h-16 flex items-center justify-end px-8 bg-[#0f111a] sticky top-0 z-10">
          <button
            onClick={() => setIsProfileOpen(true)}
            className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold hover:ring-2 hover:ring-indigo-300 transition"
            aria-label="View profile"
            title="View profile"
          >
            {getInitial(user?.name)}
          </button>
        </header>

        <main className="px-8 py-6">{children}</main>
      </div>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onLogout={handleLogout}
      />
    </div>
  );
}
