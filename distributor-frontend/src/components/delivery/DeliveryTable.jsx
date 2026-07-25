import { UserPlus } from "lucide-react";

const STATUS_CONFIG = {
  OPEN:      { label: "Open",      color: "bg-amber-100 text-amber-700 border border-amber-200"     },
  CLAIMED:   { label: "Claimed",   color: "bg-blue-100 text-blue-700 border border-blue-200"        },
  DELIVERED: { label: "Delivered", color: "bg-emerald-100 text-emerald-700 border border-emerald-200"},
  RETURNED:  { label: "Returned",  color: "bg-red-100 text-red-700 border border-red-200"           },
};

function PaymentBadge({ method }) {
  const color =
    method === "Cash"        ? "text-green-600" :
    method === "Credit"      ? "text-red-500"   :
    method === "Cash_Credit" ? "text-purple-600" : "text-gray-600";
  const label = method === "Cash_Credit" ? "Cash + Credit" : (method ?? "—");
  return <span className={`text-xs font-semibold capitalize ${color}`}>{label}</span>;
}

function fmtAmount(val) {
  if (val === null || val === undefined) return "—";
  return Number(val).toLocaleString("en-LK", { minimumFractionDigits: 2 });
}

export default function DeliveryTable({ deliveries, onView }) {
  if (deliveries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-lg text-gray-400">
        <div className="text-4xl mb-2">🚚</div>
        <p className="text-sm font-medium">No deliveries found</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="border-b border-gray-200 bg-gray-50/75">
          <tr>
            <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivery</th>
            <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
            <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Driver</th>
            <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Retailer</th>
            <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Total (LKR)</th>
            <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Collected</th>
            <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
            <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {deliveries.map((d) => {
            const badge = STATUS_CONFIG[d.status] ?? { label: d.status, color: "bg-gray-100 text-gray-600" };
            const isOpen = d.status === "OPEN";
            return (
              <tr key={d.delivery_id} className="hover:bg-gray-50/50 transition-colors">

                {/* Delivery ID */}
                <td className="px-5 py-3.5 font-mono font-semibold text-gray-900 text-xs">
                  DEL-{String(d.delivery_id).padStart(4, "0")}
                </td>

                {/* Order ID */}
                <td className="px-5 py-3.5 font-mono text-gray-700 text-xs">
                  #{d.order_id}
                </td>

                {/* Driver */}
                <td className="px-5 py-3.5">
                  {d.driver_name ? (
                    <div>
                      <p className="font-medium text-gray-900 text-xs">{d.driver_name}</p>
                      {d.vehicle_number && (
                        <p className="text-[10px] text-gray-400">{d.vehicle_number}</p>
                      )}
                    </div>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-amber-600 font-semibold">
                      <UserPlus size={11} />
                      Unassigned
                    </span>
                  )}
                </td>

                {/* Retailer */}
                <td className="px-5 py-3.5">
                  <p className="font-medium text-gray-900 text-xs">{d.shop_name ?? "—"}</p>
                  {d.owner_name && (
                    <p className="text-[10px] text-gray-400">{d.owner_name}</p>
                  )}
                </td>

                {/* Total Amount */}
                <td className="px-5 py-3.5 text-right font-semibold text-gray-950 text-xs">
                  {fmtAmount(d.total_amount)}
                </td>

                {/* Collected Amount */}
                <td className="px-5 py-3.5 text-right text-xs">
                  {d.collected_amount != null ? (
                    <span className="font-semibold text-gray-900">{fmtAmount(d.collected_amount)}</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>

                {/* Payment Method */}
                <td className="px-5 py-3.5">
                  <PaymentBadge method={d.payment_method} />
                </td>

                {/* Status */}
                <td className="px-5 py-3.5">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${badge.color}`}>
                    {badge.label}
                  </span>
                </td>

                {/* Action */}
                <td className="px-5 py-3.5 text-center">
                  <button
                    onClick={() => onView(d)}
                    className={`px-4 py-1 text-[10px] font-semibold border rounded-md transition-colors ${
                      isOpen
                        ? "text-blue-600 border-blue-300 hover:bg-blue-50"
                        : "text-sky-500 border-gray-300 hover:bg-sky-50"
                    }`}
                  >
                    {isOpen ? "Assign" : "View"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}