import { Download } from "lucide-react";

const orders = [
  {
    id: "ORD-001",
    retailer: "Star Grocery Store",
    orderDate: "20 May 2026",
    time: "10.45 A.M",
    amount: "15,000.00",
    deliveryDate: "18 May 2026",
    payment: "cash",
    status: "Delivered",
  },
  {
    id: "ORD-002",
    retailer: "Asan Grocery Store",
    orderDate: "19 May 2026",
    time: "10.05 A.M",
    amount: "31,340.00",
    deliveryDate: "20 May 2026",
    payment: "credit",
    status: "Delivered",
  },
  {
    id: "ORD-003",
    retailer: "New Grocery Store",
    orderDate: "18 May 2026",
    time: "08.45 P.M",
    amount: "10,000.00",
    deliveryDate: "20 May 2026",
    payment: "Partial",
    status: "Delivered",
  },
  {
    id: "ORD-004",
    retailer: "Green Super",
    orderDate: "20 May 2026",
    time: "11.25 A.M",
    amount: "15,000.00",
    deliveryDate: "20 May 2026",
    payment: "---",
    status: "Returned",
  },
];

export default function OrderHistoryTable() {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              Order ID
            </th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              Retailer
            </th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              Order Date
            </th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              Total Amount (LKR)
            </th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              Delivery Date
            </th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              Payment
            </th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              Status
            </th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="px-6 py-4 text-sm font-medium text-gray-800">
                {order.id}
              </td>

              <td className="px-6 py-4 text-sm font-medium text-gray-800">
                {order.retailer}
              </td>

              <td className="px-6 py-4">
                <p className="text-sm font-medium text-gray-800">
                  {order.orderDate}
                </p>
                <p className="text-xs text-gray-500">{order.time}</p>
              </td>

              <td className="px-6 py-4 text-sm font-medium text-gray-800">
                {order.amount}
              </td>

              <td className="px-6 py-4 text-sm font-medium text-gray-800">
                {order.deliveryDate}
              </td>

              <td
                className={`px-6 py-4 text-sm font-medium ${
                  order.payment === "cash"
                    ? "text-green-600"
                    : order.payment === "credit"
                    ? "text-red-500"
                    : order.payment === "Partial"
                    ? "text-purple-500"
                    : "text-gray-500"
                }`}
              >
                {order.payment}
              </td>

              <td
                className={`px-6 py-4 text-sm font-semibold ${
                  order.status === "Delivered"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {order.status}
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button className="px-5 py-2 text-sm font-medium border border-gray-300 rounded-md text-sky-500 hover:bg-sky-50">
                    View
                  </button>

                  <button className="p-2 border border-gray-300 rounded-md text-sky-500 hover:bg-sky-50">
                    <Download size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}