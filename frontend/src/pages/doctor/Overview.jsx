import React, { useState, useEffect } from "react";
import api from "../../services/api";
import DoctorLayout from "../../components/layouts/DoctorLayout";
import { getCurrentUser, getGreeting } from "../../utils/authUtils";

export default function DoctorOverview() {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 });
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Scoped server-side to appointments assigned to this doctor only.
        const response = await api.get("/appointments");
        // Backend responds with { success, data: [...] } — reading
        // response.data.appointments (which never existed) fell through to
        // response.data itself (the whole {success,data} object, not an
        // array), so .filter() below was throwing.
        const appointments = response.data.data || [];

        const pending = appointments.filter(a => a.status === "assigned").length;
        const approved = appointments.filter(a => a.status === "approved").length;

        setStats({ total: appointments.length, pending, approved });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <DoctorLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          {getGreeting()}, Dr. {user?.name || "Doctor"} 👋
        </h1>

        {loading ? (
          <p className="text-gray-400">Loading stats...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1a1c29] p-6 rounded-2xl border border-gray-800 border-l-4 border-l-blue-500">
              <h2 className="text-gray-500 text-sm font-semibold uppercase">Total Appointments</h2>
              <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
            </div>

            <div className="bg-[#1a1c29] p-6 rounded-2xl border border-gray-800 border-l-4 border-l-yellow-500">
              <h2 className="text-gray-500 text-sm font-semibold uppercase">Awaiting Your Decision</h2>
              <p className="text-3xl font-bold text-white mt-2">{stats.pending}</p>
            </div>

            <div className="bg-[#1a1c29] p-6 rounded-2xl border border-gray-800 border-l-4 border-l-green-500">
              <h2 className="text-gray-500 text-sm font-semibold uppercase">Approved Appointments</h2>
              <p className="text-3xl font-bold text-white mt-2">{stats.approved}</p>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
}
