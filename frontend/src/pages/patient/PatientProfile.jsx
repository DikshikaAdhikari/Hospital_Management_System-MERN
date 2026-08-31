import React, { useEffect, useState } from "react";
import api from "../../services/api";
import PatientLayout from "../../components/layouts/PatientLayout";

const PatientProfile = () => {
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    address: "",
    medicalHistory: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================
  // FETCH PATIENT PROFILE
  // =========================================================
  const fetchPatientProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/patient/profile");

      const profileData =
        response.data?.data ||
        response.data?.patient ||
        response.data;

      if (!profileData || !profileData.patientId) {
        throw new Error("Patient profile was not found.");
      }

      setProfile(profileData);

      setFormData({
        name: profileData.name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        dateOfBirth: profileData.dateOfBirth
          ? String(profileData.dateOfBirth).substring(0, 10)
          : "",
        gender: profileData.gender || "",
        bloodGroup: profileData.bloodGroup || "",
        address: profileData.address || "",
        medicalHistory: profileData.medicalHistory || "",
      });
    } catch (error) {
      console.error(
        "Failed to fetch patient profile:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load patient profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD PROFILE ONCE
  // =========================================================
  useEffect(() => {
    fetchPatientProfile();
  }, []);

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // SAVE PROFILE
  // =========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.put("/patient/profile", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender || null,
        bloodGroup: formData.bloodGroup || null,
        address: formData.address || null,
        medicalHistory: formData.medicalHistory || null,
      });

      const updatedProfile =
        response.data?.data ||
        response.data?.patient ||
        response.data;

      setProfile(updatedProfile);

      setFormData({
        name: updatedProfile.name || "",
        email: updatedProfile.email || "",
        phone: updatedProfile.phone || "",
        dateOfBirth: updatedProfile.dateOfBirth
          ? String(updatedProfile.dateOfBirth).substring(0, 10)
          : "",
        gender: updatedProfile.gender || "",
        bloodGroup: updatedProfile.bloodGroup || "",
        address: updatedProfile.address || "",
        medicalHistory: updatedProfile.medicalHistory || "",
      });

      setEditing(false);
      setSuccess("Profile updated successfully.");

      // Remove success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to update patient profile:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update patient profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // CANCEL EDITING
  // =========================================================
  const handleCancel = () => {
    if (!profile) return;

    setFormData({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      dateOfBirth: profile.dateOfBirth
        ? String(profile.dateOfBirth).substring(0, 10)
        : "",
      gender: profile.gender || "",
      bloodGroup: profile.bloodGroup || "",
      address: profile.address || "",
      medicalHistory: profile.medicalHistory || "",
    });

    setEditing(false);
    setError("");
    setSuccess("");
  };

  // =========================================================
  // LOADING
  // =========================================================
  if (loading) {
    return (
      <PatientLayout>
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading patient profile...</p>
          </div>
        </div>
      </PatientLayout>
    );
  }

  // =========================================================
  // ERROR / NO PROFILE
  // =========================================================
  if (!profile) {
    return (
      <PatientLayout>
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#1a1c29] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white">
              Patient Profile
            </h2>

            <p className="mt-3 text-red-400">
              {error || "Patient profile could not be found."}
            </p>

            <button
              onClick={fetchPatientProfile}
              className="mt-5 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </PatientLayout>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================
  return (
    <PatientLayout>
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Patient Profile
            </h1>

            <p className="mt-1 text-gray-400">
              View and manage your personal information
            </p>
          </div>

          {!editing && (
            <button
              onClick={() => {
                setEditing(true);
                setError("");
                setSuccess("");
              }}
              className="mt-4 md:mt-0 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="mb-5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-4 text-emerald-400">
            {success}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-5 rounded-lg bg-red-500/10 border border-red-500/30 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* PROFILE CARD */}
        <div className="bg-[#1a1c29] rounded-2xl border border-gray-800 overflow-hidden">

          {/* PROFILE HEADER */}
          <div className="bg-indigo-600 px-6 py-8 text-white">
            <div className="flex items-center gap-5">

              <div className="h-20 w-20 rounded-full bg-white text-indigo-600 flex items-center justify-center text-3xl font-bold">
                {(profile.name || "P").charAt(0).toUpperCase()}
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  {profile.name || "Patient"}
                </h2>

                <p className="text-indigo-100">
                  {profile.email || "No email available"}
                </p>

                <p className="text-sm text-indigo-100 mt-1">
                  Patient ID: {profile.patientId}
                </p>
              </div>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="p-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* NAME */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>

                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-700 bg-[#0f111a] text-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <div className="rounded-lg bg-[#0f111a] border border-gray-800 px-4 py-3 text-gray-200">
                    {profile.name || "Not provided"}
                  </div>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>

                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-700 bg-[#0f111a] text-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <div className="rounded-lg bg-[#0f111a] border border-gray-800 px-4 py-3 text-gray-200">
                    {profile.email || "Not provided"}
                  </div>
                )}
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone
                </label>

                {editing ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-700 bg-[#0f111a] text-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <div className="rounded-lg bg-[#0f111a] border border-gray-800 px-4 py-3 text-gray-200">
                    {profile.phone || "Not provided"}
                  </div>
                )}
              </div>

              {/* DATE OF BIRTH */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date of Birth
                </label>

                {editing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-700 bg-[#0f111a] text-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <div className="rounded-lg bg-[#0f111a] border border-gray-800 px-4 py-3 text-gray-200">
                    {profile.dateOfBirth
                      ? String(profile.dateOfBirth).substring(0, 10)
                      : "Not provided"}
                  </div>
                )}
              </div>

              {/* GENDER */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gender
                </label>

                {editing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-700 bg-[#0f111a] text-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <div className="rounded-lg bg-[#0f111a] border border-gray-800 px-4 py-3 text-gray-200 capitalize">
                    {profile.gender || "Not provided"}
                  </div>
                )}
              </div>

              {/* BLOOD GROUP */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Blood Group
                </label>

                {editing ? (
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-700 bg-[#0f111a] text-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                ) : (
                  <div className="rounded-lg bg-[#0f111a] border border-gray-800 px-4 py-3 text-gray-200">
                    {profile.bloodGroup || "Not provided"}
                  </div>
                )}
              </div>

              {/* ADDRESS */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address
                </label>

                {editing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full rounded-lg border border-gray-700 bg-[#0f111a] text-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <div className="rounded-lg bg-[#0f111a] border border-gray-800 px-4 py-3 text-gray-200">
                    {profile.address || "Not provided"}
                  </div>
                )}
              </div>

              {/* MEDICAL HISTORY */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Medical History
                </label>

                {editing ? (
                  <textarea
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Enter any relevant medical history..."
                    className="w-full rounded-lg border border-gray-700 bg-[#0f111a] text-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <div className="rounded-lg bg-[#0f111a] border border-gray-800 px-4 py-3 text-gray-200 whitespace-pre-wrap">
                    {profile.medicalHistory || "No medical history provided"}
                  </div>
                )}
              </div>
            </div>

            {/* EDIT BUTTONS */}
            {editing && (
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-800">

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-5 py-2.5 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

              </div>
            )}
          </form>
        </div>
      </div>
    </PatientLayout>
  );
};

export default PatientProfile;
