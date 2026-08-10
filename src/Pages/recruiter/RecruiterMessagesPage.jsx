/**
 * src/Pages/recruiter/RecruiterMessagesPage.jsx
 *
 * Recruiter-side real-time chat page.
 * - Wraps inside RecruiterLayout (sidebar, navbar, etc.)
 * - Reuses the same WhatsApp-style MessagesPage UI
 * - Reads ?convId= from URL to auto-open a conversation
 *   (set by Message buttons on Applications/Candidates pages)
 * - Full WebSocket real-time: sends, typing, presence, read receipts
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
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
  Loader2,
  Trash2,
  RefreshCw,
  WifiOff,
  Wifi,
  Users,
} from "lucide-react";
import RecruiterLayout from "../../components/recruiter/layout/RecruiterLayout";
import { useToast } from "../../components/ui/ToastNotification";
import { useChat } from "../../hooks/useChat";
import { useAppSelector } from "../../State/Store";
import { getOtherParticipant } from "../../api/chatApi";

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

const SMART_REPLIES = [
  "Thank you for applying! We'd love to schedule a call.",
  "Could you share your available times this week?",
  "We've reviewed your application — great fit!",
  "What is your current notice period?",
  "We'd like to move forward with next steps.",
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

function getInitial(name) {
  return (name || "?").charAt(0).toUpperCase();
}

function getProfileImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `http://localhost:8080/${clean}`;
}

/* ─── Avatar component ─────────────────────────────────────────────────────── */
function ChatAvatar({ user, size = "md", online = false }) {
  const sizeClass = size === "sm" ? "h-8 w-8 text-xs" : size === "lg" ? "h-16 w-16 text-2xl" : "h-10 w-10 text-sm";
  const dotSize = size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3";
  const imgUrl = getProfileImageUrl(user?.profileImage);

  return (
    <div className="relative shrink-0">
      {imgUrl ? (
        <img
          src={imgUrl}
          alt={user?.name || "Candidate"}
          className={`${sizeClass} rounded-full object-cover`}
          onError={(e) => { e.target.style.display = "none"; if (e.target.nextSibling) e.target.nextSibling.style.display = "flex"; }}
        />
      ) : null}
      <div
        className={`${sizeClass} rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-extrabold text-white shadow ${imgUrl ? "hidden" : "flex"}`}
      >
        {getInitial(user?.name)}
      </div>
      {online && (
        <span className={`absolute bottom-0 right-0 ${dotSize} rounded-full bg-[#00a884] ring-2 ring-[#111b21]`} />
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

      // If URL has a specific convId, open it; else auto-select first
      if (urlConvIdNum && list.some((c) => c.id === urlConvIdNum)) {
        setActiveConvId(urlConvIdNum);
        setShowMobileChat(true);
      } else if (list.length > 0 && !activeConvId) {
        setActiveConvId(list[0].id);
      }
    } catch (err) {
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
        prev.map((c) => (c.id === convId ? { ...c, myUnreadCount: 0 } : c))
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
    if (convId === activeConvId) { setShowMobileChat(true); return; }
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
      title="Messages"
      subtitle="Chat directly with candidates in real-time."
      breadcrumbs={[{ label: "Messages" }]}
    >
      {/* Full-height chat container */}
      <div className="h-[calc(100vh-140px)] min-h-[600px] w-full bg-[#111b21] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex font-inter text-slate-100">

        {/* ── Conversation Sidebar ───────────────────────────────────────── */}
        <div
          className={`w-full md:w-[340px] lg:w-[380px] shrink-0 bg-[#111b21] border-r border-[#222d34] flex flex-col ${
            showMobileChat ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Sidebar Header */}
          <div className="h-14 bg-[#202c33] px-4 flex items-center justify-between border-b border-[#222d34] shrink-0">
            <div className="flex items-center gap-3">
              <Users size={16} className="text-[#00a884]" />
              <div>
                <span className="font-extrabold text-sm text-white font-satoshi block leading-tight">
                  Candidate Messages
                </span>
                {chat.connected ? (
                  <span className="text-[10px] text-[#00a884] flex items-center gap-1">
                    <Wifi size={9} /> Live
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <WifiOff size={9} /> Offline
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={loadAllConversations}
              title="Refresh conversations"
              className="text-slate-400 hover:text-white p-1"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {/* Search + Filter */}
          <div className="p-3 bg-[#111b21] border-b border-[#222d34]">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidates, jobs, messages…"
                className="w-full rounded-lg bg-[#202c33] pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 outline-none"
              />
            </div>
            <div className="flex items-center gap-2 mt-2.5 text-[11px] font-bold">
              {["all", "unread"].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-full transition cursor-pointer capitalize font-bold ${
                    filter === f
                      ? "bg-[#0a332c] text-[#00a884] border border-[#00a884]/40"
                      : "bg-[#202c33] text-[#8696a0] border border-transparent hover:bg-[#2a3942]"
                  }`}
                >
                  {f}
                  {f === "unread" && totalUnread > 0 && (
                    <span className="ml-1.5 bg-[#00a884] text-black font-black px-1 rounded-full text-[9px]">
                      {totalUnread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#222d34]/60">
            {loadingConvs ? (
              <div className="flex items-center justify-center h-32 gap-2">
                <Loader2 size={20} className="text-[#00a884] animate-spin" />
                <span className="text-xs text-slate-400">Loading…</span>
              </div>
            ) : filteredConvs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-2 px-4 text-center">
                <MessageSquare size={28} className="text-slate-600" />
                <p className="text-xs text-slate-400">
                  {search ? "No matches found." : "No conversations yet. Message a candidate from the Applications or Candidates page."}
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
                    className={`p-3 flex items-center gap-3 cursor-pointer transition ${
                      isActive ? "bg-[#2a3942]" : "hover:bg-[#202c33]"
                    }`}
                  >
                    {/* Avatar */}
                    <ChatAvatar user={other} online={isOnline} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate">{other?.name || "Candidate"}</h4>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                          {formatMsgTime(conv.lastMessageAt || conv.updatedAt)}
                        </span>
                      </div>
                      {conv.jobTitle && (
                        <p className="text-[10px] font-semibold text-[#00a884] truncate">
                          {conv.jobTitle}
                        </p>
                      )}
                      <p className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                        {lastMsgIsMe && <CheckCheck size={11} className="text-[#53bdeb] shrink-0" />}
                        <span>
                          {lastMsg?.deleted
                            ? "This message was deleted."
                            : lastMsg?.displayContent || lastMsg?.content || (typeof lastMsg === "string" ? lastMsg : "No messages yet")}
                        </span>
                      </p>
                    </div>

                    {unread > 0 && (
                      <span className="h-4 w-4 shrink-0 flex items-center justify-center rounded-full bg-[#00a884] text-[9px] font-black text-black">
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
          className={`flex-1 bg-[#0b141a] flex flex-col relative ${
            !showMobileChat ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Wallpaper */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#202c33_1px,transparent_1px)] [background-size:16px_16px]" />

          {!activeConv ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4 z-10">
              <div className="h-16 w-16 rounded-full bg-[#202c33] flex items-center justify-center">
                <MessageSquare size={28} className="text-[#00a884]" />
              </div>
              <h2 className="text-lg font-black text-white font-satoshi">
                Recruiter Messaging
              </h2>
              <p className="text-xs text-slate-400 max-w-sm">
                Select a conversation to start messaging candidates, or click "Message" on any candidate in Applications or Candidates.
              </p>
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#182229] border border-[#222d34] px-3 py-1.5 text-[11px] text-[#8696a0]">
                <Lock size={11} className="text-amber-400 shrink-0" />
                End-to-end encrypted
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="h-14 bg-[#202c33] px-4 flex items-center justify-between border-b border-[#222d34] z-10 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={() => setShowMobileChat(false)}
                    className="md:hidden text-slate-400 hover:text-white p-1"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="relative shrink-0">
                    <ChatAvatar user={otherParticipant} size="sm" online={otherOnline || otherParticipant?.online} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-extrabold text-white truncate font-satoshi">
                      {otherParticipant?.name || "Candidate"}
                    </h3>
                    <p className="text-[11px]">
                      {otherTyping ? (
                        <span className="text-[#00a884] animate-pulse">typing…</span>
                      ) : otherOnline || otherParticipant?.online ? (
                        <span className="text-[#00a884]">online</span>
                      ) : otherParticipant?.lastSeenAt ? (
                        <span className="text-slate-400">last seen {formatMsgTime(otherParticipant.lastSeenAt)}</span>
                      ) : (
                        <span className="text-slate-500">offline</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-400 shrink-0">
                  <Search size={16} className="cursor-pointer hover:text-white" />
                  <button
                    type="button"
                    onClick={() => setShowInfoPanel(!showInfoPanel)}
                    className={`p-1 ${showInfoPanel ? "text-[#00a884]" : "hover:text-white"}`}
                  >
                    <Info size={17} />
                  </button>
                </div>
              </div>

              {/* Messages + Info Panel */}
              <div className="flex-1 flex overflow-hidden z-10">
                <div className="flex-1 flex flex-col overflow-hidden">
                  {hasMore && (
                    <div className="flex justify-center pt-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => loadMessagesPage(activeConvId, page + 1)}
                        disabled={loadingOlder}
                        className="text-[11px] text-[#00a884] font-bold flex items-center gap-1.5 hover:underline cursor-pointer"
                      >
                        {loadingOlder && <Loader2 size={11} className="animate-spin" />}
                        Load older messages
                      </button>
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <div className="flex justify-center my-2">
                      <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#182229] border border-[#222d34] px-3 py-1.5 text-[11px] text-[#8696a0]">
                        <Lock size={11} className="text-amber-400 shrink-0" />
                        Messages are end-to-end encrypted.
                      </div>
                    </div>

                    {loadingMsgs ? (
                      <div className="flex justify-center py-10">
                        <Loader2 size={24} className="text-[#00a884] animate-spin" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 gap-2">
                        <MessageSquare size={24} className="text-slate-600" />
                        <p className="text-xs text-slate-500">No messages yet. Say hello!</p>
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
                              className={`relative max-w-[85%] sm:max-w-md rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow ${
                                isMe
                                  ? "bg-[#005c4b] text-white rounded-tr-none"
                                  : "bg-[#202c33] text-slate-100 rounded-tl-none"
                              } ${isDeleted ? "opacity-60 italic" : ""}`}
                            >
                              <p>
                                {isDeleted ? "This message was deleted." : msg.displayContent || msg.content}
                                {msg.edited && !isDeleted && (
                                  <em className="text-[10px] text-slate-400 ml-1">(edited)</em>
                                )}
                              </p>
                              <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-slate-300">
                                <span>{formatMsgTime(msg.sentAt)}</span>
                                {isMe && !isDeleted && (
                                  isOptimistic
                                    ? <Check size={12} className="text-slate-400" />
                                    : <CheckCheck size={12} className="text-[#53bdeb]" />
                                )}
                              </div>
                              {isMe && !isDeleted && !isOptimistic && (
                                <button
                                  type="button"
                                  onClick={() => handleDelete(msg)}
                                  className="absolute -top-2 -left-7 opacity-0 group-hover:opacity-100 p-1 rounded-full bg-[#182229] border border-[#222d34] text-rose-400 hover:text-rose-300 transition"
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
                          <div className="bg-[#202c33] rounded-2xl rounded-tl-none px-4 py-2.5 flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#8696a0] animate-bounce [animation-delay:0ms]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-[#8696a0] animate-bounce [animation-delay:150ms]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-[#8696a0] animate-bounce [animation-delay:300ms]" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Replies */}
                  <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto border-t border-[#222d34] shrink-0 bg-[#0b141a]">
                    <span className="text-[10px] font-bold text-[#00a884] flex items-center gap-1 shrink-0 font-satoshi">
                      <Sparkles size={11} /> Quick Reply:
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

                {/* Info Panel */}
                {showInfoPanel && (
                  <div className="hidden lg:flex w-64 shrink-0 bg-[#111b21] border-l border-[#222d34] flex-col p-4 space-y-4 overflow-y-auto">
                    <div className="text-center pt-2">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-extrabold text-white text-xl mx-auto">
                        {getInitial(otherParticipant?.name)}
                      </div>
                      <h4 className="mt-2 text-sm font-extrabold text-white font-satoshi">
                        {otherParticipant?.name || "Candidate"}
                      </h4>
                      {otherParticipant?.email && (
                        <p className="text-[10px] text-slate-400 mt-0.5">{otherParticipant.email}</p>
                      )}
                    </div>

                    {activeConv?.jobTitle && (
                      <div className="p-3 rounded-xl bg-[#202c33] border border-[#222d34] text-xs space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Job</span>
                        <p className="font-bold text-white">{activeConv.jobTitle}</p>
                      </div>
                    )}

                    <div className="p-3 rounded-xl bg-[#202c33] border border-[#222d34] text-[11px] space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full ${otherOnline || otherParticipant?.online ? "bg-[#00a884]" : "bg-slate-500"}`} />
                        <span className="text-slate-300">{otherOnline || otherParticipant?.online ? "Online now" : "Offline"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Bar */}
              <div className="h-14 bg-[#202c33] px-4 flex items-center gap-3 border-t border-[#222d34] z-10 shrink-0">
                <Smile size={18} className="text-slate-400 hover:text-white cursor-pointer" />
                <Paperclip size={18} className="text-slate-400 hover:text-white cursor-pointer" />
                <input
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Type a message…"
                  maxLength={5000}
                  className="flex-1 rounded-xl bg-[#2a3942] px-4 py-2 text-xs text-white placeholder-slate-400 outline-none"
                />
                {inputText.trim() ? (
                  <button
                    type="button"
                    onClick={() => handleSend()}
                    className="h-9 w-9 rounded-full bg-[#00a884] flex items-center justify-center text-black shadow hover:scale-105 transition cursor-pointer"
                  >
                    <Send size={14} />
                  </button>
                ) : (
                  <Mic size={18} className="text-slate-400 hover:text-white cursor-pointer" />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </RecruiterLayout>
  );
}
