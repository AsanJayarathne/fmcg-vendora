export default function TodayStorefrontPayments({
  total,
  cashAmount = 0,
  creditAmount = 0,
  transactionCount = 0,
}) {
  const computedTotal = typeof total === "number" ? total : cashAmount + creditAmount;

  const fmt = (val) => 
    Number(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="h-full bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-black text-slate-800 text-base leading-tight">Today Storefront Payments</h2>
          <p className="text-xs text-slate-400 font-bold mt-0.5">Payment breakdown collected today</p>
        </div>
        <div className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-blue-700 text-xs font-black">
          {transactionCount} txns
        </div>
      </div>

      <div className="mt-6 space-y-3 flex-1 flex flex-col justify-center">
        <div className="rounded-2xl bg-blue-50/40 border border-blue-100/50 p-4">
          <p className="text-[10px] font-black text-blue-600/70 uppercase tracking-wider mb-1">Total</p>
          <p className="text-xl font-black text-blue-700">Rs. {fmt(computedTotal)}</p>
        </div>
        <div className="rounded-2xl bg-green-50/40 border border-green-100/50 p-4">
          <p className="text-[10px] font-black text-green-600/70 uppercase tracking-wider mb-1">Cash</p>
          <p className="text-lg font-black text-green-700">Rs. {fmt(cashAmount)}</p>
        </div>
        <div className="rounded-2xl bg-amber-50/40 border border-amber-100/50 p-4">
          <p className="text-[10px] font-black text-amber-600/70 uppercase tracking-wider mb-1">Credit</p>
          <p className="text-lg font-black text-amber-700">Rs. {fmt(creditAmount)}</p>
        </div>
      </div>
    </div>
  );
}
