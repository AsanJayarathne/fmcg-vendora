function ProductDetailsModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[700px] max-w-[calc(100vw-2rem)]">
        <h2 className="text-2xl font-bold">
          {product.name}
        </h2>

        <img
          src={product.image}
          alt={product.name}
          className="h-60 mx-auto"
        />

        <p className="mt-4">
          {product.description}
        </p>

        <div className="mt-5">
          <h3 className="font-bold">
            Promotions
          </h3>

          <ul>
            <li>10+ units: 5% Discount</li>
            <li>25+ units: 10% Discount</li>
            <li>50+ units: 15% Discount</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ProductDetailsModal;
