import { useState } from "react";
import { FiCreditCard, FiCheckCircle, FiXCircle, FiLock, FiShield, FiX, FiLoader } from "react-icons/fi";
import { processGatewayCallback } from "../services/orderService";

export default function PaymentGatewayModal({ sessionData, onClose, onSuccess, onFailure, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // Mock Form inputs
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444");
  const [expiry, setExpiry]         = useState("12/28");
  const [cvv, setCvv]               = useState("123");
  const [cardHolder, setCardHolder] = useState("Jane Doe");

  const fmt = (val) =>
    Number(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleSimulatePayment = async (status) => {
    setLoading(true);
    setError(null);
    try {
      const mockGatewayRef = "PAY_REF_" + Math.floor(100000 + Math.random() * 900000);
      
      const res = await processGatewayCallback(
        sessionData.transaction_token,
        status,
        mockGatewayRef,
        sessionData.signature
      );

      if (status === "SUCCESS") {
        onSuccess(res);
      } else {
        setError("Payment was declined by bank simulator.");
        onFailure(res);
      }
    } catch (err) {
      console.error("Gateway execution error:", err);
      setError(err.message || "Failed to process sandbox payment");
    } finally {
      setLoading(false);
    }
  };

  if (!sessionData) return null;

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-100 rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button 
            onClick={handleCancelClick}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition cursor-pointer"
          >
            <FiX size={20} />
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <FiShield size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest text-blue-400 uppercase">Secure Payment Gateway</span>
              <h2 className="text-base font-black text-white leading-tight">{sessionData.gateway_name}</h2>
            </div>
          </div>

          <div className="mt-5 bg-slate-800/80 rounded-2xl p-4 flex items-center justify-between border border-slate-700/50">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {sessionData.payment_type === 'CREDIT_SETTLEMENT' || sessionData.credit_id
                  ? 'Credit Debt Settlement'
                  : `Order #${sessionData.order_id}`}
              </p>
              <p className="text-xs font-black text-white">{sessionData.distributor_name}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {sessionData.payment_type === 'CREDIT_SETTLEMENT' ? 'Full Settlement Amount' : 'Amount Due'}
              </p>
              <p className="text-lg font-black text-blue-400">LKR {fmt(sessionData.amount)}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3.5 flex items-center gap-3 text-blue-900 text-xs">
            <FiLock size={16} className="text-blue-600 shrink-0" />
            <p className="font-bold text-[11px]">
              Sandbox Environment: Use simulated card details below or click <strong className="font-black">Pay Now</strong>.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-3.5 text-xs font-bold flex items-center gap-2">
              <FiXCircle className="shrink-0 text-red-500" size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Cardholder Name</label>
              <input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                />
                <FiCreditCard className="absolute right-3.5 top-3 text-slate-400" size={16} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Expiry (MM/YY)</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">CVV / CVC</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2.5">
            <button
              onClick={() => handleSimulatePayment("SUCCESS")}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 rounded-full cursor-pointer transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" size={16} />
                  <span>Processing Online Payment...</span>
                </>
              ) : (
                <>
                  <FiCheckCircle size={16} />
                  <span>Pay Now (LKR {fmt(sessionData.amount)})</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleSimulatePayment("FAILED")}
              disabled={loading}
              className="w-full bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs py-2.5 rounded-full cursor-pointer transition flex items-center justify-center gap-2 border border-amber-200 disabled:opacity-50"
            >
              <FiXCircle size={15} />
              <span>Simulate Payment Failure / Decline</span>
            </button>

            <button
              onClick={handleCancelClick}
              disabled={loading}
              className="w-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-bold text-xs py-2.5 rounded-full cursor-pointer transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FiX size={15} />
              <span>Cancel Payment & Order</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400">
          <span>Encrypted 256-Bit SSL</span>
          <span>Vendora B2B Gateway</span>
        </div>
      </div>
    </div>
  );
}
