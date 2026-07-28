export const LOCK_WINDOW_MS = 15 * 60 * 1000; // must match backend LOCK_WINDOW_MINUTES

export function formatCurrency(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(date, includeTime = false) {
  if (!date) return "";
  const rawStr = String(date).replace(" ", "T");
  const d = new Date(rawStr);
  if (isNaN(d.getTime())) return String(date);

  const options = { day: "2-digit", month: "short", year: "numeric" };
  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }
  return new Intl.DateTimeFormat("en-GB", options).format(d);
}

export function getStatusClass(status) {
  if (status === "Delivered") {
    return "bg-emerald-50 text-emerald-700 border border-emerald-200/60";
  }
  if (status === "Cancelled" || status === "Rejected") {
    return "bg-red-50 text-red-700 border border-red-200/60";
  }
  if (status === "Accepted" || status === "Approved") {
    return "bg-blue-50 text-blue-700 border border-blue-200/60";
  }
  if (status === "Processing" || status === "Placed") {
    return "bg-sky-50 text-sky-700 border border-sky-200/60";
  }
  if (status === "Out for Delivery" || status === "CLAIMED") {
    return "bg-purple-50 text-purple-700 border border-purple-200/60";
  }
  return "bg-amber-50 text-amber-700 border border-amber-200/60";
}

export function getTypeClass(type) {
  return type === "Urgent"
    ? "bg-rose-50 text-rose-700 border border-rose-200/60"
    : "bg-slate-100 text-slate-700 border border-slate-200/60";
}

export function filterOrders(orders, tab) {
  if (tab === "Normal Orders") return orders.filter((o) => o.orderType === "Normal");
  if (tab === "Urgent Orders") return orders.filter((o) => o.orderType === "Urgent");
  if (tab === "Delivered") return orders.filter((o) => o.status === "Delivered");
  if (tab === "Cancelled") return orders.filter((o) => o.status === "Cancelled" || o.backendStatus === "Rejected");
  return orders;
}
