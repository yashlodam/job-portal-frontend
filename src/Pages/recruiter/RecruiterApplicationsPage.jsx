/**
 * src/Pages/recruiter/RecruiterApplicationsPage.jsx
 *
 * Applicant Management Page for Recruiters supporting:
 * - Candidate cards list
 * - Interactive stage updates (Applied -> Shortlisted -> Interview -> Offer -> Hired -> Rejected)
 * - Resume preview modal
 */

import React, { useState } from "react";
import { Search, Filter, Eye, CheckCircle2, XCircle, Calendar, Award, FileText, Sparkles, UserCheck } from "lucide-react";
import RecruiterLayout from "../../components/recruiter/layout/RecruiterLayout";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Avatar } from "../../components/ui/Avatar";
import { StatusChip } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { Tabs } from "../../components/ui/Tabs";

export default function RecruiterApplicationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const [applications, setApplications] = useState([
    {
      id: 101,
      candidateName: "Sarah Jenkins",
      email: "sarah.j@example.com",
      jobTitle: "Senior React Engineer",
      appliedDate: "Aug 3, 2026",
      matchScore: 94,
      status: "SHORTLISTED",
      resumeUrl: "https://pdfobject.com/pdf/sample.pdf",
      skills: ["React 19", "TypeScript", "Redux Toolkit", "Tailwind CSS"],
      experience: "6+ years",
    },
    {
      id: 102,
      candidateName: "Michael Chen",
      email: "m.chen@example.com",
      jobTitle: "Lead AI Architect",
      appliedDate: "Aug 2, 2026",
      matchScore: 88,
      status: "INTERVIEW",
      resumeUrl: "https://pdfobject.com/pdf/sample.pdf",
      skills: ["Python", "PyTorch", "LLMs", "FastAPI"],
      experience: "8+ years",
    },
    {
      id: 103,
      candidateName: "Alex Rivera",
      email: "alex.r@example.com",
      jobTitle: "Product Designer",
      appliedDate: "Aug 4, 2026",
      matchScore: 76,
      status: "APPLIED",
      resumeUrl: "https://pdfobject.com/pdf/sample.pdf",
      skills: ["Figma", "Design Systems", "Prototyping", "UX Research"],
      experience: "4+ years",
    },
  ]);

  const updateStatus = (id, newStatus) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
  };

  const tabs = [
    { id: "all", label: "All Applicants", count: applications.length },
    { id: "APPLIED", label: "New", count: applications.filter((a) => a.status === "APPLIED").length },
    { id: "SHORTLISTED", label: "Shortlisted", count: applications.filter((a) => a.status === "SHORTLISTED").length },
    { id: "INTERVIEW", label: "Interviewing", count: applications.filter((a) => a.status === "INTERVIEW").length },
  ];

  const filtered = applications.filter((app) => {
    const matchesSearch = app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) || app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab !== "all") return matchesSearch && app.status === activeTab;
    return matchesSearch;
  });

  return (
    <RecruiterLayout
      title="Candidate Applications"
      subtitle="Review, shortlist, and progress candidates through the hiring pipeline."
      breadcrumbs={[{ label: "Applications" }]}
    >
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Search */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates or jobs..."
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 focus:border-indigo-500/60 focus:outline-none"
          />
        </div>
      </Card>

      {/* Grid of Candidate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((app) => (
          <Card key={app.id} className="flex flex-col justify-between p-5 border-white/10 bg-[#090d16]/90 backdrop-blur-xl hover:border-indigo-500/40 transition-all duration-300 shadow-xl">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={app.candidateName} size="md" />
                  <div>
                    <h3 className="font-bold text-white font-satoshi text-base leading-tight">{app.candidateName}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{app.email}</p>
                  </div>
                </div>
                <StatusChip status={app.status} />
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Applied for:</span>
                  <span className="font-semibold text-white truncate max-w-[160px]">{app.jobTitle}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">AI Match Score:</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-400/30 px-2 py-0.5 text-[11px] font-extrabold text-amber-300">
                    <Sparkles className="h-3 w-3 text-amber-400 fill-amber-400/20 animate-pulse" /> {app.matchScore}% Match
                  </span>
                </div>
              </div>

              {/* Skills */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {app.skills.map((skill) => (
                  <span key={skill} className="rounded-lg bg-indigo-500/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions & ATS Stage Progression */}
            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCandidate(app);
                  setShowResumeModal(true);
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
              >
                <FileText className="h-3.5 w-3.5 text-indigo-400" /> Resume
              </button>

              <div className="flex items-center gap-1.5">
                {app.status === "APPLIED" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(app.id, "REVIEWING")}
                    className="px-2.5 py-1 rounded-xl border border-cyan-500/40 bg-cyan-500/15 text-cyan-300 text-xs font-bold hover:bg-cyan-500/25 transition cursor-pointer"
                  >
                    Review
                  </button>
                )}
                {(app.status === "APPLIED" || app.status === "REVIEWING") && (
                  <button
                    type="button"
                    onClick={() => updateStatus(app.id, "SHORTLISTED")}
                    className="px-2.5 py-1 rounded-xl border border-indigo-500/40 bg-indigo-500/15 text-indigo-300 text-xs font-bold hover:bg-indigo-500/25 transition cursor-pointer"
                  >
                    Shortlist
                  </button>
                )}
                {app.status === "SHORTLISTED" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(app.id, "INTERVIEW")}
                    className="px-2.5 py-1 rounded-xl border border-purple-500/40 bg-purple-500/15 text-purple-300 text-xs font-bold hover:bg-purple-500/25 transition cursor-pointer"
                  >
                    Interview
                  </button>
                )}
                {(app.status === "INTERVIEW" || app.status === "INTERVIEWING") && (
                  <button
                    type="button"
                    onClick={() => updateStatus(app.id, "OFFERED")}
                    className="px-2.5 py-1 rounded-xl border border-amber-500/40 bg-amber-500/15 text-amber-300 text-xs font-bold hover:bg-amber-500/25 transition cursor-pointer"
                  >
                    Extend Offer
                  </button>
                )}
                {app.status !== "REJECTED" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(app.id, "REJECTED")}
                    className="p-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
                    title="Reject Candidate"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Resume Preview Modal */}
      <Modal isOpen={showResumeModal} onClose={() => setShowResumeModal(false)} title={`Resume Preview - ${selectedCandidate?.candidateName}`} size="lg">
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <FileText className="h-16 w-16 text-indigo-400 mb-4 animate-bounce" />
          <h4 className="text-base font-bold text-white font-satoshi">{selectedCandidate?.candidateName}'s Resume</h4>
          <p className="text-xs text-white/50 mt-1">Applied for {selectedCandidate?.jobTitle}</p>
          <a
            href={selectedCandidate?.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 rounded-2xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-indigo-500 transition"
          >
            Open Full PDF Resume ↗
          </a>
        </div>
      </Modal>
    </RecruiterLayout>
  );
}
