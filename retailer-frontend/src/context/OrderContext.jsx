import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { fetchOrders, cancelOrder as apiCancelOrder, confirmOrderNow as apiConfirmOrder } from "../services/orderService";
import {
  fetchNotifications,
  markNotificationRead as apiMarkNotificationRead,
  markAllNotificationsRead as apiMarkAllNotificationsRead,
} from "../services/notificationApi";

export const OrderContext = createContext();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildMessageFromOrder(order) {
  const quantity = (order.items ?? []).reduce((sum, item) => sum + item.quantity, 0);
  const creditText =
    order.paymentType === "credit"
      ? ` Cash paid Rs. ${order.cashAmount}; credit used Rs. ${order.creditUsed}.`
      : ` Full cash payment of Rs. ${order.total}.`;

  return {
    id:             `MSG-${order.orderId}`,
    notificationId: null,
    orderId:        order.orderId,
    title:          `Order ${order.orderId} confirmed`,
    body:           `${order.distributor} order confirmed with ${quantity} units across ${(order.items ?? []).length} product lines.${creditText} Total amount Rs. ${order.total}.`,
    createdAt:      order.createdAt,
    read:           false,
  };
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function OrderProvider({ children }) {
  const { auth } = useAuth();
  const token    = auth?.token ?? null;

  const [orders,        setOrders]        = useState([]);
  const [dbNotifs,      setDbNotifs]      = useState([]);
  const [dbUnreadCount, setDbUnreadCount] = useState(0);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState(null);

  // Local fallback read tracking for synthesized order messages
  const [readOrderIds, setReadOrderIds] = useState(new Set());

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

  // ── Fetch backend notifications ────────────────────────────────
  const loadNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const data = await fetchNotifications(token);
      setDbNotifs(data.notifications || []);
      setDbUnreadCount(Number(data.unread_count || 0));
    } catch (err) {
      // silent background error
    }
  }, [token]);

  useEffect(() => {
    loadOrders();
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [loadOrders, loadNotifications]);

  // ── Add a just-placed order to local state immediately ─────────
  const addOrder = useCallback((normalisedOrder) => {
    setOrders((prev) => [normalisedOrder, ...prev]);
    return normalisedOrder;
  }, []);

  // ── Cancel an order ────────────────────────────────────────────
  const cancelOrder = useCallback(async (backendId) => {
    await apiCancelOrder(token, backendId);
    await loadOrders();
    await loadNotifications();
  }, [token, loadOrders, loadNotifications]);

  // ── Confirm an order immediately ───────────────────────────────
  const confirmOrder = useCallback(async (backendId) => {
    await apiConfirmOrder(token, backendId);
    await loadOrders();
    await loadNotifications();
  }, [token, loadOrders, loadNotifications]);

  // ── Mark a message / notification as read ──────────────────────
  const markMessageRead = useCallback(
    async (idOrOrderId) => {
      // Check if this matches a DB notification ID
      const notif = dbNotifs.find(
        (n) => n.notification_id === idOrOrderId || `NOTIF-${n.notification_id}` === idOrOrderId || n.notification_id === Number(idOrOrderId)
      );

      if (notif && token) {
        try {
          await apiMarkNotificationRead(token, notif.notification_id);
          setDbNotifs((prev) =>
            prev.map((n) =>
              n.notification_id === notif.notification_id
                ? { ...n, is_read: 1 }
                : n
            )
          );
          setDbUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (err) {
          console.error("Failed to mark DB notification as read:", err);
        }
      } else {
        // Fallback for order ID
        setReadOrderIds((prev) => new Set([...prev, idOrOrderId]));
      }
    },
    [dbNotifs, token]
  );

  // ── Mark all as read ───────────────────────────────────────────
  const markAllMessagesRead = useCallback(async () => {
    if (token && dbUnreadCount > 0) {
      try {
        await apiMarkAllNotificationsRead(token);
        setDbNotifs((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
        setDbUnreadCount(0);
      } catch (err) {
        console.error("Failed to mark all DB notifications as read:", err);
      }
    }
  }, [token, dbUnreadCount]);

  // ── Derived messages list ──────────────────────────────────────
  const messages = useMemo(() => {
    if (dbNotifs.length > 0) {
      return dbNotifs.map((n) => ({
        id:             n.notification_id,
        notificationId: n.notification_id,
        orderId:        n.notification_id,
        title:          n.title,
        body:           n.message,
        createdAt:      n.created_at,
        read:           Boolean(Number(n.is_read)),
      }));
    }

    // Fallback if no DB notifications yet
    return orders.map((order) => ({
      ...buildMessageFromOrder(order),
      read: readOrderIds.has(order.orderId),
    }));
  }, [dbNotifs, orders, readOrderIds]);

  const unreadMessageCount = useMemo(() => {
    if (dbNotifs.length > 0) {
      return dbUnreadCount;
    }
    return messages.filter((m) => !m.read).length;
  }, [dbNotifs, dbUnreadCount, messages]);

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
        loadNotifications,
        markMessageRead,
        markAllMessagesRead,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export default OrderProvider;
