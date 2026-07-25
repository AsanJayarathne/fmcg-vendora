import { Search, RotateCcw } from "lucide-react";

const STATUSES = ["All", "OPEN", "CLAIMED", "DELIVERED", "RETURNED"];

export default function DeliveryFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onReset,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white border border-gray-200 rounded-lg">
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="flex items-center px-3 border rounded-md w-52">
          <input
            type="text"
            placeholder="Search by ID, retailer, driver…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full py-2 text-xs outline-none"
          />
          <Search size={14} className="text-gray-400 shrink-0" />
        </div>

        {/* Status */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-2 text-xs font-semibold border rounded-md bg-white"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "All" ? "All Statuses" : s.charAt(0) + s.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-5 py-2 text-xs font-semibold border rounded-md hover:bg-gray-50 transition"
      >
        <RotateCcw size={13} />
        Reset Filters
      </button>
    </div>
  );
}