import React from "react";
import {
  Briefcase,
  Upload,
  BadgeCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, TextInput } from "@mantine/core";
import { IconSearch, IconMapPin } from "@tabler/icons-react";



function DreamJob() {
  return (
    <section className="relative overflow-hidden bg-[#0B0D12] py-19 [font-family:'Inter',ui-sans-serif,system-ui]">
      {/* Google Fonts — display + body pairing */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .rise-in { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#8B93A7 1px, transparent 1px), linear-gradient(90deg, #8B93A7 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute -top-10 right-0 h-[420px] w-[420px] rounded-full bg-[#FF7A45]/10 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[320px] w-[320px] rounded-full bg-[#2DD4BF]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* LEFT — copy */}
          <div className="rise-in" style={{ animation: "riseIn 0.6s ease-out both" }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#FF7A45]/30 bg-[#FF7A45]/10 px-4 py-1.5 text-sm font-semibold text-[#FF9466]">
              <Sparkles size={14} />
              #1 AI-Powered Job Portal
            </span>

            <h1 className="mt-7 text-5xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl [font-family:'Sora',sans-serif]">
              Find your{" "}
              <span className="text-[#FF7A45]">dream job</span>
              <br />
              with us
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#8B93A7]">
              Discover thousands of verified opportunities, build an
              AI-powered resume, prepare for interviews, and land your dream
              job faster than ever.
            </p>

            <div className="relative mt-10 w-full max-w-4xl">
  {/* Glow */}
  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-500/20 via-blue-500/10 to-orange-500/20 blur-xl" />

  <div className="relative flex flex-col md:flex-row items-stretch md:items-center rounded-3xl border border-zinc-700 bg-[#161B22] p-2 shadow-2xl transition-all duration-300 focus-within:border-orange-500">

    {/* Job Input */}
    <div className="flex-1">
      <TextInput
        variant="unstyled"
        leftSection={<IconSearch size={20} color="#f97316" />}
        placeholder="Job title, keyword or company"
        styles={{
          wrapper: {
            width: "100%",
          },
          input: {
            color: "#fff",
            fontSize: "16px",
            height: "52px",
          },
        }}
      />
    </div>

    {/* Divider Desktop */}
    <div className="hidden md:block w-px h-10 bg-zinc-700 mx-2" />

    {/* Divider Mobile */}
    <div className="md:hidden h-px bg-zinc-700 my-2" />

    {/* Location */}
    <div className="flex-1">
      <TextInput
        variant="unstyled"
        leftSection={<IconMapPin size={20} color="#f97316" />}
        placeholder="Location"
        styles={{
          wrapper: {
            width: "100%",
          },
          input: {
            color: "#fff",
            fontSize: "16px",
            height: "52px",
          },
        }}
      />
    </div>

    {/* Search Button */}
    <Button
      radius="xl"
      size="lg"
      color="orange"
      leftSection={<IconSearch size={18} />}
      className="mt-3 md:mt-0 md:ml-3 w-full md:w-auto h-[52px] px-8 font-semibold"
    >
      Search
    </Button>

  </div>
</div>

            {/* Stats */}
            <div className="mt-14 flex divide-x divide-[#262B36]">
              {[
                ["10K+", "Active Jobs"],
                ["5K+", "Companies"],
                ["50K+", "Candidates"],
              ].map(([value, label]) => (
                <div key={label} className="px-7 first:pl-0">
                  <h2 className="text-3xl font-extrabold text-white [font-family:'Sora',sans-serif]">
                    {value}
                  </h2>
                  <p className="mt-1 text-sm text-[#8B93A7]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — illustration */}
          <div
            className="rise-in relative flex justify-center"
            style={{ animation: "riseIn 0.7s ease-out 0.1s both" }}
          >
            {/* Glow behind the artwork */}
            <div className="absolute h-[420px] w-[420px] rounded-full bg-[#FF7A45]/15 blur-[110px]" />

            {/* Floating badge — top left */}
            

            {/* Floating badge — bottom right */}
           

            {/* Illustration */}
             <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative flex justify-center"
          >
            {/* Glow behind the artwork */}
            <div className="absolute h-[420px] w-[420px] rounded-full bg-[#FF7A45]/15 blur-[110px]" />

            {/* AI Resume Score */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 top-6 z-20 hidden items-center gap-3 rounded-2xl border border-[#262B36] bg-[#14171F]/80 p-4 shadow-2xl backdrop-blur-xl sm:-left-8 sm:flex"
            >
              <svg width="48" height="48" viewBox="0 0 48 48" className="shrink-0">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#262B36" strokeWidth="4" />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="#FF7A45"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 20}
                  strokeDashoffset={2 * Math.PI * 20 * (1 - 0.92)}
                  transform="rotate(-90 24 24)"
                />
                <text x="24" y="29" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">
                  92
                </text>
              </svg>
              <div>
                <h4 className="text-sm font-semibold text-white">AI Resume Score</h4>
                <p className="text-xs text-[#8B93A7]">Excellent match</p>
              </div>
            </motion.div>

           
          
            {/* 10K+ Jobs */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-4 right-0 z-20 flex items-center gap-3 rounded-2xl border border-[#262B36] bg-[#14171F]/80 p-4 shadow-2xl backdrop-blur-xl"
            >
              <BadgeCheck className="text-[#2563EB]" size={22} />
              <div>
                <h4 className="text-sm font-semibold text-white">10K+ Jobs</h4>
                <p className="text-xs text-[#8B93A7]">Updated Daily</p>
              </div>
            </motion.div>

            {/* Illustration */}
            <img
              src="/jobs1.png"
              alt="Software engineer reviewing job matches on a laptop"
              className="relative z-10 w-full max-w-[560px] object-contain drop-shadow-2xl transition duration-500 hover:scale-105"
            />
          </motion.div>
          </div>
        </div>

       
      </div>
    </section>
  );
}

export default DreamJob;