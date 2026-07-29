export default function RecentOrdersTable({ orders }) {
  return (
    <div className="p-6 bg-white border border-slate-100 shadow-xs rounded-[32px]">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-base font-black text-slate-800">Recent Orders</h2>
        <button className="text-xs font-bold text-slate-550 hover:text-slate-900 cursor-pointer">View All</button>
      </div>

      <table className="w-full text-sm text-left border-collapse">
        <thead className="border-b border-slate-100 bg-slate-50/50">
          <tr>
            <th className="px-4 py-3 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Order ID</th>
            <th className="px-4 py-3 text-xs font-extrabold text-slate-400 uppercase tracking-wider">Retailer</th>
            <th className="px-4 py-3 text-xs font-extrabold text-slate-400 uppercase tracking-wider text-right">Amount</th>
            <th className="px-4 py-3 text-xs font-extrabold text-slate-400 uppercase tracking-wider text-center">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-2.5 font-mono font-semibold text-gray-900">#{order.id}</td>
              <td className="px-4 py-2.5 text-gray-700">{order.retailer}</td>
              <td className="px-4 py-2.5 text-right text-gray-900 font-semibold">LKR {order.amount}</td>
              <td className="px-4 py-2.5 text-center">
                <span className={`px-3 py-1 text-[10px] font-black border rounded-full ${getStatusStyle(order.status)}`}>
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
  if (status === "Delivered") return "text-green-600 bg-green-50 border border-green-200/50";
  if (status === "Pending") return "text-amber-600 bg-amber-50 border border-amber-200/50";
  if (status === "Processing") return "text-blue-650 bg-blue-50/50 border border-blue-100/50";
  return "text-red-600 bg-red-55/10 border border-red-150/30";
}