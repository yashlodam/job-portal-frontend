import React from "react";

function PostedJobCard({ props }) {
  return (
    <div className="mt-3 rounded-xl border border-white/10 bg-gradient-to-r from-[#18181b] to-[#20222a] p-2 transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:shadow-primary/10 cursor-pointer">
      <div className="text-sm font-semibold text-white truncate">
        {props?.jobTitle}
      </div>

      <div className="mt-1 text-xs text-gray-400">
        📍 {props?.location}
      </div>

      <div className="mt-1 text-xs text-gray-500">
        🕒 {props?.posted || props?.lastEdited}
      </div>
    </div>
  );
}

export default PostedJobCard;