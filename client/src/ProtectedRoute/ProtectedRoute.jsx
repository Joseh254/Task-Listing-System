import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 🚫 Not verified
  if (user.isVerified !== true) {
    return <Navigate to="/verification-pending" replace />;
  }

  // 🚫 Role not allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Allowed
  return <Outlet />;
}

export default ProtectedRoute;
