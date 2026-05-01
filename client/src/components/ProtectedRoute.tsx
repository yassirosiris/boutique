import { Navigate, Outlet, useLocation } from "react-router-dom";

/**
 * Route guard that ensures the user is authenticated.
 * If no JWT token is found in localStorage, the user is redirected to the login page.
 */
export const ProtectedRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    // Preserve the attempted location so we can redirect back after login if desired
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Authenticated – render the nested route(s)
  return <Outlet />;
};
