import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from './components/Layout';
import Home from './Pages/Home';
import Profile from './Pages/TalentProfile/Profile';
import TalentProfilePage from './Pages/TalentProfile/TalentProfilePage';
import ApplyJobPage from './Pages/ApplyJobPage';
import CompanyPage from './Pages/CompanyPage';
import PostedJobPage from './Pages/PostedJobPage';
import SignUp from './SignUpLogin/SignUp';
import SignUpPage from './Pages/SignUpPage';
import Login from './SignUpLogin/Login';
import ProfilePage from './Pages/ProfilePage';
import ResetPassword from './SignUpLogin/ResetPassword';
import { restoreAuthState } from './State/AuthSlic';
import { getAllJobs, getCategories, getWorkModes } from './State/JobSlice';
import { useAppSelector } from './State/Store';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import RecruiterRoute from './components/auth/RecruiterRoute';
import RecruiterVerificationGuard from './components/auth/RecruiterVerificationGuard';
import AdminRoute from './components/auth/AdminRoute';
import { ToastProvider } from './components/ui/ToastNotification';

/* ──────────────────────────────────────────────
   Lazy-loaded routes — large pages loaded on demand
   ────────────────────────────────────────────── */

const FindJobs  = React.lazy(() => import('./Pages/FindJobs'));
const FindTalent = React.lazy(() => import('./Pages/FindTalent'));
const UploadJob = React.lazy(() => import('./Pages/UploadJob'));
const About     = React.lazy(() => import('./Pages/About'));
const JobDetail = React.lazy(() => import('./Pages/JobDetail'));
const MyJobsPage = React.lazy(() => import('./Pages/MyJobsPage'));
const CareerHubPage = React.lazy(() => import('./Pages/CareerHubPage'));
const ResumeAnalyzerMain = React.lazy(() => import('./features/resume-analyzer/pages/ResumeAnalyzerMain'));
const MockInterviewMain = React.lazy(() => import('./features/mock-interview/pages/MockInterviewMain'));
const MessagesPage = React.lazy(() => import('./Pages/MessagesPage'));
const NotificationsPage = React.lazy(() => import('./features/notifications/pages/NotificationsPage'));
const SettingsPage = React.lazy(() => import('./Pages/SettingsPage'));

// Recruiter Studio Pages
const RecruiterDashboardPage = React.lazy(() => import('./Pages/recruiter/RecruiterDashboardPage'));
const RecruiterVerificationPage = React.lazy(() => import('./Pages/recruiter/RecruiterVerificationPage'));
const RecruiterJobsPage = React.lazy(() => import('./Pages/recruiter/RecruiterJobsPage'));
const RecruiterApplicationsPage = React.lazy(() => import('./Pages/recruiter/RecruiterApplicationsPage'));
const RecruiterCandidatesPage = React.lazy(() => import('./Pages/recruiter/RecruiterCandidatesPage'));
const RecruiterInterviewsPage = React.lazy(() => import('./Pages/recruiter/RecruiterInterviewsPage'));
const RecruiterCompanyPage = React.lazy(() => import('./Pages/recruiter/RecruiterCompanyPage'));
const RecruiterAnalyticsPage = React.lazy(() => import('./Pages/recruiter/RecruiterAnalyticsPage'));
const RecruiterSettingsPage = React.lazy(() => import('./Pages/recruiter/RecruiterSettingsPage'));
const RecruiterMessagesPage = React.lazy(() => import('./Pages/recruiter/RecruiterMessagesPage'));

// Admin Console Pages
const AdminDashboardPage = React.lazy(() => import('./Pages/admin/AdminDashboardPage'));
const AdminRecruitersPage = React.lazy(() => import('./Pages/admin/AdminRecruitersPage'));
const AdminUsersPage = React.lazy(() => import('./Pages/admin/AdminUsersPage'));
const AdminCompaniesPage = React.lazy(() => import('./Pages/admin/AdminCompaniesPage'));
const AdminJobsPage = React.lazy(() => import('./Pages/admin/AdminJobsPage'));
const AdminReportsPage = React.lazy(() => import('./Pages/admin/AdminReportsPage'));

const NotFound  = React.lazy(() => import('./Pages/NotFound'));

/* ──────────────────────────────────────────────
   Error Boundary — graceful crash handling
   ────────────────────────────────────────────── */

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#070b12] text-white p-6 font-inter">
          <div className="text-center max-w-md space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400 text-xl font-bold">
              !
            </div>
            <h2 className="text-xl font-black font-satoshi">Something went wrong</h2>
            <p className="text-xs text-slate-400">
              An unexpected error occurred. Please refresh the page to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-indigo-500 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ──────────────────────────────────────────────
   Page Loading Placeholder
   ────────────────────────────────────────────── */

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
    </div>
  );
}

/* ──────────────────────────────────────────────
   Startup Auth Restoration Loader
   ────────────────────────────────────────────── */

function AuthRestoreLoader() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#070b12',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        gap: '16px',
      }}
    >
      <div className="relative flex items-center justify-center">
        <div
          className="h-10 w-10 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: '#6366F1', borderRightColor: '#818CF8' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="h-2.5 w-2.5 rounded-full animate-pulse"
            style={{ background: '#6366F1' }}
          />
        </div>
      </div>
      <p className="text-sm font-medium text-slate-400 font-satoshi">
        Connecting to JobPortal AI…
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────
   App Root
   ────────────────────────────────────────────── */

function App() {
  const dispatch = useDispatch();
  const isAuthRestored = useSelector((state) => state.auth.isAuthRestored);

  useEffect(() => {
    dispatch(getAllJobs());
    dispatch(getCategories());
    dispatch(getWorkModes());
  }, [dispatch]);

  useEffect(() => {
    dispatch(restoreAuthState());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isAuthRestored) {
    return <AuthRestoreLoader />;
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ─────────────────────────────────────────────────────────────
                  PUBLIC AUTH ROUTES
                  Accessible ONLY when NOT logged in.
                 ───────────────────────────────────────────────────────────── */}
              <Route element={<PublicRoute />}>
                <Route path="/auth"          element={<SignUpPage defaultIsLogin={true} />} />
                <Route path="/login"         element={<SignUpPage defaultIsLogin={true} />} />
                <Route path="/signup"        element={<SignUpPage defaultIsLogin={false} />} />
                <Route path="/register"      element={<SignUpPage defaultIsLogin={false} />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Route>

              {/* ─────────────────────────────────────────────────────────────
                  ADMIN SECURE CONSOLE ROUTES (Guarded by AdminRoute)
                 ───────────────────────────────────────────────────────────── */}
              <Route element={<AdminRoute />}>
                <Route path="/admin"            element={<AdminDashboardPage />} />
                <Route path="/admin/dashboard"  element={<AdminDashboardPage />} />
                <Route path="/admin/recruiters" element={<AdminRecruitersPage />} />
                <Route path="/admin/users"      element={<AdminUsersPage />} />
                <Route path="/admin/companies"  element={<AdminCompaniesPage />} />
                <Route path="/admin/jobs"       element={<AdminJobsPage />} />
                <Route path="/admin/reports"    element={<AdminReportsPage />} />
              </Route>

              {/* ─────────────────────────────────────────────────────────────
                  RECRUITER STUDIO ROUTES
                  Guarded by RecruiterRoute — ONLY EMPLOYER/RECRUITER accounts.
                  Applicants and Admins are redirected away automatically.
                 ───────────────────────────────────────────────────────────── */}
              <Route element={<RecruiterRoute />}>
                <Route element={<Layout />}>
                  {/* Recruiter Core — accessible to all verified/pending recruiters */}
                  <Route path="/dashboard"               element={<RecruiterDashboardPage />} />
                  <Route path="/recruiter/dashboard"     element={<RecruiterDashboardPage />} />
                  <Route path="/recruiter/verification"  element={<RecruiterVerificationPage />} />
                  <Route path="/recruiter/company"       element={<RecruiterCompanyPage />} />
                  <Route path="/recruiter/settings"      element={<RecruiterSettingsPage />} />

                  {/* Recruiter Full Privileges — also requires APPROVED status */}
                  <Route element={<RecruiterVerificationGuard />}>
                    <Route path="/upload-job"                         element={<UploadJob />} />
                    <Route path="/recruiter/jobs"                     element={<RecruiterJobsPage />} />
                    <Route path="/recruiter/jobs/manage"              element={<RecruiterJobsPage />} />
                    <Route path="/recruiter/jobs/featured"            element={<RecruiterJobsPage />} />
                    <Route path="/recruiter/jobs/archived"            element={<RecruiterJobsPage />} />
                    <Route path="/recruiter/applications"             element={<RecruiterApplicationsPage />} />
                    <Route path="/recruiter/candidates/applications"  element={<RecruiterApplicationsPage />} />
                    <Route path="/recruiter/candidates"               element={<RecruiterCandidatesPage />} />
                    <Route path="/recruiter/interviews"               element={<RecruiterInterviewsPage />} />
                    <Route path="/recruiter/analytics"                element={<RecruiterAnalyticsPage />} />
                    <Route path="/recruiter/messages"                 element={<RecruiterMessagesPage />} />
                  </Route>
                </Route>
              </Route>

              {/* ─────────────────────────────────────────────────────────────
                  PROTECTED APPLICATION ROUTES
                  Accessible to any authenticated user (all account types).
                 ───────────────────────────────────────────────────────────── */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  {/* Candidate / Job Seeker Pages */}
                  <Route path="/"              element={<Home />} />
                  <Route path="/find-jobs"     element={<FindJobs />} />
                  <Route path="/find-talent"   element={<FindTalent />} />
                  <Route path="/profiles"      element={<Profile />} />
                  <Route path="/talent-profile" element={<TalentProfilePage />} />
                  <Route path="/talent-profile/:id" element={<TalentProfilePage />} />
                  <Route path="/about"         element={<About />} />
                  <Route path="/jobs/:id"      element={<JobDetail />} />
                  <Route path="/apply-jobs"    element={<ApplyJobPage />} />
                  <Route path="/company/:id"   element={<CompanyPage />} />
                  <Route path="/posted-job"    element={<PostedJobPage />} />

                  {/* My Jobs Section */}
                  <Route path="/my-jobs"                 element={<MyJobsPage />} />
                  <Route path="/my-jobs/applied"         element={<MyJobsPage />} />
                  <Route path="/my-jobs/recommended"     element={<MyJobsPage />} />
                  <Route path="/my-jobs/saved"           element={<MyJobsPage />} />
                  <Route path="/my-jobs/interviews"      element={<MyJobsPage />} />

                  {/* Career Hub & AI Suite */}
                  <Route path="/career-hub"                 element={<CareerHubPage />} />
                  <Route path="/career-hub/resume-builder"  element={<CareerHubPage />} />
                  <Route path="/career-hub/resume-analyzer" element={<CareerHubPage />} />
                  <Route path="/career-hub/interview-coach" element={<CareerHubPage />} />
                  <Route path="/career-hub/assessments"     element={<CareerHubPage />} />
                  <Route path="/career-hub/roadmaps"        element={<CareerHubPage />} />
                  <Route path="/career-hub/salary-insights" element={<CareerHubPage />} />
                  <Route path="/resume-builder"             element={<CareerHubPage />} />
                  <Route path="/resume-analyzer"            element={<ResumeAnalyzerMain />} />
                  <Route path="/mock-interview"             element={<MockInterviewMain />} />
                  <Route path="/interview-coach"            element={<CareerHubPage />} />
                  <Route path="/assessments"                element={<CareerHubPage />} />
                  <Route path="/roadmaps"                   element={<CareerHubPage />} />
                  <Route path="/salary-insights"            element={<CareerHubPage />} />

                  {/* Profile, Notifications, Messages & Settings */}
                  <Route path="/profile"        element={<ProfilePage />} />
                  <Route path="/notifications"  element={<NotificationsPage />} />
                  <Route path="/messages"       element={<MessagesPage />} />
                  <Route path="/settings"       element={<SettingsPage />} />

                  <Route path="*" element={<NotFound />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;