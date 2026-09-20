import { useLanguage } from "../../context/LanguageContext";

/**
 * CategoryFilter
 * Renders category pill buttons with matching blue themes, smooth mobile touch scrolling and micro-animations.
 */
function CategoryFilter({ categories, selectedCategoryId, onSelect, isLoading }) {
  const { t } = useLanguage();

  const items = [
    { category_id: null, category_name: t("products.allCategories", "All Products") },
    ...(categories ?? []),
  ];

  if (isLoading) {
    return (
      <div className="flex gap-2 sm:gap-3 overflow-x-auto mb-6 pb-2 no-scrollbar">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className="px-4 py-2 rounded-full border border-slate-100 bg-slate-100/70 animate-pulse w-24 h-9 shrink-0"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 sm:gap-3 overflow-x-auto mb-6 pb-2 no-scrollbar touch-pan-x -mx-1 px-1">
      {items.map((cat) => (
        <button
          key={cat.category_id ?? "all"}
          id={`category-filter-${cat.category_id ?? "all"}`}
          type="button"
          onClick={() => onSelect(cat.category_id)}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border text-xs font-black uppercase tracking-wider transition-all duration-200 whitespace-nowrap cursor-pointer shadow-2xs shrink-0 ${
            selectedCategoryId === cat.category_id
              ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20"
              : "bg-white border-slate-200 hover:border-blue-500 text-slate-600 hover:text-blue-600"
          }`}
        >
          {cat.category_name}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;