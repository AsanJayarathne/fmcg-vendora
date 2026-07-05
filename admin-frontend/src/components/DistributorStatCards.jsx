import React from 'react';

const icons = {
  total: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  pending: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  approved: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  blocked: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
    </svg>
  ),
};

const StatCard = ({ label, value, icon, color, loading }) => (
  <div className={`rounded-2xl p-5 flex items-center gap-5 ${color.bg}`}>
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${color.icon}`}>
      {icon}
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
      {loading ? (
        <div className="h-8 w-16 bg-slate-200 rounded-lg mt-1 animate-pulse" />
      ) : (
        <span className={`text-3xl font-extrabold mt-0.5 ${color.text}`}>{value}</span>
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        label="Total Applications"
        value={total}
        icon={icons.total}
        loading={loading}
        color={{ bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-600', text: 'text-blue-700' }}
      />
      <StatCard
        label="Pending Approval"
        value={pending}
        icon={icons.pending}
        loading={loading}
        color={{ bg: 'bg-amber-50', icon: 'bg-amber-100 text-amber-600', text: 'text-amber-700' }}
      />
      <StatCard
        label="Active Distributors"
        value={approved}
        icon={icons.approved}
        loading={loading}
        color={{ bg: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', text: 'text-emerald-700' }}
      />
      <StatCard
        label="Blocked / Rejected"
        value={blocked}
        icon={icons.blocked}
        loading={loading}
        color={{ bg: 'bg-red-50', icon: 'bg-red-100 text-red-500', text: 'text-red-600' }}
      />
    </div>
  );
};

export default DistributorStatCards;
