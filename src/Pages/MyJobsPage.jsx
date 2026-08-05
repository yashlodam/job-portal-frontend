/**
 * src/Pages/MyJobsPage.jsx
 *
 * User Candidate Workspace for My Jobs:
 * - Applied Jobs (live sync with applicationSlice / fetchMyApplicationsThunk)
 * - Saved Jobs (bookmarked jobs)
 * - Interviews (scheduled interview sessions)
 * - Offers (job offer letters & compensation)
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
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../State/Store";
import { fetchMyApplicationsThunk, withdrawApplicationThunk } from "../State/applicationThunk";
import { fetchMySavedJobsThunk, unsaveJobThunk } from "../State/savedJobThunk";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { StatusChip } from "../components/ui/Badge";
import { Tabs } from "../components/ui/Tabs";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/LoadingSkeleton";

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

  // Determine active tab from URL path
  const getTabFromPath = (path) => {
    if (path.includes("/saved")) return "saved";
    if (path.includes("/interviews")) return "interviews";
    if (path.includes("/offers")) return "offers";
    return "applied";
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);

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

  const handleWithdraw = (appId) => {
    if (window.confirm("Are you sure you want to withdraw this application?")) {
      dispatch(withdrawApplicationThunk(appId));
    }
  };

  const handleUnsaveJob = (jobId) => {
    dispatch(unsaveJobThunk(jobId));
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

  const tabs = [
    { id: "applied", label: "Applied Jobs", count: myApplications.length, icon: Briefcase },
    { id: "saved", label: "Saved Jobs", count: savedJobs.length, icon: Bookmark },
    { id: "interviews", label: "Interviews", count: interviewList.length, icon: Calendar },
    { id: "offers", label: "Offers", count: offerList.length, icon: Award },
  ];

  return (
    <div className="min-h-screen bg-[#06080F] py-10 px-4 sm:px-6 lg:px-8 text-white font-inter">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Title */}
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-400 mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Candidate Career Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-satoshi tracking-tight">
            My Job <span className="gradient-text">Workspace</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Track active applications, review saved roles, manage upcoming interviews, and accept job offers.
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

        {/* Toolbar Search */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by job title or company..."
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:border-indigo-500/60 focus:outline-none"
              />
            </div>
            <span className="text-xs text-slate-400">
              Showing active <span className="font-bold text-white">{activeTab}</span> items
            </span>
          </div>
        </Card>

        {/* Tab 1: APPLIED JOBS */}
        {activeTab === "applied" && (
          <div>
            {myApplications.length === 0 ? (
              <EmptyState
                title="No Job Applications Yet"
                description="You haven't submitted any job applications yet. Browse open roles and apply with 1 click."
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myApplications.map((app) => (
                  <Card key={app.id || app.applicationId} className="p-5 flex flex-col justify-between">
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
                        onClick={() => handleWithdraw(app.id || app.applicationId)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interviewList.map((item) => (
              <Card key={item.id} className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 font-bold">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white font-satoshi text-base">{item.title}</h3>
                      <p className="text-xs text-slate-400">{item.company}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Date & Time:</span>
                      <span className="font-bold text-indigo-300">{item.date} · {item.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Interviewer:</span>
                      <span>{item.interviewer}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    CONFIRMED
                  </span>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition"
                  >
                    Join {item.mode} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 4: OFFERS */}
        {activeTab === "offers" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offerList.map((offer) => (
              <Card key={offer.id} className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-white font-satoshi text-xl">{offer.title}</h3>
                    <p className="text-xs text-indigo-400 font-bold">{offer.company}</p>
                  </div>
                  <StatusChip status={offer.status} />
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Compensation:</span>
                    <span className="font-bold text-emerald-400 text-sm">{offer.compensation}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Target Start Date:</span>
                    <span className="font-semibold text-white">{offer.startDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Offer Valid Until:</span>
                    <span className="font-semibold text-amber-400">{offer.validUntil}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10">
                    Decline Offer
                  </button>
                  <button className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-xs font-bold text-white shadow-lg hover:scale-105 transition">
                    Accept Job Offer 🎉
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      <Modal isOpen={Boolean(selectedApp)} onClose={() => setSelectedApp(null)} title="Application Details">
        <div className="space-y-4 text-xs">
          <div>
            <h4 className="font-bold text-white text-sm">{selectedApp?.jobTitle || "Job Position"}</h4>
            <p className="text-slate-400">{selectedApp?.companyName || "Company"}</p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <StatusChip status={selectedApp?.status || "APPLIED"} />
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Applied On:</span>
              <span className="text-white font-medium">{formatDate(selectedApp?.appliedAt || selectedApp?.appliedDate || selectedApp?.createdAt)}</span>
            </div>
          </div>

          {selectedApp?.coverLetter && (
            <div>
              <p className="font-semibold text-slate-300 mb-1">Submitted Cover Letter:</p>
              <p className="p-3 rounded-xl bg-white/5 text-slate-400 leading-relaxed max-h-40 overflow-y-auto">
                {selectedApp.coverLetter}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
