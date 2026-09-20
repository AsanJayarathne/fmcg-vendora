import { useLanguage } from "../../context/LanguageContext";

const CATEGORY_GRADIENTS = {
  Dairy:      { from: "#fef3c7", to: "#fcd34d", icon: "🥛" },
  Beverages:  { from: "#dbeafe", to: "#93c5fd", icon: "🧃" },
  Snacks:     { from: "#fee2e2", to: "#fca5a5", icon: "🍿" },
  Soap:       { from: "#f3e8ff", to: "#d8b4fe", icon: "🧼" },
  Household:  { from: "#d1fae5", to: "#6ee7b7", icon: "🏠" },
  Default:    { from: "#f1f5f9", to: "#cbd5e1", icon: "📦" },
};

function ProductCard({ product, onView, onCart }) {
  const { t } = useLanguage();

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
  
  // Since minimum bulk purchase quantity is 8, availability under 8 is effectively out of stock
  const isOutOfStock   = stockQty < 8;
  const isLowStock     = stockQty >= 8 && stockQty < 48;

  const fmt = (val) => 
    Number(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="bg-white border border-slate-100 shadow-xs rounded-2xl sm:rounded-[30px] p-4 sm:p-5 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      
      {/* Visual content block */}
      <div>
        {/* Gradient placeholder or product image */}
        {usePlaceholder ? (
          <div
            style={{
              height: "130px",
              background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "42px",
            }}
          >
            <span role="img" aria-label={category}>{gradient.icon}</span>
          </div>
        ) : (
          <div className="h-[130px] flex items-center justify-center p-2 bg-slate-50/50 rounded-[18px] border border-slate-100 overflow-hidden">
            <img
              src={imageUrl}
              alt={name}
              className="h-full max-w-full object-contain rounded-lg mix-blend-multiply"
            />
          </div>
        )}

        {/* Stock Status Pill Badge */}
        <div className="mt-3">
          <span className={`inline-flex px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md border ${
            isOutOfStock 
              ? "text-red-600 bg-red-50 border-red-200/50" 
              : isLowStock 
                ? "text-amber-600 bg-amber-50 border-amber-200/50" 
                : "text-green-600 bg-green-50 border-green-200/50"
          }`}>
            {isOutOfStock
              ? t("products.outOfStock", "Out of Stock")
              : isLowStock
                ? `${t("products.lowStock", "Low Stock")} (${stockQty})`
                : t("products.inStock", "In Stock")}
          </span>
        </div>

        {/* Title and Specs */}
        <h3 className="font-bold text-slate-800 mt-2 text-xs sm:text-sm line-clamp-2 leading-snug min-h-[2rem]">
          {name}
        </h3>

        {product.distributor_name && (
          <p className="text-[10px] font-medium text-slate-400 mt-1 truncate">
            {product.distributor_name}
          </p>
        )}
      </div>

      {/* Pricing and CTAs */}
      <div className="mt-3 pt-2 border-t border-slate-50">
        <p className="font-black text-slate-900 text-sm sm:text-base">
          Rs. {fmt(price)}
          {unit && <span className="text-[10px] text-slate-400 font-normal ml-1">/{unit}</span>}
        </p>

        <div className="flex gap-2 mt-3">
          <button
            id={`product-view-${id}`}
            type="button"
            onClick={() => onView(product)}
            className="flex-1 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 text-slate-700 hover:text-blue-600 font-bold text-[11px] sm:text-xs py-2 rounded-xl cursor-pointer transition flex items-center justify-center shadow-2xs"
          >
            {t("products.productDetails", "Details")}
          </button>

          <button
            id={`product-addcart-${id}`}
            type="button"
            onClick={() => !isOutOfStock && onCart(product)}
            disabled={isOutOfStock}
            className={`flex-[1.5] text-center font-bold text-[11px] sm:text-xs py-2 rounded-xl cursor-pointer transition shadow-2xs ${
              isOutOfStock
                ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10"
            }`}
          >
            {t("products.addToCart", "Add To Cart")}
          </button>
        </div>
      </div>

    </div>
  );
}

export default ProductCard;
