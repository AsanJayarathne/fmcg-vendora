import { FiHome, FiFilter, FiX } from "react-icons/fi";

export default function DashboardHeader({
  onOpenFilter,
  activeFilterCount = 0,
  activeFilterBadges = [],
  onRemoveFilter,
  onResetFilters,
}) {
  return (
    <div className="mb-6 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <FiHome className="text-blue-500" />
            Dashboard
          </h1>

          <p className="text-slate-400 text-sm mt-1 font-normal">
            Welcome back Here is your store performance overview
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <button
            onClick={onOpenFilter}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl shadow-xs transition cursor-pointer border ${activeFilterCount > 0
                ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
              }`}
          >
            <FiFilter className={activeFilterCount > 0 ? "text-white" : "text-slate-500"} />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-blue-600 text-xs font-bold flex items-center justify-center shadow-xs">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active Filter Chips / Badges */}
      {activeFilterBadges.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active Filters:
          </span>
          {activeFilterBadges.map((badge) => (
            <span
              key={badge.key}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 shadow-xs"
            >
              <span>{badge.label}</span>
              <button
                onClick={() => onRemoveFilter && onRemoveFilter(badge.key)}
                className="w-4 h-4 rounded-full bg-blue-200/60 hover:bg-blue-300 text-blue-800 flex items-center justify-center cursor-pointer transition"
                title="Remove filter"
              >
                <FiX size={10} />
              </button>
            </span>
          ))}

          <button
            onClick={onResetFilters}
            className="text-xs font-semibold text-red-500 hover:text-red-700 underline cursor-pointer ml-1"
          >
            Reset All
          </button>
        </div>
      )}
    </div>
  );
}