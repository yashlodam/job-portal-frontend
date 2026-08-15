/**
 * src/Pages/admin/AdminDashboardPage.jsx
 *
 * Real-time Admin Overview & Control Console.
 * 100% Real Data from backend APIs and Redux state.
 */

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { StatusChip } from "../../components/ui/Badge";
import {
  ShieldCheck,
  Clock,
  Users,
  Building2,
  Briefcase,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../State/Store";
import { fetchAdminRecruiters } from "../../State/verificationSlice";
import { getAllJobs } from "../../State/JobSlice";
import { getAllCompanies } from "../../State/CompanySlice";

export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const { adminRecruiters, adminLoading } = useAppSelector((state) => state.verification);
  const { allJobs = [] } = useAppSelector((state) => state.job);
  const { companies = [] } = useAppSelector((state) => state.company);

  useEffect(() => {
    dispatch(fetchAdminRecruiters({ page: 0, size: 50 }));
    dispatch(getAllJobs());
    dispatch(getAllCompanies({ page: 0, size: 50 }));
  }, [dispatch]);

  const recruitersList = adminRecruiters?.content || [];
  const pendingList = recruitersList.filter(
    (r) =>
      (r.status || r.verificationStatus) === "PENDING_VERIFICATION" ||
      (r.status || r.verificationStatus) === "PENDING"
  );
  const approvedList = recruitersList.filter(
    (r) =>
      (r.status || r.verificationStatus) === "APPROVED" ||
      (r.status || r.verificationStatus) === "VERIFIED"
  );

  const pendingCount = pendingList.length;
  const approvedCount = approvedList.length;
  const totalJobsCount = Array.isArray(allJobs) ? allJobs.length : 0;
  const totalCompaniesCount = Array.isArray(companies) ? companies.length : 0;

  return (
    <AdminLayout
      title="Platform Operations & Verification Console"
      subtitle="Real-time control center for employer compliance, candidate pipeline, and platform operations."
      breadcrumbs={[{ label: "Admin Console", to: "/admin/dashboard" }]}
      action={
        <Link
          to="/admin/recruiters"
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:scale-105 transition cursor-pointer font-satoshi"
        >
          <ShieldCheck size={16} />
          <span>Review Verification Queue ({pendingCount})</span>
        </Link>
      }
    >
      {/* Real-time KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Verifications */}
        <Link to="/admin/recruiters" className="block group">
          <Card className="p-4 bg-gradient-to-br from-amber-950/40 to-slate-900/60 border border-amber-500/25 transition-all group-hover:border-amber-500/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Pending Review</span>
              <Clock className="h-4 w-4 text-amber-400 animate-pulse" />
            </div>
            <p className="mt-2 text-2xl font-black text-white font-satoshi">{pendingCount}</p>
            <p className="text-[10px] text-amber-300 font-semibold mt-1">Requires Admin Action</p>
          </Card>
        </Link>

        {/* Verified Recruiters */}
        <Link to="/admin/recruiters" className="block group">
          <Card className="p-4 bg-gradient-to-br from-emerald-950/40 to-slate-900/60 border border-emerald-500/25 transition-all group-hover:border-emerald-500/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Verified Recruiters</span>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="mt-2 text-2xl font-black text-white font-satoshi">{approvedCount}</p>
            <p className="text-[10px] text-emerald-400 font-semibold mt-1">Active Hiring Organizations</p>
          </Card>
        </Link>

        {/* Live Tech Jobs */}
        <Link to="/admin/jobs" className="block group">
          <Card className="p-4 bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border border-indigo-500/25 transition-all group-hover:border-indigo-500/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Live Job Postings</span>
              <Briefcase className="h-4 w-4 text-indigo-400" />
            </div>
            <p className="mt-2 text-2xl font-black text-white font-satoshi">{totalJobsCount}</p>
            <p className="text-[10px] text-indigo-300 font-semibold mt-1">Active Roles on Platform</p>
          </Card>
        </Link>

        {/* Total Companies */}
        <Link to="/admin/companies" className="block group">
          <Card className="p-4 bg-gradient-to-br from-purple-950/40 to-slate-900/60 border border-purple-500/25 transition-all group-hover:border-purple-500/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Registered Companies</span>
              <Building2 className="h-4 w-4 text-purple-400" />
            </div>
            <p className="mt-2 text-2xl font-black text-white font-satoshi">{totalCompaniesCount}</p>
            <p className="text-[10px] text-purple-300 font-semibold mt-1">Employer Profiles</p>
          </Card>
        </Link>
      </div>

      {/* Grid: Pending Verification Queue + Live Job Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Verification Priority Queue */}
        <Card className="p-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <CardTitle className="text-base font-bold text-white font-satoshi flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                Pending Verification Queue ({pendingCount})
              </CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                Recruiters awaiting administrative background review.
              </p>
            </div>

            <Link
              to="/admin/recruiters"
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 font-satoshi"
            >
              Review All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-white/5 pt-2">
            {pendingList.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <CheckCircle2 size={32} className="text-emerald-400 mx-auto opacity-80" />
                <p className="text-sm font-bold text-white font-satoshi">Verification Queue is Clear</p>
                <p className="text-xs text-slate-400">All submitted recruiter accounts have been reviewed.</p>
              </div>
            ) : (
              pendingList.slice(0, 5).map((rec) => (
                <div key={rec.id || rec.userId || rec.recruiterId || Math.random()} className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 font-bold text-xs">
                      {(rec.recruiterName || rec.fullName || rec.name || "R").charAt(0)}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">{rec.recruiterName || rec.fullName || rec.name}</h5>
                      <p className="text-[11px] text-slate-400">
                        {rec.companyName || rec.company || "Company"} · {rec.recruiterEmail || rec.workEmail || rec.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusChip status="PENDING_VERIFICATION" />
                    <Link
                      to="/admin/recruiters"
                      className="text-xs font-bold text-purple-400 hover:underline"
                    >
                      Inspect →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Live Platform Jobs Snapshot */}
        <Card className="p-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <CardTitle className="text-base font-bold text-white font-satoshi flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-indigo-400" />
                Recent Live Job Postings ({totalJobsCount})
              </CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">
                Active opportunities currently discoverable by talent.
              </p>
            </div>

            <Link
              to="/admin/jobs"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-satoshi"
            >
              Manage Jobs <ArrowRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-white/5 pt-2">
            {allJobs.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <Briefcase size={32} className="text-slate-500 mx-auto opacity-50" />
                <p className="text-sm font-bold text-white font-satoshi">No Live Jobs Found</p>
                <p className="text-xs text-slate-400">No jobs have been posted on the platform yet.</p>
              </div>
            ) : (
              allJobs.slice(0, 5).map((job) => (
                <div key={job.id || Math.random()} className="py-3.5 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-white font-satoshi">{job.title || job.jobTitle}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {job.company || job.companyName || "Organization"} · {job.category || job.department || "Technology"} · {job.location || "Remote"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusChip status={job.jobStatus || job.status || "ACTIVE"} />
                    <Link
                      to={`/jobs/${job.id}`}
                      target="_blank"
                      className="text-xs font-bold text-indigo-400 hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>View</span>
                      <ExternalLink size={11} />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
