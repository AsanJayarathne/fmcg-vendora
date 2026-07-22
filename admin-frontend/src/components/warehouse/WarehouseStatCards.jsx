import React from 'react';
import { Package, Boxes, AlertTriangle, Clock } from 'lucide-react';

const cards = [
  {
    key: 'total_skus',
    label: 'Total SKUs',
    icon: Package,
    color: 'blue',
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-100',
  },
  {
    key: 'total_units',
    label: 'Total Units',
    icon: Boxes,
    color: 'emerald',
    gradient: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'border-emerald-100',
  },
  {
    key: 'low_stock_count',
    label: 'Low Stock Products',
    icon: AlertTriangle,
    color: 'amber',
    gradient: 'from-amber-500 to-amber-600',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-100',
  },
  {
    key: 'expiring_soon_count',
    label: 'Expiring ≤ 30 Days',
    icon: Clock,
    color: 'rose',
    gradient: 'from-rose-500 to-rose-600',
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-100',
  },
];

const WarehouseStatCards = ({ summary, loading }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map(({ key, label, icon: Icon, bg, text, border, gradient }) => (
        <div
          key={key}
          className={`relative bg-white border ${border} rounded-2xl p-5 flex items-center gap-4 shadow-sm overflow-hidden group hover:shadow-md transition-shadow`}
        >
          {/* background glow */}
          <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-15 transition-opacity`} />
          <div className={`${bg} ${text} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon size={22} strokeWidth={2} />
          </div>
          <div className="min-w-0">
            {loading ? (
              <div className="h-6 w-16 bg-slate-200 rounded animate-pulse mb-1" />
            ) : (
              <div className={`text-2xl font-bold ${text}`}>
                {Number(summary?.[key] ?? 0).toLocaleString()}
              </div>
            )}
            <div className="text-xs font-semibold text-slate-500 leading-tight mt-0.5">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WarehouseStatCards;
