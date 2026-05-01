import { Navigate, Outlet, useLocation } from "react-router-dom";

/**
 * Route guard that ensures the user has an admin role.
 * If no JWT token is found, redirects to login.
 * If token exists but user lacks admin role, redirects to 403 page.
 */
export const AdminRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check if user has admin role
  if (role !== "admin") {
    return <Navigate to="/403" replace />;
  }

  // Admin user – render nested route(s)
  return <Outlet />;
};
