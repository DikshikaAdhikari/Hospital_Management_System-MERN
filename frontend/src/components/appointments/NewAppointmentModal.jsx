import React, { useState } from "react";
import api from "../../services/api";

export default function NewAppointmentModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    medicalHistory: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // The diagram shows creating an appointment/patient request
      // We send it to appointments (which goes to receptionist dashboard)
      // Since backend model for appointment only has basic fields, 
      // passing these additional fields if backend is updated, 
      // or just storing them in reason/notes.
      // We'll pass the full formData.
      await api.post("/appointments", {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`,
        reason: "New Appointment Request",
        appointmentDate: new Date().toISOString(), // default or add field
      });

      setMessage("Appointment request sent successfully!");
      setTimeout(() => {
        onClose();
        setMessage("");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Failed to create appointment request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black   text-black bg-opacity-50 overflow-y-auto pt-20 pb-20">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-gray-600"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-black mb-6">New Appointment Request</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500  text-black " />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500  text-black " />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 text-black " />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Phone</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500  text-black " />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Date of Birth</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500  text-black " />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 text-black ">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Blood Group</label>
              <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500  text-black " />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-black mb-1">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500  text-black " />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Emergency Contact Name</label>
              <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500  text-black " />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Emergency Contact Phone</label>
              <input type="text" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500  text-black " />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-black mb-1">Medical History</label>
              <textarea name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} rows="3" className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500  text-black "></textarea>
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
          {message && <div className="text-green-500 text-sm">{message}</div>}

          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded text-black hover:bg-gray-100">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-black rounded hover:bg-indigo-700 disabled:opacity-50">
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
