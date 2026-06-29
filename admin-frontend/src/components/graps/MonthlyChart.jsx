import React from 'react';

const MonthlyChart = () => {
  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-bold text-slate-700 mb-4">Monthly</h2>
      <div className="bg-[#f2f4fa] rounded-2xl p-6 flex-1 flex flex-col justify-end relative h-[250px]">
        <div className="flex justify-between items-end h-32 w-full px-2 gap-2">
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="w-full bg-white rounded-t-lg h-16"></div>
            <span className="text-xs font-semibold text-blue-400">Aug</span>
          </div>
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="w-full bg-white rounded-t-lg h-28"></div>
            <span className="text-xs font-semibold text-blue-400">Sep</span>
          </div>
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="w-full bg-white rounded-t-lg h-20"></div>
            <span className="text-xs font-semibold text-blue-400">Oct</span>
          </div>
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="w-full bg-white rounded-t-lg h-10"></div>
            <span className="text-xs font-semibold text-blue-400">Nov</span>
          </div>
          <div className="flex flex-col items-center gap-3 w-full relative">
            <span className="absolute -top-7 text-sm font-bold text-slate-800">112,500</span>
            <div className="w-full bg-blue-600 rounded-t-lg h-32"></div>
            <span className="text-xs font-semibold text-blue-400">Dec</span>
          </div>
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="w-full bg-white rounded-t-lg h-16"></div>
            <span className="text-xs font-semibold text-blue-400">Jan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyChart;
