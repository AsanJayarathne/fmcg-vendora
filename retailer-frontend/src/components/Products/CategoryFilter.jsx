const categories = [
  "All",
  "Dairy",
  "Beverages",
  "Snacks",
  "Soap",
  "Household",
];

function CategoryFilter({
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div className="flex gap-3 overflow-x-auto mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() =>
            setSelectedCategory(category)
          }
          className={`px-4 py-2 rounded-full border
          ${
            selectedCategory === category
              ? "bg-blue-600 text-white"
              : "bg-white"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;