import ProductCard from "./ProductCard";

function RecommendedProducts({ products, onView, onCart, onViewAll }) {
  const recommended = products
    .filter((p) => (p.available_qty ?? p.stock ?? 0) > 0)
    .slice(0, 4);

  if (recommended.length === 0) return null;

  return (
    <div className="mb-10 min-w-0">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Recommended For You
          </h2>
          <p className="text-xs text-slate-400 font-normal mt-0.5">Handpicked items based on store history</p>
        </div>

        <button
          onClick={onViewAll}
          className="rounded-full bg-blue-50/80 border border-blue-100/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition shadow-2xs"
        >
          View All
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 stylish-scrollbar">
        {recommended.map((product) => {
          const key = `${product.product_id ?? product.id}-${product.distributor_id}`;
          return (
            <div key={key} className="min-w-[280px]">
              <ProductCard
                product={product}
                onView={onView}
                onCart={onCart}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecommendedProducts;
