import React, { useState } from "react";
import { Sparkles, ArrowRight, Send } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

/* ===========================
    Footer Link Columns
=========================== */

const footerLinks = {
  Product: [
    { label: "AI Job Search",   href: "/find-jobs", internal: true },
    { label: "Resume Builder",  href: "#" },
    { label: "Cover Letter",    href: "#" },
    { label: "Interview Prep",  href: "#" },
    { label: "Career Assistant",href: "#" },
  ],
  Company: [
    { label: "About Us",  href: "/about", internal: true },
    { label: "Careers",   href: "#" },
    { label: "Blog",      href: "#" },
    { label: "Press",     href: "#" },
    { label: "Contact",   href: "#" },
  ],
  Resources: [
    { label: "Help Center", href: "#" },
    { label: "API Docs",    href: "#" },
    { label: "Community",   href: "#" },
    { label: "Partners",    href: "#" },
    { label: "Status",      href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy",  href: "#" },
    { label: "Terms of Service",href: "#" },
    { label: "Cookie Policy",   href: "#" },
    { label: "GDPR",            href: "#" },
  ],
};

/* ===========================
    Social Icons (inline SVG)
=========================== */

function TwitterIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const socialIcons = [
  {
    Icon: TwitterIcon,
    label: "Follow us on X (Twitter)",
    href: "#",
    hoverColor: "#38BDF8",
  },
  {
    Icon: LinkedInIcon,
    label: "Follow us on LinkedIn",
    href: "#",
    hoverColor: "#60A5FA",
  },
  {
    Icon: GitHubIcon,
    label: "View our GitHub",
    href: "#",
    hoverColor: "#F1F5F9",
  },
];

/* ===========================
    Footer Component
=========================== */

function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return location.pathname !="/signup" && (
    <footer
      className="relative border-t"
      style={{
        borderColor: "rgba(148,163,184,0.08)",
        background: "#0D1117",
      }}
      role="contentinfo"
    >
      {/* Top gradient accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(99,102,241,0.30), transparent)",
        }}
      />

      {/* Subtle top glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-32 w-96 -translate-x-1/2 rounded-full"
        style={{ background: "rgba(99,102,241,0.04)", filter: "blur(80px)" }}
      />

      <div className="section-container py-14 sm:py-16">
        {/* Top grid */}
        <div className="grid grid-cols-2 gap-8 sm:gap-10 md:grid-cols-4 lg:grid-cols-6 lg:gap-12">

          {/* ── Brand column — spans full width on mobile, 2 cols on md/lg ── */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            {/* Logo */}
            <Link
              to="/"
              className="group inline-flex items-center gap-2.5"
              aria-label="Velora — home"
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                  boxShadow: "0 4px 16px rgba(99,102,241,0.25)",
                }}
              >
                <Sparkles size={17} color="white" />
              </div>
              <span
                className="text-xl font-black text-[#F1F5F9]"
                style={{ fontFamily: "var(--font-satoshi)" }}
              >
                Velora
              </span>
            </Link>

            {/* Tagline */}
            <p className="mt-4 max-w-[260px] text-sm leading-6 text-[#708090]">
              AI-powered career intelligence for the modern workforce. Find,
              apply, and succeed — faster.
            </p>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-[#F1F5F9]">
                Get career tips in your inbox
              </p>
              {submitted ? (
                <p className="text-sm font-medium text-[#10B981]">
                  ✓ You're on the list!
                </p>
              ) : (
                <form
                  className="flex gap-2"
                  onSubmit={handleSubmit}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    aria-label="Email for newsletter"
                    required
                    className="input h-11 min-w-0 flex-1 text-sm"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="btn btn-primary btn-sm shrink-0 gap-1.5"
                  >
                    <Send size={13} />
                    <span className="hidden sm:inline">Join</span>
                  </button>
                </form>
              )}
            </div>

            {/* Social icons — 44px touch targets, CSS hover */}
            <div className="mt-6 flex items-center gap-2">
              {socialIcons.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(148,163,184,0.12)] text-[#708090] transition-all duration-200 hover:scale-105"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = social.hoverColor;
                    e.currentTarget.style.borderColor = `${social.hoverColor}40`;
                    e.currentTarget.style.background = `${social.hoverColor}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#708090";
                    e.currentTarget.style.borderColor = "rgba(148,163,184,0.12)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <social.Icon />
                </a>
              ))}
            </div>
          </div>

          {/* ── Link columns — 2 per row on mobile, 1 each on md+ ── */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="col-span-1">
              <h4
                className="mb-4 text-xs font-bold uppercase tracking-widest text-[#F1F5F9]"
              >
                {title}
              </h4>
              <ul className="space-y-1.5">
                {links.map((link) => {
                  const LinkEl = link.internal ? Link : "a";
                  const linkProps = link.internal
                    ? { to: link.href }
                    : { href: link.href };

                  return (
                    <li key={link.label}>
                      <LinkEl
                        {...linkProps}
                        className="group flex items-center py-2 text-sm text-[#708090] transition-colors duration-200 hover:text-[#F1F5F9]"
                      >
                        <ArrowRight
                          size={11}
                          aria-hidden="true"
                          className="mr-1.5 -translate-x-2 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                        />
                        {link.label}
                      </LinkEl>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row"
          style={{ borderColor: "rgba(148,163,184,0.08)" }}
        >
          {/* Copyright */}
          <p className="text-sm text-[#708090]">
            © {new Date().getFullYear()} Velora, Inc. All rights reserved.
          </p>

          {/* Legal quick links */}
          <div className="flex flex-wrap items-center justify-center gap-5 sm:justify-end">
            {["Privacy", "Terms", "Cookies"].map((label) => (
              <a
                key={label}
                href="#"
                aria-label={`${label} policy`}
                className="text-xs text-[#708090] transition-colors duration-200 hover:text-[#F1F5F9]"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
