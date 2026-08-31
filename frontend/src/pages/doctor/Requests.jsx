import React, { useState, useEffect } from "react";
import api from "../../services/api";
import AppointmentTable from "../../components/appointments/AppointmentTable";
import DoctorLayout from "../../components/layouts/DoctorLayout";

export default function PatientRequests() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
    try {
      // The backend already scopes this to appointments assigned to the
      // logged-in doctor — no other doctor's requests are ever returned.
      const response = await api.get("/appointments");
      setAppointments(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
      setError("Failed to load appointment requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // assigned -> approved. Notifies the patient (patientNotified = true).
  const handleApprove = async (id) => {
    try {
      const response = await api.put(`/appointments/${id}/status`, { status: "approved" });
      const updated = response.data.data;
      setAppointments((prev) => prev.map((apt) => (apt.id === id ? updated : apt)));
    } catch (err) {
      console.error("Failed to approve appointment", err);
      alert(err.response?.data?.message || "Failed to approve appointment.");
    }
  };

  // assigned -> rejected. Notifies the patient (patientNotified = true).
  const handleReject = async (id) => {
    try {
      const response = await api.put(`/appointments/${id}/status`, { status: "rejected" });
      const updated = response.data.data;
      setAppointments((prev) => prev.map((apt) => (apt.id === id ? updated : apt)));
    } catch (err) {
      console.error("Failed to reject appointment", err);
      alert(err.response?.data?.message || "Failed to reject appointment.");
    }
  };

  return (
    <DoctorLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Patient Requests</h1>

        <div className="bg-[#1a1c29] rounded-2xl border border-gray-800 p-6">
          {error && <p className="text-red-400 mb-4">{error}</p>}
          {loading ? (
            <p className="text-gray-400">Loading requests...</p>
          ) : (
            <AppointmentTable
              appointments={appointments}
              onApprove={handleApprove}
              onReject={handleReject}
              userRole="doctor"
            />
          )}
        </div>
      </div>
    </DoctorLayout>
  );
}
