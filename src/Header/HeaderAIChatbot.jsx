/**
 * src/Header/HeaderAIChatbot.jsx
 *
 * Ultra-Premium AI Chatbot Widget integrated into the Top Header.
 * Renders a glowing 3D Bot Avatar trigger button with a popover chat window
 * anchored directly beneath the main navigation bar.
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, CheckCircle2, RefreshCw, Sparkles } from "lucide-react";

function BotAvatarIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="2" r="1.5" fill="#F59E0B" />
      <rect x="4" y="6" width="16" height="12" rx="4" fill="url(#botGradientHeader)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
      <circle cx="9" cy="11" r="1.5" fill="#38BDF8" />
      <circle cx="15" cy="11" r="1.5" fill="#38BDF8" />
      <path d="M9.5 15C9.5 15 10.75 16.5 12 16.5C13.25 16.5 14.5 15 14.5 15" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M2 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <defs>
        <linearGradient id="botGradientHeader" x1="4" y1="6" x2="20" y2="18" gradientUnits="userSpaceOnUse">
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
    text: "Hello! I'm your AI Career Advisor. Ask me anything about job matching, cover letters, or interview prep!",
  },
];

const QUICK_PROMPTS = [
  "✨ Generate AI Cover Letter",
  "⚡ How to boost ATS score?",
  "💼 Show Remote Engineer jobs",
];

export default function HeaderAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const menuRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  /* Outside click listener */
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

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
        replyText = "I can generate 3 tailored cover letter versions for any application! Open any job post to generate yours.";
      } else if (lower.includes("ats") || lower.includes("resume")) {
        replyText = "To boost your ATS score above 90%, include exact keywords like React 19, TypeScript, and Spring Boot.";
      } else if (lower.includes("remote") || lower.includes("job")) {
        replyText = "We have 1,000+ active Remote & Hybrid engineering roles listed with salaries up to ₹45L/yr!";
      } else {
        replyText = `Great query on "${query}". Explore active roles in Find Jobs or update your profile skills!`;
      }

      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "ai", text: replyText }]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* ── Header Trigger Button ── */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Career Assistant"
        className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-3.5 py-1.5 text-xs font-black text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-white/20 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all cursor-pointer font-satoshi shrink-0"
      >
        <BotAvatarIcon className="w-5 h-5 text-white" />
        <span className="hidden sm:inline">Ask AI</span>
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
      </motion.button>

      {/* ── Header Popover Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-3 w-80 sm:w-96 rounded-3xl border border-white/15 bg-[#090d16]/98 backdrop-blur-2xl p-4 shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-50 text-slate-200 h-[460px] flex flex-col font-inter"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-md">
                  <BotAvatarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-white font-satoshi flex items-center gap-1">
                    JobPortal AI Assistant <CheckCircle2 size={12} className="text-emerald-400" />
                  </h4>
                  <p className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active & Ready
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[84%] rounded-2xl px-3 py-2 leading-relaxed font-medium ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-tr-none shadow-md"
                        : "bg-white/10 border border-white/10 text-slate-200 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-indigo-400 text-[11px] font-semibold">
                  <RefreshCw size={12} className="animate-spin" /> AI is thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="py-2 flex flex-wrap gap-1 shrink-0 border-t border-white/5">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="rounded-xl border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
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
                placeholder="Ask AI anything..."
                className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500/60"
              />
              <button
                type="submit"
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md hover:bg-indigo-500 transition cursor-pointer shrink-0"
              >
                <Send size={13} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
