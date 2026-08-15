/**
 * src/components/auth/RecruiterVerificationGuard.jsx
 *
 * Route guard that ensures only APPROVED / VERIFIED recruiters can access
 * restricted actions (posting jobs, managing live candidate pipelines, etc.).
 *
 * If a recruiter is PENDING_VERIFICATION, REJECTED, or SUSPENDED, they are
 * gracefully redirected to /recruiter/verification with an informative toast.
 */

import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../State/Store";
import { useToast } from "../ui/ToastNotification";

export default function RecruiterVerificationGuard() {
  const user = useAppSelector((state) => state.auth.profile);
  const { recruiterVerification } = useAppSelector((state) => state.verification);
  const location = useLocation();
  const toast = useToast();

  const isRecruiter =
    user?.accountType === "EMPLOYER" ||
    user?.role === "EMPLOYER" ||
    user?.accountType === "RECRUITER" ||
    user?.role === "RECRUITER";

  const verificationStatus = (
    recruiterVerification?.status ||
    recruiterVerification?.data?.status ||
    user?.verificationStatus ||
    user?.status ||
    "PENDING_VERIFICATION"
  ).toUpperCase();

  const isApproved = verificationStatus === "APPROVED" || verificationStatus === "VERIFIED";

  useEffect(() => {
    if (isRecruiter && !isApproved) {
      if (verificationStatus === "SUSPENDED") {
        toast.error("Your recruiter account is currently suspended.");
      } else if (verificationStatus === "REJECTED" || verificationStatus === "VERIFICATION_REJECTED") {
        toast.warning("Your recruiter verification was rejected. Please update your details.");
      } else {
        toast.info("Your recruiter account is awaiting verification. Verification is required to access this feature.");
      }
    }
  }, [isRecruiter, isApproved, verificationStatus, toast]);

  if (isRecruiter && !isApproved) {
    return <Navigate to="/recruiter/verification" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
