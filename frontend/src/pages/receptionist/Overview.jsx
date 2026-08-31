import React, { useState, useEffect } from "react";
import api from "../../services/api";
import ReceptionistLayout from "../../components/layouts/ReceptionistLayout";
import { getCurrentUser, getGreeting } from "../../utils/authUtils";

export default function ReceptionistOverview() {
  const [stats, setStats] = useState({ total: 0, pending: 0, assigned: 0, doctors: 0 });
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aptRes, docRes] = await Promise.all([
          api.get("/appointments"),
          api.get("/doctors")
        ]);

        // Both endpoints respond with { success, data: [...] }
        const appointments = aptRes.data.data || [];
        const doctors = docRes.data.data || [];

        const pending = appointments.filter(a => a.status === "pending").length;
        const assigned = appointments.filter(a => a.status === "assigned").length;

        setStats({
          total: appointments.length,
          pending,
          assigned,
          doctors: doctors.length
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ReceptionistLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          {getGreeting()}, {user?.name || "Receptionist"} 👋
        </h1>

        {loading ? (
          <p className="text-gray-400">Loading stats...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#1a1c29] p-6 rounded-2xl border border-gray-800 border-l-4 border-l-blue-500">
              <h2 className="text-gray-500 text-sm font-semibold uppercase">Total Appointments</h2>
              <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
            </div>

            <div className="bg-[#1a1c29] p-6 rounded-2xl border border-gray-800 border-l-4 border-l-yellow-500">
              <h2 className="text-gray-500 text-sm font-semibold uppercase">Pending Requests</h2>
              <p className="text-3xl font-bold text-white mt-2">{stats.pending}</p>
            </div>

            <div className="bg-[#1a1c29] p-6 rounded-2xl border border-gray-800 border-l-4 border-l-green-500">
              <h2 className="text-gray-500 text-sm font-semibold uppercase">Assigned</h2>
              <p className="text-3xl font-bold text-white mt-2">{stats.assigned}</p>
            </div>

            <div className="bg-[#1a1c29] p-6 rounded-2xl border border-gray-800 border-l-4 border-l-purple-500">
              <h2 className="text-gray-500 text-sm font-semibold uppercase">Total Doctors</h2>
              <p className="text-3xl font-bold text-white mt-2">{stats.doctors}</p>
            </div>
          </div>
        )}
      </div>
    </ReceptionistLayout>
  );
}
