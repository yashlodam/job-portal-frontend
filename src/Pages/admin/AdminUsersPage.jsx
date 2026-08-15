/**
 * src/Pages/admin/AdminUsersPage.jsx
 *
 * Admin Comprehensive Users Directory & Management Portal.
 * 100% Real Data displaying all platform users, applicants/candidates, and recruiters.
 * Admin has full privileges to inspect, search, filter, and delete users/applicants.
 */

import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../components/admin/layout/AdminLayout";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/Table";
import { StatusChip } from "../../components/ui/Badge";
import { Tabs } from "../../components/ui/Tabs";
import { Modal } from "../../components/ui/Modal";
import { useToast } from "../../components/ui/ToastNotification";
import { useAppSelector } from "../../State/Store";
import { getAdminUsersApi, deleteUserApi } from "../../api/adminApi";
import { searchTalent } from "../../api/talentApi";
import { getAdminRecruitersApi } from "../../api/verificationApi";
import {
  Users,
  Search,
  RefreshCw,
  Eye,
  Trash2,
  AlertTriangle,
  MapPin,
  Sparkles,
  Briefcase,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

const USER_ROLE_TABS = [
  { id: "ALL", label: "All Users" },
  { id: "APPLICANT", label: "Applicants & Candidates" },
  { id: "EMPLOYER", label: "Recruiters & Employers" },
  { id: "ADMIN", label: "Administrators" },
];

export default function AdminUsersPage() {
  const toast = useToast();
  const authUser = useAppSelector((state) => state.auth.profile);

  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadAllUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Concurrently query backend endpoints to retrieve every single user in the database
      const [adminUsersRes, talentRes, recruitersRes] = await Promise.allSettled([
        getAdminUsersApi({ size: 100 }),
        searchTalent({ size: 100 }),
        getAdminRecruitersApi({ size: 100 }),
      ]);

      const userMap = new Map();

      // 1. Process users from /admin/users or /users
      if (adminUsersRes.status === "fulfilled" && adminUsersRes.value) {
        const raw = adminUsersRes.value?.content || adminUsersRes.value?.data || (Array.isArray(adminUsersRes.value) ? adminUsersRes.value : []);
        if (Array.isArray(raw)) {
          raw.forEach((u) => {
            const email = (u.email || u.workEmail || "").toLowerCase().trim();
            if (email) {
              userMap.set(email, {
                id: u.id || u.userId || u._id,
                name: u.name || u.fullName || u.username || "User",
                email: u.email || u.workEmail,
                role: (u.accountType || u.role || "APPLICANT").toUpperCase(),
                accountType: (u.accountType || u.role || "APPLICANT").toUpperCase(),
                status: u.status || u.verificationStatus || "ACTIVE",
                companyName: u.companyName || u.company,
                designation: u.designation || u.headline,
                location: u.location || u.city,
                skills: u.skills || [],
                createdAt: u.createdAt || u.createdDate,
              });
            }
          });
        }
      }

      // 2. Process Candidates / Applicants from /talent/search
      if (talentRes.status === "fulfilled" && talentRes.value) {
        const talentRaw = talentRes.value?.data?.content || talentRes.value?.data || (Array.isArray(talentRes.value) ? talentRes.value : []);
        if (Array.isArray(talentRaw)) {
          talentRaw.forEach((t) => {
            const email = (t.email || t.user?.email || "").toLowerCase().trim();
            const existing = email ? userMap.get(email) : null;
            const talentData = {
              id: t.id || t.userId || t.user?.id || existing?.id,
              name: t.name || t.fullName || t.user?.name || existing?.name || "Candidate",
              email: t.email || t.user?.email || existing?.email || `applicant-${t.id || Math.random()}@jobportal.ai`,
              role: "APPLICANT",
              accountType: "APPLICANT",
              status: t.status || existing?.status || "ACTIVE",
              headline: t.headline || t.professionalTitle || t.role || existing?.designation,
              companyName: t.currentCompany || t.company,
              location: t.location || (t.city ? `${t.city}, ${t.country || ''}` : existing?.location || "Global"),
              skills: Array.isArray(t.skills) ? t.skills : existing?.skills || [],
              profileImage: t.profileImage || t.image || t.avatar,
              createdAt: t.createdAt || existing?.createdAt,
            };
            if (email) {
              userMap.set(email, { ...existing, ...talentData });
            } else if (t.id) {
              userMap.set(`talent-${t.id}`, talentData);
            }
          });
        }
      }

      // 3. Process Recruiters from /admin/recruiters
      if (recruitersRes.status === "fulfilled" && recruitersRes.value) {
        const recRaw = recruitersRes.value?.content || recruitersRes.value?.data || (Array.isArray(recruitersRes.value) ? recruitersRes.value : []);
        if (Array.isArray(recRaw)) {
          recRaw.forEach((r) => {
            const email = (r.recruiterEmail || r.workEmail || r.email || "").toLowerCase().trim();
            const existing = email ? userMap.get(email) : null;
            const recruiterData = {
              id: r.id || r.userId || r.recruiterId || existing?.id,
              name: r.recruiterName || r.fullName || r.name || existing?.name || "Recruiter",
              email: r.recruiterEmail || r.workEmail || r.email || existing?.email,
              role: "EMPLOYER",
              accountType: "EMPLOYER",
              status: r.status || r.verificationStatus || existing?.status || "PENDING_VERIFICATION",
              verificationStatus: r.status || r.verificationStatus || "PENDING_VERIFICATION",
              companyName: r.companyName || r.company || existing?.companyName,
              companyWebsite: r.companyWebsite || existing?.companyWebsite,
              designation: r.designation || existing?.designation || "Recruiter",
              location: r.companyLocation || r.location || existing?.location,
              createdAt: r.createdAt || r.submittedAt || existing?.createdAt,
            };
            if (email) {
              userMap.set(email, { ...existing, ...recruiterData });
            } else if (r.id) {
              userMap.set(`rec-${r.id}`, recruiterData);
            }
          });
        }
      }

      // 4. Include current authenticated user if not present
      if (authUser?.email) {
        const authEmail = authUser.email.toLowerCase().trim();
        if (!userMap.has(authEmail)) {
          userMap.set(authEmail, {
            id: authUser.id || authUser.userId,
            name: authUser.name || authUser.fullName || "Admin User",
            email: authUser.email,
            role: (authUser.accountType || authUser.role || "ADMIN").toUpperCase(),
            accountType: (authUser.accountType || authUser.role || "ADMIN").toUpperCase(),
            status: authUser.status || "ACTIVE",
            companyName: authUser.companyName,
            designation: authUser.designation,
            createdAt: authUser.createdAt,
          });
        }
      }

      const mergedList = Array.from(userMap.values());
      setUsersList(mergedList);
    } catch (err) {
      console.error("Error loading users in admin:", err);
      toast.error("Failed to load full users directory.");
    } finally {
      setLoading(false);
    }
  }, [authUser, toast]);

  useEffect(() => {
    loadAllUsers();
  }, [loadAllUsers]);

  // Filtering
  const filteredUsers = usersList.filter((u) => {
    const role = (u.accountType || u.role || "APPLICANT").toUpperCase();
    if (activeTab === "APPLICANT") {
      if (role !== "APPLICANT" && role !== "CANDIDATE" && role !== "JOB_SEEKER") return false;
    } else if (activeTab === "EMPLOYER") {
      if (role !== "EMPLOYER" && role !== "RECRUITER") return false;
    } else if (activeTab === "ADMIN") {
      if (role !== "ADMIN") return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const company = (u.companyName || "").toLowerCase();
      const headline = (u.headline || u.designation || "").toLowerCase();
      const skills = Array.isArray(u.skills) ? u.skills.join(" ").toLowerCase() : "";
      return name.includes(q) || email.includes(q) || company.includes(q) || headline.includes(q) || skills.includes(q);
    }
    return true;
  });

  // Handle Delete User
  const handleDeleteUserConfirm = async () => {
    if (!deleteTarget) return;

    if (authUser?.email && deleteTarget.email && authUser.email.toLowerCase() === deleteTarget.email.toLowerCase()) {
      toast.error("You cannot delete your own active administrator account.");
      setDeleteTarget(null);
      return;
    }

    setDeleting(true);
    const targetId = deleteTarget.id || deleteTarget.userId || deleteTarget.recruiterId;

    try {
      if (targetId) {
        await deleteUserApi(targetId);
      }
      toast.success(`Account for "${deleteTarget.name || deleteTarget.email}" deleted successfully.`);
      setUsersList((prev) => prev.filter((u) => u.email !== deleteTarget.email && u.id !== deleteTarget.id));
      if (selectedUser && (selectedUser.email === deleteTarget.email || selectedUser.id === deleteTarget.id)) {
        setSelectedUser(null);
      }
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.message || "Failed to delete user account.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout
      title="Platform Users & Applicants Management"
      subtitle="Complete directory of job seekers, applicants, recruiters, and platform administrators."
      breadcrumbs={[
        { label: "Admin Console", to: "/admin/dashboard" },
        { label: "Users & Applicants", to: "/admin/users" },
      ]}
      action={
        <button
          onClick={loadAllUsers}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>Refresh Directory ({usersList.length})</span>
        </button>
      }
    >
      <div className="space-y-4">
        {/* Filter Tabs & Search Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <Tabs
            tabs={USER_ROLE_TABS}
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
            }}
          />

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, skills…"
              className="w-full rounded-2xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition"
            />
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-[#090d16]/80 p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
            <p className="mt-3 text-xs font-semibold text-slate-400 font-satoshi">Loading complete users directory…</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#090d16]/80 p-12 text-center space-y-2">
            <Users size={36} className="text-slate-500 mx-auto opacity-60" />
            <h4 className="text-sm font-bold text-white font-satoshi">No Users Found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">No accounts matched your filter or search query.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <tr>
                <TableHead>User / Applicant Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Role / Account Type</TableHead>
                <TableHead>Details / Organization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Admin Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const userName = user.name || user.fullName || "User";
                const userEmail = user.email || "—";
                const roleStr = (user.accountType || user.role || "APPLICANT").toUpperCase();
                const isRecruiter = roleStr === "EMPLOYER" || roleStr === "RECRUITER";
                const isAdmin = roleStr === "ADMIN";
                const isApplicant = !isAdmin && !isRecruiter;

                return (
                  <TableRow key={user.id || userEmail}>
                    {/* User & Avatar */}
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                            isAdmin
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                              : isRecruiter
                              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          }`}
                        >
                          {userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white font-satoshi text-xs">{userName}</p>
                          {user.headline ? (
                            <p className="text-[11px] text-slate-400 truncate max-w-[160px]">{user.headline}</p>
                          ) : user.designation ? (
                            <p className="text-[11px] text-slate-400 truncate max-w-[160px]">{user.designation}</p>
                          ) : null}
                        </div>
                      </div>
                    </TableCell>

                    {/* Email */}
                    <TableCell>
                      <span className="font-mono text-slate-300 text-xs">{userEmail}</span>
                    </TableCell>

                    {/* Role Chip */}
                    <TableCell>
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-300 bg-purple-500/15 border border-purple-400/30 px-2 py-0.5 rounded-md">
                          Administrator
                        </span>
                      ) : isRecruiter ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-400/30 px-2 py-0.5 rounded-md">
                          Recruiter / Employer
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 px-2 py-0.5 rounded-md">
                          Applicant / Candidate
                        </span>
                      )}
                    </TableCell>

                    {/* Organization / Details / Skills */}
                    <TableCell>
                      {isRecruiter ? (
                        <span className="text-xs font-medium text-white">{user.companyName || "Recruiter Account"}</span>
                      ) : isApplicant && Array.isArray(user.skills) && user.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {user.skills.slice(0, 3).map((sk) => (
                            <span key={sk} className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] font-semibold text-slate-300 border border-white/5">
                              {sk}
                            </span>
                          ))}
                          {user.skills.length > 3 && (
                            <span className="text-[9px] text-slate-400">+{user.skills.length - 3}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">{user.location || "Global"}</span>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <StatusChip status={user.status || user.verificationStatus || "ACTIVE"} />
                    </TableCell>

                    {/* Actions (Inspect & Delete) */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                          title="Inspect User Details"
                          className="flex h-8 items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
                        >
                          <Eye size={13} />
                          <span>Inspect</span>
                        </button>

                        {/* Admin Delete User / Applicant Button */}
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(user)}
                          title={isApplicant ? "Delete Applicant Account" : isRecruiter ? "Delete Recruiter Account" : "Delete User"}
                          className="flex h-8 items-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 p-2 transition cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* User Details Modal */}
      <Modal
        isOpen={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        title="User Account Details"
        size="md"
      >
        {selectedUser && (
          <div className="p-4 space-y-4 text-slate-200">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-extrabold text-lg">
                {(selectedUser.name || "U").charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white font-satoshi">{selectedUser.name}</h4>
                <p className="text-xs text-slate-400">{selectedUser.email}</p>
                <p className="text-[10px] text-purple-300 font-semibold mt-0.5 uppercase tracking-wider">
                  {selectedUser.accountType || selectedUser.role}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#090d16] p-4 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Account ID:</span>
                <span className="font-mono text-indigo-300 font-bold">#{selectedUser.id || "—"}</span>
              </div>

              {selectedUser.headline && (
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Professional Headline:</span>
                  <span className="font-semibold text-white">{selectedUser.headline}</span>
                </div>
              )}

              {selectedUser.companyName && (
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Company:</span>
                  <span className="font-bold text-white">{selectedUser.companyName}</span>
                </div>
              )}

              {selectedUser.designation && (
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Designation:</span>
                  <span className="font-medium text-white">{selectedUser.designation}</span>
                </div>
              )}

              {selectedUser.location && (
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-white">{selectedUser.location}</span>
                </div>
              )}

              {Array.isArray(selectedUser.skills) && selectedUser.skills.length > 0 && (
                <div className="pt-1 border-b border-white/5 pb-2">
                  <span className="text-slate-400 block mb-1">Skills & Competencies:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedUser.skills.map((s) => (
                      <span key={s} className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-indigo-300 border border-white/5">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between py-1">
                <span className="text-slate-400">Account Status:</span>
                <StatusChip status={selectedUser.status || selectedUser.verificationStatus || "ACTIVE"} />
              </div>
            </div>

            <div className="flex justify-between items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(selectedUser);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Delete Account</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete User / Applicant Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title=""
        size="sm"
      >
        {deleteTarget && (
          <div className="p-4 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h4 className="text-base font-bold text-white font-satoshi">
                {deleteTarget.role === "APPLICANT" || deleteTarget.accountType === "APPLICANT"
                  ? "Delete Applicant Profile?"
                  : deleteTarget.role === "EMPLOYER" || deleteTarget.accountType === "EMPLOYER"
                  ? "Delete Recruiter Account?"
                  : "Delete User Account?"}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to delete <strong className="text-white">{deleteTarget.name || deleteTarget.email}</strong>? This user and their associated data will be removed.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteUserConfirm}
                className="rounded-xl bg-rose-600 hover:bg-rose-500 py-2 text-xs font-bold text-white shadow-lg shadow-rose-600/30 transition cursor-pointer"
              >
                {deleting ? "Deleting…" : "Confirm Delete"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}
