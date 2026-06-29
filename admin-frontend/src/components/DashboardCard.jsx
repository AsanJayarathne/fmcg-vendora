import React from 'react';

const DashboardCard = ({ title, value, icon, trend, trendUp }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-transform hover:-translate-y-0.5">
      <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-2xl">
        {icon}
      </div>
      <div>
        <h4 className="text-slate-500 text-sm font-medium mb-1">{title}</h4>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {trend && (
          <div className={`text-xs mt-1 ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
            {trendUp ? '↑' : '↓'} {trend} vs last month
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
