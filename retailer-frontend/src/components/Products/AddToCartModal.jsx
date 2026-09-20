import { useState, useEffect } from "react";
import { FiX, FiPlus, FiMinus, FiShoppingBag, FiCheck } from "react-icons/fi";
import { useLanguage } from "../../context/LanguageContext";

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
  const { t } = useLanguage();

  if (!product) return null;

  // Support real API field names first, then fallback
  const name        = product.product_name ?? product.name;
  const price       = product.unit_price   ?? product.base_price ?? product.price;
  const stockQty    = product.available_qty ?? product.stock_qty ?? product.stock ?? 0;
  const category    = product.category_name ?? product.category ?? "Default";
  const unit        = product.unit          ?? "";
  const description = product.description ?? t("products.defaultDescription", "High quality product selected from our top distributors.");

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

  // Bulk discount tiers:
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

  const handleAddToCart = () => {
    if (quantity > 0) {
      onConfirm(product, quantity);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center z-50 p-3 sm:p-4 overflow-y-auto">
      {/* Modal Card */}
      <div className="bg-white rounded-3xl sm:rounded-[32px] shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto no-scrollbar p-5 sm:p-8 flex flex-col gap-5 sm:gap-6 relative animate-fadeIn border border-slate-100">
        
        {/* Top-Right Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 transition cursor-pointer z-10"
          aria-label="Close modal"
        >
          <FiX size={18} />
        </button>

        {/* Main Content: 2-column on desktop, 1-column on mobile */}
        <div className="flex flex-col md:flex-row gap-5 sm:gap-6">
          
          {/* Left Column: Product Image & Bulk Tier Perks */}
          <div className="flex flex-col gap-4 w-full md:w-[220px] shrink-0">
            {/* Image Box */}
            <div className="w-full h-44 sm:h-52 rounded-2xl sm:rounded-3xl bg-slate-50 flex items-center justify-center p-3 border border-slate-100 overflow-hidden relative">
              {usePlaceholder ? (
                <div className="flex flex-col items-center justify-center gap-2">
                  <span className="text-5xl" role="img" aria-label={category}>
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

            {/* Bulk Discounts Pill Strip */}
            <div className="bg-blue-50/40 border border-blue-100/60 rounded-2xl p-3.5 space-y-1.5">
              <h3 className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                {t("products.bulkTiers", "Bulk Tier Discounts")}
              </h3>
              <div className="text-xs font-semibold text-slate-600 space-y-1">
                <div className="flex justify-between items-center">
                  <span>8–24 {t("common.units", "units")}</span>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">5% OFF</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>32–48 {t("common.units", "units")}</span>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">10% OFF</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>56+ {t("common.units", "units")}</span>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[11px]">15% OFF</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Quantity Selector */}
          <div className="flex-1 flex flex-col justify-between gap-5">
            <div className="space-y-3.5 pr-6 sm:pr-0">
              {/* Category & Unit Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="border border-slate-200 text-slate-600 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-50">
                  {category}
                </span>
                {unit && (
                  <span className="border border-slate-200 text-slate-600 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-50">
                    {unit}
                  </span>
                )}
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                  hasInsufficientStock 
                    ? "bg-red-50 text-red-600 border-red-200" 
                    : "bg-green-50 text-green-600 border-green-200"
                }`}>
                  {hasInsufficientStock ? `${t("products.outOfStock", "Out of stock")} (Min 8)` : `${stockQty} ${t("products.available", "available")}`}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-black text-slate-800 leading-snug">
                {name}
              </h2>

              {/* Description */}
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                {description}
              </p>

              {/* Unit Price */}
              <div className="pt-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {t("products.wholesalePrice", "Wholesale Unit Price")}
                </p>
                <p className="text-lg sm:text-xl font-black text-slate-900">
                  Rs. {Number(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Quantity Selector & Billing Footer */}
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                {/* Quantity Adjuster: [-] [qty] [+] */}
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {t("products.quantity", "Quantity (Units)")}
                  </span>
                  <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-2xl border border-slate-200/80">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      disabled={hasInsufficientStock || quantity <= 8}
                      className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-black text-sm cursor-pointer shadow-2xs transition"
                      aria-label="Decrease quantity"
                    >
                      <FiMinus size={13} />
                    </button>
                    <span className="text-sm sm:text-base font-black w-9 text-center text-slate-800">
                      {quantity.toString().padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncrement}
                      disabled={hasInsufficientStock || quantity + 8 > stockQty}
                      className="w-8 h-8 rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-black text-sm cursor-pointer shadow-2xs transition"
                      aria-label="Increase quantity"
                    >
                      <FiPlus size={13} />
                    </button>
                  </div>
                </div>

                {/* Total Billing */}
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {t("cart.totalAmount", "Order Total")}
                  </span>
                  {discountRate > 0 && (
                    <span className="text-xs font-bold text-slate-400 line-through">
                      Rs. {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  )}
                  <span className="text-xl sm:text-2xl font-black text-blue-600">
                    Rs. {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 sm:gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition cursor-pointer"
                >
                  {t("common.cancel", "Cancel")}
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={hasInsufficientStock || quantity <= 0}
                  className="flex-[2] py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <FiShoppingBag size={14} />
                  <span>{t("products.addToCart", "Add To Cart")}</span>
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
