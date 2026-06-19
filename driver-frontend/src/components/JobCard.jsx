import { Truck, CheckCircle } from 'lucide-react';

function JobCard({ route, items, amount, distance, status, onClaim }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
          <Truck size={18} className="text-purple-600" />
        </div>
        <div>
          <div className="text-sm font-medium text-gray-800">{route}</div>
          <div className="text-xs text-gray-400 mt-0.5">
            {items} items · {amount}{distance ? ` · ${distance}` : ''}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {status === 'Available' ? (
          <button
            onClick={onClaim}
            className="text-xs px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-all"
          >
            Claim route
          </button>
        ) : (
          <span className="text-xs px-4 py-2 rounded-full bg-green-100 text-green-700 flex items-center gap-1.5">
            <CheckCircle size={13} /> Claimed
          </span>
        )}
      </div>
    </div>
  );
}

export default JobCard;