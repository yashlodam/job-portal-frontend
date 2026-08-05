/**
 * src/components/recruiter/dashboard/RecentActivityWidget.jsx & HiringFunnelWidget.jsx
 */
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/Card";
import { UserCheck, Calendar, Send, Award, Clock } from "lucide-react";

export function RecentActivityWidget() {
  const activities = [
    { id: 1, user: "Sarah Jenkins", action: "Applied for Senior Frontend Engineer", time: "10m ago", icon: Send, color: "text-blue-400" },
    { id: 2, user: "Michael Chen", action: "Scheduled Technical Interview", time: "1h ago", icon: Calendar, color: "text-purple-400" },
    { id: 3, user: "Alex Rivera", action: "Moved to Shortlisted status", time: "3h ago", icon: UserCheck, color: "text-emerald-400" },
    { id: 4, user: "Elena Rostova", action: "Accepted Job Offer 🎉", time: "5h ago", icon: Award, color: "text-amber-400" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-indigo-400" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-3">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <div key={act.id} className="flex items-center justify-between p-2.5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5">
                  <Icon className={`h-4 w-4 ${act.color}`} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{act.user}</p>
                  <p className="text-[11px] text-white/50">{act.action}</p>
                </div>
              </div>
              <span className="text-[10px] text-white/40">{act.time}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function HiringFunnelWidget() {
  const funnel = [
    { stage: "Applied", count: 482, pct: 100, color: "from-blue-500 to-indigo-500" },
    { stage: "Shortlisted", count: 124, pct: 65, color: "from-indigo-500 to-violet-500" },
    { stage: "Interview", count: 42, pct: 40, color: "from-purple-500 to-fuchsia-500" },
    { stage: "Offer", count: 12, pct: 20, color: "from-amber-500 to-emerald-500" },
    { stage: "Hired", count: 8, pct: 12, color: "from-emerald-500 to-teal-500" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hiring Funnel Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-3">
        {funnel.map((item) => (
          <div key={item.stage} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-white/80">{item.stage}</span>
              <span className="text-white">{item.count} candidates</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
              <div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${item.pct}%` }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
