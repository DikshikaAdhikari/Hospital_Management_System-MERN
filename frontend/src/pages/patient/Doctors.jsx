import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import PatientLayout from "../../components/layouts/PatientLayout";

export default function Doctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get("/doctors");
        // Backend responds with { success, data: [...] }
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
    <PatientLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-white">Find a Doctor</h1>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-[#1a1c29] border border-gray-800 rounded-2xl p-6 flex flex-col"
              >
                <div className="w-14 h-14 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xl font-bold mb-4">
                  {(doc.user?.name || "D").charAt(0).toUpperCase()}
                </div>
                <h2 className="text-lg font-semibold text-white">
                  Dr. {doc.user?.name || "Unknown"}
                </h2>
                <p className="text-indigo-400 text-sm mb-2">{doc.specialization}</p>
                <p className="text-gray-500 text-sm mb-1">{doc.qualification}</p>
                <p className="text-gray-500 text-sm mb-1">{doc.experience} years experience</p>
                {doc.departments?.length > 0 && (
                  <p className="text-gray-500 text-sm mb-3">
                    {doc.departments.map((d) => d.name).join(", ")}
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="text-white font-semibold">
                    Rs. {doc.consultationFee}
                  </span>
                  <button
                    onClick={() => navigate("/patient/appointment", { state: { departmentId: doc.departments?.[0]?.id } })}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    title="Requests go through the receptionist, who assigns an available doctor from this department"
                  >
                    Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PatientLayout>
  );
}
