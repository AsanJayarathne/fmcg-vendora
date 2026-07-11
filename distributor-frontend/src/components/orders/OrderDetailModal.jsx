import { useEffect, useState } from "react";
import { X, Loader2, CheckCircle, XCircle, Package } from "lucide-react";
import { fetchOrderById, approveOrder, rejectOrder, fetchDeliveries } from "../../services/ordersApi";
import { useAuth } from "../../auth/AuthContext";

const STATUS_MAP = {
  Pending:    { label: "Pending Approval", color: "bg-amber-100 text-amber-700"  },
  Processing: { label: "Processing",       color: "bg-blue-100 text-blue-700"    },
  Approved:   { label: "Approved",         color: "bg-green-100 text-green-700"  },
  Delivered:  { label: "Delivered",        color: "bg-emerald-100 text-emerald-700" },
  Rejected:   { label: "Rejected",         color: "bg-red-100 text-red-700"      },
};

function fmt(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    + " · " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function fmtAmount(val) {
  return Number(val || 0).toLocaleString("en-LK", { minimumFractionDigits: 2 });
}

export default function OrderDetailModal({ orderId, onClose, onActionDone }) {
  const { auth } = useAuth();
  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(""); // "approve" | "reject" | ""
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    setError("");
    Promise.all([
      fetchOrderById(auth?.token, orderId),
      fetchDeliveries(auth?.token).catch(() => [])
    ])
      .then(([orderData, deliveriesData]) => {
        const isRet = (deliveriesData ?? []).some(
          (d) => Number(d.order_id) === Number(orderId) && d.status === "RETURNED"
        );
        setOrder({ ...orderData, isReturned: isRet });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [orderId, auth?.token]);

  const handleApprove = async () => {
    setActioning("approve");
    setError("");
    try {
      await approveOrder(auth?.token, orderId);
      onActionDone?.();
      onClose();
    } catch (e) {
      setError(e.message);
      setActioning("");
    }
  };

  const handleReject = async () => {
    setActioning("reject");
    setError("");
    try {
      await rejectOrder(auth?.token, orderId);
      onActionDone?.();
      onClose();
    } catch (e) {
      setError(e.message);
      setActioning("");
    }
  };

  const canApprove = order?.status === "Processing";
  const canReject  = order?.status === "Pending" || order?.status === "Processing";
  let badge = STATUS_MAP[order?.status] ?? { label: order?.status, color: "bg-gray-100 text-gray-600" };
  if (order?.status === "Rejected" && order?.isReturned) {
    badge = { label: "Returned", color: "bg-orange-100 text-orange-700" };
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Panel */}
      <div className="relative h-full w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden animate-slide-in-right">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Order Details</p>
            <h2 className="text-lg font-bold text-gray-900 mt-0.5">
              #{order?.order_id ?? "…"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-blue-500" />
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {!loading && order && (
            <>
              {/* Status + Date */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
                  {badge.label}
                </span>
                <span className="text-xs text-gray-500">{fmt(order.created_at)}</span>
              </div>

              {/* Retailer Info */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-1.5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Retailer</p>
                <p className="font-semibold text-gray-900">{order.shop_name}</p>
                <p className="text-sm text-gray-600">{order.owner_name}</p>
                {order.shop_address && (
                  <p className="text-xs text-gray-500">{order.shop_address}</p>
                )}
              </div>

              {/* Payment method */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Payment Method:</span>
                <span className={`text-sm font-semibold ${
                  order.payment_method === "Cash"   ? "text-green-600" :
                  order.payment_method === "Credit" ? "text-red-500"   : "text-gray-700"
                }`}>
                  {order.payment_method}
                </span>
              </div>

              {/* Items Table */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Package size={13} /> Order Items
                </p>
                <div className="overflow-hidden border border-gray-200 rounded-xl">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600">Product</th>
                        <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-600">Qty</th>
                        <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-600">Unit (LKR)</th>
                        <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-600">Total (LKR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(order.items ?? []).map((item, i) => (
                        <tr key={i}>
                          <td className="px-4 py-2.5 text-gray-800 font-medium">
                            {item.product_name}
                            {item.unit && <span className="ml-1 text-xs text-gray-400">({item.unit})</span>}
                          </td>
                          <td className="px-4 py-2.5 text-right text-gray-700">{item.quantity}</td>
                          <td className="px-4 py-2.5 text-right text-gray-700">{fmtAmount(item.unit_price)}</td>
                          <td className="px-4 py-2.5 text-right font-semibold text-gray-900">{fmtAmount(item.total_price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Grand Total */}
                <div className="flex justify-between items-center mt-3 px-1">
                  <span className="text-sm font-semibold text-gray-600">Grand Total</span>
                  <span className="text-lg font-bold text-gray-900">
                    LKR {fmtAmount(order.total_amount)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {!loading && order && (canApprove || canReject) && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 space-y-2">
            {error && (
              <p className="text-xs text-red-600 mb-1">{error}</p>
            )}
            <div className="flex gap-3">
              {canApprove && (
                <button
                  onClick={handleApprove}
                  disabled={!!actioning}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition disabled:opacity-60"
                >
                  {actioning === "approve"
                    ? <Loader2 size={16} className="animate-spin" />
                    : <CheckCircle size={16} />
                  }
                  Approve Order
                </button>
              )}
              {canReject && (
                <button
                  onClick={handleReject}
                  disabled={!!actioning}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 text-sm font-semibold transition disabled:opacity-60"
                >
                  {actioning === "reject"
                    ? <Loader2 size={16} className="animate-spin" />
                    : <XCircle size={16} />
                  }
                  Reject Order
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
