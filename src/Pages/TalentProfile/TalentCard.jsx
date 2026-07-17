import React from "react";
import {
  IconHeart,
  IconMapPin,
  IconMessage,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

function TalentCard() {
  const navigate = useNavigate();

  const talent = {
    id: 1,
    name: "Jarrod Wood",
    role: "Software Engineer",
    company: "Google",
    location: "New York, United States",
    salary: "₹48 - 60 LPA",
    profileImage: "/profile.png",
    skills: ["React", "Spring Boot", "MongoDB"],
    about:
      "As a Software Engineer at Google, I specialize in building scalable and high-performance applications. My expertise lies in integrating front-end and back-end technologies to create seamless digital experiences.",
  };

  return (
    <div
      className="
        group
        w-full
        max-w-md
        rounded-2xl
        border
        border-border
        bg-surface
        p-5
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-primary/30
        hover:shadow-[0_16px_50px_rgba(0,0,0,0.25)]
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">

        {/* Profile */}
        <div className="flex min-w-0 items-center gap-4">

          {/* Avatar */}
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 bg-surface-elevated">
            <img
              src={talent.profileImage}
              alt={talent.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Name & Role */}
          <div className="min-w-0">
            <h3 className="truncate font-satoshi text-xl font-bold text-heading">
              {talent.name}
            </h3>

            <p className="mt-1 truncate text-sm text-body">
              {talent.role}
              <span className="mx-1.5 text-muted">•</span>
              <span className="font-medium text-primary-light">
                {talent.company}
              </span>
            </p>
          </div>

        </div>

        {/* Favorite Button */}
        <button
          type="button"
          aria-label="Save talent"
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            text-muted
            transition-all
            duration-300
            hover:bg-primary/10
            hover:text-primary-light
          "
        >
          <IconHeart size={24} stroke={1.6} />
        </button>

      </div>

      {/* Skills */}
      <div className="mt-5 flex flex-wrap gap-2">
        {talent.skills.map((skill) => (
          <span
            key={skill}
            className="
              rounded-lg
              border
              border-primary/15
              bg-primary/10
              px-3
              py-1
              text-xs
              font-semibold
              text-primary-light
            "
          >
            {skill}
          </span>
        ))}
      </div>

      {/* About */}
      <p
        className="
          mt-4
          line-clamp-3
          text-sm
          leading-6
          text-body
        "
      >
        {talent.about}
      </p>

      {/* Divider */}
      <div className="my-5 h-px w-full bg-border" />

      {/* Salary & Location */}
      <div className="flex flex-wrap items-center justify-between gap-3">

        {/* Salary */}
        <span className="font-satoshi text-base font-bold text-heading">
          {talent.salary}
        </span>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-muted">
          <IconMapPin
            size={18}
            stroke={1.7}
            className="shrink-0"
          />

          <span className="truncate">
            {talent.location}
          </span>
        </div>

      </div>

      {/* Divider */}
      <div className="my-5 h-px w-full bg-border" />

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">

        {/* Profile Button */}
        <button
          type="button"
          onClick={() => navigate(`/talent-profile/${talent.id}`)}
          className="
            flex
            h-11
            items-center
            justify-center
            rounded-xl
            border
            border-primary/40
            bg-transparent
            text-sm
            font-semibold
            text-primary-light
            transition-all
            duration-300
            hover:border-primary
            hover:bg-primary/10
          "
        >
          Profile
        </button>

        {/* Message Button */}
        <button
          type="button"
          className="
            flex
            h-11
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-primary
            text-sm
            font-semibold
            text-white
            shadow-button
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:bg-primary-light
          "
        >
          <IconMessage size={17} stroke={1.8} />
          Message
        </button>

      </div>

    </div>
  );
}

export default TalentCard;