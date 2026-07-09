import ProductCard from "./ProductCard";

function TrendingProducts({ products, onView, onCart }) {
  // Real API: sort by stock, take top 6. Mock data: use fastMoving flag
  const hasMockData = products.some((p) => "fastMoving" in p);

  const trendingProducts = hasMockData
    ? products.filter((p) => p.fastMoving)
    : [...products]
        .sort((a, b) => (b.available_qty ?? 0) - (a.available_qty ?? 0))
        .slice(0, 6);

  if (trendingProducts.length === 0) return null;

  return (
    <div className="mb-10 min-w-0">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">
          Trending Products
        </h2>
        <button className="text-blue-600">View All</button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {trendingProducts.map((product) => {
          const key = product.product_id ?? product.id;
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

export default TrendingProducts;
