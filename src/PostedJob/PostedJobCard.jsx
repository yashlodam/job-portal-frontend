import React from "react";
import {
  IconMapPin,
  IconUsers,
  IconCalendarTime,
  IconDotsVertical,
} from "@tabler/icons-react";
import { ActionIcon, Badge, Button } from "@mantine/core";

function PostedJobCard({ job }) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-[#18181b] p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_30px_rgba(99,102,241,.15)]">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-white group-hover:text-primary transition-colors">
            {job.jobTitle}
          </h2>

          <p className="mt-1 text-gray-400">{job.company}</p>
        </div>

        <ActionIcon
          variant="subtle"
          color="gray"
          radius="xl"
          size="lg"
        >
          <IconDotsVertical size={18} />
        </ActionIcon>
      </div>

      {/* Status */}
      <div className="mt-5">
        <Badge
          color={job.status === "Active" ? "green" : "yellow"}
          variant="light"
          radius="xl"
        >
          {job.status}
        </Badge>
      </div>

      {/* Details */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3 text-gray-300">
          <IconMapPin size={18} />
          <span>{job.location}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-300">
          <IconCalendarTime size={18} />
          <span>{job.posted || job.lastEdited}</span>
        </div>

        {job.applicants && (
          <div className="flex items-center gap-3 text-gray-300">
            <IconUsers size={18} />
            <span>{job.applicants} Applicants</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-7 flex gap-3">
        <Button
          variant="light"
          color="indigo"
          radius="xl"
          className="flex-1"
        >
          View
        </Button>

        <Button
          radius="xl"
          className="flex-1 bg-primary text-black hover:brightness-110"
        >
          Edit
        </Button>
      </div>
    </div>
  );
}

export default PostedJobCard;