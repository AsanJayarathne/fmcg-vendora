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
  const [paymentType, setPaymentType] = useState("cash");       // "cash" | "credit" | "cash_credit"
  const [orderType,   setOrderType]   = useState("Normal");

  // ── Credit account state ───────────────────────────────────────
  const [creditInfo,    setCreditInfo]    = useState(null);   // null = loading | false = no account
  const [creditLoading, setCreditLoading] = useState(true);
  const [creditError,   setCreditError]   = useState(null);

  // ── Split payment inputs ───────────────────────────────────────
  const [creditInput, setCreditInput] = useState("");          // credit amount input (string for controlled input)

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

  // Real credit info from backend
  const creditLimit      = creditInfo ? Number(creditInfo.credit_limit ?? 0) : 0;
  const availableCredit  = creditInfo ? Number(creditInfo.available_credit ?? 0) : 0;
  const outstandingCredit = creditInfo ? Number(creditInfo.current_balance ?? 0) : 0;
  const creditBlocked    = creditInfo?.status === "Blocked";

  // Can use full credit? Only if payable total fits within available credit
  const canUseFullCredit = creditInfo && !creditBlocked && payableTotal <= availableCredit;

  // Split payment calculations
  const parsedCreditInput = Math.min(
    Math.max(0, Number(creditInput) || 0),
    availableCredit,
    payableTotal
  );

  // Calculate final amounts based on payment type
  let finalCreditAmount = 0;
  let finalCashAmount   = payableTotal;

  if (paymentType === "credit") {
    finalCreditAmount = payableTotal;
    finalCashAmount   = 0;
  } else if (paymentType === "cash_credit") {
    finalCreditAmount = parsedCreditInput;
    finalCashAmount   = Math.max(0, payableTotal - parsedCreditInput);
  }

  const remainingCredit = availableCredit - finalCreditAmount;

  // ── Confirm order → POST to backend ───────────────────────────
  const handleConfirmOrder = async () => {
    setSubmitError(null);

    // Validation
    if (paymentType === "credit") {
      if (!creditInfo) { setSubmitError("No credit account found."); return; }
      if (creditBlocked) { setSubmitError("Your credit account is blocked."); return; }
      if (payableTotal > availableCredit) { setSubmitError(`Order total Rs. ${payableTotal.toLocaleString()} exceeds available credit Rs. ${availableCredit.toLocaleString()}`); return; }
    }

    if (paymentType === "cash_credit") {
      if (!creditInfo) { setSubmitError("No credit account found."); return; }
      if (creditBlocked) { setSubmitError("Your credit account is blocked."); return; }
      if (parsedCreditInput <= 0) { setSubmitError("Credit amount must be greater than 0 for split payment."); return; }
      if (finalCashAmount <= 0) { setSubmitError("Cash amount must be greater than 0 for split payment."); return; }
      if (parsedCreditInput > availableCredit) { setSubmitError(`Credit amount exceeds available credit of Rs. ${availableCredit.toLocaleString()}`); return; }
      if (Math.abs((finalCashAmount + finalCreditAmount) - payableTotal) > 0.01) { setSubmitError("Cash + Credit must equal the order total."); return; }
    }

    // Build items payload for backend
    const itemsPayload = order.items.map((item) => ({
      product_id: item.productId ?? item.product_id ?? item.id,
      quantity:   item.quantity,
    }));

    // Map frontend payment type to backend enum
    let backendPaymentMethod = "Cash";
    if (paymentType === "credit") backendPaymentMethod = "Credit";
    else if (paymentType === "cash_credit") backendPaymentMethod = "Cash_Credit";

    setSubmitting(true);
    try {
      const placed = await placeOrder(
        token,
        itemsPayload,
        backendPaymentMethod,
        order.distributor_id,
        finalCreditAmount,
        finalCashAmount
      );

      // Enrich with UI-only fields
      const confirmedOrder = {
        ...placed,
        orderType,
        urgentCharge,
        total:       payableTotal,
        cashAmount:  finalCashAmount,
        creditUsed:  finalCreditAmount,
        paymentType,
        paymentLabel: paymentType === "cash" ? "Full Cash" : paymentType === "credit" ? "Full Credit" : "Cash + Credit",
      };

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
            Total: Rs. {payableTotal.toLocaleString()}
          </p>
        </div>
      </div>

      {/* ── Outstanding Credit Warning Banner ──────────────────────── */}
      {creditInfo && outstandingCredit > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mt-6">
          <p className="text-amber-800 font-semibold text-sm">
            ⚠️ You have <span className="font-bold">Rs. {outstandingCredit.toLocaleString()}</span> outstanding credit from previous orders.
          </p>
          <p className="text-amber-700 text-xs mt-1">
            This amount must be settled at delivery. The driver will collect this along with any cash payment for this order.
          </p>
        </div>
      )}

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
          {/* Option 1: Full Cash */}
          <label className="flex items-center gap-3 cursor-pointer border rounded-xl p-4 transition hover:bg-gray-50"
            style={{ borderColor: paymentType === "cash" ? "#2563eb" : "#e5e7eb", backgroundColor: paymentType === "cash" ? "#eff6ff" : "" }}
          >
            <input
              type="radio"
              value="cash"
              checked={paymentType === "cash"}
              onChange={() => setPaymentType("cash")}
            />
            <div>
              <span className="font-semibold">Full Cash</span>
              <p className="text-xs text-gray-500 mt-0.5">Pay the entire order amount in cash at delivery.</p>
            </div>
          </label>

          {/* Option 2: Full Credit */}
          {creditLoading ? (
            <p className="text-sm text-gray-400 px-4">Checking credit account…</p>
          ) : creditInfo ? (
            <label className={`flex items-center gap-3 cursor-pointer border rounded-xl p-4 transition ${
              !canUseFullCredit ? "opacity-50 cursor-not-allowed" : "hover:bg-green-50"
            }`}
              style={{ borderColor: paymentType === "credit" ? "#16a34a" : "#e5e7eb", backgroundColor: paymentType === "credit" ? "#f0fdf4" : "" }}
            >
              <input
                type="radio"
                value="credit"
                checked={paymentType === "credit"}
                onChange={() => setPaymentType("credit")}
                disabled={!canUseFullCredit}
              />
              <div>
                <span className="font-semibold">Full Credit</span>
                {creditBlocked && (
                  <span className="text-xs text-red-600 ml-2">(Account blocked)</span>
                )}
                {!creditBlocked && !canUseFullCredit && (
                  <span className="text-xs text-amber-600 ml-2">
                    (Available credit Rs. {availableCredit.toLocaleString()} is less than order total)
                  </span>
                )}
                <p className="text-xs text-gray-500 mt-0.5">
                  Charge the entire order to your credit account. No cash needed at delivery.
                </p>
              </div>
            </label>
          ) : null}

          {/* Option 3: Cash + Credit */}
          {!creditLoading && creditInfo && (
            <label className={`flex items-center gap-3 cursor-pointer border rounded-xl p-4 transition ${
              creditBlocked ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-50"
            }`}
              style={{ borderColor: paymentType === "cash_credit" ? "#7c3aed" : "#e5e7eb", backgroundColor: paymentType === "cash_credit" ? "#faf5ff" : "" }}
            >
              <input
                type="radio"
                value="cash_credit"
                checked={paymentType === "cash_credit"}
                onChange={() => setPaymentType("cash_credit")}
                disabled={creditBlocked}
              />
              <div>
                <span className="font-semibold">Cash + Credit</span>
                {creditBlocked && (
                  <span className="text-xs text-red-600 ml-2">(Account blocked)</span>
                )}
                <p className="text-xs text-gray-500 mt-0.5">
                  Split the payment between cash and credit.
                </p>
              </div>
            </label>
          )}

          {!creditLoading && !creditInfo && (
            <p className="text-sm text-gray-400 px-4">
              No credit account — only full cash payment available.
              {creditError && <span className="text-red-500 ml-2">{creditError}</span>}
            </p>
          )}
        </div>

        {/* ── Credit Account Info Panel ──────────────────────────── */}
        {creditInfo && !creditBlocked && (paymentType === "credit" || paymentType === "cash_credit") && (
          <div className="mt-6 bg-gray-50 border rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-sm text-gray-700">Credit Account Summary</h3>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="bg-white border rounded-lg p-3">
                <p className="text-xs text-gray-400">Credit Limit</p>
                <p className="font-bold text-gray-800">Rs. {creditLimit.toLocaleString()}</p>
              </div>
              <div className="bg-white border rounded-lg p-3">
                <p className="text-xs text-gray-400">Outstanding</p>
                <p className={`font-bold ${outstandingCredit > 0 ? "text-red-600" : "text-green-600"}`}>
                  Rs. {outstandingCredit.toLocaleString()}
                </p>
              </div>
              <div className="bg-white border rounded-lg p-3">
                <p className="text-xs text-gray-400">Available Credit</p>
                <p className="font-bold text-blue-600">Rs. {availableCredit.toLocaleString()}</p>
              </div>
            </div>

            {/* Full Credit summary */}
            {paymentType === "credit" && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-1">
                <p className="text-sm text-green-800">
                  <strong>Credit Used:</strong> Rs. {payableTotal.toLocaleString()}
                </p>
                <p className="text-sm text-green-800">
                  <strong>Remaining Credit After Order:</strong> Rs. {remainingCredit.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-2">
                  No cash payment needed. Credit will be debited upon delivery.
                </p>
              </div>
            )}

            {/* Cash + Credit split inputs */}
            {paymentType === "cash_credit" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Credit Amount (max Rs. {Math.min(availableCredit, payableTotal).toLocaleString()})
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={Math.min(availableCredit, payableTotal)}
                    value={creditInput}
                    onChange={(e) => setCreditInput(e.target.value)}
                    className="w-full border p-3 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-200"
                    placeholder="Enter credit amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Cash Amount (auto-calculated)
                  </label>
                  <div className="w-full border p-3 rounded-lg bg-gray-100 text-gray-700 font-semibold">
                    Rs. {finalCashAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-1 text-sm">
                  <p><strong>Credit Portion:</strong> Rs. {finalCreditAmount.toLocaleString()}</p>
                  <p><strong>Cash Portion:</strong> Rs. {finalCashAmount.toLocaleString()}</p>
                  <p><strong>Remaining Credit After Order:</strong> Rs. {remainingCredit.toLocaleString()}</p>
                  {outstandingCredit > 0 && (
                    <p className="text-amber-700 mt-2">
                      <strong>+ Outstanding to Settle at Delivery:</strong> Rs. {outstandingCredit.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Driver Collection Preview ─────────────────────────── */}
        {outstandingCredit > 0 && creditInfo && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-800">Driver Collection Preview (Cash at Delivery):</p>
            <div className="text-sm text-blue-700 mt-1 space-y-0.5">
              <p>Current Order Cash Portion: Rs. {finalCashAmount.toLocaleString()}</p>
              <p>Previous Outstanding Credit Settlement: Rs. {outstandingCredit.toLocaleString()}</p>
              <p className="font-bold text-blue-900 text-base mt-1">
                Total Driver Will Collect: Rs. {(finalCashAmount + outstandingCredit).toLocaleString()}
              </p>
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
