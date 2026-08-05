/**
 * src/Pages/recruiter/RecruiterInterviewsPage.jsx
 *
 * Interview Management Page for Recruiters.
 */

import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, Video, UserCheck, Plus, CheckCircle } from "lucide-react";
import RecruiterLayout from "../../components/recruiter/layout/RecruiterLayout";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Tabs } from "../../components/ui/Tabs";
import { Avatar } from "../../components/ui/Avatar";
import { Modal } from "../../components/ui/Modal";

export default function RecruiterInterviewsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const interviews = [
    { id: 1, candidate: "Michael Chen", role: "Lead AI Architect", date: "Today, Aug 5", time: "2:00 PM - 3:00 PM", interviewer: "Sarah Connor", mode: "Google Meet", status: "UPCOMING" },
    { id: 2, candidate: "Sarah Jenkins", role: "Senior React Engineer", date: "Tomorrow, Aug 6", time: "11:00 AM - 12:00 PM", interviewer: "David Miller", mode: "Zoom", status: "UPCOMING" },
    { id: 3, candidate: "Alex Rivera", role: "Product Designer", date: "Aug 4, 2026", time: "4:00 PM - 5:00 PM", interviewer: "Elena Rostova", mode: "Google Meet", status: "COMPLETED" },
  ];

  const tabs = [
    { id: "upcoming", label: "Upcoming Interviews", count: 2 },
    { id: "completed", label: "Completed", count: 1 },
  ];

  const filtered = interviews.filter((i) => i.status === activeTab.toUpperCase());

  return (
    <RecruiterLayout
      title="Interview Management"
      subtitle="Schedule, manage, and conduct candidate interviews."
      breadcrumbs={[{ label: "Interviews" }]}
      action={
        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:scale-105 transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule Interview</span>
        </button>
      }
    >
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <Card key={item.id} className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Avatar name={item.candidate} size="md" />
                <div>
                  <h3 className="font-bold text-white font-satoshi text-base">{item.candidate}</h3>
                  <p className="text-xs text-white/50">{item.role}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                  <CalendarIcon className="h-3.5 w-3.5" /> {item.date}
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Clock className="h-3.5 w-3.5 text-white/40" /> {item.time}
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Video className="h-3.5 w-3.5 text-white/40" /> {item.mode}
                </div>
                <div className="flex items-center gap-2 text-white/50">
                  <UserCheck className="h-3.5 w-3.5 text-white/40" /> Interviewer: {item.interviewer}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {item.status}
              </span>
              <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                Join Meeting ↗
              </button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} title="Schedule New Interview">
        <form onSubmit={(e) => { e.preventDefault(); setShowScheduleModal(false); }} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1">Candidate Name</label>
            <input type="text" placeholder="e.g. Sarah Jenkins" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1">Date & Time</label>
            <input type="datetime-local" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white" />
          </div>
          <button type="submit" className="w-full rounded-2xl bg-indigo-600 py-3 text-xs font-bold text-white hover:bg-indigo-500">
            Confirm Interview
          </button>
        </form>
      </Modal>
    </RecruiterLayout>
  );
}
