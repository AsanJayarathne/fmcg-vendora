import { useEffect, useState } from "react";
import { X, Loader2, CheckCircle2, XCircle, Package, Store, Calendar, CreditCard, ShoppingBag } from "lucide-react";
import { fetchOrderById, approveOrder, rejectOrder, fetchDeliveries } from "../../services/ordersApi";
import { useAuth } from "../../auth/AuthContext";

const STATUS_MAP = {
  Pending:    { label: "Pending",    color: "bg-amber-50 text-amber-700 border border-amber-200/60"   },
  Processing: { label: "Processing", color: "bg-sky-50 text-sky-700 border border-sky-200/60"       },
  Approved:   { label: "Approved",   color: "bg-blue-50 text-blue-700 border border-blue-200/60"     },
  Delivered:  { label: "Delivered",  color: "bg-emerald-50 text-emerald-700 border border-emerald-200/60" },
  Rejected:   { label: "Rejected",   color: "bg-rose-50 text-rose-700 border border-rose-200/60"     },
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
  const canReject  = order?.status === "Processing";
  let badge = STATUS_MAP[order?.status] ?? { label: order?.status, color: "bg-slate-100 text-slate-600 border border-slate-200" };
  if (order?.status === "Rejected" && order?.isReturned) {
    badge = { label: "Returned", color: "bg-purple-50 text-purple-700 border border-purple-200/60" };
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100 transform transition-all scale-100 animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600">Order Overview</span>
              <h2 className="text-lg font-bold text-slate-800 leading-tight mt-0.5">
                Order #{order?.order_id ?? "…"}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">

          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-blue-600" />
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}

          {!loading && order && (
            <>
              {/* Status + Date banner */}
              <div className="flex items-center justify-between p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar size={15} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-600">{fmt(order.created_at)}</span>
                </div>
                <span className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badge.color}`}>
                  {badge.label}
                </span>
              </div>

              {/* Retailer Info & Payment Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Store size={14} className="text-blue-600" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Retailer Details</p>
                  </div>
                  <p className="font-bold text-slate-800 text-sm">{order.shop_name}</p>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">{order.owner_name}</p>
                  {order.shop_address && (
                    <p className="text-xs text-slate-400 mt-1 font-medium">{order.shop_address}</p>
                  )}
                </div>

                <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard size={14} className="text-blue-600" />
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Payment Information</p>
                    </div>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.payment_method === "Cash" ? "bg-green-50 text-green-700 border border-green-200/50" :
                      order.payment_method === "Credit" ? "bg-purple-50 text-purple-700 border border-purple-200/50" :
                      "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}>
                      {order.payment_method ?? "N/A"}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex justify-between items-baseline">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Grand Total</span>
                    <span className="text-base font-bold text-slate-900">LKR {fmtAmount(order.total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <Package size={15} className="text-blue-600" /> Order Items ({order.items?.length ?? 0})
                </p>
                <div className="overflow-hidden border border-slate-100 rounded-2xl shadow-2xs bg-white">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3 text-right">Qty</th>
                        <th className="px-4 py-3 text-right">Unit Price</th>
                        <th className="px-4 py-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(order.items ?? []).map((item, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 text-slate-800 font-bold">
                            {item.product_name}
                            {item.unit && <span className="ml-1.5 text-[10px] text-slate-400 font-medium">({item.unit})</span>}
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-slate-700">{item.quantity}</td>
                          <td className="px-4 py-3 text-right font-medium text-slate-600">LKR {fmtAmount(item.unit_price)}</td>
                          <td className="px-4 py-3 text-right font-bold text-slate-800">LKR {fmtAmount(item.total_price)}</td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold">
                        <td colSpan={3} className="px-4 py-3 text-slate-800 uppercase tracking-wider text-[11px]">Total Amount</td>
                        <td className="px-4 py-3 text-right text-blue-600 font-bold text-sm">LKR {fmtAmount(order.total_amount)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-100 transition cursor-pointer shadow-2xs"
          >
            Close
          </button>

          {!loading && order && (canApprove || canReject) && (
            <div className="flex gap-3">
              {canApprove && (
                <button
                  onClick={handleApprove}
                  disabled={!!actioning}
                  className="flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition cursor-pointer disabled:opacity-60"
                >
                  {actioning === "approve" ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  Approve Order
                </button>
              )}
              {canReject && (
                <button
                  onClick={handleReject}
                  disabled={!!actioning}
                  className="flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-bold shadow-2xs transition cursor-pointer disabled:opacity-60"
                >
                  {actioning === "reject" ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                  Reject Order
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
