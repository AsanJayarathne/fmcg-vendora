import { useState, useEffect } from "react";
import { FiCreditCard, FiCheckCircle, FiShield, FiArrowRight, FiCheck, FiClock, FiAlertTriangle, FiCalendar } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { fetchCreditInfo } from "../../services/orderService";
import SettleDebitModal from "./SettleDebitModal";
import PaymentGatewayModal from "../PaymentGatewayModal";

export default function CreditOverview({ data = {}, onSelectDistributor, onRefresh }) {
  const { auth } = useAuth();
  const token = auth?.token ?? null;

  const [localAccounts, setLocalAccounts] = useState(data.accounts ?? (data.all_accounts ?? []));
  const accounts = localAccounts;

  // Default to first account (index 0)
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Modals state
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [targetAccountForSettlement, setTargetAccountForSettlement] = useState(null);
  const [gatewaySession, setGatewaySession] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

  useEffect(() => {
    if (data.accounts || data.all_accounts) {
      setLocalAccounts(data.accounts ?? (data.all_accounts ?? []));
    }
  }, [data]);

  // Sync when selectedDistributorId changes
  useEffect(() => {
    if (data.selectedDistributorId && accounts.length > 0) {
      const idx = accounts.findIndex(
        (a) => String(a.distributor_id) === String(data.selectedDistributorId)
      );
      if (idx !== -1) setSelectedIndex(idx);
    }
  }, [data.selectedDistributorId, accounts]);

  // Active account data
  const currentAccount = accounts[selectedIndex] ?? accounts[0] ?? null;

  const distributorName = currentAccount
    ? (currentAccount.distributor_name || currentAccount.company_name)
    : (data.distributorName || data.distributor_name || "");

  const limit = currentAccount
    ? Number(currentAccount.credit_limit ?? 0)
    : Number(data.limit ?? data.credit_limit ?? 0);

  const used = currentAccount
    ? Number(currentAccount.current_balance ?? 0)
    : Number(data.used ?? data.current_balance ?? 0);

  const available = currentAccount
    ? Number(currentAccount.available_credit ?? 0)
    : Number(data.available ?? data.available_credit ?? 0);

  const status = currentAccount ? currentAccount.status : data.status;
  const isBlocked = status === "Blocked";
  const usedPercent = limit ? Math.min(100, (used / limit) * 100) : 0;

  // 30 Days Credit Settlement Period Calculation
  const CREDIT_TERM_DAYS = 30;
  const transactions = data.transactions ?? (currentAccount?.transactions ?? []);
  const latestDebitTxn = transactions.find(
    (t) => (t.transaction_type || t.type)?.toLowerCase() === "debit"
  );
  
  const debtStartDateStr =
    latestDebitTxn?.created_at ||
    currentAccount?.last_debit_date ||
    currentAccount?.updated_at ||
    currentAccount?.created_at;

  const debtStartDate = debtStartDateStr ? new Date(debtStartDateStr) : new Date();
  const now = new Date();
  const diffMs = now.getTime() - debtStartDate.getTime();
  const daysElapsed = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  const daysRemaining = Math.max(0, CREDIT_TERM_DAYS - daysElapsed);
  
  const dueDate = new Date(debtStartDate);
  dueDate.setDate(dueDate.getDate() + CREDIT_TERM_DAYS);
  const formattedDueDate = dueDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const fmt = (val) =>
    Number(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleSelectChange = (e) => {
    const idx = Number(e.target.value);
    setSelectedIndex(idx);
    const selected = accounts[idx];
    if (selected && onSelectDistributor) {
      onSelectDistributor(selected.distributor_id, selected.distributor_name);
    }
  };

  const handleOpenSettleModal = () => {
    if (currentAccount) {
      setTargetAccountForSettlement(currentAccount);
      setIsSettleModalOpen(true);
    } else if (accounts.length > 0) {
      // Find the first account with debt
      const accWithDebt = accounts.find((a) => Number(a.current_balance ?? 0) > 0) || accounts[0];
      setTargetAccountForSettlement(accWithDebt);
      setIsSettleModalOpen(true);
    }
  };

  const handlePaymentSuccess = async (res) => {
    setGatewaySession(null);
    setSuccessToast("Online settlement completed successfully! Your credit limit is fully restored.");

    // Refresh credit info
    if (onRefresh) {
      onRefresh();
    } else if (token) {
      try {
        const refreshed = await fetchCreditInfo(token);
        if (refreshed?.accounts) {
          setLocalAccounts(refreshed.accounts);
        }
      } catch (err) {
        console.error("Failed to refresh credit accounts after settlement:", err);
      }
    }

    setTimeout(() => {
      setSuccessToast(null);
    }, 6000);
  };

  return (
    <div className="h-full w-full rounded-3xl bg-white p-6 border border-slate-100 shadow-xs flex flex-col justify-between relative">
      
      {/* Success Notification Banner */}
      {successToast && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-3.5 text-xs font-bold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <FiCheckCircle className="text-emerald-600 shrink-0" size={16} />
            <span>{successToast}</span>
          </div>
          <button 
            onClick={() => setSuccessToast(null)} 
            className="text-emerald-500 hover:text-emerald-800 font-black text-xs ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-800 text-base leading-tight">Credit Overview</h2>
              {isBlocked && (
                <span className="rounded-full bg-rose-50 border border-rose-200 px-2 py-0.5 text-rose-600 text-[10px] font-extrabold uppercase">
                  Blocked
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {distributorName ? `Account with ${distributorName}` : "Current balance and usage"}
            </p>
          </div>

          {accounts.length > 1 ? (
            <select
              value={selectedIndex}
              onChange={handleSelectChange}
              className="text-xs font-bold bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {accounts.map((acc, idx) => (
                <option key={acc.credit_id || idx} value={idx}>
                  {acc.distributor_name || acc.company_name || `Distributor #${acc.distributor_id}`}
                </option>
              ))}
            </select>
          ) : (
            <div className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-blue-600 text-xs font-bold">
              {usedPercent.toFixed(0)}% used
            </div>
          )}
        </div>

        {/* Balance Cards */}
        <div className="mt-5 space-y-3">
          <div className="rounded-2xl border border-blue-100/50 bg-blue-50/40 p-4">
            <p className="text-[10px] font-bold text-blue-600/70 uppercase tracking-wider mb-1">Credit Limit</p>
            <p className="text-xl font-black text-blue-700">Rs. {fmt(limit)}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-amber-50/40 p-4">
              <p className="text-[10px] font-bold text-amber-600/70 uppercase tracking-wider mb-1">Used (Outstanding Debt)</p>
              <p className="text-lg font-bold text-amber-700">Rs. {fmt(used)}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-green-50/40 p-4">
              <p className="text-[10px] font-bold text-green-600/70 uppercase tracking-wider mb-1">Available</p>
              <p className="text-lg font-bold text-green-700">Rs. {fmt(available)}</p>
            </div>
          </div>

          {/* 30-Day Settlement Countdown Timeline */}
          <div
            className={`rounded-2xl border p-4 transition-all duration-300 ${
              used > 0
                ? daysRemaining <= 3
                  ? "bg-rose-50/80 border-rose-200 text-rose-900"
                  : daysRemaining <= 10
                  ? "bg-amber-50/80 border-amber-200 text-amber-900"
                  : "bg-indigo-50/60 border-indigo-100 text-indigo-900"
                : "bg-slate-50/80 border-slate-100 text-slate-700"
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <FiClock
                  size={15}
                  className={
                    used > 0
                      ? daysRemaining <= 3
                        ? "text-rose-600 animate-pulse"
                        : daysRemaining <= 10
                        ? "text-amber-600"
                        : "text-indigo-600"
                      : "text-slate-400"
                  }
                />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Settlement Timeline (30 Days)
                </span>
              </div>
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                  used > 0
                    ? daysRemaining <= 3
                      ? "bg-rose-100 border-rose-300 text-rose-700"
                      : daysRemaining <= 10
                      ? "bg-amber-100 border-amber-300 text-amber-800"
                      : "bg-indigo-100 border-indigo-200 text-indigo-700"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700"
                }`}
              >
                {used > 0
                  ? daysRemaining === 0
                    ? "Overdue"
                    : `${daysRemaining} Days Left`
                  : "30-Day Active Term"}
              </span>
            </div>

            {used > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-600">
                    {daysRemaining === 0
                      ? "Grace period expired — please settle debt"
                      : `Must settle within ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`}
                  </span>
                  <span className="font-bold text-slate-700">Due: {formattedDueDate}</span>
                </div>
                {/* 30-Day Progress Bar */}
                <div className="w-full bg-slate-200/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      daysRemaining <= 3
                        ? "bg-rose-600"
                        : daysRemaining <= 10
                        ? "bg-amber-500"
                        : "bg-indigo-600"
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(5, (daysElapsed / CREDIT_TERM_DAYS) * 100))}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>Day {Math.min(30, daysElapsed)}</span>
                  <span>30 Days Maximum Period</span>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 font-medium">
                Retailers have a maximum of 30 days to settle their credit after placing orders.
              </p>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Usage progress</span>
            <span>{usedPercent.toFixed(0)}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-300 ${isBlocked ? "bg-rose-500" : "bg-blue-600"}`}
              style={{ width: `${Math.min(100, Math.max(0, usedPercent))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Online Debt Settlement CTA Button */}
      <div className="mt-6 pt-4 border-t border-slate-50">
        {used > 0 ? (
          <button
            type="button"
            onClick={handleOpenSettleModal}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] text-white font-black text-xs rounded-2xl transition shadow-md shadow-emerald-600/20 flex items-center justify-between gap-2 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center text-white">
                <FiCreditCard size={15} />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider">Instant Online Payment</p>
                <p className="text-xs font-black text-white">Settle Full Debt (Rs. {fmt(used)})</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white/15 px-3 py-1.5 rounded-xl text-[11px] font-bold">
              <span>Pay Now</span>
              <FiArrowRight size={13} />
            </div>
          </button>
        ) : (
          <div className="w-full py-3 px-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center gap-2 text-slate-400 font-bold text-xs">
            <FiCheck size={14} className="text-emerald-500" />
            <span>Zero Outstanding Debt</span>
          </div>
        )}
      </div>

      {/* Settle Debit Modal */}
      {isSettleModalOpen && targetAccountForSettlement && (
        <SettleDebitModal
          isOpen={isSettleModalOpen}
          onClose={() => setIsSettleModalOpen(false)}
          account={targetAccountForSettlement}
          token={token}
          onInitiateGateway={(session) => setGatewaySession(session)}
        />
      )}

      {/* Payment Gateway Modal */}
      {gatewaySession && (
        <PaymentGatewayModal
          sessionData={gatewaySession}
          onClose={() => setGatewaySession(null)}
          onCancel={() => setGatewaySession(null)}
          onSuccess={handlePaymentSuccess}
          onFailure={() => {}}
        />
      )}
    </div>
  );
}
