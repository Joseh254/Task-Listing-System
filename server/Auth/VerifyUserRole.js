// auth.js
import jwt from "jsonwebtoken";

// --------------------------
// Verify JWT Token Middleware
// --------------------------
export function verifyToken(req, res, next) {
  const token =
    req.cookies?.access_token || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user payload to request
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid token" });
  }
}

// --------------------------
// Role Check Middleware
// --------------------------
export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: role not allowed" });
    }

    next();
  };
}

// --------------------------
// Verified User Check Middleware
// --------------------------
export function requireVerified(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (!req.user.isVerified) {
    return res
      .status(403)
      .json({ success: false, message: "User not verified" });
  }

  next();
}

// --------------------------
// Utility function to check role + verified
// --------------------------
export function isUserRole(user, role) {
  return user?.role === role && user?.isVerified === true;
}
