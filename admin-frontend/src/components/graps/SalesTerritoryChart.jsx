import React, { useMemo } from "react";
import { MapPin } from "lucide-react";

const formatLKR = (val) => {
  const num = Number(val || 0);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)} M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)} K`;
  return num.toLocaleString("en-LK", { maximumFractionDigits: 0 });
};

const SalesTerritoryChart = ({ territories = [], loading = false }) => {
  // Process real territory data
  const processedTerritories = useMemo(() => {
    let list = (territories || []).map((t) => ({
      name: t.region_name || "Unknown Region",
      amountRaw: parseFloat(t.revenue || 0),
      distributors: parseInt(t.distributor_count || 0),
    }));

    if (list.length === 0) {
      list = [
        { name: "Western Province", amountRaw: 0, distributors: 0 },
        { name: "Central Province", amountRaw: 0, distributors: 0 },
        { name: "Southern Province", amountRaw: 0, distributors: 0 },
        { name: "Northern Province", amountRaw: 0, distributors: 0 },
      ];
    }

    const totalRev = list.reduce((acc, curr) => acc + curr.amountRaw, 0);
    const maxRev = Math.max(...list.map((t) => t.amountRaw), 1);

    return list.map((t) => {
      const sharePct = totalRev > 0 ? ((t.amountRaw / totalRev) * 100).toFixed(1) : "0.0";
      const barPct = totalRev > 0 ? Math.max(Math.round((t.amountRaw / maxRev) * 100), 5) : 5;
      return {
        name: t.name,
        amount: formatLKR(t.amountRaw),
        pct: barPct,
        share: `${sharePct}%`,
        distributors: t.distributors,
      };
    });
  }, [territories]);

  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
            <MapPin size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 leading-tight">Sales by Territory</h2>
            <p className="text-[10px] font-semibold text-slate-400">Regional sales & distributor share</p>
          </div>
        </div>
      </div>

      {/* Progress Bars Container */}
      <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-5 space-y-4">
        {loading ? (
          <div className="py-12 flex items-center justify-center text-xs font-semibold text-slate-400">
            <div className="animate-pulse flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500 animate-spin" />
              Loading territory sales...
            </div>
          </div>
        ) : (
          processedTerritories.map((t, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">{t.name}</span>
                  {t.distributors > 0 && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      ({t.distributors} {t.distributors === 1 ? "distributor" : "distributors"})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">LKR {t.amount}</span>
                  <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full shadow-2xs">
                    {t.share}
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-200/70 h-3 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-blue-600 to-sky-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${t.pct}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SalesTerritoryChart;

