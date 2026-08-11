import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../State/Store";

/**
 * PublicRoute — guards auth routes (/login, /signup, /auth, /register).
 * If user is already authenticated, redirects them directly to the app
 * (/recruiter/dashboard for recruiters, or / for candidates).
 */
export default function PublicRoute() {
  const user = useAppSelector((state) => state.auth.profile);

  if (user) {
    const isEmployer =
      user.accountType === "EMPLOYER" ||
      user.role === "EMPLOYER" ||
      user.accountType === "RECRUITER" ||
      user.role === "RECRUITER";

    return <Navigate to={isEmployer ? "/recruiter/dashboard" : "/"} replace />;
  }

  //this is public route, so if the user is not authenticated, we allow them to access the route

  return <Outlet />;
}
