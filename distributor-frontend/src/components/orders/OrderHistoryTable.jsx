import { Eye } from "lucide-react";

const DELIVERY_STATUS = {
  DELIVERED: { label: "Delivered", style: "bg-emerald-50 text-emerald-700 border border-emerald-200/60" },
  RETURNED:  { label: "Returned",  style: "bg-orange-50 text-orange-700 border border-orange-200/60" },
};

function fmtDate(dateStr) {
  if (!dateStr) return { date: "—", time: "" };
  const d = new Date(dateStr);
  return {
    date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
  };
}

function fmtAmount(val) {
  return Number(val || 0).toLocaleString("en-LK", { minimumFractionDigits: 2 });
}

export default function OrderHistoryTable({ deliveries, onView }) {
  return (
    <div className="overflow-hidden bg-white border border-slate-100 rounded-[32px] shadow-xs">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Retailer</th>
              <th className="px-6 py-4">Order Date</th>
              <th className="px-6 py-4">Delivery Date</th>
              <th className="px-6 py-4 text-right">Amount (LKR)</th>
              <th className="px-6 py-4">Driver</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {deliveries.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-16 text-center text-slate-400">
                  <p className="text-4xl mb-2">📦</p>
                  <p className="font-bold text-slate-800 text-sm">No order history found</p>
                  <p className="text-xs text-slate-400">There are no completed or returned orders matching your filters.</p>
                </td>
              </tr>
            ) : (
              deliveries.map((delivery) => {
                const ordered   = fmtDate(delivery.created_at);
                const delivered = fmtDate(delivery.delivery_date);
                const status    = DELIVERY_STATUS[delivery.status] ?? {
                  label: delivery.status, style: "bg-slate-100 text-slate-600 border border-slate-200",
                };

                return (
                  <tr key={delivery.delivery_id} className="hover:bg-slate-50/60 transition duration-150">
                    <td className="px-6 py-4 font-bold text-blue-600">
                      <button
                        onClick={() => onView?.(delivery.order_id)}
                        className="hover:underline cursor-pointer"
                      >
                        #{delivery.order_id}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      <p className="font-bold text-slate-800">{delivery.shop_name}</p>
                    </td>

                    <td className="px-6 py-4 text-slate-500 font-medium">
                      <p className="font-semibold text-slate-700">{ordered.date}</p>
                      <p className="text-[10px] text-slate-400">{ordered.time}</p>
                    </td>

                    <td className="px-6 py-4 text-slate-500 font-medium">
                      <p className="font-semibold text-slate-700">{delivered.date}</p>
                      <p className="text-[10px] text-slate-400">{delivered.time}</p>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-slate-900 text-sm">
                        LKR {fmtAmount(delivery.order_amount)}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-600">
                      {delivery.driver_name ?? <span className="text-slate-300 font-normal">—</span>}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.style}`}>
                        {status.label}
                      </span>
                      {delivery.status === "RETURNED" && delivery.remarks && (
                        <p className="text-[10px] text-slate-400 mt-0.5 max-w-[140px] truncate" title={delivery.remarks}>
                          {delivery.remarks}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onView?.(delivery.order_id)}
                          className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition whitespace-nowrap cursor-pointer shadow-2xs flex items-center gap-1"
                        >
                          <Eye size={13} />
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}