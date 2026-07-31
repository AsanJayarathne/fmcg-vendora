import React from "react";
import { MapPin } from "lucide-react";

const SalesTerritoryChart = () => {
  const territories = [
    { name: "Kegalle", amount: "4.0 M", pct: 80, share: "34.2%" },
    { name: "Colombo", amount: "3.0 M", pct: 60, share: "24.2%" },
    { name: "Kandy", amount: "2.7 M", pct: 55, share: "14.2%" },
    { name: "Galle", amount: "2.3 M", pct: 45, share: "12.3%" },
    { name: "Jaffna", amount: "2.0 M", pct: 40, share: "9.0%" },
  ];

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
            <p className="text-[10px] font-semibold text-slate-400">Regional sales distribution</p>
          </div>
        </div>
        <select className="bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-600 px-3 py-1.5 rounded-full outline-none focus:border-blue-500 cursor-pointer shadow-2xs">
          <option>This Month</option>
          <option>This Week</option>
          <option>This Year</option>
        </select>
      </div>

      {/* Progress Bars Container */}
      <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-5 space-y-4">
        {territories.map((t, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">{t.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">LKR {t.amount}</span>
                <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
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
        ))}
      </div>
    </div>
  );
};

export default SalesTerritoryChart;
