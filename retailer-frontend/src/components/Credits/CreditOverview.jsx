import { useState, useEffect } from "react";

export default function CreditOverview({ data = {}, onSelectDistributor }) {
  const accounts = data.accounts ?? (data.all_accounts ?? []);
  // Default to -1 (All Accounts combined) if multiple accounts exist, or 0 if single account
  const [selectedIndex, setSelectedIndex] = useState(accounts.length > 1 ? -1 : 0);

  // Sync when selectedDistributorId changes
  useEffect(() => {
    if (data.selectedDistributorId && accounts.length > 0) {
      const idx = accounts.findIndex(
        (a) => String(a.distributor_id) === String(data.selectedDistributorId)
      );
      if (idx !== -1) setSelectedIndex(idx);
    } else if (!data.selectedDistributorId && accounts.length > 1) {
      setSelectedIndex(-1); // Show combined total when no filter
    }
  }, [data.selectedDistributorId, accounts]);

  // Combined totals across all accounts
  const combinedLimit = accounts.reduce((sum, a) => sum + Number(a.credit_limit ?? 0), 0);
  const combinedUsed = accounts.reduce((sum, a) => sum + Number(a.current_balance ?? 0), 0);
  const combinedAvailable = accounts.reduce((sum, a) => sum + Number(a.available_credit ?? 0), 0);

  // Active account data
  const currentAccount = selectedIndex >= 0 ? (accounts[selectedIndex] ?? null) : null;

  const distributorName = currentAccount
    ? (currentAccount.distributor_name || currentAccount.company_name)
    : (accounts.length > 1 ? "All Distributors (Combined)" : (data.distributorName || data.distributor_name || ""));

  const limit = currentAccount
    ? Number(currentAccount.credit_limit ?? 0)
    : (accounts.length > 1 ? combinedLimit : Number(data.limit ?? data.credit_limit ?? 0));

  const used = currentAccount
    ? Number(currentAccount.current_balance ?? 0)
    : (accounts.length > 1 ? combinedUsed : Number(data.used ?? data.current_balance ?? 0));

  const available = currentAccount
    ? Number(currentAccount.available_credit ?? 0)
    : (accounts.length > 1 ? combinedAvailable : Number(data.available ?? data.available_credit ?? 0));

  const status = currentAccount ? currentAccount.status : data.status;
  const isBlocked = status === "Blocked";
  const usedPercent = limit ? Math.min(100, (used / limit) * 100) : 0;

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
    } else if (idx === -1 && onSelectDistributor) {
      onSelectDistributor(null, "");
    }
  };

  return (
    <div className="h-full w-full rounded-3xl bg-white p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
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
            <option value={-1}>All Accounts (Total Combined)</option>
            {accounts.map((acc, idx) => (
              <option key={acc.credit_id || idx} value={idx}>
                {acc.distributor_name || `Distributor #${acc.distributor_id}`}
              </option>
            ))}
          </select>
        ) : (
          <div className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-blue-600 text-xs font-bold">
            {usedPercent.toFixed(0)}% used
          </div>
        )}
      </div>

      <div className="mt-5 space-y-3 flex-1 flex flex-col justify-center">
        <div className="rounded-2xl border border-blue-100/50 bg-blue-50/40 p-4">
          <p className="text-[10px] font-bold text-blue-600/70 uppercase tracking-wider mb-1">Credit Limit</p>
          <p className="text-xl font-black text-blue-700">Rs. {fmt(limit)}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-amber-50/40 p-4">
            <p className="text-[10px] font-bold text-amber-600/70 uppercase tracking-wider mb-1">Used</p>
            <p className="text-lg font-bold text-amber-700">Rs. {fmt(used)}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-green-50/40 p-4">
            <p className="text-[10px] font-bold text-green-600/70 uppercase tracking-wider mb-1">Available</p>
            <p className="text-lg font-bold text-green-700">Rs. {fmt(available)}</p>
          </div>
        </div>
      </div>

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
  );
}
