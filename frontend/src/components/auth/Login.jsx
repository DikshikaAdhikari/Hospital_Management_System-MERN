import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Login user
  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      // Assuming backend login endpoint is /auth/login, without /api since base is /api or we just hit /auth/login.
      // Wait, let's just use axios for login if we are not sure about base url in api, or use api if it points to localhost:3900/api
      // Let's use api but adjust the path to "/auth/login". Wait, the original code hit "http://localhost:3900/auth/login"
      // the api.js base URL is "http://localhost:3900/api". 
      // If the backend auth routes are not under /api, this might fail. I'll use standard axios for login to be safe, or just use api if they are under /api.
      // Actually, I'll update the URL to use standard axios here to avoid breaking it if it's not under /api, but I should probably just fix api.js to point to "http://localhost:3900" 
      // Let's just use axios directly for now to be completely safe, or I can use api and hit "/auth/login" if it's there. 
      // I'll stick with axios for login to be safe since it was working before.
console.log("API OBJECT:", api);
console.log("BASE URL:", api.defaults.baseURL);
console.log("LOGIN URL:", `${api.defaults.baseURL}/auth/login`);

const response = await api.post("/auth/login", {
  email: formData.email,
  password: formData.password,
});
const user = response.data.data.user;
const accessToken = response.data.data.accessToken;
const refreshToken = response.data.data.refreshToken;

console.log("User:", user);
console.log("Role:", user.roles);
console.log("Access Token:", accessToken);

// Save access token
if (accessToken) localStorage.setItem("accessToken", accessToken);

// Save refresh token
if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

// Save user
localStorage.setItem("user", JSON.stringify(user));

// Role-based redirect
const roleRoutes = {
  patient: "/patient/overview",
  doctor: "/doctor/overview",
  receptionist: "/receptionist/overview",
};

const redirectPath = roleRoutes[user.roles];

if (redirectPath) {
  navigate(redirectPath);
} else {
  navigate("/dashboard");
}

    } catch (error) {
  console.log("STATUS:", error.response?.status);
  console.log("BACKEND RESPONSE:", error.response?.data);
  console.log("FULL ERROR:", error);

      setError(
        error.response?.data?.message ||
        "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        <h2 className="text-3xl font-bold text-center text-blue-600 mb-2">
          Welcome Back
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Login to Hospital Management System
        </p>

        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full border border-black rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full border border-black rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Success */}
          {message && (
            <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg">
              {message}
            </div>
          )}

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default Login;