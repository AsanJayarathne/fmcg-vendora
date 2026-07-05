export default function CreditOverview({ data = {} }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <h2 className="font-bold mb-4">Credit Overview</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-gray-500">Credit Limit</p>
          <p className="text-xl font-semibold">Rs. {data.limit ?? 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-gray-500">Used Credit</p>
          <p className="text-xl font-semibold text-red-600">Rs. {data.used ?? 0}</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-gray-500">Available Credit</p>
          <p className="text-xl font-semibold text-green-600">Rs. {data.available ?? 0}</p>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Utilization</span>
          <span>{data.usedPercent ?? 0}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{ width: `${data.usedPercent ?? 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}
