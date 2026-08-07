/**
 * src/Pages/CareerHubPage.jsx
 *
 * Senior UI/UX Executive AI Career Command Center (Velora Suite v4.8).
 * Optimized with comfortable font sizes (text-sm/text-base), spacious layouts,
 * and high-contrast Satoshi typography for maximum User Experience (UX).
 */

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SkillAssessmentsModule from "../features/career-hub/components/SkillAssessmentsModule";
import ResumeBuilderMain from "../features/resume-builder/pages/ResumeBuilderMain";
import {
  Sparkles,
  FileText,
  Video,
  CheckCircle2,
  Compass,
  TrendingUp,
  Upload,
  Download,
  Play,
  RotateCcw,
  Check,
  Zap,
  Briefcase,
  ChevronRight,
  Code,
  Award,
  AlertCircle,
  BarChart3,
  BookOpen,
  DollarSign,
  Mic,
  Star,
  FileCheck,
  Shield,
  Layers,
  Cpu,
  Target,
  ArrowUpRight,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import MockInterviewMain from "../features/mock-interview/pages/MockInterviewMain";
import ResumeAnalyzerMain from "../features/resume-analyzer/pages/ResumeAnalyzerMain";

export default function CareerHubPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = (path) => {
    if (path.includes("analyzer")) return "analyzer";
    if (path.includes("interview")) return "interview";
    if (path.includes("assessments")) return "assessments";
    if (path.includes("roadmaps")) return "roadmaps";
    if (path.includes("salary")) return "salary";
    return "builder";
  };

  const [activeTab, setActiveTab] = useState(getActiveTab(location.pathname));

  useEffect(() => {
    setActiveTab(getActiveTab(location.pathname));
  }, [location.pathname]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const routes = {
      builder: "/career-hub/resume-builder",
      analyzer: "/career-hub/resume-analyzer",
      interview: "/career-hub/interview-coach",
      assessments: "/career-hub/assessments",
      roadmaps: "/career-hub/roadmaps",
      salary: "/career-hub/salary-insights",
    };
    navigate(routes[tabId]);
  };

  const tabs = [
    { id: "builder", label: "AI Resume Studio", icon: FileText, badge: "PRO" },
    { id: "analyzer", label: "ATS Document Auditor", icon: Sparkles, badge: "AI 4.8" },
    { id: "interview", label: "Mock Interview Simulator", icon: Video, badge: "LIVE" },
    { id: "assessments", label: "Skill Assessments & Certifications", icon: Award },
    { id: "roadmaps", label: "Role Progression Trees", icon: Compass },
    { id: "salary", label: "Compensation Intelligence", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-[#04060b] py-10 px-4 sm:px-6 lg:px-8 text-white font-satoshi selection:bg-indigo-500/30 selection:text-white relative overflow-hidden">
      {/* Executive Ambient Background Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-pink-600/10 blur-[180px]" />
      <div className="pointer-events-none absolute top-1/3 -left-40 h-[400px] w-[400px] rounded-full bg-cyan-600/10 blur-[160px]" />
      <div className="pointer-events-none absolute bottom-1/4 -right-40 h-[450px] w-[450px] rounded-full bg-purple-600/10 blur-[180px]" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-xs font-black text-indigo-400 uppercase tracking-widest font-satoshi shadow-sm">
              <Cpu className="h-4 w-4 text-indigo-400 animate-pulse" /> Velora Neural AI Engine v4.8 Active
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-satoshi tracking-tight leading-tight">
              AI Career <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Command Center</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-medium leading-relaxed">
              Accelerate your engineering trajectory with real-time ATS document audits, AI interview coaching, live skill verification, and market compensation benchmarks.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2.5 rounded-2xl bg-white/[0.03] border border-white/10 px-4 py-2.5 text-xs font-extrabold text-slate-200 font-satoshi shadow-md">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ATS Compliance 99.4%</span>
            </div>
          </div>
        </div>

        {/* Navigation Pill Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-none border-b border-white/10 font-satoshi">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-300 shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-105"
                    : "bg-white/[0.03] border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      isActive ? "bg-white/20 text-white" : "bg-indigo-500/20 text-indigo-300"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Tab Content Render */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === "builder" && <ResumeBuilderSection />}
            {activeTab === "analyzer" && <ResumeAnalyzerMain />}
            {activeTab === "interview" && <InterviewCoachSection />}
            {activeTab === "assessments" && <AssessmentsSection />}
            {activeTab === "roadmaps" && <RoadmapsSection />}
            {activeTab === "salary" && <SalaryInsightsSection />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   1. Executive AI Resume Builder Section
   ──────────────────────────────────────────────────────────── */
function ResumeBuilderSection() {
  return <ResumeBuilderMain />;
}

/* ────────────────────────────────────────────────────────────
   2. Interactive ATS Document Auditor Section
   ──────────────────────────────────────────────────────────── */
function ResumeAnalyzerSection() {
  const [file, setFile] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setAnalyzed(false);
    }
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 1600);
  };

  return (
    <div className="space-y-8 font-satoshi">
      {/* Upload Zone Card */}
      <Card className="p-8 sm:p-10 max-w-2xl mx-auto space-y-6 text-center border-white/10 bg-[#090d16]/95 backdrop-blur-2xl shadow-2xl rounded-3xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400 mx-auto shadow-lg">
          <Upload className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-white font-satoshi">Upload Resume for Instant AI ATS Audit</h3>
          <p className="text-sm text-slate-300 mt-2 font-medium max-w-md mx-auto leading-relaxed">
            Scan your PDF or DOCX resume against top applicant tracking systems (ATS) like Greenhouse, Lever, and Workday.
          </p>
        </div>

        {/* Drag & Drop File Picker */}
        <label className="block border-2 border-dashed border-white/20 hover:border-indigo-500/80 rounded-3xl p-8 cursor-pointer transition bg-white/[0.02] group">
          <input type="file" accept=".pdf,.docx" onChange={handleFileUpload} className="hidden" />
          <div className="space-y-3">
            <FileCheck size={44} className="text-indigo-400 mx-auto group-hover:scale-110 transition" />
            {file ? (
              <p className="text-sm font-black text-emerald-400">Selected File: {file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
            ) : (
              <p className="text-sm font-black text-slate-200">Click or drag your PDF/DOCX resume file here</p>
            )}
            <p className="text-xs text-slate-400 font-medium">Supports PDF & Microsoft Word DOCX up to 10MB</p>
          </div>
        </label>

        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:scale-105 transition cursor-pointer disabled:opacity-50"
        >
          {analyzing ? "Scanning Document & Match Algorithms..." : file ? `Run AI Audit on ${file.name}` : "Run AI Audit on Sample Resume"}
        </button>
      </Card>

      {/* Audit Results Dashboard */}
      {analyzed && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Top 4 KPI Glass Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center space-y-2 border-emerald-500/30 bg-[#090d16]/95">
              <p className="text-xs text-slate-400 font-black uppercase tracking-wider">Overall ATS Score</p>
              <h2 className="text-4xl font-black text-emerald-400">96 / 100</h2>
              <p className="text-xs text-emerald-400 font-extrabold">Top 2% Candidate Pool Match</p>
            </Card>

            <Card className="p-6 text-center space-y-2 border-indigo-500/30 bg-[#090d16]/95">
              <p className="text-xs text-slate-400 font-black uppercase tracking-wider">Keyword Density</p>
              <h2 className="text-4xl font-black text-indigo-400">19 / 20</h2>
              <p className="text-xs text-slate-300 font-medium">React 19, Spring Boot, Microservices</p>
            </Card>

            <Card className="p-6 text-center space-y-2 border-purple-500/30 bg-[#090d16]/95">
              <p className="text-xs text-slate-400 font-black uppercase tracking-wider">Formatting & Readability</p>
              <h2 className="text-4xl font-black text-purple-400">98 / 100</h2>
              <p className="text-xs text-slate-300 font-medium">Single-Column Parsable Structure</p>
            </Card>

            <Card className="p-6 text-center space-y-2 border-amber-500/30 bg-[#090d16]/95">
              <p className="text-xs text-slate-400 font-black uppercase tracking-wider">Recruiter Response</p>
              <h2 className="text-4xl font-black text-amber-400">98% VERY HIGH</h2>
              <p className="text-xs text-amber-400 font-extrabold">High Callback Likelihood</p>
            </Card>
          </div>

          {/* Actionable Suggestions Card */}
          <Card className="p-6 sm:p-8 space-y-5 border-white/10 bg-[#090d16]/95 backdrop-blur-2xl">
            <h4 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" /> AI Actionable Improvement Suggestions
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-slate-200">
                <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-white text-base block mb-0.5">Strong Technical Keyword Alignment</span>
                  Contains key high-demand frameworks: React 19, Spring Boot 3, REST Controllers, and Redux Toolkit.
                </div>
              </div>
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-200">
                <Sparkles size={20} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold text-white text-base block mb-0.5">Quantify Revenue & Performance Impact</span>
                  Add concrete metrics to your work experience bullets (e.g. "Optimized API throughput by 35% and scaled microservices to 500k daily users").
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   3. Interactive AI Interview Coach Section
   ──────────────────────────────────────────────────────────── */
function InterviewCoachSection() {
  return <MockInterviewMain />;
}

/* ────────────────────────────────────────────────────────────
   4. Skill Assessments Section
   ──────────────────────────────────────────────────────────── */
function AssessmentsSection() {
  return <SkillAssessmentsModule />;
}

/* ────────────────────────────────────────────────────────────
   5. Career Roadmaps Section
   ──────────────────────────────────────────────────────────── */
function RoadmapsSection() {
  const roadmaps = [
    { role: "Senior Full-Stack Engineer", steps: ["HTML/CSS & Modern JavaScript", "React 19 & Redux Toolkit", "Spring Boot & Microservices", "System Design & Cloud Deployment"] },
    { role: "AI & Machine Learning Engineer", steps: ["Python & Applied Mathematics", "Data Structures & PyTorch", "LLM Fine-tuning & RAG Pipelines", "Production Model Deployment"] },
  ];

  return (
    <div className="space-y-6 font-satoshi">
      {roadmaps.map((r) => (
        <Card key={r.role} className="p-6 sm:p-8 space-y-5 border-white/10 bg-[#090d16]/95 backdrop-blur-xl shadow-xl">
          <h3 className="font-black text-white font-satoshi text-xl flex items-center gap-2">
            <Compass className="h-6 w-6 text-indigo-400" /> {r.role} Roadmap
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            {r.steps.map((step, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-xs font-black text-indigo-400">Step 0{idx + 1}</span>
                <p className="text-xs font-extrabold text-white">{step}</p>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   6. Salary Insights Section
   ──────────────────────────────────────────────────────────── */
function SalaryInsightsSection() {
  const salaries = [
    { role: "Senior Full-Stack Developer", avg: "₹22,50,000", min: "₹14,00,000", max: "₹34,00,000" },
    { role: "Spring Boot Backend Specialist", avg: "₹20,00,000", min: "₹13,00,000", max: "₹30,00,000" },
    { role: "Lead AI Systems Architect", avg: "₹35,00,000", min: "₹24,00,000", max: "₹50,00,000" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-satoshi">
      {salaries.map((s) => (
        <Card key={s.role} className="p-6 sm:p-7 space-y-3 border-white/10 bg-[#090d16]/95 backdrop-blur-xl shadow-xl">
          <p className="text-xs text-slate-400 font-bold">{s.role}</p>
          <h3 className="text-2xl font-black text-emerald-400 font-satoshi">{s.avg} / yr</h3>
          <p className="text-xs text-slate-400 font-medium">Market Range: {s.min} - {s.max}</p>
        </Card>
      ))}
    </div>
  );
}
