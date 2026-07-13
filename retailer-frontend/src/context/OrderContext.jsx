import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { fetchOrders, cancelOrder as apiCancelOrder, confirmOrderNow as apiConfirmOrder } from "../services/orderService";

export const OrderContext = createContext();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildMessage(order) {
  const quantity = (order.items ?? []).reduce((sum, item) => sum + item.quantity, 0);
  const creditText =
    order.paymentType === "credit"
      ? ` Cash paid Rs. ${order.cashAmount}; credit used Rs. ${order.creditUsed}.`
      : ` Full cash payment of Rs. ${order.total}.`;

  return {
    id:        `MSG-${order.orderId}`,
    orderId:   order.orderId,
    title:     `Order ${order.orderId} confirmed`,
    body:      `${order.distributor} order confirmed with ${quantity} units across ${(order.items ?? []).length} product lines.${creditText} Total amount Rs. ${order.total}.`,
    createdAt: order.createdAt,
    read:      false,
  };
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function OrderProvider({ children }) {
  const { auth } = useAuth();
  const token    = auth?.token ?? null;

  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // Local list of "just placed" order IDs whose messages haven't been read yet.
  // We track message read-state in local state only (not persisted).
  const [readIds, setReadIds] = useState(new Set());

  // ── Fetch all orders from backend ──────────────────────────────
  const loadOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrders(token);
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // ── Add a just-placed order to local state immediately ─────────
  // (The order was already POSTed by Payment.jsx; we just prepend it
  //  so the UI updates instantly without waiting for a re-fetch.)
  const addOrder = useCallback((normalisedOrder) => {
    setOrders((prev) => [normalisedOrder, ...prev]);
    return normalisedOrder;
  }, []);

  // ── Cancel an order ────────────────────────────────────────────
  const cancelOrder = useCallback(async (backendId) => {
    await apiCancelOrder(token, backendId);
    // Refresh the list so status is up to date
    await loadOrders();
  }, [token, loadOrders]);

  // ── Confirm an order immediately ───────────────────────────────
  const confirmOrder = useCallback(async (backendId) => {
    await apiConfirmOrder(token, backendId);
    // Refresh the list so status is up to date
    await loadOrders();
  }, [token, loadOrders]);

  // ── Mark a message as read ─────────────────────────────────────
  const markMessageRead = useCallback((orderId) => {
    setReadIds((prev) => new Set([...prev, orderId]));
  }, []);

  // ── Derived: messages sidebar ──────────────────────────────────
  const messages = useMemo(
    () =>
      orders.map((order) => ({
        ...buildMessage(order),
        read: readIds.has(order.orderId),
      })),
    [orders, readIds]
  );

  const unreadMessageCount = useMemo(
    () => messages.filter((m) => !m.read).length,
    [messages]
  );

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        messages,
        unreadMessageCount,
        addOrder,
        cancelOrder,
        confirmOrder,
        loadOrders,
        markMessageRead,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export default OrderProvider;
