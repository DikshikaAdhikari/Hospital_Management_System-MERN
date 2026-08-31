import React, { useState } from "react";

// Status pill colors shared by every dashboard that shows appointments.
const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  assigned: "bg-blue-100 text-blue-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

/**
 * Renders the appointment list for either the receptionist or the doctor
 * dashboard. The two roles have very different actions available on a row
 * (assign a doctor vs. approve/reject), so `userRole` controls which
 * columns/controls render — the backend independently enforces who is
 * actually allowed to call each action.
 *
 * Props:
 *  - appointments: array of appointment records (with .patient/.doctor/.department includes)
 *  - userRole: "receptionist" | "doctor"
 *  - doctors: (receptionist only) full doctor list, each with a `.departments` array, used to build the assign dropdown
 *  - onAssign(id, doctorId): (receptionist only) assign a doctor to a pending request
 *  - onApprove(id) / onReject(id): (doctor only) decide on an assigned request
 *  - onDelete(id): optional, available to either role for administrative cleanup
 */
const AppointmentTable = ({
  appointments,
  userRole,
  doctors = [],
  onAssign,
  onApprove,
  onReject,
  onDelete,
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState({});

  if (!appointments || appointments.length === 0) {
    return <p className="text-gray-500 py-4">No appointments found.</p>;
  }

  const doctorsForDepartment = (departmentId) =>
    doctors.filter((doc) =>
      (doc.departments || []).some((d) => d.id === departmentId)
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
            <th className="py-3 px-6">Patient</th>
            {userRole === "receptionist" && <th className="py-3 px-6">Department</th>}
            <th className="py-3 px-6">Date & Time</th>
            <th className="py-3 px-6">Reason</th>
            <th className="py-3 px-6 text-center">Status</th>
            {userRole === "receptionist" && <th className="py-3 px-6">Assign Doctor</th>}
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-black text-sm font-light">
          {appointments.map((apt) => {
            const eligibleDoctors = userRole === "receptionist"
              ? doctorsForDepartment(apt.department?.id)
              : [];

            return (
              <tr key={apt.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6 whitespace-nowrap">
                  <span className="font-medium">{apt.patient?.name || "Unknown Patient"}</span>
                </td>

                {userRole === "receptionist" && (
                  <td className="py-3 px-6">{apt.department?.name || "—"}</td>
                )}

                <td className="py-3 px-6">
                  {new Date(apt.appointmentDate).toLocaleString()}
                </td>
                <td className="py-3 px-6">
                  {apt.reason}
                </td>
                <td className="py-3 px-6 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[apt.status] || ""}`}>
                    {apt.status || "pending"}
                  </span>
                </td>

                {userRole === "receptionist" && (
                  <td className="py-3 px-6">
                    {apt.status === "pending" ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedDoctor[apt.id] || ""}
                          onChange={(e) =>
                            setSelectedDoctor({ ...selectedDoctor, [apt.id]: e.target.value })
                          }
                          className="border rounded px-2 py-1 text-xs"
                        >
                          <option value="">Select doctor</option>
                          {eligibleDoctors.map((doc) => (
                            <option key={doc.id} value={doc.id}>
                              Dr. {doc.user?.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => onAssign && onAssign(apt.id, selectedDoctor[apt.id])}
                          disabled={!selectedDoctor[apt.id]}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-xs transition disabled:opacity-50"
                        >
                          Assign
                        </button>
                      </div>
                    ) : apt.doctor?.user?.name ? (
                      <span>Dr. {apt.doctor.user.name}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                )}

                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center space-x-2">
                    {userRole === "doctor" && apt.status === "assigned" && onApprove && (
                      <button
                        onClick={() => onApprove(apt.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition"
                      >
                        Approve
                      </button>
                    )}
                    {userRole === "doctor" && apt.status === "assigned" && onReject && (
                      <button
                        onClick={() => onReject(apt.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition"
                      >
                        Reject
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(apt.id)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;
