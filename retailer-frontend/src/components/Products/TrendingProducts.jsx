import ProductCard from "./ProductCard";

function TrendingProducts({
  products,
  onView,
  onCart,
}) {
  const trendingProducts = products.filter(
    (product) => product.fastMoving
  );

  return (
    <div className="mb-10">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">
          Trending Products
        </h2>

        <button className="text-blue-600">
          View All
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {trendingProducts.map((product) => (
          <div
            key={product.id}
            className="min-w-[280px]"
          >
            <ProductCard
              product={product}
              onView={onView}
              onCart={onCart}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrendingProducts;
