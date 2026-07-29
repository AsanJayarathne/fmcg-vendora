export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  color = "blue",
}) {
  const iconStyleMap = {
    blue:   "bg-blue-50 border border-blue-100 text-blue-600",
    amber:  "bg-amber-50 border border-amber-100 text-amber-600",
    yellow: "bg-amber-50 border border-amber-100 text-amber-600",
    red:    "bg-rose-50 border border-rose-100 text-rose-600",
    purple: "bg-purple-50 border border-purple-100 text-purple-600",
    emerald:"bg-emerald-50 border border-emerald-100 text-emerald-600",
  };

  const iconClasses = iconStyleMap[color] || "bg-blue-50 border border-blue-100 text-blue-600";

  return (
    <div className="bg-white border border-slate-100 shadow-xs p-5 rounded-3xl flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      {/* Icon container */}
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconClasses}`}>
        {icon}
      </div>

      {/* Content details */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          {title}
        </p>
        <h2 className="text-2xl font-bold text-slate-800 leading-tight">
          {value}
        </h2>
        {subtitle && (
          <p className="text-xs font-medium text-slate-400 mt-1 leading-none">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}