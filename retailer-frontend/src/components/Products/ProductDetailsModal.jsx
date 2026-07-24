import { useEffect } from "react";
import { FiTag, FiTruck, FiBox, FiX } from "react-icons/fi";

const CATEGORY_GRADIENTS = {
  Dairy:      { from: "#fef3c7", to: "#fcd34d", icon: "🥛" },
  Beverages:  { from: "#dbeafe", to: "#93c5fd", icon: "🧃" },
  Snacks:     { from: "#fee2e2", to: "#fca5a5", icon: "🍿" },
  Soap:       { from: "#f3e8ff", to: "#d8b4fe", icon: "🧼" },
  Household:  { from: "#d1fae5", to: "#6ee7b7", icon: "🏠" },
  Default:    { from: "#f1f5f9", to: "#cbd5e1", icon: "📦" },
};

function ProductDetailsModal({ product, onClose }) {
  useEffect(() => {
    // Lock body scrolling when details modal is open
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
  const description = product.description    ?? "No additional description provided for this product line.";

  const UPLOADS_BASE   = "http://localhost/fmcg-vendora/backend/uploads/products/";
  const gradient       = CATEGORY_GRADIENTS[category] ?? CATEGORY_GRADIENTS.Default;
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center z-50 p-4">
      <div className="bg-white border border-slate-100 p-7 rounded-[32px] w-[500px] max-w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col justify-between animate-fadeIn">
        
        {/* Close icon in top right */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition cursor-pointer p-1 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-100"
        >
          <FiX size={18} />
        </button>

        {/* Content Body */}
        <div className="space-y-5">
          {/* Image / gradient */}
          {usePlaceholder ? (
            <div
              style={{
                height: "180px",
                background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                borderRadius: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "64px",
              }}
            >
              <span role="img" aria-label={category}>{gradient.icon}</span>
            </div>
          ) : (
            <div className="h-[180px] flex items-center justify-center p-3 bg-slate-50/50 rounded-[24px] border border-slate-100 overflow-hidden">
              <img
                src={imageUrl}
                alt={name}
                className="h-full max-w-full object-contain rounded-lg"
              />
            </div>
          )}

          {/* Heading */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`inline-flex px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full border ${
                isOutOfStock 
                  ? "text-red-655 bg-red-50 border-red-200/40" 
                  : isLowStock 
                    ? "text-amber-600 bg-amber-50 border-amber-200/40" 
                    : "text-green-600 bg-green-50 border-green-200/40"
              }`}>
                {isOutOfStock ? "Out of Stock" : `In Stock (${stockQty} units)`}
              </span>
            </div>

            <h2 className="text-xl font-black text-slate-800 leading-tight">
              {name}
            </h2>
            
            {unit && (
              <p className="text-[10px] font-black text-slate-450 uppercase tracking-wider mt-1">
                {unit}
              </p>
            )}
          </div>

          <div className="text-base font-black text-slate-900 border-y border-slate-100 py-3 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400">Unit Price</span>
            <span className="text-blue-650">Rs. {fmt(price)}</span>
          </div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-blue-50/20 border border-blue-100/30 rounded-2xl p-3.5">
              <div className="flex items-center gap-1.5 text-blue-405 font-bold mb-1">
                <FiTag size={12} />
                <span className="text-[10px] font-black uppercase tracking-wider">Category</span>
              </div>
              <p className="font-extrabold text-blue-700">{category}</p>
            </div>

            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-3.5">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold mb-1">
                <FiTruck size={12} />
                <span className="text-[10px] font-black uppercase tracking-wider">Distributor</span>
              </div>
              <p className="font-extrabold text-slate-700 truncate">
                {product.distributor_name ?? "—"}
              </p>
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Product Description</h3>
            <p className="text-xs font-bold text-slate-500 leading-relaxed bg-slate-50/30 border border-slate-100 rounded-2xl p-4">
              {description}
            </p>
          </div>

          {/* Wholesale Discount Promo Tiers */}
          <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4.5">
            <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <FiBox size={12} /> Eligible Bulk Promotions
            </h4>
            <ul className="text-xs font-bold text-slate-500 space-y-2">
              <li className="flex justify-between items-center">
                <span>Orders between 8 – 24 units</span>
                <span className="text-green-600 bg-green-50 px-2 py-0.5 border border-green-150/30 rounded-md font-black text-[10px]">5% Discount</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Orders between 32 – 48 units</span>
                <span className="text-green-600 bg-green-50 px-2 py-0.5 border border-green-150/30 rounded-md font-black text-[10px]">10% Discount</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Orders of 56 or more units</span>
                <span className="text-green-600 bg-green-50 px-2 py-0.5 border border-green-150/30 rounded-md font-black text-[10px]">15% Discount</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Close CTA */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-full cursor-pointer transition shadow-xs"
        >
          Return to Catalog
        </button>
      </div>
    </div>
  );
}

export default ProductDetailsModal;
