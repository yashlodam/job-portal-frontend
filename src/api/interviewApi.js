/**
 * src/api/interviewApi.js
 *
 * API functions matching Spring Boot InterviewController:
 * Base URL: /api/interviews
 */

import { api } from "../config/Api";

/**
 * Starts a new AI Mock Interview session.
 * POST /api/interviews/start
 */
export const startInterviewApi = async (requestData) => {
  const res = await api.post("/interviews/start", requestData);
  console.log("startInterviewApi response:", res.data);
  return res.data;
};

/**
 * Generates or retrieves the next question for an active interview session.
 * POST /api/interviews/{sessionId}/next-question
 */
export const getNextQuestionApi = async (sessionId) => {
  const res = await api.post(`/interviews/${sessionId}/next-question`);
  console.log("getNextQuestionApi response:", res.data);
  return res.data;
};

/**
 * Submits a candidate's answer and evaluates it using AI.
 * POST /api/interviews/{sessionId}/submit
 */
export const submitAnswerApi = async (sessionId, requestData) => {
  const res = await api.post(`/interviews/${sessionId}/submit`, requestData);
  console.log("submitAnswerApi response:", res.data);
  return res.data;
};

/**
 * Retrieves session details and current progress.
 * GET /api/interviews/{sessionId}
 */
export const getSessionDetailsApi = async (sessionId) => {
  const res = await api.get(`/interviews/${sessionId}`);
  console.log("getSessionDetailsApi response:", res.data);
  return res.data;
};

/**
 * Retrieves paginated interview history for the authenticated user.
 * GET /api/interviews/history
 */
export const getUserHistoryApi = async (page = 0, size = 10) => {
  const res = await api.get(`/interviews/history?page=${page}&size=${size}`);
  console.log("getUserHistoryApi response:", res.data);
  return res.data;
};

/**
 * Returns the complete AI evaluation report for an interview session.
 * GET /api/interviews/{sessionId}/report
 */
export const getInterviewReportApi = async (sessionId) => {
  const res = await api.get(`/interviews/${sessionId}/report`);
  console.log("getInterviewReportApi response:", res.data);
  return res.data;
};

/**
 * Deletes an interview session and its records.
 * DELETE /api/interviews/{sessionId}
 */
export const deleteSessionApi = async (sessionId) => {
  const res = await api.delete(`/interviews/${sessionId}`);
  console.log("deleteSessionApi response:", res.data);
  return res.data;
};
