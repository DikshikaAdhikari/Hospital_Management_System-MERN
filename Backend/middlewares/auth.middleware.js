import jwt from "jsonwebtoken";

/**
 * Middleware to authenticate JWT access tokens.
 * Accepts raw accessToken or Bearer token from headers or cookies.
 */
export const authenticate = (req, res, next) => {
  try {
    let token =
      req.headers["x-access-token"] ||
      req.headers["access-token"] ||
      req.headers.token ||
      req.headers.authorization ||
      req.headers.Authorization;

    if (!token && req.cookies) {
      token = req.cookies.accessToken || req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token is missing",
      });
    }

    // Strip "Bearer " prefix if provided
    if (typeof token === "string" && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const secret = process.env.JWT_Access_SECRET || process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "JWT secret is not configured",
      });
    }

    const decoded = jwt.verify(token, secret);
    req.user = decoded; // { id, role }
    next();
  } catch (error)
  {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
      error: error.message,
    });
  }
};

/**
 * Optional authentication middleware.
 * If token is provided and valid, attaches req.user.
 * If no token is provided, proceeds without error.
 */
export const optionalAuthenticate = (req, res, next) => {
  try {
    let token =
      req.headers["x-access-token"] ||
      req.headers["access-token"] ||
      req.headers.token ||
      req.headers.authorization ||
      req.headers.Authorization;

    if (!token && req.cookies) {
      token = req.cookies.accessToken || req.cookies.token;
    }

    if (token) {
      if (typeof token === "string" && token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
      }
      const secret = process.env.JWT_Access_SECRET || process.env.JWT_SECRET;
      if (secret) {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
      }
    }
  } catch (error) {
    // Proceed quietly without req.user if token is invalid or missing
  }
  next();
};

/**
 * Middleware to authorize specific user roles.
 * Usage: authorizeRoles("admin", "doctor")
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const userRole = req.user.role || req.user.roles;
    if (!allowedRoles.includes(userRole))
    {
      return res.status(403).json(
        {
        success: false,
        message: `Access denied. Role '${userRole}' is not authorized to perform this action`,
      });
    }

    next();
  };
};
