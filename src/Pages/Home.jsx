import React from "react";
import Header from "../Header/Header";

function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-poppins text-body">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.12),transparent_35%)]" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:70px_70px]" />

      <Header />

    </div>
  );
}

export default Home;