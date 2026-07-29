export default function AnalyticsCard({ title, subtitle, children, action, icon: Icon }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-slate-800 text-base leading-tight flex items-center gap-2">
            {Icon && <Icon className="text-blue-600 size-4 shrink-0" />}
            <span>{title}</span>
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-400 font-normal mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
      <div className="flex-1 flex flex-col justify-between">{children}</div>
    </div>
  );
}