import React from 'react';

const icons = {
  total: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0228e3]">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  pending: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#e3a002]">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  approved: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#02e302]">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  blocked: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#e30202]">
      <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
    </svg>
  ),
};

const StatCard = ({ label, value, icon, bgColor, iconBg, loading, subtitle }) => (
  <div className={`${bgColor} rounded-2xl p-5 flex items-center gap-4 shadow-sm transition-transform hover:-translate-y-0.5`}>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-semibold text-gray-700">{label}</h4>
      {loading ? (
        <div className="h-8 w-16 bg-black/10 rounded-lg mt-1 animate-pulse" />
      ) : (
        <h2 className="text-2xl font-bold leading-tight text-gray-900">{value}</h2>
      )}
      {subtitle && (
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      )}
    </div>
  </div>
);

const DistributorStatCards = ({ distributors = [], loading }) => {
  const total    = distributors.length;
  const pending  = distributors.filter(d => d.status === 'Pending').length;
  const approved = distributors.filter(d => d.status === 'Approved').length;
  const blocked  = distributors.filter(d => d.status === 'Blocked' || d.status === 'Rejected').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        label="Total Applications"
        value={total}
        icon={icons.total}
        loading={loading}
        bgColor="bg-[#DCE1F0]"
        iconBg="bg-[#5BDAF2]"
        subtitle="All Registered"
      />
      <StatCard
        label="Pending Approval"
        value={pending}
        icon={icons.pending}
        loading={loading}
        bgColor="bg-[#FFFCD6]"
        iconBg="bg-[#FFE365]"
        subtitle="Awaiting Review"
      />
      <StatCard
        label="Active Distributors"
        value={approved}
        icon={icons.approved}
        loading={loading}
        bgColor="bg-[#EBFFE4]"
        iconBg="bg-[#A4FF83]"
        subtitle="Active Accounts"
      />
      <StatCard
        label="Blocked / Rejected"
        value={blocked}
        icon={icons.blocked}
        loading={loading}
        bgColor="bg-[#FFE4E4]"
        iconBg="bg-[#FFA4A4]"
        subtitle="Restricted Access"
      />
    </div>
  );
};

export default DistributorStatCards;
