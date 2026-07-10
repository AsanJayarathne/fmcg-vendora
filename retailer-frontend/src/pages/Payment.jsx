import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContextObject";
import { OrderContext } from "../context/OrderContextObject";
import { useAuth } from "../context/AuthContext";
import { placeOrder, fetchCreditInfo } from "../services/orderService";

function Payment() {
  const { state: order } = useLocation();
  const navigate         = useNavigate();
  const { auth }         = useAuth();
  const token            = auth?.token ?? null;

  const { removeFromCart }   = useContext(CartContext);
  const { addOrder }         = useContext(OrderContext);

  // ── Payment form state ─────────────────────────────────────────
  const [paymentType, setPaymentType] = useState("cash");
  const [orderType,   setOrderType]   = useState("Normal");
  const [cashAmount,  setCashAmount]  = useState(order?.total ?? 0);

  // ── Credit account state ───────────────────────────────────────
  const [creditInfo,    setCreditInfo]    = useState(null);   // null = loading | false = no account
  const [creditLoading, setCreditLoading] = useState(true);
  const [creditError,   setCreditError]   = useState(null);

  // ── Order submission state ─────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // ── Fetch real credit info on mount ───────────────────────────
  useEffect(() => {
    if (!token) { setCreditLoading(false); return; }

    fetchCreditInfo(token)
      .then((data) => {
        setCreditInfo(data ?? false);   // false = no credit account
      })
      .catch((err) => {
        console.error("Credit fetch error:", err);
        setCreditError("Could not load credit info.");
        setCreditInfo(false);
      })
      .finally(() => setCreditLoading(false));
  }, [token]);

  // ── Guard: no order passed ─────────────────────────────────────
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

  // ── Derived values ─────────────────────────────────────────────
  const urgentCharge   = orderType === "Urgent" ? 500 : 0;
  const payableTotal   = order.total + urgentCharge;

  // Real credit limit from backend (or 0 if no account)
  const creditLimit    = creditInfo ? Number(creditInfo.available_credit ?? 0) : 0;
  const creditBlocked  = creditInfo?.status === "Blocked";

  const normalizedCashAmount = Math.min(
    payableTotal,
    Math.max(0, Number(cashAmount) || 0)
  );
  const minimumCash = Math.max(0, payableTotal - creditLimit);
  const creditUsed  =
    paymentType === "credit" ? payableTotal - normalizedCashAmount : 0;
  const remainingCredit = creditLimit - creditUsed;

  // ── Confirm order → POST to backend ───────────────────────────
  const handleConfirmOrder = async () => {
    setSubmitError(null);

    if (paymentType === "credit" && creditBlocked) {
      setSubmitError("Your credit account is blocked. Please use full cash payment.");
      return;
    }
    if (paymentType === "credit" && !creditInfo) {
      setSubmitError("No credit account found for your account.");
      return;
    }
    if (paymentType === "credit" && normalizedCashAmount < minimumCash) {
      setSubmitError(`Minimum cash required is Rs. ${minimumCash}`);
      return;
    }

    // Build items payload for backend
    const itemsPayload = order.items.map((item) => ({
      product_id: item.productId ?? item.product_id ?? item.id,
      quantity:   item.quantity,
    }));

    const backendPaymentMethod = paymentType === "credit" ? "Credit" : "Cash";

    setSubmitting(true);
    try {
      const placed = await placeOrder(token, itemsPayload, backendPaymentMethod);

      // Enrich with UI-only fields that the backend doesn't store
      const confirmedOrder = {
        ...placed,
        orderType,
        urgentCharge,
        total:       payableTotal,
        cashAmount:  paymentType === "cash" ? payableTotal : normalizedCashAmount,
        creditUsed,
        paymentType,
        paymentLabel: paymentType === "credit" ? "Cash + Credit" : "Full Cash",
      };

      // Optimistically add to local order list
      addOrder(confirmedOrder);

      // Clear placed items from cart
      order.items.forEach((item) => {
        removeFromCart(item.id ?? item.productId ?? item.product_id);
      });

      navigate("/orders");
    } catch (err) {
      console.error("Place order error:", err);
      setSubmitError(err.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* ── Order Summary ──────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold">Payment</h1>
        <p className="mt-2 text-gray-500">{order.distributor}</p>

        <hr className="my-6" />

        <h2 className="font-bold text-lg mb-4">Order Summary</h2>

        <div className="divide-y">
          {order.items.map((item) => (
            <div
              key={item.id ?? item.productId}
              className="flex justify-between gap-4 py-3"
            >
              <span>
                {item.name} × {item.quantity}
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

      {/* ── Order Type ────────────────────────────────────────────── */}
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

      {/* ── Payment Method ────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h2 className="font-bold text-lg">Payment Method</h2>

        <div className="mt-4 space-y-3">
          <label className="flex gap-2 cursor-pointer">
            <input
              type="radio"
              value="cash"
              checked={paymentType === "cash"}
              onChange={() => setPaymentType("cash")}
            />
            Full Cash
          </label>

          {/* Credit option — shown only when a credit account exists */}
          {creditLoading ? (
            <p className="text-sm text-gray-400">Checking credit account…</p>
          ) : creditInfo ? (
            <label className={`flex gap-2 cursor-pointer ${creditBlocked ? "opacity-50" : ""}`}>
              <input
                type="radio"
                value="credit"
                checked={paymentType === "credit"}
                onChange={() => setPaymentType("credit")}
                disabled={creditBlocked}
              />
              Cash + Credit
              {creditBlocked && (
                <span className="text-xs text-red-600 ml-2">(Account blocked)</span>
              )}
            </label>
          ) : (
            <p className="text-sm text-gray-400">
              No credit account — only full cash payment available.
              {creditError && <span className="text-red-500 ml-2">{creditError}</span>}
            </p>
          )}
        </div>

        {/* Credit details panel */}
        {paymentType === "credit" && creditInfo && !creditBlocked && (
          <div className="mt-6">
            <div className="space-y-2 text-gray-700">
              <p>Available Credit: Rs. {creditLimit.toLocaleString()}</p>
              <p>Minimum Cash Required: Rs. {minimumCash.toLocaleString()}</p>
            </div>

            <input
              type="number"
              min={minimumCash}
              max={payableTotal}
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
              className="w-full border p-3 rounded mt-4"
              placeholder="Enter Cash Amount"
            />

            <div className="mt-4 space-y-2 text-gray-700">
              <p>Credit Used: Rs. {creditUsed.toLocaleString()}</p>
              <p>Remaining Credit: Rs. {remainingCredit.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Error banner */}
        {submitError && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm font-medium">
            ⚠️ {submitError}
          </div>
        )}

        <button
          onClick={handleConfirmOrder}
          disabled={submitting}
          className={`w-full py-3 rounded-lg mt-6 font-semibold text-white transition-colors ${
            submitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {submitting ? "Placing Order…" : "Confirm Order"}
        </button>
      </div>
    </div>
  );
}

export default Payment;
