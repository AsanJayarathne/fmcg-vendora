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
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] sm:min-w-[260px]">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, ID, or remarks..."
            className="w-full border border-slate-200 focus:border-blue-500 rounded-full pl-10 pr-5 py-3 text-xs font-semibold outline-none bg-white text-slate-700 placeholder-slate-400 transition duration-300 shadow-2xs focus:ring-4 focus:ring-blue-500/10"
          />
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {/* Category Dropdown */}
        {showCategory && (
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="border border-slate-200 focus:border-blue-500 rounded-full px-5 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500/10 bg-white text-xs font-semibold transition duration-300 shadow-2xs appearance-none cursor-pointer text-slate-600"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: 'right 1.25rem center',
              backgroundSize: '1.25em 1.25em',
              backgroundRepeat: 'no-repeat',
              paddingRight: '2.5rem'
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}

        {/* Status Dropdown */}
        {showStatus && (
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
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Reset */}
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
  );
}