import { apiFetch } from "../utils/api";

// ---------------------------------------------------------------------------
// Backend status  →  UI display label / progress-step mapping
// ---------------------------------------------------------------------------
const STATUS_MAP = {
  Pending:          "Placed",
  Processing:       "Accepted",
  Approved:         "Packed",
  "Out for Delivery": "Out for Delivery",
  Delivered:        "Delivered",
  Rejected:         "Cancelled",
};

// UI progress steps used in MyOrders status tracker
const STATUS_STEPS = ["Placed", "Accepted", "Packed", "Out for Delivery", "Delivered"];

function mapStatus(backendStatus) {
  return STATUS_MAP[backendStatus] ?? backendStatus;
}

/**
 * Build a statusHistory array (compatible with MyOrders UI) from a backend order.
 * The backend does not store individual step timestamps, so we synthesise them:
 *   - Every step up to and including the current one is marked completed.
 *   - The current step gets the order's updated_at / created_at as its timestamp.
 */
function buildStatusHistory(backendStatus, createdAt) {
  const uiStatus    = mapStatus(backendStatus);
  const activeIndex = STATUS_STEPS.indexOf(uiStatus);

  return STATUS_STEPS.map((step, idx) => ({
    name:      step,
    completed: idx <= activeIndex,
    date:      idx === activeIndex ? createdAt : (idx < activeIndex ? createdAt : ""),
  }));
}

/**
 * Normalise a raw backend order object into the shape the UI expects.
 *
 * Backend shape (key fields):
 *   order_id, distributor_name, total_amount, payment_method,
 *   created_at, status, editable,
 *   items[]: { product_id, product_name, unit, quantity, unit_price, total_price }
 */
function normaliseOrder(raw) {
  const uiStatus     = mapStatus(raw.status);
  const paymentLabel = raw.payment_method === "Credit" ? "Cash + Credit" : "Full Cash";

  const items = (raw.items ?? []).map((item) => ({
    id:        item.order_item_id ?? item.product_id,
    productId: item.product_id,
    name:      item.product_name ?? `Product #${item.product_id}`,
    unit:      item.unit ?? "",
    quantity:  Number(item.quantity),
    price:     Number(item.unit_price),
    total:     Number(item.total_price ?? item.unit_price * item.quantity),
    subtotal:  Number(item.unit_price) * Number(item.quantity),
    discount:  0,
    discountRate: 0,
  }));

  return {
    // IDs
    orderId:      `ORD-${raw.order_id}`,
    backendId:    Number(raw.order_id),

    // Display
    distributor:  raw.distributor_name ?? "Unknown",
    status:       uiStatus,
    backendStatus: raw.status,
    orderType:    raw.order_type ?? "Normal",     // backend may not have this — defaults Normal
    paymentType:  raw.payment_method === "Credit" ? "credit" : "cash",
    paymentLabel,

    // Financials
    total:        Number(raw.total_amount),
    subtotal:     Number(raw.total_amount),
    discount:     0,
    urgentCharge: 0,
    cashAmount:   Number(raw.total_amount),
    creditUsed:   0,

    // Dates
    createdAt:    raw.created_at,

    // Items & status timeline
    items,
    statusHistory: buildStatusHistory(raw.status, raw.created_at),

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
export async function placeOrder(token, items, paymentMethod = "Cash") {
  const result = await apiFetch("/retailer/orders.php", token, {
    method: "POST",
    body: JSON.stringify({
      payment_method: paymentMethod,
      items,
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
