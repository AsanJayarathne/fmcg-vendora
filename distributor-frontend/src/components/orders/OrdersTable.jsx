import { Loader2 } from "lucide-react";

const STATUS_PILLS = {
  Pending:    "bg-amber-50 text-amber-700 border border-amber-200/60",
  Processing: "bg-sky-50 text-sky-700 border border-sky-200/60",
  Approved:   "bg-blue-50 text-blue-700 border border-blue-200/60",
  Delivered:  "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
  Rejected:   "bg-rose-50 text-rose-700 border border-rose-200/60",
  Returned:   "bg-purple-50 text-purple-700 border border-purple-200/60",
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
    <div className="overflow-hidden bg-white border border-slate-100 rounded-3xl shadow-xs">
      <table className="w-full text-xs text-left border-collapse">
        <thead className="bg-slate-50 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-100">
          <tr>
            <th className="px-6 py-3.5">Order ID</th>
            <th className="px-6 py-3.5">Retailer</th>
            <th className="px-6 py-3.5">Order Date</th>
            <th className="px-6 py-3.5 text-right">Total (LKR)</th>
            <th className="px-6 py-3.5">Payment</th>
            <th className="px-6 py-3.5">Status</th>
            <th className="px-6 py-3.5 text-center">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {orders.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-12 text-center text-slate-400 font-semibold">
                No orders found
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const { date, time } = fmtDate(order.created_at);
              let statusLabel = order.status;
              if (order.status === "Rejected" && returnedOrderIds?.has(Number(order.order_id))) {
                statusLabel = "Returned";
              }
              const isActioning = actioningId === order.order_id;
              const pillStyle = STATUS_PILLS[statusLabel] ?? "bg-slate-100 text-slate-600 border border-slate-200";

              return (
                <tr key={order.order_id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-bold text-blue-600">
                    #{order.order_id}
                  </td>

                  <td className="px-6 py-4 text-slate-700">
                    <p className="font-semibold text-slate-800">{order.shop_name}</p>
                    <p className="text-[11px] text-slate-400 font-normal">{order.owner_name}</p>
                  </td>

                  <td className="px-6 py-4 text-slate-500 font-medium">
                    <p className="font-semibold text-slate-700">{date}</p>
                    <p className="text-[10px] text-slate-400">{time}</p>
                  </td>

                  <td className="px-6 py-4 text-right font-bold text-slate-800">
                    Rs. {fmtAmount(order.total_amount)}
                  </td>

                  <td className="px-6 py-4 font-semibold text-slate-600">
                    {order.payment_method ?? "—"}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${pillStyle}`}>
                      {statusLabel}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      {/* View */}
                      <button
                        onClick={() => onView(order.order_id)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition whitespace-nowrap cursor-pointer"
                      >
                        View
                      </button>

                      {/* Approve — only for Processing */}
                      {order.status === "Processing" && (
                        <button
                          onClick={() => onApprove(order.order_id)}
                          disabled={isActioning}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition cursor-pointer disabled:opacity-60 flex items-center gap-1"
                        >
                          {isActioning ? <Loader2 size={12} className="animate-spin" /> : null}
                          Approve
                        </button>
                      )}

                      {/* Reject — only for Processing */}
                      {order.status === "Processing" && (
                        <button
                          onClick={() => onReject(order.order_id)}
                          disabled={isActioning}
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 transition cursor-pointer disabled:opacity-60 flex items-center gap-1"
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