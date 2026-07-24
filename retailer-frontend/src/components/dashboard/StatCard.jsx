import { useEffect, useState } from "react";

export default function StatCard({ title, value, color = "blue", subtitle, icon }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  const colorIconBg = {
    blue:   "bg-blue-50 border border-blue-100 text-blue-600",
    green:  "bg-green-50 border border-green-150/40 text-green-600",
    orange: "bg-amber-50 border border-amber-150/40 text-amber-600",
    purple: "bg-purple-50 border border-purple-150/40 text-purple-600",
    red:    "bg-red-50 border border-red-150/40 text-red-650",
    gray:   "bg-slate-50 border border-slate-150/50 text-slate-600",
  };

  return (
    <div
      className={`p-5 bg-white border border-slate-100 shadow-xs rounded-3xl transform transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-0.5 ${
        mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
            {title}
          </p>
          <div className="text-2xl font-black text-slate-800 leading-tight">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs font-bold text-slate-500 mt-1 leading-none">
              {subtitle}
            </p>
          )}
        </div>

        {/* Icon */}
        {icon && (
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${colorIconBg[color] || colorIconBg.blue}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}