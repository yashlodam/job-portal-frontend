import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../LandingPage/Footer";
import ScrollToTop from "./ScrollToTop";
import FloatingAIChatbot from "./FloatingAIChatbot";
import { useAppSelector } from "../State/Store";
function Layout() {
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.profile);

  const isEmployer =
    user?.accountType === "EMPLOYER" ||
    user?.role === "EMPLOYER" ||
    user?.accountType === "RECRUITER" ||
    user?.role === "RECRUITER";

  const isRecruiterRoute =
    location.pathname.startsWith("/recruiter") ||
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/upload-job") ||
    location.pathname.startsWith("/posted-job");

  const isAuthRoute =
    location.pathname === "/auth" ||
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/register" ||
    location.pathname === "/reset-password";

  const hideUserHeaderFooter = isEmployer || isRecruiterRoute || isAuthRoute;

  return (
    <div className="min-h-screen w-full bg-background font-inter text-body">
      {/* Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <ScrollToTop />

      {/* Header — hidden for Employers, Auth pages, and Recruiter routes */}
      {!hideUserHeaderFooter && <Header />}

      {/* Main Page Content */}
      <main id="main-content" className="relative w-full">
        <Outlet />
      </main>

      {/* Global Floating AI Career Chatbot */}
      {!isAuthRoute && <FloatingAIChatbot />}

      {/* Footer — hidden for Employers, Auth pages, and Recruiter routes */}
      {!hideUserHeaderFooter && <Footer />}
    </div>
  );
}

export default Layout;