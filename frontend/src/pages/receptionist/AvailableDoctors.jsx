import React, { useState, useEffect, useMemo } from "react";
import api from "../../services/api";
import ReceptionistLayout from "../../components/layouts/ReceptionistLayout";

export default function AvailableDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get("/doctors");
        setDoctors(response.data.data || []);
      } catch (err) {
        console.error("Failed to fetch doctors", err);
        setError(err.response?.data?.message || "Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const departments = useMemo(() => {
    const set = new Set();
    doctors.forEach((doc) =>
      (doc.departments || []).forEach((d) => set.add(d.name))
    );
    return Array.from(set);
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    if (departmentFilter === "all") return doctors;
    return doctors.filter((doc) =>
      (doc.departments || []).some((d) => d.name === departmentFilter)
    );
  }, [doctors, departmentFilter]);

  return (
    <ReceptionistLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-white">Available Doctors</h1>

          {departments.length > 0 && (
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-[#1a1c29] border border-gray-700 text-gray-100 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Departments</option>
              {departments.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          )}
        </div>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        {loading ? (
          <p className="text-gray-400">Loading doctors...</p>
        ) : filteredDoctors.length === 0 ? (
          <p className="text-gray-400">No doctors found.</p>
        ) : (
          <div className="bg-[#1a1c29] border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-[#141523] text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Specialization</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Experience</th>
                  <th className="px-6 py-3">Fee</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doc) => (
                  <tr key={doc.id} className="border-t border-gray-800 text-gray-200">
                    <td className="px-6 py-3">Dr. {doc.user?.name || "Unknown"}</td>
                    <td className="px-6 py-3">{doc.specialization}</td>
                    <td className="px-6 py-3">
                      {(doc.departments || []).map((d) => d.name).join(", ") || "—"}
                    </td>
                    <td className="px-6 py-3">{doc.experience} yrs</td>
                    <td className="px-6 py-3">Rs. {doc.consultationFee}</td>
                    <td className="px-6 py-3 capitalize">{doc.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ReceptionistLayout>
  );
}
