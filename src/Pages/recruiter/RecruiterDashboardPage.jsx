/**
 * src/Pages/recruiter/RecruiterDashboardPage.jsx
 *
 * Recruiter Dashboard Page combining KPIs, Recent Activity, Hiring Funnel, and Quick Actions.
 */

import React from "react";
import { Link } from "react-router-dom";
import { Plus, ArrowRight, Briefcase, Sparkles, Filter } from "lucide-react";
import RecruiterLayout from "../../components/recruiter/layout/RecruiterLayout";
import DashboardKpis from "../../components/recruiter/dashboard/DashboardKpis";
import { RecentActivityWidget, HiringFunnelWidget } from "../../components/recruiter/dashboard/RecentActivityWidget";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { StatusChip } from "../../components/ui/Badge";

export default function RecruiterDashboardPage() {
  const activeJobs = [
    { id: 1, title: "Senior React Engineer", team: "Frontend", applicants: 42, status: "ACTIVE", posted: "2 days ago" },
    { id: 2, title: "Lead AI Architect", team: "Machine Learning", applicants: 18, status: "FEATURED", posted: "1 day ago" },
    { id: 3, title: "Product Designer", team: "Design Systems", applicants: 31, status: "ACTIVE", posted: "3 days ago" },
  ];

  return (
    <RecruiterLayout
      title="Recruiter Overview"
      subtitle="Welcome back! Here's your hiring snapshot for today."
      action={
        <Link
          to="/upload-job"
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:scale-105 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Post New Role</span>
        </Link>
      }
    >
      {/* KPIs */}
      <DashboardKpis />

      {/* Grid: Active Jobs Teaser + Hiring Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Jobs & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Jobs Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-indigo-400" />
                  Active Job Postings
                </CardTitle>
                <Link to="/recruiter/jobs" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-3">
              {activeJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3.5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white font-satoshi">{job.title}</h4>
                      <StatusChip status={job.status} />
                    </div>
                    <p className="text-xs text-white/50 mt-0.5">{job.team} · Posted {job.posted}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                      {job.applicants} Applicants
                    </span>
                    <Link to={`/recruiter/jobs`} className="text-xs font-semibold text-white/60 hover:text-white">
                      Manage →
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <RecentActivityWidget />
        </div>

        {/* Right Col: Hiring Funnel */}
        <div className="space-y-6">
          <HiringFunnelWidget />
        </div>
      </div>
    </RecruiterLayout>
  );
}
