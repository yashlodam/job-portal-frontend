import { Divider } from "@mantine/core";
import {
  IconBriefcase,
  IconCertificate,
  IconExternalLink,
  IconMapPin,
  IconMessage,
  IconSchool,
} from "@tabler/icons-react";

import React from "react";

function Profile(profile) {

console.log(profile)

  return (
    <div className="w-2/3">

      {/* Banner + Profile Image */}
      <div className="relative">

        {/* Banner */}
        <div className="h-64 w-full overflow-hidden rounded-2xl border border-white/[0.08]">
          <img
            src={`${profile.bannerImage}`}
            alt="Profile banner"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Profile Image */}
        <div className="absolute -bottom-20 left-8">
          <div
            className="
              h-40 w-40
              overflow-hidden
              rounded-full
              border-[5px]
              border-background
              bg-surface
              shadow-[0_12px_40px_rgba(0,0,0,0.35)]
              sm:h-44
              sm:w-44
            "
          >
            <img
              src={`${profile.profileImage}`}
              alt="Yash Lodam"
              className="h-full w-full object-cover"
            />
          </div>
        </div>

      </div>

      {/* Space for Profile Image */}
      <div className="h-24" />

      {/* Profile Information */}
      <div className="px-3 sm:px-4">

        {/* Name + Message Button */}
        <div className="flex items-center justify-between gap-6">

          {/* Name */}
          <h1
            className="
              font-satoshi
              text-2xl
              font-bold
              tracking-tight
              text-heading
              sm:text-3xl
            "
          >
            {profile.name}
          </h1>

          {/* Message Button */}
          <button
            type="button"
            className="
              inline-flex
              h-10
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-primary
              px-6
              text-sm
              font-semibold
              text-white
              shadow-button
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-primary-light
              active:translate-y-0
            "
          >
            <IconMessage
              size={17}
              stroke={1.8}
            />
            Message
          </button>

        </div>

        {/* Role + Company */}
        <div className="mt-2 flex items-center gap-2 text-sm text-body sm:text-base">

          <IconBriefcase
            size={18}
            stroke={1.7}
            className="shrink-0 text-muted"
          />

          <span className="font-medium">
            {profile.role}
          </span>

          <span className="text-muted">
            •
          </span>

          <span className="font-medium text-primary-light">
            {profile.company}
          </span>

        </div>

        {/* Location */}
        <div className="mt-1.5 flex items-center gap-2 text-sm text-muted sm:text-base">

          <IconMapPin
            size={18}
            stroke={1.7}
            className="shrink-0"
          />

          <span>
            {profile.location}
          </span>

        </div>

      </div>

      <Divider
  size="xs"
  my="xl"
  color="rgba(148, 163, 184, 0.08)"
/>
{/* About Section */}
<section>
  <h2 className="font-satoshi text-xl font-bold tracking-tight text-heading sm:text-2xl">
    About
  </h2>

  <p className="mt-3 max-w-3xl text-sm leading-7 text-body sm:text-[15px]">
    {profile.about}
  </p>
</section>

{/* Divider */}
<Divider
  size="xs"
  my="xl"
  color="rgba(148, 163, 184, 0.08)"
/>

{/* Skills Section */}
<section>
  <h2 className="font-satoshi text-xl font-bold tracking-tight text-heading sm:text-2xl">
    Skills
  </h2>

  <div className="mt-4 flex flex-wrap gap-2.5">
    {profile?.skills?.map((skill) => (
      <span
        key={skill}
        className="
          inline-flex
          items-center
          rounded-lg
          border
          border-primary/20
          bg-primary/10
          px-3.5
          py-1.5
          text-sm
          font-medium
          text-primary-light
          transition-all
          duration-300
          hover:border-primary/40
          hover:bg-primary/15
        "
      >
        {skill}
      </span>
    ))}
  </div>
</section>

{/* Divider */}
<Divider
  size="xs"
  my="xl"
  color="rgba(148, 163, 184, 0.08)"
/>

{/* Experience Section */}
<h2 className="font-satoshi text-xl font-bold tracking-tight text-heading sm:text-2xl">
    Experience
  </h2>
{
    profile?.experience?.map((item,index)=> 
        <section>
  

  <div key={index} className="mt-6 space-y-8">

    {/* Experience Item */}
    <div className="flex gap-4">

      {/* Company Logo */}
      <div className="flex h-15 w-15 shrink-0 items-center justify-center rounded-xl border border-border bg-surface p-2">
        <img
          src="google.png"
          alt="Google"
          className="h-full w-full object-contain"
        />
      </div>

      {/* Experience Details */}
      <div className="flex-1">

        <div className="flex flex-wrap items-start justify-between gap-2">

          <div>
            <h3 className="font-satoshi text-base font-semibold text-heading sm:text-lg">
              {item.role}
            </h3>

            <p className="mt-1 text-sm font-medium text-primary-light">
              {item.company}
            </p>
          </div>

          <span className="text-sm text-muted">
            {item.startDate} {item.endDate}
          </span>

        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted sm:text-sm">
          <span>{item.type}</span>

          <span>•</span>

          <span>{item.location}</span>
        </div>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-body">
          {item.description}
        </p>

      </div>

    </div>

  </div>
</section>
    )
}


{/* Divider */}
<Divider
  size="xs"
  my="xl"
  color="rgba(148, 163, 184, 0.08)"
/>

{/* Education Section */}
<h2 className="font-satoshi text-xl font-bold tracking-tight text-heading sm:text-2xl">
    Education
  </h2>
{
    profile?.education?.map((item,index)=>
<section key={index}>
  

  <div className="mt-6 space-y-8">

    {/* Education Item */}
    <div className="flex items-start gap-4">

      {/* Education Icon */}
      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-primary/20
          bg-primary/10
          text-primary-light
        "
      >
        <IconSchool size={24} stroke={1.6} />
      </div>

      {/* Education Details */}
      <div className="min-w-0 flex-1">

        <div className="flex flex-wrap items-start justify-between gap-3">

          <div>
            {/* Degree */}
            <h3 className="font-satoshi text-base font-semibold text-heading sm:text-lg">
              {item.degree}
            </h3>

            {/* College */}
            <p className="mt-1 text-sm font-medium text-primary-light">
              Late G.N. Sapkal College of Engineering
            </p>
          </div>

          {/* Duration */}
          <span className="shrink-0 text-sm text-muted">
            {item.startYear} — {item.endYear}
          </span>

        </div>

        {/* University */}
        <p className="mt-2 text-sm text-body">
          Savitribai Phule Pune University
        </p>

        {/* Location */}
        <div className="mt-2 flex items-center gap-1.5 text-sm text-muted">
          <IconMapPin size={16} stroke={1.7} />

          <span>
            {item.location}
          </span>
        </div>

      </div>

    </div>

  </div>
</section>
    )
}


{/* Divider */}
<Divider
  size="xs"
  my="xl"
  color="rgba(148, 163, 184, 0.08)"
/>

{/* Certifications Section */}
<section>
  <h2 className="font-satoshi text-xl font-bold tracking-tight text-heading sm:text-2xl">
    Certifications
  </h2>

  <div className="mt-6 space-y-6">

    {/* Certification Item */}
    <div className="flex items-start gap-4">

      {/* Certificate Icon */}
      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-primary/20
          bg-primary/10
          text-primary-light
        "
      >
        <IconCertificate size={24} stroke={1.6} />
      </div>

      {/* Certificate Information */}
      <div className="min-w-0 flex-1">

        <div className="flex flex-wrap items-start justify-between gap-3">

          <div>
            <h3 className="font-satoshi text-base font-semibold text-heading sm:text-lg">
              Google Cloud Professional Developer
            </h3>

            <p className="mt-1 text-sm font-medium text-primary-light">
              Google Cloud
            </p>
          </div>

          <span className="shrink-0 text-sm text-muted">
            Issued Jan 2025
          </span>

        </div>

        <p className="mt-2 text-sm text-muted">
          Credential ID: GCP-DEV-2025
        </p>

        <button
          type="button"
          className="
            mt-3
            inline-flex
            items-center
            gap-1.5
            text-sm
            font-semibold
            text-primary-light
            transition-colors
            hover:text-primary
          "
        >
          Show credential
          <IconExternalLink size={15} stroke={1.8} />
        </button>

      </div>

    </div>

  </div>
</section>
    </div>
  );
}

export default Profile;