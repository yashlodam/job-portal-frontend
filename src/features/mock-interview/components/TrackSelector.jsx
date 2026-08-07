/**
 * src/features/mock-interview/components/TrackSelector.jsx
 * Card selector for interview tracks (Java, React, Python, AI/ML, System Design, Behavioral).
 */

import React from "react";
import { INTERVIEW_TRACKS } from "../constants/interviewData";
import { Code2, Layout, Terminal, Cpu, Network, UserCheck, CheckCircle2 } from "lucide-react";

const ICON_MAP = {
  Code2,
  Layout,
  Terminal,
  Cpu,
  Network,
  UserCheck,
};

export default function TrackSelector({ selectedTrackId, onSelectTrack }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-satoshi">
      {INTERVIEW_TRACKS.map((track) => {
        const IconComponent = ICON_MAP[track.icon] || Code2;
        const isSelected = selectedTrackId === track.id;

        return (
          <div
            key={track.id}
            onClick={() => onSelectTrack(track.id)}
            className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 relative ${
              isSelected
                ? "bg-indigo-600/15 border-indigo-500 shadow-[0_0_25px_rgba(99,102,241,0.25)] ring-1 ring-indigo-500"
                : "bg-[#090d16]/90 border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.04]"
            }`}
          >
            {isSelected && (
              <div className="absolute top-4 right-4 text-indigo-400">
                <CheckCircle2 size={20} />
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-400"
                    : "bg-white/5 text-indigo-400 border-white/10"
                }`}>
                  <IconComponent size={24} />
                </div>

                <div>
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                    {track.popularity}
                  </span>
                  <h4 className="text-base font-black text-white line-clamp-1 mt-0.5">{track.title}</h4>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-medium line-clamp-2 leading-relaxed">
                {track.description}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span className="text-indigo-400">{track.tags?.slice(0, 2).join(" • ")}</span>
              <span className="text-emerald-400 font-black">AI Live Practice</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
