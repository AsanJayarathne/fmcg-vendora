

export default function RecentOrdersTable({ orders = [] }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm overflow-x-auto">
      <h2 className="font-bold mb-4">Recent Orders</h2>

      <table className="min-w-full text-left border-collapse">
        <thead>
          <tr className="text-sm text-gray-500 border-b">
            <th className="py-3 px-4">Order ID</th>
            <th className="py-3 px-4">Distributor</th>
            <th className="py-3 px-4">Date</th>
            <th className="py-3 px-4">Total</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Payment</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b last:border-b-0">
              <td className="py-4 px-4 text-sm font-medium text-slate-900">{order.id}</td>
              <td className="py-4 px-4 text-sm text-gray-600">{order.distributor}</td>
              <td className="py-4 px-4 text-sm text-gray-600">{order.date}</td>
              <td className="py-4 px-4 text-sm text-gray-900">{order.total}</td>
              <td className="py-4 px-4 text-sm">
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {order.status}
                </span>
              </td>
              <td className="py-4 px-4 text-sm text-gray-600">{order.payment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
  