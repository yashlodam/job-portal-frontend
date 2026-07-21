import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../LandingPage/Footer";
import ScrollToTop from "./ScrollToTop";

function Layout() {

  const location = useLocation();

const hideLayout = ["/auth", "/reset-password"].includes(location.pathname);
  return (
    <div className="min-h-screen w-full bg-background font-inter text-body">
      {/* Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <ScrollToTop />

      {/* Header */}
      {!hideLayout && <Header />}

      {/* Main Page Content */}
      <main
        id="main-content"
        className="relative w-full"
      >
        <Outlet />
      </main>

      {/* Footer */}
       {!hideLayout && <Footer />}
    </div>
  );
}

export default Layout;