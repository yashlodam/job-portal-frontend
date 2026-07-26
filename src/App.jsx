import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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


/* ──────────────────────────────────────────────
   Lazy-loaded routes — large pages loaded on demand
   ────────────────────────────────────────────── */

const FindJobs = React.lazy(() => import('./Pages/FindJobs'));
const FindTalent = React.lazy(() => import('./Pages/FindTalent'));
const UploadJob = React.lazy(() => import('./Pages/UploadJob'));
const About = React.lazy(() => import('./Pages/About'));
const JobDetail = React.lazy(() => import('./Pages/JobDetail'));
const NotFound = React.lazy(() => import('./Pages/NotFound'));

/* ──────────────────────────────────────────────
   Mantine theme — dark mode matching design tokens
   ────────────────────────────────────────────── */



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

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center">
          <h1 className="font-satoshi text-3xl font-bold text-heading">
            Something went wrong
          </h1>
          <p className="mt-4 text-body">
            Please refresh the page or try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary mt-8"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/* ──────────────────────────────────────────────
   Suspense fallback — minimal loading state
   ────────────────────────────────────────────── */

function PageLoader() {
  return (
    <div
      className="flex min-h-[60dvh] flex-col items-center justify-center gap-4"
      role="status"
      aria-label="Loading page"
    >
      <div className="relative">
        {/* Outer ring */}
        <div
          className="h-12 w-12 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: 'rgba(99,102,241,0.20)', borderTopColor: '#6366F1' }}
        />
        {/* Center dot */}
        <div
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="h-2 w-2 rounded-full animate-pulse"
            style={{ background: '#6366F1' }}
          />
        </div>
      </div>
      <p className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
        Loading…
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────
   App Root
   ────────────────────────────────────────────── */

function App() {

  

  return (
    
    <ErrorBoundary>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/find-jobs" element={<FindJobs />} />
                <Route path="/find-talent" element={<FindTalent />} />
                <Route path='/profile' element={<Profile/>}/>
                <Route path="/upload-job" element={<UploadJob />} />
                <Route path='/talent-profile' element={<TalentProfilePage/>}/>
                <Route path="/about" element={<About />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path='/apply-jobs' element={<ApplyJobPage/>}/>
                <Route path='/company' element={<CompanyPage/>}/>
                <Route path="*" element={<NotFound />} />
                <Route path='/posted-job' element={<PostedJobPage/>} />
                <Route path='/auth' element={<SignUpPage/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/profiles' element={<ProfilePage/>}/>
                <Route path='/reset-password' element={<ResetPassword/>}/>
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
    </ErrorBoundary>
    
  );
}

export default App;