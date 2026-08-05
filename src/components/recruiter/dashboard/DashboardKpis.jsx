/**
 * src/components/recruiter/dashboard/DashboardKpis.jsx
 */
import React from "react";
import { Briefcase, Users, Calendar, CheckCircle2, TrendingUp, Sparkles, Clock, Award } from "lucide-react";
import { Card } from "../../ui/Card";

export default function DashboardKpis({ stats }) {
  const kpis = [
    { label: "Active Jobs", value: stats?.activeJobs ?? 12, change: "+3 this week", icon: Briefcase, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
    { label: "Featured Jobs", value: stats?.featuredJobs ?? 4, change: "Top Priority", icon: Sparkles, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { label: "Total Applications", value: stats?.totalApplications ?? 482, change: "+18% vs last month", icon: Users, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    { label: "New Applications", value: stats?.newApplications ?? 28, change: "Requires review", icon: Clock, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
    { label: "Interviews Scheduled", value: stats?.interviews ?? 14, change: "4 today", icon: Calendar, color: "text-teal-400 bg-teal-500/10 border-teal-500/20" },
    { label: "Hired Candidates", value: stats?.hired ?? 8, change: "+2 this month", icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.label} hover={true} className="p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${kpi.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-white font-satoshi">{kpi.value}</span>
              <p className="text-xs font-semibold text-white/70 mt-0.5 truncate">{kpi.label}</p>
              <p className="text-[10px] font-medium text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="h-2.5 w-2.5" />
                {kpi.change}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
