function ProductCard({ product, onView, onCart }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <img
        src={product.image}
        alt={product.name}
        className="h-40 w-full object-contain"
      />

      <h3 className="font-semibold mt-3">
        {product.name}
      </h3>

      <p className="text-sm text-gray-600">
        Rating: {product.rating}
      </p>

      <p className="font-bold text-blue-600">
        Rs. {product.price}
      </p>

      <p className="text-sm text-gray-600">
        Distributor: {product.distributor}
      </p>

      <p className="text-sm text-gray-600">
        {product.distance} km away
      </p>

      <p className="text-green-600">
        In Stock
      </p>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onView(product)}
          className="border px-3 py-2 rounded-lg"
        >
          View
        </button>

        <button
          onClick={() => onCart(product)}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg"
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
