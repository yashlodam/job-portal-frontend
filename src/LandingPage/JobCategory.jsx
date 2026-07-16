import React, { useState } from "react";
import { motion } from "framer-motion";
import { categories, workModes } from "../Data/Data";

function JobCategory() {

const [activeTab, setActiveTab] = useState("category");
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-500/10 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .6 }}
          viewport={{ once: true }}
          className="text-center"
        >

          {/* Badge */}

          <div className="inline-flex items-center gap-3 rounded-full border border-orange-500/20 bg-orange-500/10 px-6 py-2">

            <span className="h-px w-6 bg-orange-500/40"></span>

            <span className="text-sm font-semibold uppercase tracking-wider text-orange-400">
              Explore Jobs
            </span>

            <span className="h-px w-6 bg-orange-500/40"></span>

          </div>

          {/* Title */}

          <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">

            Browse{" "}
            <span className="text-orange-500">
              Job
            </span>{" "}
            Categories

          </h2>

          {/* Description */}

          <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base md:text-lg leading-8 text-zinc-400">
            Explore diverse job opportunities tailored to your skills.
            Start your career journey today.
          </p>

        </motion.div>

        {/* Toggle */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: .2 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >

          <div className="inline-flex rounded-2xl bg-[#181C24] border border-zinc-700 p-1">

  <button
    onClick={() => setActiveTab("category")}
    className={`rounded-xl cursor-pointer px-8 py-3 font-semibold transition-all duration-300 ${
      activeTab === "category"
        ? "bg-orange-500 text-white shadow-lg"
        : "text-zinc-400 hover:text-white"
    }`}
  >
    By Category
  </button>

  <button
    onClick={() => setActiveTab("mode")}
    className={`rounded-xl cursor-pointer px-8 py-3 font-semibold transition-all duration-300 ${
      activeTab === "mode"
        ? "bg-orange-500 text-white shadow-lg"
        : "text-zinc-400 hover:text-white"
    }`}
  >
    By Work Mode
    
  </button>
  

</div>


        </motion.div>
         <motion.div
  layout
  className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-4"
>
  {(activeTab === "category" ? categories : workModes).map(
    (item, index) => {
      const Icon = item.icon;

      return (
        <motion.div
          key={item.title}
          layout
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{
            y: -8,
            scale: 1.03,
          }}
          className="group cursor-pointer rounded-3xl border border-zinc-700 bg-[#171B24] p-7 transition-all duration-300 hover:border-orange-500 hover:shadow-[0_0_40px_rgba(249,115,22,.2)]"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white">
            <Icon size={28} />
          </div>

          <h3 className="mt-6 text-xl font-semibold text-white">
            {item.title}
          </h3>

          <p className="mt-2 text-sm text-zinc-400">
            {item.jobs}
          </p>
        </motion.div>
      );
    }
  )}
</motion.div>

      </div>

    </section>
  );
}

export default JobCategory;