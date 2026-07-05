import { useMemo, useState } from "react";
import { OrderContext } from "./OrderContextObject";

const STORAGE_KEY = "retailerOrders";

function loadOrders() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

function getPaymentLabel(order) {
  return order.paymentType === "credit" ? "Cash + Credit" : "Full Cash";
}

function buildMessage(order) {
  const quantity = order.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const creditText =
    order.paymentType === "credit"
      ? ` Cash paid Rs. ${order.cashAmount}; credit used Rs. ${order.creditUsed}.`
      : ` Full cash payment of Rs. ${order.total}.`;
  const urgentText =
    order.urgentCharge > 0
      ? ` Urgent order charge Rs. ${order.urgentCharge} included.`
      : "";

  return {
    id: `MSG-${order.orderId}`,
    orderId: order.orderId,
    title: `Order ${order.orderId} confirmed`,
    body: `${order.distributor} ${order.orderType.toLowerCase()} order confirmed with ${quantity} units across ${order.items.length} product lines.${urgentText}${creditText} Total amount Rs. ${order.total}.`,
    createdAt: order.createdAt,
    read: false,
  };
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(loadOrders);

  const addOrder = (order) => {
    const message = buildMessage(order);
    const orderWithMessage = {
      ...order,
      paymentLabel: getPaymentLabel(order),
      message,
    };

    setOrders((currentOrders) => {
      const nextOrders = [orderWithMessage, ...currentOrders];
      saveOrders(nextOrders);
      return nextOrders;
    });

    return orderWithMessage;
  };

  const messages = useMemo(
    () => orders.map((order) => order.message).filter(Boolean),
    [orders]
  );

  const unreadMessageCount = useMemo(
    () => messages.filter((message) => !message.read).length,
    [messages]
  );

  return (
    <OrderContext.Provider
      value={{
        orders,
        messages,
        unreadMessageCount,
        addOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export default OrderProvider;
