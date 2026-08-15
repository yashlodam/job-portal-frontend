/**
 * src/components/recruiter/verification/VerificationStatusCard.jsx
 *
 * Professional status card with clean status badges and non-alarming copy.
 */

import React from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  ShieldCheck,
  Building2,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Badge } from "../../ui/Badge";

export default function VerificationStatusCard({
  status = "PENDING_VERIFICATION",
  submittedAt,
  rejectionReason,
  suspensionReason,
  onResubmit,
}) {
  const normStatus = (status || "PENDING_VERIFICATION").toUpperCase();

  if (normStatus === "APPROVED" || normStatus === "VERIFIED") {
    return (
      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-6 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white font-satoshi">Recruiter Verification</h3>
                <Badge variant="success" size="sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Verified Recruiter
                </Badge>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-xl">
                Your recruiter account has been verified by the platform administration team. You have full access to post jobs, manage candidate pipelines, and connect with top tech talent.
              </p>
            </div>
          </div>
          {submittedAt && (
            <div className="text-xs text-slate-400 sm:text-right shrink-0">
              <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Verified Since</span>
              <span className="font-medium text-white">{submittedAt}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (normStatus === "REJECTED" || normStatus === "VERIFICATION_REJECTED") {
    return (
      <div className="rounded-3xl border border-rose-500/30 bg-rose-950/20 p-6 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400">
              <XCircle size={26} />
            </div>
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white font-satoshi">Verification Status</h3>
                <Badge variant="danger" size="sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                  Verification Rejected
                </Badge>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your recruiter verification submission could not be approved at this time.
              </p>
              {rejectionReason && (
                <div className="p-3.5 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-xs text-rose-200">
                  <span className="font-bold text-rose-300 block mb-0.5">Admin Review Feedback:</span>
                  <span>{rejectionReason}</span>
                </div>
              )}
            </div>
          </div>
          {onResubmit && (
            <button
              onClick={onResubmit}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:scale-105 transition cursor-pointer shrink-0"
            >
              <RotateCcw size={15} />
              <span>Update & Resubmit</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (normStatus === "SUSPENDED") {
    return (
      <div className="rounded-3xl border border-rose-500/30 bg-rose-950/20 p-6 backdrop-blur-xl relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400">
            <AlertOctagon size={26} />
          </div>
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white font-satoshi">Account Status</h3>
              <Badge variant="danger" size="sm">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                Account Suspended
              </Badge>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your recruiter account has been suspended. Recruiter functionality is currently unavailable.
            </p>
            {suspensionReason && (
              <div className="p-3.5 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-xs text-rose-200">
                <span className="font-bold text-rose-300 block mb-0.5">Suspension Notice:</span>
                <span>{suspensionReason}</span>
              </div>
            )}
            <p className="text-[11px] text-slate-400">
              If you believe this is in error, please contact platform support.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default: PENDING_VERIFICATION / UNDER_REVIEW
  return (
    <div className="rounded-3xl border border-amber-500/30 bg-amber-950/20 p-6 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
            <Clock size={26} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white font-satoshi">Recruiter Verification</h3>
              <Badge variant="warning" size="sm">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
                Pending Verification
              </Badge>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-xl">
              Your recruiter account is currently under review by our administration team. Full posting and recruitment features will be unlocked as soon as your company details are verified.
            </p>
          </div>
        </div>
        {submittedAt && (
          <div className="text-xs text-slate-400 sm:text-right shrink-0">
            <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Submitted Date</span>
            <span className="font-medium text-white">{submittedAt}</span>
          </div>
        )}
      </div>
    </div>
  );
}
