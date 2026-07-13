import { useContext, useState, useEffect } from "react";
import { CartContext } from "../../context/CartContextObject";

const CATEGORY_GRADIENTS = {
  Dairy:      { from: "#fde68a", to: "#f59e0b", icon: "🥛" },
  Beverages:  { from: "#bfdbfe", to: "#3b82f6", icon: "🧃" },
  Snacks:     { from: "#fca5a5", to: "#ef4444", icon: "🍿" },
  Soap:       { from: "#c4b5fd", to: "#8b5cf6", icon: "🧼" },
  Household:  { from: "#6ee7b7", to: "#10b981", icon: "🏠" },
  Default:    { from: "#cbd5e1", to: "#64748b", icon: "📦" },
};

function ProductDetailsModal({ product, onClose }) {
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded]       = useState(false);

  useEffect(() => {
    if (product) { setQuantity(1); setAdded(false); }
  }, [product]);

  if (!product) return null;

  // Map real API field names
  const name     = product.product_name   ?? product.name;
  const category = product.category_name  ?? product.category ?? "Default";
  const price    = product.unit_price     ?? product.base_price ?? product.price;
  const stockQty = product.available_qty  ?? product.stock_qty  ?? product.stock ?? 0;
  const unit     = product.unit           ?? "";

  const UPLOADS_BASE   = "http://localhost/fmcg-vendora/backend/uploads/products/";
  const gradient       = CATEGORY_GRADIENTS[category] ?? CATEGORY_GRADIENTS.Default;
  const imageUrl       = product.image_url ? `${UPLOADS_BASE}${product.image_url}` : (product.image ?? null);
  const usePlaceholder = !imageUrl || imageUrl.includes("placeholder");
  const isOutOfStock   = stockQty === 0;

  // Bulk discount tiers (matches CartContext logic)
  function getDiscountRate(qty) {
    if (qty >= 50) return 15;
    if (qty >= 25) return 10;
    if (qty >= 10) return 5;
    return 0;
  }

  const subtotal     = Number(price) * quantity;
  const discountRate = getDiscountRate(quantity);
  const discount     = subtotal * discountRate / 100;
  const total        = subtotal - discount;

  function handleAddToCart() {
    addToCart(
      {
        id:          product.product_id ?? product.id,
        name,
        price:       Number(price),
        stock:       stockQty,
        unit,
        category,
        distributor: product.distributor_name ?? product.distributor ?? "",
        image_url:   product.image_url ?? null,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[700px] max-w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto">

        {/* Product image / gradient placeholder */}
        {usePlaceholder ? (
          <div
            style={{
              height: "200px",
              background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "80px",
              marginBottom: "16px",
            }}
          >
            <span role="img" aria-label={category}>{gradient.icon}</span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={name}
            className="h-60 mx-auto block"
          />
        )}

        <h2 className="text-2xl font-bold">{name}</h2>
        {unit && <p className="text-sm text-gray-400 mb-1">{unit}</p>}
        <p className="text-xl font-bold text-blue-600 mb-1">
          Rs. {Number(price).toLocaleString()}
        </p>
        <p className={`text-sm font-medium mb-4 ${isOutOfStock ? "text-red-500" : "text-green-600"}`}>
          {isOutOfStock ? "Out of Stock" : `In Stock (${stockQty} units)`}
        </p>

        {/* Promotions */}
        <div className="mt-3">
          <h3 className="font-bold mb-2">Bulk Discounts</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>10–24 units: <span className="font-semibold text-green-600">5% off</span></li>
            <li>25–49 units: <span className="font-semibold text-green-600">10% off</span></li>
            <li>50+ units:   <span className="font-semibold text-green-600">15% off</span></li>
          </ul>
        </div>

        {/* Quantity + Add to Cart */}
        {!isOutOfStock && (
          <div className="mt-5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="bg-gray-200 w-10 h-10 rounded text-lg font-bold"
              >
                −
              </button>
              <span className="text-xl w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(stockQty, q + 1))}
                className="bg-blue-600 text-white w-10 h-10 rounded text-lg font-bold"
              >
                +
              </button>
              {discountRate > 0 && (
                <span className="text-sm text-green-600 font-medium ml-2">
                  {discountRate}% bulk discount applied
                </span>
              )}
            </div>

            <div className="mt-3 text-sm text-gray-600 space-y-1">
              <p>Subtotal: Rs. {subtotal.toLocaleString()}</p>
              {discount > 0 && <p>Discount: − Rs. {discount.toLocaleString()}</p>}
              <p className="font-bold text-base">Total: Rs. {total.toLocaleString()}</p>
            </div>

            <button
              id="modal-add-to-cart"
              onClick={handleAddToCart}
              className={`mt-4 w-full py-2 rounded-lg font-semibold transition-colors ${
                added
                  ? "bg-green-500 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {added ? "✓ Added to Cart!" : `Add ${quantity} to Cart`}
            </button>
          </div>
        )}

        <button
          id="product-modal-close"
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
