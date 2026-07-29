import { FiX, FiRefreshCw, FiFilter, FiCheck } from "react-icons/fi";

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
  if (!isOpen) return null;

  const timeframeOptions = [
    { label: "All Time", value: "All Time" },
    { label: "This Week", value: "This Week" },
    { label: "This Month", value: "This Month" },
    { label: "Last Month", value: "Last Month" },
    { label: "This Quarter", value: "This Quarter" },
    { label: "This Year", value: "This Year" },
  ];

  const paymentOptions = [
    { label: "All Methods", value: "" },
    { label: "Cash", value: "Cash" },
    { label: "Credit", value: "Credit" },
    { label: "Cash + Credit", value: "Cash_Credit" },
  ];

  const statusOptions = [
    { label: "All Statuses", value: "" },
    { label: "Placed / Processing", value: "Processing" },
    { label: "Accepted / Approved", value: "Approved" },
    { label: "Out for Delivery", value: "CLAIMED" },
    { label: "Delivered", value: "Delivered" },
    { label: "Cancelled / Rejected", value: "Rejected" },
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
                Filter Dashboard Data
              </h2>
              <p className="text-xs text-slate-400 font-normal">
                Refine metrics, charts & lists
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
              Time Period
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
              Distributor
            </label>
            <select
              value={selectedDistributor}
              onChange={(e) => setSelectedDistributor(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition cursor-pointer"
            >
              <option value="">All Distributors</option>
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
              Payment Method
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
              Order Status
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
            Reset All
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
