import React from "react";
import { Calendar } from "lucide-react";

const MonthlyChart = () => {
  const months = [
    { label: "Aug", height: "h-16", val: "LKR 65k", active: false },
    { label: "Sep", height: "h-28", val: "LKR 98k", active: false },
    { label: "Oct", height: "h-20", val: "LKR 72k", active: false },
    { label: "Nov", height: "h-12", val: "LKR 45k", active: false },
    { label: "Dec", height: "h-36", val: "LKR 112.5k", active: true },
    { label: "Jan", height: "h-20", val: "LKR 70k", active: false },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
            <Calendar size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 leading-tight">Monthly Revenue</h2>
            <p className="text-[10px] font-semibold text-slate-400">Sales performance over time</p>
          </div>
        </div>
        <select className="bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-600 px-3 py-1.5 rounded-full outline-none focus:border-blue-500 cursor-pointer shadow-2xs">
          <option>Last 6 Months</option>
          <option>This Year</option>
        </select>
      </div>

      {/* Bar Chart Visualization */}
      <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-5 flex flex-col justify-end h-[220px] relative">
        <div className="flex justify-between items-end h-36 w-full px-1 gap-2.5">
          {months.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2.5 w-full relative group">
              {item.active && (
                <span className="absolute -top-7 text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full shadow-2xs animate-pulse">
                  {item.val}
                </span>
              )}
              {!item.active && (
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute -top-6 text-[10px] font-bold text-slate-600 bg-white border border-slate-100 px-2 py-0.5 rounded-full shadow-2xs">
                  {item.val}
                </span>
              )}

              <div
                className={`w-full rounded-t-xl transition-all duration-300 ${
                  item.active
                    ? "bg-gradient-to-t from-blue-600 to-sky-400 shadow-md shadow-blue-200"
                    : "bg-slate-200/80 group-hover:bg-blue-400/60"
                } ${item.height}`}
              />

              <span className={`text-[10px] font-bold uppercase tracking-wider ${item.active ? "text-blue-600" : "text-slate-400"}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthlyChart;
