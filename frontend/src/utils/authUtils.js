// Shared helpers used across every dashboard layout (Patient/Doctor/Receptionist).

/**
 * Reads the logged-in user from localStorage.
 * Login already stores this as JSON under the "user" key.
 */
export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

/**
 * Logs the user out: clears everything auth-related from localStorage and
 * sends them back to the login page. Sessions are otherwise long-lived
 * (the backend issues a ~10 year token), so this is the ONLY way a session
 * ends besides the account being deleted server-side.
 */
export function logout(navigate) {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  navigate("/login", { replace: true });
}

/**
 * Time-of-day greeting, e.g. "Good Morning". Recomputed on every render,
 * so it's always accurate for whenever the page happens to load.
 */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

/** Returns a single uppercase initial for an avatar bubble. */
export function getInitial(name) {
  if (!name || typeof name !== "string") return "U";
  return name.trim().charAt(0).toUpperCase() || "U";
}
