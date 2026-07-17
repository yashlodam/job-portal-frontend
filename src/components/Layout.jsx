import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../LandingPage/Footer";
import ScrollToTop from "./ScrollToTop";

function Layout() {
  return (
    <div className="min-h-screen w-full bg-background font-inter text-body">
      {/* Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <ScrollToTop />

      {/* Header */}
      <Header />

      {/* Main Page Content */}
      <main
        id="main-content"
        className="relative w-full"
      >
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Layout;