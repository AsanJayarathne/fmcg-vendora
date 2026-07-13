import { Search, RotateCcw } from "lucide-react";

export default function InventoryFilters({
  search = "",
  onSearchChange,
  selectedCategory = "",
  onCategoryChange,
  selectedStatus = "",
  onStatusChange,
  categories = [],
  onReset,
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg font-sans">
      <div className="flex gap-4">
        {/* Search */}
        <div className="flex items-center px-3 border rounded-md w-48">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or ID..."
            className="w-full py-2 text-xs outline-none text-gray-700 placeholder-gray-400"
          />
          <Search size={14} className="text-gray-400" />
        </div>

        {/* Category */}
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

        {/* Status */}
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-3 py-2 text-xs font-semibold border rounded-md text-gray-700 bg-white cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="Good">Good</option>
          <option value="Low">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
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