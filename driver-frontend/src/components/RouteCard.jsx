import { HandCoins, CreditCard, AlertTriangle } from 'lucide-react';

function RouteCard({ store, items, paymentType, address, amount, status, onDeliver, onReturn,
  cashAmount, creditAmount, outstandingCredit, totalCollectible }) {

  const hasOutstanding = outstandingCredit > 0;
  const hasCreditPortion = creditAmount > 0;

  return (
    <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 space-y-3">
      {/* Top Row */}
      <div className="flex items-center justify-between">
        {/* Avatar + Store */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
            <HandCoins size={20} className="text-pink-500" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">{store}</div>
            <div className="text-xs mt-0.5">
              Items: <span className="text-orange-500 font-semibold">{items}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {status === 'Pending' ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onDeliver}
              className="text-xs px-4 py-2 rounded-full border border-blue-500 text-blue-500 hover:bg-blue-50 transition-all font-medium cursor-pointer"
            >
              Delivered
            </button>
            <button
              onClick={onReturn}
              className="text-xs px-4 py-2 rounded-full border border-red-400 text-red-400 hover:bg-red-50 transition-all font-medium cursor-pointer"
            >
              Returned
            </button>
          </div>
        ) : (
          <span className={`text-xs px-4 py-2 rounded-full border font-medium ${
            status === 'Delivered'
              ? 'border-blue-500 text-blue-500'
              : 'border-red-400 text-red-400'
          }`}>
            {status}
          </span>
        )}
      </div>

      {/* Details Row */}
      <div className="flex items-start gap-4 flex-wrap text-xs">
        {/* Address */}
        <div className="flex-1 min-w-[140px]">
          <div className="font-semibold text-gray-900 mb-0.5">Address</div>
          <div className="text-gray-400">{address}</div>
        </div>

        {/* Payment Type */}
        <div className="w-32">
          <div className="font-semibold text-gray-900 mb-0.5">Payment</div>
          <div className="text-gray-400">{paymentType}</div>
        </div>

        {/* Order Amount */}
        <div className="w-28">
          <div className="font-semibold text-gray-900 mb-0.5">Order Amount</div>
          <div className="text-orange-500 font-semibold">{amount}</div>
        </div>
      </div>

      {/* Payment Breakdown (if credit or split) */}
      {(hasCreditPortion || hasOutstanding) && (
        <div className="bg-white/70 border border-orange-200/50 rounded-xl p-3 space-y-1.5 text-xs">
          {hasCreditPortion && (
            <div className="flex items-center gap-1.5 text-purple-700">
              <CreditCard size={12} />
              <span>Credit Portion: <strong>Rs. {creditAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
            </div>
          )}
          {cashAmount > 0 && (
            <div className="flex items-center gap-1.5 text-green-700">
              <HandCoins size={12} />
              <span>Cash Portion: <strong>Rs. {cashAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
            </div>
          )}
          {hasOutstanding && (
            <div className="flex items-center gap-1.5 text-red-600">
              <AlertTriangle size={12} />
              <span>Outstanding Credit: <strong>Rs. {outstandingCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong></span>
            </div>
          )}
          <div className="border-t border-orange-200/50 pt-1.5 mt-1.5">
            <div className="flex items-center justify-between text-sm font-bold text-gray-900">
              <span>💰 Total to Collect:</span>
              <span className="text-orange-600">Rs. {totalCollectible.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RouteCard;