import { useState } from "react";
import {
  Sparkles,
  BriefcaseBusiness,
  BrainCircuit,
  BadgeCheck,
} from "lucide-react";

import SignUp from "../SignUpLogin/SignUp";
import Login from "../SignUpLogin/Login";

function SignUpPage() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020817]">

      {/* Background */}
      <div className="absolute inset-0 mesh-gradient" />

      <div className="absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-blue-600/10 blur-[180px]" />

      <div className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-cyan-500/10 blur-[180px]" />

      <div className="absolute top-1/2 left-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-[160px]" />

      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle,#64748B 1px,transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 flex min-h-screen">

        {/* LEFT */}

        <div className="hidden lg:flex w-1/2 flex-col justify-between rounded-r-[60px] border-r border-white/10 bg-gradient-to-br from-[#0F172A] via-[#172554] to-[#1E3A8A] p-16 overflow-hidden relative">

          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-400/20 blur-[120px]" />

          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-[150px]" />

          <div className="relative z-10">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/10 backdrop-blur-xl">

                <Sparkles className="text-cyan-300" size={22} />

              </div>

              <h1 className="text-3xl font-bold text-white">
                Velora
              </h1>

            </div>

            <div className="mt-12 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2">

              <BadgeCheck size={18} className="text-cyan-300" />

              <span className="text-sm text-cyan-100">
                Trusted by 50,000+ Professionals
              </span>

            </div>

            <h2 className="mt-10 text-6xl font-extrabold text-white leading-tight">

              Find Your

              <br />

              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">

                Dream Career

              </span>

            </h2>

            <p className="mt-8 text-lg text-slate-300 leading-8 max-w-xl">
              Build AI-powered resumes, discover verified companies,
              prepare for interviews, and land your dream job faster.
            </p>

            <div className="mt-12 space-y-4">

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">

                <BrainCircuit className="text-cyan-300" />

                <div>

                  <h3 className="text-white font-semibold">
                    AI Resume Builder
                  </h3>

                  <p className="text-sm text-slate-300">
                    Create ATS-friendly resumes.
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">

                <BriefcaseBusiness className="text-blue-300" />

                <div>

                  <h3 className="text-white font-semibold">
                    Smart Job Matching
                  </h3>

                  <p className="text-sm text-slate-300">
                    Personalized job recommendations.
                  </p>

                </div>

              </div>

            </div>

          </div>

          <div className="grid grid-cols-3 gap-5">

            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <h2 className="text-4xl text-cyan-300 font-bold">50K+</h2>
              <p className="text-sm text-slate-300 mt-2">
                Members
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <h2 className="text-4xl text-cyan-300 font-bold">8K+</h2>
              <p className="text-sm text-slate-300 mt-2">
                Companies
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <h2 className="text-4xl text-cyan-300 font-bold">120K+</h2>
              <p className="text-sm text-slate-300 mt-2">
                Jobs
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="flex w-full lg:w-1/2 items-center justify-center p-10">

          <div className="w-full max-w-md">

            {isLogin ? (
              <Login setIsLogin={setIsLogin} />
            ) : (
              <SignUp setIsLogin={setIsLogin} />
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default SignUpPage;