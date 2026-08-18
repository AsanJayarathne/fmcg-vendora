import React, { useState, useMemo } from "react";
import { Calendar, TrendingUp, BarChart2 } from "lucide-react";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const formatLKR = (val) => {
  const num = Number(val || 0);
  if (num >= 1000000) return `LKR ${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `LKR ${(num / 1000).toFixed(1)}k`;
  return `LKR ${num.toLocaleString("en-LK", { maximumFractionDigits: 0 })}`;
};

const MonthlyChart = ({ data = [], loading = false }) => {
  const [viewMode, setViewMode] = useState("month"); // 'month' or 'year'

  // Generate last 6 months list (ending at current month)
  const last6Months = useMemo(() => {
    const list = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      list.push({
        label: MONTH_NAMES[d.getMonth()],
        monthNum: d.getMonth() + 1,
        year: d.getFullYear(),
        revenue: 0,
        orders: 0,
      });
    }

    // Populate with real revenue data
    (data || []).forEach((item) => {
      const mName = item.month_name;
      const mNum = parseInt(item.month_num || 0);
      const target = list.find((m) => m.label === mName || (mNum && m.monthNum === mNum));
      if (target) {
        target.revenue += parseFloat(item.revenue || 0);
        target.orders += parseInt(item.orders || 0);
      }
    });

    const maxRev = Math.max(...list.map((d) => d.revenue), 1);
    const peakMonth = list.reduce((prev, curr) => (curr.revenue > prev.revenue ? curr : prev), list[0]);

    return list.map((item) => ({
      ...item,
      pct: Math.max(Math.round((item.revenue / maxRev) * 100), item.revenue > 0 ? 10 : 5),
      formattedVal: formatLKR(item.revenue),
      isPeak: item.revenue > 0 && item.label === peakMonth.label,
    }));
  }, [data]);

  // Aggregate yearly data (last 4 years)
  const yearlyData = useMemo(() => {
    const yearMap = {};
    const currentYear = new Date().getFullYear();
    for (let y = currentYear - 3; y <= currentYear; y++) {
      yearMap[y] = { label: String(y), revenue: 0, orders: 0 };
    }

    (data || []).forEach((item) => {
      const yr = item.year_num ? String(item.year_num) : String(currentYear);
      if (!yearMap[yr]) {
        yearMap[yr] = { label: yr, revenue: 0, orders: 0 };
      }
      yearMap[yr].revenue += parseFloat(item.revenue || 0);
      yearMap[yr].orders += parseInt(item.orders || 0);
    });

    const list = Object.values(yearMap).sort((a, b) => parseInt(a.label) - parseInt(b.label));
    const maxRev = Math.max(...list.map((d) => d.revenue), 1);
    const peakYear = list.reduce((prev, curr) => (curr.revenue > prev.revenue ? curr : prev), list[0]);

    return list.map((item) => ({
      ...item,
      pct: Math.max(Math.round((item.revenue / maxRev) * 100), item.revenue > 0 ? 12 : 6),
      formattedVal: formatLKR(item.revenue),
      isPeak: item.revenue > 0 && item.label === peakYear.label,
    }));
  }, [data]);

  const activeItems = viewMode === "month" ? last6Months : yearlyData;
  const totalRevenue = activeItems.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
            {viewMode === "month" ? <Calendar size={20} /> : <TrendingUp size={20} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800 leading-tight">
                {viewMode === "month" ? "Monthly Revenue" : "Yearly Revenue"}
              </h2>
              {totalRevenue > 0 && (
                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                  {formatLKR(totalRevenue)}
                </span>
              )}
            </div>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5">
              {viewMode === "month" ? "Last 6 Months performance" : "Annual sales breakdown"}
            </p>
          </div>
        </div>

        {/* Month / Year Segmented Control */}
        <div className="bg-slate-100 p-1 rounded-full border border-slate-200/60 flex items-center shadow-2xs shrink-0">
          <button
            onClick={() => setViewMode("month")}
            className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
              viewMode === "month"
                ? "bg-white text-blue-600 shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setViewMode("year")}
            className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
              viewMode === "year"
                ? "bg-white text-blue-600 shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Bar Chart Visualization Area */}
      <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-5 flex flex-col justify-end h-[220px] relative">
        {loading ? (
          <div className="h-full flex items-center justify-center text-xs font-semibold text-slate-400">
            <div className="animate-pulse flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-500 animate-spin" />
              Loading revenue data...
            </div>
          </div>
        ) : (
          <div className="flex justify-around items-end h-36 w-full px-2 gap-3 sm:gap-4">
            {activeItems.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2.5 w-full max-w-[52px] h-full justify-end relative group cursor-pointer"
              >
                {/* Floating Tooltip / Peak Badge */}
                {item.isPeak ? (
                  <span className="absolute -top-7 text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full shadow-2xs whitespace-nowrap z-10 animate-pulse">
                    {item.formattedVal}
                  </span>
                ) : (
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-7 text-[10px] font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-full shadow-2xs whitespace-nowrap z-10 pointer-events-none">
                    {item.formattedVal}
                  </span>
                )}

                {/* Animated Bar with Dynamic Height & Max Width */}
                <div
                  className="w-full flex items-end justify-center rounded-t-xl transition-all duration-500 overflow-hidden"
                  style={{ height: `${item.pct}%` }}
                >
                  <div
                    className={`w-full h-full rounded-t-xl transition-all duration-300 ${
                      item.isPeak || item.revenue > 0
                        ? "bg-gradient-to-t from-blue-600 to-sky-400 group-hover:from-blue-700 group-hover:to-sky-300 shadow-sm shadow-blue-200/50"
                        : "bg-slate-200/80 group-hover:bg-blue-300/60"
                    }`}
                  />
                </div>

                {/* Label */}
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    item.isPeak
                      ? "text-blue-600"
                      : item.revenue > 0
                      ? "text-slate-700"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyChart;


