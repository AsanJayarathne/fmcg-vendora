export default function DeliveryTable({ deliveries }) {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="border-b border-gray-200 bg-gray-50/75">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivery ID</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Driver</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Retailer</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Total Amount (LKR)</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Collected Amount</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {deliveries.map((delivery, index) => (
            <tr key={index} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-3.5 font-mono font-semibold text-gray-900">{delivery.deliveryId}</td>
              <td className="px-6 py-3.5 font-mono text-gray-700">#{delivery.orderId}</td>
              <td className="px-6 py-3.5 font-medium text-gray-900">{delivery.driver}</td>
              <td className="px-6 py-3.5 text-gray-700">{delivery.retailer}</td>
              <td className="px-6 py-3.5 text-right font-semibold text-gray-950">{delivery.totalAmount}</td>
              <td className="px-6 py-3.5 text-right font-semibold text-gray-900">{delivery.collectedAmount}</td>

              <td className={`px-6 py-3.5 font-semibold ${getPaymentColor(delivery.payment)}`}>
                <span className="capitalize">{delivery.payment}</span>
              </td>

              <td className={`px-6 py-3.5 font-semibold ${getStatusColor(delivery.status)}`}>
                {delivery.status}
              </td>

              <td className="px-6 py-3.5 text-center">
                <button className="px-6 py-1 text-[10px] font-semibold text-sky-500 border border-gray-300 rounded-md hover:bg-sky-50 transition-colors">
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

function getPaymentColor(payment) {
  if (payment === "cash") return "text-green-500";
  if (payment === "credit") return "text-red-500";
  if (payment === "Partial") return "text-purple-500";
  return "text-gray-700";
}

function getStatusColor(status) {
  if (status === "Delivered") return "text-green-500";
  if (status === "Returned") return "text-red-500";
  return "text-yellow-500";
}