import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContextObject";
import { OrderContext } from "../context/OrderContextObject";
import { useAuth } from "../context/AuthContext";
import { placeOrder, fetchCreditInfo, initiateOnlinePayment } from "../services/orderService";
import PaymentGatewayModal from "../components/PaymentGatewayModal";
import { FiArrowLeft, FiAlertTriangle, FiCheckCircle, FiLoader, FiGlobe } from "react-icons/fi";

function Payment() {
  const { state: order } = useLocation();
  const navigate         = useNavigate();
  const { auth }         = useAuth();
  const token            = auth?.token ?? null;

  const { removeFromCart }   = useContext(CartContext);
  const { addOrder, cancelOrder, loadOrders } = useContext(OrderContext);

  // ── Payment form state ─────────────────────────────────────────
  const [paymentType, setPaymentType] = useState("cash");       // "cash" | "credit" | "cash_credit" | "online"
  const [orderType,   setOrderType]   = useState("Normal");
  const [gatewaySession, setGatewaySession] = useState(null);
  const [pendingOnlineOrder, setPendingOnlineOrder] = useState(null);

  // ── Credit account state ───────────────────────────────────────
  const [creditInfo,    setCreditInfo]    = useState(null);   // null = loading | false = no account
  const [creditLoading, setCreditLoading] = useState(true);
  const [creditError,   setCreditError]   = useState(null);

  // ── Split payment inputs ───────────────────────────────────────
  const [creditInput, setCreditInput] = useState("");          // credit amount input (string for controlled input)

  // ── Order submission state ─────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const fmt = (val) => 
    Number(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handlePaymentSuccess = async (res) => {
    let loaded = false;
    if (loadOrders) {
      try {
        await loadOrders();
        loaded = true;
      } catch (e) {
        console.error("Failed to reload orders after payment:", e);
      }
    }
    if (!loaded && pendingOnlineOrder) {
      const confirmedPlacedOrder = {
        ...pendingOnlineOrder,
        backendStatus: "Processing",
        status: "Placed",
        paymentStatus: "Paid",
        editable: false,
        paymentType: "online",
        paymentLabel: "Online",
      };
      addOrder(confirmedPlacedOrder);
    }
    if (order?.items) {
      order.items.forEach((item) => {
        removeFromCart(item.id ?? item.productId ?? item.product_id);
      });
    }
    setGatewaySession(null);
    setPendingOnlineOrder(null);
    navigate("/orders");
  };

  const handleCancelPaymentSession = async () => {
    const orderIdToCancel = gatewaySession?.order_id ?? pendingOnlineOrder?.backendId ?? pendingOnlineOrder?.order_id;
    if (orderIdToCancel) {
      try {
        await cancelOrder(orderIdToCancel);
      } catch (err) {
        console.error("Failed to cancel pending online order:", err);
      }
    }
    setGatewaySession(null);
    setPendingOnlineOrder(null);
    setSubmitError("Online payment was cancelled. Order was not placed.");
  };

  // ── Fetch real credit info on mount for active distributor ───
  useEffect(() => {
    if (!token) { setCreditLoading(false); return; }

    const distributorId = order?.distributor_id ?? order?.distributorId ?? null;

    fetchCreditInfo(token, distributorId)
      .then((data) => {
        setCreditInfo(data ?? false);   // false = no credit account
      })
      .catch((err) => {
        console.error("Credit fetch error:", err);
        setCreditError("Could not load credit info.");
        setCreditInfo(false);
      })
      .finally(() => setCreditLoading(false));
  }, [token, order]);

  // ── Guard: no order passed ─────────────────────────────────────
  if (!order) {
    return (
      <div className="max-w-xl mx-auto p-6 mt-12">
        <div className="bg-white border border-slate-100 rounded-[32px] p-8 text-center shadow-xs">
          <h1 className="text-xl font-black text-slate-800">Payment details unavailable</h1>
          <p className="mt-2 text-xs font-bold text-slate-400">
            Please return to your cart and choose a distributor order again.
          </p>
          <button
            onClick={() => navigate("/cart")}
            className="mt-6 bg-blue-650 hover:bg-blue-700 text-white font-bold text-xs px-5 py-3 rounded-full cursor-pointer transition shadow-xs flex items-center justify-center gap-2 mx-auto"
          >
            <FiArrowLeft size={14} /> Back to Cart
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
  } else if (paymentType === "online") {
    finalCreditAmount = 0;
    finalCashAmount   = 0;
  }

  const remainingCredit = availableCredit - finalCreditAmount;

  // ── Confirm order → POST to backend ───────────────────────────
  const handleConfirmOrder = async () => {
    setSubmitError(null);

    // Validation
    if (paymentType === "credit") {
      if (!creditInfo) { setSubmitError("No credit account found."); return; }
      if (creditBlocked) { setSubmitError("Your credit account is blocked."); return; }
      if (payableTotal > availableCredit) { setSubmitError(`Order total Rs. ${fmt(payableTotal)} exceeds available credit Rs. ${fmt(availableCredit)}`); return; }
    }

    if (paymentType === "cash_credit") {
      if (!creditInfo) { setSubmitError("No credit account found."); return; }
      if (creditBlocked) { setSubmitError("Your credit account is blocked."); return; }
      if (parsedCreditInput <= 0) { setSubmitError("Credit amount must be greater than 0 for split payment."); return; }
      if (parsedCreditInput > availableCredit) { setSubmitError(`Credit amount exceeds available credit of Rs. ${fmt(availableCredit)}`); return; }
      if (finalCashAmount <= 0) { setSubmitError("Cash amount must be greater than 0 for split payment."); return; }
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
    else if (paymentType === "online") backendPaymentMethod = "Online";

    setSubmitting(true);
    try {
      if (paymentType === "online" && pendingOnlineOrder) {
        const prevOrderId = Number(pendingOnlineOrder.order_id ?? pendingOnlineOrder.id ?? pendingOnlineOrder.backendId);
        if (prevOrderId) {
          try {
            await cancelOrder(prevOrderId);
          } catch (err) {
            console.warn("Cleaned up previous pending online order:", err);
          }
        }
        setPendingOnlineOrder(null);
      }

      const placed = await placeOrder(
        token,
        itemsPayload,
        backendPaymentMethod,
        order.distributor_id,
        finalCreditAmount,
        finalCashAmount,
        orderType
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
        paymentLabel: paymentType === "cash" ? "Full Cash" : paymentType === "credit" ? "Full Credit" : paymentType === "online" ? "Online" : "Cash + Credit",
      };

      if (paymentType === "online") {
        const targetOrderId = Number(placed.order_id ?? placed.id ?? placed.backendId);
        if (!targetOrderId) {
          throw new Error("Order created but Order ID could not be determined.");
        }
        setPendingOnlineOrder(confirmedOrder);
        const session = await initiateOnlinePayment(token, targetOrderId);
        setGatewaySession(session);
      } else {
        addOrder(confirmedOrder);
        // Clear placed items from cart
        order.items.forEach((item) => {
          removeFromCart(item.id ?? item.productId ?? item.product_id);
        });
        navigate("/orders");
      }
    } catch (err) {
      console.error("Place order error:", err);
      setSubmitError(err.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen">
      
      {/* Back button link */}
      <button 
        onClick={() => navigate("/cart")}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-blue-650 transition cursor-pointer mb-6"
      >
        <FiArrowLeft size={14} /> Back to Cart
      </button>

      {/* ── Order Summary ──────────────────────────────────────────── */}
      <div className="bg-white border border-slate-100 rounded-[32px] p-6.5 shadow-xs">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Review & Payment</h1>
            <p className="text-xs font-bold text-slate-400 mt-0.5">{order.distributor}</p>
          </div>
        </div>

        <hr className="my-5 border-slate-100" />

        <h2 className="font-extrabold text-sm text-slate-800 mb-3">Order Details</h2>

        <div className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <div
              key={item.id ?? item.productId}
              className="flex justify-between gap-4 py-3 text-xs"
            >
              <span className="font-semibold text-slate-600">
                {item.name} <span className="font-bold text-slate-800">× {String(item.quantity).padStart(2, '0')}</span>
              </span>
              <span className="font-black text-slate-805">Rs. {fmt(item.total)}</span>
            </div>
          ))}
        </div>

        <hr className="my-4 border-slate-100" />

        <div className="space-y-2 text-xs font-bold text-slate-455">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-slate-850">Rs. {fmt(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>- Rs. {fmt(order.discount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Urgent Handling Fee</span>
            <span className="text-slate-850">Rs. {fmt(urgentCharge)}</span>
          </div>
          <hr className="my-2 border-slate-100" />
          <div className="flex justify-between text-base font-black text-blue-600 pt-1">
            <span>Payable Total</span>
            <span>Rs. {fmt(payableTotal)}</span>
          </div>
        </div>
      </div>

      {/* ── Outstanding Credit Warning Banner ──────────────────────── */}
      {creditInfo && outstandingCredit > 0 && (
        <div className="bg-amber-50/40 border border-amber-100/50 rounded-2xl p-4.5 mt-5 flex gap-3">
          <FiAlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={16} />
          <div>
            <p className="text-amber-800 font-black text-xs">
              Outstanding credit balance of Rs. {fmt(outstandingCredit)} must be settled at delivery
            </p>
            <p className="text-amber-650 font-bold text-[11px] mt-0.5 leading-normal">
              The delivery driver will collect this pending amount in cash along with the cash payment for this order.
            </p>
          </div>
        </div>
      )}

      {/* ── Order Type ────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-100 rounded-[32px] p-6 mt-6 shadow-xs">
        <h2 className="font-black text-slate-800 text-sm">Order Type</h2>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label
            onClick={() => setOrderType("Normal")}
            className={`border rounded-2xl p-4.5 cursor-pointer transition flex flex-col justify-between ${
              orderType === "Normal"
                ? "border-blue-650 bg-blue-50/30"
                : "border-slate-100 hover:bg-slate-50/30"
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="orderType"
                checked={orderType === "Normal"}
                onChange={() => {}}
                className="accent-blue-600"
              />
              <span className="font-black text-slate-800 text-xs">Normal Order</span>
            </div>
            <p className="text-[11px] font-bold text-slate-400 mt-2 leading-normal">
              Standard order dispatch schedule with no extra priority charge.
            </p>
          </label>

          <label
            onClick={() => setOrderType("Urgent")}
            className={`border rounded-2xl p-4.5 cursor-pointer transition flex flex-col justify-between ${
              orderType === "Urgent"
                ? "border-red-200 bg-red-50/30"
                : "border-slate-100 hover:bg-slate-50/30"
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="orderType"
                checked={orderType === "Urgent"}
                onChange={() => {}}
                className="accent-red-650"
              />
              <span className="font-black text-red-700 text-xs">Urgent Order</span>
            </div>
            <p className="text-[11px] font-bold text-slate-400 mt-2 leading-normal">
              Priority processing and faster shipping dispatch: extra charge of Rs. {fmt(500)}.
            </p>
          </label>
        </div>
      </div>

      {/* ── Payment Method ────────────────────────────────────────── */}
      <div className="bg-white border border-slate-100 rounded-[32px] p-6 mt-6 shadow-xs">
        <h2 className="font-black text-slate-800 text-sm">Payment Method</h2>

        <div className="mt-4 space-y-3">
          {/* Option 1: Full Cash */}
          <label className="flex items-center gap-3.5 cursor-pointer border rounded-2xl p-4 transition hover:bg-slate-50/50"
            style={{ 
              borderColor: paymentType === "cash" ? "#2563eb" : "#f1f5f9", 
              backgroundColor: paymentType === "cash" ? "#f0f9ff" : "" 
            }}
          >
            <input
              type="radio"
              name="paymentType"
              checked={paymentType === "cash"}
              onChange={() => setPaymentType("cash")}
              className="accent-blue-600"
            />
            <div>
              <span className="font-black text-slate-800 text-xs">Full Cash</span>
              <p className="text-[11px] font-bold text-slate-400 mt-0.5">Pay the entire amount in cash upon delivery.</p>
            </div>
          </label>

          {/* Option 2: Full Credit */}
          {creditLoading ? (
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 px-4 py-2">
              <FiLoader className="animate-spin text-slate-450" />
              <span>Verifying credit account limits...</span>
            </div>
          ) : creditInfo ? (
            <label className={`flex items-center gap-3.5 cursor-pointer border rounded-2xl p-4 transition ${
              !canUseFullCredit ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50/50"
            }`}
              style={{ 
                borderColor: paymentType === "credit" ? "#2563eb" : "#f1f5f9", 
                backgroundColor: paymentType === "credit" ? "#f0f9ff" : "" 
              }}
            >
              <input
                type="radio"
                name="paymentType"
                checked={paymentType === "credit"}
                onChange={() => setPaymentType("credit")}
                disabled={!canUseFullCredit}
                className="accent-blue-600"
              />
              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-1.5">
                  <span className="font-black text-slate-800 text-xs">Full Credit</span>
                  {creditBlocked && (
                    <span className="text-[10px] font-black text-red-600 bg-red-50 border border-red-200/50 px-2 py-0.5 rounded-full">Blocked</span>
                  )}
                  {!creditBlocked && !canUseFullCredit && (
                    <span className="text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded-full">
                      Insufficient credit (Avail: Rs. {fmt(availableCredit)})
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                  Charge the entire amount to your distributor credit account. No cash settlement required.
                </p>
              </div>
            </label>
          ) : null}

          {/* Option 3: Cash + Credit */}
          {!creditLoading && creditInfo && (
            <label className={`flex items-center gap-3.5 cursor-pointer border rounded-2xl p-4 transition ${
              creditBlocked ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50/50"
            }`}
              style={{ 
                borderColor: paymentType === "cash_credit" ? "#2563eb" : "#f1f5f9", 
                backgroundColor: paymentType === "cash_credit" ? "#f0f9ff" : "" 
              }}
            >
              <input
                type="radio"
                name="paymentType"
                checked={paymentType === "cash_credit"}
                onChange={() => setPaymentType("cash_credit")}
                disabled={creditBlocked}
                className="accent-blue-600"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-slate-800 text-xs">Cash + Credit</span>
                  {creditBlocked && (
                    <span className="text-[10px] font-black text-red-600 bg-red-50 border border-red-200/50 px-2 py-0.5 rounded-full">Blocked</span>
                  )}
                </div>
                <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                  Split the order cost between a custom credit amount and cash at delivery.
                </p>
              </div>
            </label>
          )}

          {/* Option 4: Full Online Gateway */}
          <label className="flex items-center gap-3.5 cursor-pointer border rounded-2xl p-4 transition hover:bg-slate-50/50"
            style={{ 
              borderColor: paymentType === "online" ? "#2563eb" : "#f1f5f9", 
              backgroundColor: paymentType === "online" ? "#f0f9ff" : "" 
            }}
          >
            <input
              type="radio"
              name="paymentType"
              checked={paymentType === "online"}
              onChange={() => setPaymentType("online")}
              className="accent-blue-600"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-800 text-xs">Online Payment</span>
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-200/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <FiGlobe size={11} /> Cards / Wallets
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                Pay 100% online now via Credit/Debit Card or Mobile Wallet.
              </p>
            </div>
          </label>

          {!creditLoading && !creditInfo && (
            <p className="text-xs font-bold text-slate-400 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
              No credit account available with this distributor — payment limited to cash on delivery.
              {creditError && <span className="text-red-500 ml-2 font-black">({creditError})</span>}
            </p>
          )}
        </div>

        {/* ── Credit Account Info Panel ──────────────────────────── */}
        {creditInfo && !creditBlocked && (paymentType === "credit" || paymentType === "cash_credit") && (
          <div className="mt-6 bg-slate-50/50 border border-slate-100 rounded-2xl p-5 space-y-4">
            <h3 className="font-black text-xs text-slate-700 tracking-wide uppercase">Credit Account Summary</h3>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-xs">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Credit Limit</p>
                <p className="font-black text-slate-800 text-sm">Rs. {fmt(creditLimit)}</p>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-3.5 shadow-xs">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Outstanding</p>
                <p className={`font-black text-sm ${outstandingCredit > 0 ? "text-red-655" : "text-green-605"}`}>
                  Rs. {fmt(outstandingCredit)}
                </p>
              </div>
              <div className="bg-white border border-blue-100/70 rounded-2xl p-3.5 shadow-xs">
                <p className="text-[9px] font-black text-blue-600/70 uppercase tracking-wider mb-1">Available</p>
                <p className="font-black text-blue-700 text-sm">Rs. {fmt(availableCredit)}</p>
              </div>
            </div>

            {/* Full Credit summary */}
            {paymentType === "credit" && (
              <div className="bg-blue-50/40 border border-blue-100/50 rounded-2xl p-4 text-xs font-bold space-y-1">
                <p className="text-blue-800">
                  Credit to Debit: Rs. {fmt(payableTotal)}
                </p>
                <p className="text-blue-805">
                  Remaining Account Balance: Rs. {fmt(remainingCredit)}
                </p>
                <p className="text-[10px] text-blue-600 mt-2 flex items-center gap-1">
                  <FiCheckCircle /> Credit ledger entries will be updated when the dispatch delivery completes.
                </p>
              </div>
            )}

            {/* Cash + Credit split inputs */}
            {paymentType === "cash_credit" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Credit Amount (max Rs. {fmt(Math.min(availableCredit, payableTotal))})
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={Math.min(availableCredit, payableTotal)}
                    value={creditInput}
                    onChange={(e) => setCreditInput(e.target.value)}
                    className="w-full border border-slate-200 p-3.5 rounded-full outline-none focus:border-blue-600 transition text-xs font-bold"
                    placeholder="Enter credit amount"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">
                    Cash Amount (auto-calculated)
                  </label>
                  <div className="w-full border border-slate-100 p-3.5 rounded-full bg-slate-50 text-slate-800 font-extrabold text-xs">
                    Rs. {fmt(payableTotal - parsedCreditInput)}
                  </div>
                </div>

                <div className="bg-blue-50/30 border border-blue-100/50 rounded-2xl p-4 text-xs font-bold space-y-1 text-blue-700">
                  <p>Credit Portion: Rs. {fmt(parsedCreditInput)}</p>
                  <p>Cash Portion: Rs. {fmt(payableTotal - parsedCreditInput)}</p>
                  <p>Remaining Account Balance: Rs. {fmt(availableCredit - parsedCreditInput)}</p>
                  {outstandingCredit > 0 && (
                    <p className="text-amber-705 mt-2 font-black">
                      + Settling Outstanding at Delivery: Rs. {fmt(outstandingCredit)}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Driver Collection Preview ─────────────────────────── */}
        {outstandingCredit > 0 && creditInfo && (paymentType === "cash" || paymentType === "cash_credit") && (
          <div className="mt-4 bg-blue-50/50 border border-blue-100/50 rounded-2xl p-4 text-xs font-bold text-blue-700">
            <p className="font-black text-blue-900 mb-1.5">Driver Collection Details (Cash at Delivery):</p>
            <div className="space-y-1">
              <p>Current Order Cash Portion: Rs. {fmt(finalCashAmount)}</p>
              <p>Settlement of Previous Outstanding: Rs. {fmt(outstandingCredit)}</p>
              <hr className="my-1.5 border-blue-200" />
              <p className="font-black text-blue-900 text-sm">
                Total Driver Cash Collection: Rs. {fmt(finalCashAmount + outstandingCredit)}
              </p>
            </div>
          </div>
        )}

        {/* Error banner */}
        {submitError && (
          <div className="mt-4 bg-red-50/50 border border-red-100/50 text-red-700 rounded-2xl px-4.5 py-3 text-xs font-bold">
            {submitError}
          </div>
        )}

        <button
          onClick={handleConfirmOrder}
          disabled={submitting}
          className={`w-full py-4 rounded-full mt-6 font-black text-xs text-white transition-all shadow-xs cursor-pointer ${
            submitting
              ? "bg-slate-205 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-755"
          }`}
        >
          {submitting
            ? "Processing Order..."
            : paymentType === "online"
            ? "Proceed to Online Gateway"
            : "Confirm & Place Order"}
        </button>

        {/* Payment Gateway Modal Simulator */}
        {gatewaySession && (
          <PaymentGatewayModal
            sessionData={gatewaySession}
            onClose={handleCancelPaymentSession}
            onCancel={handleCancelPaymentSession}
            onSuccess={handlePaymentSuccess}
            onFailure={() => {
              // Stay in modal or allow retry
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Payment;
