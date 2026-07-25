import { RotateCcw, Search, Calendar } from "lucide-react";

export default function OrderHistoryFilters({
  search, setSearch,
  statusFilter, setStatusFilter,
  dateFrom, setDateFrom,
  dateTo, setDateTo,
  onReset,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-gray-200 rounded-xl">
      <div className="flex flex-wrap gap-3 items-center">

        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by retailer or order ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 text-xs font-medium border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 w-52"
          />
        </div>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          <option value="">All Statuses</option>
          <option value="DELIVERED">Delivered</option>
          <option value="RETURNED">Returned</option>
        </select>

        {/* Date From */}
        <div className="flex items-center gap-1.5">
          <Calendar size={13} className="text-gray-400 shrink-0" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>

        {/* Date To */}
        <span className="text-xs text-gray-400 font-medium">to</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
        />

      </div>

      <button
        onClick={onReset}
        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 transition"
      >
        <RotateCcw size={13} />
        Reset
      </button>
    </div>
  );
}