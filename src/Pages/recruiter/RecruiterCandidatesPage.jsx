/**
 * src/Pages/recruiter/RecruiterCandidatesPage.jsx
 *
 * Candidate Details & Talent Directory Page for Recruiters.
 */

import React, { useState } from "react";
import { Search, Sparkles, FileText, Mail, Phone, MapPin, Award, BookOpen, Briefcase, Code, CheckCircle } from "lucide-react";
import RecruiterLayout from "../../components/recruiter/layout/RecruiterLayout";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/Card";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";

export default function RecruiterCandidatesPage() {
  const [selectedCandidate, setSelectedCandidate] = useState({
    name: "Sarah Jenkins",
    role: "Senior React & Full-Stack Developer",
    email: "sarah.j@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    matchScore: 94,
    skills: ["React 19", "TypeScript", "Redux Toolkit", "Node.js", "GraphQL", "Tailwind CSS"],
    experience: [
      { company: "Vercel", role: "Senior Frontend Engineer", period: "2023 - Present", desc: "Led front-end architecture for Next.js dashboard." },
      { company: "Stripe", role: "Software Engineer", period: "2020 - 2023", desc: "Built checkout component library used by millions." },
    ],
    education: [
      { degree: "B.S. Computer Science", school: "Stanford University", year: "2020" },
    ],
  });

  return (
    <RecruiterLayout
      title="Candidate Directory"
      subtitle="Detailed profile cards with AI Match Score, resume preview, and timeline."
      breadcrumbs={[{ label: "Candidates" }]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Candidate Profile Header Card */}
        <Card className="lg:col-span-1 p-6 space-y-6">
          <div className="flex flex-col items-center text-center">
            <Avatar name={selectedCandidate.name} size="xl" className="mb-3" />
            <h2 className="text-xl font-bold text-white font-satoshi">{selectedCandidate.name}</h2>
            <p className="text-xs text-indigo-400 font-semibold mt-0.5">{selectedCandidate.role}</p>

            <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-xs font-bold text-indigo-300">
              <Sparkles className="h-4 w-4" /> AI Match Score: {selectedCandidate.matchScore}%
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 space-y-3 text-xs">
            <div className="flex items-center gap-3 text-white/70">
              <Mail className="h-4 w-4 text-white/40" /> {selectedCandidate.email}
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <Phone className="h-4 w-4 text-white/40" /> {selectedCandidate.phone}
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <MapPin className="h-4 w-4 text-white/40" /> {selectedCandidate.location}
            </div>
          </div>
        </Card>

        {/* Detailed Tabs: Skills, Experience, Education */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-4 w-4 text-indigo-400" /> Verified Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 pt-3">
              {selectedCandidate.skills.map((skill) => (
                <Badge key={skill} variant="primary" size="sm">
                  {skill}
                </Badge>
              ))}
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-indigo-400" /> Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-3">
              {selectedCandidate.experience.map((exp, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl border border-white/5 bg-white/[0.02]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{exp.role}</h4>
                    <span className="text-xs text-indigo-400 font-semibold">{exp.period}</span>
                  </div>
                  <p className="text-xs text-white/50">{exp.company}</p>
                  <p className="text-xs text-white/70 mt-2">{exp.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </RecruiterLayout>
  );
}
