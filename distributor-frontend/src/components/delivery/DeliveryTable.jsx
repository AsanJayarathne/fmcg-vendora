export default function DeliveryTable({ deliveries }) {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <table className="w-full text-xs text-left">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="px-6 py-4">Delivery ID</th>
            <th>Order ID</th>
            <th>Driver</th>
            <th>Retailer</th>
            <th>Total Amount(LKR)</th>
            <th>Collected Amount</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {deliveries.map((delivery, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="px-6 py-3">{delivery.deliveryId}</td>
              <td>{delivery.orderId}</td>
              <td>{delivery.driver}</td>
              <td>{delivery.retailer}</td>
              <td>{delivery.totalAmount}</td>
              <td>{delivery.collectedAmount}</td>

              <td className={getPaymentColor(delivery.payment)}>
                {delivery.payment}
              </td>

              <td className={getStatusColor(delivery.status)}>
                {delivery.status}
              </td>

              <td>
                <button className="px-6 py-1 text-[10px] font-semibold text-sky-500 border border-gray-300 rounded-md">
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