import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem("token");

  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/dashboard/" state={{ from: location }} />;
  }

  return children;
};

export default PublicRoute;
