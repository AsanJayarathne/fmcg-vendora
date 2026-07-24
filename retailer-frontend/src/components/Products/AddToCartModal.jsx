import { useState, useEffect } from "react";

const CATEGORY_GRADIENTS = {
  Dairy:      { from: "#fde68a", to: "#f59e0b", icon: "🥛" },
  Beverages:  { from: "#bfdbfe", to: "#3b82f6", icon: "🧃" },
  Snacks:     { from: "#fca5a5", to: "#ef4444", icon: "🍿" },
  Soap:       { from: "#c4b5fd", to: "#8b5cf6", icon: "🧼" },
  Household:  { from: "#6ee7b7", to: "#10b981", icon: "🏠" },
  Default:    { from: "#cbd5e1", to: "#64748b", icon: "📦" },
};

function AddToCartModal({
  product,
  onClose,
  onConfirm,
}) {
  if (!product) return null;

  // Support real API field names first, then old mock shape
  const name     = product.product_name ?? product.name;
  const price    = product.unit_price   ?? product.base_price ?? product.price;
  const stockQty = product.available_qty ?? product.stock_qty ?? product.stock ?? 0;
  const category = product.category_name ?? product.category ?? "Default";
  const unit     = product.unit          ?? "";
  const description = product.description ?? "High quality product selected from our top distributors.";

  const hasInsufficientStock = stockQty < 8;
  const [quantity, setQuantity] = useState(hasInsufficientStock ? 0 : 8);

  useEffect(() => {
    setQuantity(hasInsufficientStock ? 0 : 8);
  }, [product, hasInsufficientStock]);

  const UPLOADS_BASE   = "http://localhost/fmcg-vendora/backend/uploads/products/";
  const gradient       = CATEGORY_GRADIENTS[category] ?? CATEGORY_GRADIENTS.Default;
  const imageUrl       = product.image_url ? `${UPLOADS_BASE}${product.image_url}` : (product.image ?? null);
  const usePlaceholder = !imageUrl || imageUrl.includes("placeholder");

  const subtotal = quantity * Number(price);

  // New bulk discount tiers:
  // 08-24 units: 5% off
  // 32-48 units: 10% off
  // 56+ units: 15% off
  let discountRate = 0;
  if (quantity >= 56) {
    discountRate = 15;
  } else if (quantity >= 32) {
    discountRate = 10;
  } else if (quantity >= 8) {
    discountRate = 5;
  }

  const discount = (subtotal * discountRate) / 100;
  const total = subtotal - discount;

  const handleIncrement = () => {
    setQuantity((current) => {
      const next = current + 8;
      return next <= stockQty ? next : current;
    });
  };

  const handleDecrement = () => {
    setQuantity((current) => Math.max(8, current - 8));
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex justify-center items-center z-50 animate-fade-in p-4">
      <div className="bg-white rounded-[32px] shadow-2xl w-[700px] max-w-full p-8 flex flex-col gap-6 transform transition-all duration-300 scale-100 animate-slide-up">
        
        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Left Column: Image & Bulk Discounts */}
          <div className="flex flex-col gap-6 w-full md:w-[240px] shrink-0">
            {/* Product Image Card */}
            <div className="w-full h-[240px] rounded-3xl bg-slate-50 flex items-center justify-center p-4 border border-slate-100/80 overflow-hidden relative">
              {usePlaceholder ? (
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="text-6xl" role="img" aria-label={category}>
                    {gradient.icon}
                  </span>
                </div>
              ) : (
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              )}
            </div>

            {/* Bulk Discounts Display */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">
                Bulk Discounts
              </h3>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-700 flex justify-between">
                  <span>08–24 units:</span>
                  <span className="text-green-500 font-extrabold">5% off</span>
                </p>
                <p className="text-sm font-semibold text-slate-700 flex justify-between">
                  <span>32–48 units:</span>
                  <span className="text-green-500 font-extrabold">10% off</span>
                </p>
                <p className="text-sm font-semibold text-slate-700 flex justify-between">
                  <span>56+ units:</span>
                  <span className="text-green-500 font-extrabold">15% off</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Info & Action Panel */}
          <div className="flex-1 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              {/* Product Info */}
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-800 leading-tight">
                  {name}
                </h2>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="border border-slate-200 text-slate-600 px-3 py-1 rounded-xl text-xs font-bold bg-slate-50/50">
                  {category}
                </span>
                {unit && (
                  <span className="border border-slate-200 text-slate-600 px-3 py-1 rounded-xl text-xs font-bold bg-slate-50/50">
                    {unit}
                  </span>
                )}
              </div>

              {/* Stock Status Badge */}
              <div>
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold border ${
                  hasInsufficientStock 
                    ? "bg-red-50 text-red-600 border-red-200" 
                    : "bg-green-50 text-green-600 border-green-200"
                }`}>
                  {hasInsufficientStock ? "Insufficient Stock" : `${stockQty} In stock`}
                </span>
              </div>

              {/* Unit Price */}
              <div className="pt-2">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Unit Price
                </p>
                <p className="text-xl font-black text-slate-800">
                  Rs. {Number(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Calculations & Adjuster Panel */}
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                
                {/* Quantity Adjuster */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Quantity
                  </span>
                  <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                    <button
                      onClick={handleIncrement}
                      disabled={hasInsufficientStock}
                      className="w-7 h-7 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold cursor-pointer transition text-sm"
                    >
                      +
                    </button>
                    <span className="text-base font-black w-8 text-center text-slate-800">
                      {quantity.toString().padStart(2, "0")}
                    </span>
                    <button
                      onClick={handleDecrement}
                      disabled={hasInsufficientStock}
                      className="w-7 h-7 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold cursor-pointer transition text-sm"
                    >
                      -
                    </button>
                  </div>
                </div>

                {/* Total Billing */}
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Total
                  </span>
                  {discountRate > 0 && (
                    <span className="text-sm font-semibold text-slate-400 line-through">
                      Rs. {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  )}
                  <span className="text-2xl font-black text-blue-650">
                    Rs. {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50/40 active:scale-98 font-extrabold text-sm transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    if (quantity > 0) {
                      onConfirm(product, quantity);
                      onClose();
                    }
                  }}
                  disabled={hasInsufficientStock}
                  className="px-6 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed font-extrabold text-sm transition cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default AddToCartModal;
