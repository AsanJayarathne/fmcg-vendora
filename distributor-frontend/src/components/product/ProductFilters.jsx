import { Search, RotateCcw } from "lucide-react";

export default function ProductFilters({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  categories = [],
  selectedStatus,
  setSelectedStatus,
  onReset
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
      <div className="flex gap-6">
        {/* Search Input */}
        <div className="flex items-center w-48 px-3 py-1.5 border border-gray-200 rounded-lg bg-gray-50/50 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs outline-none bg-transparent placeholder-gray-400 text-slate-700"
          />
          <Search size={14} className="text-gray-400 ml-1.5 shrink-0" />
        </div>

        {/* Categories Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_name}>
              {cat.category_name}
            </option>
          ))}
        </select>

        {/* Status Dropdown */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out Of Stock">Out Of Stock</option>
        </select>
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition"
      >
        <RotateCcw size={13} />
        Reset Filters
      </button>
    </div>
  );
}