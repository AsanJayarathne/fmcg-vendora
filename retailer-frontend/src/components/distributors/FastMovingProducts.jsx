import ProductCard from "../products/ProductCard";

function FastMovingProducts({
  products,
  onView,
  onCart,
}) {
  const fastMovingProducts =
    products.filter(
      (product) => product.fastMoving
    );

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4">
        Fast Moving Products
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {fastMovingProducts.map((product) => (
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

export default FastMovingProducts;
