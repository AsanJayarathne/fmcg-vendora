export default function CreditOverview({ data = {} }) {
  const limit = Number(data.limit ?? 0);
  const used = Number(data.used ?? 0);
  const available = Number(data.available ?? 0);
  const usedPercent = Number(data.usedPercent ?? (limit ? (used / limit) * 100 : 0));

  const fmt = (val) => 
    Number(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="h-full w-full rounded-3xl bg-white p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-800 text-base leading-tight">Credit Overview</h2>
          <p className="text-xs text-slate-400 font-normal mt-0.5">Current balance and usage</p>
        </div>
        <div className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-blue-600 text-xs font-medium">
          {usedPercent.toFixed(0)}% used
        </div>
      </div>

      <div className="mt-5 space-y-3 flex-1 flex flex-col justify-center">
        <div className="rounded-2xl border border-blue-100/50 bg-blue-50/40 p-4">
          <p className="text-[10px] font-semibold text-blue-600/70 uppercase tracking-wider mb-1">Credit Limit</p>
          <p className="text-xl font-bold text-blue-700">Rs. {fmt(limit)}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-amber-50/40 p-4">
            <p className="text-[10px] font-semibold text-amber-600/70 uppercase tracking-wider mb-1">Used</p>
            <p className="text-lg font-bold text-amber-700">Rs. {fmt(used)}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-green-50/40 p-4">
            <p className="text-[10px] font-semibold text-green-600/70 uppercase tracking-wider mb-1">Available</p>
            <p className="text-lg font-bold text-green-700">Rs. {fmt(available)}</p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Usage progress</span>
          <span>{usedPercent.toFixed(0)}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{ width: `${Math.min(100, Math.max(0, usedPercent))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
