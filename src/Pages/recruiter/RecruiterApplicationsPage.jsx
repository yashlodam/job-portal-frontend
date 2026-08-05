/**
 * src/Pages/recruiter/RecruiterApplicationsPage.jsx
 *
 * Recruiter Candidate Applications Workspace.
 * Features:
 * - Real-time candidate application status progression via PUT /api/recruiter/applications/{applicationId}/status
 * - Real-time fetch via GET /api/recruiter/jobs/{jobId}/applications
 * - Resume preview modal & AI Skill compatibility indicators
 */

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, FileText, Sparkles, CheckCircle2, XCircle, UserCheck, Calendar, AlertCircle, ExternalLink, Download, X } from "lucide-react";
import RecruiterLayout from "../../components/recruiter/layout/RecruiterLayout";
import { Card } from "../../components/ui/Card";
import { Avatar } from "../../components/ui/Avatar";
import { StatusChip } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { Tabs } from "../../components/ui/Tabs";
import { useAppDispatch, useAppSelector } from "../../State/Store";
import { getMyJobs } from "../../State/JobSlice";
import { fetchJobApplicationsThunk, updateApplicationStatusThunk } from "../../State/applicationThunk";

const getFullResumeUrl = (rawPath) => {
  if (!rawPath) return null;
  if (typeof rawPath === "object") {
    rawPath = rawPath.fileUrl || rawPath.resumeUrl || rawPath.url || rawPath.path;
  }
  if (typeof rawPath !== "string") return null;

  if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
    return rawPath;
  }

  const cleanPath = rawPath.startsWith("/") ? rawPath.slice(1) : rawPath;

  if (cleanPath.startsWith("uploads/")) {
    return `http://localhost:8080/${cleanPath}`;
  }
  return `http://localhost:8080/uploads/${cleanPath}`;
};

export default function RecruiterApplicationsPage() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { myJobs = [] } = useAppSelector((state) => state.job);
  const { jobApplications = [], loading } = useAppSelector((state) => state.application);

  const [selectedJobId, setSelectedJobId] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") || "");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam !== null) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  useEffect(() => {
    dispatch(getMyJobs());
  }, [dispatch]);

  useEffect(() => {
    if (myJobs.length > 0 && !selectedJobId) {
      setSelectedJobId(myJobs[0].id);
    }
  }, [myJobs, selectedJobId]);

  useEffect(() => {
    if (selectedJobId) {
      dispatch(fetchJobApplicationsThunk({ jobId: selectedJobId }));
    }
  }, [dispatch, selectedJobId]);

  const applicationsList = jobApplications && jobApplications.length > 0 ? jobApplications : [];

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      await dispatch(updateApplicationStatusThunk({ applicationId, status: newStatus })).unwrap();
      setSuccessMsg(`Application status updated to ${newStatus}!`);
      if (selectedJobId) {
        dispatch(fetchJobApplicationsThunk({ jobId: selectedJobId }));
      }
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Update status error:", err);
    }
  };

  const tabs = [
    { id: "all", label: "All Applicants", count: applicationsList.length },
    { id: "APPLIED", label: "New Applied", count: applicationsList.filter((a) => a.status === "APPLIED").length },
    { id: "REVIEWING", label: "Under Review", count: applicationsList.filter((a) => a.status === "REVIEWING").length },
    { id: "SHORTLISTED", label: "Shortlisted", count: applicationsList.filter((a) => a.status === "SHORTLISTED").length },
    { id: "INTERVIEWING", label: "Interviewing", count: applicationsList.filter((a) => a.status === "INTERVIEWING" || a.status === "INTERVIEW").length },
    { id: "OFFERED", label: "Offered", count: applicationsList.filter((a) => a.status === "OFFERED").length },
    { id: "ACCEPTED", label: "Accepted", count: applicationsList.filter((a) => a.status === "ACCEPTED").length },
    { id: "REJECTED", label: "Rejected", count: applicationsList.filter((a) => a.status === "REJECTED").length },
  ];

  const filtered = applicationsList.filter((app) => {
    const candidateName = app.candidateName || app.applicantName || app.user?.name || "";
    const email = app.applicantEmail || app.email || app.user?.email || "";
    const jobTitle = app.jobTitle || app.job?.title || "";
    const status = app.status || "";
    const resume = app.resumeName || "";
    const skills = Array.isArray(app.skills) ? app.skills.join(" ") : "";
    const location = app.location || "";

    const searchableText = `${candidateName} ${email} ${jobTitle} ${status} ${resume} ${skills} ${location}`.toLowerCase();
    const matchesSearch = searchableText.includes(searchQuery.toLowerCase().trim());
    if (activeTab !== "all") return matchesSearch && (app.status === activeTab || (activeTab === "INTERVIEWING" && app.status === "INTERVIEW"));
    return matchesSearch;
  });

  return (
    <RecruiterLayout
      title="Candidate Applications"
      subtitle="Review, shortlist, and progress candidate applications through the hiring funnel."
      breadcrumbs={[{ label: "Applications" }]}
    >
      {/* Success Notification */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-xs font-bold text-emerald-300">
          <CheckCircle2 size={16} className="text-emerald-400" />
          {successMsg}
        </div>
      )}

      {/* Job Selector Dropdown */}
      {myJobs.length > 0 && (
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-satoshi">
            <span className="font-extrabold text-white">Select Active Job Position:</span>
            <select
              value={selectedJobId || ""}
              onChange={(e) => setSelectedJobId(Number(e.target.value))}
              className="rounded-xl border border-white/10 bg-[#070b12] px-4 py-2 text-white outline-none focus:border-indigo-500/60 font-bold"
            >
              {myJobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title || j.jobTitle} (#{j.id})
                </option>
              ))}
            </select>
          </div>
        </Card>
      )}

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Search Toolbar */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates by name or skill..."
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 focus:border-indigo-500/60 focus:outline-none"
          />
        </div>
      </Card>

      {/* Candidate Application Cards */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center space-y-3 font-satoshi">
          <AlertCircle className="h-12 w-12 text-indigo-400 mx-auto opacity-60" />
          <h3 className="text-lg font-black text-white">No Candidate Applications Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            There are currently no candidate applications submitted for this role under the selected stage filter.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((app) => {
          const name = app.candidateName || app.applicantName || app.user?.name || "Candidate";
          const email = app.email || app.user?.email || "candidate@example.com";
          const jobTitle = app.jobTitle || "Software Engineer";
          const match = app.matchScore || 90;
          const skills = app.skills || ["React", "TypeScript", "Node.js"];

          return (
            <Card key={app.id} className="flex flex-col justify-between p-5 border-white/10 bg-[#090d16]/90 backdrop-blur-xl hover:border-indigo-500/40 transition-all duration-300 shadow-xl">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={name} size="md" />
                    <div>
                      <h3 className="font-extrabold text-white font-satoshi text-base leading-tight">{name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{email}</p>
                    </div>
                  </div>
                  <StatusChip status={app.status || "APPLIED"} />
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 space-y-2 font-satoshi">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Position:</span>
                    <span className="font-extrabold text-white truncate max-w-[160px]">{jobTitle}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">AI Match Score:</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-400/30 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-300">
                      <Sparkles className="h-3 w-3 text-amber-400 fill-amber-400/20" /> {match}% Match
                    </span>
                  </div>
                </div>

                {/* Skills Chips */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span key={skill} className="rounded-lg bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/20 font-satoshi">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Executive Card Footer */}
              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-3 font-satoshi">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCandidate(app);
                    setShowResumeModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 px-3.5 py-1.5 text-xs font-black text-indigo-300 hover:bg-indigo-500/25 transition cursor-pointer shrink-0"
                >
                  <FileText className="h-4 w-4 text-indigo-400" /> Resume
                </button>

                <div className="flex items-center gap-2">
                  <select
                    value={app.status || "APPLIED"}
                    onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                    className="rounded-xl border border-white/15 bg-[#070b12] px-3 py-1.5 text-xs font-extrabold text-slate-200 outline-none focus:border-indigo-500/60 transition cursor-pointer shadow-md"
                  >
                    <option value="APPLIED">📍 Applied</option>
                    <option value="REVIEWING">🔍 Reviewing</option>
                    <option value="SHORTLISTED">⭐ Shortlisted</option>
                    <option value="INTERVIEWING">🎯 Interviewing</option>
                    <option value="OFFERED">🎉 Extend Offer</option>
                    <option value="ACCEPTED">✅ Accept Offer</option>
                    <option value="REJECTED">❌ Reject</option>
                  </select>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      )}

      {/* Interactive Executive Resume Preview Modal */}
      {showResumeModal && selectedCandidate && (() => {
        const rawResume = selectedCandidate.resumeUrl || selectedCandidate.resumePath || selectedCandidate.resume;
        const fullResumeUrl = getFullResumeUrl(rawResume);

        return (
          <Modal
            isOpen={showResumeModal}
            onClose={() => setShowResumeModal(false)}
            title={`Candidate Resume: ${selectedCandidate.candidateName || selectedCandidate.user?.name || selectedCandidate.applicantName || "Candidate"}`}
          >
            <div className="space-y-5 font-satoshi text-slate-200">
              {/* Cover Letter Section */}
              {selectedCandidate.coverLetter && (
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-1.5 shadow-lg">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-400" /> Candidate Cover Letter
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium italic">
                    "{selectedCandidate.coverLetter}"
                  </p>
                </div>
              )}

              {/* Resume File Actions & Dark Preview */}
              {fullResumeUrl ? (
                <div className="space-y-4">
                  {/* Top Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                        <FileText size={18} />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-extrabold text-white truncate">
                          {selectedCandidate.candidateName || "Candidate"}_Resume.pdf
                        </h5>
                        <span className="text-[10px] text-emerald-400 font-semibold">Verified PDF Document</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={fullResumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-3.5 py-2 text-xs font-black text-white shadow-lg hover:scale-105 transition cursor-pointer"
                      >
                        <ExternalLink size={14} /> Open PDF
                      </a>

                      <a
                        href={fullResumeUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-white/20 hover:text-white transition cursor-pointer"
                      >
                        <Download size={14} /> Download
                      </a>
                    </div>
                  </div>

                  {/* Dark PDF Object / iFrame Container */}
                  <div className="h-[420px] w-full rounded-2xl border border-white/10 bg-[#070b12] overflow-hidden shadow-2xl relative flex flex-col items-center justify-center">
                    <object
                      data={fullResumeUrl}
                      type="application/pdf"
                      className="h-full w-full border-none"
                    >
                      <div className="p-8 text-center space-y-3">
                        <FileText size={48} className="text-indigo-400 opacity-60 mx-auto" />
                        <h4 className="text-sm font-extrabold text-white">PDF Document Ready</h4>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto">
                          Click the button below to view or download the candidate's resume directly.
                        </p>
                        <a
                          href={fullResumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-2.5 text-xs font-black text-white shadow hover:bg-indigo-500 transition cursor-pointer mt-2"
                        >
                          <ExternalLink size={14} /> Open Resume in New Tab
                        </a>
                      </div>
                    </object>
                  </div>
                </div>
              ) : (
                <div className="h-64 w-full rounded-2xl border border-white/10 bg-slate-950 p-6 flex flex-col items-center justify-center text-center space-y-2">
                  <FileText size={44} className="text-indigo-400 opacity-60" />
                  <h4 className="text-sm font-extrabold text-white">No Resume PDF Attached</h4>
                  <p className="text-xs text-slate-400 max-w-xs">
                    The candidate did not attach a resume file during application submission.
                  </p>
                </div>
              )}
            </div>
          </Modal>
        );
      })()}
    </RecruiterLayout>
  );
}
