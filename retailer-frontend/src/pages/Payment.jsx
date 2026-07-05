import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContextObject";
import { OrderContext } from "../context/OrderContextObject";

function Payment() {
  const { state: order } = useLocation();
  const navigate = useNavigate();
  const { removeFromCart } = useContext(CartContext);
  const { addOrder } = useContext(OrderContext);

  const [paymentType, setPaymentType] = useState("cash");
  const [orderType, setOrderType] = useState("Normal");
  const [cashAmount, setCashAmount] = useState(order?.total ?? 0);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h1 className="text-2xl font-bold">Payment details unavailable</h1>

          <p className="mt-2 text-gray-500">
            Please return to your cart and choose a distributor order again.
          </p>

          <button
            onClick={() => navigate("/cart")}
            className="mt-6 bg-blue-600 text-white px-5 py-3 rounded-lg"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  const urgentCharge = orderType === "Urgent" ? 500 : 0;
  const payableTotal = order.total + urgentCharge;
  const creditLimit = 5000;
  const normalizedCashAmount = Math.min(
    payableTotal,
    Math.max(0, Number(cashAmount) || 0)
  );
  const minimumCash = Math.max(0, payableTotal - creditLimit);
  const creditUsed =
    paymentType === "credit" ? payableTotal - normalizedCashAmount : 0;
  const remainingCredit = creditLimit - creditUsed;

  const handleConfirmOrder = () => {
    if (paymentType === "credit" && normalizedCashAmount < minimumCash) {
      alert(`Minimum cash required is Rs. ${minimumCash}`);
      return;
    }

    const now = new Date().toISOString();
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const confirmedOrder = {
      orderId,
      distributor: order.distributor,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      urgentCharge,
      total: payableTotal,
      orderType,
      paymentType,
      cashAmount:
        paymentType === "cash" ? payableTotal : normalizedCashAmount,
      creditUsed,
      status: "Placed",
      createdAt: now,
      statusHistory: [
        {
          name: "Placed",
          completed: true,
          date: now,
        },
        {
          name: "Accepted",
          completed: false,
          date: "",
        },
        {
          name: "Packed",
          completed: false,
          date: "",
        },
        {
          name: "Out for Delivery",
          completed: false,
          date: "",
        },
        {
          name: "Delivered",
          completed: false,
          date: "",
        },
      ],
    };

    const savedOrder = addOrder(confirmedOrder);

    order.items.forEach((item) => {
      removeFromCart(item.id);
    });

    navigate("/orders");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold">Payment</h1>

        <p className="mt-2 text-gray-500">{order.distributor}</p>

        <hr className="my-6" />

        <h2 className="font-bold text-lg mb-4">Order Summary</h2>

        <div className="divide-y">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between gap-4 py-3"
            >
              <span>
                {item.name} x {item.quantity}
              </span>

              <span className="font-semibold">Rs. {item.total}</span>
            </div>
          ))}
        </div>

        <hr className="my-4" />

        <div className="space-y-2 text-gray-700">
          <p>Subtotal: Rs. {order.subtotal}</p>
          <p>Discount: Rs. {order.discount}</p>
          <p>Urgent Charge: Rs. {urgentCharge}</p>
          <p className="font-bold text-xl text-slate-900">
            Total: Rs. {payableTotal}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h2 className="font-bold text-lg">Order Type</h2>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label
            className={`border rounded-xl p-4 cursor-pointer ${
              orderType === "Normal"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                value="Normal"
                checked={orderType === "Normal"}
                onChange={() => setOrderType("Normal")}
              />
              <span className="font-semibold">Normal Order</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Standard distributor order with no extra charge.
            </p>
          </label>

          <label
            className={`border rounded-xl p-4 cursor-pointer ${
              orderType === "Urgent"
                ? "border-red-500 bg-red-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                value="Urgent"
                checked={orderType === "Urgent"}
                onChange={() => setOrderType("Urgent")}
              />
              <span className="font-semibold">Urgent Order</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Priority handling charge: Rs. 500.
            </p>
          </label>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h2 className="font-bold text-lg">Payment Method</h2>

        <div className="mt-4 space-y-3">
          <label className="flex gap-2">
            <input
              type="radio"
              value="cash"
              checked={paymentType === "cash"}
              onChange={() => setPaymentType("cash")}
            />
            Full Cash
          </label>

          <label className="flex gap-2">
            <input
              type="radio"
              value="credit"
              checked={paymentType === "credit"}
              onChange={() => setPaymentType("credit")}
            />
            Cash + Credit
          </label>
        </div>

        {paymentType === "credit" && (
          <div className="mt-6">
            <div className="space-y-2 text-gray-700">
              <p>Credit Limit: Rs. {creditLimit}</p>
              <p>Minimum Cash Required: Rs. {minimumCash}</p>
            </div>

            <input
              type="number"
              min={minimumCash}
              max={payableTotal}
              value={cashAmount}
              onChange={(event) => setCashAmount(event.target.value)}
              className="w-full border p-3 rounded mt-4"
              placeholder="Enter Cash Amount"
            />

            <div className="mt-4 space-y-2 text-gray-700">
              <p>Credit Used: Rs. {creditUsed}</p>
              <p>Remaining redit: Rs. {remainingCredit}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleConfirmOrder}
          className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
}

export default Payment;
