import React, { useState, useEffect } from "react";
import TalentCard from "./TalentCard";
import { searchTalent } from "../../api/talentApi";

function RecommendTalent({ currentId }) {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadRecommendations = async () => {
      setLoading(true);
      try {
        const res = await searchTalent({ page: 0, size: 5 });
        const list = res?.data?.content || res?.data || (Array.isArray(res) ? res : []);
        if (Array.isArray(list) && isMounted) {
          const filtered = list.filter((t) => String(t.id) !== String(currentId));
          setRecommended(filtered.slice(0, 3));
        }
      } catch (err) {
        console.error("Error loading candidate recommendations:", err);
        if (isMounted) setRecommended([]);
      } fontFinally: {
        if (isMounted) setLoading(false);
      }
    };
    loadRecommendations();
    return () => { isMounted = false; };
  }, [currentId]);

  if (loading) {
    return (
      <div className="w-full">
        <h3 className="text-[15px] font-black font-satoshi text-white mb-4">
          Recommended Talent
        </h3>
        <div className="p-4 text-xs text-slate-400 font-satoshi border border-white/5 rounded-xl bg-white/[0.02]">
          Loading candidate suggestions…
        </div>
      </div>
    );
  }

  if (recommended.length === 0) {
    return null; // Hide recommendations column if no other candidate profiles exist
  }

  return (
    <div className="w-full">
      <h3 className="text-[15px] font-black font-satoshi text-white mb-4">
        Recommended Talent
      </h3>
      <div className="flex flex-col gap-4">
        {recommended.map((talentItem, idx) => (
          <TalentCard key={talentItem.id || idx} talent={talentItem} />
        ))}
      </div>
    </div>
  );
}

export default RecommendTalent;