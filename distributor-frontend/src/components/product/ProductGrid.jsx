import ProductCard from "./ProductCard";

export default function ProductGrid({ products = [], onViewProduct, isLoading }) {
  // Loading skeleton layout matching cards
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className="bg-white rounded-[32px] border border-slate-100 p-5 shadow-xs animate-pulse">
            <div className="h-[140px] bg-slate-100 rounded-[20px] mb-4" />
            <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
            <div className="h-3 bg-slate-100 rounded w-1/2 mb-3" />
            <div className="h-5 bg-slate-100 rounded w-1/3 mb-4" />
            <div className="h-9 bg-slate-100 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-[32px] text-center py-16 px-4 shadow-xs">
        <p className="text-5xl mb-3">🔍</p>
        <p className="font-extrabold text-slate-800 text-lg">No products found</p>
        <p className="text-slate-400 text-xs mt-1">Try selecting a different category or adjusting your search term</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const key = product.product_id ?? product.id;
        return (
          <ProductCard
            key={key}
            product={product}
            onView={onViewProduct}
          />
        );
      })}
    </div>
  );
}
