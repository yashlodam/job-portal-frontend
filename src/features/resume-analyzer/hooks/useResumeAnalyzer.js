/**
 * src/features/resume-analyzer/hooks/useResumeAnalyzer.js
 * Custom hook providing access to analysis state and action dispatchers.
 */

import { useSelector, useDispatch } from "react-redux";
import {
  uploadAndAnalyzeResume,
  reAnalyzeResumeThunk,
  generateAIRewriteThunk,
  setActiveDashboardTab,
  resetAnalysisState,
  deleteResume,
  openRewriteModal,
  closeRewriteModal,
  openDownloadModal,
  closeDownloadModal,
  clearError,
} from "../slices/analysisSlice";

export function useResumeAnalyzer() {
  const dispatch = useDispatch();
  const state = useSelector((store) => store.analysis);

  return {
    ...state,
    uploadResume: (file) => dispatch(uploadAndAnalyzeResume(file)),
    reAnalyze: () => dispatch(reAnalyzeResumeThunk()),
    generateRewrite: (type, promptDetails) => dispatch(generateAIRewriteThunk({ type, promptDetails })),
    setTab: (tab) => dispatch(setActiveDashboardTab(tab)),
    resetState: () => dispatch(resetAnalysisState()),
    removeResume: () => dispatch(deleteResume()),
    showRewriteModal: (type) => dispatch(openRewriteModal(type)),
    hideRewriteModal: () => dispatch(closeRewriteModal()),
    showDownloadModal: () => dispatch(openDownloadModal()),
    hideDownloadModal: () => dispatch(closeDownloadModal()),
    dismissError: () => dispatch(clearError()),
  };
}
