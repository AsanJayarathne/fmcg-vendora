export default function OrderStatCard({ icon, label, value, linkText, color = "blue" }) {
  const colorMap = {
    "bg-blue-100 text-blue-700": "bg-blue-50 border border-blue-100 text-blue-600",
    "bg-green-100 text-green-700": "bg-emerald-50 border border-emerald-100 text-emerald-600",
    "bg-red-100 text-red-700": "bg-rose-50 border border-rose-100 text-rose-600",
    "bg-violet-100 text-violet-700": "bg-purple-50 border border-purple-100 text-purple-600",
  };

  const iconStyle = colorMap[color] || "bg-blue-50 border border-blue-100 text-blue-600";

  return (
    <div className="p-5 bg-white border border-slate-100 shadow-xs rounded-3xl transform transition-all duration-300 ease-out hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            {label}
          </p>
          <div className="text-2xl font-bold text-slate-800 leading-tight">
            {value}
          </div>
          {linkText && (
            <p className="text-xs font-medium text-slate-400 mt-1 leading-none">
              {linkText}
            </p>
          )}
        </div>

        {icon && (
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconStyle}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
