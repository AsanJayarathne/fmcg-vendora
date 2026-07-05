export default function RecentOrdersStatus({ orders = [] }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm">
      <h2 className="font-bold mb-4">Status of Recent Orders</h2>

      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
          >
            <div>
              <p className="font-medium">{order.id}</p>
              <p className="text-sm text-gray-500">Updated: {order.updated}</p>
            </div>
            <span
              className={`text-sm font-semibold px-3 py-1 rounded-full ${
                order.status === "Delivered"
                  ? "bg-green-100 text-green-700"
                  : order.status === "Processing"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 