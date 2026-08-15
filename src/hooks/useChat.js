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

import { useEffect, useRef, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { connectChat, disconnectChat } from "./useChatSocket";
import {
  getConversationsApi,
  getMessagesApi,
  markAsReadApi,
  getUnreadCountApi,
  deleteMessageApi,
  createOrGetConversationApi,
} from "../api/chatApi";

export function useChat() {
  const clientRef = useRef(null);
  const subsRef = useRef({});            // active subscriptions keyed by "conv-{id}"
  const [connected, setConnected] = useState(false);
  const [wsError, setWsError] = useState(null);

  // Authenticate based on Redux profile state.
  // HttpOnly cookie is automatically included in the WebSocket handshake.
  const user = useSelector((state) => state.auth.profile);

  // ── Connect on mount / when user is authenticated ──────────────────────────
  useEffect(() => {
    if (!user) {
      disconnectChat();
      setConnected(false);
      return;
    }

    connectChat(
      (stompClient) => {
        clientRef.current = stompClient;
        setConnected(true);
        setWsError(null);

        // Subscribe to personal server-push error queue
        stompClient.subscribe("/user/queue/errors", (msg) => {
          try {
            const err = JSON.parse(msg.body);
            console.error("[Chat] Server error:", err);
            setWsError(err?.message || "Chat error occurred");
          } catch {
            // ignore parse errors
          }
        });
      },
      (err) => {
        console.warn("[Chat] WebSocket connection failed — REST-only mode:", err?.message || err);
        setConnected(false);
        setWsError("WebSocket unavailable — messages will still load via REST.");
      }
    );

    return () => {
      // Unsubscribe all active subscriptions before disconnect
      Object.values(subsRef.current).forEach((subs) =>
        subs.forEach((s) => { try { s.unsubscribe(); } catch { /* ignore */ } })
      );
      subsRef.current = {};
      disconnectChat();
      setConnected(false);
    };
  }, [user]);

  // ── Subscribe to a conversation ──────────────────────────────────────────
  /**
   * Call this when the user opens a chat window.
   * Subscribes to 4 topics: messages, typing, read receipts, presence.
   *
   * @param {number|string} conversationId
   * @param {{ onMessage, onTyping, onRead, onPresence }} handlers
   */
  const subscribeToConversation = useCallback(
    (conversationId, handlers) => {
      const client = clientRef.current;
      if (!client || !connected) return;

      const key = `conv-${conversationId}`;
      if (subsRef.current[key]) return; // already subscribed

      const subs = [];
      const safeParse = (msg) => { try { return JSON.parse(msg.body); } catch { return null; } };

      subs.push(
        client.subscribe(`/topic/conversations/${conversationId}`, (msg) => {
          const data = safeParse(msg);
          if (data) handlers.onMessage?.(data);
        })
      );

      subs.push(
        client.subscribe(`/topic/conversations/${conversationId}/typing`, (msg) => {
          const data = safeParse(msg);
          if (data) handlers.onTyping?.(data);
        })
      );

      subs.push(
        client.subscribe(`/topic/conversations/${conversationId}/read`, (msg) => {
          const data = safeParse(msg);
          if (data) handlers.onRead?.(data);
        })
      );

      subs.push(
        client.subscribe(`/topic/conversations/${conversationId}/presence`, (msg) => {
          const data = safeParse(msg);
          if (data) handlers.onPresence?.(data);
        })
      );

      subsRef.current[key] = subs;
    },
    [connected]
  );

  // ── Unsubscribe when user closes the chat window ─────────────────────────
  const unsubscribeFromConversation = useCallback((conversationId) => {
    const key = `conv-${conversationId}`;
    const subs = subsRef.current[key];
    if (subs) {
      subs.forEach((s) => { try { s.unsubscribe(); } catch { /* ignore */ } });
      delete subsRef.current[key];
    }
  }, []);

  // ── Send message via WebSocket ────────────────────────────────────────────
  const sendMessage = useCallback((conversationId, content) => {
    if (!clientRef.current || !connected) {
      console.warn("[Chat] Cannot send — WebSocket not connected");
      return false;
    }
    clientRef.current.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({ conversationId, content }),
    });
    return true;
  }, [connected]);

  // ── Typing indicator ──────────────────────────────────────────────────────
  const sendTyping = useCallback((conversationId, isTyping) => {
    if (!clientRef.current || !connected) return;
    clientRef.current.publish({
      destination: "/app/chat.typing",
      body: JSON.stringify({ conversationId, typing: isTyping }),
    });
  }, [connected]);

  // ── Mark as read (REST + WebSocket broadcast) ─────────────────────────────
  const markAsRead = useCallback(async (conversationId) => {
    try {
      // REST: persist lastReadAt in DB
      await markAsReadApi(conversationId);
    } catch {
      // Non-critical — ignore
    }
    // WebSocket: broadcast read receipt to other participant
    if (clientRef.current && connected) {
      clientRef.current.publish({
        destination: "/app/chat.read",
        body: JSON.stringify({ conversationId, content: "" }),
      });
    }
  }, [connected]);

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
