import { Navigate } from "react-router-dom";
import { isAuthenticated, getSessionRole } from "../services/auth";

// roles: array of allowed roles, e.g. ["ADMIN", "SUPER_ADMIN"]
const ProtectedRoute = ({ children, roles = [] }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0) {
    const userRole = getSessionRole();
    if (!roles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
