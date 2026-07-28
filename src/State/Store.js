/**
 * src/State/Store.js
 *
 * Redux store — single source of truth for the application.
 *
 * Slices registered:
 *  auth    → src/State/AuthSlic.js    (authentication, JWT, user identity)
 *  profile → src/State/profileSlice.js (all profile sections + images)
 *
 * Exports:
 *  store          — configured Redux store (consumed by <Provider> in main.jsx)
 *  useAppDispatch — typed dispatch hook  (use in all components)
 *  useAppSelector — typed selector hook  (use in all components)
 */

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import authReducer    from "./AuthSlic";
import profileReducer from "./profileSlice";

// ─── Root Reducer ─────────────────────────────────────────────────────────────
const rootReducer = combineReducers({
  auth:    authReducer,
  profile: profileReducer,
});

// ─── Store ────────────────────────────────────────────────────────────────────
export const store = configureStore({
  reducer: rootReducer,
});

// ─── Typed Hooks ──────────────────────────────────────────────────────────────
// Always use these instead of raw useDispatch / useSelector so the entire
// codebase stays consistent and avoids any future type-drift.
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;