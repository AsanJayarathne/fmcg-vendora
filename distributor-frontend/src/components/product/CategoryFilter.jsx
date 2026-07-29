/**
 * CategoryFilter
 * Renders category pill buttons with matching blue themes and micro-animations for distributor products page.
 */
export default function CategoryFilter({ categories = [], selectedCategory, onSelect, isLoading }) {
  const items = [
    { id: "", name: "All" },
    ...categories.map((cat) => {
      if (typeof cat === "string") {
        return { id: cat, name: cat };
      }
      return { id: cat.category_name || cat.name, name: cat.category_name || cat.name };
    }),
  ];

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto mb-6 pb-1">
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
    <div className="flex gap-3 overflow-x-auto mb-6 pb-1 no-scrollbar">
      {items.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            key={cat.id || "all"}
            onClick={() => onSelect(cat.id)}
            className={`px-5 py-2.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98] ${
              isSelected
                ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200"
                : "bg-white border-slate-200 hover:border-blue-500 text-slate-500 hover:text-blue-600"
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
