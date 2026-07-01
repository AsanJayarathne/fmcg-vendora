import { useContext, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiBox,
  FiBriefcase,
  FiCheckCircle,
  FiClipboard,
  FiTruck,
  FiZap,
} from "react-icons/fi";
import { OrderContext } from "../context/OrderContextObject";

const tabs = ["All Orders", "Normal Orders", "Urgent Orders", "Delivered", "Cancelled"];
const statusSteps = ["Placed", "Accepted", "Packed", "Out for Delivery", "Delivered"];

function formatCurrency(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString("en-US")}`;
}

function formatDate(date, includeTime = false) {
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return new Intl.DateTimeFormat("en-GB", options).format(new Date(date));
}

function getStatusClass(status) {
  if (status === "Delivered") {
    return "bg-green-100 text-green-700";
  }

  if (status === "Cancelled") {
    return "bg-red-100 text-red-700";
  }

  if (status === "Packed") {
    return "bg-orange-100 text-orange-700";
  }

  if (status === "Out for Delivery") {
    return "bg-violet-100 text-violet-700";
  }

  return "bg-blue-100 text-blue-700";
}

function getTypeClass(type) {
  return type === "Urgent"
    ? "bg-red-100 text-red-700"
    : "bg-blue-100 text-blue-700";
}

function filterOrders(orders, activeTab) {
  if (activeTab === "Normal Orders") {
    return orders.filter((order) => order.orderType === "Normal");
  }

  if (activeTab === "Urgent Orders") {
    return orders.filter((order) => order.orderType === "Urgent");
  }

  if (activeTab === "Delivered") {
    return orders.filter((order) => order.status === "Delivered");
  }

  if (activeTab === "Cancelled") {
    return orders.filter((order) => order.status === "Cancelled");
  }

  return orders;
}

function StatCard({ icon, label, value, linkText, color }) {
  return (
    <div className="bg-white border rounded-xl p-5 flex gap-4 items-start">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-blue-600 mt-1">{linkText}</p>
      </div>
    </div>
  );
}

function MyOrders() {
  const { orders } = useContext(OrderContext);
  const [activeTab, setActiveTab] = useState("All Orders");
  const [selectedOrderId, setSelectedOrderId] = useState("");

  const filteredOrders = useMemo(
    () => filterOrders(orders, activeTab),
    [orders, activeTab]
  );
  const latestOrder = orders[0];
  const selectedOrder =
    orders.find((order) => order.orderId === selectedOrderId) ||
    filteredOrders[0] ||
    latestOrder;

  const activeOrders = orders.filter(
    (order) => !["Delivered", "Cancelled"].includes(order.status)
  );
  const urgentOrders = orders.filter((order) => order.orderType === "Urgent");
  const deliveredOrders = orders.filter((order) => order.status === "Delivered");

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
          <div className="flex justify-between items-center mb-6">
            <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
          <FiTruck className="text-slate-900 w-8 h-8" />
          <span>My Orders</span>
        </h1>
        <p className="text-gray-500 mt-1">
          Track distributor orders, payment details, and delivery status.
        </p>
      </div>

      {!latestOrder ? (
        <div className="bg-white border rounded-xl p-8 text-center text-gray-500">
          No confirmed orders yet.
        </div>
      ) : (
        <>
          <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
            <section className="bg-white border rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
                    <FiClipboard size={26} />
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">Latest Order</p>
                    <div className="grid gap-5 md:grid-cols-4 mt-5">
                      <div>
                        <p className="text-xs text-gray-500">Order ID</p>
                        <p className="text-xl font-bold text-violet-700">
                          {latestOrder.orderId}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Distributor</p>
                        <p className="font-bold">{latestOrder.distributor}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Current Status</p>
                        <p className="font-bold text-orange-600 flex items-center gap-2">
                          <FiBox /> {latestOrder.status}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total Amount</p>
                        <p className="font-bold">
                          {formatCurrency(latestOrder.total)}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDate(latestOrder.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <span className={`px-3 py-2 rounded-lg text-sm font-semibold ${getTypeClass(latestOrder.orderType)}`}>
                  {latestOrder.orderType} Order
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2 mt-8">
                {statusSteps.map((step) => {
                  const activeIndex = statusSteps.indexOf(latestOrder.status);
                  const stepIndex = statusSteps.indexOf(step);
                  const isComplete = stepIndex <= activeIndex;

                  return (
                    <div key={step} className="text-center">
                      <div
                        className={`h-1 mb-3 ${isComplete ? "bg-green-500" : "bg-gray-200"}`}
                      />
                      <div
                        className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${
                          isComplete ? "bg-green-500 text-white" : "bg-white border-2"
                        }`}
                      >
                        {isComplete && <FiCheckCircle size={14} />}
                      </div>
                      <p className="text-xs font-medium mt-2">{step}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="grid gap-3 sm:grid-cols-2">
              <StatCard
                icon={<FiBriefcase size={24} />}
                label="Total Orders"
                value={orders.length}
                linkText="View all orders"
                color="bg-blue-100 text-blue-700"
              />
              <StatCard
                icon={<FiTruck size={24} />}
                label="Active Orders"
                value={activeOrders.length}
                linkText="View active orders"
                color="bg-green-100 text-green-700"
              />
              <StatCard
                icon={<FiZap size={24} />}
                label="Urgent Orders"
                value={urgentOrders.length}
                linkText="View urgent orders"
                color="bg-red-100 text-red-700"
              />
              <StatCard
                icon={<FiClipboard size={24} />}
                label="Delivered Orders"
                value={deliveredOrders.length}
                linkText="View delivered orders"
                color="bg-violet-100 text-violet-700"
              />
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
            <section className="bg-white border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-5">
                <h2 className="font-bold text-slate-900">Recent Orders</h2>
                <button
                  onClick={() => setActiveTab("All Orders")}
                  className="text-blue-600 text-sm font-semibold"
                >
                  View All
                </button>
              </div>

              <div className="flex gap-5 px-5 border-b overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 text-sm font-semibold whitespace-nowrap border-b-2 ${
                      activeTab === tab
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="text-left p-4">Order ID</th>
                      <th className="text-left p-4">Distributor</th>
                      <th className="text-left p-4">Order Type</th>
                      <th className="text-left p-4">Order Date</th>
                      <th className="text-left p-4">Total Amount</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredOrders.map((order) => (
                      <tr key={order.orderId}>
                        <td className="p-4 font-semibold">{order.orderId}</td>
                        <td className="p-4">{order.distributor}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getTypeClass(order.orderType)}`}>
                            {order.orderType}
                          </span>
                        </td>
                        <td className="p-4">{formatDate(order.createdAt)}</td>
                        <td className="p-4">{formatCurrency(order.total)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusClass(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => setSelectedOrderId(order.orderId)}
                            className="border border-blue-200 text-blue-600 px-3 py-2 rounded-lg text-xs font-semibold"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {selectedOrder && (
              <section className="bg-white border rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b">
                  <div className="flex items-center gap-3">
                    <FiArrowLeft />
                    <h2 className="font-bold">
                      Order Details - {selectedOrder.orderId}
                    </h2>
                  </div>
                  <span className={`px-3 py-2 rounded-lg text-sm font-semibold ${getTypeClass(selectedOrder.orderType)}`}>
                    {selectedOrder.orderType} Order
                  </span>
                </div>

                <div className="grid gap-4 p-5 md:grid-cols-2">
                  <div className="border rounded-xl p-4">
                    <h3 className="font-bold mb-4">Order Information</h3>
                    <div className="space-y-3 text-sm">
                      <p className="flex justify-between">
                        <span className="text-gray-500">Order ID</span>
                        <span className="font-semibold">{selectedOrder.orderId}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Distributor</span>
                        <span className="font-semibold">{selectedOrder.distributor}</span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Order Type</span>
                        <span className="font-semibold text-red-600">
                          {selectedOrder.orderType}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Order Date</span>
                        <span className="font-semibold">
                          {formatDate(selectedOrder.createdAt)}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Payment Method</span>
                        <span className="font-semibold">
                          {selectedOrder.paymentLabel}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Urgent Charge</span>
                        <span className="font-semibold">
                          {formatCurrency(selectedOrder.urgentCharge)}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="text-gray-500">Total Amount</span>
                        <span className="font-bold">
                          {formatCurrency(selectedOrder.total)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="border rounded-xl p-4">
                    <h3 className="font-bold mb-4">Order Status</h3>
                    <div className="space-y-4">
                      {selectedOrder.statusHistory.map((status) => (
                        <div key={status.name} className="flex gap-3 text-sm">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                              status.completed
                                ? "bg-green-500 text-white"
                                : "border-2 border-gray-300"
                            }`}
                          >
                            {status.completed && <FiCheckCircle size={13} />}
                          </span>
                          <span className="font-semibold flex-1">{status.name}</span>
                          <span className="text-gray-500">
                            {status.date ? formatDate(status.date, true) : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 overflow-x-auto">
                  <h3 className="font-bold mb-3">Ordered Items</h3>
                  <table className="w-full text-sm border rounded-xl overflow-hidden">
                    <thead className="bg-gray-50 text-gray-500">
                      <tr>
                        <th className="text-left p-3">Product</th>
                        <th className="text-left p-3">Quantity</th>
                        <th className="text-left p-3">Unit Price</th>
                        <th className="text-left p-3">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="p-3">{item.name}</td>
                          <td className="p-3">{item.quantity}</td>
                          <td className="p-3">{formatCurrency(item.price)}</td>
                          <td className="p-3 font-semibold">
                            {formatCurrency(item.total)}
                          </td>
                        </tr>
                      ))}
                      {selectedOrder.urgentCharge > 0 && (
                        <tr>
                          <td className="p-3" colSpan={3}>
                            Urgent Order Charge
                          </td>
                          <td className="p-3 font-semibold">
                            {formatCurrency(selectedOrder.urgentCharge)}
                          </td>
                        </tr>
                      )}
                      <tr className="font-bold">
                        <td className="p-3" colSpan={3}>
                          Total
                        </td>
                        <td className="p-3">{formatCurrency(selectedOrder.total)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MyOrders;
