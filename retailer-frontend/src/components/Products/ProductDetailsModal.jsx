import { useEffect } from "react";
import { FiTag, FiTruck, FiBox, FiX, FiShoppingBag } from "react-icons/fi";

const CATEGORY_GRADIENTS = {
  Dairy:      { from: "#fef3c7", to: "#fcd34d", icon: "🥛" },
  Beverages:  { from: "#dbeafe", to: "#93c5fd", icon: "🧃" },
  Snacks:     { from: "#fee2e2", to: "#fca5a5", icon: "🍿" },
  Soap:       { from: "#f3e8ff", to: "#d8b4fe", icon: "🧼" },
  Household:  { from: "#d1fae5", to: "#6ee7b7", icon: "🏠" },
  Default:    { from: "#f1f5f9", to: "#cbd5e1", icon: "📦" },
};

function ProductDetailsModal({ product, onClose, onAddToCart }) {
  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [product]);

  if (!product) return null;

  // Map real API field names
  const name        = product.product_name   ?? product.name;
  const category    = product.category_name  ?? product.category ?? "Default";
  const price       = product.unit_price     ?? product.base_price ?? product.price;
  const stockQty    = product.available_qty  ?? product.stock_qty  ?? product.stock ?? 0;
  const unit        = product.unit           ?? "";
  const description = product.description    ?? "High quality product selected from our verified FMCG distributors.";

  const UPLOADS_BASE   = "http://localhost/fmcg-vendora/backend/uploads/products/";
  const gradient       = CATEGORY_GRADIENTS[category] ?? CATEGORY_GRADIENTS.Default;
  const imageUrl       = product.image_url ? `${UPLOADS_BASE}${product.image_url}` : (product.image ?? null);
  const usePlaceholder = !imageUrl || imageUrl.includes("placeholder");
  
  const isOutOfStock   = stockQty < 8;
  const isLowStock     = stockQty >= 8 && stockQty < 48;

  const fmt = (val) => 
    Number(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center z-50 p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-100 p-5 sm:p-7 rounded-3xl sm:rounded-[32px] w-full max-w-lg max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl relative flex flex-col justify-between animate-fadeIn">
        
        {/* Close icon in top right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 text-slate-400 hover:text-slate-700 transition cursor-pointer p-1.5 rounded-full hover:bg-slate-100 z-10"
          aria-label="Close modal"
        >
          <FiX size={18} />
        </button>

        {/* Content Body */}
        <div className="space-y-4 sm:space-y-5">
          {/* Image / gradient */}
          {usePlaceholder ? (
            <div
              style={{
                height: "160px",
                background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "56px",
              }}
            >
              <span role="img" aria-label={category}>{gradient.icon}</span>
            </div>
          ) : (
            <div className="h-40 sm:h-48 flex items-center justify-center p-3 bg-slate-50 rounded-2xl sm:rounded-[24px] border border-slate-100 overflow-hidden">
              <img
                src={imageUrl}
                alt={name}
                className="h-full max-w-full object-contain mix-blend-multiply"
              />
            </div>
          )}

          {/* Heading */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={`inline-flex px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full border ${
                isOutOfStock 
                  ? "text-red-600 bg-red-50 border-red-200" 
                  : isLowStock 
                    ? "text-amber-600 bg-amber-50 border-amber-200" 
                    : "text-green-600 bg-green-50 border-green-200"
              }`}>
                {isOutOfStock ? "Out of Stock (Min 8)" : `In Stock (${stockQty} units)`}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-slate-800 leading-tight">
              {name}
            </h2>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
              <div className="flex items-center gap-1.5 text-blue-600 mb-1">
                <FiTag size={12} />
                <span className="text-[10px] font-black uppercase tracking-wider">Unit Price</span>
              </div>
              <p className="text-base sm:text-lg font-black text-slate-900">
                Rs. {fmt(price)}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3">
              <div className="flex items-center gap-1.5 text-blue-600 mb-1">
                <FiTruck size={12} />
                <span className="text-[10px] font-black uppercase tracking-wider">Distributor</span>
              </div>
              <p className="font-bold text-xs sm:text-sm text-slate-800 truncate">
                {product.distributor_name ?? "—"}
              </p>
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-1.5">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Description</h3>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 border border-slate-100 rounded-2xl p-3.5">
              {description}
            </p>
          </div>

          {/* Bulk Promotions */}
          <div className="bg-blue-50/40 border border-blue-100/60 rounded-2xl p-3.5 space-y-2">
            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
              <FiBox size={12} /> Eligible Bulk Promotions
            </h4>
            <div className="text-xs font-semibold text-slate-600 space-y-1.5">
              <div className="flex justify-between items-center">
                <span>8 – 24 units</span>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[11px]">5% Discount</span>
              </div>
              <div className="flex justify-between items-center">
                <span>32 – 48 units</span>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[11px]">10% Discount</span>
              </div>
              <div className="flex justify-between items-center">
                <span>56+ units</span>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[11px]">15% Discount</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex gap-2.5 sm:gap-3 mt-6 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl cursor-pointer transition"
          >
            Close
          </button>
          
          {onAddToCart && (
            <button
              onClick={() => {
                onClose();
                onAddToCart(product);
              }}
              disabled={isOutOfStock}
              className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs rounded-2xl cursor-pointer transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5"
            >
              <FiShoppingBag size={14} />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsModal;
