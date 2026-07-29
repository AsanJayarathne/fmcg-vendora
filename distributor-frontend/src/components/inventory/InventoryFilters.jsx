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
    <div className="space-y-4 mb-6">

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => onCategoryChange("")}
          className={`px-5 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98] ${
            selectedCategory === ""
              ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200"
              : "bg-white border-slate-200 hover:border-blue-500 text-slate-500 hover:text-blue-600"
          }`}
        >
          All Categories
        </button>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-5 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98] ${
                isSelected
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200"
                  : "bg-white border-slate-200 hover:border-blue-500 text-slate-500 hover:text-blue-600"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Search + Status Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
          
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] sm:min-w-[260px]">
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search product name or ID..."
              className="w-full border border-slate-200 focus:border-blue-500 rounded-full pl-10 pr-5 py-3 text-xs font-semibold outline-none bg-white text-slate-700 placeholder-slate-400 transition duration-300 shadow-2xs focus:ring-4 focus:ring-blue-500/10"
            />
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="border border-slate-200 focus:border-blue-500 rounded-full px-5 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500/10 bg-white text-xs font-semibold transition duration-300 shadow-2xs appearance-none cursor-pointer text-slate-600"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: 'right 1.25rem center',
              backgroundSize: '1.25em 1.25em',
              backgroundRepeat: 'no-repeat',
              paddingRight: '2.5rem'
            }}
          >
            <option value="">All Stock Statuses</option>
            <option value="Good">Good Stock</option>
            <option value="Low">Low Stock Alert</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

        </div>

        {/* Reset Filters */}
        {(search || selectedCategory || selectedStatus) && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-5 py-3 text-xs font-semibold border border-slate-200 rounded-full text-slate-500 bg-white hover:border-blue-500 hover:text-blue-600 transition cursor-pointer shadow-2xs"
          >
            <RotateCcw size={14} />
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}