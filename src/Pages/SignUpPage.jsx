import { useState } from "react";
import {
  BriefcaseBusiness,
  ShieldCheck,
  Users,
  House,
  Quote,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SignUp from "../SignUpLogin/SignUp";
import Login from "../SignUpLogin/Login";

function SignUpPage() {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B1220] font-[Inter,sans-serif]">
      <div className="flex min-h-screen">

        {/* LEFT — brand panel */}
        <div className="relative hidden lg:flex w-[46%] flex-col overflow-hidden bg-[#0F1B2E] border-r border-white/[0.06] px-14 py-14">

          {/* Ambient glow — signature depth element, kept subtle and single-source */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 -left-24 h-[520px] w-[520px] rounded-full bg-[#C8A24A]/[0.08] blur-[120px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 h-[380px] w-[380px] rounded-full bg-[#C8A24A]/[0.05] blur-[100px]"
          />

          {/* Wordmark */}
          <div className="relative flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#C8A24A]">
              <span className="font-serif text-lg text-[#0B1220]">V</span>
            </div>
            <span className="text-xl tracking-tight text-white font-serif">
              Velora
            </span>
          </div>

          {/* Headline */}
          <div className="relative flex-1 flex flex-col justify-center max-w-lg">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#C8A24A] mb-5">
              Career platform for professionals
            </p>

            <h1 className="font-serif text-[42px] leading-[1.15] text-white">
              The role that moves your career forward is here.
            </h1>

            <p className="mt-6 text-[15px] leading-7 text-slate-400 max-w-md">
              Build a resume recruiters trust, get matched with vetted
              companies, and prepare for interviews with confidence.
            </p>

            <div className="mt-10 space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10">
                  <ShieldCheck size={16} className="text-[#C8A24A]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Verified employers only
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Every company on Velora is background-checked.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10">
                  <BriefcaseBusiness size={16} className="text-[#C8A24A]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    Curated job matching
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Roles ranked by real fit, not keyword volume.
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial — replaces generic filler copy with a concrete, credible voice */}
            <div className="mt-10 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <Quote size={18} className="text-[#C8A24A]/70 mb-2" />
              <p className="text-sm leading-6 text-slate-300">
                Velora matched me with three roles that actually fit my
                background — I had two offers within a month.
              </p>
              <p className="mt-3 text-xs text-slate-500">
                Priya Nair · Senior Product Manager
              </p>
            </div>
          </div>

          {/* Stats + social proof */}
          <div className="relative mt-14">
            <div className="grid grid-cols-3 divide-x divide-white/[0.06] border-t border-white/[0.06] pt-8">
              <div className="pl-0">
                <p className="font-serif text-2xl text-white">50K+</p>
                <p className="text-xs text-slate-500 mt-1">Members</p>
              </div>
              <div className="pl-8">
                <p className="font-serif text-2xl text-white">8K+</p>
                <p className="text-xs text-slate-500 mt-1">Companies</p>
              </div>
              <div className="pl-8">
                <p className="font-serif text-2xl text-white">120K+</p>
                <p className="text-xs text-slate-500 mt-1">Open roles</p>
              </div>
            </div>

            <div className="mt-7 flex items-center gap-2 text-slate-500">
              <Users size={14} />
              <span className="text-xs">
                Trusted by hiring teams at Fortune 500 companies
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT — auth form */}
        <div className="relative flex w-full lg:w-[54%] items-center justify-center bg-[#0B1220] px-6 py-10">

          <button
            onClick={() => navigate("/")}
            aria-label="Back to home"
            className="absolute top-6 right-6 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-sm transition-all duration-300 hover:border-[#C8A24A] hover:bg-[#C8A24A]/10 hover:text-[#C8A24A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A24A]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1220]"
          >
            <House size={16} />
            Home
          </button>

          <div className="w-full max-w-[400px]">

            {/* Mobile-only compact brand mark */}
            <div className="lg:hidden flex items-center gap-2.5 mb-10">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#C8A24A]">
                <span className="font-serif text-base text-[#0B1220]">V</span>
              </div>
              <span className="text-lg text-white font-serif">Velora</span>
            </div>

            {/* Card container gives the form a defined edge instead of floating on bare background */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 sm:p-8 shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset]">
              {isLogin ? (
                <Login setIsLogin={setIsLogin} />
              ) : (
                <SignUp setIsLogin={setIsLogin} />
              )}
            </div>

            <p className="mt-8 text-center text-xs text-slate-600">
              Protected by industry-standard encryption
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default SignUpPage;