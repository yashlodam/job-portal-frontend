import { Divider } from "@mantine/core";
import React from "react";
import PostedJob from "../PostedJob/PostedJob";

function PostedJobPage() {
  return (
    <div className="min-h-screen bg-[#0b0d14] text-white">
      {/* Top Divider */}
      <Divider color="rgba(255,255,255,.08)" />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Page Heading */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Manage Posted Jobs
          </h1>

          <p className="mt-3 text-gray-400 max-w-2xl">
            Track your active jobs, manage drafts, monitor applicants,
            and keep your listings updated from one place.
          </p>
        </div>

        {/* Dashboard */}
        <div className="flex gap-8">
          <div className="flex-1">
            <PostedJob />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostedJobPage;