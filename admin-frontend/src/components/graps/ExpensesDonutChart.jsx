import React from "react";
import { PieChart } from "lucide-react";

const ExpensesDonutChart = () => {
  const legendItems = [
    { label: "Distributors", pct: "40%", color: "bg-blue-600", border: "border-blue-200" },
    { label: "Logistics", pct: "25%", color: "bg-purple-600", border: "border-purple-200" },
    { label: "Warehouse", pct: "20%", color: "bg-emerald-500", border: "border-emerald-200" },
    { label: "Marketing", pct: "15%", color: "bg-amber-500", border: "border-amber-200" },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100">
            <PieChart size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 leading-tight">Expenses Split</h2>
            <p className="text-[10px] font-semibold text-slate-400">Budget allocation breakdown</p>
          </div>
        </div>
      </div>

      {/* Donut Content Container */}
      <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-5 flex flex-col items-center justify-center h-[220px]">
        {/* SVG Donut Chart with Center Text */}
        <div className="relative w-28 h-28 my-2 flex items-center justify-center">
          <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
            {/* Distributors (Blue) */}
            <circle cx="18" cy="18" r="12" fill="none" stroke="#2563eb" strokeWidth="6.5" strokeDasharray="40 100" strokeDashoffset="0" />
            {/* Logistics (Purple) */}
            <circle cx="18" cy="18" r="12" fill="none" stroke="#9333ea" strokeWidth="6.5" strokeDasharray="25 100" strokeDashoffset="-40" />
            {/* Warehouse (Emerald) */}
            <circle cx="18" cy="18" r="12" fill="none" stroke="#10b981" strokeWidth="6.5" strokeDasharray="20 100" strokeDashoffset="-65" />
            {/* Marketing (Amber) */}
            <circle cx="18" cy="18" r="12" fill="none" stroke="#f59e0b" strokeWidth="6.5" strokeDasharray="15 100" strokeDashoffset="-85" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Total</span>
            <span className="text-xs font-extrabold text-slate-800 leading-tight">LKR 1.2M</span>
          </div>
        </div>

        {/* Legend Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full text-[11px] font-semibold mt-2">
          {legendItems.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-white border border-slate-100 rounded-xl px-2.5 py-1 shadow-2xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
                <span className="text-slate-700 font-bold truncate">{item.label}</span>
              </div>
              <span className="text-slate-500 font-extrabold ml-1">{item.pct}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpensesDonutChart;
