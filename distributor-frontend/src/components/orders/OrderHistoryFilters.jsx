import { RotateCcw } from "lucide-react";

export default function OrderHistoryFilters({
  search, setSearch,
  statusFilter, setStatusFilter,
  onReset,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white border border-gray-200 rounded-lg">
      <div className="flex flex-wrap gap-3 items-center">

        {/* Search by retailer name */}
        <input
          type="text"
          placeholder="Search retailer…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 text-xs font-medium border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-44"
        />

        {/* Delivery status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 text-xs font-semibold border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All (Delivered + Returned)</option>
          <option value="DELIVERED">Delivered only</option>
          <option value="RETURNED">Returned only</option>
        </select>

      </div>

      <button
        onClick={onReset}
        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold border border-gray-200 rounded-md hover:bg-gray-50 transition"
      >
        <RotateCcw size={13} />
        Reset
      </button>
    </div>
  );
}