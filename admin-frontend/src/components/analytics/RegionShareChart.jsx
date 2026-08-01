import React from "react";
import AnalyticsCard from "./AnalyticsCard";
import { PieChart } from "lucide-react";

const COLORS = [
  { bg: "bg-blue-600", hex: "#2563eb" },
  { bg: "bg-emerald-500", hex: "#10b981" },
  { bg: "bg-amber-500", hex: "#f59e0b" },
  { bg: "bg-violet-600", hex: "#7c3aed" },
  { bg: "bg-rose-500", hex: "#f43f5e" },
  { bg: "bg-cyan-500", hex: "#06b6d4" },
];

export default function RegionShareChart({ data = [], loading = false }) {
  // Only include regions that have actual data (revenue > 0 or active distributors)
  const activeData = (data || []).filter((d) => {
    const rev = parseFloat(d.revenue || 0);
    const distCount = parseInt(d.distributor_count || 0);
    return rev > 0 || distCount > 0;
  });

  const totalRev = activeData.reduce((acc, curr) => acc + parseFloat(curr.revenue || 0), 0);

  const processed = activeData.map((d, i) => {
    const rev = parseFloat(d.revenue || 0);
    const share =
      totalRev > 0 ? Math.round((rev / totalRev) * 100) : Math.round(100 / activeData.length);
    const rawName = d.region_name || "Region";
    const cleanName = rawName.replace(/\s*\(.*?\)/g, "").trim();

    return {
      region: cleanName,
      revenue: rev,
      share: share,
      color: COLORS[i % COLORS.length].bg,
      hex: COLORS[i % COLORS.length].hex,
    };
  });

  return (
    <AnalyticsCard
      title="Territory Sales Distribution"
      subtitle="Geographic revenue share across active regions"
      icon={PieChart}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2 font-sans">
        {loading ? (
          <div className="w-full py-12 text-center text-xs font-semibold text-slate-400">
            Loading territory distribution...
          </div>
        ) : processed.length === 0 ? (
          <div className="w-full py-12 text-center text-slate-400">
            <p className="text-3xl mb-2">🗺️</p>
            <p className="text-xs font-bold text-slate-700">No active region data found</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Regions will appear here as sales occur.</p>
          </div>
        ) : (
          <>
            {/* SVG Donut */}
            <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3.8" />
                {processed.map((item, idx) => {
                  let offset = 0;
                  for (let i = 0; i < idx; i++) offset += processed[i].share;
                  return (
                    <circle
                      key={idx}
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke={item.hex}
                      strokeWidth="4"
                      strokeDasharray={`${item.share} ${100 - item.share}`}
                      strokeDashoffset={`-${offset}`}
                    />
                  );
                })}
              </svg>

              <div className="absolute text-center">
                <p className="text-xl font-black text-slate-800 leading-none">
                  {processed.length}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 font-sans">
                  {processed.length === 1 ? "Region" : "Regions"}
                </p>
              </div>
            </div>

            {/* Region Legend (Only active regions with data) */}
            <div className="flex-1 space-y-3 w-full">
              {processed.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-bold py-0.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-3 h-3 rounded-full ${item.color} shrink-0`} />
                    <span className="text-slate-800 font-bold text-xs truncate">{item.region}</span>
                  </div>
                  <span className="text-xs font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full shrink-0">
                    {item.share}%
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AnalyticsCard>
  );
}
