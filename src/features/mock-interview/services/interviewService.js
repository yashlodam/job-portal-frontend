/**
 * src/features/mock-interview/services/interviewService.js
 * Production Service Layer executing real Spring Boot backend API calls (/api/interviews).
 * Unwraps ApiResponse<Page<InterviewSessionResponse>> for history.
 */

import {
  startInterviewApi,
  getNextQuestionApi,
  submitAnswerApi,
  getSessionDetailsApi,
  getUserHistoryApi,
  getInterviewReportApi,
  deleteSessionApi,
} from "../../../api/interviewApi";

export const interviewService = {
  /**
   * Start a new AI Mock Interview session
   * POST /api/interviews/start
   */
  async startInterview(setupConfig) {
    const payload = {
      trackId: setupConfig.trackId,
      difficulty: String(setupConfig.difficulty || "BEGINNER").toUpperCase(),
      interviewType: String(setupConfig.interviewType || "TECHNICAL").toUpperCase(),
      questionCount: Number(setupConfig.questionCount || 5),
      durationMinutes: Number(setupConfig.durationMinutes || 20),
    };

    const res = await startInterviewApi(payload);
    // Unwrap ApiResponse: res.data is ApiResponse wrapper; res.data.data is InterviewSessionResponse DTO
    const apiResponse = res?.data || res;
    const session = apiResponse?.data || apiResponse;
    const sessionId = session?.id || session?.sessionId;

    let questionsList = [];
    if (Array.isArray(session?.questions) && session.questions.length > 0) {
      questionsList = session.questions;
    } else if (sessionId) {
      const firstQuestion = await this.getNextQuestion(sessionId);
      if (firstQuestion) {
        questionsList = [firstQuestion];
      }
    }

    return {
      session,
      initialQuestions: questionsList,
    };
  },

  /**
   * Fetch Next Question from Spring Boot
   * POST /api/interviews/{sessionId}/next-question
   */
  async getNextQuestion(sessionId) {
    if (!sessionId) return null;
    const res = await getNextQuestionApi(sessionId);
    const apiResponse = res?.data || res;
    const questionData = apiResponse?.data || apiResponse;
    return questionData;
  },

  /**
   * Submit Answer and Evaluate via AI
   * POST /api/interviews/{sessionId}/submit
   */
  async submitAnswer(sessionId, questionId, answerText) {
    if (!sessionId || !questionId) return null;

    const payload = {
      questionId: Number(questionId) || questionId,
      userAnswer: answerText && answerText.trim() ? answerText.trim() : "Candidate provided technical explanation.",
      answerText: answerText && answerText.trim() ? answerText.trim() : "Candidate provided technical explanation.",
    };

    const res = await submitAnswerApi(sessionId, payload);
    const apiResponse = res?.data || res;
    return apiResponse?.data || apiResponse;
  },

  /**
   * Get Complete Interview Report
   * GET /api/interviews/{sessionId}/report
   */
  async getReport(sessionId) {
    if (!sessionId) return null;
    const res = await getInterviewReportApi(sessionId);
    const apiResponse = res?.data || res;
    return apiResponse?.data || apiResponse;
  },

  /**
   * Get User Interview History (Paginated Page<InterviewSessionResponse>)
   * GET /api/interviews/history
   */
  async getHistory(page = 0, size = 10) {
    const res = await getUserHistoryApi(page, size);
    const apiResponse = res?.data || res;
    const pageData = apiResponse?.data || apiResponse;

    if (pageData?.content && Array.isArray(pageData.content)) {
      return pageData.content;
    }
    if (Array.isArray(pageData)) {
      return pageData;
    }
    return [];
  },

  /**
   * Delete Session
   * DELETE /api/interviews/{sessionId}
   */
  async deleteSession(sessionId) {
    if (!sessionId) return null;
    try {
      const res = await deleteSessionApi(sessionId);
      const apiResponse = res?.data || res;
      return apiResponse?.data || apiResponse;
    } catch (err) {
      console.warn("[interviewService] Delete session API error:", err);
      return null;
    }
  },
};
