/**
 * src/Pages/recruiter/RecruiterJobsPage.jsx
 *
 * Job Management Page for Recruiters supporting:
 * - Tabbed filtering: All, Featured, Draft, Closed
 * - Keyword search & status filters
 * - Data table with status chips & action dropdowns
 * - Quick job edit and status toggle options
 */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, MoreVertical, Edit3, Trash2, Star, CheckCircle, Eye } from "lucide-react";
import RecruiterLayout from "../../components/recruiter/layout/RecruiterLayout";
import { Tabs } from "../../components/ui/Tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Pagination } from "../../components/ui/Table";
import { StatusChip } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { useAppSelector } from "../../State/Store";

export default function RecruiterJobsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const reduxJobs = useAppSelector((state) => state.job.jobs) || [];

  // Sample data fallback if redux is empty
  const mockJobs = [
    { id: 1, title: "Senior React Developer", category: "Engineering", jobType: "Full Time", workingMode: "Remote", applicants: 42, status: "ACTIVE", createdAt: "2026-08-01" },
    { id: 2, title: "AI Research Scientist", category: "AI & ML", jobType: "Full Time", workingMode: "Hybrid", applicants: 19, status: "FEATURED", createdAt: "2026-07-28" },
    { id: 3, title: "Staff Product Designer", category: "Design", jobType: "Full Time", workingMode: "Remote", applicants: 31, status: "ACTIVE", createdAt: "2026-07-25" },
    { id: 4, title: "DevOps Engineer (Kubernetes)", category: "Infrastructure", jobType: "Contract", workingMode: "On Site", applicants: 8, status: "DRAFT", createdAt: "2026-08-04" },
    { id: 5, title: "Junior Frontend Intern", category: "Engineering", jobType: "Internship", workingMode: "Hybrid", applicants: 85, status: "CLOSED", createdAt: "2026-06-15" },
  ];

  const jobsList = reduxJobs.length > 0 ? reduxJobs : mockJobs;

  const tabs = [
    { id: "all", label: "All Jobs", count: jobsList.length },
    { id: "featured", label: "Featured", count: jobsList.filter((j) => (j.status || j.jobStatus) === "FEATURED" || j.featured).length },
    { id: "draft", label: "Drafts", count: jobsList.filter((j) => (j.status || j.jobStatus) === "DRAFT").length },
    { id: "closed", label: "Closed", count: jobsList.filter((j) => (j.status || j.jobStatus) === "CLOSED").length },
  ];

  const filteredJobs = jobsList.filter((job) => {
    const title = job.title || job.jobTitle || "";
    const matchesSearch = title.toLowerCase().includes(searchKeyword.toLowerCase());
    const status = (job.status || job.jobStatus || "ACTIVE").toUpperCase();

    if (activeTab === "featured") return matchesSearch && (status === "FEATURED" || job.featured);
    if (activeTab === "draft") return matchesSearch && status === "DRAFT";
    if (activeTab === "closed") return matchesSearch && status === "CLOSED";
    return matchesSearch;
  });

  return (
    <RecruiterLayout
      title="Job Management"
      subtitle="Create, feature, and manage all your active and archived job listings."
      breadcrumbs={[{ label: "Job Management" }]}
      action={
        <Link
          to="/upload-job"
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:scale-105 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Post New Job</span>
        </Link>
      }
    >
      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Toolbar Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Filter by job title..."
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 focus:border-indigo-500/60 focus:outline-none"
            />
          </div>
          <span className="text-xs text-white/50">
            Showing <span className="font-bold text-white">{filteredJobs.length}</span> job postings
          </span>
        </div>
      </Card>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Title</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Type & Mode</TableHead>
            <TableHead>Applicants</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredJobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>
                <div>
                  <Link to={`/jobs/${job.id}`} className="font-bold text-white hover:text-indigo-400 font-satoshi text-sm transition">
                    {job.title || job.jobTitle}
                  </Link>
                  <p className="text-[11px] text-white/40 mt-0.5">ID #{job.id} · Posted {job.createdAt || "Recently"}</p>
                </div>
              </TableCell>
              <TableCell><span className="text-xs text-white/80">{job.category || job.department || "Engineering"}</span></TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white/90">{job.jobType || "Full Time"}</span>
                  <span className="text-[11px] text-white/50">{job.workingMode || "Remote"}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                  {job.applicants ?? 0}
                </span>
              </TableCell>
              <TableCell><StatusChip status={job.status || job.jobStatus || "ACTIVE"} /></TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Link to={`/jobs/${job.id}`} title="View Job" className="p-1.5 text-white/60 hover:text-indigo-400 hover:bg-white/5 rounded-lg transition">
                    <Eye className="h-4 w-4" />
                  </Link>
                  <button title="Edit Job" className="p-1.5 text-white/60 hover:text-amber-400 hover:bg-white/5 rounded-lg transition cursor-pointer">
                    <Edit3 className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination currentPage={currentPage} totalPages={1} onPageChange={setCurrentPage} totalElements={filteredJobs.length} />
    </RecruiterLayout>
  );
}
