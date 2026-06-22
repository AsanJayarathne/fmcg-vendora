function JobCard({ job, onClaim }) {
  return (
    <div className="bg-orange-50 rounded-2xl p-4 flex flex-col gap-3">
      
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-300 to-red-400" />

      {/* Store Info */}
      <div>
        <div className="text-sm font-bold text-gray-900">{job.store}</div>
        <div className="text-xs text-gray-400 mt-0.5">{job.address}</div>
      </div>

      {/* Order ID */}
      <div className="text-2xl font-bold text-gray-900">{job.orderId}</div>

      {/* Weight and Items pills */}
      <div className="flex items-center gap-2">
        <span className="text-xs px-3 py-1 rounded-full border border-gray-200 bg-white text-gray-600">
          {job.weight}
        </span>
        <span className="text-xs px-3 py-1 rounded-full border border-gray-200 bg-white text-gray-600">
          {job.items}
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-orange-100" />

      {/* Distance and Button */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-gray-900">{job.distance}</div>
          <div className="text-xs text-gray-400">Distance</div>
        </div>
        {job.status === 'Available' ? (
          <button
            onClick={onClaim}
            className="text-xs px-4 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-all font-medium"
          >
            Take Order
          </button>
        ) : (
          <span className="text-xs px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium">
            Claimed ✓
          </span>
        )}
      </div>

    </div>
  );
}

export default JobCard;