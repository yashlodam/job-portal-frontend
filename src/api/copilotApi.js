/**
 * src/api/copilotApi.js
 *
 * API client for JobPortal AI Career Copilot Chatbot.
 * Connects to Spring AI Groq backend at /api/ai/copilot/chat.
 */

import { api } from "../config/Api";

/**
 * Send user message and conversation history to the AI Copilot.
 *
 * @param {Object} payload - { message: string, history: Array<{sender: string, text: string}>, activePage?: string }
 * @returns {Promise<AxiosResponse<{ success: boolean, message: string, data: CopilotChatResponse }>>}
 */
export const sendCopilotMessageApi = async (payload) => {
  return api.post("/ai/copilot/chat", payload);
};
