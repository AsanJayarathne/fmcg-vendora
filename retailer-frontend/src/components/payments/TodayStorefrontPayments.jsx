export default function TodayStorefrontPayments({
  orderCash = 0,
  outstandingSettled = 0,
  totalDriverCash,
  creditAmount = 0,
  totalOrderValue,
  transactionCount = 0,
  cashAmount,
  total,
}) {
  const actualOrderCash = typeof orderCash === "number" && (orderCash > 0 || !cashAmount) ? orderCash : (cashAmount ?? 0);
  const actualOutstanding = Number(outstandingSettled ?? 0);
  const actualDriverCash = typeof totalDriverCash === "number" ? totalDriverCash : (actualOrderCash + actualOutstanding);
  const actualTotalOrder = typeof totalOrderValue === "number" ? totalOrderValue : (typeof total === "number" ? total : actualOrderCash + creditAmount);

  const fmt = (val) => 
    Number(val || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="h-full bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-800 text-base leading-tight">Today Storefront Payments</h2>
          <p className="text-xs text-slate-400 font-normal mt-0.5">Payment & driver collection breakdown</p>
        </div>
        <div className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-blue-600 text-xs font-medium">
          {transactionCount} txns
        </div>
      </div>

      <div className="mt-5 space-y-3 flex-1 flex flex-col justify-center">
        {/* Total Driver Cash Outflow Card */}
        <div className="rounded-2xl bg-emerald-50/50 border border-emerald-100/60 p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Total Driver Cash Outflow</p>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/60 px-2 py-0.5 rounded-full">Cash at Delivery</span>
          </div>
          <p className="text-xl font-black text-emerald-700">Rs. {fmt(actualDriverCash)}</p>
          
          <div className="mt-2.5 pt-2 border-t border-emerald-200/50 space-y-1 text-xs font-semibold text-emerald-800">
            <div className="flex justify-between">
              <span className="text-emerald-700/80">Order Cash:</span>
              <span>Rs. {fmt(actualOrderCash)}</span>
            </div>
            {actualOutstanding > 0 && (
              <div className="flex justify-between text-amber-800 font-bold">
                <span>+ Outstanding Settled in Cash:</span>
                <span>Rs. {fmt(actualOutstanding)}</span>
              </div>
            )}
          </div>
        </div>

        {/* New Credit Borrowed Card */}
        <div className="rounded-2xl bg-amber-50/40 border border-amber-100/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-0.5">New Credit Borrowed</p>
              <p className="text-lg font-black text-amber-700">Rs. {fmt(creditAmount)}</p>
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-full">Credit Ledger</span>
          </div>
        </div>

        {/* Today's Order Value summary */}
        <div className="rounded-2xl bg-blue-50/40 border border-blue-100/50 px-4 py-2.5 flex items-center justify-between">
          <p className="text-[11px] font-bold text-blue-800">Today's Orders Total Volume:</p>
          <p className="text-xs font-black text-blue-700">Rs. {fmt(actualTotalOrder)}</p>
        </div>
      </div>
    </div>
  );
}
