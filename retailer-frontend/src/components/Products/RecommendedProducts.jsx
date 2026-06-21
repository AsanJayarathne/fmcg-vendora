import ProductCard from "./ProductCard";

function RecommendedProducts({
  products,
  onView,
  onCart,
}) {
  const recommendedProducts = products.slice(0, 3);

  return (
    <div className="mb-10">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">
          Recommended For You
        </h2>

        <button className="text-blue-600">
          View All
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {recommendedProducts.map((product) => (
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

export default RecommendedProducts;
