import { Edit2, Eye } from "lucide-react";

const CATEGORY_GRADIENTS = {
  Dairy:      { from: "#fef3c7", to: "#fcd34d", icon: "🥛" },
  Beverages:  { from: "#dbeafe", to: "#93c5fd", icon: "🧃" },
  Snacks:     { from: "#fee2e2", to: "#fca5a5", icon: "🍿" },
  Soap:       { from: "#f3e8ff", to: "#d8b4fe", icon: "🧼" },
  Household:  { from: "#d1fae5", to: "#6ee7b7", icon: "🏠" },
  Default:    { from: "#f1f5f9", to: "#cbd5e1", icon: "📦" },
};

export default function ProductCard({ product, onView }) {
  const pId          = product.product_id ?? product.id;
  const code         = `PRD-${pId}`;
  const name         = product.product_name ?? product.name ?? "Unnamed Product";
  const category     = product.category_name ?? product.category ?? "Default";
  const sellingPrice = Number(product.selling_price ?? product.selling ?? 0);
  const basePrice    = Number(product.base_price ?? product.base ?? 0);
  const mrp          = Number(product.mrp ?? 0);
  const stockQty     = Number(product.stock ?? 0);
  const unit         = product.unit ?? "";

  const gradient       = CATEGORY_GRADIENTS[category] ?? CATEGORY_GRADIENTS.Default;
  const UPLOADS_BASE   = "http://localhost/fmcg-vendora/backend/uploads/products/";
  const imageUrl       = product.image_url ? `${UPLOADS_BASE}${product.image_url}` : null;
  const usePlaceholder = !imageUrl || imageUrl.includes("placeholder");

  const isOutOfStock = stockQty <= 0;
  const isLowStock   = stockQty > 0 && stockQty <= 50;

  const fmt = (val) =>
    Number(val).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const handleAction = () => {
    if (onView) {
      onView({
        product_id: pId,
        id: code,
        name: name,
        category: category,
        base: basePrice,
        mrp: mrp,
        selling: sellingPrice,
        stock: stockQty,
        status: isOutOfStock ? "Out Of Stock" : isLowStock ? "Low Stock" : "In Stock",
        description: product.description,
        unit: unit,
        image_url: product.image_url,
      });
    }
  };

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

        {/* Title and Product Code */}
        <div className="flex items-start justify-between gap-2 mt-3.5">
          <h3 className="font-bold text-slate-800 text-sm line-clamp-2 leading-tight flex-1">
            {name}
          </h3>
          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
            {code}
          </span>
        </div>

        {unit && (
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-1">{unit}</p>
        )}

        {/* Stock Status Pill Badge */}
        <div className="mt-2.5 flex items-center justify-between">
          <span className={`inline-flex px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full border ${
            isOutOfStock 
              ? "text-red-600 bg-red-50 border-red-200/40" 
              : isLowStock 
                ? "text-amber-600 bg-amber-50 border-amber-200/40" 
                : "text-green-600 bg-green-50 border-green-200/40"
          }`}>
            {isOutOfStock
              ? "Out of Stock"
              : isLowStock
                ? `Low Stock (${stockQty})`
                : `In Stock (${stockQty})`}
          </span>
          <span className="text-[10px] font-medium text-slate-400">
            Cat: {category}
          </span>
        </div>
      </div>

      {/* Pricing and CTAs */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Selling Price</span>
            <p className="font-bold text-slate-900 text-base">
              LKR {fmt(sellingPrice)}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-medium text-slate-400 block">MRP: LKR {fmt(mrp)}</span>
            <span className="text-[10px] font-medium text-slate-400 block">Base: LKR {fmt(basePrice)}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleAction}
            className="flex-1 border border-blue-200 hover:border-blue-600 hover:bg-blue-50/40 text-blue-600 font-bold text-xs py-2 rounded-full cursor-pointer transition flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Eye size={13} />
            Details
          </button>

          <button
            onClick={handleAction}
            className="flex-[1.5] bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-full cursor-pointer transition flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <Edit2 size={13} />
            Edit Price
          </button>
        </div>
      </div>
    </div>
  );
}
