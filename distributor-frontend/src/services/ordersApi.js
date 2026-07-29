const API_BASE = "http://localhost/fmcg-vendora/backend/api";

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

export async function fetchOrders(token, status = "") {
  const url = status
    ? `${API_BASE}/distributor/orders.php?status=${encodeURIComponent(status)}`
    : `${API_BASE}/distributor/orders.php`;
  const res = await fetch(url, { headers: authHeaders(token) });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to load orders");
  return json.data;
}

export async function fetchOrderById(token, orderId) {
  const res = await fetch(`${API_BASE}/distributor/orders.php?id=${orderId}`, {
    headers: authHeaders(token),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to load order");
  return json.data;
}

export async function approveOrder(token, orderId) {
  const res = await fetch(
    `${API_BASE}/distributor/orders.php?id=${orderId}&action=approve`,
    { method: "PUT", headers: authHeaders(token) }
  );
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to approve order");
  return json.data;
}

export async function rejectOrder(token, orderId) {
  const res = await fetch(
    `${API_BASE}/distributor/orders.php?id=${orderId}&action=reject`,
    { method: "PUT", headers: authHeaders(token) }
  );
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to reject order");
  return json;
}

/** Fetch all deliveries for the distributor — re-exported from deliveryApi for backward compatibility */
export { fetchDeliveries } from "./deliveryApi";
