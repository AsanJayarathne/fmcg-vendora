const CATEGORY_GRADIENTS = {
  Dairy:      { from: "#fde68a", to: "#f59e0b", icon: "🥛" },
  Beverages:  { from: "#bfdbfe", to: "#3b82f6", icon: "🧃" },
  Snacks:     { from: "#fca5a5", to: "#ef4444", icon: "🍿" },
  Soap:       { from: "#c4b5fd", to: "#8b5cf6", icon: "🧼" },
  Household:  { from: "#6ee7b7", to: "#10b981", icon: "🏠" },
  Default:    { from: "#cbd5e1", to: "#64748b", icon: "📦" },
};

function ProductCard({ product, onView, onCart }) {
  // Map real API field names → local variables
  const id       = product.product_id    ?? product.id;
  const name     = product.product_name  ?? product.name;
  const category = product.category_name ?? product.category ?? "Default";
  const price    = product.unit_price    ?? product.base_price ?? product.price;
  const stockQty = product.available_qty ?? product.stock_qty  ?? product.stock ?? 0;
  const unit     = product.unit          ?? "";

  const gradient       = CATEGORY_GRADIENTS[category] ?? CATEGORY_GRADIENTS.Default;
  const UPLOADS_BASE   = "http://localhost/fmcg-vendora/backend/uploads/products/";
  const imageUrl       = product.image_url ? `${UPLOADS_BASE}${product.image_url}` : (product.image ?? null);
  const usePlaceholder = !imageUrl || imageUrl.includes("placeholder");
  const isOutOfStock   = stockQty === 0;
  const isLowStock     = stockQty > 0 && stockQty < 50;

  return (
    <div className="bg-white rounded-xl shadow-md p-4">

      {/* Gradient placeholder — replaced by real img when image_url exists */}
      {usePlaceholder ? (
        <div
          style={{
            height: "160px",
            background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "64px",
          }}
        >
          <span role="img" aria-label={category}>{gradient.icon}</span>
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={name}
          className="h-40 w-full object-contain"
        />
      )}

      <h3 className="font-semibold mt-3">{name}</h3>

      {unit && (
        <p className="text-xs text-gray-400">{unit}</p>
      )}

      {product.distributor_name && (
        <p className="text-xs text-gray-500 mt-2 font-medium">
          Distributor: {product.distributor_name}
        </p>
      )}

      {/* Stock badge */}
      <p className={`text-sm font-medium mt-1 ${
        isOutOfStock ? "text-red-500" : isLowStock ? "text-yellow-500" : "text-green-600"
      }`}>
        {isOutOfStock
          ? "Out of Stock"
          : isLowStock
            ? `Low Stock (${stockQty} left)`
            : "In Stock"}
      </p>

      <p className="font-bold text-blue-600 mt-1">
        Rs. {Number(price).toLocaleString()}
      </p>

      <div className="flex gap-2 mt-4">
        <button
          id={`product-view-${id}`}
          onClick={() => onView(product)}
          className="border px-3 py-2 rounded-lg"
        >
          View
        </button>

        <button
          id={`product-addcart-${id}`}
          onClick={() => !isOutOfStock && onCart(product)}
          disabled={isOutOfStock}
          className={`px-3 py-2 rounded-lg ${
            isOutOfStock
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white"
          }`}
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
