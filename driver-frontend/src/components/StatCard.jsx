import { TrendingUp, TrendingDown } from 'lucide-react';

function StatCard({ label, value, icon: Icon, percentage, percentageUp }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        {Icon && (
          <div className="w-11 h-11 rounded-xl bg-orange-50/80 border border-orange-100 flex items-center justify-center text-orange-600">
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight">{value}</div>
        {percentage && (
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-xs font-semibold ${
              percentageUp ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
            }`}>
              {percentageUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {percentage}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">vs last shift</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;