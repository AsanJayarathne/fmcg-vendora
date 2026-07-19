export default function RecentOrdersTable({ orders }) {
  return (
    <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
        <button className="text-xs font-semibold text-blue-600">View All</button>
      </div>

      <table className="w-full text-sm text-left border-collapse">
        <thead className="border-b border-gray-200 bg-gray-50/50">
          <tr>
            <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Retailer</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-2.5 font-mono font-semibold text-gray-900">#{order.id}</td>
              <td className="px-4 py-2.5 text-gray-700">{order.retailer}</td>
              <td className="px-4 py-2.5 text-right text-gray-900 font-semibold">LKR {order.amount}</td>
              <td className="px-4 py-2.5 text-center">
                <span className={`px-3 py-1 text-[10px] font-semibold rounded-full ${getStatusStyle(order.status)}`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getStatusStyle(status) {
  if (status === "Delivered") return "text-green-600 bg-green-100";
  if (status === "Pending") return "text-yellow-600 bg-yellow-100";
  if (status === "Processing") return "text-blue-600 bg-blue-100";
  return "text-red-600 bg-red-100";
}