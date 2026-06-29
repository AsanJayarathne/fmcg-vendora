export default function PaymentsTable({ payments }) {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <table className="w-full text-xs">
        <thead className="border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left">Order ID</th>
            <th className="text-left">Retailer</th>
            <th className="text-left">Order Date</th>
            <th className="text-left">Total Amount(LKR)</th>
            <th className="text-left">Paid</th>
            <th className="text-left">Outstanding</th>
            <th className="text-left">Payment Status</th>
            <th className="text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((payment, index) => (
            <tr
              key={index}
              className="border-b border-gray-200"
            >
              <td className="px-6 py-4">
                {payment.orderId}
              </td>

              <td>
                {payment.retailer}
              </td>

              <td>
                <div>
                  <p>{payment.orderDate}</p>
                  <p className="text-[10px] text-gray-400">
                    10:45 AM
                  </p>
                </div>
              </td>

              <td>
                {payment.totalAmount}
              </td>

              <td>
                {payment.paid}
              </td>

              <td>
                {payment.outstanding}
              </td>

              <td
                className={`font-medium ${
                  payment.paymentStatus === "cash"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {payment.paymentStatus}
              </td>

              <td>
                <button className="px-5 py-1 text-[10px] font-semibold text-sky-500 border border-gray-300 rounded-md">
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