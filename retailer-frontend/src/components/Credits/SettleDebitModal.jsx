import { useState } from "react";
import { FiCreditCard, FiX, FiShield, FiCheckCircle, FiLock, FiAlertCircle, FiArrowRight, FiLoader } from "react-icons/fi";
import { initiateCreditSettlement } from "../../services/orderService";

export default function SettleDebitModal({
  isOpen,
  onClose,
  account,
  token,
  onInitiateGateway,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !account) return null;

  const creditId = account.credit_id;
  const distributorName = account.distributor_name || account.company_name || `Distributor #${account.distributor_id}`;
  const creditLimit = Number(account.credit_limit ?? 0);
  const currentBalance = Number(account.current_balance ?? 0);
  const availableCredit = Number(account.available_credit ?? 0);

  const fmt = (val) =>
    Number(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleProceedPayment = async () => {
    if (currentBalance <= 0) {
      setError("No outstanding balance to settle.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const session = await initiateCreditSettlement(token, creditId, currentBalance);
      if (onInitiateGateway) {
        onInitiateGateway(session);
      }
      onClose();
    } catch (err) {
      console.error("Initiate credit settlement error:", err);
      setError(err.message || "Failed to initialize payment gateway for credit settlement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-100 rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
          >
            <FiX size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-md">
              <FiCreditCard size={20} />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">
                Online Debt Settlement
              </span>
              <h2 className="text-base font-black text-white leading-tight">
                Clear Outstanding Credit Balance
              </h2>
            </div>
          </div>

          <div className="mt-5 bg-slate-800/90 rounded-2xl p-4 flex items-center justify-between border border-slate-700/60">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Distributor Account</p>
              <p className="text-sm font-black text-white">{distributorName}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">Outstanding Debt</p>
              <p className="text-xl font-black text-rose-400">LKR {fmt(currentBalance)}</p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-3.5 text-xs font-bold flex items-center gap-2">
              <FiAlertCircle className="shrink-0 text-red-500" size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Account Breakdown Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Credit Limit</p>
              <p className="text-sm font-black text-slate-800 mt-0.5">LKR {fmt(creditLimit)}</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Current Available</p>
              <p className="text-sm font-black text-blue-600 mt-0.5">LKR {fmt(availableCredit)}</p>
            </div>
          </div>

          {/* Settlement Highlight Box */}
          <div className="bg-emerald-50/80 border border-emerald-100/90 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
              <FiCheckCircle size={16} className="text-emerald-600 shrink-0" />
              <span>Instant Full Credit Line Restoration</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium leading-relaxed">
              Paying the full balance of <strong className="font-extrabold text-emerald-900">LKR {fmt(currentBalance)}</strong> will reset your debt to <strong className="font-extrabold text-emerald-900">LKR 0.00</strong> and instantly restore your available credit to <strong className="font-extrabold text-emerald-900">100% (LKR {fmt(creditLimit)})</strong>.
            </p>
          </div>

          {/* Security & Sandbox Badge */}
          <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold">
            <FiLock size={13} className="text-slate-400 shrink-0" />
            <span>Encrypted sandbox transaction with instantaneous credit confirmation</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 px-4 border border-slate-200 text-slate-600 font-black text-xs rounded-2xl hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleProceedPayment}
              disabled={loading || currentBalance <= 0}
              className="flex-[2] py-3.5 px-5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-xs rounded-2xl transition shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" size={15} />
                  <span>Connecting to Gateway...</span>
                </>
              ) : (
                <>
                  <span>Pay Full Balance (LKR {fmt(currentBalance)})</span>
                  <FiArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
