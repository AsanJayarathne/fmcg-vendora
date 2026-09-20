import { FiX, FiRefreshCw, FiFilter, FiCheck } from "react-icons/fi";
import { useLanguage } from "../../context/LanguageContext";

export default function DashboardFilterModal({
  isOpen,
  onClose,
  timeframe,
  setTimeframe,
  distributors = [],
  selectedDistributor,
  setSelectedDistributor,
  selectedPayment,
  setSelectedPayment,
  selectedStatus,
  setSelectedStatus,
  onReset,
}) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const timeframeOptions = [
    { label: t("dashboard.allTime", "All Time"), value: "All Time" },
    { label: t("dashboard.thisWeek", "This Week"), value: "This Week" },
    { label: t("dashboard.thisMonth", "This Month"), value: "This Month" },
    { label: t("dashboard.lastMonth", "Last Month"), value: "Last Month" },
    { label: t("dashboard.thisQuarter", "This Quarter"), value: "This Quarter" },
    { label: t("dashboard.thisYear", "This Year"), value: "This Year" },
  ];

  const paymentOptions = [
    { label: t("payment.allMethods", "All Methods"), value: "" },
    { label: t("payment.cashOnDelivery", "Cash"), value: "Cash" },
    { label: t("payment.credit30Days", "Credit"), value: "Credit" },
    { label: t("payment.splitCashCredit", "Cash + Credit"), value: "Cash_Credit" },
  ];

  const statusOptions = [
    { label: t("orders.allOrders", "All Statuses"), value: "" },
    { label: t("orders.processing", "Placed / Processing"), value: "Processing" },
    { label: t("orders.accepted", "Accepted / Approved"), value: "Approved" },
    { label: t("orders.claimed", "Out for Delivery"), value: "CLAIMED" },
    { label: t("orders.delivered", "Delivered"), value: "Delivered" },
    { label: t("orders.rejected", "Cancelled / Rejected"), value: "Rejected" },
  ];

  const hasActiveFilters =
    timeframe !== "All Time" ||
    selectedDistributor !== "" ||
    selectedPayment !== "" ||
    selectedStatus !== "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <FiFilter size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 leading-tight">
                {t("dashboard.filterModalTitle", "Filter Dashboard Data")}
              </h2>
              <p className="text-xs text-slate-400 font-normal">
                {t("dashboard.filterModalSubtitle", "Refine metrics, charts & lists")}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 no-scrollbar">
          {/* Timeframe Section */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              {t("dashboard.timePeriod", "Time Period")}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {timeframeOptions.map((opt) => {
                const active = timeframe === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTimeframe(opt.value)}
                    className={`px-3 py-2.5 rounded-2xl text-xs font-semibold border text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      active
                        ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                        : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {active && <FiCheck size={13} />}
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Distributor Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              {t("dashboard.distributor", "Distributor")}
            </label>
            <select
              value={selectedDistributor}
              onChange={(e) => setSelectedDistributor(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition cursor-pointer"
            >
              <option value="">{t("dashboard.allDistributors", "All Distributors")}</option>
              {distributors.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              {t("payment.paymentMethod", "Payment Method")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {paymentOptions.map((opt) => {
                const active = selectedPayment === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedPayment(opt.value)}
                    className={`px-3.5 py-2.5 rounded-2xl text-xs font-semibold border text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
                      active
                        ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                        : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {active && <FiCheck size={13} />}
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Order Status Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              {t("orders.orderStatus", "Order Status")}
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition cursor-pointer"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onReset}
            disabled={!hasActiveFilters}
            className={`flex items-center gap-1.5 text-xs font-semibold transition cursor-pointer px-3.5 py-2 rounded-xl border ${
              hasActiveFilters
                ? "text-slate-600 bg-white border-slate-200 hover:bg-slate-100"
                : "text-slate-300 border-transparent cursor-not-allowed"
            }`}
          >
            <FiRefreshCw size={13} />
            {t("common.reset", "Reset All")}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
          >
            {t("common.apply", "Apply Filters")}
          </button>
        </div>
      </div>
    </div>
  );
}
