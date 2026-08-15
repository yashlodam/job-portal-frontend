/**
 * src/Pages/admin/AdminRecruitersPage.jsx
 *
 * Master Admin Recruiter Verification Management Dashboard.
 * Accessible only to users with accountType === 'ADMIN'.
 *
 * Features:
 * - 4 Top Statistics Cards (Pending, Approved, Rejected, Suspended)
 * - Status Filter Tabs: [All, Pending Review, Approved, Rejected, Suspended]
 * - Search input (name, email, company)
 * - Complete table with actions
 * - Approval, Rejection (mandatory reason), and Suspension (mandatory reason + warning) modals
 * - Detail inspection slide-over drawer
 */

import React, { useState, useEffect, useCallback } from "react";
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
  Users,
} from "lucide-react";

const FILTER_TABS = [
  { id: "ALL", label: "All Recruiters" },
  { id: "PENDING_VERIFICATION", label: "Pending Review" },
  { id: "APPROVED", label: "Approved" },
  { id: "REJECTED", label: "Rejected" },
  { id: "SUSPENDED", label: "Suspended" },
];

export default function AdminRecruitersPage() {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { adminRecruiters, adminLoading, actionLoading } = useAppSelector(
    (state) => state.verification
  );

  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
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
        size: 10,
        search: searchQuery,
      })
    );
  }, [dispatch, activeTab, currentPage, searchQuery]);

  useEffect(() => {
    loadRecruiters();
  }, [loadRecruiters]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(0);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    loadRecruiters();
  };

  // Inspect Recruiter
  const handleViewDetails = (recruiter) => {
    setSelectedRecruiter(recruiter);
    setDrawerOpen(true);
    const id = recruiter.id || recruiter.userId || recruiter.recruiterId;
    if (id) {
      dispatch(fetchAdminRecruiterDetails(id));
    }
  };

  // Action Confirmations
  const handleConfirmApprove = async (reason) => {
    if (!approveTarget) return;
    const id = approveTarget.id || approveTarget.userId || approveTarget.recruiterId;
    try {
      await dispatch(approveRecruiter(id)).unwrap();
      toast.success(`Recruiter approved successfully.`);
      setApproveTarget(null);
      if (selectedRecruiter && (selectedRecruiter.id === id || selectedRecruiter.userId === id || selectedRecruiter.recruiterId === id)) {
        setSelectedRecruiter((prev) => ({ ...prev, verificationStatus: "APPROVED", status: "APPROVED" }));
      }
      loadRecruiters();
    } catch (err) {
      toast.error(err || "Failed to approve recruiter.");
    }
  };

  const handleConfirmReject = async (reason) => {
    if (!rejectTarget) return;
    const id = rejectTarget.id || rejectTarget.userId || rejectTarget.recruiterId;
    try {
      await dispatch(rejectRecruiter({ id, reason })).unwrap();
      toast.info("Recruiter verification rejected.");
      setRejectTarget(null);
      if (selectedRecruiter && (selectedRecruiter.id === id || selectedRecruiter.userId === id || selectedRecruiter.recruiterId === id)) {
        setSelectedRecruiter((prev) => ({ ...prev, verificationStatus: "REJECTED", status: "REJECTED", rejectionReason: reason }));
      }
      loadRecruiters();
    } catch (err) {
      toast.error(err || "Failed to reject recruiter.");
    }
  };

  const handleConfirmSuspend = async (reason) => {
    if (!suspendTarget) return;
    const id = suspendTarget.id || suspendTarget.userId || suspendTarget.recruiterId;
    try {
      await dispatch(suspendRecruiter({ id, reason })).unwrap();
      toast.warning("Recruiter account suspended.");
      setSuspendTarget(null);
      if (selectedRecruiter && (selectedRecruiter.id === id || selectedRecruiter.userId === id || selectedRecruiter.recruiterId === id)) {
        setSelectedRecruiter((prev) => ({ ...prev, verificationStatus: "SUSPENDED", status: "SUSPENDED", suspensionReason: reason }));
      }
      loadRecruiters();
    } catch (err) {
      toast.error(err || "Failed to suspend recruiter.");
    }
  };

  const recruitersList = adminRecruiters?.content || [];

  // Top Statistics Calculations
  const stats = {
    pending: recruitersList.filter((r) => (r.status || r.verificationStatus) === "PENDING_VERIFICATION" || (r.status || r.verificationStatus) === "PENDING").length,
    approved: recruitersList.filter((r) => (r.status || r.verificationStatus) === "APPROVED" || (r.status || r.verificationStatus) === "VERIFIED").length,
    rejected: recruitersList.filter((r) => (r.status || r.verificationStatus) === "REJECTED" || (r.status || r.verificationStatus) === "VERIFICATION_REJECTED").length,
    suspended: recruitersList.filter((r) => (r.status || r.verificationStatus) === "SUSPENDED").length,
  };

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
          <span>Refresh</span>
        </button>
      }
    >
      {/* 1. Top Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pending Verification */}
        <Card className="p-4 bg-gradient-to-br from-amber-950/30 to-slate-900/60 border border-amber-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pending Review</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-white font-satoshi">
            {stats.pending > 0 ? stats.pending : (activeTab === "PENDING_VERIFICATION" ? recruitersList.length : "—")}
          </p>
          <p className="text-[10px] text-amber-300 font-semibold mt-1">Awaiting Administrator Action</p>
        </Card>

        {/* Total Approved Recruiters */}
        <Card className="p-4 bg-gradient-to-br from-emerald-950/30 to-slate-900/60 border border-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Approved Recruiters</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-white font-satoshi">
            {stats.approved > 0 ? stats.approved : (activeTab === "APPROVED" ? recruitersList.length : "—")}
          </p>
          <p className="text-[10px] text-emerald-400 font-semibold mt-1">Authorized Job Posters</p>
        </Card>

        {/* Total Rejected */}
        <Card className="p-4 bg-gradient-to-br from-rose-950/30 to-slate-900/60 border border-rose-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Rejected</span>
            <XCircle className="h-4 w-4 text-rose-400" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-white font-satoshi">
            {stats.rejected > 0 ? stats.rejected : (activeTab === "REJECTED" ? recruitersList.length : "—")}
          </p>
          <p className="text-[10px] text-rose-300 font-semibold mt-1">Feedback Provided to Employer</p>
        </Card>

        {/* Total Suspended */}
        <Card className="p-4 bg-gradient-to-br from-rose-950/40 to-slate-900/60 border border-rose-600/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Suspended</span>
            <AlertOctagon className="h-4 w-4 text-rose-400" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-white font-satoshi">
            {stats.suspended > 0 ? stats.suspended : (activeTab === "SUSPENDED" ? recruitersList.length : "—")}
          </p>
          <p className="text-[10px] text-rose-400 font-semibold mt-1">Account & Postings Inactive</p>
        </Card>
      </div>

      {/* 2. Filterable Table & Search */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <Tabs
            tabs={FILTER_TABS}
            activeTab={activeTab}
            onChange={handleTabChange}
          />

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or company…"
              className="w-full rounded-2xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition"
            />
          </form>
        </div>

        {/* Recruiter Table */}
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

      {/* 3. Recruiter Inspection Drawer */}
      <AdminRecruiterDetailDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        recruiter={selectedRecruiter}
        onOpenApprove={(rec) => setApproveTarget(rec)}
        onOpenReject={(rec) => setRejectTarget(rec)}
        onOpenSuspend={(rec) => setSuspendTarget(rec)}
      />

      {/* 4. Action Modals */}
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
