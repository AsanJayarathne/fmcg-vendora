export const LOCK_WINDOW_MS = 15 * 60 * 1000; // must match backend LOCK_WINDOW_MINUTES

export function formatCurrency(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString("en-US")}`;
}

export function formatDate(date, includeTime = false) {
  if (!date) return "";
  const options = { day: "2-digit", month: "short", year: "numeric" };
  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }
  return new Intl.DateTimeFormat("en-GB", options).format(new Date(date));
}

export function getStatusClass(status) {
  if (status === "Delivered") return "bg-green-100 text-green-700";
  if (status === "Cancelled") return "bg-red-100 text-red-700";
  if (status === "Packed") return "bg-orange-100 text-orange-700";
  if (status === "Out for Delivery") return "bg-violet-100 text-violet-700";
  if (status === "Accepted") return "bg-teal-100 text-teal-700";
  return "bg-blue-100 text-blue-700";
}

export function getTypeClass(type) {
  return type === "Urgent" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700";
}

export function filterOrders(orders, tab) {
  if (tab === "Normal Orders") return orders.filter((o) => o.orderType === "Normal");
  if (tab === "Urgent Orders") return orders.filter((o) => o.orderType === "Urgent");
  if (tab === "Delivered") return orders.filter((o) => o.status === "Delivered");
  if (tab === "Cancelled") return orders.filter((o) => o.status === "Cancelled");
  return orders;
}
