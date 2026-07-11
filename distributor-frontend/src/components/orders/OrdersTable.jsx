import { Loader2 } from "lucide-react";

const STATUS_MAP = {
  Pending:    { label: "Pending",    color: "text-amber-600"  },
  Processing: { label: "Processing", color: "text-blue-600"   },
  Approved:   { label: "Approved",   color: "text-green-600"  },
  Delivered:  { label: "Delivered",  color: "text-emerald-600"},
  Rejected:   { label: "Rejected",   color: "text-red-500"    },
};

function fmtDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return {
    date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
  };
}

function fmtAmount(val) {
  return Number(val || 0).toLocaleString("en-LK", { minimumFractionDigits: 2 });
}

export default function OrdersTable({ orders, returnedOrderIds, onView, onApprove, onReject, actioningId }) {
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-600 uppercase">Order ID</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-600 uppercase">Retailer</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-600 uppercase">Order Date</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-600 uppercase">Total (LKR)</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-600 uppercase">Payment</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-600 uppercase">Status</th>
            <th className="px-5 py-3.5 text-xs font-semibold text-gray-600 uppercase">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {orders.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-10 text-center text-gray-400 text-sm">
                No orders found
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const { date, time } = fmtDate(order.created_at);
              let statusInfo = STATUS_MAP[order.status] ?? { label: order.status, color: "text-gray-500" };
              if (order.status === "Rejected" && returnedOrderIds?.has(Number(order.order_id))) {
                statusInfo = { label: "Returned", color: "text-orange-500" };
              }
              const isActioning = actioningId === order.order_id;

              return (
                <tr key={order.order_id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3 font-semibold text-gray-800">
                    #{order.order_id}
                  </td>

                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{order.shop_name}</p>
                    <p className="text-xs text-gray-500">{order.owner_name}</p>
                  </td>

                  <td className="px-5 py-3">
                    <p className="text-gray-800">{date}</p>
                    <p className="text-[11px] text-gray-500">{time}</p>
                  </td>

                  <td className="px-5 py-3 font-medium text-gray-800">
                    {fmtAmount(order.total_amount)}
                  </td>

                  <td className={`px-5 py-3 font-medium ${
                    order.payment_method === "Cash"   ? "text-green-600" :
                    order.payment_method === "Credit" ? "text-red-500"   : "text-gray-500"
                  }`}>
                    {order.payment_method ?? "—"}
                  </td>

                  <td className={`px-5 py-3 font-semibold ${statusInfo.color}`}>
                    {statusInfo.label}
                  </td>

                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* View always visible */}
                      <button
                        onClick={() => onView(order.order_id)}
                        className="px-3 py-1.5 text-xs font-semibold border border-gray-300 rounded-md text-sky-600 hover:bg-sky-50 transition"
                      >
                        View
                      </button>

                      {/* Approve — only for Processing */}
                      {order.status === "Processing" && (
                        <button
                          onClick={() => onApprove(order.order_id)}
                          disabled={isActioning}
                          className="px-3 py-1.5 text-xs font-semibold rounded-md bg-green-600 text-white hover:bg-green-700 transition disabled:opacity-60 flex items-center gap-1"
                        >
                          {isActioning ? <Loader2 size={12} className="animate-spin" /> : null}
                          Approve
                        </button>
                      )}

                      {/* Reject — for Pending or Processing */}
                      {(order.status === "Pending" || order.status === "Processing") && (
                        <button
                          onClick={() => onReject(order.order_id)}
                          disabled={isActioning}
                          className="px-3 py-1.5 text-xs font-semibold rounded-md border border-red-300 text-red-600 hover:bg-red-50 transition disabled:opacity-60 flex items-center gap-1"
                        >
                          {isActioning ? <Loader2 size={12} className="animate-spin" /> : null}
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}