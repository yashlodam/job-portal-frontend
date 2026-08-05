/**
 * src/Pages/recruiter/RecruiterAnalyticsPage.jsx
 *
 * Analytics & Hiring Metrics Dashboard.
 */

import React from "react";
import { BarChart3, TrendingUp, Users, Award, Clock, ArrowUpRight } from "lucide-react";
import RecruiterLayout from "../../components/recruiter/layout/RecruiterLayout";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";

export default function RecruiterAnalyticsPage() {
  const metrics = [
    { title: "Avg Time to Hire", value: "18 days", change: "-4 days vs target", color: "text-emerald-400" },
    { title: "Application Conversion Rate", value: "24.5%", change: "+3.2% this quarter", color: "text-indigo-400" },
    { title: "Offer Acceptance Rate", value: "88%", change: "+5% vs average", color: "text-purple-400" },
    { title: "Candidate Satisfaction", value: "4.8 / 5", change: "Top 5% portal rank", color: "text-amber-400" },
  ];

  const sources = [
    { source: "Velora AI Matching", count: 240, pct: 50, color: "from-indigo-500 to-violet-500" },
    { source: "Direct Job Board", count: 120, pct: 25, color: "from-blue-500 to-cyan-500" },
    { source: "Referrals", count: 72, pct: 15, color: "from-emerald-500 to-teal-500" },
    { source: "Social Media", count: 48, pct: 10, color: "from-purple-500 to-pink-500" },
  ];

  return (
    <RecruiterLayout
      title="Hiring Analytics & Reports"
      subtitle="Track your conversion funnel, candidate sources, time-to-hire, and recruiter performance."
      breadcrumbs={[{ label: "Analytics" }]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.title} className="p-5">
            <p className="text-xs text-white/50">{m.title}</p>
            <h3 className="text-2xl font-black text-white font-satoshi mt-1">{m.value}</h3>
            <p className={`text-xs font-semibold mt-2 flex items-center gap-1 ${m.color}`}>
              <TrendingUp className="h-3 w-3" /> {m.change}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Candidate Sourcing Channels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-3">
            {sources.map((s) => (
              <div key={s.source} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-white/80">{s.source}</span>
                  <span className="text-white">{s.count} ({s.pct}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${s.color}`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Hiring Trend (2026)</CardTitle>
          </CardHeader>
          <CardContent className="pt-3 flex items-end justify-between h-48 px-4 border-b border-white/5">
            {[
              { month: "Jan", hires: 4 },
              { month: "Feb", hires: 6 },
              { month: "Mar", hires: 8 },
              { month: "Apr", hires: 5 },
              { month: "May", hires: 12 },
              { month: "Jun", hires: 9 },
              { month: "Jul", hires: 14 },
            ].map((d) => (
              <div key={d.month} className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-indigo-400">{d.hires}</span>
                <div className="w-8 rounded-t-lg bg-gradient-to-t from-indigo-600 to-violet-500" style={{ height: `${d.hires * 9}px` }} />
                <span className="text-[10px] text-white/50">{d.month}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </RecruiterLayout>
  );
}
