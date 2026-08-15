/**
 * src/Pages/MyJobsPage.jsx
 *
 * User Candidate Workspace for My Jobs:
 * - Applied Jobs (live sync with applicationSlice / fetchMyApplicationsThunk)
 * - Saved Jobs (bookmarked jobs)
 * - Interviews (scheduled interview sessions)
 * - Offers (job offer letters & compensation)
 * - Professional Confirmation Modal for Application Withdrawals
 */

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Briefcase,
  Bookmark,
  Calendar,
  Award,
  Search,
  Filter,
  Eye,
  Trash2,
  ExternalLink,
  Sparkles,
  MapPin,
  Clock,
  Building2,
  FileText,
  XCircle,
  CheckCircle2,
  Star,
  AlertCircle,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../State/Store";
import { fetchMyApplicationsThunk, withdrawApplicationThunk } from "../State/applicationThunk";
import { fetchMySavedJobsThunk, unsaveJobThunk } from "../State/savedJobThunk";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { StatusChip } from "../components/ui/Badge";
import { Tabs } from "../components/ui/Tabs";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/LoadingSkeleton";
import { useToast } from "../components/ui/ToastNotification";
import RecommendedJobsSection from "../components/recommendation/RecommendedJobsSection";

const formatDate = (dateStr) => {
  if (!dateStr) return "Recently";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch (e) {
    return dateStr;
  }
};

export default function MyJobsPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { myApplications } = useAppSelector((state) => state.application);
  const { savedJobs: liveSavedJobs } = useAppSelector((state) => state.savedJob);
  const { recommendations } = useAppSelector((state) => state.recommendations);

  // Determine active tab from URL path
  const getTabFromPath = (path) => {
    if (path.includes("/recommended")) return "recommended";
    if (path.includes("/saved")) return "saved";
    if (path.includes("/interviews")) return "interviews";
    if (path.includes("/offers")) return "offers";
    return "applied";
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [withdrawTarget, setWithdrawTarget] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    dispatch(fetchMyApplicationsThunk());
    dispatch(fetchMySavedJobsThunk());
  }, [dispatch]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/my-jobs/${tabId}`);
  };

  const toast = useToast();

  const handleConfirmWithdraw = async () => {
    if (!withdrawTarget) return;
    const appId = withdrawTarget.id || withdrawTarget.applicationId;
    const title = withdrawTarget.jobTitle || withdrawTarget.job?.title || "Position";
    
    setWithdrawing(true);
    try {
      await dispatch(withdrawApplicationThunk(appId)).unwrap();
      toast.success(`Application for "${title}" withdrawn successfully.`);
      setWithdrawTarget(null);
    } catch (err) {
      toast.error(err || "Failed to withdraw application. Please try again.");
    } finally {
      setWithdrawing(false);
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      await dispatch(unsaveJobThunk(jobId)).unwrap();
      toast.info("Job removed from saved bookmarks.");
    } catch (err) {
      toast.error(err || "Failed to unsave job.");
    }
  };

  const savedJobs = liveSavedJobs || [];

  // Interviews Mock
  const interviewList = [
    {
      id: 301,
      title: "Senior React Engineer",
      company: "TechNova Solutions",
      interviewer: "Sarah Connor (Lead Recruiter)",
      date: "Aug 6, 2026",
      time: "2:00 PM - 3:00 PM EST",
      mode: "Google Meet",
      link: "https://meet.google.com/abc-defg-hij",
    },
  ];

  // Offers Mock
  const offerList = [
    {
      id: 401,
      title: "Lead Frontend Architect",
      company: "Vercel",
      compensation: "$175,000 + Stock Options",
      startDate: "Sept 1, 2026",
      status: "OFFER",
      validUntil: "Aug 15, 2026",
    },
  ];

  const filteredApplications = myApplications.filter((app) => {
    const title = app.jobTitle || app.job?.title || "";
    const company = app.companyName || app.company || "";
    const status = app.status || "";
    const query = searchQuery.toLowerCase();
    return (
      title.toLowerCase().includes(query) ||
      company.toLowerCase().includes(query) ||
      status.toLowerCase().includes(query)
    );
  });

  const TABS_CONFIG = [
    { id: "applied", label: "Applied Jobs", count: myApplications?.length || 0 },
    { id: "recommended", label: "Recommended ✨", count: recommendations?.length || 0 },
    { id: "saved", label: "Saved Jobs", count: savedJobs?.length || 0 },
    { id: "interviews", label: "Interviews", count: interviewList?.length || 0 },
    { id: "offers", label: "Offers Received", count: offerList?.length || 0 },
  ];

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-200 font-inter py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Title Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-400 mb-2">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Career Pipeline Workspace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-satoshi tracking-tight">
              My Job Applications
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Track status, scheduled interviews, and active job opportunities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/find-jobs"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all"
            >
              <Search className="h-4 w-4" />
              <span>Browse New Jobs</span>
            </Link>
          </div>
        </div>

        {/* Global Pipeline Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border border-indigo-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Applied</span>
              <Briefcase className="h-4 w-4 text-indigo-400" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-white font-satoshi">{myApplications.length}</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-950/40 to-slate-900/60 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Saved Jobs</span>
              <Bookmark className="h-4 w-4 text-purple-400" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-white font-satoshi">{savedJobs.length}</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-teal-950/40 to-slate-900/60 border border-teal-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Interviews</span>
              <Calendar className="h-4 w-4 text-teal-400" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-white font-satoshi">{interviewList.length}</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-amber-950/40 to-slate-900/60 border border-amber-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Offers</span>
              <Award className="h-4 w-4 text-amber-400" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-white font-satoshi">{offerList.length}</p>
          </Card>
        </div>

        {/* Tab Selection & Search Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <Tabs
            tabs={TABS_CONFIG}
            activeTab={activeTab}
            onChange={handleTabChange}
          />

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by role, company, status…"
              className="w-full rounded-2xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* TAB 1: APPLIED JOBS */}
        {activeTab === "applied" && (
          <div>
            {filteredApplications.length === 0 ? (
              <EmptyState
                title="No Applications Found"
                description={
                  searchQuery
                    ? "No applied jobs match your search query."
                    : "You haven't applied for any jobs yet. Start exploring open positions!"
                }
                action={
                  <Link
                    to="/find-jobs"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:scale-105 transition"
                  >
                    <Search className="h-4 w-4" /> Explore Open Roles
                  </Link>
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApplications.map((app) => (
                  <Card key={app.id || app.applicationId} className="p-5 flex flex-col justify-between hover:border-indigo-500/40 transition-all group">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-black text-lg">
                            {(app.jobTitle || app.companyName || "J").charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-white font-satoshi text-base">{app.jobTitle || "Job Position"}</h3>
                            <p className="text-xs text-slate-400">{app.companyName || "Company"}</p>
                          </div>
                        </div>
                        <StatusChip status={app.status || "APPLIED"} />
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 space-y-2 text-xs text-slate-400">
                        <div className="flex items-center justify-between">
                          <span>Applied Date:</span>
                          <span className="font-medium text-white">{formatDate(app.appliedAt || app.appliedDate || app.createdAt)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Application ID:</span>
                          <span className="font-mono text-indigo-300">#{app.id || app.applicationId}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" /> Details
                      </button>

                      <button
                        onClick={() => setWithdrawTarget(app)}
                        className="flex items-center gap-1 text-xs font-semibold text-rose-400 hover:text-rose-300 transition cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Withdraw
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: RECOMMENDED JOBS */}
        {activeTab === "recommended" && (
          <RecommendedJobsSection showHeading={false} />
        )}

        {/* Tab 2: SAVED JOBS */}
        {activeTab === "saved" && (
          <div>
            {savedJobs.length === 0 ? (
              <EmptyState
                title="No Saved Jobs"
                description="You haven't bookmarked any jobs yet. Save jobs to apply later."
                action={
                  <Link
                    to="/find-jobs"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:scale-105 transition"
                  >
                    <Search className="h-4 w-4" /> Explore Open Jobs
                  </Link>
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedJobs.map((item) => {
                  const job = item.job || item;
                  const jobId = job.id || item.jobId || item.id;
                  const title = job.jobTitle || job.title || "Position";
                  const company = job.companyName || job.company || "Company";
                  const location = [job.city, job.state].filter(Boolean).join(", ") || job.location || "Remote";
                  const salary = job.minimumSalary ? `₹${job.minimumSalary.toLocaleString()} - ₹${job.maximumSalary.toLocaleString()}` : job.salary || "";

                  return (
                    <Card key={jobId} className="p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-bold text-white font-satoshi text-lg">{title}</h3>
                            <p className="text-xs text-indigo-400 font-semibold mt-0.5">{company}</p>
                          </div>
                          <button
                            onClick={() => handleUnsaveJob(jobId)}
                            className="flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 text-[11px] font-bold text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" /> Unsave
                          </button>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/5 space-y-2 text-xs text-slate-400">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-slate-500" /> {location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-3.5 w-3.5 text-slate-500" /> {job.jobType || "Full Time"} {salary && `· ${salary}`}
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                        <Link
                          to={`/jobs/${jobId}`}
                          className="text-xs font-semibold text-slate-400 hover:text-white transition"
                        >
                          View Job Details →
                        </Link>

                        <Link
                          to="/apply-jobs"
                          state={{ job }}
                          className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition"
                        >
                          Apply Now
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: INTERVIEWS */}
        {activeTab === "interviews" && (
          <div className="space-y-6">
            {interviewList.map((interview) => (
              <Card key={interview.id} className="p-6 bg-[#0c1222]/90 border border-teal-500/30">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/15 border border-teal-500/30 px-3 py-1 text-xs font-bold text-teal-300">
                      <Calendar className="h-3.5 w-3.5" /> Scheduled Video Interview
                    </div>
                    <h3 className="text-xl font-bold text-white font-satoshi">{interview.title}</h3>
                    <p className="text-xs text-indigo-400 font-semibold">{interview.company} • Interviewer: {interview.interviewer}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-2 pt-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{interview.date} at {interview.time}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={interview.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:scale-105 transition"
                    >
                      <span>Join Interview Call</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 4: OFFERS */}
        {activeTab === "offers" && (
          <div className="space-y-6">
            {offerList.map((offer) => (
              <Card key={offer.id} className="p-6 bg-[#0c1222]/90 border border-amber-500/30">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-300">
                      <Award className="h-3.5 w-3.5" /> Official Offer Extended
                    </div>
                    <h3 className="text-xl font-bold text-white font-satoshi">{offer.title}</h3>
                    <p className="text-xs text-indigo-400 font-semibold">{offer.company} • Compensation: {offer.compensation}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-2 pt-1">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>Expected Start Date: {offer.startDate} (Valid until {offer.validUntil})</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toast.success("Offer accepted! Our onboarding team will connect with you.")}
                      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:scale-105 transition cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Accept Offer</span>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          WITHDRAW CONFIRMATION ALERT MODAL (Ultra-Premium & Production Ready)
         ───────────────────────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={Boolean(withdrawTarget)}
        onClose={() => !withdrawing && setWithdrawTarget(null)}
        title=""
        size="md"
      >
        {withdrawTarget && (
          <div className="p-6 text-center space-y-5">
            {/* Warning Icon Badge */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-xl shadow-rose-500/20">
              <AlertTriangle size={28} />
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white font-satoshi">
                Withdraw Job Application?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
                Are you sure you want to withdraw your application for{" "}
                <span className="font-bold text-white">
                  {withdrawTarget.jobTitle || withdrawTarget.job?.title || "this position"}
                </span>{" "}
                at{" "}
                <span className="font-bold text-indigo-300">
                  {withdrawTarget.companyName || withdrawTarget.company || withdrawTarget.job?.company || "the company"}
                </span>?
              </p>
            </div>

            {/* Alert Callout Note */}
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-left text-xs text-rose-200/90 leading-relaxed flex items-start gap-2.5">
              <AlertCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
              <span>
                <strong>Please Note:</strong> This action cannot be undone. The hiring recruiter will be notified of your withdrawal, and you will need to submit a new application if you change your mind.
              </span>
            </div>

            {/* Application Metadata Preview */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 text-xs text-slate-400 text-left space-y-2">
              <div className="flex justify-between">
                <span>Application ID:</span>
                <span className="font-mono text-indigo-300 font-bold">
                  #{withdrawTarget.id || withdrawTarget.applicationId}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Applied On:</span>
                <span className="text-white font-semibold">
                  {formatDate(withdrawTarget.appliedAt || withdrawTarget.appliedDate || withdrawTarget.createdAt)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={withdrawing}
                onClick={() => setWithdrawTarget(null)}
                className="h-11 rounded-xl border border-white/10 bg-white/5 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer disabled:opacity-50"
              >
                Keep Application
              </button>

              <button
                type="button"
                disabled={withdrawing}
                onClick={handleConfirmWithdraw}
                className="h-11 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-xs font-bold text-white shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                {withdrawing ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Withdrawing…</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Yes, Withdraw</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ─────────────────────────────────────────────────────────────────────────────
          APPLICATION DETAILS MODAL
         ───────────────────────────────────────────────────────────────────────────── */}
      <Modal
        isOpen={Boolean(selectedApp)}
        onClose={() => setSelectedApp(null)}
        title="Application Details & Timeline"
        size="lg"
      >
        {selectedApp && (
          <div className="p-6 space-y-6">
            {/* Header with Title & Company */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white font-satoshi">
                  {selectedApp.jobTitle || "Job Position"}
                </h3>
                <p className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{selectedApp.companyName || "Company Name"}</span>
                </p>
              </div>
              <StatusChip status={selectedApp.status || "APPLIED"} />
            </div>

            {/* Dynamic Application Pipeline */}
            {(() => {
              const currentStatus = (selectedApp.status || "APPLIED").toUpperCase();
              const isRejected = currentStatus === "REJECTED";
              const isWithdrawn = currentStatus === "WITHDRAWN";

              const STAGES = [
                {
                  id: "APPLIED",
                  label: "Application Submitted",
                  desc: "Your profile and resume were submitted successfully.",
                  icon: FileText,
                },
                {
                  id: "REVIEWING",
                  label: "Recruiter Review",
                  desc: "The hiring manager is reviewing your qualifications.",
                  icon: Eye,
                },
                {
                  id: "SHORTLISTED",
                  label: "Shortlisted",
                  desc: "Selected for the interview candidate pool.",
                  icon: Star,
                },
                {
                  id: "INTERVIEWING",
                  label: "Interviewing",
                  desc: "Interviews scheduled with hiring team.",
                  icon: Clock,
                },
                {
                  id: currentStatus === "ACCEPTED" ? "ACCEPTED" : "OFFERED",
                  label: currentStatus === "ACCEPTED" ? "Offer Accepted 🎉" : "Offer Extended 🏆",
                  desc: currentStatus === "ACCEPTED" ? "Congratulations! Onboarding in progress." : "Official job offer sent to candidate.",
                  icon: Award,
                },
              ];

              const statusOrder = ["APPLIED", "REVIEWING", "SHORTLISTED", "INTERVIEWING", "OFFERED", "ACCEPTED"];
              const activeIndex = statusOrder.indexOf(currentStatus);

              if (isRejected || isWithdrawn) {
                return (
                  <div className={`p-4 rounded-2xl border ${isRejected ? "border-rose-500/30 bg-rose-500/10 text-rose-300" : "border-amber-500/30 bg-amber-500/10 text-amber-300"} space-y-1.5`}>
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{isRejected ? "Application Status: Not Selected" : "Application Status: Withdrawn"}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isRejected
                        ? "Thank you for taking the time to apply. The hiring team decided to proceed with other candidates whose experience aligns more closely with this specific role."
                        : "You withdrew your application for this position. If you have questions, contact candidate support."}
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-3 rounded-2xl border border-white/10 bg-[#090d16] p-4 sm:p-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs font-bold text-white font-satoshi uppercase tracking-wider">
                      Application Progress Pipeline
                    </span>
                    <span className="text-[11px] font-bold text-indigo-400">
                      Stage {Math.max(1, activeIndex + 1)} of {STAGES.length}
                    </span>
                  </div>

                  <div className="space-y-4 pt-2">
                    {STAGES.map((stage, idx) => {
                      const isCompleted = activeIndex > idx || currentStatus === "ACCEPTED";
                      const isCurrent = activeIndex === idx && currentStatus !== "ACCEPTED";
                      const IconComp = stage.icon;

                      return (
                        <div key={stage.id} className="flex items-start gap-3 relative">
                          {/* Connector Line */}
                          {idx < STAGES.length - 1 && (
                            <div
                              className={`absolute left-4 top-8 bottom-0 w-0.5 -mb-4 transition-colors ${
                                isCompleted ? "bg-emerald-500" : "bg-white/10"
                              }`}
                            />
                          )}

                          {/* Node Icon */}
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all z-10 ${
                              isCompleted
                                ? "border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                                : isCurrent
                                ? "border-amber-400 bg-amber-500/20 text-amber-300 ring-4 ring-amber-500/10 shadow-md shadow-amber-500/20"
                                : "border-white/10 bg-white/5 text-slate-500"
                            }`}
                          >
                            <IconComp className="h-4 w-4" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex items-center justify-between">
                              <h5
                                className={`text-xs font-bold ${
                                  isCompleted
                                    ? "text-emerald-400"
                                    : isCurrent
                                    ? "text-amber-300"
                                    : "text-slate-400"
                                }`}
                              >
                                {stage.label}
                              </h5>
                              {isCurrent && (
                                <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[9px] font-extrabold text-amber-300 animate-pulse">
                                  Current Stage
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{stage.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Details Grid */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
              <h5 className="font-bold text-white text-xs font-satoshi uppercase tracking-wider">
                Application Metadata
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-slate-400">Application ID:</span>
                  <span className="font-mono text-indigo-300 font-bold">#{selectedApp.id || selectedApp.applicationId || "101"}</span>
                </div>

                <div className="flex justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-slate-400">Applied On:</span>
                  <span className="text-white font-semibold">
                    {formatDate(selectedApp.appliedAt || selectedApp.appliedDate || selectedApp.createdAt)}
                  </span>
                </div>
              </div>

              {/* Cover letter section */}
              {selectedApp.coverLetter && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-300 block mb-1.5">Submitted Cover Letter:</span>
                  <div className="p-3.5 rounded-xl bg-[#080c16] border border-white/10 text-slate-300 leading-relaxed max-h-36 overflow-y-auto font-mono text-[11px]">
                    {selectedApp.coverLetter}
                  </div>
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedApp(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
