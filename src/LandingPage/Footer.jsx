/**
 * src/LandingPage/Footer.jsx
 *
 * Ultra-Premium 3D Glassmorphic Footer Component.
 * Features Satoshi typography, newsletter capture, live status indicator,
 * and clean category link columns.
 */

import React, { useState } from "react";
import { Sparkles, ArrowRight, Send, CheckCircle2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const FOOTER_LINKS = {
  Platform: [
    { label: "AI Job Matcher", href: "/find-jobs", internal: true },
    { label: "Multi-Tone Cover Letter", href: "/apply?jobId=1", internal: true },
    { label: "My Applications Pipeline", href: "/my-jobs/applied", internal: true },
    { label: "Career Hub & AI Tools", href: "/career-hub", internal: true },
  ],
  Recruiter: [
    { label: "Post a Job", href: "/upload-job", internal: true },
    { label: "Find Candidate Talent", href: "/find-talent", internal: true },
    { label: "ATS Pipeline Management", href: "/recruiter/candidates/applications", internal: true },
    { label: "Company Profile", href: "/company", internal: true },
  ],
  Company: [
    { label: "About Us", href: "/about", internal: true },
    { label: "Careers", href: "/find-jobs", internal: true },
    { label: "Contact Support", href: "/about", internal: true },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Preferences", href: "#" },
    { label: "Security & Trust", href: "#" },
  ],
};

function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { Icon: TwitterIcon, label: "Twitter", href: "#" },
  { Icon: LinkedInIcon, label: "LinkedIn", href: "#" },
  { Icon: GitHubIcon, label: "GitHub", href: "#" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const location = useLocation();

  if (location.pathname === "/signup" || location.pathname === "/login") {
    return null;
  }

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="relative bg-[#05070d] border-t border-white/10 font-inter text-slate-300 overflow-hidden" role="contentinfo">
      {/* Top Gradient Glow Accent */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <div className="pointer-events-none absolute top-0 left-1/2 h-40 w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-12">
          
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform">
                <Sparkles size={20} className="text-white fill-amber-300/20" />
              </div>
              <span className="text-2xl font-black text-white font-satoshi tracking-tight">
                JobPortal <span className="text-indigo-400">AI</span>
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
              AI-powered career intelligence for developers, designers, and engineering leaders. Discover, apply, and land top roles faster.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300 font-satoshi mb-2.5">
                Join 50,000+ Tech Professionals
              </p>
              {subscribed ? (
                <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 px-4 py-2 text-xs font-bold text-emerald-300">
                  <CheckCircle2 size={15} className="text-emerald-400" />
                  Subscribed to AI Career Insights!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email..."
                    required
                    className="flex-1 rounded-2xl border border-white/10 bg-[#090d16]/90 px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500/60 transition"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-indigo-500 transition cursor-pointer shrink-0"
                  >
                    <Send size={13} />
                    <span>Join</span>
                  </button>
                </form>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              {SOCIAL_LINKS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-400 hover:border-indigo-500/40 hover:bg-white/10 hover:text-white transition cursor-pointer"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-white font-satoshi">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => {
                  const LinkComponent = link.internal ? Link : "a";
                  const linkProps = link.internal ? { to: link.href } : { href: link.href };

                  return (
                    <li key={link.label}>
                      <LinkComponent
                        {...linkProps}
                        className="group inline-flex items-center text-xs font-medium text-slate-400 hover:text-white transition-colors"
                      >
                        <ArrowRight
                          size={12}
                          className="mr-1.5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 text-indigo-400"
                        />
                        {link.label}
                      </LinkComponent>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Copyright & Live Status Row */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 font-medium">
            © {new Date().getFullYear()} JobPortal AI Platform. All rights reserved.
          </p>

          <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-300 font-satoshi">
              All AI Services Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
