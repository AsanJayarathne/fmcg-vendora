import React, { useMemo } from "react";
import { PieChart } from "lucide-react";

const PALETTE = [
  { stroke: "#2563eb", bg: "bg-blue-600" },
  { stroke: "#9333ea", bg: "bg-purple-600" },
  { stroke: "#10b981", bg: "bg-emerald-500" },
  { stroke: "#f59e0b", bg: "bg-amber-500" },
  { stroke: "#f43f5e", bg: "bg-rose-500" },
  { stroke: "#06b6d4", bg: "bg-cyan-500" },
];

const formatLKR = (val) => {
  const num = Number(val || 0);
  if (num >= 1000000) return `LKR ${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `LKR ${(num / 1000).toFixed(1)}k`;
  return `LKR ${num.toLocaleString("en-LK", { maximumFractionDigits: 0 })}`;
};

const ExpensesDonutChart = ({ categories = [], warehouseBatches = [], loading = false }) => {
  // Aggregate real category distribution
  const { items, totalVal } = useMemo(() => {
    let rawList = [];
    let sum = 0;

    if (categories && categories.length > 0) {
      categories.forEach((cat) => {
        const val = parseFloat(cat.revenue || 0) || parseFloat(cat.product_count || 0) * 1000;
        sum += val;
        rawList.push({
          label: cat.category_name || "General",
          value: val,
        });
      });
    } else if (warehouseBatches && warehouseBatches.length > 0) {
      const catMap = {};
      warehouseBatches.forEach((b) => {
        const cat = b.category_name || "General";
        const val = parseFloat(b.quantity || 0) * parseFloat(b.cost_price || b.base_price || 1);
        catMap[cat] = (catMap[cat] || 0) + val;
        sum += val;
      });
      rawList = Object.entries(catMap).map(([label, value]) => ({ label, value }));
    }

    if (rawList.length === 0 || sum === 0) {
      rawList = [
        { label: "Beverages", value: 40 },
        { label: "Biscuits", value: 25 },
        { label: "Dairy", value: 20 },
        { label: "Personal Care", value: 15 },
      ];
      sum = 100;
    }

    // Sort descending and take top 4
    rawList.sort((a, b) => b.value - a.value);
    const top4 = rawList.slice(0, 4);
    const topSum = top4.reduce((acc, curr) => acc + curr.value, 0);

    let currentOffset = 0;
    const computedItems = top4.map((item, idx) => {
      const pct = Math.max(Math.round((item.value / (topSum || 1)) * 100), 1);
      const color = PALETTE[idx % PALETTE.length];
      const strokeDashoffset = -currentOffset;
      currentOffset += pct;

      return {
        ...item,
        pct: `${pct}%`,
        pctNum: pct,
        color: color.bg,
        stroke: color.stroke,
        strokeDasharray: `${pct} ${100 - pct}`,
        strokeDashoffset,
      };
    });

    return { items: computedItems, totalVal: sum };
  }, [categories, warehouseBatches]);

  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
            <PieChart size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 leading-tight">Category Breakdown</h2>
            <p className="text-[10px] font-semibold text-slate-400">Inventory & sales distribution</p>
          </div>
        </div>
      </div>

      {/* Donut Content Container */}
      <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-5 flex flex-col items-center justify-center h-[220px]">
        {loading ? (
          <div className="h-full flex items-center justify-center text-xs font-semibold text-slate-400">
            <div className="animate-pulse flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-500 animate-spin" />
              Loading breakdown...
            </div>
          </div>
        ) : (
          <>
            {/* SVG Donut Chart with Center Text */}
            <div className="relative w-28 h-28 my-1 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {items.map((item, idx) => (
                  <circle
                    key={idx}
                    cx="18"
                    cy="18"
                    r="12"
                    fill="none"
                    stroke={item.stroke}
                    strokeWidth="6.5"
                    strokeDasharray={item.strokeDasharray}
                    strokeDashoffset={item.strokeDashoffset}
                    className="transition-all duration-500"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Total</span>
                <span className="text-xs font-extrabold text-slate-800 leading-tight">
                  {formatLKR(totalVal)}
                </span>
              </div>
            </div>

            {/* Legend Grid */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 w-full text-[11px] font-semibold mt-2">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-white border border-slate-100 rounded-xl px-2.5 py-1 shadow-2xs"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
                    <span className="text-slate-700 font-bold truncate max-w-[70px]">{item.label}</span>
                  </div>
                  <span className="text-slate-500 font-extrabold ml-1">{item.pct}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpensesDonutChart;

