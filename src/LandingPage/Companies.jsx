/**
 * src/LandingPage/Companies.jsx
 *
 * Ultra-Premium "Trusted by Industry Leaders" Company Logo Marquee.
 * Renders official company vector brand logos with hiring badges, 
 * 3D glassmorphism, and smooth marquee animation.
 */

import React from "react";
import MarqueeModule from "react-fast-marquee";
import { Link } from "react-router-dom";

const Marquee = MarqueeModule.default ?? MarqueeModule;

const MARQUEE_BG = "#05070d";

const COMPANY_LOGOS = [
  {
    name: "Google",
    color: "#4285F4",
    openRoles: "1,240+ Jobs",
    svg: (
      <svg className="h-6 w-auto" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
      </svg>
    ),
  },
  {
    name: "Microsoft",
    color: "#00A4EF",
    openRoles: "890+ Jobs",
    svg: (
      <div className="flex items-center gap-2">
        <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
          <div className="bg-[#F25022] w-2 h-2 rounded-sm" />
          <div className="bg-[#7FBA00] w-2 h-2 rounded-sm" />
          <div className="bg-[#00A4EF] w-2 h-2 rounded-sm" />
          <div className="bg-[#FFB900] w-2 h-2 rounded-sm" />
        </div>
        <span className="text-sm font-bold text-white font-satoshi">Microsoft</span>
      </div>
    ),
  },
  {
    name: "Amazon",
    color: "#FF9900",
    openRoles: "2,150+ Jobs",
    svg: (
      <div className="flex flex-col items-center">
        <span className="text-base font-black text-white tracking-tighter font-satoshi leading-none">amazon</span>
        <svg className="w-10 h-1.5 text-[#FF9900]" viewBox="0 0 100 20" fill="currentColor">
          <path d="M5 5 Q 50 20 95 5 L 90 2 Q 50 15 10 2 Z" />
        </svg>
      </div>
    ),
  },
  {
    name: "Meta",
    color: "#0866FF",
    openRoles: "760+ Jobs",
    svg: (
      <div className="flex items-center gap-2">
        <svg className="h-5 w-6 text-[#0866FF]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.8 4C14.4 4 12.6 5.4 12 6.3 11.4 5.4 9.6 4 7.2 4 3.2 4 0 7.3 0 11.4 0 16.5 4.8 20 12 20s12-3.5 12-8.6C24 7.3 20.8 4 16.8 4zm-4.8 13.5C6.3 17.5 3 14.8 3 11.4 3 9 5 7 7.2 7c2.3 0 4.1 1.7 4.8 3.5.7-1.8 2.5-3.5 4.8-3.5 2.2 0 4.2 2 4.2 4.4 0 3.4-3.3 6.1-9 6.1z"/>
        </svg>
        <span className="text-base font-black text-white tracking-tight font-satoshi">Meta</span>
      </div>
    ),
  },
  {
    name: "Netflix",
    color: "#E50914",
    openRoles: "340+ Jobs",
    svg: (
      <span className="text-lg font-black tracking-tighter text-[#E50914] font-satoshi">NETFLIX</span>
    ),
  },
  {
    name: "Spotify",
    color: "#1DB954",
    openRoles: "520+ Jobs",
    svg: (
      <div className="flex items-center gap-2">
        <svg className="h-5 w-5 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.521 17.341c-.219.359-.691.475-1.049.257-2.87-1.756-6.481-2.152-10.738-1.18-.405.093-.811-.161-.904-.566-.093-.404.162-.81.566-.903 4.66-1.066 8.653-.618 11.862 1.343.359.219.475.691.257 1.05zm1.48-3.295c-.276.449-.868.591-1.317.315-3.284-2.019-8.293-2.607-12.179-1.428-.501.152-1.033-.131-1.185-.632-.152-.502.131-1.033.632-1.185 4.436-1.347 9.948-.7 13.734 1.628.448.276.591.868.315 1.302zm.127-3.431c-3.938-2.339-10.434-2.555-14.208-1.409-.606.184-1.246-.168-1.43-.774-.184-.606.168-1.246.774-1.43 4.335-1.316 11.499-1.063 16.002 1.609.546.324.726 1.032.402 1.578-.324.545-1.032.726-1.54.426z"/>
        </svg>
        <span className="text-sm font-extrabold text-white font-satoshi">Spotify</span>
      </div>
    ),
  },
  {
    name: "Airbnb",
    color: "#FF5A5F",
    openRoles: "430+ Jobs",
    svg: (
      <div className="flex items-center gap-2">
        <svg className="h-5 w-5 text-[#FF5A5F]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C7.5 0 4 3.5 4 8c0 4.5 4 10.5 8 16 4-5.5 8-11.5 8-16 0-4.5-3.5-8-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z"/>
        </svg>
        <span className="text-sm font-extrabold text-white font-satoshi">airbnb</span>
      </div>
    ),
  },
  {
    name: "Stripe",
    color: "#635BFF",
    openRoles: "820+ Jobs",
    svg: (
      <span className="text-lg font-black text-[#635BFF] tracking-tighter font-satoshi">stripe</span>
    ),
  },
  {
    name: "Apple",
    color: "#F5F5F7",
    openRoles: "1,540+ Jobs",
    svg: (
      <div className="flex items-center gap-2">
        <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.35c.66-.8 1.11-1.92.99-3.04-.96.04-2.13.64-2.82 1.44-.61.71-1.15 1.86-1.01 2.96 1.08.08 2.18-.56 2.84-1.36z"/>
        </svg>
        <span className="text-sm font-extrabold text-white font-satoshi">Apple</span>
      </div>
    ),
  },
];

export default function Companies() {
  return (
    <section className="relative overflow-hidden bg-[#05070d] py-16 sm:py-20 border-y border-white/10 font-inter text-slate-200" aria-label="Trusted Companies">
      {/* Ambient Radial Mesh Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[350px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-[170px]" />
      </div>

      {/* Section Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-300 font-satoshi">
            Global Enterprise Hiring Partners
          </span>
        </div>
        <h3 className="mt-3 text-2xl sm:text-4xl font-black text-white font-satoshi tracking-tight">
          Trusted by Industry Leaders Worldwide
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-lg mx-auto font-medium">
          Top technology companies recruit software engineers, product designers, and managers directly through our AI platform.
        </p>
      </div>

      {/* 3D Glass Marquee Cards */}
      <div className="relative z-10 py-3">
        <Marquee speed={34} gradient gradientColor={MARQUEE_BG} gradientWidth={120} pauseOnHover autoFill>
          {COMPANY_LOGOS.map((brand) => (
            <Link
              key={brand.name}
              to={`/find-jobs?keyword=${encodeURIComponent(brand.name)}`}
              className="mx-3.5 group relative flex h-16 w-56 items-center justify-between rounded-2xl border border-white/10 bg-[#090d16]/90 px-4.5 py-3 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/50 hover:bg-[#0c111f] hover:shadow-[0_15px_35px_rgba(99,102,241,0.2)] hover:scale-105 cursor-pointer shrink-0"
            >
              {/* SVG Brand Vector */}
              <div className="flex items-center gap-3 min-w-0">
                {brand.svg}
              </div>

              {/* Hiring Badge */}
              <div className="flex flex-col items-end shrink-0">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Hiring
                </span>
                <span className="text-[9px] font-bold text-slate-400 mt-0.5">
                  {brand.openRoles}
                </span>
              </div>
            </Link>
          ))}
        </Marquee>
      </div>
    </section>
  );
}