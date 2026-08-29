import { FiDollarSign, FiCreditCard, FiTruck, FiTrendingUp, FiCheck, FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";

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

  const totalFlow = actualDriverCash + creditAmount;
  const cashPct = totalFlow > 0 ? Math.round((actualDriverCash / totalFlow) * 100) : 100;
  const creditPct = totalFlow > 0 ? 100 - cashPct : 0;

  return (
    <div className="h-full bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between gap-3 border-b border-slate-50 pb-4">
          <div>
            <h2 className="font-bold text-slate-800 text-base leading-tight">Today Storefront Payments</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Payment & driver collection breakdown</p>
          </div>
          <div className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-blue-600 text-xs font-bold shrink-0">
            {transactionCount} txns
          </div>
        </div>

        {/* Payment Outflow Cards */}
        <div className="mt-5 space-y-3">
          {/* Total Driver Cash Outflow Card */}
          <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100/70 p-4">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-emerald-200/50 flex items-center justify-center text-emerald-700">
                  <FiTruck size={12} />
                </div>
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Driver Cash Outflow</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
                Cash at Delivery
              </span>
            </div>
            <p className="text-xl font-black text-emerald-800 mt-1">Rs. {fmt(actualDriverCash)}</p>
            
            <div className="mt-3 pt-2.5 border-t border-emerald-200/60 space-y-1.5 text-xs font-semibold text-emerald-900">
              <div className="flex justify-between items-center">
                <span className="text-emerald-700/90 font-medium">Order Cash (COD):</span>
                <span className="font-bold">Rs. {fmt(actualOrderCash)}</span>
              </div>
              {actualOutstanding > 0 ? (
                <div className="flex justify-between items-center text-amber-900 font-bold bg-amber-100/40 px-2 py-0.5 rounded-lg">
                  <span>+ Settled Debt in Cash:</span>
                  <span>Rs. {fmt(actualOutstanding)}</span>
                </div>
              ) : (
                <div className="flex justify-between items-center text-emerald-600/70 text-[11px] font-medium">
                  <span>Prior Debt Settled:</span>
                  <span>Rs. 0.00</span>
                </div>
              )}
            </div>
          </div>

          {/* 2-Col Breakdown: Credit Borrowed & Gross Volume */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-amber-50/50 border border-amber-100/70 p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">New Credit</p>
                <div className="w-5 h-5 rounded-md bg-amber-200/50 flex items-center justify-center text-amber-700">
                  <FiCreditCard size={11} />
                </div>
              </div>
              <p className="text-base font-black text-amber-800">Rs. {fmt(creditAmount)}</p>
              <p className="text-[10px] text-amber-600 font-medium mt-1">Added to ledger</p>
            </div>

            <div className="rounded-2xl bg-blue-50/50 border border-blue-100/70 p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Order Volume</p>
                <div className="w-5 h-5 rounded-md bg-blue-200/50 flex items-center justify-center text-blue-700">
                  <FiTrendingUp size={11} />
                </div>
              </div>
              <p className="text-base font-black text-blue-800">Rs. {fmt(actualTotalOrder)}</p>
              <p className="text-[10px] text-blue-600 font-medium mt-1">Total goods ordered</p>
            </div>
          </div>

          {/* Today's Cash vs Credit Ratio Bar */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-700 mb-1.5">
              <span>Cash Flow Channels</span>
              <span className="text-slate-500 font-semibold">{cashPct}% Cash / {creditPct}% Credit</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200/60 overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${cashPct}%` }}
                title={`Cash: ${cashPct}%`}
              />
              <div
                className="bg-amber-500 h-full transition-all duration-500"
                style={{ width: `${creditPct}%` }}
                title={`Credit: ${creditPct}%`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info Strip */}
      <div className="mt-6 pt-4 border-t border-slate-50">
        <Link
          to="/payments"
          className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-700 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FiCheck size={14} className="text-emerald-600" />
            <span>Storefront Cash Reconciled</span>
          </div>
          <div className="flex items-center gap-1 text-blue-600">
            <span>View Ledger</span>
            <FiArrowUpRight size={14} />
          </div>
        </Link>
      </div>
    </div>
  );
}
