import {
  IconBriefcase,
  IconChecks,
  IconFileText,
} from "@tabler/icons-react";
import { Badge, Tabs } from "@mantine/core";
import React from "react";
import PostedJobCard from "./PostedJobCard";
import { activeJobs, drafts } from "../Data/PostedJob";

function PostedJob() {
  return (
    <div className="w-full mt-8">
      <div className="rounded-3xl border border-white/10 bg-[#18181b] shadow-xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <IconBriefcase size={28} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">
                Posted Jobs
              </h2>

              <p className="text-gray-400 text-sm">
                Manage all your active and draft job postings.
              </p>
            </div>
          </div>

          <Badge
            radius="xl"
            color="indigo"
            variant="light"
            size="lg"
          >
            {activeJobs.length + drafts.length} Jobs
          </Badge>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="active"
          variant="pills"
          color="indigo"
          className="p-6"
        >
          <Tabs.List
            grow
            className="bg-[#111318] rounded-xl p-1 mb-8"
          >
            <Tabs.Tab
              value="active"
              leftSection={<IconChecks size={16} />}
            >
              Active ({activeJobs.length})
            </Tabs.Tab>

            <Tabs.Tab
              value="draft"
              leftSection={<IconFileText size={16} />}
            >
              Draft ({drafts.length})
            </Tabs.Tab>
          </Tabs.List>

          {/* Active Jobs */}
          <Tabs.Panel value="active">
            {activeJobs.length > 0 ? (
              <div className="grid gap-5">
                {activeJobs.map((job, index) => (
                  <PostedJobCard
                    key={index}
                    job={job}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 p-16 text-center">
                <IconBriefcase
                  size={45}
                  className="mx-auto text-gray-500"
                />
                <h3 className="mt-4 text-xl font-semibold text-white">
                  No Active Jobs
                </h3>

                <p className="mt-2 text-gray-400">
                  You haven't posted any active jobs yet.
                </p>
              </div>
            )}
          </Tabs.Panel>

          {/* Draft Jobs */}
          <Tabs.Panel value="draft">
            {drafts.length > 0 ? (
              <div className="grid gap-5">
                {drafts.map((job, index) => (
                  <PostedJobCard
                    key={index}
                    job={job}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 p-16 text-center">
                <IconFileText
                  size={45}
                  className="mx-auto text-gray-500"
                />
                <h3 className="mt-4 text-xl font-semibold text-white">
                  No Draft Jobs
                </h3>

                <p className="mt-2 text-gray-400">
                  Your draft jobs will appear here.
                </p>
              </div>
            )}
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}

export default PostedJob;