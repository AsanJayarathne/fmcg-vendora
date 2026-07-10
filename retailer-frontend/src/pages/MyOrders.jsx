import { useContext, useMemo, useState } from "react";
import {
  FiBox,
  FiBriefcase,
  FiCheckCircle,
  FiClipboard,
  FiLoader,
  FiTruck,
  FiX,
  FiXCircle,
  FiZap,
} from "react-icons/fi";
import { OrderContext } from "../context/OrderContextObject";

const tabs = ["All Orders", "Normal Orders", "Urgent Orders", "Delivered", "Cancelled"];
const STATUS_STEPS = ["Placed", "Accepted", "Packed", "Out for Delivery", "Delivered"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCurrency(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString("en-US")}`;
}

function formatDate(date, includeTime = false) {
  if (!date) return "";
  const options = { day: "2-digit", month: "short", year: "numeric" };
  if (includeTime) { options.hour = "2-digit"; options.minute = "2-digit"; }
  return new Intl.DateTimeFormat("en-GB", options).format(new Date(date));
}

function getStatusClass(status) {
  if (status === "Delivered")        return "bg-green-100 text-green-700";
  if (status === "Cancelled")        return "bg-red-100 text-red-700";
  if (status === "Packed")           return "bg-orange-100 text-orange-700";
  if (status === "Out for Delivery") return "bg-violet-100 text-violet-700";
  if (status === "Accepted")         return "bg-teal-100 text-teal-700";
  return "bg-blue-100 text-blue-700";
}

function getTypeClass(type) {
  return type === "Urgent" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700";
}

function filterOrders(orders, tab) {
  if (tab === "Normal Orders") return orders.filter((o) => o.orderType === "Normal");
  if (tab === "Urgent Orders") return orders.filter((o) => o.orderType === "Urgent");
  if (tab === "Delivered")     return orders.filter((o) => o.status === "Delivered");
  if (tab === "Cancelled")     return orders.filter((o) => o.status === "Cancelled");
  return orders;
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, linkText, color }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4 items-start">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-blue-600 mt-1">{linkText}</p>
      </div>
    </div>
  );
}

// ── Order Detail Modal ────────────────────────────────────────────────────────

function OrderDetailModal({ order, onClose, onCancel, cancellingId }) {
  if (!order) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      {/* Modal panel */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Order Details</p>
            <h2 className="font-bold text-lg text-slate-900">{order.orderId}</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getTypeClass(order.orderType)}`}>
              {order.orderType}
            </span>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusClass(order.status)}`}>
              {order.status}
            </span>
            {order.editable && (
              <button
                onClick={() => onCancel(order)}
                disabled={cancellingId === order.backendId}
                className="flex items-center gap-1.5 border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-50 disabled:opacity-50 transition-colors"
              >
                <FiXCircle size={12} />
                {cancellingId === order.backendId ? "Cancelling…" : "Cancel Order"}
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-500 transition-colors ml-1"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto p-6 flex flex-col gap-5">

          {/* Info + Status side-by-side */}
          <div className="grid grid-cols-2 gap-4">
            {/* Order info */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Order Information</h3>
              <div className="space-y-2.5">
                {[
                  ["Order ID",    order.orderId],
                  ["Distributor", order.distributor],
                  ["Order Date",  formatDate(order.createdAt)],
                  ["Payment",     order.paymentLabel],
                  ["Order Type",  order.orderType],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="text-xs font-semibold text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status timeline */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Status Timeline</h3>
              <div className="space-y-2.5">
                {(order.statusHistory ?? []).map((step) => (
                  <div key={step.name} className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      step.completed ? "bg-green-500 text-white" : "border-2 border-gray-300"
                    }`}>
                      {step.completed && <FiCheckCircle size={11} />}
                    </span>
                    <span className={`flex-1 text-xs font-medium ${step.completed ? "text-slate-800" : "text-gray-400"}`}>
                      {step.name}
                    </span>
                    {step.date && (
                      <span className="text-xs text-gray-400">{formatDate(step.date, true)}</span>
                    )}
                  </div>
                ))}
                {order.status === "Cancelled" && (
                  <div className="flex items-center gap-2.5 text-red-600">
                    <FiXCircle size={16} className="shrink-0" />
                    <span className="text-xs font-semibold">Order Cancelled</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Financials strip */}
          <div className={`grid gap-3 text-center ${(order.urgentCharge ?? 0) > 0 ? "grid-cols-3" : "grid-cols-2"}`}>
            <div className="bg-blue-50 border border-blue-100 rounded-xl py-4">
              <p className="text-xs text-gray-500 mb-1">Subtotal</p>
              <p className="font-bold text-slate-800">{formatCurrency(order.subtotal)}</p>
            </div>
            {(order.urgentCharge ?? 0) > 0 && (
              <div className="bg-orange-50 border border-orange-100 rounded-xl py-4">
                <p className="text-xs text-gray-500 mb-1">Urgent Charge</p>
                <p className="font-bold text-orange-700">{formatCurrency(order.urgentCharge)}</p>
              </div>
            )}
            <div className="bg-green-50 border border-green-100 rounded-xl py-4">
              <p className="text-xs text-gray-500 mb-1">Total Paid</p>
              <p className="font-bold text-green-700">{formatCurrency(order.total)}</p>
            </div>
          </div>

          {/* Items table */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-2">Ordered Items</h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs">
                  <tr>
                    <th className="text-left px-4 py-3">Product</th>
                    <th className="text-left px-4 py-3">Unit</th>
                    <th className="text-center px-4 py-3">Qty</th>
                    <th className="text-right px-4 py-3">Unit Price</th>
                    <th className="text-right px-4 py-3">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(order.items ?? []).map((item, idx) => (
                    <tr key={item.id ?? idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{item.unit}</td>
                      <td className="px-4 py-3 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(item.price)}</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                  {(order.urgentCharge ?? 0) > 0 && (
                    <tr className="bg-orange-50">
                      <td className="px-4 py-3 text-orange-600 font-medium" colSpan={4}>Urgent Order Charge</td>
                      <td className="px-4 py-3 text-right font-semibold text-orange-700">
                        {formatCurrency(order.urgentCharge)}
                      </td>
                    </tr>
                  )}
                  <tr className="bg-gray-50 font-bold text-sm">
                    <td className="px-4 py-3 text-slate-900" colSpan={4}>Grand Total</td>
                    <td className="px-4 py-3 text-right text-blue-700">{formatCurrency(order.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
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
  const { orders, loading, error, cancelOrder, loadOrders } = useContext(OrderContext);

  const [activeTab,    setActiveTab]    = useState("All Orders");
  const [modalOrder,   setModalOrder]   = useState(null);   // order shown in modal
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelError,  setCancelError]  = useState(null);

  const filteredOrders  = useMemo(() => filterOrders(orders, activeTab), [orders, activeTab]);
  const latestOrder     = orders[0];
  const activeOrders    = orders.filter((o) => !["Delivered", "Cancelled"].includes(o.status));
  const urgentOrders    = orders.filter((o) => o.orderType === "Urgent");
  const deliveredOrders = orders.filter((o) => o.status === "Delivered");

  async function handleCancel(order) {
    if (!window.confirm(`Cancel order ${order.orderId}? This cannot be undone.`)) return;
    setCancelError(null);
    setCancellingId(order.backendId);
    try {
      await cancelOrder(order.backendId);
      setModalOrder(null); // close modal after cancel
    } catch (err) {
      setCancelError(err.message || "Failed to cancel order.");
    } finally {
      setCancellingId(null);
    }
  }

  // Loading state
  if (loading && orders.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="flex items-center gap-3 text-gray-500">
          <FiLoader className="animate-spin" size={20} />
          <span>Loading orders…</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error && orders.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center">
          <p className="font-semibold">⚠️ {error}</p>
          <button onClick={loadOrders} className="mt-4 bg-red-600 text-white px-5 py-2 rounded-lg text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">

      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
          <FiTruck className="w-8 h-8" />
          <span>My Orders</span>
        </h1>
        <p className="text-gray-500 text-sm">
          Track distributor orders, payment details, and delivery status.
        </p>
      </div>

      {/* Cancel error banner */}
      {cancelError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm font-medium flex justify-between">
          <span>⚠️ {cancelError}</span>
          <button onClick={() => setCancelError(null)} className="underline ml-4">Dismiss</button>
        </div>
      )}

      {/* ── ROW 1 · KPI Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard icon={<FiBriefcase size={22} />} label="Total Orders"    value={orders.length}          linkText="All time"    color="bg-blue-100 text-blue-700"    />
        <StatCard icon={<FiTruck size={22} />}      label="Active Orders"   value={activeOrders.length}    linkText="In progress" color="bg-green-100 text-green-700"   />
        <StatCard icon={<FiZap size={22} />}        label="Urgent Orders"   value={urgentOrders.length}    linkText="Priority"    color="bg-red-100 text-red-700"      />
        <StatCard icon={<FiClipboard size={22} />}  label="Delivered"       value={deliveredOrders.length} linkText="Completed"   color="bg-violet-100 text-violet-700" />
      </div>

      {!latestOrder ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500">
          No confirmed orders yet.
        </div>
      ) : (
        <>
          {/* ── ROW 2 · Latest Order Progress Card (full width) ─────────────── */}
          <section className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                  <FiClipboard size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-2">Latest Order</p>
                  <div className="flex flex-wrap gap-x-8 gap-y-2">
                    <div>
                      <p className="text-xs text-gray-400">Order ID</p>
                      <p className="text-lg font-bold text-violet-700">{latestOrder.orderId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Distributor</p>
                      <p className="font-bold text-slate-900">{latestOrder.distributor}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Status</p>
                      <p className="font-bold text-orange-600 flex items-center gap-1">
                        <FiBox size={13} /> {latestOrder.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Total</p>
                      <p className="font-bold text-slate-900">{formatCurrency(latestOrder.total)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Date</p>
                      <p className="text-sm text-gray-600">{formatDate(latestOrder.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getTypeClass(latestOrder.orderType)}`}>
                  {latestOrder.orderType} Order
                </span>
                <button
                  onClick={() => setModalOrder(latestOrder)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>

            {/* Progress stepper */}
            <div className="grid grid-cols-5 gap-2">
              {STATUS_STEPS.map((step) => {
                const activeIndex = STATUS_STEPS.indexOf(latestOrder.status);
                const stepIndex   = STATUS_STEPS.indexOf(step);
                const isComplete  = stepIndex <= activeIndex && activeIndex !== -1;
                return (
                  <div key={step} className="text-center">
                    <div className={`h-1.5 rounded-full mb-2 ${isComplete ? "bg-green-500" : "bg-gray-200"}`} />
                    <div className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center ${
                      isComplete ? "bg-green-500 text-white" : "bg-white border-2 border-gray-200"
                    }`}>
                      {isComplete && <FiCheckCircle size={14} />}
                    </div>
                    <p className="text-xs font-medium mt-1.5 text-gray-600">{step}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── ROW 3 · Full-width Orders Table ────────────────────────────── */}
          <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Table header row */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b">
              <h2 className="font-bold text-slate-900 text-lg">Orders</h2>

              {/* Tabs */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all ${
                      activeTab === tab
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs">
                  <tr>
                    <th className="text-left px-5 py-3.5">Order ID</th>
                    <th className="text-left px-5 py-3.5">Distributor</th>
                    <th className="text-left px-5 py-3.5">Type</th>
                    <th className="text-left px-5 py-3.5">Date</th>
                    <th className="text-left px-5 py-3.5">Items</th>
                    <th className="text-left px-5 py-3.5">Total</th>
                    <th className="text-left px-5 py-3.5">Status</th>
                    <th className="text-left px-5 py-3.5">Payment</th>
                    <th className="text-center px-5 py-3.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-gray-400">
                        <FiClipboard size={32} className="mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No orders in this category.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 font-bold text-violet-700">{order.orderId}</td>
                        <td className="px-5 py-4 text-slate-700 max-w-[160px]">
                          <p className="truncate font-medium">{order.distributor}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getTypeClass(order.orderType)}`}>
                            {order.orderType}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                        <td className="px-5 py-4 text-gray-500">
                          {(order.items ?? []).length} item{(order.items ?? []).length !== 1 ? "s" : ""}
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-800">{formatCurrency(order.total)}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-500 text-xs">{order.paymentLabel}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {/* View Detail button */}
                            <button
                              onClick={() => setModalOrder(order)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors whitespace-nowrap"
                            >
                              View Detail
                            </button>
                            {/* Cancel button (only if editable) */}
                            {order.editable && (
                              <button
                                onClick={() => handleCancel(order)}
                                disabled={cancellingId === order.backendId}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                              >
                                {cancellingId === order.backendId
                                  ? <FiLoader className="animate-spin" size={11} />
                                  : "Cancel"}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            {filteredOrders.length > 0 && (
              <div className="px-5 py-3 border-t bg-gray-50 text-xs text-gray-500">
                Showing {filteredOrders.length} of {orders.length} orders
              </div>
            )}
          </section>
        </>
      )}

      {/* ── Order Detail Modal ──────────────────────────────────────────────── */}
      <OrderDetailModal
        order={modalOrder}
        onClose={() => setModalOrder(null)}
        onCancel={handleCancel}
        cancellingId={cancellingId}
      />
    </div>
  );
}

export default MyOrders;
