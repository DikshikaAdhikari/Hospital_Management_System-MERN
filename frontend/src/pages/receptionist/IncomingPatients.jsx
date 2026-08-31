import React, { useState, useEffect } from "react";
import api from "../../services/api";
import AppointmentTable from "../../components/appointments/AppointmentTable";
import ReceptionistLayout from "../../components/layouts/ReceptionistLayout";

export default function IncomingPatients() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [aptRes, docRes] = await Promise.all([
        api.get("/appointments"),
        api.get("/doctors"),
      ]);
      // Both endpoints respond with { success, data: [...] }
      setAppointments(aptRes.data.data || []);
      setDoctors(docRes.data.data || []);
    } catch (err) {
      console.error("Failed to fetch appointments/doctors", err);
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // pending -> assigned. The backend independently verifies the doctor
  // actually belongs to the requested department.
  const handleAssign = async (id, doctorId) => {
    if (!doctorId) return;
    try {
      const response = await api.put(`/appointments/${id}/assign`, { doctorId });
      const updated = response.data.data;
      setAppointments((prev) => prev.map((apt) => (apt.id === id ? updated : apt)));
    } catch (err) {
      console.error("Failed to assign doctor", err);
      alert(err.response?.data?.message || "Failed to assign doctor.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await api.delete(`/appointments/${id}`);
      setAppointments((prev) => prev.filter((apt) => apt.id !== id));
    } catch (err) {
      console.error("Failed to delete appointment", err);
      alert("Failed to delete appointment.");
    }
  };

  return (
    <ReceptionistLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Incoming Appointment Requests</h1>

        <div className="bg-[#1a1c29] rounded-2xl border border-gray-800 p-6">
          {error && <p className="text-red-400 mb-4">{error}</p>}
          {loading ? (
            <p className="text-gray-400">Loading appointments...</p>
          ) : (
            <AppointmentTable
              appointments={appointments}
              doctors={doctors}
              onAssign={handleAssign}
              onDelete={handleDelete}
              userRole="receptionist"
            />
          )}
        </div>
      </div>
    </ReceptionistLayout>
  );
}
