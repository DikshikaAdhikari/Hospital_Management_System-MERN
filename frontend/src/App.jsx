import { Routes, Route } from "react-router-dom";

import Landingpage from "./components/auth/landingpage";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import PatientOverview from "./pages/patient/Overview";
import PatientDoctors from "./pages/patient/Doctors";
import PatientAppointment from "./pages/patient/Appointment";
import PatientProfile from "./pages/patient/PatientProfile";

import DoctorOverview from "./pages/doctor/Overview";
import PatientRequests from "./pages/doctor/Requests";

import ReceptionistOverview from "./pages/receptionist/Overview";
import AvailableDoctors from "./pages/receptionist/AvailableDoctors";
import IncomingPatients from "./pages/receptionist/IncomingPatients";

function App() {
  return (
    <>
      <Routes>

        {/* Authentication */}
        <Route path="/" element={<Landingpage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Patient Routes */}
        <Route
          path="/patient/overview"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientOverview />
            </ProtectedRoute>
          }
          
        />
        <Route
          path="/patient/doctors"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientDoctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointment"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientAppointment />
            </ProtectedRoute>
          }
        />
        <Route
        path="/patient/profile"
        element={
        <ProtectedRoute allowedRoles={["patient"]}>
        <PatientProfile />
        </ProtectedRoute>
         }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor/overview"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <DoctorOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/requests"
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <PatientRequests />
            </ProtectedRoute>
          }
        />

        {/* Receptionist Routes */}
        <Route
          path="/receptionist/overview"
          element={
            <ProtectedRoute allowedRoles={["receptionist"]}>
              <ReceptionistOverview />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receptionist/doctors"
          element={
            <ProtectedRoute allowedRoles={["receptionist"]}>
              <AvailableDoctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receptionist/patients"
          element={
            <ProtectedRoute allowedRoles={["receptionist"]}>
              <IncomingPatients />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}

export default App;