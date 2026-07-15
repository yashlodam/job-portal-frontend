import React from "react";
import { Avatar } from "@mantine/core";
import {
  IconAnchor,
  IconBell,
  IconSettings,
} from "@tabler/icons-react";

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-mine-shaft-900 border-b border-mine-shaft-800 text-white">
      <div className="max-w-7xl mx-auto h-20 px-8 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="bg-bright-sun-500 p-2 rounded-xl text-black">
            <IconAnchor size={28} stroke={2.2} />
          </div>

          <h1 className="text-3xl font-bold font-pacifico tracking-wide">
            iJobs
          </h1>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-10 font-medium">
          <a
            href="#"
            className="transition duration-300 hover:text-bright-sun-400"
          >
            Find Jobs
          </a>

          <a
            href="#"
            className="transition duration-300 hover:text-bright-sun-400"
          >
            Find Talent
          </a>

          <a
            href="#"
            className="transition duration-300 hover:text-bright-sun-400"
          >
            Upload Job
          </a>

          <a
            href="#"
            className="transition duration-300 hover:text-bright-sun-400"
          >
            About Us
          </a>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-6">

          <button className="relative cursor-pointer">
            <IconBell size={24} />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-bright-sun-500"></span>
          </button>

          <div className="flex items-center gap-3 cursor-pointer">
            <Avatar
              src="avatar.png"
              radius="xl"
              size={42}
            />

            <div className="hidden lg:block">
              <p className="font-semibold">Marshal</p>
              <p className="text-xs text-mine-shaft-400">
                Software Engineer
              </p>
            </div>
          </div>

          <button className="cursor-pointer hover:text-bright-sun-400 transition">
            <IconSettings size={24} />
          </button>

        </div>
      </div>
    </header>
  );
}

export default Header;