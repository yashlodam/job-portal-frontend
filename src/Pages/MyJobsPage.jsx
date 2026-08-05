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
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { StatusChip } from "../components/ui/Badge";
import { Tabs } from "../components/ui/Tabs";
import { Modal } from "../components/ui/Modal";
import { EmptyState } from "../components/ui/LoadingSkeleton";

export default function MyJobsPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { myApplications, loading } = useAppSelector((state) => state.application);

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

  // Saved Jobs Mock/Fallback if state empty
  const savedJobs = [
    {
      id: 201,
      title: "Senior Full Stack Engineer",
      company: "Stripe",
      location: "San Francisco, CA (Hybrid)",
      type: "Full Time",
      salary: "$160,000 - $190,000",
      savedDate: "Aug 2, 2026",
    },
    {
      id: 202,
      title: "Staff AI Product Manager",
      company: "OpenAI",
      location: "Remote",
      type: "Full Time",
      salary: "$180,000 - $220,000",
      savedDate: "Aug 4, 2026",
    },
  ];

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
                          <span className="font-medium text-white">{app.appliedDate || app.createdAt || "Recently"}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedJobs.map((job) => (
              <Card key={job.id} className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-white font-satoshi text-lg">{job.title}</h3>
                      <p className="text-xs text-indigo-400 font-semibold">{job.company}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                      Saved {job.savedDate}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 space-y-2 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" /> {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-3.5 w-3.5 text-slate-500" /> {job.type} · {job.salary}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="text-xs font-semibold text-slate-400 hover:text-white transition"
                  >
                    View Description →
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
            ))}
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
              <span className="text-white font-medium">{selectedApp?.appliedDate || selectedApp?.createdAt || "Recently"}</span>
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
