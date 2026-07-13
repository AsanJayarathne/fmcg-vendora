import { Search, RotateCcw } from "lucide-react";

export default function RequestStockFilters({
  search = "",
  onSearchChange,
  selectedCategory = "",
  onCategoryChange,
  categories = [],
  selectedStatus = "",
  onStatusChange,
  statuses = [],
  onReset,
  showCategory = true,
  showStatus = true,
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg font-sans">
      <div className="flex gap-4">
        {/* Search */}
        <div className="flex items-center px-3 border rounded-md w-48 bg-white">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="w-full py-2 text-xs outline-none text-gray-700 placeholder-gray-400 bg-white"
          />
          <Search size={14} className="text-gray-400" />
        </div>

        {/* Category */}
        {showCategory && (
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-2 text-xs font-semibold border rounded-md text-gray-700 bg-white cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}

        {/* Status */}
        {showStatus && (
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-2 text-xs font-semibold border rounded-md text-gray-700 bg-white cursor-pointer"
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold border rounded-md text-gray-600 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer bg-white"
      >
        <RotateCcw size={14} />
        Reset Filters
      </button>
    </div>
  );
}