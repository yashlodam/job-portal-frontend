/**
 * src/Header/ProfileMenu.jsx
 *
 * Ultra-Premium 3D Glassmorphic Profile Menu for Candidate / Recruiter / Admin User Dropdown.
 */

import React, { useEffect, useState } from "react";
import { Menu, Avatar } from "@mantine/core";
import {
  User,
  Briefcase,
  Bookmark,
  Sparkles,
  LogOut,
  ChevronDown,
  Compass,
  Settings,
  ShieldCheck,
  LayoutDashboard,
  ShieldAlert,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../State/Store";
import { logout } from "../State/AuthSlic";
import { selectProfile } from "../State/profileSlice";
import { fetchProfileByEmailThunk } from "../State/profileThunk";

function ProfileMenu({ user }) {
  const [opened, setOpened] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const auth = useAppSelector((s) => s.auth.profile);
  const reduxProfile = useAppSelector(selectProfile);

  useEffect(() => {
    if (auth?.email) {
      dispatch(fetchProfileByEmailThunk(auth.email));
    }
  }, [dispatch, auth?.email]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const avatarSrc = reduxProfile?.profileImage
    ? reduxProfile.profileImage.startsWith("blob:") || reduxProfile.profileImage.startsWith("http")
      ? reduxProfile.profileImage
      : `http://localhost:8080/uploads/profile/${reduxProfile.profileImage}`
    : null;

  const displayName = user?.name || reduxProfile?.name || auth?.name || "User";
  const displayRole = user?.role || user?.accountType || reduxProfile?.role || auth?.role || "Candidate";

  const isAdmin =
    user?.accountType === "ADMIN" ||
    user?.role === "ADMIN" ||
    auth?.accountType === "ADMIN" ||
    auth?.role === "ADMIN" ||
    (Array.isArray(user?.roles) && user.roles.includes("ADMIN"));

  const isEmployer =
    user?.accountType === "EMPLOYER" ||
    user?.role === "EMPLOYER" ||
    user?.accountType === "RECRUITER" ||
    user?.role === "RECRUITER" ||
    auth?.accountType === "EMPLOYER" ||
    auth?.role === "EMPLOYER";

  return (
    <Menu
      opened={opened}
      onChange={setOpened}
      shadow="2xl"
      width={260}
      position="bottom-end"
      withArrow
      arrowPosition="center"
      transitionProps={{ transition: "pop-top-right", duration: 150 }}
    >
      <Menu.Target>
        <button
          type="button"
          className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-[#090d16]/90 px-3 py-1.5 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/50 hover:bg-[#0c111f] hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] cursor-pointer"
        >
          <div className="relative shrink-0">
            <Avatar src={avatarSrc} radius="xl" size={34} className="border border-white/10">
              {displayName.charAt(0).toUpperCase()}
            </Avatar>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#05070d] animate-pulse" />
          </div>

          <div className="hidden sm:block text-left min-w-0 max-w-[110px]">
            <p className="text-xs font-bold text-white font-satoshi truncate group-hover:text-indigo-300 transition-colors">
              {displayName}
            </p>
            <p className="text-[10px] font-semibold text-slate-400 truncate uppercase tracking-wider">
              {isAdmin ? "Admin" : displayRole}
            </p>
          </div>

          <ChevronDown
            size={14}
            className={`text-slate-400 transition-transform duration-300 ${
              opened ? "rotate-180 text-white" : "group-hover:text-white"
            }`}
          />
        </button>
      </Menu.Target>

      <Menu.Dropdown className="!bg-[#090d16]/95 !border !border-white/15 backdrop-blur-2xl rounded-3xl p-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] font-inter text-slate-200">
        
        {/* User Summary Header */}
        <div className="flex items-center gap-3 p-2.5 border-b border-white/10 mb-2">
          <Avatar src={avatarSrc} radius="xl" size={40} className="border border-indigo-500/30">
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-extrabold text-white font-satoshi truncate">{displayName}</h4>
              <ShieldCheck size={14} className="text-indigo-400 shrink-0" />
            </div>
            {isAdmin ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-300 bg-purple-500/15 border border-purple-400/30 px-2 py-0.5 rounded-md mt-1">
                <ShieldAlert size={10} className="fill-purple-300/20" /> Platform Admin
              </span>
            ) : isEmployer ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-400/30 px-2 py-0.5 rounded-md mt-1">
                <Sparkles size={10} className="fill-indigo-300/20" /> Recruiter Studio
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/15 border border-amber-400/30 px-2 py-0.5 rounded-md mt-1">
                <Sparkles size={10} className="fill-amber-300/20 animate-pulse" /> Verified Candidate
              </span>
            )}
          </div>
        </div>

        {/* Admin Specific Links */}
        {isAdmin && (
          <>
            <Link to="/admin/dashboard" onClick={() => setOpened(false)}>
              <Menu.Item
                leftSection={<LayoutDashboard size={16} className="text-purple-400" />}
                className="!rounded-xl !text-xs !font-bold !text-purple-300 hover:!bg-purple-500/15 transition"
              >
                Admin Control Dashboard
              </Menu.Item>
            </Link>

            <Link to="/admin/recruiters" onClick={() => setOpened(false)}>
              <Menu.Item
                leftSection={<ShieldCheck size={16} className="text-emerald-400" />}
                className="!rounded-xl !text-xs !font-bold !text-emerald-300 hover:!bg-emerald-500/15 transition"
              >
                Recruiter Verifications Hub
              </Menu.Item>
            </Link>
          </>
        )}

        {/* Employer / Recruiter Links */}
        {isEmployer && !isAdmin && (
          <>
            <Link to="/recruiter/dashboard" onClick={() => setOpened(false)}>
              <Menu.Item
                leftSection={<LayoutDashboard size={16} className="text-indigo-400" />}
                className="!rounded-xl !text-xs !font-bold !text-slate-200 hover:!bg-white/10 hover:!text-white transition"
              >
                Recruiter Dashboard
              </Menu.Item>
            </Link>

            <Link to="/recruiter/verification" onClick={() => setOpened(false)}>
              <Menu.Item
                leftSection={<ShieldCheck size={16} className="text-amber-400" />}
                className="!rounded-xl !text-xs !font-bold !text-slate-200 hover:!bg-white/10 hover:!text-white transition"
              >
                Verification Status
              </Menu.Item>
            </Link>
          </>
        )}

        {/* Candidate / Jobseeker Links */}
        {!isAdmin && !isEmployer && (
          <>
            <Link to="/profile" onClick={() => setOpened(false)}>
              <Menu.Item
                leftSection={<User size={16} className="text-indigo-400" />}
                className="!rounded-xl !text-xs !font-bold !text-slate-200 hover:!bg-white/10 hover:!text-white transition"
              >
                My Profile
              </Menu.Item>
            </Link>

            <Link to="/my-jobs/applied" onClick={() => setOpened(false)}>
              <Menu.Item
                leftSection={<Briefcase size={16} className="text-purple-400" />}
                className="!rounded-xl !text-xs !font-bold !text-slate-200 hover:!bg-white/10 hover:!text-white transition"
              >
                Applied Jobs & Pipeline
              </Menu.Item>
            </Link>

            <Link to="/my-jobs/saved" onClick={() => setOpened(false)}>
              <Menu.Item
                leftSection={<Bookmark size={16} className="text-pink-400" />}
                className="!rounded-xl !text-xs !font-bold !text-slate-200 hover:!bg-white/10 hover:!text-white transition"
              >
                Saved Jobs
              </Menu.Item>
            </Link>

            <Link to="/career-hub" onClick={() => setOpened(false)}>
              <Menu.Item
                leftSection={<Compass size={16} className="text-cyan-400" />}
                className="!rounded-xl !text-xs !font-bold !text-slate-200 hover:!bg-white/10 hover:!text-white transition"
              >
                Career Hub & AI Tools
              </Menu.Item>
            </Link>
          </>
        )}

        <Menu.Divider className="!border-white/10 !my-1.5" />

        <Menu.Item
          onClick={handleLogout}
          leftSection={<LogOut size={16} className="text-rose-400" />}
          className="!rounded-xl !text-xs !font-bold !text-rose-400 hover:!bg-rose-500/15 transition cursor-pointer"
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default ProfileMenu;