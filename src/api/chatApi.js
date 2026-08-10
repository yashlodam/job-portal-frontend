/**
 * src/api/chatApi.js
 *
 * REST API client for the Chat Module.
 * Base URL: http://localhost:8080/api/chat
 * All requests auto-attach JWT via the shared `api` Axios instance.
 */

import { api } from "../config/Api";
import { searchTalent } from "./talentApi";

/**
 * Create or get an existing conversation with a participant.
 * POST /chat/conversations
 * Idempotent — returns existing conversation if one already exists.
 */
export const createOrGetConversationApi = async (participantId, jobApplicationId = null) => {
  const numericParticipantId = Number(participantId);
  const body = {
    participantId: !isNaN(numericParticipantId) && numericParticipantId > 0 ? numericParticipantId : participantId,
  };
  if (jobApplicationId && !isNaN(Number(jobApplicationId)) && Number(jobApplicationId) > 0) {
    body.jobApplicationId = Number(jobApplicationId);
  }
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

/**
 * Universal helper to extract the other participant's profile details
 * from any conversation shape returned by the backend.
 */
export function getOtherParticipant(conv, currentUserId) {
  if (!conv) return { name: "User", email: "", online: false };

  // 1. Check conv.otherParticipant
  if (conv.otherParticipant) {
    const op = conv.otherParticipant;
    const u = op.user || op.profile || op;
    return {
      id: u.id || u.userId || op.id || op.userId,
      name: u.name || u.fullName || u.username || op.name || op.fullName || "User",
      email: u.email || op.email || "",
      profileImage: u.profileImage || u.avatar || op.profileImage || op.avatar || null,
      accountType: u.accountType || u.role || op.accountType || op.role || "",
      online: Boolean(op.online ?? u.online ?? false),
      lastSeenAt: op.lastSeenAt || u.lastSeenAt || null,
    };
  }

  // 2. Check conv.otherUser
  if (conv.otherUser) {
    const u = conv.otherUser;
    return {
      id: u.id || u.userId,
      name: u.name || u.fullName || u.username || "User",
      email: u.email || "",
      profileImage: u.profileImage || u.avatar || null,
      accountType: u.accountType || u.role || "",
      online: Boolean(u.online ?? false),
      lastSeenAt: u.lastSeenAt || null,
    };
  }

  // 3. Check conv.candidate / conv.recruiter
  if (conv.candidate || conv.recruiter) {
    const isCurrentUserRecruiter =
      currentUserId &&
      (conv.recruiter?.id === currentUserId || conv.recruiter?.userId === currentUserId);
    const target = isCurrentUserRecruiter
      ? conv.candidate || conv.recruiter
      : conv.recruiter || conv.candidate;
    const u = target?.user || target;
    return {
      id: u.id || u.userId || target.id,
      name: u.name || u.fullName || target.name || "User",
      email: u.email || target.email || "",
      profileImage: u.profileImage || target.profileImage || null,
      accountType: u.accountType || u.role || target.role || "",
      online: Boolean(target.online ?? false),
      lastSeenAt: target.lastSeenAt || null,
    };
  }

  // 4. Check conv.participants array
  if (Array.isArray(conv.participants) && conv.participants.length > 0) {
    const other =
      conv.participants.find(
        (p) =>
          (p.userId || p.id || p.user?.id || p.user?.userId) !== currentUserId
      ) || conv.participants[0];
    const u = other.user || other.profile || other;
    return {
      id: u.id || u.userId || other.userId || other.id,
      name: u.name || u.fullName || u.username || other.name || "User",
      email: u.email || other.email || "",
      profileImage: u.profileImage || u.avatar || other.profileImage || null,
      accountType: u.accountType || u.role || other.role || "",
      online: Boolean(other.online ?? u.online ?? false),
      lastSeenAt: other.lastSeenAt || u.lastSeenAt || null,
    };
  }

  // 5. Direct fields fallback
  return {
    id: conv.recipientId || conv.participantId || conv.targetUserId || null,
    name: conv.participantName || conv.recipientName || conv.title || "User",
    email: conv.participantEmail || conv.recipientEmail || "",
    profileImage: conv.participantImage || conv.recipientImage || null,
    accountType: "",
    online: Boolean(conv.online ?? false),
    lastSeenAt: conv.lastSeenAt || null,
  };
}

/**
 * Universal resolver to find a candidate's User ID from any candidate / application object.
 * Searches all standard fields synchronously first, then falls back to email/name lookup via talent directory API.
 */
export async function resolveCandidateUserId(candidateOrApp) {
  if (!candidateOrApp) return null;

  // 1. Direct synchronous checks
  const syncId =
    candidateOrApp.userId ||
    candidateOrApp.candidateUserId ||
    candidateOrApp.applicantUserId ||
    candidateOrApp.applicantId ||
    candidateOrApp.candidateId ||
    candidateOrApp.talentUserId ||
    candidateOrApp.jobSeekerId ||
    candidateOrApp.appliedById ||
    candidateOrApp.createdById ||
    candidateOrApp.user?.id ||
    candidateOrApp.user?.userId ||
    candidateOrApp.applicant?.id ||
    candidateOrApp.applicant?.userId ||
    candidateOrApp.applicant?.user?.id ||
    candidateOrApp.candidate?.id ||
    candidateOrApp.candidate?.userId ||
    candidateOrApp.candidate?.user?.id ||
    candidateOrApp.jobSeeker?.id ||
    candidateOrApp.jobSeeker?.userId ||
    candidateOrApp.jobSeekerProfile?.userId ||
    candidateOrApp.jobSeekerProfile?.user?.id ||
    candidateOrApp.jobSeekerProfile?.id ||
    candidateOrApp.profile?.userId ||
    candidateOrApp.profile?.user?.id ||
    candidateOrApp.raw?.userId ||
    candidateOrApp.raw?.user?.id ||
    candidateOrApp.raw?.id ||
    candidateOrApp.realTalentId ||
    candidateOrApp.talentId ||
    null;

  if (syncId && !isNaN(Number(syncId)) && Number(syncId) > 0) {
    return Number(syncId);
  }

  // 2. Lookup via talent search API by email
  const email =
    candidateOrApp.applicantEmail ||
    candidateOrApp.email ||
    candidateOrApp.user?.email ||
    candidateOrApp.candidateEmail;

  if (email && typeof email === "string" && email.trim()) {
    try {
      const res = await searchTalent({ keyword: email.trim() });
      const list = res?.data?.content || res?.data || (Array.isArray(res) ? res : []);
      if (Array.isArray(list) && list.length > 0) {
        const exact = list.find((t) => (t.email || t.applicantEmail || "").toLowerCase() === email.trim().toLowerCase()) || list[0];
        const foundId = exact.userId || exact.user?.id || exact.id;
        if (foundId && !isNaN(Number(foundId)) && Number(foundId) > 0) {
          return Number(foundId);
        }
      }
    } catch (e) {
      console.warn("[resolveCandidateUserId] Talent search by email notice:", e?.message);
    }
  }

  // 3. Lookup via talent search API by name
  const name =
    candidateOrApp.candidateName ||
    candidateOrApp.applicantName ||
    candidateOrApp.name ||
    candidateOrApp.user?.name;

  if (name && typeof name === "string" && name.trim()) {
    try {
      const res = await searchTalent({ keyword: name.trim() });
      const list = res?.data?.content || res?.data || (Array.isArray(res) ? res : []);
      if (Array.isArray(list) && list.length > 0) {
        const exact = list.find((t) => (t.name || t.fullName || "").toLowerCase() === name.trim().toLowerCase()) || list[0];
        const foundId = exact.userId || exact.user?.id || exact.id;
        if (foundId && !isNaN(Number(foundId)) && Number(foundId) > 0) {
          return Number(foundId);
        }
      }
    } catch (e) {
      console.warn("[resolveCandidateUserId] Talent search by name notice:", e?.message);
    }
  }

  // 4. Final fallback: if candidateOrApp.id is a numeric id (and not a "talent-*" string)
  if (candidateOrApp.id && typeof candidateOrApp.id === "number") {
    return candidateOrApp.id;
  }

  return null;
}
