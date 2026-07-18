import {
  IconBriefcase,
  IconChecks,
  IconFileText,
} from "@tabler/icons-react";
import { Tabs } from "@mantine/core";
import React from "react";

function PostedJob() {
  return (
    <div className="w-full max-w-xs mt-5">
      <div className="rounded-3xl border border-white/10 bg-[#18181b] p-6 shadow-xl">
        {/* Heading */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <IconBriefcase size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">Jobs</h2>
            <p className="text-sm text-gray-400">
              Manage your posted jobs
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="active"
          variant="pills"
          radius="xl"
          color="indigo"
        >
          <Tabs.List grow className="bg-[#111318] rounded-xl p-1">
            <Tabs.Tab
              value="active"
              leftSection={<IconChecks size={16} />}
            >
              Active
            </Tabs.Tab>

            <Tabs.Tab
              value="draft"
              leftSection={<IconFileText size={16} />}
            >
              Draft
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="active" pt="lg">
            <div className="text-sm text-gray-400">
              Active jobs will appear here.
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="draft" pt="lg">
            <div className="text-sm text-gray-400">
              Draft jobs will appear here.
            </div>
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}

export default PostedJob;