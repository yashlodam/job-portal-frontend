/**
 * src/Pages/recruiter/RecruiterCompanyPage.jsx
 *
 * Company Management & Verification Page for Recruiters.
 */

import React from "react";
import { Building2, CheckCircle2, ShieldCheck, MapPin, Users, Globe, Mail, Phone, Plus } from "lucide-react";
import RecruiterLayout from "../../components/recruiter/layout/RecruiterLayout";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Avatar } from "../../components/ui/Avatar";
import { useAppSelector } from "../../State/Store";

export default function RecruiterCompanyPage() {
  const { selectedCompany: company } = useAppSelector((state) => state.company);

  const team = [
    { name: "John Doe", role: "Lead Recruiter", email: "john@technovasolutions.com" },
    { name: "Sarah Connor", role: "Talent Acquisition Lead", email: "sarah@technovasolutions.com" },
  ];

  return (
    <RecruiterLayout
      title="Company Profile & Branding"
      subtitle="Manage company information, team members, office locations, and verification status."
      breadcrumbs={[{ label: "Company Profile" }]}
    >
      {/* Header Banner Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-3 shadow-lg shrink-0">
            <span className="text-3xl font-black text-indigo-600 font-satoshi">
              {company?.companyName?.charAt(0) ?? "T"}
            </span>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-black text-white font-satoshi">{company?.companyName || "TechNova Solutions Pvt. Ltd."}</h2>
              <Badge variant="success" icon={ShieldCheck}>
                Verified Company
              </Badge>
            </div>
            <p className="text-xs text-white/60 mt-1 max-w-2xl">{company?.description || "Enterprise technology solutions specializing in cloud, AI, and full-stack software."}</p>

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/50">
              <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4 text-indigo-400" /> {company?.industry || "IT Services"}</span>
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-indigo-400" /> {company?.headquarters || "Pune, India"}</span>
              <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-indigo-400" /> {company?.companySize || "201-500 employees"}</span>
              <span className="flex items-center gap-1.5"><Globe className="h-4 w-4 text-indigo-400" /> {company?.website || "https://technovasolutions.com"}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Recruiter Team */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <CardTitle>Recruiting Team ({team.length})</CardTitle>
            <button className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/10">
              <Plus className="h-3.5 w-3.5" /> Invite Recruiter
            </button>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
          {team.map((member) => (
            <div key={member.email} className="flex items-center gap-3 p-3.5 rounded-2xl border border-white/5 bg-white/[0.02]">
              <Avatar name={member.name} size="md" />
              <div>
                <h4 className="text-xs font-bold text-white">{member.name}</h4>
                <p className="text-[11px] text-indigo-400 font-semibold">{member.role}</p>
                <p className="text-[10px] text-white/40">{member.email}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </RecruiterLayout>
  );
}
