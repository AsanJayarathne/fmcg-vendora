const orders = [
  {
    id: "ORD-001",
    retailer: "Star Grocery Store",
    date: "20 May 2026",
    time: "10.45 A.M",
    amount: "15,000.00",
    payment: "cash",
    status: "Delivered",
  },
  {
    id: "ORD-001",
    retailer: "Asan Grocery Store",
    date: "19 May 2026",
    time: "10.05 A.M",
    amount: "31,340.00",
    payment: "credit",
    status: "Delivered",
  },
  {
    id: "ORD-001",
    retailer: "New Grocery Store",
    date: "18 May 2026",
    time: "08.45 P.M",
    amount: "10,000.00",
    payment: "---",
    status: "Pending",
  },
  {
    id: "ORD-001",
    retailer: "Green Super",
    date: "20 May 2026",
    time: "11.25 A.M",
    amount: "15,000.00",
    payment: "---",
    status: "Pending",
  },
];

export default function OrdersTable() {
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
          {orders.map((order, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="px-6 py-3">{order.id}</td>

              <td className="px-6 py-3">{order.retailer}</td>

              <td className="px-6 py-3">
                <p>{order.date}</p>
                <p className="text-[10px] text-gray-500">{order.time}</p>
              </td>

              <td className="px-6 py-3">{order.amount}</td>

              <td
                className={`px-6 py-3 ${
                  order.payment === "cash"
                    ? "text-green-500"
                    : order.payment === "credit"
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {order.payment}
              </td>

              <td
                className={`px-6 py-3 ${
                  order.status === "Delivered"
                    ? "text-green-500"
                    : "text-yellow-500"
                }`}
              >
                {order.status}
              </td>

              <td className="px-6 py-3">
                <button className="px-5 py-1 text-xs font-semibold border border-gray-300 rounded-md text-sky-500">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}