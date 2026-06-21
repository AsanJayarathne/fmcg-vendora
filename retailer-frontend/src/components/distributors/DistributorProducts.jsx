import ProductCard from "../products/ProductCard";

function DistributorProducts({
  products,
  onView,
  onCart,
}) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">
        All Products
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onView={onView}
            onCart={onCart}
          />
        ))}
      </div>
    </div>
  );
}

export default DistributorProducts;
