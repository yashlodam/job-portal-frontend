import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../LandingPage/Footer";
import ScrollToTop from "./ScrollToTop";
import FloatingAIChatbot from "./FloatingAIChatbot";

function Layout() {
  const location = useLocation();

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

  const isMessagesRoute = location.pathname.startsWith("/messages");

  const hideUserHeader = isRecruiterRoute || isAuthRoute;
  const hideUserFooter = isRecruiterRoute || isAuthRoute || isMessagesRoute;
  const hideChatbot = isAuthRoute || isRecruiterRoute || isMessagesRoute;

  return (
    <div className="min-h-screen w-full bg-background font-inter text-body flex flex-col">
      {/* Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <ScrollToTop />

      {/* Header — hidden for Studio/Auth routes, visible on public & messages */}
      {!hideUserHeader && <Header />}

      {/* Main Page Content */}
      <main id="main-content" className="relative w-full flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Global Floating AI Career Chatbot — hidden on messages to avoid blocking chat input */}
      {!hideChatbot && <FloatingAIChatbot />}

      {/* Footer — hidden on Auth, Studio, and Messages full-screen chat views */}
      {!hideUserFooter && <Footer />}
    </div>
  );
}

export default Layout;