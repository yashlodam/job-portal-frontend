/**
 * src/api/chatApi.js
 *
 * REST API client for the Chat Module.
 * Base URL: http://localhost:8080/api/chat
 * All requests auto-attach JWT via the shared `api` Axios instance.
 */

import { api } from "../config/Api";

/**
 * Create or get an existing conversation with a participant.
 * POST /chat/conversations
 * Idempotent — returns existing conversation if one already exists.
 */
export const createOrGetConversationApi = async (participantId, jobApplicationId = null) => {
  const body = { participantId };
  if (jobApplicationId) body.jobApplicationId = jobApplicationId;
  const response = await api.post("/chat/conversations", body);
  return response.data?.data ?? response.data;
};

/**
 * Get all conversations for the current authenticated user.
 * GET /chat/conversations
 */
export const getConversationsApi = async () => {
  const response = await api.get("/chat/conversations");
  return response.data?.data ?? response.data ?? [];
};

/**
 * Get a single conversation by ID.
 * GET /chat/conversations/{id}
 */
export const getConversationByIdApi = async (conversationId) => {
  const response = await api.get(`/chat/conversations/${conversationId}`);
  return response.data?.data ?? response.data;
};

/**
 * Get paginated messages for a conversation.
 * GET /chat/conversations/{id}/messages?page=0&size=30
 * NOTE: Backend returns newest-first — reverse the array before rendering.
 */
export const getMessagesApi = async (conversationId, page = 0, size = 30) => {
  const response = await api.get(`/chat/conversations/${conversationId}/messages`, {
    params: { page, size },
  });
  return response.data?.data ?? response.data;
};

/**
 * Mark conversation as read (persist lastReadAt in DB).
 * PATCH /chat/conversations/{id}/read
 */
export const markAsReadApi = async (conversationId) => {
  const response = await api.patch(`/chat/conversations/${conversationId}/read`);
  return response.data;
};

/**
 * Get total unread message count for nav badge.
 * GET /chat/unread-count
 */
export const getUnreadCountApi = async () => {
  const response = await api.get("/chat/unread-count");
  const data = response.data?.data ?? response.data;
  return typeof data?.totalUnread === "number" ? data.totalUnread : 0;
};

/**
 * Soft delete a message.
 * DELETE /chat/conversations/{id}/messages/{msgId}
 */
export const deleteMessageApi = async (conversationId, messageId) => {
  const response = await api.delete(`/chat/conversations/${conversationId}/messages/${messageId}`);
  return response.data?.data ?? response.data;
};
