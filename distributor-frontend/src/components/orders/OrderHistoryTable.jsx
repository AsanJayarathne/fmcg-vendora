import { Download } from "lucide-react";

const DELIVERY_STATUS = {
  DELIVERED: { label: "Delivered", color: "text-emerald-600", bg: "bg-emerald-50" },
  RETURNED:  { label: "Returned",  color: "text-orange-600", bg: "bg-orange-50"  },
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
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="border-b border-gray-200 bg-gray-50/75">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Retailer</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order Date</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivery Date</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount (LKR)</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Driver</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivery Status</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {deliveries.length === 0 ? (
            <tr>
              <td colSpan="8" className="px-6 py-10 text-center text-gray-400 text-sm">
                No completed deliveries found
              </td>
            </tr>
          ) : (
            deliveries.map((delivery) => {
              const ordered  = fmtDate(delivery.created_at);
              const delivered = fmtDate(delivery.delivery_date);
              const status   = DELIVERY_STATUS[delivery.status] ?? {
                label: delivery.status, color: "text-gray-500", bg: "bg-gray-50",
              };

              return (
                <tr key={delivery.delivery_id} className="hover:bg-gray-50/50 transition-colors">

                  <td className="px-6 py-4 font-mono font-semibold text-gray-900">
                    #{delivery.order_id}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    <p className="font-medium text-gray-800">{delivery.shop_name}</p>
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    <p className="font-medium text-gray-800">{ordered.date}</p>
                    <p className="text-[11px] text-gray-500">{ordered.time}</p>
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    <p className="font-medium text-gray-800">{delivered.date}</p>
                    <p className="text-[11px] text-gray-500">{delivered.time}</p>
                  </td>

                  <td className="px-6 py-4 text-right font-semibold text-gray-900">
                    {fmtAmount(delivery.order_amount)}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {delivery.driver_name ?? <span className="text-gray-400">—</span>}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${status.color} ${status.bg}`}>
                      {status.label}
                    </span>
                    {delivery.status === "RETURNED" && delivery.remarks && (
                      <p className="text-[10px] text-gray-400 mt-0.5 max-w-[120px] truncate" title={delivery.remarks}>
                        {delivery.remarks}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onView?.(delivery.order_id)}
                        className="px-4 py-1.5 text-xs font-semibold border border-gray-300 rounded-md text-sky-600 hover:bg-sky-50 transition"
                      >
                        View
                      </button>
                      <button className="p-1.5 border border-gray-300 rounded-md text-sky-600 hover:bg-sky-50 transition">
                        <Download size={14} />
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
  );
}