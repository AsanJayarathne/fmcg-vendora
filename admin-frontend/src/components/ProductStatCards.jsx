import React from 'react';
import StatCard from './StatCard';

const ProductStatCards = ({ total = 0, active = 0, lowStock = 0, loading = false }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
      <StatCard
        title="Total Products"
        value={total.toLocaleString()}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#0228e3]">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        }
        bgColor="bg-[#DCE1F0]"
        iconBg="bg-[#5BDAF2]"
        subtitle="All Registered Products"
        loading={loading}
      />
      <StatCard
        title="Active Listings"
        value={active.toLocaleString()}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#02b33c]">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        }
        bgColor="bg-[#E8F9EC]"
        iconBg="bg-[#A8F0B8]"
        subtitle="Active & Available"
        loading={loading}
      />
      <StatCard
        title="Low Stock Alerts"
        value={lowStock.toLocaleString()}
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#e30202]">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        }
        bgColor="bg-[#FFE4E4]"
        iconBg="bg-[#FFB4B4]"
        subtitle="Need Restock Soon"
        loading={loading}
      />
    </div>
  );
};

export default ProductStatCards;
