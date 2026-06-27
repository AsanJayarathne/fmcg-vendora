import React from 'react';

const StatCard = () => (
  <div className="bg-[#eef2fc] rounded-2xl p-6 flex items-center gap-6">
    <div className="w-16 h-16 rounded-full bg-blue-300 flex items-center justify-center text-blue-600">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        <circle cx="8.5" cy="14.5" r="1.5"></circle>
        <circle cx="15.5" cy="14.5" r="1.5"></circle>
      </svg>
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-bold text-slate-800">Active Distributors</span>
      <span className="text-3xl font-bold text-slate-900 mt-1">200</span>
      <span className="text-xs font-medium text-slate-500 mt-1">This Month</span>
    </div>
  </div>
);

const DistributorStatCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard />
      <StatCard />
      <StatCard />
      <StatCard />
    </div>
  );
};

export default DistributorStatCards;
