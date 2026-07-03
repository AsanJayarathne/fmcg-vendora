import React from 'react';

const ExpensesDonutChart = () => {
  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-bold text-slate-700 mb-4">Expenses Statistics</h2>
      <div className="bg-[#f2f4fa] rounded-2xl p-6 flex-1 flex flex-col items-center justify-center h-[250px]">
        {/* Donut Chart */}
        <div className="relative w-32 h-32 mb-6 mt-2">
          <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
            {/* DBL Bank (Blue) */}
            <circle cx="18" cy="18" r="12" fill="none" stroke="#3b82f6" strokeWidth="8" strokeDasharray="25 100" strokeDashoffset="0" />
            {/* BRC Bank (Pink) */}
            <circle cx="18" cy="18" r="12" fill="none" stroke="#f472b6" strokeWidth="8" strokeDasharray="15 100" strokeDashoffset="-25" />
            {/* MCP Bank (Yellow/Orange) */}
            <circle cx="18" cy="18" r="12" fill="none" stroke="#fbbf24" strokeWidth="8" strokeDasharray="30 100" strokeDashoffset="-40" />
            {/* ABM Bank (Cyan/Teal) */}
            <circle cx="18" cy="18" r="12" fill="none" stroke="#14b8a6" strokeWidth="8" strokeDasharray="30 100" strokeDashoffset="-70" />
            {/* Inner white circle for donut effect is handled by fill="none" and strokeWidth */}
            <circle cx="18" cy="18" r="8" fill="white" />
          </svg>
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs font-semibold text-blue-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            DBL Bank
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-pink-400"></div>
            BRC Bank
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-teal-400"></div>
            ABM Bank
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            MCP Bank
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesDonutChart;
