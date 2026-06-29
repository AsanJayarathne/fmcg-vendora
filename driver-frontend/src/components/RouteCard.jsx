import { HandCoins } from 'lucide-react';

function RouteCard({ store, distance, weight, items, paymentType, address, amount, status, onDeliver, onReturn }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-orange-50 border border-orange-100">

      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
        <HandCoins size={20} className="text-pink-500" />
      </div>

      {/* Store + Weight */}
      <div className="w-52">
        <div className="text-sm font-bold text-gray-900">
          {store} <span className="font-bold">({distance})</span>
        </div>
        <div className="text-xs mt-0.5">
          Weight: <span className="text-orange-500 font-semibold">{weight}</span>
          &nbsp; Items: <span className="text-orange-500 font-semibold">{items}</span>
        </div>
      </div>

      {/* Payment Type */}
      <div className="w-36">
        <div className="text-xs font-semibold text-gray-900 mb-0.5">Payment Type</div>
        <div className="text-xs text-gray-400">{paymentType}</div>
      </div>

      {/* Address */}
      <div className="w-52">
        <div className="text-xs font-semibold text-gray-900 mb-0.5">Address</div>
        <div className="text-xs text-gray-400">{address}</div>
      </div>

      {/* Amount */}
      <div className="w-28">
        <div className="text-xs font-semibold text-gray-900 mb-0.5">Amount</div>
        <div className="text-xs text-orange-500 font-semibold">{amount}</div>
      </div>

      {/* Action Buttons */}
      {status === 'Pending' ? (
        <div className="flex items-center gap-2">
          <button
            onClick={onDeliver}
            className="text-xs px-4 py-2 rounded-full border border-blue-500 text-blue-500 hover:bg-blue-50 transition-all font-medium"
          >
            Delivered
          </button>
          <button
            onClick={onReturn}
            className="text-xs px-4 py-2 rounded-full border border-red-400 text-red-400 hover:bg-red-50 transition-all font-medium"
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
  );
}

export default RouteCard;