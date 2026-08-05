import React from "react";
import {
  IconHeart,
  IconMapPin,
  IconMessage,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const getFullImageUrl = (rawPath) => {
  if (!rawPath) return null;
  if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) return rawPath;
  const cleanPath = rawPath.startsWith("/") ? rawPath.slice(1) : rawPath;
  if (cleanPath.startsWith("uploads/")) return `http://localhost:8080/${cleanPath}`;
  return `http://localhost:8080/uploads/${cleanPath}`;
};

function AvailabilityBadge({ type }) {
  return (
    <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 font-satoshi">
      {type ? String(type).replace(/_/g, " ") : "OPEN TO WORK"}
    </span>
  );
}

function ExperienceBadge({ level }) {
  return (
    <span className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-bold text-indigo-300 font-satoshi">
      {level ? String(level).replace(/_/g, " ") : "MID LEVEL"}
    </span>
  );
}

function TalentCard({ talent: customTalent }) {
  const navigate = useNavigate();

  if (!customTalent) return null;

  const talent = {
    id: customTalent.id,
    name: customTalent.name || customTalent.fullName || "Candidate",
    role: customTalent.headline || customTalent.role || customTalent.title || customTalent.professionalTitle || "Software Specialist",
    company: customTalent.currentCompany || customTalent.company || "Independent",
    location: customTalent.location || (customTalent.city ? `${customTalent.city}, ${customTalent.country || ''}` : "Remote"),
    availability: customTalent.availability ? customTalent.availability.replace(/_/g, " ") : "OPEN TO WORK",
    experienceLevel: customTalent.experienceLevel ? customTalent.experienceLevel.replace(/_/g, " ") : "MID LEVEL",
    profileImage: getFullImageUrl(customTalent.profileImage || customTalent.avatar),
    skills: Array.isArray(customTalent.skills) ? customTalent.skills : [],
    about: customTalent.about || customTalent.bio || "",
  };

  const initials = talent.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div
      className="
        group
        w-full
        rounded-2xl
        border
        border-white/10
        bg-[#090d16]/90
        p-5
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-indigo-500/40
        hover:shadow-[0_12px_40px_rgba(99,102,241,0.15)]
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        {/* Profile */}
        <div className="flex min-w-0 items-center gap-3.5">
          {/* Avatar */}
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-indigo-500/20 bg-slate-800">
            {talent.profileImage ? (
              <img
                src={talent.profileImage}
                alt={talent.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 font-black text-white text-base">
                {initials}
              </div>
            )}
          </div>

          {/* Name & Role */}
          <div className="min-w-0">
            <h3 className="truncate font-satoshi text-base font-bold text-white">
              {talent.name}
            </h3>

            <p className="mt-0.5 truncate text-xs text-indigo-400 font-semibold font-satoshi">
              {talent.role}
              {talent.company && (
                <>
                  <span className="mx-1 text-slate-500">•</span>
                  <span className="text-slate-300">{talent.company}</span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="button"
          aria-label="Save talent"
          className="
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            text-slate-400
            transition-all
            hover:bg-white/10
            hover:text-white
          "
        >
          <IconHeart size={20} stroke={1.6} />
        </button>
      </div>

      {/* Skills */}
      {talent.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {talent.skills.slice(0, 3).map((skill, i) => (
            <span
              key={typeof skill === "string" ? skill : i}
              className="
                rounded-lg
                border
                border-indigo-500/20
                bg-indigo-500/10
                px-2.5
                py-0.5
                text-[11px]
                font-semibold
                text-indigo-300
                font-satoshi
              "
            >
              {typeof skill === "string" ? skill : skill.name}
            </span>
          ))}
        </div>
      )}

      {/* About */}
      {talent.about && (
        <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-300 font-satoshi">
          {talent.about}
        </p>
      )}

      {/* Badges: Experience Level & Status */}
      <div className="mt-4 flex items-center justify-between gap-2 font-satoshi">
        <ExperienceBadge level={talent.experienceLevel} />
        <AvailabilityBadge type={talent.availability} />
      </div>

      {/* Location */}
      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 font-satoshi">
        <IconMapPin size={14} className="shrink-0 text-indigo-400" />
        <span className="truncate">{talent.location}</span>
      </div>

      {/* Divider */}
      <div className="my-4 h-px w-full bg-white/10" />

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2 font-satoshi">
        <button
          type="button"
          onClick={() => navigate(`/talent-profile/${talent.id}`, { state: { talent: customTalent } })}
          className="
            flex
            h-9
            items-center
            justify-center
            rounded-xl
            border
            border-indigo-500/30
            bg-transparent
            text-xs
            font-bold
            text-indigo-300
            transition-all
            hover:bg-indigo-500/10
            cursor-pointer
          "
        >
          View Profile
        </button>

        <button
          type="button"
          className="
            flex
            h-9
            items-center
            justify-center
            gap-1.5
            rounded-xl
            bg-indigo-600
            text-xs
            font-bold
            text-white
            shadow-md
            transition-all
            hover:bg-indigo-500
            cursor-pointer
          "
        >
          <IconMessage size={15} />
          Message
        </button>
      </div>
    </div>
  );
}

export default TalentCard;