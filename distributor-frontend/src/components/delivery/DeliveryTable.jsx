import { UserPlus, Eye } from "lucide-react";

const STATUS_CONFIG = {
  OPEN:      { label: "Open",      color: "bg-amber-50 text-amber-700 border border-amber-200/60"      },
  CLAIMED:   { label: "Claimed",   color: "bg-sky-50 text-sky-700 border border-sky-200/60"          },
  DELIVERED: { label: "Delivered", color: "bg-emerald-50 text-emerald-700 border border-emerald-200/60" },
  RETURNED:  { label: "Returned",  color: "bg-rose-50 text-rose-700 border border-rose-200/60"        },
};

function PaymentBadge({ method }) {
  const color =
    method === "Cash"        ? "bg-green-50 text-green-700 border border-green-200/50" :
    method === "Credit"      ? "bg-purple-50 text-purple-700 border border-purple-200/50" :
    method === "Cash_Credit" ? "bg-indigo-50 text-indigo-700 border border-indigo-200/50" :
    "bg-slate-100 text-slate-600 border border-slate-200";
  const label = method === "Cash_Credit" ? "Cash + Credit" : (method ?? "—");
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${color}`}>
      {label}
    </span>
  );
}

function fmtAmount(val) {
  if (val === null || val === undefined) return "—";
  return Number(val).toLocaleString("en-LK", { minimumFractionDigits: 2 });
}

export default function DeliveryTable({ deliveries, onView }) {
  return (
    <div className="overflow-hidden bg-white border border-slate-100 rounded-[32px] shadow-xs">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
            <tr>
              <th className="px-5 py-4">Delivery ID</th>
              <th className="px-5 py-4">Order ID</th>
              <th className="px-5 py-4">Driver</th>
              <th className="px-5 py-4">Retailer</th>
              <th className="px-5 py-4 text-right">Total Amount</th>
              <th className="px-5 py-4 text-right">Collected</th>
              <th className="px-5 py-4">Payment</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {deliveries.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-16 text-center text-slate-400">
                  <p className="text-4xl mb-2">🚚</p>
                  <p className="font-bold text-slate-800 text-sm">No deliveries found</p>
                  <p className="text-xs text-slate-400">There are no deliveries matching your criteria.</p>
                </td>
              </tr>
            ) : (
              deliveries.map((d) => {
                const badge = STATUS_CONFIG[d.status] ?? { label: d.status, color: "bg-slate-100 text-slate-600 border border-slate-200" };
                const isOpen = d.status === "OPEN";
                return (
                  <tr key={d.delivery_id} className="hover:bg-slate-50/60 transition duration-150">

                    {/* Delivery ID */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => onView(d)}
                        className="font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        DEL-{String(d.delivery_id).padStart(4, "0")}
                      </button>
                    </td>

                    {/* Order ID */}
                    <td className="px-5 py-4 font-bold text-slate-700">
                      #{d.order_id}
                    </td>

                    {/* Driver */}
                    <td className="px-5 py-4">
                      {d.driver_name ? (
                        <div>
                          <p className="font-bold text-slate-800">{d.driver_name}</p>
                          {d.vehicle_number && (
                            <p className="text-[10px] text-slate-400 font-medium">{d.vehicle_number}</p>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border border-amber-200/50">
                          <UserPlus size={11} />
                          Unassigned
                        </span>
                      )}
                    </td>

                    {/* Retailer */}
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800">{d.shop_name ?? "—"}</p>
                      {d.owner_name && (
                        <p className="text-[10px] text-slate-400 font-medium">{d.owner_name}</p>
                      )}
                    </td>

                    {/* Total Amount */}
                    <td className="px-5 py-4 text-right">
                      <span className="font-bold text-slate-900 text-sm">
                        LKR {fmtAmount(d.total_amount)}
                      </span>
                    </td>

                    {/* Collected Amount */}
                    <td className="px-5 py-4 text-right">
                      {d.collected_amount != null ? (
                        <span className="font-bold text-slate-900">LKR {fmtAmount(d.collected_amount)}</span>
                      ) : (
                        <span className="text-slate-300 font-medium">—</span>
                      )}
                    </td>

                    {/* Payment Method */}
                    <td className="px-5 py-4">
                      <PaymentBadge method={d.payment_method} />
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badge.color}`}>
                        {badge.label}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => onView(d)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-2xs transition flex items-center justify-center gap-1 mx-auto cursor-pointer ${
                          isOpen
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100"
                        }`}
                      >
                        {isOpen ? <UserPlus size={12} /> : <Eye size={12} />}
                        {isOpen ? "Assign" : "View"}
                      </button>
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