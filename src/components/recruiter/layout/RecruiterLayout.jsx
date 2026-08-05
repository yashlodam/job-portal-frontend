/**
 * src/components/recruiter/layout/RecruiterLayout.jsx
 *
 * Master layout wrapper for all Recruiter pages.
 */

import React, { useState } from "react";
import RecruiterSidebar from "./RecruiterSidebar";
import RecruiterNavbar from "./RecruiterNavbar";
import { Breadcrumb } from "../../ui/Breadcrumb";

export default function RecruiterLayout({ title, subtitle, breadcrumbs = [], action, children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-inter text-body flex">
      {/* Sidebar */}
      <RecruiterSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Navbar */}
        <RecruiterNavbar onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Breadcrumb */}
          {breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}

          {/* Page Header */}
          {(title || action) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
              <div>
                {title && <h1 className="text-2xl sm:text-3xl font-black text-white font-satoshi tracking-tight">{title}</h1>}
                {subtitle && <p className="text-xs sm:text-sm text-white/60 mt-1">{subtitle}</p>}
              </div>
              {action && <div className="shrink-0">{action}</div>}
            </div>
          )}

          {/* Main Body */}
          {children}
        </main>
      </div>
    </div>
  );
}
