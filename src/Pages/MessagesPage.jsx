/**
 * src/Pages/MessagesPage.jsx
 *
 * WhatsApp Web Replica for Candidate & Recruiter Communication.
 * Features WhatsApp Web color scheme (#111b21 sidebar, #0b141a chat wallpaper,
 * #005c4b green sent bubbles, #202c33 dark received bubbles, blue double checkmarks,
 * and WhatsApp mobile responsive drawer switching).
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  CheckCheck,
  Check,
  Mic,
  ArrowLeft,
  Lock,
  MessageSquare,
  Sparkles,
  Info,
  UserCheck,
  Building2,
  Briefcase,
} from "lucide-react";

/* Mock WhatsApp Conversations */
const MOCK_CONVERSATIONS = [
  {
    id: "conv-1",
    participant: {
      name: "Sarah Jenkins",
      role: "Lead Recruiter",
      company: "Stripe",
      online: true,
      email: "sarah.jenkins@stripe.com",
      phone: "+1 (415) 890-1234",
    },
    job: {
      title: "Senior Full Stack Engineer",
      location: "San Francisco, CA (Hybrid)",
      salary: "$160,000 - $190,000",
    },
    unread: 2,
    lastTime: "10:42 AM",
    messages: [
      {
        id: "m1",
        sender: "recruiter",
        text: "Hi Alex! We reviewed your candidate profile and were impressed with your React 19 and Node.js experience.",
        timestamp: "10:30 AM",
        status: "read",
      },
      {
        id: "m2",
        sender: "user",
        text: "Hi Sarah! Thank you for reaching out. I'm definitely interested in learning more about the Senior Full Stack Engineer position at Stripe.",
        timestamp: "10:35 AM",
        status: "read",
      },
      {
        id: "m3",
        sender: "recruiter",
        text: "Awesome! Would you be available for a quick 30-minute introductory call tomorrow afternoon at 2:00 PM EST?",
        timestamp: "10:42 AM",
        status: "read",
      },
    ],
  },
  {
    id: "conv-2",
    participant: {
      name: "David Chen",
      role: "Engineering Manager",
      company: "Vercel",
      online: false,
      email: "david.chen@vercel.com",
      phone: "+1 (650) 456-7890",
    },
    job: {
      title: "Lead Frontend Architect",
      location: "Remote",
      salary: "$180,000 - $220,000",
    },
    unread: 0,
    lastTime: "Yesterday",
    messages: [
      {
        id: "m201",
        sender: "recruiter",
        text: "Hey Alex, loved your technical presentation during yesterday's system design round!",
        timestamp: "Yesterday 4:15 PM",
        status: "read",
      },
      {
        id: "m202",
        sender: "user",
        text: "Thanks David! It was great discussing the Next.js optimization pipeline with your team.",
        timestamp: "Yesterday 4:30 PM",
        status: "read",
      },
    ],
  },
  {
    id: "conv-3",
    participant: {
      name: "Elena Rostova",
      role: "Talent Acquisition",
      company: "OpenAI",
      online: true,
      email: "elena.r@openai.com",
      phone: "+1 (415) 321-9876",
    },
    job: {
      title: "Staff AI Product Manager",
      location: "San Francisco, CA",
      salary: "$200,000 - $250,000",
    },
    unread: 1,
    lastTime: "Aug 3",
    messages: [
      {
        id: "m301",
        sender: "recruiter",
        text: "Your application for Staff AI Product Manager has been moved to the hiring manager review stage!",
        timestamp: "Aug 3, 11:00 AM",
        status: "read",
      },
    ],
  },
];

const SMART_REPLIES = [
  "I'd love to schedule a call!",
  "Could you share the salary range?",
  "I've attached my updated resume.",
  "Thanks! What are the next steps?",
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [activeId, setActiveId] = useState("conv-1");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [inputText, setInputText] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  const messagesEndRef = useRef(null);

  const activeConv = conversations.find((c) => c.id === activeId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, activeConv?.messages?.length]);

  const handleSelectConv = (id) => {
    setActiveId(id);
    setShowMobileChat(true);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  const handleSend = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "sent",
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              lastTime: "Just now",
              messages: [...c.messages, newMsg],
            }
          : c
      )
    );

    setInputText("");
  };

  const filteredConvs = conversations.filter((c) => {
    const matches =
      c.participant.name.toLowerCase().includes(search.toLowerCase()) ||
      c.participant.company.toLowerCase().includes(search.toLowerCase()) ||
      c.job.title.toLowerCase().includes(search.toLowerCase());
    if (filter === "unread") return matches && c.unread > 0;
    return matches;
  });

  return (
    <div className="h-[calc(100vh-68px)] w-full bg-[#111b21] font-inter text-slate-100 flex flex-col overflow-hidden">
      {/* ── WhatsApp Main Container ── */}
      <div className="flex-1 flex w-full max-w-[1600px] mx-auto overflow-hidden shadow-2xl border-t border-[#222d34]">
        
        {/* ── LEFT SIDEBAR: WhatsApp Contact List ── */}
        <div
          className={`w-full md:w-[380px] lg:w-[420px] shrink-0 bg-[#111b21] border-r border-[#222d34] flex flex-col ${
            showMobileChat ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Sidebar Top Header */}
          <div className="h-16 bg-[#202c33] px-4 flex items-center justify-between border-b border-[#222d34] shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center font-extrabold text-white text-base shadow">
                A
              </div>
              <span className="font-extrabold text-sm text-white font-satoshi">Recruiter Messages</span>
            </div>

            <div className="flex items-center gap-3 text-slate-400">
              <Sparkles size={18} className="text-amber-400" />
              <MoreVertical size={18} className="cursor-pointer hover:text-white" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-3 bg-[#111b21] border-b border-[#222d34]">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search or start new chat"
                className="w-full rounded-lg bg-[#202c33] pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 outline-none border-none"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2.5 mt-3 text-xs font-semibold font-satoshi">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  filter === "all"
                    ? "bg-[#00a884] text-[#0b141a] font-black shadow-[0_0_15px_rgba(0,168,132,0.4)] border border-[#00a884]"
                    : "bg-[#202c33] text-slate-300 border border-[#222d34] hover:bg-[#2a3942] hover:text-white"
                }`}
              >
                All Chats
              </button>
              <button
                type="button"
                onClick={() => setFilter("unread")}
                className={`px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  filter === "unread"
                    ? "bg-[#00a884] text-[#0b141a] font-black shadow-[0_0_15px_rgba(0,168,132,0.4)] border border-[#00a884]"
                    : "bg-[#202c33] text-slate-300 border border-[#222d34] hover:bg-[#2a3942] hover:text-white"
                }`}
              >
                <span>Unread</span>
                {conversations.some((c) => c.unread > 0) && (
                  <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-extrabold ${
                    filter === "unread" ? "bg-[#0b141a] text-[#00a884]" : "bg-[#00a884] text-[#0b141a]"
                  }`}>
                    {conversations.reduce((acc, c) => acc + c.unread, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#222d34]/60">
            {filteredConvs.map((conv) => {
              const isActive = conv.id === activeId;
              const lastMsg = conv.messages[conv.messages.length - 1];

              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConv(conv.id)}
                  className={`p-3.5 flex items-center gap-3 transition cursor-pointer relative ${
                    isActive ? "bg-[#2a3942]" : "hover:bg-[#202c33]"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-extrabold text-white text-base shadow">
                      {conv.participant.name.charAt(0)}
                    </div>
                    {conv.participant.online && (
                      <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-[#00a884] ring-2 ring-[#111b21]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white truncate font-satoshi">
                        {conv.participant.name}
                      </h4>
                      <span className="text-[11px] font-medium text-slate-400">{conv.lastTime}</span>
                    </div>

                    <p className="text-xs font-semibold text-[#00a884] truncate mt-0.5">
                      {conv.participant.company} • {conv.job.title}
                    </p>

                    <p className="text-xs text-slate-400 truncate mt-1 flex items-center gap-1">
                      {lastMsg?.sender === "user" && (
                        <CheckCheck size={14} className="text-[#53bdeb] shrink-0" />
                      )}
                      <span>{lastMsg?.text}</span>
                    </p>
                  </div>

                  {conv.unread > 0 && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-[10px] font-black text-black shadow">
                      {conv.unread}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT MAIN CHAT AREA: WhatsApp Active Chat Window ── */}
        <div
          className={`flex-1 bg-[#0b141a] flex flex-col relative ${
            !showMobileChat ? "hidden md:flex" : "flex"
          }`}
        >
          {/* WhatsApp Dark Chat Wallpaper Texture Overlay */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#202c33_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Active Chat Header */}
          <div className="h-16 bg-[#202c33] px-4 flex items-center justify-between border-b border-[#222d34] z-10 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setShowMobileChat(false)}
                className="md:hidden text-slate-400 hover:text-white p-1"
              >
                <ArrowLeft size={20} />
              </button>

              <div className="relative shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-extrabold text-white text-sm">
                  {activeConv.participant.name.charAt(0)}
                </div>
                {activeConv.participant.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#00a884] ring-2 ring-[#202c33]" />
                )}
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-extrabold text-white truncate font-satoshi">
                  {activeConv.participant.name}
                </h3>
                <p className="text-xs text-[#00a884] font-medium truncate">
                  {activeConv.participant.company} • {activeConv.participant.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-400 shrink-0">
              <Video size={19} className="cursor-pointer hover:text-white" />
              <Phone size={18} className="cursor-pointer hover:text-white" />
              <Search size={18} className="cursor-pointer hover:text-white" />
              <button
                type="button"
                onClick={() => setShowInfoPanel(!showInfoPanel)}
                className={`p-1 rounded-lg transition ${showInfoPanel ? "text-[#00a884]" : "hover:text-white"}`}
              >
                <Info size={19} />
              </button>
            </div>
          </div>

          {/* Main Chat Workspace + Option Details Sidebar */}
          <div className="flex-1 flex overflow-hidden z-10">
            {/* Timeline */}
            <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto">
              <div className="space-y-3">
                {/* Encrypted Disclaimer */}
                <div className="flex justify-center my-3">
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#182229] border border-[#222d34] px-3 py-1.5 text-[11px] text-[#8696a0] font-medium max-w-md text-center">
                    <Lock size={12} className="text-amber-400 shrink-0" />
                    Messages are end-to-end encrypted. No one outside of this chat can read them.
                  </div>
                </div>

                {/* Message Bubbles */}
                {activeConv.messages.map((msg) => {
                  const isUser = msg.sender === "user";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-md rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow ${
                          isUser
                            ? "bg-[#005c4b] text-white rounded-tr-none font-medium"
                            : "bg-[#202c33] text-slate-100 rounded-tl-none font-medium"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-300">
                          <span>{msg.timestamp}</span>
                          {isUser && <CheckCheck size={14} className="text-[#53bdeb]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* AI Quick Reply Chips */}
              <div className="py-2 flex items-center gap-2 overflow-x-auto pt-4 border-t border-[#222d34]">
                <span className="text-[10px] font-bold text-[#00a884] flex items-center gap-1 shrink-0 font-satoshi">
                  <Sparkles size={12} /> AI Quick Reply:
                </span>
                {SMART_REPLIES.map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    onClick={() => handleSend(reply)}
                    className="shrink-0 rounded-full border border-[#222d34] bg-[#202c33] px-3 py-1 text-[11px] text-slate-300 hover:bg-[#2a3942] hover:text-white transition cursor-pointer"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Recruiter Details Drawer (Desktop) */}
            {showInfoPanel && (
              <div className="hidden lg:flex w-72 shrink-0 bg-[#111b21] border-l border-[#222d34] flex-col p-4 space-y-5 overflow-y-auto">
                <div className="text-center pt-2">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-extrabold text-white text-2xl mx-auto shadow-lg">
                    {activeConv.participant.name.charAt(0)}
                  </div>
                  <h4 className="mt-3 text-sm font-extrabold text-white font-satoshi">
                    {activeConv.participant.name}
                  </h4>
                  <p className="text-xs font-bold text-[#00a884] mt-0.5">{activeConv.participant.company}</p>
                  <p className="text-xs text-slate-400">{activeConv.participant.role}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#202c33] border border-[#222d34] space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Position Details</span>
                  <h5 className="font-bold text-white text-xs">{activeConv.job.title}</h5>
                  <p className="text-slate-400 text-[11px]">{activeConv.job.location}</p>
                  <p className="font-bold text-[#00a884] text-[11px] mt-1">{activeConv.job.salary}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#202c33] border border-[#222d34] space-y-1 text-[11px] text-slate-300">
                  <p className="truncate">📧 {activeConv.participant.email}</p>
                  <p>📞 {activeConv.participant.phone}</p>
                </div>
              </div>
            )}
          </div>

          {/* WhatsApp Bottom Input Bar */}
          <div className="h-16 bg-[#202c33] px-4 flex items-center gap-3 border-t border-[#222d34] z-10 shrink-0">
            <Smile size={20} className="text-slate-400 hover:text-white cursor-pointer" />
            <Paperclip size={20} className="text-slate-400 hover:text-white cursor-pointer" />

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 rounded-xl bg-[#2a3942] px-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none border-none"
            />

            {inputText.trim() ? (
              <button
                type="button"
                onClick={() => handleSend()}
                className="h-10 w-10 rounded-full bg-[#00a884] flex items-center justify-center text-black font-bold shadow hover:scale-105 transition cursor-pointer"
              >
                <Send size={16} />
              </button>
            ) : (
              <Mic size={20} className="text-slate-400 hover:text-white cursor-pointer" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
