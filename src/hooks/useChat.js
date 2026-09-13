/**
 * src/hooks/useChat.js
 *
 * Composite hook — bundles WebSocket real-time events + REST API calls
 * into a single clean interface for chat components.
 *
 * Usage:
 *   const chat = useChat();
 *   await chat.loadConversations();
 *   chat.sendMessage(convId, "Hello!");
 */

import { useEffect, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import {
  connectChat,
  disconnectChat,
  subscribeToConv,
  unsubscribeFromConv,
  publishMessage,
  publishTyping,
  publishRead,
} from "./useChatSocket";
import {
  getConversationsApi,
  getMessagesApi,
  sendChatMessageApi,
  markAsReadApi,
  getUnreadCountApi,
  deleteMessageApi,
  createOrGetConversationApi,
} from "../api/chatApi";

export function useChat() {
  const [connected, setConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("DISCONNECTED");
  const [wsError, setWsError] = useState(null);

  const user = useSelector((state) => state.auth.profile || state.auth.user);

  useEffect(() => {
    if (!user) {
      setConnected(false);
      setConnectionStatus("DISCONNECTED");
      return;
    }

    const handleStatus = (status, err) => {
      setConnectionStatus(status);
      setConnected(status === "CONNECTED");
      setWsError(err);
    };

    connectChat(
      () => {
        setConnected(true);
        setConnectionStatus("CONNECTED");
        setWsError(null);
      },
      (err) => {
        setConnected(false);
        setConnectionStatus("ERROR");
        setWsError(err?.message || "WebSocket disconnected — messages will send via REST.");
      },
      handleStatus
    );

    return () => {
      disconnectChat(handleStatus);
    };
  }, [user]);

  // ── Subscribe to a conversation (automatic resubscribe on reconnect) ───────
  const subscribeToConversation = useCallback((conversationId, handlers) => {
    subscribeToConv(conversationId, handlers);
  }, []);

  const unsubscribeFromConversation = useCallback((conversationId) => {
    unsubscribeFromConv(conversationId);
  }, []);

  // ── Dual-Transport Send Message (WebSocket + Guaranteed REST Fallback) ──
  const sendMessage = useCallback(
    async (conversationId, content) => {
      const trimmed = (content || "").trim();
      const convId = Number(conversationId);
      if (!trimmed || !convId) return { success: false, error: "Empty message" };

      // 1. Try WebSocket if connected
      if (connected) {
        const sent = publishMessage(convId, trimmed);
        if (sent) return { success: true, via: "websocket" };
      }

      // 2. Reliable REST Fallback
      try {
        const serverMsg = await sendChatMessageApi(convId, trimmed);
        return { success: true, via: "rest", data: serverMsg };
      } catch (restErr) {
        console.error(
          "[Chat] REST send error:",
          restErr?.response?.data?.message || restErr?.message
        );
        return {
          success: false,
          error:
            restErr?.response?.data?.message ||
            "Failed to send message. Please try again.",
        };
      }
    },
    [connected]
  );

  // ── Typing indicator ──────────────────────────────────────────────────────
  const sendTyping = useCallback((conversationId, isTyping) => {
    publishTyping(conversationId, isTyping);
  }, []);

  // ── Mark as read (REST + WebSocket broadcast) ─────────────────────────────
  const markAsRead = useCallback(async (conversationId) => {
    const convId = Number(conversationId);
    if (!convId) return;
    try {
      await markAsReadApi(convId);
    } catch {
      // Non-critical — ignore
    }
    publishRead(convId);
  }, []);

  // ── REST helpers ──────────────────────────────────────────────────────────
  const loadConversations = useCallback(() => getConversationsApi(), []);

  const createOrGetConversation = useCallback(
    (participantId, jobApplicationId = null) =>
      createOrGetConversationApi(participantId, jobApplicationId),
    []
  );

  const loadMessages = useCallback(
    (conversationId, page = 0) => getMessagesApi(conversationId, page),
    []
  );

  const deleteMessage = useCallback(
    (conversationId, messageId) => deleteMessageApi(conversationId, messageId),
    []
  );

  const getUnreadCount = useCallback(() => getUnreadCountApi(), []);

  return {
    connected,
    connectionStatus,
    wsError,
    subscribeToConversation,
    unsubscribeFromConversation,
    sendMessage,
    sendTyping,
    markAsRead,
    loadConversations,
    createOrGetConversation,
    loadMessages,
    deleteMessage,
    getUnreadCount,
  };
}
