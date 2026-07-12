import ProductCard from "./ProductCard";

function RecommendedProducts({ products, onView, onCart }) {
  const recommended = products
    .filter((p) => (p.available_qty ?? p.stock ?? 0) > 0)
    .slice(0, 4);

  if (recommended.length === 0) return null;

  return (
    <div className="mb-10 min-w-0">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">
          Recommended For You
        </h2>
        <button className="text-blue-600">View All</button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
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
