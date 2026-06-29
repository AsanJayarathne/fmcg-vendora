export default function OrdersTable({ orders }) {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="px-6 py-4">Order ID</th>
            <th className="px-6 py-4">Retailer</th>
            <th className="px-6 py-4">Order Date</th>
            <th className="px-6 py-4">Total Amount(LKR)</th>
            <th className="px-6 py-4">Payment</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                className="px-6 py-8 text-center text-gray-500"
              >
                No orders found
              </td>
            </tr>
          ) : (
            orders.map((order, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="px-6 py-3">{order.id}</td>

                <td className="px-6 py-3">{order.retailer}</td>

                <td className="px-6 py-3">
                  <p>{order.date}</p>
                  <p className="text-[10px] text-gray-500">{order.time}</p>
                </td>

                <td className="px-6 py-3">{order.amount}</td>

                <td className={`px-6 py-3 ${getPaymentColor(order.payment)}`}>
                  {order.payment}
                </td>

                <td className={`px-6 py-3 ${getStatusColor(order.status)}`}>
                  {order.status}
                </td>

                <td className="px-6 py-3">
                  <button className="px-5 py-1 text-xs font-semibold border border-gray-300 rounded-md text-sky-500">
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function getPaymentColor(payment) {
  if (payment === "cash") return "text-green-500";
  if (payment === "credit") return "text-red-500";
  return "text-green-500";
}

function getStatusColor(status) {
  if (status === "Delivered") return "text-green-500";
  if (status === "Pending Approval") return "text-yellow-500";
  if (status === "Processing") return "text-blue-500";
  if (status === "Cancelled") return "text-red-500";
  return "text-gray-500";
}