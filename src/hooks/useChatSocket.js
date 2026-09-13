/**
 * src/hooks/useChatSocket.js
 *
 * Production-grade STOMP WebSocket Client Manager.
 *
 * Features:
 * - Reference-counted connection lifecycle (prevents disconnect/reconnect thrashing on fast navigation)
 * - StompJS native automatic reconnection (reconnectDelay: 5000)
 * - Dual authentication: Bearer token in CONNECT headers + query param + HttpOnly cookie
 * - Automatic re-subscription to active conversations upon reconnect
 */

import { Client } from "@stomp/stompjs";

const RAW_API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const WS_URL =
  import.meta.env.VITE_WS_URL ||
  RAW_API_URL.replace(/\/api\/?$/, "").replace(/^http/, "ws") + "/ws";

let stompClient = null;
let consumerCount = 0;
let disconnectTimer = null;
const statusListeners = new Set();
const activeHandlersByConv = new Map();
const activeStompSubsByConv = new Map();

function getStoredToken() {
  try {
    return localStorage.getItem("jobportal_token") || null;
  } catch {
    return null;
  }
}

function notifyStatus(status, error = null) {
  statusListeners.forEach((fn) => {
    try {
      fn(status, error);
    } catch {
      // ignore
    }
  });
}

function subscribeTopics(client, convId, handlers) {
  if (!client || !client.connected) return;

  unsubscribeTopics(convId);

  const subs = [];
  const safeParse = (msg) => {
    try {
      return JSON.parse(msg.body);
    } catch {
      return null;
    }
  };

  try {
    subs.push(
      client.subscribe(`/topic/conversations/${convId}`, (msg) => {
        const data = safeParse(msg);
        if (data) handlers.onMessage?.(data);
      })
    );

    subs.push(
      client.subscribe(`/topic/conversations/${convId}/typing`, (msg) => {
        const data = safeParse(msg);
        if (data) handlers.onTyping?.(data);
      })
    );

    subs.push(
      client.subscribe(`/topic/conversations/${convId}/read`, (msg) => {
        const data = safeParse(msg);
        if (data) handlers.onRead?.(data);
      })
    );

    subs.push(
      client.subscribe(`/topic/conversations/${convId}/presence`, (msg) => {
        const data = safeParse(msg);
        if (data) handlers.onPresence?.(data);
      })
    );

    activeStompSubsByConv.set(convId, subs);
  } catch (err) {
    console.warn(`[ChatSocket] Error subscribing to conv ${convId}:`, err);
  }
}

function unsubscribeTopics(convId) {
  const existing = activeStompSubsByConv.get(convId);
  if (existing) {
    existing.forEach((s) => {
      try {
        s.unsubscribe();
      } catch {
        // ignore
      }
    });
    activeStompSubsByConv.delete(convId);
  }
}

function resubscribeAllActive(client) {
  activeHandlersByConv.forEach((handlers, convId) => {
    subscribeTopics(client, convId, handlers);
  });
}

/**
 * Connect to chat WebSocket. Reuses active connection if already established.
 */
export function connectChat(onConnected, onError, onStatusChange) {
  if (disconnectTimer) {
    clearTimeout(disconnectTimer);
    disconnectTimer = null;
  }

  consumerCount++;

  if (onStatusChange) {
    statusListeners.add(onStatusChange);
  }

  // If already connected, immediately notify caller
  if (stompClient && stompClient.connected) {
    onStatusChange?.("CONNECTED");
    onConnected?.(stompClient);
    return stompClient;
  }

  // If already activating, wait for onConnect
  if (stompClient && stompClient.active) {
    onStatusChange?.("CONNECTING");
    return stompClient;
  }

  const token = getStoredToken();
  const brokerURL = token ? `${WS_URL}?token=${encodeURIComponent(token)}` : WS_URL;

  stompClient = new Client({
    brokerURL,
    connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    reconnectDelay: 5000,

    beforeConnect: () => {
      const freshToken = getStoredToken();
      if (freshToken && stompClient) {
        stompClient.brokerURL = `${WS_URL}?token=${encodeURIComponent(freshToken)}`;
        stompClient.connectHeaders = { Authorization: `Bearer ${freshToken}` };
      }
    },

    onConnect: (frame) => {
      console.log("[ChatSocket] Connected:", frame?.headers?.server || "ok");
      notifyStatus("CONNECTED", null);
      onConnected?.(stompClient);

      // Auto-resubscribe open chat windows
      resubscribeAllActive(stompClient);
    },

    onStompError: (frame) => {
      const msg = frame?.headers?.message || "STOMP error";
      console.warn("[ChatSocket] STOMP error:", msg);
      notifyStatus("ERROR", msg);
      onError?.(frame);
    },

    onWebSocketClose: () => {
      notifyStatus("DISCONNECTED", null);
    },

    onWebSocketError: (event) => {
      console.warn("[ChatSocket] WebSocket error:", event?.type || event);
      notifyStatus("RECONNECTING", null);
    },
  });

  notifyStatus("CONNECTING", null);
  stompClient.activate();
  return stompClient;
}

/**
 * Disconnect with a grace period to avoid thrashing during rapid re-mounts.
 */
export function disconnectChat(onStatusChange) {
  if (onStatusChange) {
    statusListeners.delete(onStatusChange);
  }

  consumerCount = Math.max(0, consumerCount - 1);

  if (consumerCount === 0) {
    disconnectTimer = setTimeout(() => {
      if (consumerCount === 0 && stompClient) {
        console.log("[ChatSocket] No consumers, deactivating socket...");
        stompClient.deactivate();
        stompClient = null;
        activeStompSubsByConv.clear();
      }
    }, 2000);
  }
}

export function subscribeToConv(convId, handlers) {
  const cId = Number(convId);
  if (!cId || isNaN(cId)) return;

  activeHandlersByConv.set(cId, handlers);
  if (stompClient && stompClient.connected) {
    subscribeTopics(stompClient, cId, handlers);
  }
}

export function unsubscribeFromConv(convId) {
  const cId = Number(convId);
  if (!cId || isNaN(cId)) return;

  activeHandlersByConv.delete(cId);
  unsubscribeTopics(cId);
}

export function publishMessage(convId, content) {
  if (!stompClient || !stompClient.connected) return false;
  try {
    stompClient.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({ conversationId: Number(convId), content }),
    });
    return true;
  } catch (err) {
    console.warn("[ChatSocket] publishMessage error:", err);
    return false;
  }
}

export function publishTyping(convId, isTyping) {
  if (!stompClient || !stompClient.connected) return false;
  try {
    stompClient.publish({
      destination: "/app/chat.typing",
      body: JSON.stringify({ conversationId: Number(convId), typing: Boolean(isTyping) }),
    });
    return true;
  } catch {
    return false;
  }
}

export function publishRead(convId) {
  if (!stompClient || !stompClient.connected) return false;
  try {
    stompClient.publish({
      destination: "/app/chat.read",
      body: JSON.stringify({ conversationId: Number(convId), content: "" }),
    });
    return true;
  } catch {
    return false;
  }
}

export function getChatClient() {
  return stompClient;
}
