export default function CreditOverview({ data = {} }) {
  const limit = Number(data.limit ?? 0);
  const used = Number(data.used ?? 0);
  const available = Number(data.available ?? 0);
  const usedPercent = Number(data.usedPercent ?? (limit ? (used / limit) * 100 : 0));

  return (
    <div className="h-full w-full rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Credit Overview</h2>
          <p className="text-sm text-slate-500">Current balance and usage</p>
        </div>
        <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
          {usedPercent.toFixed(0)}% used
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Credit Limit</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">Rs. {limit.toLocaleString()}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-amber-50 p-4">
            <p className="text-sm text-slate-500">Used</p>
            <p className="mt-1 text-xl font-semibold text-amber-700">Rs. {used.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-emerald-50 p-4">
            <p className="text-sm text-slate-500">Available</p>
            <p className="mt-1 text-xl font-semibold text-emerald-700">Rs. {available.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
          <span>Usage progress</span>
          <span>{usedPercent.toFixed(0)}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{ width: `${Math.min(100, Math.max(0, usedPercent))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
