import React from "react";
import { getInitial } from "../../utils/authUtils";

// Capitalizes a role string like "receptionist" -> "Receptionist"
const formatRole = (role) => {
  if (!role || typeof role !== "string") return "User";
  return role.charAt(0).toUpperCase() + role.slice(1);
};

export default function ProfileModal({ isOpen, onClose, user, onLogout }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-[#141523] border border-gray-800 rounded-2xl shadow-xl p-6 text-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-lg font-bold">My Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
            {getInitial(user?.name)}
          </div>
          <p className="text-xl font-semibold">{user?.name || "Unknown User"}</p>
          <span className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {formatRole(user?.roles)}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between border-b border-gray-800 pb-2">
            <span className="text-gray-500 text-sm">Email</span>
            <span className="text-sm">{user?.email || "—"}</span>
          </div>
          <div className="flex justify-between border-b border-gray-800 pb-2">
            <span className="text-gray-500 text-sm">User ID</span>
            <span className="text-sm">{user?.id ?? "—"}</span>
          </div>
          {user?.createdAt && (
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-500 text-sm">Member Since</span>
              <span className="text-sm">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-medium py-2.5 rounded-lg transition"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
