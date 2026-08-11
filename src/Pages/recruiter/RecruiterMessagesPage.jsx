/**
 * src/Pages/recruiter/RecruiterMessagesPage.jsx
 *
 * Recruiter Studio Real-time Chat Page.
 *
 * Features:
 * - Clear identification of Candidates, their applied jobs, and profile credentials
 * - WebSocket real-time: instant sends, typing indicators, read receipts, live presence
 * - 100% mobile-responsive layout inside RecruiterLayout
 * - Removed mock call buttons in favor of professional recruitment tools
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Send,
  CheckCheck,
  Check,
  ArrowLeft,
  Lock,
  MessageSquare,
  Sparkles,
  Info,
  Loader2,
  Trash2,
  RefreshCw,
  WifiOff,
  Wifi,
  Users,
  Briefcase,
  UserCheck,
  X,
  Mail,
  FileText,
} from "lucide-react";
import RecruiterLayout from "../../components/recruiter/layout/RecruiterLayout";
import { useToast } from "../../components/ui/ToastNotification";
import { useChat } from "../../hooks/useChat";
import { useAppSelector } from "../../State/Store";
import { getOtherParticipant } from "../../api/chatApi";

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

const RECRUITER_QUICK_REPLIES = [
  "Thank you for applying! We'd love to schedule an interview.",
  "Could you share your availability for a 30-min screening call?",
  "We reviewed your resume and would like to move forward.",
  "What is your current notice period and expected compensation?",
  "Please let us know if you have any questions about the role.",
];

function formatMsgTime(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();
    if (isToday) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (isYesterday) return "Yesterday";
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

function getProfileImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `http://localhost:8080/${clean}`;
}

function getInitial(name) {
  return (name || "?").charAt(0).toUpperCase();
}

/* ─── Candidate Avatar with Live Online Badge ───────────────────────────────── */
function ChatAvatar({ user, size = "md", online = false }) {
  const sizeClass =
    size === "sm"
      ? "h-8 w-8 text-xs"
      : size === "lg"
      ? "h-16 w-16 text-2xl"
      : "h-11 w-11 text-sm";
  const dotSize = size === "sm" ? "h-2.5 w-2.5" : "h-3.5 w-3.5";
  const imgUrl = getProfileImageUrl(user?.profileImage);

  return (
    <div className="relative shrink-0">
      {imgUrl ? (
        <img
          src={imgUrl}
          alt={user?.name || "Candidate"}
          className={`${sizeClass} rounded-2xl object-cover ring-2 ring-indigo-500/40`}
          onError={(e) => {
            e.target.style.display = "none";
            if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      <div
        className={`${sizeClass} rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center font-extrabold text-white shadow-lg ${
          imgUrl ? "hidden" : "flex"
        }`}
      >
        {getInitial(user?.name)}
      </div>
      {online && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 ${dotSize} rounded-full bg-emerald-400 ring-2 ring-[#0f172a] shadow-sm`}
          title="Online"
        />
      )}
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────────── */

export default function RecruiterMessagesPage() {
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const currentUser = useAppSelector((state) => state.auth.profile);
  const currentUserId = currentUser?.id;
  const chat = useChat();

  const urlConvId = searchParams.get("convId");
  const urlConvIdNum = urlConvId ? Number(urlConvId) : null;

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [otherOnline, setOtherOnline] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimerRef = useRef(null);
  const prevConvIdRef = useRef(null);

  const activeConv = conversations.find((c) => c.id === activeConvId) || null;
  const otherParticipant = useMemo(
    () => getOtherParticipant(activeConv, currentUserId),
    [activeConv, currentUserId]
  );

  // Load conversations on mount
  useEffect(() => {
    loadAllConversations();
  }, []);

  const loadAllConversations = async () => {
    setLoadingConvs(true);
    try {
      const data = await chat.loadConversations();
      const list = Array.isArray(data) ? data : [];
      setConversations(list);

      // If URL has a specific convId, open it; else auto-select first on desktop
      if (urlConvIdNum && list.some((c) => c.id === urlConvIdNum)) {
        setActiveConvId(urlConvIdNum);
        setShowMobileChat(true);
      } else if (list.length > 0 && !activeConvId && window.innerWidth >= 768) {
        setActiveConvId(list[0].id);
      }
    } catch {
      toast.error("Failed to load conversations.");
    } finally {
      setLoadingConvs(false);
    }
  };

  // Load messages & subscribe when activeConvId changes
  useEffect(() => {
    if (!activeConvId) return;

    if (prevConvIdRef.current && prevConvIdRef.current !== activeConvId) {
      chat.unsubscribeFromConversation(prevConvIdRef.current);
    }
    prevConvIdRef.current = activeConvId;

    setMessages([]);
    setPage(0);
    setHasMore(false);
    setOtherTyping(false);

    const conv = conversations.find((c) => c.id === activeConvId);
    const other = getOtherParticipant(conv, currentUserId);
    setOtherOnline(Boolean(other?.online));

    loadMessagesPage(activeConvId, 0);
    subscribeAndRead(activeConvId);

    return () => clearTimeout(typingTimerRef.current);
  }, [activeConvId]);

  const loadMessagesPage = async (convId, pageNum) => {
    if (pageNum === 0) setLoadingMsgs(true);
    else setLoadingOlder(true);
    try {
      const pageData = await chat.loadMessages(convId, pageNum);
      const content = pageData?.content ?? (Array.isArray(pageData) ? pageData : []);
      const items = [...content].reverse();
      if (pageNum === 0) {
        setMessages(items);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      } else {
        setMessages((prev) => [...items, ...prev]);
      }
      setHasMore(!pageData?.last && content.length > 0);
      setPage(pageNum);
    } catch {
      if (pageNum === 0) toast.error("Failed to load messages.");
    } finally {
      setLoadingMsgs(false);
      setLoadingOlder(false);
    }
  };

  const subscribeAndRead = useCallback(
    (convId) => {
      chat.markAsRead(convId);
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, myUnreadCount: 0, unreadCount: 0 } : c))
      );

      chat.subscribeToConversation(convId, {
        onMessage: (msg) => {
          setMessages((prev) => {
            const isOurOptimistic =
              msg.sender?.id === currentUserId &&
              prev.some((m) => m._optimistic && m.content === msg.content);
            if (isOurOptimistic) {
              return prev.map((m) =>
                m._optimistic && m.content === msg.content ? msg : m
              );
            }
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

          if (msg.sender?.id !== currentUserId) {
            chat.markAsRead(convId);
            setConversations((prev) =>
              prev.map((c) =>
                c.id === convId ? { ...c, lastMessage: msg, lastMessageAt: msg.sentAt } : c
              )
            );
          }
        },
        onTyping: (data) => {
          if (data.userId !== currentUserId) setOtherTyping(data.typing === true);
        },
        onRead: () => {},
        onPresence: (presence) => {
          if (presence.user?.id !== currentUserId) {
            setOtherOnline(presence.online === true);
            setConversations((prev) =>
              prev.map((c) =>
                c.id !== convId
                  ? c
                  : {
                      ...c,
                      otherParticipant: {
                        ...(c.otherParticipant || {}),
                        online: presence.online === true,
                      },
                    }
              )
            );
          }
        },
      });
    },
    [chat, currentUserId]
  );

  const handleSelectConv = (convId) => {
    setActiveConvId(convId);
    setShowMobileChat(true);
  };

  const handleSend = (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeConvId) return;

    const optimisticMsg = {
      id: `opt-${Date.now()}`,
      _optimistic: true,
      conversationId: activeConvId,
      sender: { id: currentUserId, name: currentUser?.name || "You" },
      content: text,
      displayContent: text,
      messageType: "TEXT",
      sentAt: new Date().toISOString(),
      deleted: false,
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 30);

    const sent = chat.sendMessage(activeConvId, text);
    if (!sent) {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
      toast.error("Message failed to send — WebSocket not connected.");
    } else {
      clearTimeout(typingTimerRef.current);
      chat.sendTyping(activeConvId, false);
    }
    setInputText("");
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    chat.sendTyping(activeConvId, true);
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => chat.sendTyping(activeConvId, false), 2000);
  };

  const handleDelete = async (msg) => {
    try {
      const updated = await chat.deleteMessage(activeConvId, msg.id);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msg.id ? (updated || { ...m, deleted: true, content: "This message was deleted." }) : m
        )
      );
      toast.success("Message deleted.");
    } catch {
      toast.error("Failed to delete message.");
    }
  };

  // ── Multi-field Search Filter ─────────────────────────────────────────────
  const filteredConvs = useMemo(() => {
    return conversations.filter((c) => {
      const other = getOtherParticipant(c, currentUserId);
      const name = (other?.name || "").toLowerCase();
      const email = (other?.email || "").toLowerCase();
      const jobTitle = (c.jobTitle || "").toLowerCase();
      const title = (c.title || "").toLowerCase();
      const lastMsg = (
        typeof c.lastMessage === "string"
          ? c.lastMessage
          : c.lastMessage?.displayContent || c.lastMessage?.content || ""
      ).toLowerCase();

      const q = search.toLowerCase().trim();
      const matches =
        !q ||
        name.includes(q) ||
        email.includes(q) ||
        jobTitle.includes(q) ||
        title.includes(q) ||
        lastMsg.includes(q);

      const unreadCount = c.myUnreadCount || c.unreadCount || 0;
      if (filter === "unread") return matches && unreadCount > 0;
      return matches;
    });
  }, [conversations, currentUserId, search, filter]);

  const totalUnread = conversations.reduce((acc, c) => acc + (c.myUnreadCount || c.unreadCount || 0), 0);

  return (
    <RecruiterLayout
      title="Candidate Messages"
      subtitle="Direct real-time candidate communications, screening, and interview coordination."
      breadcrumbs={[{ label: "Messages" }]}
    >
      {/* Full-height Container */}
      <div className="h-[calc(100vh-140px)] min-h-[580px] w-full bg-[#0a0f18] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex font-inter text-slate-100">

        {/* ── Conversation Sidebar ───────────────────────────────────────── */}
        <div
          className={`w-full md:w-[350px] lg:w-[380px] shrink-0 bg-[#0d131f] border-r border-white/10 flex flex-col ${
            showMobileChat ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Header */}
          <div className="h-16 bg-[#0f172a]/95 px-4 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-extrabold text-white shadow-lg">
                <Users size={18} />
              </div>
              <div>
                <span className="font-extrabold text-sm text-white font-satoshi block leading-tight">
                  Candidate Chats
                </span>
                {chat.connected ? (
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live Realtime
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <WifiOff size={10} /> Offline Mode
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={loadAllConversations}
              title="Refresh Conversations"
              className="p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <RefreshCw size={14} className={loadingConvs ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Search + Filters */}
          <div className="p-3.5 bg-[#0d131f] border-b border-white/10 space-y-3">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidates, roles, messages…"
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none focus:border-indigo-500/60 font-medium"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 text-xs font-bold font-satoshi">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer ${
                  filter === "all"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                All Candidates
              </button>

              <button
                type="button"
                onClick={() => setFilter("unread")}
                className={`px-3.5 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                  filter === "unread"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>Unread</span>
                {totalUnread > 0 && (
                  <span className="bg-rose-500 text-white font-black px-1.5 rounded-full text-[10px]">
                    {totalUnread}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {loadingConvs ? (
              <div className="flex flex-col items-center justify-center h-44 gap-3">
                <Loader2 size={24} className="text-indigo-400 animate-spin" />
                <span className="text-xs text-slate-400">Loading candidates…</span>
              </div>
            ) : filteredConvs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 gap-3 px-6 text-center">
                <MessageSquare size={32} className="text-slate-600" />
                <p className="text-xs font-semibold text-slate-300 font-satoshi">
                  {search ? "No candidate chats match your search." : "No candidate conversations yet."}
                </p>
                <p className="text-[11px] text-slate-500">
                  Click "Message" on any applicant from the Applications or Candidates Studio page to start a chat.
                </p>
              </div>
            ) : (
              filteredConvs.map((conv) => {
                const isActive = conv.id === activeConvId;
                const other = getOtherParticipant(conv, currentUserId);
                const isOnline = other?.online;
                const lastMsg = conv.lastMessage;
                const lastMsgIsMe = lastMsg?.sender?.id === currentUserId;
                const unread = conv.myUnreadCount || conv.unreadCount || 0;

                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConv(conv.id)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                      isActive
                        ? "bg-indigo-600/15 border-l-4 border-indigo-500"
                        : "hover:bg-white/[0.04]"
                    }`}
                  >
                    <ChatAvatar user={other} online={isOnline} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-sm font-extrabold text-white truncate font-satoshi">
                          {other?.name || "Candidate"}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {formatMsgTime(conv.lastMessageAt || conv.updatedAt)}
                        </span>
                      </div>

                      {/* Applied Role Badge */}
                      {conv.jobTitle && (
                        <p className="text-[11px] font-bold text-indigo-300 truncate mt-0.5 flex items-center gap-1">
                          <Briefcase size={10} className="shrink-0 text-indigo-400" />
                          <span>{conv.jobTitle}</span>
                        </p>
                      )}

                      {/* Last Message */}
                      <p className="text-xs text-slate-400 truncate mt-1 flex items-center gap-1">
                        {lastMsgIsMe && <CheckCheck size={13} className="text-indigo-400 shrink-0" />}
                        <span>
                          {lastMsg?.deleted
                            ? "This message was deleted."
                            : lastMsg?.displayContent || lastMsg?.content || (typeof lastMsg === "string" ? lastMsg : "No messages yet")}
                        </span>
                      </p>
                    </div>

                    {unread > 0 && (
                      <span className="h-5 w-5 shrink-0 flex items-center justify-center rounded-full bg-indigo-500 text-[10px] font-black text-white shadow">
                        {unread}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Chat Window ─────────────────────────────────────────────────── */}
        <div
          className={`flex-1 bg-[#090d16] flex flex-col relative ${
            !showMobileChat ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Wallpaper */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px]" />

          {!activeConv ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4 z-10">
              <div className="h-20 w-20 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center shadow-2xl">
                <MessageSquare size={36} className="text-indigo-400" />
              </div>
              <h2 className="text-xl font-black text-white font-satoshi">
                Candidate Direct Messaging
              </h2>
              <p className="text-xs text-slate-400 max-w-sm font-medium leading-relaxed">
                Select a candidate conversation to screen qualifications, coordinate interview dates, and send instant updates.
              </p>
              <div className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs text-slate-300">
                <Lock size={13} className="text-amber-400 shrink-0" />
                <span>End-to-end secured communications.</span>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="h-16 bg-[#0d131f]/95 px-4 sm:px-6 flex items-center justify-between border-b border-white/10 z-10 shrink-0 backdrop-blur-md">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => setShowMobileChat(false)}
                    className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-300 hover:text-white"
                  >
                    <ArrowLeft size={18} />
                  </button>

                  <ChatAvatar
                    user={otherParticipant}
                    size="sm"
                    online={otherOnline || otherParticipant?.online}
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-white truncate font-satoshi">
                        {otherParticipant?.name || "Candidate"}
                      </h3>
                      <span className="inline-flex items-center gap-1 rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-300 font-extrabold text-[9px] px-1.5 py-0.5">
                        <UserCheck size={9} /> Candidate
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] truncate mt-0.5">
                      {otherTyping ? (
                        <span className="text-emerald-400 font-bold animate-pulse">typing message…</span>
                      ) : otherOnline || otherParticipant?.online ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Active now
                        </span>
                      ) : otherParticipant?.lastSeenAt ? (
                        <span className="text-slate-400">last seen {formatMsgTime(otherParticipant.lastSeenAt)}</span>
                      ) : (
                        <span className="text-slate-500">Offline</span>
                      )}

                      {activeConv.jobTitle && (
                        <>
                          <span className="text-slate-600 hidden sm:inline">•</span>
                          <span className="text-indigo-300 font-bold hidden sm:inline truncate">
                            {activeConv.jobTitle}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowInfoPanel(!showInfoPanel)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      showInfoPanel
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-md"
                        : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Info size={14} />
                    <span className="hidden sm:inline">Candidate Profile</span>
                  </button>
                </div>
              </div>

              {/* Messages + Info Panel */}
              <div className="flex-1 flex overflow-hidden z-10">
                <div className="flex-1 flex flex-col overflow-hidden">
                  {hasMore && (
                    <div className="flex justify-center pt-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => loadMessagesPage(activeConvId, page + 1)}
                        disabled={loadingOlder}
                        className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-1 text-xs font-bold text-indigo-300 flex items-center gap-1.5 transition cursor-pointer"
                      >
                        {loadingOlder && <Loader2 size={12} className="animate-spin" />}
                        Load older messages
                      </button>
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                    <div className="flex justify-center my-1">
                      <div className="inline-flex items-center gap-1.5 rounded-xl bg-white/[0.03] border border-white/10 px-3.5 py-1.5 text-[11px] text-slate-400 text-center font-medium max-w-md">
                        <Lock size={12} className="text-amber-400 shrink-0" />
                        <span>Direct conversation between candidate and recruiter. All communications are private.</span>
                      </div>
                    </div>

                    {loadingMsgs ? (
                      <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <Loader2 size={28} className="text-indigo-400 animate-spin" />
                        <span className="text-xs text-slate-400 font-medium">Loading candidate messages…</span>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                        <MessageSquare size={32} className="text-slate-600" />
                        <h4 className="text-sm font-bold text-white font-satoshi">Start Screening Candidate</h4>
                        <p className="text-xs text-slate-400 max-w-xs">
                          Send a message to introduce yourself or propose an interview time.
                        </p>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isMe = msg.sender?.id === currentUserId;
                        const isDeleted = msg.deleted;
                        const isOptimistic = msg._optimistic;

                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col group ${isMe ? "items-end" : "items-start"}`}
                          >
                            <div
                              className={`relative max-w-[85%] sm:max-w-md rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-md transition-all ${
                                isMe
                                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-tr-none font-medium"
                                  : "bg-[#182234] border border-white/10 text-slate-100 rounded-tl-none font-medium"
                              } ${isDeleted ? "opacity-60 italic" : ""}`}
                            >
                              <p className="whitespace-pre-wrap break-words">
                                {isDeleted ? "This message was deleted." : msg.displayContent || msg.content}
                                {msg.edited && !isDeleted && (
                                  <em className="text-[10px] text-slate-300 ml-1.5">(edited)</em>
                                )}
                              </p>

                              <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-300/80">
                                <span>{formatMsgTime(msg.sentAt)}</span>
                                {isMe && !isDeleted && (
                                  isOptimistic ? (
                                    <Check size={12} className="text-white/60" />
                                  ) : (
                                    <CheckCheck size={13} className="text-sky-300" />
                                  )
                                )}
                              </div>

                              {isMe && !isDeleted && !isOptimistic && (
                                <button
                                  type="button"
                                  onClick={() => handleDelete(msg)}
                                  className="absolute -top-2 -left-7 opacity-0 group-hover:opacity-100 p-1.5 rounded-full bg-[#0d131f] border border-white/10 text-rose-400 hover:text-rose-300 transition"
                                  title="Delete message"
                                >
                                  <Trash2 size={11} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}

                    <AnimatePresence>
                      {otherTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          className="flex items-center gap-2"
                        >
                          <div className="bg-[#182234] border border-white/10 rounded-2xl rounded-tl-none px-4 py-2.5 flex items-center gap-1.5 shadow-md">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0ms]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:150ms]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:300ms]" />
                            <span className="text-[11px] text-slate-400 font-medium ml-1">typing…</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Recruiter Quick Replies */}
                  <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto border-t border-white/10 shrink-0 bg-[#0d131f]/70">
                    <span className="text-[11px] font-extrabold text-indigo-400 flex items-center gap-1 shrink-0 font-satoshi">
                      <Sparkles size={13} className="text-amber-400" /> Quick Reply:
                    </span>
                    {RECRUITER_QUICK_REPLIES.map((reply) => (
                      <button
                        key={reply}
                        type="button"
                        onClick={() => handleSend(reply)}
                        className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:bg-indigo-600/20 hover:border-indigo-500/40 hover:text-white transition cursor-pointer"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Candidate Info Panel / Drawer */}
                <AnimatePresence>
                  {showInfoPanel && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 300, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="shrink-0 bg-[#0d131f] border-l border-white/10 flex flex-col overflow-y-auto z-20"
                    >
                      <div className="p-5 space-y-6">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 font-satoshi">
                            Candidate Profile
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowInfoPanel(false)}
                            className="text-slate-400 hover:text-white p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        <div className="text-center space-y-2">
                          <ChatAvatar
                            user={otherParticipant}
                            size="lg"
                            online={otherOnline || otherParticipant?.online}
                          />
                          <h4 className="text-base font-black text-white font-satoshi mt-3">
                            {otherParticipant?.name || "Candidate"}
                          </h4>
                          <span className="inline-flex items-center gap-1 rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-300 font-extrabold text-[10px] px-2 py-0.5">
                            <UserCheck size={11} /> Registered Job Candidate
                          </span>
                          {otherParticipant.email && (
                            <p className="text-xs text-slate-400 truncate">{otherParticipant.email}</p>
                          )}
                        </div>

                        {/* Job Position Applied For */}
                        {activeConv?.jobTitle && (
                          <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4 space-y-1.5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                              <Briefcase size={13} /> Job Application
                            </span>
                            <h5 className="font-bold text-white text-xs">{activeConv.jobTitle}</h5>
                          </div>
                        )}

                        {/* Contact details */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2 text-xs">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Candidate Details
                          </span>
                          <div className="flex items-center gap-2 text-slate-300">
                            <Mail size={13} className="text-slate-400" />
                            <span className="truncate">{otherParticipant.email || "Email on file"}</span>
                          </div>
                        </div>

                        {/* Security notice */}
                        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3 text-[11px] text-slate-400 flex items-center gap-2">
                          <Lock size={14} className="text-amber-400 shrink-0" />
                          <span>Candidate data is synchronized with your recruitment studio.</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Input Bar */}
              <div className="h-16 bg-[#0d131f]/95 px-4 flex items-center gap-2.5 border-t border-white/10 z-10 shrink-0">
                <input
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Type message to candidate…"
                  maxLength={5000}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none focus:border-indigo-500/60 font-medium transition"
                />

                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!inputText.trim()}
                  className="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 cursor-pointer"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </RecruiterLayout>
  );
}
