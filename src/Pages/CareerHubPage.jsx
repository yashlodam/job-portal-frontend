/**
 * src/Pages/CareerHubPage.jsx
 *
 * Comprehensive AI Career Hub featuring:
 * 1. AI Resume Builder (/career-hub/resume-builder)
 * 2. AI Resume Analyzer (/career-hub/resume-analyzer)
 * 3. AI Interview Coach (/career-hub/interview-coach)
 * 4. Skill Assessments (/career-hub/assessments)
 * 5. Career Roadmaps (/career-hub/roadmaps)
 * 6. Salary Insights (/career-hub/salary-insights)
 */

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  FileText,
  Video,
  CheckCircle2,
  Compass,
  TrendingUp,
  Award,
  Upload,
  Download,
  Play,
  RotateCcw,
  Check,
  Zap,
  Briefcase,
  ChevronRight,
  User,
  Mail,
  Phone,
  MapPin,
  Plus,
  Trash2,
  Sliders,
  DollarSign,
  BarChart3,
  BookOpen,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Tabs } from "../components/ui/Tabs";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";

export default function CareerHubPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = (path) => {
    if (path.includes("/resume-analyzer")) return "analyzer";
    if (path.includes("/interview-coach")) return "interview";
    if (path.includes("/assessments")) return "assessments";
    if (path.includes("/roadmaps")) return "roadmaps";
    if (path.includes("/salary-insights")) return "salary";
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
    { id: "builder", label: "AI Resume Builder", icon: FileText, badge: "AI" },
    { id: "analyzer", label: "AI Resume Analyzer", icon: Sparkles, badge: "AI" },
    { id: "interview", label: "AI Interview Coach", icon: Video, badge: "AI" },
    { id: "assessments", label: "Skill Assessments", icon: CheckCircle2 },
    { id: "roadmaps", label: "Career Roadmaps", icon: Compass },
    { id: "salary", label: "Salary Insights", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-[#06080F] py-10 px-4 sm:px-6 lg:px-8 text-white font-inter">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Title */}
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-400 mb-3">
            <Sparkles className="h-3.5 w-3.5" /> AI Career Acceleration Suite
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-satoshi tracking-tight">
            Velora <span className="gradient-text">Career Hub</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Supercharge your job search with AI resume generation, instant ATS scoring, interactive mock interviews, and verified skill badges.
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

        {/* Tab 1: AI RESUME BUILDER */}
        {activeTab === "builder" && <ResumeBuilderSection />}

        {/* Tab 2: AI RESUME ANALYZER */}
        {activeTab === "analyzer" && <ResumeAnalyzerSection />}

        {/* Tab 3: AI INTERVIEW COACH */}
        {activeTab === "interview" && <InterviewCoachSection />}

        {/* Tab 4: SKILL ASSESSMENTS */}
        {activeTab === "assessments" && <AssessmentsSection />}

        {/* Tab 5: CAREER ROADMAPS */}
        {activeTab === "roadmaps" && <RoadmapsSection />}

        {/* Tab 6: SALARY INSIGHTS */}
        {activeTab === "salary" && <SalaryInsightsSection />}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   1. AI Resume Builder Section
   ──────────────────────────────────────────────────────────── */
function ResumeBuilderSection() {
  const [resumeData, setResumeData] = useState({
    fullName: "Alex Rivera",
    title: "Senior Full Stack Engineer",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    summary: "High-impact Full Stack Engineer with 6+ years of experience building scalable Web3 and AI-powered platforms. Expert in React 19, TypeScript, Node.js, and cloud architecture.",
    skills: ["React 19", "TypeScript", "Redux Toolkit", "Node.js", "GraphQL", "Tailwind CSS", "AWS", "Docker"],
    experience: [
      { id: 1, company: "TechNova Solutions", role: "Senior Frontend Lead", period: "2023 - Present", desc: "Architected micro-frontend architecture serving 500k+ daily active users." },
      { id: 2, company: "Vercel", role: "Software Engineer", period: "2021 - 2023", desc: "Built reusable React component library and reduced bundle size by 35%." },
    ],
  });

  const [aiGenerating, setAiGenerating] = useState(false);

  const handleGenerateSummary = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setResumeData((prev) => ({
        ...prev,
        summary: `Results-driven ${prev.title} with a proven track record of designing high-performance enterprise applications. Demonstrated expertise in ${prev.skills.slice(0, 4).join(", ")}, driving performance optimization and seamless cross-team engineering execution.`,
      }));
      setAiGenerating(false);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Editor Column */}
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-lg font-satoshi flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-400" /> Resume Editor
          </h3>
          <button
            onClick={handleGenerateSummary}
            disabled={aiGenerating}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-1.5 text-xs font-bold text-indigo-300 hover:bg-indigo-500/20 transition cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5" /> {aiGenerating ? "Generating AI Summary..." : "AI Auto-Enhance"}
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={resumeData.fullName}
                onChange={(e) => setResumeData({ ...resumeData, fullName: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Professional Title</label>
              <input
                type="text"
                value={resumeData.title}
                onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Professional Summary</label>
            <textarea
              rows={4}
              value={resumeData.summary}
              onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Core Skills (Comma Separated)</label>
            <input
              type="text"
              value={resumeData.skills.join(", ")}
              onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value.split(",").map((s) => s.trim()) })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white"
            />
          </div>
        </div>
      </Card>

      {/* Real-time PDF Preview Column */}
      <Card className="p-8 bg-[#0b0f19] border-indigo-500/20 shadow-2xl relative min-h-[550px] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-black text-white font-satoshi">{resumeData.fullName}</h2>
              <p className="text-xs font-bold text-indigo-400 mt-0.5">{resumeData.title}</p>
            </div>
            <div className="text-right text-[11px] text-slate-400 space-y-0.5">
              <p>{resumeData.email}</p>
              <p>{resumeData.phone}</p>
              <p>{resumeData.location}</p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Professional Summary</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/5">
                {resumeData.summary}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Verified Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {resumeData.skills.map((skill) => (
                  <span key={skill} className="rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-[11px] font-semibold text-indigo-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Work Experience</h4>
              <div className="space-y-3">
                {resumeData.experience.map((exp) => (
                  <div key={exp.id} className="text-xs border-l-2 border-indigo-500/40 pl-3 py-0.5">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-white">{exp.role}</h5>
                      <span className="text-slate-400 text-[10px]">{exp.period}</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{exp.company}</p>
                    <p className="text-slate-300 mt-1">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" /> ATS Optimization Score: 96/100
          </span>
          <button className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:scale-105 transition cursor-pointer">
            <Download className="h-4 w-4" /> Download PDF Resume
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   2. AI Resume Analyzer Section
   ──────────────────────────────────────────────────────────── */
function ResumeAnalyzerSection() {
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <Card className="p-8 text-center max-w-2xl mx-auto space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto">
          <Sparkles className="h-8 w-8" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white font-satoshi">Upload Resume for Instant AI ATS Audit</h3>
          <p className="text-xs text-slate-400 mt-1">Get an instant 20+ point audit on keywords, format readability, and recruiter match probability.</p>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3 text-xs font-bold text-white shadow-lg hover:scale-105 transition cursor-pointer disabled:opacity-50"
        >
          {analyzing ? "Analyzing Keywords & Formatting..." : "Analyze Saved Resume (Resume.pdf)"}
        </button>
      </Card>

      {analyzed && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center space-y-2">
            <p className="text-xs text-slate-400 font-semibold">Overall ATS Score</p>
            <h2 className="text-4xl font-black text-emerald-400 font-satoshi">92 / 100</h2>
            <p className="text-xs text-slate-400">Top 5% candidate pool match</p>
          </Card>

          <Card className="p-6 text-center space-y-2">
            <p className="text-xs text-slate-400 font-semibold">Matched Keywords</p>
            <h2 className="text-4xl font-black text-indigo-400 font-satoshi">18 / 20</h2>
            <p className="text-xs text-slate-400">React, TypeScript, Redux, Node.js</p>
          </Card>

          <Card className="p-6 text-center space-y-2">
            <p className="text-xs text-slate-400 font-semibold">Recruiter Readiness</p>
            <h2 className="text-4xl font-black text-purple-400 font-satoshi">EXCELLENT</h2>
            <p className="text-xs text-slate-400">High response probability</p>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   3. AI Interview Coach Section
   ──────────────────────────────────────────────────────────── */
function InterviewCoachSection() {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const questions = [
    "Tell me about a complex technical challenge you solved using React 19 or Redux Toolkit.",
    "How do you handle API rate limiting and pagination in high-traffic applications?",
    "Describe a time when you had a disagreement with a product manager over technical scope.",
  ];

  return (
    <Card className="p-8 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
          <Video className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white font-satoshi">AI Mock Interview Simulator</h3>
          <p className="text-xs text-slate-400">Practice role-specific interview questions with real-time feedback.</p>
        </div>
      </div>

      {!started ? (
        <div className="text-center py-8 space-y-4">
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Select your target role and start a 3-question AI mock interview session. Receive instant feedback on response structure, keywords, and confidence.
          </p>
          <button
            onClick={() => setStarted(true)}
            className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3 text-xs font-bold text-white shadow-lg hover:scale-105 transition cursor-pointer"
          >
            Start Mock Interview Session →
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Question {currentQuestion + 1} of 3</span>
            <p className="text-sm font-bold text-white mt-1">{questions[currentQuestion]}</p>
          </div>

          <textarea
            rows={5}
            placeholder="Type or speak your answer here..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white placeholder-slate-500 focus:border-indigo-500/60 focus:outline-none"
          />

          <div className="flex items-center justify-between">
            <button onClick={() => setStarted(false)} className="text-xs text-slate-400 hover:text-white">
              End Session
            </button>
            <button
              onClick={() => setCurrentQuestion((prev) => (prev + 1) % questions.length)}
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition"
            >
              Submit & Next Question →
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

/* ────────────────────────────────────────────────────────────
   4. Skill Assessments Section
   ──────────────────────────────────────────────────────────── */
function AssessmentsSection() {
  const quizzes = [
    { title: "React 19 & Modern Hooks", questions: 15, duration: "20 mins", level: "Advanced", badge: "Verified React Dev" },
    { title: "Node.js & Backend Architecture", questions: 20, duration: "25 mins", level: "Intermediate", badge: "Node.js Specialist" },
    { title: "System Design & Distributed Systems", questions: 10, duration: "30 mins", level: "Expert", badge: "System Architect" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {quizzes.map((quiz) => (
        <Card key={quiz.title} className="p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <Badge variant="primary" size="sm">{quiz.level}</Badge>
              <span className="text-xs text-slate-400">{quiz.duration}</span>
            </div>

            <h3 className="font-bold text-white font-satoshi text-lg mt-3">{quiz.title}</h3>
            <p className="text-xs text-slate-400 mt-1">{quiz.questions} multiple-choice technical questions</p>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
              Badge: {quiz.badge}
            </span>
            <button className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-indigo-500 transition cursor-pointer">
              Start Quiz
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   5. Career Roadmaps Section
   ──────────────────────────────────────────────────────────── */
function RoadmapsSection() {
  const roadmaps = [
    { role: "Senior Frontend Engineer", steps: ["HTML/CSS & JavaScript Fundamentals", "React 19, Redux & TypeScript", "Performance Optimization & SSR", "System Design & Micro-frontends"] },
    { role: "AI & Machine Learning Engineer", steps: ["Python & Mathematics", "Data Structures & PyTorch", "LLM Fine-tuning & RAG Pipelines", "Production Model Deployment"] },
  ];

  return (
    <div className="space-y-6">
      {roadmaps.map((r) => (
        <Card key={r.role} className="p-6 space-y-4">
          <h3 className="font-extrabold text-white font-satoshi text-xl flex items-center gap-2">
            <Compass className="h-5 w-5 text-indigo-400" /> {r.role} Roadmap
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            {r.steps.map((step, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <span className="text-xs font-bold text-indigo-400">Step 0{idx + 1}</span>
                <p className="text-xs font-semibold text-white">{step}</p>
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
    { role: "Senior React Engineer", avg: "₹18,50,000", min: "₹12,00,000", max: "₹28,00,000" },
    { role: "Lead AI Architect", avg: "₹32,00,000", min: "₹22,00,000", max: "₹45,00,000" },
    { role: "Staff Product Designer", avg: "₹24,00,000", min: "₹16,00,000", max: "₹35,00,000" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {salaries.map((s) => (
        <Card key={s.role} className="p-6 space-y-3">
          <p className="text-xs text-slate-400">{s.role}</p>
          <h3 className="text-2xl font-black text-emerald-400 font-satoshi">{s.avg} / yr</h3>
          <p className="text-xs text-slate-400">Range: {s.min} - {s.max}</p>
        </Card>
      ))}
    </div>
  );
}
