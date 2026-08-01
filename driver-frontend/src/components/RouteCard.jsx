import { HandCoins, CreditCard, AlertTriangle, MapPin, Package, Check, X } from 'lucide-react';
import StatusBadge from './StatusBadge';

function RouteCard({ store, items, paymentType, address, amount, status, onDeliver, onReturn,
  cashAmount, creditAmount, outstandingCredit, totalCollectible }) {

  const hasOutstanding = outstandingCredit > 0;
  const hasCreditPortion = creditAmount > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 space-y-4">
      {/* Top Row: Store & Action Buttons */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm shadow-sm flex-shrink-0">
            {store ? store[0]?.toUpperCase() : 'S'}
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-800 leading-tight">{store}</h4>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              <Package size={13} className="text-slate-400" />
              <span>Items: <strong className="text-orange-600 font-semibold">{items}</strong></span>
            </div>
          </div>
        </div>

        {/* Status / Action Buttons */}
        {status === 'Pending' ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onDeliver}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all cursor-pointer shadow-sm shadow-emerald-600/20 active:scale-[0.98]"
            >
              <Check size={14} />
              Deliver Order
            </button>
            <button
              onClick={onReturn}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/80 hover:bg-rose-100 transition-all cursor-pointer active:scale-[0.98]"
            >
              <X size={14} />
              Return
            </button>
          </div>
        ) : (
          <StatusBadge status={status} />
        )}
      </div>

      {/* Details Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 bg-slate-50/70 rounded-xl border border-slate-100 text-xs">
        <div>
          <span className="text-slate-400 font-medium block mb-0.5 flex items-center gap-1">
            <MapPin size={12} className="text-slate-400" /> Delivery Address
          </span>
          <span className="font-semibold text-slate-700 leading-snug block">{address}</span>
        </div>

        <div>
          <span className="text-slate-400 font-medium block mb-0.5">Payment Method</span>
          <span className="font-semibold text-slate-700">{paymentType}</span>
        </div>

        <div>
          <span className="text-slate-400 font-medium block mb-0.5">Order Amount</span>
          <span className="font-extrabold text-slate-900 text-sm text-orange-600">{amount}</span>
        </div>
      </div>

      {/* Payment Breakdown (if credit or split) */}
      {(hasCreditPortion || hasOutstanding) && (
        <div className="bg-orange-50/60 border border-orange-100/80 rounded-xl p-3.5 space-y-2 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {hasCreditPortion && (
              <div className="flex items-center gap-2 text-purple-700 font-medium bg-white/80 px-3 py-1.5 rounded-lg border border-purple-100">
                <CreditCard size={14} className="text-purple-600" />
                <span>Credit Portion: <strong>Rs. {creditAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
              </div>
            )}
            {cashAmount > 0 && (
              <div className="flex items-center gap-2 text-emerald-700 font-medium bg-white/80 px-3 py-1.5 rounded-lg border border-emerald-100">
                <HandCoins size={14} className="text-emerald-600" />
                <span>Cash Portion: <strong>Rs. {cashAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
              </div>
            )}
            {hasOutstanding && (
              <div className="flex items-center gap-2 text-rose-700 font-medium bg-white/80 px-3 py-1.5 rounded-lg border border-rose-100 sm:col-span-2">
                <AlertTriangle size={14} className="text-rose-600" />
                <span>Outstanding Credit: <strong>Rs. {outstandingCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
              </div>
            )}
          </div>
          <div className="border-t border-orange-200/50 pt-2 flex items-center justify-between text-sm font-bold text-slate-900">
            <span className="flex items-center gap-1 text-slate-700">💰 Total Collectible by Driver:</span>
            <span className="text-orange-600 text-base font-extrabold">Rs. {totalCollectible.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default RouteCard;