import React from "react";
import { Search, RotateCcw } from "lucide-react";

const ProductFilters = ({
  categories = [],
  selectedCategory = "all",
  onCategoryChange,
  selectedStatus = "all",
  onStatusChange,
  sortBy = "newest",
  onSortChange,
  search = "",
  onSearchChange,
  onReset,
}) => {
  return (
    <div className="space-y-4">
      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => onCategoryChange("all")}
          className={`px-5 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98] ${
            selectedCategory === "all"
              ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200"
              : "bg-white border-slate-200 hover:border-blue-500 text-slate-500 hover:text-blue-600"
          }`}
        >
          All Categories
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`px-5 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98] ${
              selectedCategory === cat
                ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200"
                : "bg-white border-slate-200 hover:border-blue-500 text-slate-500 hover:text-blue-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search & Select Controls */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by product name or ID..."
            className="w-full border border-slate-200 focus:border-blue-500 rounded-full pl-10 pr-5 py-3 text-xs font-semibold outline-none bg-white text-slate-700 placeholder-slate-400 transition duration-300 shadow-2xs focus:ring-4 focus:ring-blue-500/10"
          />
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Status Dropdown */}
        <div className="w-full md:w-44">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full border border-slate-200 focus:border-blue-500 rounded-full px-4 py-3 text-xs font-bold outline-none bg-white text-slate-700 transition shadow-2xs cursor-pointer focus:ring-4 focus:ring-blue-500/10"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="w-full md:w-48">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full border border-slate-200 focus:border-blue-500 rounded-full px-4 py-3 text-xs font-bold outline-none bg-white text-slate-700 transition shadow-2xs cursor-pointer focus:ring-4 focus:ring-blue-500/10"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="price_high">Price: High to Low</option>
            <option value="price_low">Price: Low to High</option>
          </select>
        </div>

        {/* Reset Button */}
        {onReset && (
          <button
            onClick={onReset}
            className="p-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition cursor-pointer shadow-2xs shrink-0"
            title="Reset Filters"
          >
            <RotateCcw size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
