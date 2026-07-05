function CreditStatsCards({ data }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">

      <h2 className="text-xl font-bold mb-4">
        Credit Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="p-4 border rounded-lg">
          <p className="text-gray-500">Credit Limit</p>
          <p className="font-bold">Rs. {data.limit}</p>
        </div>

        <div className="p-4 border rounded-lg">
          <p className="text-gray-500">Used Credit</p>
          <p className="font-bold text-red-500">Rs. {data.used}</p>
        </div>

        <div className="p-4 border rounded-lg">
          <p className="text-gray-500">Available Credit</p>
          <p className="font-bold text-green-500">Rs. {data.available}</p>
        </div>

      </div>

      <div className="mt-6">
        <div className="flex justify-between text-sm mb-1">
          <span>Usage</span>
          <span>{data.usedPercent}%</span>
        </div>

        <div className="w-full bg-gray-200 h-3 rounded-full">
          <div
            className="bg-blue-600 h-3 rounded-full"
            style={{ width: `${data.usedPercent}%` }}
          />
        </div>
      </div>

    </div>
  );
}

export default CreditStatsCards;