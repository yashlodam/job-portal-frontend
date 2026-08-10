/**
 * src/hooks/useChatSocket.js
 *
 * STOMP over SockJS WebSocket connector.
 * WS URL: http://localhost:8080/ws
 *
 * Usage:
 *   import { connectChat, disconnectChat } from './useChatSocket';
 *   connectChat(token, onConnected, onError);
 *   disconnectChat();
 */

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_URL = "http://localhost:8080/ws";

let stompClient = null;

/**
 * Connect to the chat WebSocket server.
 *
 * @param {string}   token       JWT access token
 * @param {Function} onConnected Called with (stompClient) when STOMP CONNECT succeeds
 * @param {Function} onError     Called with (frame) on connection error
 * @returns {Client} The STOMP client instance
 */
export function connectChat(token, onConnected, onError) {
  // Deactivate any existing connection before creating a new one
  if (stompClient && stompClient.active) {
    stompClient.deactivate();
  }

  stompClient = new Client({
    // SockJS factory — provides fallback for browsers without native WebSocket
    webSocketFactory: () => new SockJS(WS_URL),

    // JWT sent in the STOMP CONNECT frame headers (backend reads this for auth)
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    // Automatically reconnect every 5 seconds on unexpected disconnect
    reconnectDelay: 5000,

    onConnect: (frame) => {
      console.log("[ChatSocket] Connected:", frame?.headers?.server || "ok");
      onConnected?.(stompClient);
    },

    onStompError: (frame) => {
      console.error("[ChatSocket] STOMP error:", frame?.headers?.message || frame);
      onError?.(frame);
    },

    onWebSocketError: (event) => {
      console.error("[ChatSocket] WebSocket error:", event);
      onError?.(event);
    },

    onDisconnect: () => {
      console.log("[ChatSocket] Disconnected");
    },
  });

  stompClient.activate();
  return stompClient;
}

/**
 * Gracefully disconnect from the WebSocket server.
 */
export function disconnectChat() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
}

/**
 * Get the current STOMP client instance (for direct use if needed).
 */
export function getChatClient() {
  return stompClient;
}
