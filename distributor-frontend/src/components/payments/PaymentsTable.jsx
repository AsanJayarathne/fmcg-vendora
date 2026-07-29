import { Eye } from "lucide-react";

function PaymentMethodBadge({ method }) {
  const isCash = method === "cash";
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
      isCash
        ? "bg-green-50 text-green-700 border border-green-200/50"
        : "bg-purple-50 text-purple-700 border border-purple-200/50"
    }`}>
      {method}
    </span>
  );
}

function fmtAmount(val) {
  return Number(val || 0).toLocaleString("en-LK", { minimumFractionDigits: 2 });
}

export default function PaymentsTable({ payments, onViewOrder }) {
  return (
    <div className="overflow-hidden bg-white border border-slate-100 rounded-[32px] shadow-xs">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Retailer</th>
              <th className="px-6 py-4">Order Date</th>
              <th className="px-6 py-4 text-right">Total Amount (LKR)</th>
              <th className="px-6 py-4 text-right">Paid</th>
              <th className="px-6 py-4 text-right">Outstanding</th>
              <th className="px-6 py-4">Payment Method</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {payments.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-16 text-center text-slate-400">
                  <p className="text-4xl mb-2">💳</p>
                  <p className="font-bold text-slate-800 text-sm">No payment records found</p>
                  <p className="text-xs text-slate-400">There are no payment records matching your search or filters.</p>
                </td>
              </tr>
            ) : (
              payments.map((payment, index) => (
                <tr key={index} className="hover:bg-slate-50/60 transition duration-150">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onViewOrder?.(payment.rawOrderId)}
                      className="font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      #{payment.orderId}
                    </button>
                  </td>

                  <td className="px-6 py-4 text-slate-800 font-bold">
                    {payment.retailer}
                  </td>

                  <td className="px-6 py-4 text-slate-500 font-medium">
                    <p className="font-semibold text-slate-700">{payment.orderDate}</p>
                    <p className="text-[10px] text-slate-400">{payment.orderTime || "—"}</p>
                  </td>

                  <td className="px-6 py-4 text-right font-bold text-slate-900 text-sm">
                    LKR {fmtAmount(payment.totalAmount)}
                  </td>

                  <td className="px-6 py-4 text-right font-bold text-emerald-600">
                    LKR {fmtAmount(payment.paid)}
                  </td>

                  <td className="px-6 py-4 text-right font-bold text-rose-600">
                    LKR {fmtAmount(payment.outstanding)}
                  </td>

                  <td className="px-6 py-4">
                    <PaymentMethodBadge method={payment.paymentStatus} />
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => onViewOrder?.(payment.rawOrderId)}
                        className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition whitespace-nowrap cursor-pointer shadow-2xs flex items-center gap-1"
                      >
                        <Eye size={13} />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}