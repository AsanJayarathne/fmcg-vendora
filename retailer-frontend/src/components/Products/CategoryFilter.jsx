/**
 * CategoryFilter
 * Renders category pill buttons with matching blue themes and micro-animations.
 */
function CategoryFilter({ categories, selectedCategoryId, onSelect, isLoading }) {
  const items = [
    { category_id: null, category_name: "All" },
    ...(categories ?? []),
  ];

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto mb-8 pb-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className="px-5 py-2.5 rounded-full border border-slate-100 bg-slate-100/70 animate-pulse w-24 h-10 shrink-0"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto mb-8 pb-1 no-scrollbar">
      {items.map((cat) => (
        <button
          key={cat.category_id ?? "all"}
          id={`category-filter-${cat.category_id ?? "all"}`}
          onClick={() => onSelect(cat.category_id)}
          className={`px-5 py-2.5 rounded-full border text-xs font-black uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98] ${
            selectedCategoryId === cat.category_id
              ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200"
              : "bg-white border-slate-200 hover:border-blue-500 text-slate-500 hover:text-blue-600"
          }`}
        >
          {cat.category_name}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;