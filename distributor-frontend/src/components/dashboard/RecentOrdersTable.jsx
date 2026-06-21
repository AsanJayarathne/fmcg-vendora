export default function RecentOrdersTable({ orders }) {
  return (
    <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
        <button className="text-xs font-semibold text-blue-600">View All</button>
      </div>

      <table className="w-full text-xs text-left">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="py-3">Order ID</th>
            <th>Retailer</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-gray-100">
              <td className="py-3 font-semibold">{order.id}</td>
              <td>{order.retailer}</td>
              <td>LKR {order.amount}</td>
              <td>
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