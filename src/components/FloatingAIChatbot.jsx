/**
 * src/components/FloatingAIChatbot.jsx
 *
 * Ultra-Premium Floating AI Chatbot Widget with custom 3D Robot Avatar Logo.
 * Positioned in the optimal bottom-right viewport corner with a floating 
 * interactive callout pill for maximum user engagement.
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, CheckCircle2, RefreshCw, Sparkles, MessageSquare } from "lucide-react";

/* Custom Futuristic 3D AI Robot Logo SVG */
function BotAvatarIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="2" r="1.5" fill="#F59E0B" />
      <rect x="4" y="6" width="16" height="12" rx="4" fill="url(#botGradient)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <circle cx="9" cy="11" r="1.5" fill="#38BDF8" />
      <circle cx="15" cy="11" r="1.5" fill="#38BDF8" />
      <path d="M9.5 15C9.5 15 10.75 16.5 12 16.5C13.25 16.5 14.5 15 14.5 15" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M2 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="botGradient" x1="4" y1="6" x2="20" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="0.5" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: "ai",
    text: "Hello! I'm your AI Career Intelligence Advisor. How can I help supercharge your job search today?",
  },
];

const QUICK_PROMPTS = [
  "✨ Generate AI Cover Letter",
  "⚡ How to boost my Resume ATS score?",
  "💼 Show highest paying Remote Jobs",
  "🎯 Prepare for Technical Interview",
];

export default function FloatingAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setShowTooltip(false);
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), sender: "user", text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "I'm analyzing your request against top engineering hiring data...";
      const lower = query.toLowerCase();

      if (lower.includes("cover letter") || lower.includes("generate")) {
        replyText = "I can generate 3 tailored cover letter versions (Results-Driven, Vision-Aligned, Executive) for any job application! Head over to the Fast-Track Apply panel to generate yours.";
      } else if (lower.includes("ats") || lower.includes("resume")) {
        replyText = "To boost your ATS score above 90%, ensure your resume includes exact technical keywords from the job description (e.g. React 19, TypeScript, Spring Boot) and quantifiable metrics.";
      } else if (lower.includes("remote") || lower.includes("paying") || lower.includes("job")) {
        replyText = "We have over 1,000+ active Remote & Hybrid engineer roles listed right now with salaries up to ₹45L/yr! Check out the Find Jobs section.";
      } else if (lower.includes("interview") || lower.includes("prepare")) {
        replyText = "Practice system design, behavioral STAR responses, and real-time coding assessments in our Career Hub AI Interview Coach!";
      } else {
        replyText = `Great question regarding "${query}". Our AI engine recommends updating your candidate profile skills and exploring active opportunities in Find Jobs.`;
      }

      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "ai", text: replyText }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <aside
      className="fixed bottom-12 right-6 sm:bottom-16 sm:right-8 z-50 font-inter pointer-events-none"
      aria-label="AI Career Assistant Widget"
    >
      <div className="relative pointer-events-auto flex flex-col items-end">
        {/* ── Chat Window Drawer ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mb-4 w-[calc(100vw-40px)] sm:w-96 rounded-3xl border border-white/15 bg-[#090d16]/98 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col text-slate-200 h-[490px] overflow-hidden origin-bottom-right"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-white/20">
                    <BotAvatarIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white font-satoshi flex items-center gap-1.5">
                      JobPortal AI Advisor <CheckCircle2 size={13} className="text-emerald-400" />
                    </h4>
                    <p className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1 mt-0.5 font-satoshi">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Always Active & Online
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-2xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.sender === "ai" && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300">
                        <BotAvatarIcon className="w-4 h-4 text-indigo-400" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 leading-relaxed font-medium ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-tr-none shadow-md font-satoshi"
                          : "bg-white/10 border border-white/10 text-slate-200 rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-indigo-400 text-[11px] font-semibold">
                    <RefreshCw size={12} className="animate-spin" /> AI Assistant is processing...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              <div className="py-2 flex flex-wrap gap-1.5 shrink-0 border-t border-white/5">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-slate-300 hover:border-indigo-500/40 hover:bg-white/10 hover:text-white transition cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="mt-2 flex items-center gap-2 shrink-0 pt-2 border-t border-white/10"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask AI anything about jobs & careers..."
                  className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500/60"
                />
                <button
                  type="submit"
                  className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md hover:scale-105 transition cursor-pointer shrink-0"
                >
                  <Send size={14} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Trigger Bar Container (Tooltip + Floating Button) ── */}
        <div className="flex items-center gap-3">
          {/* Interactive Floating Attention Pill */}
          <AnimatePresence>
            {!isOpen && showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                onClick={() => setIsOpen(true)}
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-[#090d16]/95 px-4 py-2 text-xs font-extrabold text-white shadow-[0_10px_25px_rgba(0,0,0,0.5)] backdrop-blur-xl hover:border-indigo-500/60 hover:scale-105 transition cursor-pointer font-satoshi"
              >
                <Sparkles size={14} className="text-amber-300 fill-amber-300/20 animate-pulse" />
                <span>Ask AI Advisor</span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Global Floating Trigger Button ── */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle AI Career Assistant Chatbot"
            className="group relative flex h-14 w-14 sm:h-15 sm:w-15 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-[0_0_35px_rgba(99,102,241,0.65)] border border-white/25 cursor-pointer shrink-0"
          >
            <BotAvatarIcon className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
            
            {/* Unread AI Badge */}
            <span className="absolute -top-1 -right-1 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-slate-950 shadow-md">
              AI
            </span>

            {/* Pulsating Glow Ring */}
            <span className="absolute -inset-1.5 rounded-full bg-indigo-500/35 blur-md animate-ping pointer-events-none" />
          </motion.button>
        </div>
      </div>
    </aside>
  );
}
