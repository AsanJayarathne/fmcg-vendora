import { useState } from 'react';
import { HandCoins, CreditCard, AlertTriangle, MapPin, Package, Check, X, ChevronDown, ChevronUp, Store } from 'lucide-react';
import StatusBadge from './StatusBadge';

function RouteCard({
  id,
  store,
  items,
  paymentType,
  address,
  amount,
  status,
  onDeliver,
  onReturn,
  cashAmount,
  creditAmount,
  outstandingCredit,
  totalCollectible,
  isUpdating = false
}) {
  const [expanded, setExpanded] = useState(false);

  const hasOutstanding = outstandingCredit > 0;
  const hasCreditPortion = creditAmount > 0;
  const storeInitial = store ? store[0]?.toUpperCase() : 'S';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-orange-200/80 transition-all duration-200 flex flex-col justify-between h-full space-y-3.5 sm:space-y-4">
      
      <div className="space-y-3 sm:space-y-3.5">
        {/* ── Top Bar: Store Header & Status ── */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-center shadow-xs shadow-orange-500/20 shrink-0">
              {storeInitial}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm sm:text-base font-extrabold text-slate-800 leading-tight truncate">{store}</h4>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md inline-block mt-0.5">
                #ORD-{id}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {status !== 'Pending' && <StatusBadge status={status} />}
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-xl border border-slate-200/80 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              title="Toggle Details"
              aria-label="Toggle details"
            >
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>
        </div>

        {/* ── Details Block ── */}
        <div className="bg-slate-50/70 rounded-xl border border-slate-100 p-3 sm:p-3.5 space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-orange-500 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="text-slate-400 text-[10px] sm:text-[11px] font-medium block">Delivery Address</span>
              <span className="font-semibold text-slate-700 leading-snug line-clamp-2">{address}</span>
            </div>
          </div>

          <div className="border-t border-slate-200/50 pt-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Package size={13} className="text-orange-500 shrink-0" />
              <span className="truncate">{items}</span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700 shrink-0">
              {paymentType}
            </span>
          </div>

          <div className="border-t border-slate-200/50 pt-2 flex items-center justify-between">
            <span className="text-slate-500 font-medium text-xs">Total Amount</span>
            <span className="text-xs sm:text-sm font-extrabold text-orange-600">{amount}</span>
          </div>
        </div>

        {/* ── Collectible Breakdown ── */}
        <div className="bg-orange-50/60 border border-orange-100/80 rounded-xl p-3 space-y-2 text-xs">
          {(hasCreditPortion || hasOutstanding) && (
            <div className="space-y-1.5 pb-2 border-b border-orange-200/50">
              {hasCreditPortion && (
                <div className="flex items-center justify-between text-[11px] text-purple-700 bg-white px-2.5 py-1 rounded-md border border-purple-100">
                  <span className="flex items-center gap-1"><CreditCard size={12} /> Credit:</span>
                  <strong>Rs. {creditAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                </div>
              )}
              {cashAmount > 0 && (
                <div className="flex items-center justify-between text-[11px] text-emerald-700 bg-white px-2.5 py-1 rounded-md border border-emerald-100">
                  <span className="flex items-center gap-1"><HandCoins size={12} /> Cash:</span>
                  <strong>Rs. {cashAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                </div>
              )}
              {hasOutstanding && (
                <div className="flex items-center justify-between text-[11px] text-rose-700 bg-white px-2.5 py-1 rounded-md border border-rose-100">
                  <span className="flex items-center gap-1"><AlertTriangle size={12} /> Outstanding:</span>
                  <strong>Rs. {outstandingCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between font-bold text-slate-800 text-xs">
            <span className="text-slate-600">Cash Collectible:</span>
            <span className="text-emerald-700 text-xs sm:text-sm font-extrabold">
              Rs. {totalCollectible.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* ── Expandable Details Panel ── */}
        {expanded && (
          <div className="pt-2 border-t border-slate-100 text-xs space-y-1.5 animate-fadeIn">
            <div className="flex items-center justify-between text-slate-500 font-medium text-[11px]">
              <span className="flex items-center gap-1 truncate pr-2">
                <Store size={12} className="text-orange-500 shrink-0" /> {store}
              </span>
              <span className="shrink-0">Ref: #{id}</span>
            </div>
            <p className="text-[10px] text-slate-400 italic">Verify cash & invoice collection on arrival.</p>
          </div>
        )}
      </div>

      {/* ── Action Buttons Footer ── */}
      {status === 'Pending' && (
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={onDeliver}
            disabled={isUpdating}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white transition-all cursor-pointer shadow-xs shadow-emerald-600/20 disabled:opacity-50"
          >
            <Check size={14} />
            <span>{isUpdating ? 'Saving...' : 'Complete'}</span>
          </button>

          <button
            onClick={onReturn}
            disabled={isUpdating}
            className="flex items-center justify-center gap-1 text-xs font-semibold py-2.5 px-3 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/80 hover:bg-rose-100 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
          >
            <X size={14} />
            <span>Return</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default RouteCard;