import { useState, useEffect } from "react";
import { BriefcaseBusiness, ShieldCheck, Users, Quote, Sparkles, UserPlus, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SignUp from "../SignUpLogin/SignUp";
import Login from "../SignUpLogin/Login";
import { useAppSelector } from "../State/Store";

function SignUpPage({ defaultIsLogin = true }) {
  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.profile);

  useEffect(() => {
    setIsLogin(defaultIsLogin);
  }, [defaultIsLogin]);

  const handleBrandClick = () => {
    if (user) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] font-inter">
      <div className="flex min-h-screen">
        {/* LEFT — Brand Hero Panel */}
        <div className="relative hidden lg:flex w-[48%] flex-col justify-between overflow-hidden bg-gradient-to-br from-[#070b12] via-[#0b0f19] to-[#0f172a] border-r border-white/10 p-14">
          {/* Ambient Glow Orbs */}
          <div aria-hidden="true" className="pointer-events-none absolute -top-40 -left-24 h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[150px]" />
          <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[140px]" />

          {/* Brand Wordmark */}
          <div className="relative flex items-center gap-3 cursor-pointer" onClick={handleBrandClick}>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white font-satoshi">
              JobPortal <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">AI</span>
            </span>
          </div>

          {/* Headline */}
          <div className="relative my-auto max-w-lg space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-400">
              <Sparkles className="h-3.5 w-3.5" /> Next-Gen AI Career Platform
            </span>

            <h1 className="font-satoshi text-4xl leading-tight font-extrabold text-white">
              Accelerate your career with AI matching and instant recruiter connect.
            </h1>

            <p className="text-sm leading-relaxed text-slate-400">
              Join 50,000+ candidates and top hiring teams on JobPortal AI. Build an ATS-optimized profile, get matched by skills, and track your applications seamlessly.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <ShieldCheck size={18} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Verified Employers Only</p>
                  <p className="text-xs text-slate-400">Every recruiter and job posting is background-verified.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <BriefcaseBusiness size={18} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">AI-Powered Skill Match</p>
                  <p className="text-xs text-slate-400">Get recommended roles based on actual technical skills.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Social Proof */}
          <div className="relative pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>50K+ Professionals</span>
            <span>8K+ Active Hiring Teams</span>
            <span>120K+ Live Jobs</span>
          </div>
        </div>

        {/* RIGHT — Form Container */}
        <div className="relative flex w-full lg:w-[52%] items-center justify-center bg-[#070b12] p-6 sm:p-12">
          {/* Switch Tab Button in top right */}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="absolute top-6 right-6 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-300 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white cursor-pointer"
          >
            {isLogin ? (
              <>
                <UserPlus size={15} />
                <span>Create Account</span>
              </>
            ) : (
              <>
                <LogIn size={15} />
                <span>Sign In</span>
              </>
            )}
          </button>

          <div className="w-full max-w-[460px]">
            <div className="lg:hidden flex items-center gap-3 mb-8 cursor-pointer" onClick={handleBrandClick}>
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white font-satoshi">
                JobPortal <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">AI</span>
              </span>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0b0f19]/90 p-7 sm:p-9 shadow-2xl backdrop-blur-xl">
              {isLogin ? <Login setIsLogin={setIsLogin} /> : <SignUp setIsLogin={setIsLogin} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;