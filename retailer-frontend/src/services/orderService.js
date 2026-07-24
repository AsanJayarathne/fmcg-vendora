import { apiFetch } from "../utils/api";

// UI progress steps used in MyOrders status tracker
const STATUS_STEPS = ["Placed", "Accepted", "Out for Delivery", "Delivered"];

function determineUIStatus(backendStatus, deliveryStatus) {
  if (backendStatus === "Delivered") return "Delivered";
  if (backendStatus === "Rejected") return "Cancelled";
  if (deliveryStatus === "CLAIMED") return "Out for Delivery";
  if (backendStatus === "Approved") return "Accepted";
  if (backendStatus === "Processing") return "Placed";
  return "Pending";
}

/**
 * Build a statusHistory array (compatible with MyOrders UI) from a backend order.
 */
function buildStatusHistory(backendStatus, deliveryStatus, createdAt) {
  const isPlaced = ["Processing", "Approved", "Delivered"].includes(backendStatus);
  const isAccepted = ["Approved", "Delivered"].includes(backendStatus);
  const isOutForDelivery = ["CLAIMED", "DELIVERED"].includes(deliveryStatus) || backendStatus === "Delivered";
  const isDelivered = backendStatus === "Delivered";

  return [
    { name: "Placed",           completed: isPlaced,           date: isPlaced ? createdAt : "" },
    { name: "Accepted",         completed: isAccepted,         date: isAccepted ? createdAt : "" },
    { name: "Out for Delivery", completed: isOutForDelivery,   date: isOutForDelivery ? createdAt : "" },
    { name: "Delivered",        completed: isDelivered,        date: isDelivered ? createdAt : "" },
  ];
}

/**
 * Normalise a raw backend order object into the shape the UI expects.
 */
function normaliseOrder(raw) {
  const uiStatus = determineUIStatus(raw.status, raw.delivery_status);

  // Determine payment label from backend method
  let paymentLabel = "Full Cash";
  if (raw.payment_method === "Credit") paymentLabel = "Full Credit";
  else if (raw.payment_method === "Cash_Credit") paymentLabel = "Cash + Credit";

  const creditUsed = Number(raw.credit_amount ?? 0);
  const cashAmount = Number(raw.cash_amount ?? 0);

  const items = (raw.items ?? []).map((item) => {
    const qty = Number(item.quantity);
    const price = Number(item.unit_price);
    const subtotal = price * qty;
    const total = Number(item.total_price ?? subtotal);
    const discount = Math.max(0, subtotal - total);
    
    let discountRate = 0;
    if (qty >= 56) discountRate = 15;
    else if (qty >= 32) discountRate = 10;
    else if (qty >= 8) discountRate = 5;

    return {
      id:        item.order_item_id ?? item.product_id,
      productId: item.product_id,
      name:      item.product_name ?? `Product #${item.product_id}`,
      unit:      item.unit ?? "",
      quantity:  qty,
      price,
      total,
      subtotal,
      discount,
      discountRate,
    };
  });

  const orderSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const orderDiscount = items.reduce((sum, item) => sum + item.discount, 0);
  const isUrgent = raw.order_type === "Urgent";
  const urgentCharge = isUrgent ? 500 : 0;

  return {
    // IDs
    orderId:      `ORD-${raw.order_id}`,
    backendId:    Number(raw.order_id),

    // Display
    distributor:  raw.distributor_name ?? "Unknown",
    status:       uiStatus,
    backendStatus: raw.status,
    orderType:    raw.order_type ?? "Normal",
    paymentType:  raw.payment_method === "Cash" ? "cash" : (raw.payment_method === "Credit" ? "credit" : "cash_credit"),
    paymentMethod: raw.payment_method,
    paymentLabel,

    // Financials
    total:        Number(raw.total_amount),
    subtotal:     orderSubtotal,
    discount:     orderDiscount,
    urgentCharge,
    cashAmount,
    creditUsed,

    // Dates
    createdAt:    raw.created_at,

    // Delivery Status
    deliveryStatus: raw.delivery_status,

    // Items & status timeline
    items,
    statusHistory: buildStatusHistory(raw.status, raw.delivery_status, raw.created_at),

    // Can the retailer still edit / cancel?
    editable: raw.editable === true || raw.editable === 1,
  };
}

// ---------------------------------------------------------------------------
// Public API functions
// ---------------------------------------------------------------------------

/**
 * Place a new order.
 *
 * @param {string} token
 * @param {Array}  items          — [{ product_id, quantity }]
 * @param {string} paymentMethod  — "Cash" | "Credit"
 * @returns {Promise<object>}  normalised order
 */
export async function placeOrder(token, items, paymentMethod = "Cash", distributorId = null, creditAmount = 0, cashAmount = 0) {
  const result = await apiFetch("/retailer/orders.php", token, {
    method: "POST",
    body: JSON.stringify({
      payment_method: paymentMethod,
      items,
      distributor_id: distributorId,
      credit_amount: creditAmount,
      cash_amount: cashAmount,
    }),
  });
  return normaliseOrder(result.data);
}

/**
 * Fetch all orders for the authenticated retailer.
 *
 * @param {string} token
 * @returns {Promise<Array>}  array of normalised orders
 */
export async function fetchOrders(token) {
  const result = await apiFetch("/retailer/orders.php", token);
  const raw    = Array.isArray(result.data) ? result.data : [];
  return raw.map(normaliseOrder);
}

/**
 * Fetch a single order with its items.
 *
 * @param {string} token
 * @param {number} orderId  — numeric backend ID
 * @returns {Promise<object>}  normalised order
 */
export async function fetchOrderDetail(token, orderId) {
  const result = await apiFetch(`/retailer/orders.php?id=${orderId}`, token);
  return normaliseOrder(result.data);
}

/**
 * Cancel an order (only possible while editable).
 *
 * @param {string} token
 * @param {number} orderId  — numeric backend ID
 * @returns {Promise<void>}
 */
export async function cancelOrder(token, orderId) {
  await apiFetch(`/retailer/orders.php?id=${orderId}`, token, {
    method: "DELETE",
  });
}

/**
 * Fetch credit account information for the authenticated retailer.
 * Returns null if no credit account exists.
 *
 * @param {string} token
 * @returns {Promise<object|null>}
 *   { credit_limit, available_credit, current_balance, status, transactions[] }
 */
export async function fetchCreditInfo(token) {
  try {
    const result = await apiFetch("/retailer/credit.php", token);
    return result.data ?? null;
  } catch (err) {
    // 404 = no credit account — treat as null (not an error for the UI)
    if (err.status === 404) return null;
    throw err;
  }
}

/**
 * Confirm and lock an order immediately.
 *
 * @param {string} token
 * @param {number} orderId  — numeric backend ID
 * @returns {Promise<object>} normalised order
 */
export async function confirmOrderNow(token, orderId) {
  const result = await apiFetch(`/retailer/orders.php?id=${orderId}&action=confirm`, token, {
    method: "PUT",
  });
  return normaliseOrder(result.data);
}
