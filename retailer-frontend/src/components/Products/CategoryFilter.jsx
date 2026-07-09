/**
 * CategoryFilter
 * Renders category pill buttons using the original Tailwind styles.
 * Accepts dynamic categories from the API instead of a hardcoded array.
 *
 * Props:
 *  - categories: Array<{ category_id, category_name }>
 *  - selectedCategoryId: number | null  (null = "All")
 *  - onSelect: (categoryId) => void
 *  - isLoading: boolean
 */
function CategoryFilter({ categories, selectedCategoryId, onSelect, isLoading }) {
  const items = [
    { category_id: null, category_name: "All" },
    ...(categories ?? []),
  ];

  if (isLoading) {
    // Skeleton pills matching original button size
    return (
      <div className="flex gap-3 overflow-x-auto mb-8">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className="px-4 py-2 rounded-full border bg-gray-100 animate-pulse w-20 h-9"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto mb-8">
      {items.map((cat) => (
        <button
          key={cat.category_id ?? "all"}
          id={`category-filter-${cat.category_id ?? "all"}`}
          onClick={() => onSelect(cat.category_id)}
          className={`px-4 py-2 rounded-full border whitespace-nowrap ${
            selectedCategoryId === cat.category_id
              ? "bg-blue-600 text-white"
              : "bg-white"
          }`}
        >
          {cat.category_name}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;