/**
 * src/components/recruiter/dashboard/RecentActivityWidget.jsx & HiringFunnelWidget.jsx
 */
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/Card";
import { Clock, Info } from "lucide-react";
import { useAppSelector } from "../../../State/Store";

export function RecentActivityWidget() {
  const { myJobs = [] } = useAppSelector((state) => state.job);
  const totalApps = myJobs.reduce((acc, j) => acc + (j.applicantsCount || j.applicationsCount || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-satoshi text-base font-black text-heading">
          <Clock className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
          Recent Candidate Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-3">
        {totalApps === 0 ? (
          <div className="p-6 text-center space-y-2">
            <Info size={28} className="text-muted mx-auto" />
            <p className="text-xs font-bold text-heading font-satoshi">No Recent Candidate Activity</p>
            <p className="text-[11px] text-muted">Candidate application events will appear here in real-time as users apply.</p>
          </div>
        ) : (
          <div className="p-4 rounded-2xl border border-border bg-surface-elevated text-xs text-body font-satoshi">
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{totalApps} Candidate Applications</span> received across your posted positions.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function HiringFunnelWidget() {
  const { myJobs = [] } = useAppSelector((state) => state.job);
  const totalApps = myJobs.reduce((acc, j) => acc + (j.applicantsCount || j.applicationsCount || 0), 0);

  const funnel = [
    { stage: "Applied", count: totalApps, pct: totalApps > 0 ? 100 : 0, color: "from-blue-500 to-indigo-500" },
    { stage: "Shortlisted", count: 0, pct: 0, color: "from-indigo-500 to-violet-500" },
    { stage: "Interview", count: 0, pct: 0, color: "from-purple-500 to-fuchsia-500" },
    { stage: "Offer", count: 0, pct: 0, color: "from-amber-500 to-emerald-500" },
    { stage: "Hired", count: 0, pct: 0, color: "from-emerald-500 to-teal-500" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-satoshi text-base font-black text-heading">Hiring Funnel Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-3 font-satoshi">
        {funnel.map((item) => (
          <div key={item.stage} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-muted">{item.stage}</span>
              <span className="text-heading font-extrabold">{item.count} candidates</span>
            </div>
            <div className="h-2 w-full rounded-full bg-surface-elevated overflow-hidden border border-border">
              <div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${item.pct}%` }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
