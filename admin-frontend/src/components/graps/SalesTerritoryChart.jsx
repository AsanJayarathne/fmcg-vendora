import React from 'react';

const SalesTerritoryChart = () => {
  return (
    <div className="bg-[#f2f4fa] rounded-2xl p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-900">Sales by Territory</h2>
        <select className="bg-[#e4e7f4] text-xs font-semibold text-slate-700 px-3 py-1.5 rounded outline-none border-none cursor-pointer">
          <option>This week</option>
          <option>This month</option>
          <option>This year</option>
        </select>
      </div>
      
      <div className="flex flex-col gap-5 pr-4 pb-6">
        {/* Kegalle */}
        <div className="flex items-center justify-between">
          <span className="w-24 text-sm font-semibold text-slate-800">Kegalle</span>
          <div className="flex-1 mx-4 h-4 bg-transparent relative">
             <div className="absolute top-0 left-0 h-full bg-blue-600 rounded-sm" style={{ width: '80%' }}></div>
          </div>
          <span className="w-24 text-right text-xs font-semibold text-slate-600">4 M(34.23%)</span>
        </div>
        
        {/* Galle */}
        <div className="flex items-center justify-between">
          <span className="w-24 text-sm font-semibold text-slate-800">Galle</span>
          <div className="flex-1 mx-4 h-4 bg-transparent relative">
             <div className="absolute top-0 left-0 h-full bg-blue-600 rounded-sm" style={{ width: '45%' }}></div>
          </div>
          <span className="w-24 text-right text-xs font-semibold text-slate-600">2.3 M(12.28%)</span>
        </div>
        
        {/* Kandy */}
        <div className="flex items-center justify-between">
          <span className="w-24 text-sm font-semibold text-slate-800">Kandy</span>
          <div className="flex-1 mx-4 h-4 bg-transparent relative">
             <div className="absolute top-0 left-0 h-full bg-blue-600 rounded-sm" style={{ width: '55%' }}></div>
          </div>
          <span className="w-24 text-right text-xs font-semibold text-slate-600">2.7 M(14.23%)</span>
        </div>
        
        {/* Jaffna */}
        <div className="flex items-center justify-between">
          <span className="w-24 text-sm font-semibold text-slate-800">Jaffna</span>
          <div className="flex-1 mx-4 h-4 bg-transparent relative">
             <div className="absolute top-0 left-0 h-full bg-blue-600 rounded-sm" style={{ width: '40%' }}></div>
          </div>
          <span className="w-24 text-right text-xs font-semibold text-slate-600">2 M(9.02%)</span>
        </div>
        
        {/* Colombo */}
        <div className="flex items-center justify-between">
          <span className="w-24 text-sm font-semibold text-slate-800">Colombo</span>
          <div className="flex-1 mx-4 h-4 bg-transparent relative">
             <div className="absolute top-0 left-0 h-full bg-blue-600 rounded-sm" style={{ width: '60%' }}></div>
          </div>
          <span className="w-24 text-right text-xs font-semibold text-slate-600">3 M(24.23%)</span>
        </div>
      </div>

      {/* X Axis scale */}
      <div className="flex justify-between items-center ml-[100px] mr-[100px] text-xs font-semibold text-slate-500 absolute bottom-4 left-6 right-6">
        <span>0</span>
        <span>1M</span>
        <span>2M</span>
        <span>3M</span>
        <span>4M</span>
      </div>
    </div>
  );
};

export default SalesTerritoryChart;
