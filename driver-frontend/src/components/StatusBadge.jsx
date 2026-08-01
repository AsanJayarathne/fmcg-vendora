function StatusBadge({ status }) {
  const styles = {
    Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dot-emerald-500',
    Returned: 'bg-rose-50 text-rose-700 border-rose-200/60 dot-rose-500',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200/60 dot-amber-500',
    Available: 'bg-indigo-50 text-indigo-700 border-indigo-200/60 dot-indigo-500',
    Claimed: 'bg-orange-50 text-orange-700 border-orange-200/60 dot-orange-500',
  };

  const current = styles[status] || 'bg-slate-100 text-slate-700 border-slate-200 dot-slate-400';
  const dotColor = current.split(' ').find(c => c.startsWith('dot-'))?.replace('dot-', 'bg-') || 'bg-slate-400';

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${current}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
}

export default StatusBadge;