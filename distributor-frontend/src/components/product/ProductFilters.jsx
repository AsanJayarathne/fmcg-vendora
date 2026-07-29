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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-slate-100 rounded-3xl shadow-xs">
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        {/* Search Input */}
        <div className="relative flex-1 sm:w-64">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-200 focus:border-blue-500 rounded-full pl-9 pr-4 py-2.5 text-xs font-semibold outline-none bg-white text-slate-700 placeholder-slate-400 transition"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Categories Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 text-xs font-semibold border border-slate-200 rounded-full bg-white text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
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
          className="px-4 py-2.5 text-xs font-semibold border border-slate-200 rounded-full bg-white text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
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
        className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border border-slate-200 rounded-full text-slate-600 bg-white hover:bg-slate-50 transition cursor-pointer shadow-2xs"
      >
        <RotateCcw size={13} />
        Reset Filters
      </button>
    </div>
  );
}