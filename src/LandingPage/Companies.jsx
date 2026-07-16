import React from "react";
import MarqueeModule from "react-fast-marquee";
import { motion } from "framer-motion";

const Marquee = MarqueeModule.default ?? MarqueeModule;

const COMPANIES = [
  { name: "Google", color: "#4285F4" },
  { name: "Microsoft", color: "#00A4EF" },
  { name: "Amazon", color: "#FF9900" },
  { name: "Meta", color: "#0866FF" },
  { name: "Netflix", color: "#E50914" },
  { name: "Adobe", color: "#FF0000" },
  { name: "Spotify", color: "#1DB954" },
  { name: "Uber", color: "#FFFFFF" },
  { name: "Apple", color: "#A2AAAD" },
  { name: "Airbnb", color: "#FF5A5F" },
];

const BACKGROUND_COLOR = "#0b0d12";

function CompanyCard({ company }) {
  const logoSrc = `/Companies/${company.name.toLowerCase()}.svg`;

  return (
    <motion.div
      className="mx-5"
      whileHover={{ y: -10, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="group relative flex h-40 w-64 flex-col items-center justify-center overflow-hidden rounded-[28px] border border-zinc-700/70 bg-[#131722]/80 backdrop-blur-xl transition-all duration-500 hover:border-orange-500">
        {/* Glow */}
        <div
          className="absolute inset-0 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-30"
          style={{
            background: `radial-gradient(circle at center, ${company.color}, transparent 70%)`,
          }}
        />

        {/* Shine */}
        <div className="absolute -left-1/2 top-0 h-full w-1/2 skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:animate-shine" />

        {/* ---- Colored logo using mask ---- */}
        <motion.div
          whileHover={{ rotate: [0, -3, 3, 0] }}
          transition={{ duration: 0.5 }}
          className="relative z-20 h-14 w-14"
          style={{
            backgroundColor: company.color,
            maskImage: `url(${logoSrc})`,
            WebkitMaskImage: `url(${logoSrc})`,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
          }}
        >
          {/* Fallback for browsers that don't support mask-image */}
          <img
            src={logoSrc}
            alt={`${company.name} logo`}
            className="h-full w-full object-contain"
            style={{
              filter: "brightness(0) invert(1)", // turns black -> white
              opacity: 0.6,
            }}
          // Hide the fallback if mask is supported
          // Use a small script or CSS to hide; we'll rely on the mask taking over,
          // but the img will still show if mask fails. You can polish with @supports.
          />
        </motion.div>

        <h3 className="relative z-20 mt-5 text-lg font-semibold text-white">
          {company.name}
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-green-400">Hiring Now</span>
        </div>
      </div>
    </motion.div>
  );
}


export default function Companies() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[180px]" />
        <div className="absolute right-0 top-40 h-[350px] w-[350px] rounded-full bg-blue-500/10 blur-[180px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Badge */}
          <span className="inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-xs font-semibold text-orange-400 sm:px-5 sm:text-sm">
            Trusted Worldwide
          </span>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-white sm:mt-6 sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Trusted by{" "}
            <span className="text-orange-500">
              1,000+
            </span>{" "}
            Companies
          </motion.h2>

          {/* Underline */}
          <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-orange-500 sm:w-24" />

          {/* Description */}
          <p className="mx-auto mt-6 max-w-xs text-sm leading-7 text-zinc-400 sm:max-w-lg sm:text-base sm:leading-8 md:max-w-2xl md:text-lg lg:text-xl">
            Top companies use our AI-powered hiring platform to discover,
            evaluate, and recruit talented developers worldwide.
          </p>
        </motion.div>

        {/* Marquee 1 */}
        <div className="mt-16">
          <Marquee
            speed={45}
            gradient
            gradientColor={BACKGROUND_COLOR}
            gradientWidth={150}
            pauseOnHover
            autoFill
          >
            {COMPANIES.map((company) => (
              <CompanyCard key={company.name} company={company} />
            ))}
          </Marquee>
        </div>


      </div>
    </section>
  );
}