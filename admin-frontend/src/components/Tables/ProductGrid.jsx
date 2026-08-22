import React from "react";
import { Edit2, Package } from "lucide-react";

const UPLOADS_BASE = "http://localhost/fmcg-vendora/backend/uploads/products/";

const StatusBadge = ({ status }) => {
  const isActive = status === "Active";
  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        isActive
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
          : "bg-rose-50 text-rose-700 border border-rose-200/50"
      }`}
    >
      {status}
    </span>
  );
};

export default function ProductGrid({ products = [], loading = false, error = "", onEditProduct }) {
  const formatPrice = (val) =>
    val != null
      ? `LKR ${Number(val).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : "—";

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[32px] p-5 h-64 animate-pulse">
            <div className="h-32 bg-slate-100 rounded-2xl mb-4" />
            <div className="h-4 bg-slate-100 rounded-full w-3/4 mb-2" />
            <div className="h-3 bg-slate-100 rounded-full w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-[32px] p-12 text-center text-slate-400">
        <p className="text-4xl mb-2">📦</p>
        <p className="font-bold text-slate-800 text-sm">No products found</p>
        <p className="text-xs text-slate-400">Try adjusting your filters or search criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((p) => {
          const code = `PRD-${String(p.product_id).padStart(3, "0")}`;
          const initials = p.product_name
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase();

          return (
            <div
              key={p.product_id}
              className="bg-white border border-slate-100 shadow-xs rounded-[32px] p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <div>
                {/* Product Image / Placeholder */}
                <div className="h-36 w-full rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-center p-3 overflow-hidden relative group">
                  {p.image_url ? (
                    <img
                      src={`${UPLOADS_BASE}${p.image_url}`}
                      alt={p.product_name}
                      className="h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = "none";
                        if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full flex flex-col items-center justify-center text-blue-600 bg-blue-50/50 rounded-xl ${
                      p.image_url ? "hidden" : "flex"
                    }`}
                  >
                    <Package size={32} className="mb-1 opacity-80" />
                    <span className="text-xs font-black">{initials}</span>
                  </div>
                </div>

                {/* Name & Code */}
                <div className="mt-4 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2">
                      {p.product_name}
                    </h3>
                    <p className="text-[11px] font-bold text-blue-600 mt-0.5">{code}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>

                {/* Details */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span className="bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full text-[11px]">
                    {p.category_name}
                  </span>
                  {p.unit && <span className="text-[11px] text-slate-400">{p.unit}</span>}
                </div>
              </div>

              {/* Pricing & Action */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Base Price</span>
                  <p className="font-bold text-slate-900 text-sm">
                    {formatPrice(p.base_price)}
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold">
                    MRP: {formatPrice(p.mrp_max_retail_price)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onEditProduct?.(p)}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition cursor-pointer shadow-2xs flex items-center gap-1.5"
                >
                  <Edit2 size={13} />
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
