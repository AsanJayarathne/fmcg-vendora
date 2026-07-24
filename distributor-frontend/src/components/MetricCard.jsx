export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  bgColor = "bg-white",
  iconBg = "bg-slate-50",
}) {
  return (
    <div className="bg-white border border-slate-100 shadow-xs p-5 rounded-3xl flex items-center gap-4 transition-all duration-300 hover:shadow-md">
      {/* Icon container */}
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>

      {/* Content details */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
          {title}
        </p>
        <h2 className="text-2xl font-black text-slate-800 leading-tight">
          {value}
        </h2>
        <p className="text-xs font-bold text-slate-500 mt-0.5 leading-none">
          {subtitle}
        </p>
      </div>
    </div>
  );
}