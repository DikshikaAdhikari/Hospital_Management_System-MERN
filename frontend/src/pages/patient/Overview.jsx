import  { useState, useEffect } from "react";
import api from "../../services/api";
import PatientLayout from "../../components/layouts/PatientLayout";
import { getCurrentUser, getGreeting } from "../../utils/authUtils";

const STATUS_STYLES = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  assigned: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function Overview() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = getCurrentUser();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Backend scopes this to the logged-in patient's own appointments only.
        const response = await api.get("/appointments");
        setAppointments(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
        setError("Failed to load your appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Appointments the doctor has just decided on (patientNotified = true) —
  // shown as a dedicated notification, per the required workflow.
  const notifications = appointments.filter(
    (apt) => apt.patientNotified && (apt.status === "approved" || apt.status === "rejected")
  );

  const statCounts = {
    pending: appointments.filter(a => a.status === "pending").length,
    assigned: appointments.filter(a => a.status === "assigned").length,
    approved: appointments.filter(a => a.status === "approved").length,
  };

  const stats = [
    { name: "Pending Requests", value: statCounts.pending, desc: "awaiting receptionist", dotColor: "bg-amber-500" },
    { name: "Assigned", value: statCounts.assigned, desc: "awaiting doctor", dotColor: "bg-blue-500" },
    { name: "Approved", value: statCounts.approved, desc: "confirmed", dotColor: "bg-emerald-500" },
    { name: "Total Appointments", value: appointments.length, desc: "all time", dotColor: "bg-indigo-500" },
  ];

  return (
    <PatientLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            {getGreeting()}, {user?.name || "Patient"} <span className="text-2xl">👋</span>
          </h1>
          <p className="text-gray-400 mt-1">Here's your health summary for today</p>
        </div>

        {/* Notifications Section */}
        {notifications.length > 0 && (
          <div className="mb-10 space-y-4">
            <h2 className="text-lg font-bold text-white">Notifications</h2>
            {notifications.map((apt) => (
              <div
                key={apt.id}
                className={`rounded-2xl border p-6 ${
                  apt.status === "approved"
                    ? "bg-emerald-500/5 border-emerald-500/30"
                    : "bg-red-500/5 border-red-500/30"
                }`}
              >
                <p className={`font-semibold mb-2 ${apt.status === "approved" ? "text-emerald-400" : "text-red-400"}`}>
                  Appointment {apt.status === "approved" ? "Approved" : "Rejected"}
                </p>
                <div className="text-gray-300 text-sm space-y-1">
                  <p>Doctor: Dr. {apt.doctor?.user?.name || "Unknown"}</p>
                  <p>Department: {apt.department?.name || "—"}</p>
                  <p>Date: {new Date(apt.appointmentDate).toLocaleDateString()}</p>
                  <p>Time: {new Date(apt.appointmentDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                  <p className="capitalize">Status: {apt.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-[#1a1c29] rounded-2xl p-6 border border-gray-800 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${stat.dotColor}`}></div>
                <span className="text-3xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-gray-300 font-medium">{stat.name}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* Appointments Table Section */}
        <div>
          <h2 className="text-lg font-bold text-white mb-6">My Appointments</h2>

          <div className="bg-[#1a1c29] rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="text-xs text-gray-500 uppercase bg-[#1a1c29] border-b border-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-medium tracking-wider">Department</th>
                    <th scope="col" className="px-6 py-4 font-medium tracking-wider">Doctor</th>
                    <th scope="col" className="px-6 py-4 font-medium tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-4 font-medium tracking-wider">Time</th>
                    <th scope="col" className="px-6 py-4 font-medium tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center">Loading appointments...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-red-400">{error}</td>
                    </tr>
                  ) : appointments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        No appointment requests yet.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((apt) => (
                      <tr key={apt.id} className="border-b border-gray-800/50 hover:bg-[#1f2133] transition-colors last:border-0">
                        <td className="px-6 py-5 text-gray-200 font-medium">
                          {apt.department?.name || "—"}
                        </td>
                        <td className="px-6 py-5">
                          {apt.doctor?.user?.name ? `Dr. ${apt.doctor.user.name}` : "Not yet assigned"}
                        </td>
                        <td className="px-6 py-5">
                          {new Date(apt.appointmentDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-5">
                          {new Date(apt.appointmentDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${STATUS_STYLES[apt.status] || ""}`}>
                            {apt.status || "pending"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
