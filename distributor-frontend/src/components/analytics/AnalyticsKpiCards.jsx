export default function AnalyticsKpiCards({ kpis }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((item) => (
        <div
          key={item.title}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {item.title}
            </p>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
              {item.value}
            </h3>
            <p className={`text-xs font-medium ${item.changeColor || "text-slate-400"}`}>
              {item.change}
            </p>
          </div>

          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.iconBg || "bg-blue-50"} ${item.iconColor || "text-blue-600"}`}
          >
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
}