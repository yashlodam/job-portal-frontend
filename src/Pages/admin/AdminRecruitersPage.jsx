/**
 * src/Pages/admin/AdminRecruitersPage.jsx
 *
 * Master Admin Recruiter Verification Management Dashboard.
 * Accessible only to users with accountType === 'ADMIN'.
 *
 * Features:
 * - 4 Top Statistics Cards with clickable tab filters (Pending, Approved, Rejected, Suspended)
 * - Status Filter Tabs: [All, Pending Verification, Approved, Rejected, Suspended]
 * - Debounced search input (name, email, company)
 * - Sort dropdown: [Newest First, Oldest First, Recently Submitted]
 * - Full verification data table with relative time & tooltip
 * - Approve, Reject (mandatory reason), and Suspend (mandatory reason + warning) modals
 * - Detail inspection slide-over drawer
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import AdminRecruiterTable from "../../components/admin/verification/AdminRecruiterTable";
import AdminRecruiterDetailDrawer from "../../components/admin/verification/AdminRecruiterDetailDrawer";
import {
  ApproveRecruiterModal,
  RejectRecruiterModal,
  SuspendRecruiterModal,
} from "../../components/admin/verification/AdminActionModals";
import { Card } from "../../components/ui/Card";
import { Tabs } from "../../components/ui/Tabs";
import { useToast } from "../../components/ui/ToastNotification";
import { useAppDispatch, useAppSelector } from "../../State/Store";
import {
  fetchAdminRecruiters,
  fetchAdminRecruiterDetails,
  approveRecruiter,
  rejectRecruiter,
  suspendRecruiter,
} from "../../State/verificationSlice";
import {
  Search,
  RefreshCw,
  Clock,
  ShieldCheck,
  XCircle,
  AlertOctagon,
  ArrowUpDown,
  Filter,
} from "lucide-react";

const FILTER_TABS = [
  { id: "ALL", label: "All Recruiters" },
  { id: "PENDING_VERIFICATION", label: "Pending Review" },
  { id: "APPROVED", label: "Approved" },
  { id: "REJECTED", label: "Rejected" },
  { id: "SUSPENDED", label: "Suspended" },
];

const SORT_OPTIONS = [
  { value: "createdAt,desc", label: "Newest First" },
  { value: "createdAt,asc", label: "Oldest First" },
  { value: "submittedAt,desc", label: "Recently Submitted" },
];

export default function AdminRecruitersPage() {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { adminRecruiters, adminLoading, actionLoading } = useAppSelector(
    (state) => state.verification
  );

  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt,desc");
  const [currentPage, setCurrentPage] = useState(0);

  // Modal / Drawer States
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [approveTarget, setApproveTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [suspendTarget, setSuspendTarget] = useState(null);

  const loadRecruiters = useCallback(() => {
    dispatch(
      fetchAdminRecruiters({
        status: activeTab === "ALL" ? undefined : activeTab,
        page: currentPage,
        size: 15,
        search: searchQuery.trim(),
        sort: sortBy,
      })
    );
  }, [dispatch, activeTab, currentPage, searchQuery, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadRecruiters();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadRecruiters]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(0);
  };

  // Inspect Recruiter
  const handleViewDetails = (recruiter) => {
    setSelectedRecruiter(recruiter);
    setDrawerOpen(true);
    const id = recruiter.recruiterId || recruiter.id || recruiter.userId;
    if (id) {
      dispatch(fetchAdminRecruiterDetails(id));
    }
  };

  // Action Confirmations
  const handleConfirmApprove = async (reason) => {
    if (!approveTarget) return;
    const id = approveTarget.recruiterId || approveTarget.id || approveTarget.userId;
    try {
      await dispatch(approveRecruiter({ id, reason })).unwrap();
      toast.success(`Recruiter account approved successfully.`);
      setApproveTarget(null);
      if (selectedRecruiter && (selectedRecruiter.recruiterId === id || selectedRecruiter.id === id)) {
        setSelectedRecruiter((prev) => ({ ...prev, verificationStatus: "APPROVED", status: "APPROVED" }));
      }
      loadRecruiters();
    } catch (err) {
      toast.error(err || "Failed to approve recruiter.");
    }
  };

  const handleConfirmReject = async (reason) => {
    if (!rejectTarget) return;
    const id = rejectTarget.recruiterId || rejectTarget.id || rejectTarget.userId;
    try {
      await dispatch(rejectRecruiter({ id, reason })).unwrap();
      toast.info("Recruiter verification rejected.");
      setRejectTarget(null);
      if (selectedRecruiter && (selectedRecruiter.recruiterId === id || selectedRecruiter.id === id)) {
        setSelectedRecruiter((prev) => ({
          ...prev,
          verificationStatus: "REJECTED",
          status: "REJECTED",
          rejectionReason: reason,
        }));
      }
      loadRecruiters();
    } catch (err) {
      toast.error(err || "Failed to reject recruiter.");
    }
  };

  const handleConfirmSuspend = async (reason) => {
    if (!suspendTarget) return;
    const id = suspendTarget.recruiterId || suspendTarget.id || suspendTarget.userId;
    try {
      await dispatch(suspendRecruiter({ id, reason })).unwrap();
      toast.warning("Recruiter account suspended.");
      setSuspendTarget(null);
      if (selectedRecruiter && (selectedRecruiter.recruiterId === id || selectedRecruiter.id === id)) {
        setSelectedRecruiter((prev) => ({
          ...prev,
          verificationStatus: "SUSPENDED",
          status: "SUSPENDED",
          suspensionReason: reason,
        }));
      }
      loadRecruiters();
    } catch (err) {
      toast.error(err || "Failed to suspend recruiter.");
    }
  };

  const recruitersList = adminRecruiters?.content || [];

  // Top Statistics Calculations
  const stats = useMemo(() => {
    return {
      pending: recruitersList.filter(
        (r) =>
          (r.status || r.verificationStatus) === "PENDING_VERIFICATION" ||
          (r.status || r.verificationStatus) === "PENDING"
      ).length,
      approved: recruitersList.filter(
        (r) =>
          (r.status || r.verificationStatus) === "APPROVED" ||
          (r.status || r.verificationStatus) === "VERIFIED"
      ).length,
      rejected: recruitersList.filter(
        (r) =>
          (r.status || r.verificationStatus) === "REJECTED" ||
          (r.status || r.verificationStatus) === "VERIFICATION_REJECTED"
      ).length,
      suspended: recruitersList.filter(
        (r) => (r.status || r.verificationStatus) === "SUSPENDED"
      ).length,
    };
  }, [recruitersList]);

  return (
    <AdminLayout
      title="Recruiter Verifications & Operations"
      subtitle="Review employer compliance, inspect corporate profiles, and authorize recruiting privileges."
      breadcrumbs={[
        { label: "Admin Console", to: "/admin/dashboard" },
        { label: "Recruiter Verifications", to: "/admin/recruiters" },
      ]}
      action={
        <button
          onClick={loadRecruiters}
          disabled={adminLoading}
          className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
        >
          <RefreshCw size={14} className={adminLoading ? "animate-spin" : ""} />
          <span>Refresh Queue</span>
        </button>
      }
    >
      {/* 1. Top Metrics KPI Bar (Clickable Filter Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Review Card */}
        <button
          type="button"
          onClick={() => handleTabChange("PENDING_VERIFICATION")}
          className="text-left w-full cursor-pointer focus:outline-none"
        >
          <Card
            className={`p-4 transition-all duration-200 ${
              activeTab === "PENDING_VERIFICATION"
                ? "bg-amber-950/60 border-amber-400 ring-2 ring-amber-400/20"
                : "bg-gradient-to-br from-amber-950/30 to-slate-900/60 border-amber-500/20 hover:border-amber-500/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-200">Pending Review</span>
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-white font-satoshi">
              {stats.pending > 0 ? stats.pending : (activeTab === "PENDING_VERIFICATION" ? recruitersList.length : "0")}
            </p>
            <p className="text-[10px] text-amber-300 font-semibold mt-1">Awaiting Administrator Action</p>
          </Card>
        </button>

        {/* Approved Recruiters Card */}
        <button
          type="button"
          onClick={() => handleTabChange("APPROVED")}
          className="text-left w-full cursor-pointer focus:outline-none"
        >
          <Card
            className={`p-4 transition-all duration-200 ${
              activeTab === "APPROVED"
                ? "bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-400/20"
                : "bg-gradient-to-br from-emerald-950/30 to-slate-900/60 border-emerald-500/20 hover:border-emerald-500/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-200">Approved Active</span>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-white font-satoshi">
              {stats.approved > 0 ? stats.approved : (activeTab === "APPROVED" ? recruitersList.length : "0")}
            </p>
            <p className="text-[10px] text-emerald-400 font-semibold mt-1">Authorized Job Posters</p>
          </Card>
        </button>

        {/* Rejected Card */}
        <button
          type="button"
          onClick={() => handleTabChange("REJECTED")}
          className="text-left w-full cursor-pointer focus:outline-none"
        >
          <Card
            className={`p-4 transition-all duration-200 ${
              activeTab === "REJECTED"
                ? "bg-rose-950/60 border-rose-400 ring-2 ring-rose-400/20"
                : "bg-gradient-to-br from-rose-950/30 to-slate-900/60 border-rose-500/20 hover:border-rose-500/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-200">Rejected</span>
              <XCircle className="h-4 w-4 text-rose-400" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-white font-satoshi">
              {stats.rejected > 0 ? stats.rejected : (activeTab === "REJECTED" ? recruitersList.length : "0")}
            </p>
            <p className="text-[10px] text-rose-300 font-semibold mt-1">Feedback Provided to Employer</p>
          </Card>
        </button>

        {/* Suspended Card */}
        <button
          type="button"
          onClick={() => handleTabChange("SUSPENDED")}
          className="text-left w-full cursor-pointer focus:outline-none"
        >
          <Card
            className={`p-4 transition-all duration-200 ${
              activeTab === "SUSPENDED"
                ? "bg-rose-950/70 border-rose-500 ring-2 ring-rose-500/20"
                : "bg-gradient-to-br from-rose-950/40 to-slate-900/60 border-rose-600/30 hover:border-rose-500/50"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-200">Suspended</span>
              <AlertOctagon className="h-4 w-4 text-rose-400" />
            </div>
            <p className="mt-2 text-2xl font-extrabold text-white font-satoshi">
              {stats.suspended > 0 ? stats.suspended : (activeTab === "SUSPENDED" ? recruitersList.length : "0")}
            </p>
            <p className="text-[10px] text-rose-400 font-semibold mt-1">Account & Postings Inactive</p>
          </Card>
        </button>
      </div>

      {/* 2. Filter & Search Toolbar */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <Tabs
            tabs={FILTER_TABS}
            activeTab={activeTab}
            onChange={handleTabChange}
          />

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(0);
                }}
                className="appearance-none rounded-2xl border border-white/10 bg-[#090d16] px-3.5 py-2 pr-8 text-xs font-semibold text-slate-300 focus:border-purple-500 focus:outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#090d16] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
              <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(0);
                }}
                placeholder="Search recruiter or company…"
                className="w-full rounded-2xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition"
              />
            </div>
          </div>
        </div>

        {/* 3. Recruiter Data Table */}
        <AdminRecruiterTable
          recruiters={recruitersList}
          loading={adminLoading}
          currentPage={currentPage}
          totalPages={adminRecruiters?.totalPages || 1}
          totalElements={adminRecruiters?.totalElements || recruitersList.length}
          onPageChange={(p) => setCurrentPage(p)}
          onViewDetails={handleViewDetails}
          onApprove={(rec) => setApproveTarget(rec)}
          onReject={(rec) => setRejectTarget(rec)}
          onSuspend={(rec) => setSuspendTarget(rec)}
        />
      </div>

      {/* 4. Slide-over Inspection Drawer */}
      <AdminRecruiterDetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        recruiter={selectedRecruiter}
        onOpenApprove={(rec) => setApproveTarget(rec)}
        onOpenReject={(rec) => setRejectTarget(rec)}
        onOpenSuspend={(rec) => setSuspendTarget(rec)}
      />

      {/* 5. Action Modals */}
      <ApproveRecruiterModal
        isOpen={Boolean(approveTarget)}
        onClose={() => setApproveTarget(null)}
        recruiter={approveTarget}
        onConfirm={handleConfirmApprove}
        loading={actionLoading}
      />

      <RejectRecruiterModal
        isOpen={Boolean(rejectTarget)}
        onClose={() => setRejectTarget(null)}
        recruiter={rejectTarget}
        onConfirm={handleConfirmReject}
        loading={actionLoading}
      />

      <SuspendRecruiterModal
        isOpen={Boolean(suspendTarget)}
        onClose={() => setSuspendTarget(null)}
        recruiter={suspendTarget}
        onConfirm={handleConfirmSuspend}
        loading={actionLoading}
      />
    </AdminLayout>
  );
}
