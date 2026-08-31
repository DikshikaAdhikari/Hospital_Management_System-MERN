import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../services/api";
import PatientLayout from "../../components/layouts/PatientLayout";

export default function Appointment() {
  const location = useLocation();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);

  // Per the required workflow the patient picks a DEPARTMENT here — the
  // doctor is assigned afterwards by the receptionist, not chosen at
  // booking time.
  const [formData, setFormData] = useState({
    departmentId: location.state?.departmentId || "",
    appointmentDate: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get("/departments");
        setDepartments(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch departments", err);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await api.post("/appointments", {
        departmentId: formData.departmentId,
        appointmentDate: formData.appointmentDate,
        reason: formData.reason,
      });
      setMessage("Appointment request sent! A receptionist will assign you a doctor shortly.");
      setFormData({ departmentId: "", appointmentDate: "", reason: "" });

      setTimeout(() => {
        navigate("/patient/overview");
      }, 1500);
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PatientLayout>
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Request an Appointment</h1>

      <div className="bg-[#1a1c29] border border-gray-800 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Department</label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 bg-[#0f111a] text-gray-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Choose a Department --</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              A receptionist will assign an available doctor from this department.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Date & Time</label>
            <input
              type="datetime-local"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 bg-[#0f111a] text-gray-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Reason for Visit</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              required
              rows="3"
              placeholder="E.g., General checkup, headache..."
              className="w-full border border-gray-700 bg-[#0f111a] text-gray-100 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>}
          {message && <div className="bg-green-100 text-green-700 p-3 rounded-lg">{message}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition disabled:bg-gray-400"
          >
            {loading ? "Sending..." : "Send Appointment Request"}
          </button>
        </form>
      </div>
    </div>
    </PatientLayout>
  );
}
