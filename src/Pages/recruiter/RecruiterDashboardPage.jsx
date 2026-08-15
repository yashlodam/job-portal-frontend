/**
 * src/Pages/recruiter/RecruiterDashboardPage.jsx
 *
 * Recruiter Dashboard Page:
 * - If recruiter is APPROVED / VERIFIED: renders full real-time KPIs, active jobs, pipeline.
 * - If recruiter is PENDING_VERIFICATION, REJECTED, or SUSPENDED: renders limited PendingRecruiterDashboard.
 */

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, ArrowRight, Briefcase, Sparkles, AlertCircle, ShieldAlert } from "lucide-react";
import RecruiterLayout from "../../components/recruiter/layout/RecruiterLayout";
import DashboardKpis from "../../components/recruiter/dashboard/DashboardKpis";
import { RecentActivityWidget, HiringFunnelWidget } from "../../components/recruiter/dashboard/RecentActivityWidget";
import PendingRecruiterDashboard from "../../components/recruiter/verification/PendingRecruiterDashboard";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { StatusChip } from "../../components/ui/Badge";
import { useAppDispatch, useAppSelector } from "../../State/Store";
import { getMyJobs } from "../../State/JobSlice";
import { fetchVerificationStatus } from "../../State/verificationSlice";

export default function RecruiterDashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.profile);
  const { recruiterVerification } = useAppSelector((state) => state.verification);
  const { myJobs = [], loading } = useAppSelector((state) => state.job);

  const verificationStatus =
    recruiterVerification?.status ||
    recruiterVerification?.data?.status ||
    user?.verificationStatus ||
    user?.status ||
    "PENDING_VERIFICATION";

  const isApproved =
    verificationStatus.toUpperCase() === "APPROVED" ||
    verificationStatus.toUpperCase() === "VERIFIED";

  useEffect(() => {
    dispatch(fetchVerificationStatus());
    if (isApproved) {
      dispatch(getMyJobs());
    }
  }, [dispatch, isApproved]);

  const getApplicantsCount = (job) => {
    if (job.applicantsCount != null) return job.applicantsCount;
    if (job.applicationsCount != null) return job.applicationsCount;
    if (job.totalApplicants != null) return job.totalApplicants;
    if (job.totalApplications != null) return job.totalApplications;
    if (Array.isArray(job.applications)) return job.applications.length;
    if (Array.isArray(job.jobApplications)) return job.jobApplications.length;
    return 0;
  };

  const stats = {
    activeJobs: myJobs.length,
    featuredJobs: myJobs.filter((j) => (j.jobStatus || j.status) === "FEATURED" || j.featured).length,
    totalApplications: myJobs.reduce((acc, j) => acc + getApplicantsCount(j), 0),
    newApplications: 0,
    interviews: 0,
    hired: 0,
  };

  // If recruiter is NOT approved, render the limited Pending Dashboard
  if (!isApproved) {
    return (
      <RecruiterLayout
        title={`Welcome, ${user?.name?.split(" ")[0] ?? "Recruiter"}`}
        subtitle="Manage your organization verification status and compliance profile."
        action={
          <Link
            to="/recruiter/verification"
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-indigo-500 transition cursor-pointer font-satoshi"
          >
            <Sparkles size={15} />
            <span>Verification Center</span>
          </Link>
        }
      >
        <PendingRecruiterDashboard />
      </RecruiterLayout>
    );
  }

  // Full Normal Recruiter Dashboard for Approved Recruiters
  return (
    <RecruiterLayout
      title={`Welcome Back, ${user?.name?.split(" ")[0] ?? "Recruiter"}!`}
      subtitle="Here is your real-time candidate pipeline and active hiring snapshot for today."
      action={
        <Link
          to="/upload-job"
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-2.5 text-xs font-black text-white shadow-lg hover:scale-105 transition cursor-pointer font-satoshi"
        >
          <Plus size={16} />
          <span>Post New Role</span>
        </Link>
      }
    >
      {/* Real-Time KPIs */}
      <DashboardKpis stats={stats} />

      {/* Grid: Active Jobs Teaser + Hiring Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Jobs & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Jobs Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle className="flex items-center gap-2 font-satoshi text-base font-black text-white">
                  <Briefcase size={18} className="text-indigo-400" />
                  Active Job Postings ({myJobs.length})
                </CardTitle>
                <Link to="/recruiter/jobs" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-satoshi">
                  View all postings <ArrowRight size={14} />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-3">
              {myJobs.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <AlertCircle size={36} className="text-indigo-400 opacity-60 mx-auto" />
                  <h4 className="text-sm font-extrabold text-white font-satoshi">No Active Jobs Posted Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    You haven't posted any jobs yet. Create your first job listing to start receiving candidate applications.
                  </p>
                  <Link
                    to="/upload-job"
                    className="inline-flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-4 py-2 text-xs font-black text-white shadow hover:bg-indigo-500 transition font-satoshi mt-2"
                  >
                    <Plus size={14} /> Create Job Post
                  </Link>
                </div>
              ) : (
                myJobs.slice(0, 4).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-white font-satoshi">{job.title || job.jobTitle}</h4>
                        <StatusChip status={job.jobStatus || job.status || "ACTIVE"} />
                      </div>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">{job.category || job.department || "Engineering"} · Posted {job.postedAt || "Recently"}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-extrabold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full font-satoshi">
                        {getApplicantsCount(job)} Applicants
                      </span>
                      <Link to="/recruiter/jobs" className="text-xs font-bold text-slate-300 hover:text-white transition">
                        Manage →
                      </Link>
                    </div>
                  </div>
                ))
              )}
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
