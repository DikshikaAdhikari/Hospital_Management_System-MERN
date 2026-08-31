import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.roles)) {
    // If logged in but not authorized for this route, redirect to their own dashboard
    if (user.roles === "patient") return <Navigate to="/patient/overview" replace />;
    if (user.roles === "doctor") return <Navigate to="/doctor/overview" replace />;
    if (user.roles === "receptionist") return <Navigate to="/receptionist/overview" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
