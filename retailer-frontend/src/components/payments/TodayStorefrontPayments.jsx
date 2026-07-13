export default function TodayStorefrontPayments({
  total,
  cashAmount = 0,
  creditAmount = 0,
  transactionCount = 0,
}) {
  const computedTotal = typeof total === "number" ? total : cashAmount + creditAmount;

  return (
    <div className="h-full bg-white p-5 rounded-xl shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-bold mb-2">Today Storefront Payments</h2>
          <p className="text-sm text-gray-500">Payment breakdown collected today</p>
        </div>
        <div className="rounded-full bg-blue-50 px-4 py-2 text-blue-700 font-semibold">
          {transactionCount} txns
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-sm text-slate-500">Total</p>
          <p className="text-xl font-bold text-green-600">Rs. {computedTotal.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-emerald-50 p-3">
          <p className="text-sm text-slate-500">Cash</p>
          <p className="text-lg font-semibold text-emerald-700">Rs. {cashAmount.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-amber-50 p-3">
          <p className="text-sm text-slate-500">Credit</p>
          <p className="text-lg font-semibold text-amber-700">Rs. {creditAmount.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
