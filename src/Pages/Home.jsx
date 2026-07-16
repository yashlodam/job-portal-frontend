import React from "react";
import Header from "../Header/Header";
import DreamJob from "../LandingPage/DreamJob";
import Companies from "../LandingPage/Companies";
import JobCategory from "../LandingPage/JobCategory";

function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-poppins text-body">

      {/* Background Glow */}
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
      <Header />
      <DreamJob/>
      <JobCategory/>
      <Companies/>
      

    </div>
  );
}

export default Home;