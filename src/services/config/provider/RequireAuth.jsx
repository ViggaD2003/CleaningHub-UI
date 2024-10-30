import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "./useAuth";

// eslint-disable-next-line react/prop-types
const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  return allowedRoles?.includes(auth?.role) ? (
    <Outlet />
  ) : auth?.role === "ROLE_ADMIN" ? (
    <Navigate to="/admin/overview" state={{ from: location }} replace />
  ) : auth?.role === "ROLE_STAFF" ? (
    <Navigate to="/staff/dashboard" state={{ from: location }} replace />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default RequireAuth;
