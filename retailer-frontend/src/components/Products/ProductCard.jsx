const CATEGORY_GRADIENTS = {
  Dairy:      { from: "#fef3c7", to: "#fcd34d", icon: "🥛" },
  Beverages:  { from: "#dbeafe", to: "#93c5fd", icon: "🧃" },
  Snacks:     { from: "#fee2e2", to: "#fca5a5", icon: "🍿" },
  Soap:       { from: "#f3e8ff", to: "#d8b4fe", icon: "🧼" },
  Household:  { from: "#d1fae5", to: "#6ee7b7", icon: "🏠" },
  Default:    { from: "#f1f5f9", to: "#cbd5e1", icon: "📦" },
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
  
  // Since minimum bulk purchase quantity is 8, availability under 8 is effectively out of stock
  const isOutOfStock   = stockQty < 8;
  const isLowStock     = stockQty >= 8 && stockQty < 48;

  const fmt = (val) => 
    Number(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="bg-white border border-slate-100 shadow-xs rounded-[32px] p-5 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      
      {/* Visual content block */}
      <div>
        {/* Gradient placeholder or product image */}
        {usePlaceholder ? (
          <div
            style={{
              height: "140px",
              background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
            }}
          >
            <span role="img" aria-label={category}>{gradient.icon}</span>
          </div>
        ) : (
          <div className="h-[140px] flex items-center justify-center p-2 bg-slate-50/50 rounded-[20px] border border-slate-100 overflow-hidden">
            <img
              src={imageUrl}
              alt={name}
              className="h-full max-w-full object-contain rounded-lg"
            />
          </div>
        )}

        {/* Title and Specs */}
        <h3 className="font-extrabold text-slate-800 mt-3.5 text-sm line-clamp-2 leading-tight">
          {name}
        </h3>

        {unit && (
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1">{unit}</p>
        )}

        {product.distributor_name && (
          <p className="text-[11px] font-bold text-slate-450 mt-2">
            By {product.distributor_name}
          </p>
        )}

        {/* Stock Status Pill Badge */}
        <div className="mt-2.5">
          <span className={`inline-flex px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full border ${
            isOutOfStock 
              ? "text-red-655 bg-red-50 border-red-200/40" 
              : isLowStock 
                ? "text-amber-600 bg-amber-50 border-amber-200/40" 
                : "text-green-600 bg-green-50 border-green-200/40"
          }`}>
            {isOutOfStock
              ? "Out of Stock"
              : isLowStock
                ? `Low Stock (${stockQty})`
                : "In Stock"}
          </span>
        </div>
      </div>

      {/* Pricing and CTAs */}
      <div className="mt-4">
        <p className="font-black text-slate-900 text-base">
          Rs. {fmt(price)}
        </p>

        <div className="flex gap-2 mt-4.5">
          <button
            id={`product-view-${id}`}
            onClick={() => onView(product)}
            className="flex-1 border border-slate-200 hover:border-slate-850 hover:bg-slate-50 text-slate-600 hover:text-slate-850 font-bold text-xs py-2 rounded-full cursor-pointer transition flex items-center justify-center shadow-2xs"
          >
            Details
          </button>

          <button
            id={`product-addcart-${id}`}
            onClick={() => !isOutOfStock && onCart(product)}
            disabled={isOutOfStock}
            className={`flex-[2] text-center font-bold text-xs py-2 rounded-full cursor-pointer transition shadow-2xs ${
              isOutOfStock
                ? "bg-slate-50 text-slate-400 border border-slate-100 cursor-not-allowed"
                : "bg-slate-900 hover:bg-slate-800 text-white"
            }`}
          >
            Add To Cart
          </button>
        </div>
      </div>

    </div>
  );
}

export default ProductCard;
