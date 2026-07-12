import ProductCard from "./ProductCard";

function ProductGrid({ products, onView, onCart, isLoading }) {

  // Loading skeleton — matches original grid layout
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
            <div className="h-40 bg-gray-200 rounded-lg mb-3" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-9 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-5xl mb-3">🔍</p>
        <p className="font-semibold text-base">No products found</p>
        <p className="text-sm">Try a different category or search term</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const key = `${product.product_id ?? product.id}-${product.distributor_id}`;
          return (
            <ProductCard
              key={key}
              product={product}
              onView={onView}
              onCart={onCart}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ProductGrid;