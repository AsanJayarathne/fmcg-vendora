import { Search, RotateCcw, LayoutGrid, List } from "lucide-react";

export default function ProductFilters({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  categories = [],
  selectedStatus,
  setSelectedStatus,
  onReset,
  viewMode = "grid",
  setViewMode,
}) {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
      {/* Search Input - Pill styled like retailer */}
      <div className="relative flex-1 w-full">
        <input
          type="text"
          placeholder="Search products by name or code (PRD-XXX)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-slate-200 focus:border-blue-500 rounded-full pl-10 pr-5 py-3 text-xs font-bold outline-none bg-white text-slate-700 placeholder-slate-400 transition duration-300 shadow-2xs focus:ring-4 focus:ring-blue-500/10"
        />
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        {/* Status Dropdown */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full sm:w-auto border border-slate-200 focus:border-blue-500 rounded-full px-5 py-3 focus:outline-none focus:ring-4 focus:ring-blue-500/10 bg-white text-xs font-bold transition duration-300 shadow-2xs appearance-none cursor-pointer text-slate-600"
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
            backgroundPosition: 'right 1.25rem center',
            backgroundSize: '1.25em 1.25em',
            backgroundRepeat: 'no-repeat',
            paddingRight: '2.5rem'
          }}
        >
          <option value="">All Statuses</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out Of Stock">Out Of Stock</option>
        </select>

        {/* View Switcher: Grid / Table */}
        {setViewMode && (
          <div className="flex bg-white border border-slate-200 rounded-full p-1 shadow-2xs">
            <button
              onClick={() => setViewMode("grid")}
              title="Grid View"
              className={`p-2 rounded-full transition cursor-pointer ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("table")}
              title="Table View"
              className={`p-2 rounded-full transition cursor-pointer ${
                viewMode === "table"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <List size={16} />
            </button>
          </div>
        )}

        {/* Reset Filters Button */}
        {(search || selectedCategory || selectedStatus) && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-3 text-xs font-bold border border-slate-200 rounded-full text-slate-500 bg-white hover:border-blue-500 hover:text-blue-600 transition cursor-pointer shadow-2xs"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}