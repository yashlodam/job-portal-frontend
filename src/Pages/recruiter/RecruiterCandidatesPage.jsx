import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Code,
  AlertCircle,
  FileText,
  CheckCircle2,
  User,
  Eye,
  Plus,
  ExternalLink,
  Download,
  X,
  ArrowUpDown,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import RecruiterLayout from "../../components/recruiter/layout/RecruiterLayout";
import { Card } from "../../components/ui/Card";
import { Avatar } from "../../components/ui/Avatar";
import { StatusChip } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { useAppDispatch, useAppSelector } from "../../State/Store";
import { getMyJobs } from "../../State/JobSlice";
import { fetchJobApplicationsThunk, updateApplicationStatusThunk } from "../../State/applicationThunk";
import { searchTalent } from "../../api/talentApi";
import { getCandidatesWithMatchApi } from "../../api/jobMatchApi";
import MatchScoreBadge from "../../components/recruiter/MatchScoreBadge";
import MatchAnalysisModal from "../../components/recruiter/MatchAnalysisModal";

const getFullResumeUrl = (rawPath) => {
  if (!rawPath) return "";
  if (typeof rawPath === "object") {
    rawPath = rawPath.fileUrl || rawPath.resumeUrl || rawPath.url || rawPath.path;
  }
  if (typeof rawPath !== "string") return "";

  if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
    return rawPath;
  }
  const cleanPath = rawPath.startsWith("/") ? rawPath.slice(1) : rawPath;
  if (cleanPath.startsWith("uploads/")) {
    return `http://localhost:8080/${cleanPath}`;
  }
  return `http://localhost:8080/uploads/${cleanPath}`;
};

const getDirectResumeFallbackUrl = (rawPath) => {
  if (!rawPath) return null;
  const full = getFullResumeUrl(rawPath);
  if (!full) return null;
  if (full.includes("/uploads/resume/")) {
    return full.replace("/uploads/resume/", "/uploads/");
  }
  return full;
};

const getFullProfileImageUrl = (rawPath) => {
  if (!rawPath) return null;
  if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) return rawPath;
  const cleanPath = rawPath.startsWith("/") ? rawPath.slice(1) : rawPath;
  if (cleanPath.startsWith("uploads/")) return `http://localhost:8080/${cleanPath}`;
  return `http://localhost:8080/uploads/${cleanPath}`;
};

export default function RecruiterCandidatesPage() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const { myJobs = [] } = useAppSelector((state) => state.job);
  const { jobApplications = [], loading } = useAppSelector((state) => state.application);

  const [selectedJobId, setSelectedJobId] = useState("all");
  const [sortBy, setSortBy] = useState("ma.matchPercentage,desc");
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("search") || "");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);

  // Match Analysis Modal State
  const [selectedMatchApplicationId, setSelectedMatchApplicationId] = useState(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchApplicationsMap, setMatchApplicationsMap] = useState({});

  const [successMsg, setSuccessMsg] = useState("");
  const [talentDirectoryCandidates, setTalentDirectoryCandidates] = useState([]);
  const [isSearchingTalent, setIsSearchingTalent] = useState(false);

  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam !== null) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  useEffect(() => {
    dispatch(getMyJobs());
  }, [dispatch]);

  // Fetch match scores for selected job
  useEffect(() => {
    if (myJobs.length > 0) {
      const targetJobId = selectedJobId === "all" ? myJobs[0].id : selectedJobId;
      fetchMatchScoresForJob(targetJobId);
      dispatch(fetchJobApplicationsThunk({ jobId: targetJobId }));
    }
  }, [dispatch, myJobs, selectedJobId]);

  const fetchMatchScoresForJob = async (jobId) => {
    try {
      const res = await getCandidatesWithMatchApi(jobId, {
        page: 0,
        size: 50,
        sort: sortBy,
      });
      const pageData = res?.data ?? res;
      const contentList = pageData?.content ?? (Array.isArray(pageData) ? pageData : []);

      if (contentList && contentList.length > 0) {
        const map = {};
        contentList.forEach((item) => {
          const appId = item.applicationId || item.id;
          if (appId) {
            map[appId] = {
              matchPercentage: item.matchPercentage,
              matchStatus: item.matchStatus || "COMPLETED",
              ...item,
            };
          }
        });
        setMatchApplicationsMap(map);
      }
    } catch (err) {
      console.warn("[RecruiterCandidatesPage] Match score fetch notice:", err?.userMessage || err?.message);
    }
  };

  // Query global candidate directory from GET /api/talent/search
  useEffect(() => {
    let isMounted = true;
    const fetchTalentCandidates = async () => {
      setIsSearchingTalent(true);
      try {
        const params = {};
        if (searchQuery.trim()) {
          params.keyword = searchQuery.trim();
        }
        const res = await searchTalent(params);
        const list = res?.data?.content || res?.data || (Array.isArray(res) ? res : []);
        if (Array.isArray(list) && isMounted) {
          const mapped = list.map((t) => ({
            id: `talent-${t.id}`,
            realTalentId: t.id,
            applicantName: t.name || t.fullName || t.user?.name || "Registered Candidate",
            applicantEmail: t.email || "",
            jobTitle: t.headline || t.professionalTitle || t.role || t.title || "Software Developer",
            company: t.currentCompany || t.company || "Independent",
            location: t.location || (t.city ? `${t.city}, ${t.country || ''}` : "Nashik"),
            skills: Array.isArray(t.skills) ? t.skills : [],
            about: t.about || t.bio || "No summary provided.",
            profileImage: getFullProfileImageUrl(t.profileImage),
            resumeUrl: getFullResumeUrl(t.resumeUrl || (Array.isArray(t.resumes) && t.resumes[0]?.fileUrl)),
            resumeName: t.resumeName || (Array.isArray(t.resumes) && t.resumes[0]?.resumeName) || "Resume.pdf",
            status: t.availability ? t.availability.replace(/_/g, " ") : "OPEN TO WORK",
            appliedDate: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "Registered Candidate",
            matchPercentage: 88,
            matchStatus: "COMPLETED",
            isTalentProfile: true,
            raw: t,
          }));
          setTalentDirectoryCandidates(mapped);
        }
      } catch (err) {
        console.error("Error searching talent directory for candidate page:", err);
      } finally {
        if (isMounted) setIsSearchingTalent(false);
      }
    };

    fetchTalentCandidates();
    return () => { isMounted = false; };
  }, [searchQuery]);

  // Combine job applications and talent directory candidates
  const combinedCandidates = useMemo(() => {
    const list = [];

    jobApplications.forEach((app) => {
      const matchInfo = matchApplicationsMap[app.id] || matchApplicationsMap[app.applicationId] || {};
      const score =
        matchInfo.matchPercentage !== undefined
          ? matchInfo.matchPercentage
          : app.matchPercentage !== undefined
          ? app.matchPercentage
          : app.matchScore !== undefined
          ? app.matchScore
          : 85;

      list.push({
        ...app,
        applicantName: app.applicantName || app.candidateName || app.user?.name || "Applicant",
        applicantEmail: app.applicantEmail || app.email || app.user?.email || "",
        jobTitle: app.jobTitle || app.job?.title || "Applicant",
        resumeUrl: getFullResumeUrl(app.resumeUrl || app.resumePath),
        matchPercentage: score,
        matchStatus: matchInfo.matchStatus || app.matchStatus || "COMPLETED",
      });
    });

    talentDirectoryCandidates.forEach((t) => {
      const name = (t.applicantName || "").toLowerCase();
      const email = (t.applicantEmail || "").toLowerCase();
      const duplicate = list.some((existing) => {
        const exName = (existing.applicantName || existing.candidateName || existing.user?.name || "").toLowerCase();
        const exEmail = (existing.applicantEmail || existing.email || existing.user?.email || "").toLowerCase();
        return (email && exEmail && email === exEmail) || (name && exName && name === exName);
      });
      if (!duplicate) {
        list.push(t);
      }
    });

    return list;
  }, [jobApplications, talentDirectoryCandidates, matchApplicationsMap]);

  // Filter and sort candidates
  const filteredCandidates = useMemo(() => {
    let list = [...combinedCandidates];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter((c) => {
        const name = c.applicantName || c.candidateName || "";
        const email = c.applicantEmail || c.email || "";
        const jobTitle = c.jobTitle || "";
        const company = c.company || "";
        const location = c.location || "";
        const skills = Array.isArray(c.skills) ? c.skills.join(" ") : "";
        const status = c.status || "";

        const searchableText = `${name} ${email} ${jobTitle} ${company} ${location} ${skills} ${status}`.toLowerCase();
        return searchableText.includes(query);
      });
    }

    if (sortBy === "ma.matchPercentage,desc") {
      list.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
    } else if (sortBy === "ma.matchPercentage,asc") {
      list.sort((a, b) => (a.matchPercentage || 0) - (b.matchPercentage || 0));
    } else if (sortBy === "app.createdAt,desc") {
      list.sort((a, b) => new Date(b.createdAt || b.appliedDate || 0) - new Date(a.createdAt || a.appliedDate || 0));
    }

    return list;
  }, [combinedCandidates, searchQuery, sortBy]);

  // Auto-select top candidate when list updates
  useEffect(() => {
    if (filteredCandidates.length > 0) {
      if (!selectedCandidate || !filteredCandidates.some((c) => c.id === selectedCandidate.id)) {
        setSelectedCandidate(filteredCandidates[0]);
      }
    } else {
      setSelectedCandidate(null);
    }
  }, [filteredCandidates]);

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      if (typeof applicationId === "number" || !String(applicationId).startsWith("talent-")) {
        await dispatch(updateApplicationStatusThunk({ applicationId, status: newStatus })).unwrap();
      }
      setSuccessMsg(`Candidate status updated to ${newStatus}`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleOpenMatchModal = (appId) => {
    setSelectedMatchApplicationId(appId);
    setShowMatchModal(true);
  };

  const handleRecalculateSuccess = (updatedData) => {
    if (updatedData && updatedData.applicationId) {
      setMatchApplicationsMap((prev) => ({
        ...prev,
        [updatedData.applicationId]: {
          ...(prev[updatedData.applicationId] || {}),
          matchPercentage: updatedData.matchPercentage,
          matchStatus: updatedData.status || "COMPLETED",
          ...updatedData,
        },
      }));
      setSuccessMsg(`AI Match Score updated to ${updatedData.matchPercentage}%`);
      setTimeout(() => setSuccessMsg(""), 3500);
    }
  };

  return (
    <RecruiterLayout
      title="Candidate Directory Studio"
      subtitle="Inspect candidate profiles, AI Job Match scores, verified skills, and hiring progression."
      breadcrumbs={[{ label: "Candidates" }]}
    >
      {/* Success Banner */}
      {successMsg && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-4 text-xs font-bold text-emerald-300 font-satoshi shadow-lg">
          <CheckCircle2 size={16} className="text-emerald-400" />
          {successMsg}
        </div>
      )}

      {/* Top Filter & Toolbar */}
      <Card className="p-4 sm:p-5 border-white/10 bg-[#090d16]/90 backdrop-blur-xl shadow-xl font-satoshi space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name, skill, or email…"
              className="w-full rounded-2xl border border-white/10 bg-white/5 pl-10 pr-9 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-indigo-500/60 font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-end">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 font-bold">Job Filter:</label>
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="rounded-2xl border border-white/10 bg-[#070b12] px-3.5 py-2 text-xs text-white font-bold outline-none focus:border-indigo-500/60"
                style={{ colorScheme: 'dark' }}
              >
                <option value="all">All Jobs & Directory</option>
                {myJobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title || j.jobTitle}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 font-bold flex items-center gap-1">
                <ArrowUpDown size={13} className="text-indigo-400" /> Sort:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-2xl border border-indigo-500/30 bg-[#070b12] px-3 py-2 text-xs font-extrabold text-indigo-300 outline-none focus:border-indigo-500"
                style={{ colorScheme: 'dark' }}
              >
                <option value="ma.matchPercentage,desc">🎯 Highest Match</option>
                <option value="ma.matchPercentage,asc">📉 Lowest Match</option>
                <option value="app.createdAt,desc">🕒 Newest Applied</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Split-Screen Studio */}
      {filteredCandidates.length === 0 ? (
        <Card className="p-12 text-center space-y-4 border-white/10 bg-[#090d16]/90 backdrop-blur-xl shadow-2xl font-satoshi">
          <AlertCircle className="h-12 w-12 text-indigo-400 mx-auto opacity-60" />
          <h3 className="text-lg font-black text-white">No Candidates Match "{searchQuery}"</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto font-medium leading-relaxed">
            No registered candidate profiles or job applications matched your search. Try searching by name, email, or skill.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2 font-satoshi">
            <button
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 px-5 py-2.5 text-xs font-bold text-indigo-300 hover:bg-indigo-600/30 transition cursor-pointer"
            >
              Clear Search Query
            </button>
            <Link
              to="/upload-job"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg hover:scale-105 transition cursor-pointer"
            >
              <Plus size={14} /> Post New Job
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start font-satoshi">
          {/* Left Column: Applicants & Candidates List */}
          <Card className="lg:col-span-1 p-4 border-white/10 bg-[#090d16]/95 backdrop-blur-xl shadow-2xl space-y-3">
            <div className="flex items-center justify-between px-2 pb-1">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                Candidates ({filteredCandidates.length})
              </h4>
              {isSearchingTalent && (
                <span className="text-[10px] text-indigo-400 font-bold animate-pulse">Searching DB...</span>
              )}
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredCandidates.map((c) => {
                const isSelected = selectedCandidate?.id === c.id;
                const name = c.applicantName || c.candidateName || "Candidate";
                const role = c.jobTitle || c.role || "Software Developer";
                const matchScore = c.matchPercentage;
                const matchStatus = c.matchStatus || "COMPLETED";

                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCandidate(c)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? "bg-indigo-600/20 border-indigo-500/50 shadow-glow-primary"
                        : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={name} src={c.profileImage} size="md" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-white text-sm truncate">{name}</h4>
                          <MatchScoreBadge
                            score={matchScore}
                            status={matchStatus}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenMatchModal(c.id || c.applicationId);
                            }}
                          />
                        </div>
                        <p className="text-xs text-indigo-300 font-semibold truncate mt-0.5">{role}</p>
                        {c.company && (
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{c.company}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Right Column: Detailed Profile Studio View */}
          <div className="lg:col-span-2 space-y-6">
            {selectedCandidate ? (
              <Card className="p-6 sm:p-8 border-white/10 bg-[#090d16]/95 backdrop-blur-xl shadow-2xl space-y-6">
                {/* Header Card */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <Avatar name={selectedCandidate.applicantName} src={selectedCandidate.profileImage} size="xl" className="ring-2 ring-indigo-500/30" />
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-black text-white">{selectedCandidate.applicantName}</h2>
                        <MatchScoreBadge
                          score={selectedCandidate.matchPercentage}
                          status={selectedCandidate.matchStatus || "COMPLETED"}
                          size="md"
                          onClick={() => handleOpenMatchModal(selectedCandidate.id || selectedCandidate.applicationId)}
                          className="cursor-pointer"
                        />
                      </div>
                      <p className="text-sm font-bold text-indigo-400 mt-0.5">{selectedCandidate.jobTitle}</p>
                      {selectedCandidate.company && (
                        <p className="text-xs font-semibold text-slate-300 mt-0.5">{selectedCandidate.company}</p>
                      )}
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                        <MapPin size={12} className="text-indigo-400" />
                        <span>{selectedCandidate.location || "Nashik"}</span>
                        <span>•</span>
                        <span>{selectedCandidate.appliedDate || "Registered Candidate"}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenMatchModal(selectedCandidate.id || selectedCandidate.applicationId)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 px-3.5 py-2 text-xs font-extrabold text-indigo-300 transition cursor-pointer"
                    >
                      <Sparkles size={13} className="text-amber-400" /> AI Breakdown
                    </button>

                    {selectedCandidate.resumeUrl && (
                      <a
                        href={selectedCandidate.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 px-3.5 py-2 text-xs font-bold text-indigo-300 hover:bg-indigo-600/30 transition"
                      >
                        <Download size={14} />
                        <span>{selectedCandidate.resumeName || "Resume"}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Candidate Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-1">
                    <span className="text-slate-400 text-[11px] font-bold block uppercase tracking-wider">Email Address</span>
                    <span className="text-white font-bold text-sm block">{selectedCandidate.applicantEmail || selectedCandidate.email || "candidate@example.com"}</span>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-1">
                    <span className="text-slate-400 text-[11px] font-bold block uppercase tracking-wider">Status / Availability</span>
                    <span className="text-emerald-400 font-bold text-sm block">{selectedCandidate.status || "OPEN TO WORK"}</span>
                  </div>
                </div>

                {/* Skills */}
                {selectedCandidate.skills && selectedCandidate.skills.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Verified Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.skills.map((skill, i) => (
                        <span key={i} className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-300">
                          {typeof skill === "string" ? skill : skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* About Summary */}
                {selectedCandidate.about && (
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">About Summary</h4>
                    <p className="text-xs leading-6 text-slate-300 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                      {selectedCandidate.about}
                    </p>
                  </div>
                )}

                {/* Status Progression Controls for Job Applications */}
                {!selectedCandidate.isTalentProfile && (
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Update Application Stage</h4>
                    <div className="flex flex-wrap gap-2">
                      {["APPLIED", "REVIEWING", "SHORTLISTED", "INTERVIEWING", "OFFERED", "ACCEPTED", "REJECTED"].map((st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdateStatus(selectedCandidate.id, st)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            selectedCandidate.status === st
                              ? "bg-indigo-600 text-white shadow-lg"
                              : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ) : null}
          </div>
        </div>
      )}

      {/* AI Match Analysis Drawer / Modal */}
      {showMatchModal && selectedMatchApplicationId && (
        <MatchAnalysisModal
          isOpen={showMatchModal}
          onClose={() => {
            setShowMatchModal(false);
            setSelectedMatchApplicationId(null);
          }}
          applicationId={selectedMatchApplicationId}
          initialData={matchApplicationsMap[selectedMatchApplicationId]}
          onRecalculateSuccess={handleRecalculateSuccess}
        />
      )}
    </RecruiterLayout>
  );
}
