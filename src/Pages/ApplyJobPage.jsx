import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import ApplyJobComp from "../ApplyJob/ApplyJobComp";

function ApplyJobPage() {
  return (
    <div className="min-h-[90vh] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/jobs/1" className="inline-block mb-8">
          <Button
            variant="light"
            radius="xl"
            size="md"
            leftSection={<IconArrowLeft size={18} />}
            className="transition-all duration-300 hover:-translate-x-1 hover:shadow-lg"
          >
            Back
          </Button>
        </Link>

        {/* Application Card */}
        <div className="rounded-3xlshadow-xl p-8 transition-all duration-300 hover:shadow-2xl min-h-[70vh]">
          {/* Your Apply Job Form Goes Here */}
          <ApplyJobComp/>
        </div>
      </div>
    </div>
  );
}

export default ApplyJobPage;