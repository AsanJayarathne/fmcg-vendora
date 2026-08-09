import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  FiBox,
  FiCheckCircle,
  FiClipboard,
  FiLoader,
  FiTruck,
  FiX,
  FiXCircle,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";
import { OrderContext } from "../context/OrderContextObject";
import OrdersHeader from "../components/orders/OrdersHeader";
import OrdersStats from "../components/orders/OrdersStats";
import Pagination from "../components/orders/Pagination";
import {
  LOCK_WINDOW_MS,
  filterOrders,
  formatCurrency,
  formatDate,
  getStatusClass,
  getTypeClass,
} from "../utils/orderHelpers";

const tabs = ["All Orders", "Normal Orders", "Urgent Orders", "Delivered", "Cancelled"];

// ── useEditCountdown hook ────────────────────────────────────────────────────
function useEditCountdown(createdAt) {
  const parseDate = (raw) => new Date((raw ?? "").replace(" ", "T"));

  const calcRemaining = () => {
    if (!createdAt) return 0;
    const expiresAt = parseDate(createdAt).getTime() + LOCK_WINDOW_MS;
    const secs = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    return secs;
  };

  const [remaining, setRemaining] = useState(calcRemaining);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!createdAt) { setRemaining(0); return; }
    setRemaining(calcRemaining());
    intervalRef.current = setInterval(() => {
      const secs = calcRemaining();
      setRemaining(secs);
      if (secs <= 0) clearInterval(intervalRef.current);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [createdAt]);

  return remaining;
}

// ── EditWindowBanner ──────────────────────────────────────────────────────────
function EditWindowBanner({ createdAt, backendStatus, onExpired }) {
  const isPending   = backendStatus === "Pending";
  const remaining   = useEditCountdown(isPending ? createdAt : null);
  const prevPending = useRef(isPending);

  useEffect(() => {
    if (prevPending.current && remaining === 0 && isPending) {
      onExpired && onExpired();
    }
    prevPending.current = isPending;
  }, [remaining, isPending, onExpired]);

  if (!isPending || remaining <= 0) return null;

  const mins     = Math.floor(remaining / 60);
  const secs     = remaining % 60;
  const pad      = (n) => String(n).padStart(2, "0");
  const isUrgent = remaining <= 60;

  return (
    <div
      className={`flex items-center gap-3 rounded-2xl px-4 py-3 mb-5 text-xs font-semibold border transition-all ${
        isUrgent
          ? "bg-red-50 border-red-200/80 text-red-700"
          : "bg-amber-50 border-amber-200/80 text-amber-800"
      }`}
    >
      <span className="relative flex h-3 w-3 shrink-0">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isUrgent ? "bg-red-400" : "bg-amber-400"
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-3 w-3 ${
            isUrgent ? "bg-red-500" : "bg-amber-500"
          }`}
        />
      </span>

      <span className="flex-1 font-medium">
        {isUrgent
          ? "⚡ 15-minute cancellation window closing soon!"
          : "⏱ Order is in 15-minute lock window — you can cancel or confirm immediately."}
      </span>

      <span
        className={`font-mono text-sm font-bold px-3 py-1 rounded-xl shadow-2xs ${
          isUrgent
            ? "bg-red-100 text-red-700 border border-red-200"
            : "bg-amber-100 text-amber-800 border border-amber-200"
        }`}
      >
        {pad(mins)}:{pad(secs)}
      </span>
    </div>
  );
}

// ── Cancel Confirmation Modal ────────────────────────────────────────────────
function CancelConfirmModal({ orderId, onConfirm, onClose, isCancelling }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
              <FiXCircle size={18} />
            </div>
            <h2 className="text-base font-bold text-slate-800 leading-tight">Cancel Order</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
          >
            <FiX size={16} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-3 p-4 bg-red-50/60 border border-red-100 rounded-2xl text-xs text-red-700 leading-relaxed font-semibold">
            <FiAlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              Are you sure you want to cancel order <strong className="font-bold text-red-800">{orderId}</strong>? This action cannot be undone.
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isCancelling}
            className="px-4.5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
          >
            No, Keep Order
          </button>
          <button
            onClick={onConfirm}
            disabled={isCancelling}
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-2xs transition cursor-pointer disabled:opacity-50"
          >
            {isCancelling ? <><FiLoader className="animate-spin" size={14} /> Cancelling...</> : "Yes, Cancel Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Fast Order Confirmation Modal ────────────────────────────────────────────
function ConfirmNowModal({ orderId, onConfirm, onClose, isConfirming }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <FiCheckCircle size={18} />
            </div>
            <h2 className="text-base font-bold text-slate-800 leading-tight">Confirm Order Now</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
          >
            <FiX size={16} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-3 p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl text-xs text-emerald-700 leading-relaxed font-semibold">
            <FiCheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              Are you sure you want to confirm order <strong className="font-bold text-emerald-800">{orderId}</strong> now? This will lock the order for processing immediately.
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isConfirming}
            className="px-4.5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isConfirming}
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition cursor-pointer disabled:opacity-50"
          >
            {isConfirming ? <><FiLoader className="animate-spin" size={14} /> Confirming...</> : "Yes, Confirm Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Order Detail Modal ────────────────────────────────────────────────────────
function OrderDetailModal({ order, onClose, onCancel, cancellingId, onConfirmLock, confirmingLockId }) {
  if (!order) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Order Details</p>
            <h2 className="font-bold text-lg text-slate-800 leading-tight">{order.orderId}</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeClass(order.orderType)}`}>
              {order.orderType}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(order.status)}`}>
              {order.status}
            </span>
            {order.editable && (
              <>
                <button
                  onClick={() => onConfirmLock(order)}
                  disabled={confirmingLockId === order.backendId || cancellingId === order.backendId}
                  className="flex items-center gap-1.5 border border-emerald-200 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-emerald-100 disabled:opacity-50 transition cursor-pointer"
                >
                  <FiCheckCircle size={12} />
                  {confirmingLockId === order.backendId ? "Confirming..." : "Confirm Now"}
                </button>
                <button
                  onClick={() => onCancel(order)}
                  disabled={cancellingId === order.backendId || confirmingLockId === order.backendId}
                  className="flex items-center gap-1.5 border border-rose-200 text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-rose-100 disabled:opacity-50 transition cursor-pointer"
                >
                  <FiXCircle size={12} />
                  {cancellingId === order.backendId ? "Cancelling..." : "Cancel"}
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition cursor-pointer ml-1"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-6 flex flex-col gap-5 no-scrollbar">

          {/* Info + Status side-by-side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Order info */}
            <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">Order Information</h3>
              <div className="space-y-2.5">
                {[
                  ["Order ID",    order.orderId],
                  ["Distributor", order.distributor],
                  ["Order Date",  formatDate(order.createdAt)],
                  ["Payment",     order.paymentLabel],
                  ["Order Type",  order.orderType],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between gap-4 text-xs font-medium">
                    <span className="text-slate-400">{label}</span>
                    <span className="font-semibold text-slate-700 text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status timeline */}
            <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">Status Timeline</h3>
              <div className="space-y-3">
                {(order.statusHistory ?? []).map((step) => (
                  <div key={step.name} className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      step.completed ? "bg-emerald-500 text-white" : "border-2 border-slate-200 bg-white"
                    }`}>
                      {step.completed && <FiCheck size={11} />}
                    </span>
                    <span className={`flex-1 text-xs font-semibold ${step.completed ? "text-slate-800" : "text-slate-400"}`}>
                      {step.name}
                    </span>
                    {step.date && (
                      <span className="text-[11px] font-medium text-slate-400">{formatDate(step.date, true)}</span>
                    )}
                  </div>
                ))}
                {order.status === "Cancelled" && (
                  <div className="flex items-center gap-2 text-rose-600 pt-1">
                    <FiXCircle size={15} className="shrink-0" />
                    <span className="text-xs font-bold">Order Cancelled</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Financials strip */}
          {(() => {
            const boxes = [];
            boxes.push(
              <div key="subtotal" className="bg-blue-50/60 border border-blue-100/60 rounded-2xl p-3.5">
                <p className="text-[10px] font-semibold text-blue-600/70 uppercase tracking-wider mb-0.5">Subtotal</p>
                <p className="font-bold text-slate-800 text-sm">{formatCurrency(order.subtotal)}</p>
              </div>
            );
            if ((order.discount ?? 0) > 0) {
              boxes.push(
                <div key="discount" className="bg-emerald-50/60 border border-emerald-100/60 rounded-2xl p-3.5">
                  <p className="text-[10px] font-semibold text-emerald-600/70 uppercase tracking-wider mb-0.5">Discount</p>
                  <p className="font-bold text-emerald-700 text-sm">- {formatCurrency(order.discount)}</p>
                </div>
              );
            }
            if ((order.urgentCharge ?? 0) > 0) {
              boxes.push(
                <div key="urgent" className="bg-orange-50/60 border border-orange-100/60 rounded-2xl p-3.5">
                  <p className="text-[10px] font-semibold text-orange-600/70 uppercase tracking-wider mb-0.5">Urgent Charge</p>
                  <p className="font-bold text-orange-700 text-sm">{formatCurrency(order.urgentCharge)}</p>
                </div>
              );
            }
            boxes.push(
              <div key="total" className="bg-emerald-50/60 border border-emerald-100/60 rounded-2xl p-3.5">
                <p className="text-[10px] font-semibold text-emerald-600/70 uppercase tracking-wider mb-0.5">Total Paid</p>
                <p className="font-bold text-emerald-700 text-sm">{formatCurrency(order.total)}</p>
              </div>
            );

            const gridColsClass = 
              boxes.length === 4 ? "grid-cols-2 md:grid-cols-4" :
              boxes.length === 3 ? "grid-cols-3" :
              "grid-cols-2";

            return (
              <div className={`grid gap-3 text-center ${gridColsClass}`}>
                {boxes}
              </div>
            );
          })()}

          {/* Items table */}
          <div>
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2.5">Ordered Items</h3>
            <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-2xs">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="text-left px-4 py-3">Product</th>
                    <th className="text-left px-4 py-3">Unit</th>
                    <th className="text-center px-4 py-3">Qty</th>
                    <th className="text-right px-4 py-3">Unit Price</th>
                    <th className="text-right px-4 py-3">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(order.items ?? []).map((item, idx) => (
                    <tr key={item.id ?? idx} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        <div>{item.name}</div>
                        {item.discountRate > 0 && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold inline-block mt-0.5 border border-emerald-100">
                            {item.discountRate}% discount applied
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-400 font-medium">{item.unit}</td>
                      <td className="px-4 py-3 text-center font-bold text-slate-700">{item.quantity}</td>
                      <td className="px-4 py-3 text-right font-medium text-slate-600">{formatCurrency(item.price)}</td>
                      <td className="px-4 py-3 text-right font-bold text-slate-800">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                  {(order.urgentCharge ?? 0) > 0 && (
                    <tr className="bg-amber-50/40">
                      <td className="px-4 py-3 text-amber-700 font-bold" colSpan={4}>Urgent Order Charge</td>
                      <td className="px-4 py-3 text-right font-bold text-amber-700">
                        {formatCurrency(order.urgentCharge)}
                      </td>
                    </tr>
                  )}
                  <tr className="bg-slate-50 font-bold text-xs">
                    <td className="px-4 py-3 text-slate-800 uppercase tracking-wider" colSpan={4}>Grand Total</td>
                    <td className="px-4 py-3 text-right text-blue-600 font-bold text-sm">{formatCurrency(order.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function MyOrders() {
  const { orders, loading, error, cancelOrder, confirmOrder, loadOrders } = useContext(OrderContext);

  const [activeTab,    setActiveTab]    = useState("All Orders");
  const [modalOrder,   setModalOrder]   = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelError,  setCancelError]  = useState(null);

  const [orderToConfirmLock, setOrderToConfirmLock] = useState(null);
  const [confirmingLockId, setConfirmingLockId] = useState(null);

  function handleConfirmLockClick(order) {
    setOrderToConfirmLock(order);
  }

  async function handleConfirmLockConfirm() {
    if (!orderToConfirmLock) return;
    const order = orderToConfirmLock;
    setOrderToConfirmLock(null);
    setConfirmingLockId(order.backendId);
    try {
      await confirmOrder(order.backendId);
      setModalOrder(null);
    } catch (err) {
      alert(err.message || "Failed to confirm order.");
    } finally {
      setConfirmingLockId(null);
    }
  }

  const filteredOrders  = useMemo(() => filterOrders(orders, activeTab), [orders, activeTab]);
  const latestOrder     = orders[0];
  const activeOrders    = orders.filter((o) => !["Delivered", "Cancelled"].includes(o.status));
  const urgentOrders    = orders.filter((o) => o.orderType === "Urgent");
  const deliveredOrders = orders.filter((o) => o.status === "Delivered");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, orders]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const [orderToCancel, setOrderToCancel] = useState(null);

  function handleCancelClick(order) {
    setOrderToCancel(order);
  }

  async function handleCancelConfirm() {
    if (!orderToCancel) return;
    const order = orderToCancel;
    setOrderToCancel(null);
    setCancelError(null);
    setCancellingId(order.backendId);
    try {
      await cancelOrder(order.backendId);
      setModalOrder(null);
    } catch (err) {
      setCancelError(err.message || "Failed to cancel order.");
    } finally {
      setCancellingId(null);
    }
  }

  if (loading && orders.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-500">
        <FiLoader className="animate-spin text-blue-600" size={32} />
        <span className="font-semibold text-sm">Syncing order details...</span>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-center shadow-xs">
          <p className="font-semibold text-sm">⚠️ {error}</p>
          <button onClick={loadOrders} className="mt-4 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      <OrdersHeader />

      {cancelError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 mb-4 text-xs font-semibold flex justify-between items-center shadow-2xs">
          <span>⚠️ {cancelError}</span>
          <button onClick={() => setCancelError(null)} className="underline ml-4 cursor-pointer">Dismiss</button>
        </div>
      )}

      <OrdersStats
        orders={orders}
        activeOrders={activeOrders}
        urgentOrders={urgentOrders}
        deliveredOrders={deliveredOrders}
      />

      {!latestOrder ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-400 font-bold shadow-xs">
          No confirmed orders yet.
        </div>
      ) : (
        <>
          {/* Latest Order Card */}
          <section className="bg-white border border-slate-100 rounded-3xl p-6 mb-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <FiClipboard size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Latest Order</p>
                  <div className="flex flex-wrap gap-x-8 gap-y-2">
                    <div>
                      <p className="text-[10px] font-medium text-slate-400 uppercase">Order ID</p>
                      <p className="text-base font-bold text-blue-600">{latestOrder.orderId}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-slate-400 uppercase">Distributor</p>
                      <p className="text-sm font-bold text-slate-800">{latestOrder.distributor}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-slate-400 uppercase">Status</p>
                      <p className="text-xs font-bold text-amber-600 flex items-center gap-1">
                        <FiBox size={13} /> {latestOrder.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-slate-400 uppercase">Total</p>
                      <p className="text-sm font-bold text-slate-800">{formatCurrency(latestOrder.total)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-slate-400 uppercase">Date</p>
                      <p className="text-xs font-semibold text-slate-500">{formatDate(latestOrder.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getTypeClass(latestOrder.orderType)}`}>
                  {latestOrder.orderType} Order
                </span>
                <button
                  onClick={() => setModalOrder(latestOrder)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition cursor-pointer"
                >
                  View Details
                </button>
                {latestOrder.editable && (
                  <>
                    <button
                      onClick={() => handleConfirmLockClick(latestOrder)}
                      disabled={confirmingLockId === latestOrder.backendId || cancellingId === latestOrder.backendId}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-50 transition cursor-pointer"
                    >
                      {confirmingLockId === latestOrder.backendId ? "Confirming..." : "Confirm Now"}
                    </button>
                    <button
                      onClick={() => handleCancelClick(latestOrder)}
                      disabled={cancellingId === latestOrder.backendId || confirmingLockId === latestOrder.backendId}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 transition cursor-pointer"
                    >
                      {cancellingId === latestOrder.backendId ? "Cancelling..." : "Cancel Order"}
                    </button>
                  </>
                )}
              </div>
            </div>

            <EditWindowBanner
              createdAt={latestOrder.createdAt}
              backendStatus={latestOrder.backendStatus}
              onExpired={loadOrders}
            />

            {/* Stepper */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {(latestOrder.statusHistory ?? []).map((step) => {
                const isComplete = step.completed;
                return (
                  <div key={step.name} className="text-center">
                    <div className={`h-2 rounded-full mb-2.5 transition-all ${isComplete ? "bg-emerald-500" : "bg-slate-100"}`} />
                    <div className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center transition-all ${
                      isComplete ? "bg-emerald-500 text-white shadow-2xs" : "bg-white border-2 border-slate-200"
                    }`}>
                      {isComplete && <FiCheck size={14} />}
                    </div>
                    <p className={`text-xs mt-1.5 font-bold ${isComplete ? "text-slate-800" : "text-slate-400"}`}>
                      {step.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Orders Table Section */}
          <section className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 gap-4">
              <div>
                <h2 className="font-bold text-slate-800 text-lg">Orders History</h2>
                <p className="text-xs text-slate-400 font-normal">All orders placed with distributors</p>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-1 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/50">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition cursor-pointer ${
                      activeTab === tab
                        ? "bg-white text-blue-600 shadow-2xs font-bold border border-slate-100"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-100">
                  <tr>
                    <th className="text-left px-6 py-3.5">Order ID</th>
                    <th className="text-left px-6 py-3.5">Distributor</th>
                    <th className="text-left px-6 py-3.5">Type</th>
                    <th className="text-left px-6 py-3.5">Date</th>
                    <th className="text-left px-6 py-3.5">Items</th>
                    <th className="text-left px-6 py-3.5">Total</th>
                    <th className="text-left px-6 py-3.5">Status</th>
                    <th className="text-left px-6 py-3.5">Payment</th>
                    <th className="text-center px-6 py-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400 font-semibold">
                        <FiClipboard size={32} className="mx-auto mb-2 opacity-30" />
                        <p className="text-sm font-bold">No orders in this category.</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((order) => (
                      <tr key={order.orderId} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4 font-bold text-blue-600">{order.orderId}</td>
                        <td className="px-6 py-4 text-slate-700 max-w-[160px]">
                          <p className="truncate font-semibold text-slate-800">{order.distributor}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${getTypeClass(order.orderType)}`}>
                            {order.orderType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap">{formatDate(order.createdAt)}</td>
                        <td className="px-6 py-4 text-slate-500 font-medium">
                          {(order.items ?? []).length} item{(order.items ?? []).length !== 1 ? "s" : ""}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-800">{formatCurrency(order.total)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-semibold ${getStatusClass(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium text-xs">{order.paymentLabel}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setModalOrder(order)}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition whitespace-nowrap cursor-pointer"
                            >
                              View Detail
                            </button>
                            {order.editable && (
                              <>
                                <button
                                  onClick={() => handleConfirmLockClick(order)}
                                  disabled={confirmingLockId === order.backendId || cancellingId === order.backendId}
                                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-50 transition whitespace-nowrap cursor-pointer"
                                >
                                  {confirmingLockId === order.backendId
                                    ? <FiLoader className="animate-spin" size={13} />
                                    : "Confirm"}
                                </button>
                                <button
                                  onClick={() => handleCancelClick(order)}
                                  disabled={cancellingId === order.backendId || confirmingLockId === order.backendId}
                                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 transition cursor-pointer"
                                >
                                  {cancellingId === order.backendId
                                    ? <FiLoader className="animate-spin" size={13} />
                                    : "Cancel"}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            <Pagination
              currentPage={currentPage}
              totalItems={filteredOrders.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
              label="orders"
            />
          </section>
        </>
      )}

      {/* Modals */}
      <OrderDetailModal
        order={modalOrder}
        onClose={() => setModalOrder(null)}
        onCancel={handleCancelClick}
        cancellingId={cancellingId}
        onConfirmLock={handleConfirmLockClick}
        confirmingLockId={confirmingLockId}
      />

      {orderToCancel && (
        <CancelConfirmModal
          orderId={orderToCancel.orderId}
          onConfirm={handleCancelConfirm}
          onClose={() => setOrderToCancel(null)}
          isCancelling={cancellingId === orderToCancel.backendId}
        />
      )}

      {orderToConfirmLock && (
        <ConfirmNowModal
          orderId={orderToConfirmLock.orderId}
          onConfirm={handleConfirmLockConfirm}
          onClose={() => setOrderToConfirmLock(null)}
          isConfirming={confirmingLockId === orderToConfirmLock.backendId}
        />
      )}
    </div>
  );
}

export default MyOrders;
