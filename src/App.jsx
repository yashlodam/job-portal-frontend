import React, { Suspense } from 'react';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './Pages/Home';
import Profile from './Pages/TalentProfile/Profile';
import TalentProfilePage from './Pages/TalentProfile/TalentProfilePage';

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

const mantineTheme = createTheme({
  primaryColor: 'indigo',
  fontFamily: 'Satoshi, Inter, system-ui, sans-serif',
  headings: { fontFamily: 'Satoshi, Inter, system-ui, sans-serif' },
  defaultRadius: 'md',
  colors: {
    dark: [
      '#F1F5F9', // 0 - heading text
      '#94A3B8', // 1 - body text
      '#708090', // 2 - muted text
      '#1C2333', // 3 - surface hover
      '#161B22', // 4 - surface elevated
      '#0D1117', // 5 - surface
      '#0a0e17', // 6 - body bg (slightly lighter)
      '#06080F', // 7 - background (deepest)
      '#050710', // 8
      '#030408', // 9
    ],
  },
});

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
      <MantineProvider theme={mantineTheme} forceColorScheme="dark">
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
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </MantineProvider>
    </ErrorBoundary>
  );
}

export default App;