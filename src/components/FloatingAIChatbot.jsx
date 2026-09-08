/**
 * src/components/FloatingAIChatbot.jsx
 *
 * Ultra-Premium Floating AI Career Copilot Widget for JobPortal.
 * Powered by Spring AI + Groq LLaMA 3.3.
 *
 * Key Features:
 * - Real-time conversational intelligence with conversational memory
 * - Mode Quick Switcher (General Copilot, Job Finder, ATS Resume, Interview Prep)
 * - Expandable Widescreen View (420px -> 640px)
 * - Rich Markdown parsing with bolding, bullet points, and code copy
 * - Interactive Matched Job Cards with 1-click navigation
 * - Dynamic suggested follow-up prompt chips
 * - Web Speech API Voice Dictation with animated pulse
 * - Copy response to clipboard & reset conversation
 * - Context-aware greeting tailored to authenticated candidate
 */

import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Briefcase,
  MapPin,
  Trash2,
  Zap,
  ChevronRight,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Mic,
  MicOff,
  Flame,
  Star,
  Compass,
  FileText,
  Target,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { useSelector } from "react-redux";
import { sendCopilotMessageApi } from "../api/copilotApi";
import { toast } from "./ui/ToastNotification";

/* ── 3D Futuristic AI Robot Avatar Logo ── */
function BotAvatarIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="2" r="1.5" fill="#F59E0B" />
      <rect x="4" y="6" width="16" height="12" rx="4" fill="url(#botGradAi)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <circle cx="9" cy="11" r="1.5" fill="#38BDF8" />
      <circle cx="15" cy="11" r="1.5" fill="#38BDF8" />
      <path d="M9.5 15C9.5 15 10.75 16.5 12 16.5C13.25 16.5 14.5 15 14.5 15" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M2 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="botGradAi" x1="4" y1="6" x2="20" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="0.5" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Capability Modes ── */
const COPILOT_MODES = [
  { id: "all", label: "Career Chat", icon: Compass, prompt: "Hello! What can I help you achieve in your job search today?" },
  { id: "jobs", label: "Job Finder", icon: Briefcase, prompt: "💼 Show me the highest paying active remote engineering roles" },
  { id: "ats", label: "ATS Resume", icon: FileText, prompt: "⚡ How do I optimize my resume keywords for a 95%+ ATS score?" },
  { id: "prep", label: "Interview Drill", icon: Target, prompt: "🎯 Give me 3 high-bar technical interview questions for full-stack developer" },
];

const DEFAULT_PROMPTS = [
  "💼 Show active Tech & Remote Jobs",
  "⚡ How to score 90%+ on Resume ATS?",
  "🎯 Practice 3 Technical Interview Questions",
  "✍️ Write a high-converting Cover Letter",
];

/* ── Rich Markdown Formatter with Copyable Code blocks ── */
function FormattedMessageText({ text }) {
  const [copiedCodeIdx, setCopiedCodeIdx] = useState(null);

  if (!text) return null;

  const handleCopyCode = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  const lines = text.split("\n");
  return (
    <div className="space-y-2 leading-relaxed text-xs">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        // Detect code block backticks `code` or ```
        if (trimmed.startsWith("```") || trimmed.endsWith("```")) {
          const codeSnippet = trimmed.replace(/```/g, "");
          return (
            <div key={idx} className="relative my-2 rounded-xl bg-black/60 border border-white/15 p-3 font-mono text-[11px] text-indigo-300 overflow-x-auto">
              <button
                type="button"
                onClick={() => handleCopyCode(codeSnippet, idx)}
                className="absolute right-2 top-2 rounded-lg bg-white/10 px-2 py-0.5 text-[9px] text-slate-300 hover:text-white flex items-center gap-1 transition"
              >
                {copiedCodeIdx === idx ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                {copiedCodeIdx === idx ? "Copied" : "Copy"}
              </button>
              <code>{codeSnippet}</code>
            </div>
          );
        }

        // Bullet points
        const isBullet = trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("* ");
        const content = isBullet ? trimmed.replace(/^[•\-\*]\s*/, "") : line;

        // Parse bold **text** and inline `code`
        const parts = content.split(/(\*\*.*?\*\*|`.*?`)/g);
        const formatted = parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={pIdx} className="font-extrabold text-white">
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith("`") && part.endsWith("`")) {
            return (
              <code key={pIdx} className="rounded bg-indigo-500/20 px-1 py-0.5 text-[11px] font-mono text-indigo-300 border border-indigo-500/30">
                {part.slice(1, -1)}
              </code>
            );
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-0.5">
              <span className="text-indigo-400 font-black text-sm leading-none mt-0.5">•</span>
              <span className="flex-1 text-slate-200">{formatted}</span>
            </div>
          );
        }

        return <p key={idx} className="text-slate-200">{formatted}</p>;
      })}
    </div>
  );
}

export default function FloatingAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeMode, setActiveMode] = useState("all");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [followUps, setFollowUps] = useState(DEFAULT_PROMPTS);
  const [showFollowUps, setShowFollowUps] = useState(true);
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const location = useLocation();

  const user = useSelector((state) => state.auth?.user);

  // Initialize personalized greeting on mount or user change
  useEffect(() => {
    const greetingName = user?.name ? ` ${user.name.split(" ")[0]}` : "";
    setMessages([
      {
        id: 1,
        sender: "ai",
        timestamp: "Just now",
        text: `Hello${greetingName}! I'm your **JobPortal AI Career Copilot**. I can help you discover matching jobs, optimize your resume for ATS screening, drill technical interview questions, and track your applications.\n\nHow can I assist your career search today?`,
        matchedJobs: [],
      },
    ]);
  }, [user]);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setShowTooltip(false);
    }
  }, [messages, isOpen, isTyping]);

  // Voice Dictation (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceDictation = () => {
    if (!recognitionRef.current) {
      toast.warning("Voice speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Speech recognition error:", err);
      }
    }
  };

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isTyping) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = {
      id: Date.now(),
      sender: "user",
      timestamp: timeStr,
      text: query,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInput("");
    setIsTyping(true);

    // Prepare rolling conversation history
    const historyPayload = newMessages.slice(-6).map((m) => ({
      sender: m.sender,
      text: m.text,
    }));

    try {
      const response = await sendCopilotMessageApi({
        message: query,
        history: historyPayload,
        activePage: location.pathname,
      });

      const copilotData = response.data?.data;
      const aiReply = copilotData?.reply || "I've analyzed your request and our AI intelligence engine is ready.";
      const matchedJobs = copilotData?.matchedJobs || [];
      const newFollowUps =
        copilotData?.suggestedFollowUps?.length > 0
          ? copilotData.suggestedFollowUps
          : DEFAULT_PROMPTS;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: aiReply,
          matchedJobs: matchedJobs,
          actionLink: copilotData?.actionLink,
        },
      ]);
      setFollowUps(newFollowUps);
      setShowFollowUps(true);
    } catch (err) {
      console.warn("AI Copilot request error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          text: "I'm connected to JobPortal's AI engine. You can browse active roles in **Find Jobs**, evaluate your ATS match in **Career Hub**, or ask me specific technical interview drill questions!",
          matchedJobs: [],
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopyMessage = (msgId, text) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleClearChat = () => {
    const greetingName = user?.name ? ` ${user.name.split(" ")[0]}` : "";
    setMessages([
      {
        id: Date.now(),
        sender: "ai",
        timestamp: "Just now",
        text: `Conversation cleared. What would you like to explore next${greetingName}?`,
        matchedJobs: [],
      },
    ]);
    setFollowUps(DEFAULT_PROMPTS);
  };

  const handleModeClick = (mode) => {
    setActiveMode(mode.id);
    handleSend(mode.prompt);
  };

  return (
    <aside
      className="fixed bottom-6 right-4 sm:bottom-10 sm:right-8 z-50 font-inter pointer-events-none"
      aria-label="JobPortal AI Career Copilot"
    >
      <div className="relative pointer-events-auto flex flex-col items-end">
        {/* ── Chat Window Drawer ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 24 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className={`mb-4 rounded-3xl border border-white/15 bg-[#070b14]/98 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.95)] flex flex-col text-slate-200 overflow-hidden origin-bottom-right transition-all duration-300 ${
                isExpanded
                  ? "w-[calc(100vw-32px)] sm:w-[620px] h-[640px] max-h-[88vh]"
                  : "w-[calc(100vw-32px)] sm:w-[420px] h-[560px] max-h-[82vh]"
              }`}
            >
              {/* ── Top Header ── */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 shrink-0 bg-gradient-to-r from-white/[0.04] via-transparent to-white/[0.02]">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-white/20">
                    <BotAvatarIcon className="w-6 h-6 text-white" />
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#070b14] shadow-sm animate-pulse" />
                  </div>

                  <div>
                    <h4 className="text-sm font-black text-white font-satoshi flex items-center gap-1.5">
                      JobPortal AI Copilot
                      <CheckCircle2 size={13} className="text-emerald-400" />
                    </h4>
                    <p className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1.5 mt-0.5 font-satoshi">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                      LLaMA 3.3 70B • Real-time DB Context
                    </p>
                  </div>
                </div>

                {/* Header Action Controls */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    title={isExpanded ? "Collapse View" : "Expand Widescreen"}
                    className="hidden sm:inline-flex rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
                  >
                    {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                  </button>

                  <button
                    type="button"
                    onClick={handleClearChat}
                    title="Clear Conversation"
                    className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-rose-300 transition cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close Chat"
                    className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              {/* ── Mode Capabilities Quick Switcher Bar ── */}
              <div className="px-3 py-2 border-b border-white/5 bg-black/20 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                {COPILOT_MODES.map((mode) => {
                  const Icon = mode.icon;
                  const isActive = activeMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => handleModeClick(mode)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-[10px] font-bold transition-all shrink-0 cursor-pointer ${
                        isActive
                          ? "bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 shadow-sm"
                          : "border border-white/5 bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Icon size={11} className={isActive ? "text-indigo-400" : "text-slate-500"} />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* ── Messages Body ── */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col gap-1.5 ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`group relative flex gap-2.5 max-w-[92%] ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.sender === "ai" && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 mt-0.5 shadow-sm">
                          <BotAvatarIcon className="w-4 h-4 text-indigo-400" />
                        </div>
                      )}

                      <div
                        className={`rounded-2xl p-3.5 leading-relaxed text-xs shadow-md relative ${
                          msg.sender === "user"
                            ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-tr-none font-medium font-satoshi"
                            : "bg-[#0d1322] border border-white/10 text-slate-200 rounded-tl-none font-normal"
                        }`}
                      >
                        <FormattedMessageText text={msg.text} />

                        {/* Copy button for AI replies */}
                        {msg.sender === "ai" && (
                          <button
                            type="button"
                            onClick={() => handleCopyMessage(msg.id, msg.text)}
                            title="Copy reply"
                            className="absolute right-2.5 top-2 opacity-0 group-hover:opacity-100 rounded-lg bg-white/10 p-1 text-slate-400 hover:text-white transition cursor-pointer"
                          >
                            {copiedMsgId === msg.id ? (
                              <Check size={11} className="text-emerald-400" />
                            ) : (
                              <Copy size={11} />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Timestamp */}
                    <span className="text-[9px] text-slate-500 px-1 font-mono">
                      {msg.timestamp || "Just now"}
                    </span>

                    {/* ── Matched Interactive Job Cards ── */}
                    {msg.matchedJobs && msg.matchedJobs.length > 0 && (
                      <div className="w-full space-y-2 pt-1 pl-9">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                          <Flame size={12} className="text-amber-400" />
                          <span>Matched Opportunities in Database:</span>
                        </div>

                        <div className={`grid gap-2 ${isExpanded ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                          {msg.matchedJobs.map((job) => (
                            <div
                              key={job.id}
                              className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/40 to-slate-900/90 p-3.5 flex flex-col justify-between gap-3 shadow-lg hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all group/job"
                            >
                              <div className="space-y-1">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold text-xs">
                                      {(job.companyName || "J").charAt(0)}
                                    </div>
                                    <h5 className="font-black text-white text-xs font-satoshi line-clamp-1 group-hover/job:text-indigo-300 transition">
                                      {job.title}
                                    </h5>
                                  </div>
                                  {job.workMode && (
                                    <span className="rounded-full bg-white/10 border border-white/10 px-2 py-0.5 text-[9px] font-bold text-slate-300 shrink-0">
                                      {job.workMode}
                                    </span>
                                  )}
                                </div>

                                <p className="text-[11px] font-semibold text-indigo-400 truncate pl-9">
                                  {job.companyName}
                                </p>

                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400 pl-9 pt-0.5">
                                  <span className="flex items-center gap-1">
                                    <MapPin size={10} className="text-slate-500" />
                                    {job.location}
                                  </span>
                                  {job.salary && (
                                    <span className="font-extrabold text-amber-300 font-satoshi">
                                      {job.salary}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                <span className="text-[9px] text-slate-500 font-medium">
                                  {job.jobType || "Full-time"}
                                </span>
                                <Link
                                  to={`/jobs/${job.id}`}
                                  onClick={() => setIsOpen(false)}
                                  className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1 text-[10px] font-bold text-white shadow-md hover:scale-105 transition cursor-pointer shrink-0"
                                >
                                  <span>View Job</span>
                                  <ArrowUpRight size={11} />
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* ── Typing Animation ── */}
                {isTyping && (
                  <div className="flex items-center gap-2.5 pl-9 text-indigo-400 text-xs font-semibold">
                    <div className="flex space-x-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-bounce" />
                    </div>
                    <span>AI Copilot generating career intelligence…</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* ── Dynamic Suggested Follow-Ups with X dismiss button ── */}
              <AnimatePresence>
                {showFollowUps && followUps && followUps.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-3.5 py-2 shrink-0 border-t border-white/5 bg-gradient-to-r from-black/40 via-indigo-950/20 to-black/40 overflow-hidden"
                  >
                    <div className="flex items-center justify-between pb-1.5 px-0.5">
                      <span className="text-[10px] font-black text-indigo-400/90 flex items-center gap-1.5 uppercase tracking-wider font-satoshi">
                        <Sparkles size={11} className="text-amber-400 fill-amber-400/20 animate-pulse" />
                        Suggested Follow-ups
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowFollowUps(false)}
                        title="Dismiss Suggestions"
                        className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                      >
                        <X size={13} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {followUps.slice(0, 3).map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          disabled={isTyping}
                          onClick={() => handleSend(prompt)}
                          className="group rounded-xl border border-indigo-500/25 bg-indigo-950/40 px-2.5 py-1 text-[10px] font-semibold text-slate-200 hover:border-indigo-500/60 hover:bg-indigo-600/25 hover:text-white transition-all cursor-pointer disabled:opacity-50 text-left flex items-center gap-1.5 shadow-sm"
                        >
                          <ChevronRight size={10} className="text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                          <span>{prompt}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Input Form Bar ── */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-3 flex items-center gap-2 shrink-0 border-t border-white/10 bg-[#070b14]"
              >
                <div className="relative flex-1 flex items-center">
                  <input
                    type="text"
                    value={input}
                    disabled={isTyping}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      isListening
                        ? "Listening to voice input..."
                        : "Ask AI about jobs, ATS resume, interviews…"
                    }
                    className={`w-full rounded-2xl border bg-white/5 pl-4 pr-10 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition ${
                      isListening
                        ? "border-rose-500/70 bg-rose-500/10 animate-pulse"
                        : "border-white/10 focus:border-indigo-500/70"
                    }`}
                  />

                  {/* Show Suggestions toggle if dismissed */}
                  {!showFollowUps && followUps && followUps.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowFollowUps(true)}
                      title="Show Suggested Questions"
                      className="absolute right-9 rounded-xl p-1 text-amber-400 hover:text-amber-300 hover:bg-white/10 transition cursor-pointer"
                    >
                      <Sparkles size={13} />
                    </button>
                  )}

                  {/* Microphone Dictation Trigger */}
                  <button
                    type="button"
                    onClick={toggleVoiceDictation}
                    title={isListening ? "Stop Voice Input" : "Voice Input (Speech-to-Text)"}
                    className={`absolute right-2.5 rounded-xl p-1 transition cursor-pointer ${
                      isListening
                        ? "text-rose-400 bg-rose-500/20"
                        : "text-slate-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {isListening ? <MicOff size={14} className="animate-pulse" /> : <Mic size={14} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md hover:scale-105 transition cursor-pointer shrink-0 disabled:opacity-40 disabled:hover:scale-100"
                >
                  {isTyping ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Floating Launcher Trigger (Callout Pill + 3D Robot Button) ── */}
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {!isOpen && showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                onClick={() => setIsOpen(true)}
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-[#070b14]/95 px-4 py-2 text-xs font-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-xl hover:border-indigo-500/60 hover:scale-105 transition cursor-pointer font-satoshi"
              >
                <Sparkles size={14} className="text-amber-300 fill-amber-300/20 animate-pulse" />
                <span>JobPortal AI Copilot</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle JobPortal AI Career Copilot Chatbot"
            className="group relative flex h-14 w-14 sm:h-15 sm:w-15 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white shadow-[0_0_40px_rgba(99,102,241,0.7)] border border-white/25 cursor-pointer shrink-0"
          >
            <BotAvatarIcon className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />

            {/* AI Chip Badge */}
            <span className="absolute -top-1 -right-1 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-slate-950 shadow-md">
              AI
            </span>

            {/* Glowing Neon Ring */}
            <span className="absolute -inset-1.5 rounded-full bg-indigo-500/35 blur-md animate-ping pointer-events-none" />
          </motion.button>
        </div>
      </div>
    </aside>
  );
}
