export default function PaymentsTable({ payments }) {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="border-b border-gray-200 bg-gray-50/75">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Retailer</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order Date</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Total Amount (LKR)</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Paid</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Outstanding</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Status</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {payments.length === 0 ? (
            <tr>
              <td colSpan="8" className="px-6 py-10 text-center text-gray-400 text-sm">
                No payment history records found.
              </td>
            </tr>
          ) : (
            payments.map((payment, index) => (
              <tr
                key={index}
              className="hover:bg-gray-50/50 transition-colors"
            >
              <td className="px-6 py-4 font-mono font-semibold text-gray-900">
                #{payment.orderId}
              </td>

              <td className="px-6 py-4 font-medium text-gray-900">
                {payment.retailer}
              </td>

              <td className="px-6 py-4 text-gray-700">
                <div>
                  <p className="font-medium text-gray-800">{payment.orderDate}</p>
                  <p className="text-[10px] text-gray-400">
                    {payment.orderTime || "—"}
                  </p>
                </div>
              </td>

              <td className="px-6 py-4 text-right font-semibold text-gray-950">
                {payment.totalAmount}
              </td>

              <td className="px-6 py-4 text-right text-green-600 font-semibold">
                {payment.paid}
              </td>

              <td className="px-6 py-4 text-right text-red-500 font-semibold">
                {payment.outstanding}
              </td>

              <td
                className={`px-6 py-4 font-semibold ${
                  payment.paymentStatus === "cash"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                <span className="capitalize">{payment.paymentStatus}</span>
              </td>

              <td className="px-6 py-4 text-center">
                <button className="px-5 py-1 text-[10px] font-semibold text-sky-500 border border-gray-300 rounded-md hover:bg-sky-50 transition-colors">
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