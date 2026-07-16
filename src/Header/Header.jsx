import React from "react";
import { Avatar, Indicator } from "@mantine/core";
import {
    IconAnchor,
    IconBell,
    IconSettings,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";

function Header() {

  const links = [
  { name: "Find Jobs", url: "/find-jobs" },
  { name: "Find Talent", url: "/find-talent" },
  { name: "Upload Job", url: "/upload-job" },
  { name: "About Us", url: "/about" }
];

    return (
        <header className="sticky top-0 z-50 w-full bg-surface/80 backdrop-blur-xl border-b border-border/60 text-heading">
            <div className="max-w-7xl mx-auto h-20 px-6 lg:px-8 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="bg-gradient-to-br from-primary to-primary-dark p-2.5 rounded-xl text-white shadow-[0_4px_14px_rgba(59,130,246,0.35)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_6px_20px_rgba(59,130,246,0.5)]">
                        <IconAnchor size={24} stroke={2.2} />
                    </div>

                    <h1 className="text-2xl font-pacifico tracking-wide text-heading transition-colors duration-300 group-hover:text-primary-light">
                        iJobs
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-9 text-sm font-medium text-body">
                    {links.map((item,index) => (
                        <Link key={index} to={item.url} >{item.name}</Link>
                    ))}
                </nav>

                {/* Right Section */}
                <div className="flex items-center gap-2">

                    <div className="flex items-center gap-3 cursor-pointer rounded-xl pl-2 pr-3 py-1.5 transition-colors duration-200 hover:bg-card border border-transparent hover:border-border">
                        <Avatar
                            src="avatar.jpg"
                            radius="xl"
                            size={40}
                            className="ring-2 ring-border"
                        />

                        <div className="hidden lg:block leading-tight">
                            <p className="font-semibold text-heading text-sm">
                                Marshal
                            </p>

                            <p className="text-xs text-muted mt-0.5">
                                Software Engineer
                            </p>
                        </div>
                    </div>

                    <div className="w-px h-6 bg-border mx-1 hidden lg:block" />

                    <button className="relative p-2.5 rounded-xl text-muted transition-colors duration-200 hover:bg-card hover:text-primary-light">
                        <Indicator >
                          <IconBell size={21} stroke={1.8} />
                        </Indicator>
                        
                        
                    </button>

                    <button className="p-2.5 rounded-xl text-muted transition-all duration-300 hover:bg-card hover:text-primary-light hover:rotate-45">
                        <IconSettings size={21} stroke={1.8} />
                    </button>

                </div>

            </div>
        </header>
    );
}

export default Header;