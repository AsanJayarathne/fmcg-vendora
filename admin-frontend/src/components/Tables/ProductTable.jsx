import React from "react";
import { Edit2 } from "lucide-react";

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

const ProductThumb = ({ imageUrl, name }) => {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (imageUrl) {
    return (
      <img
        src={`${UPLOADS_BASE}${imageUrl}`}
        alt={name}
        className="w-11 h-11 rounded-2xl object-cover border border-slate-100 shrink-0 shadow-2xs"
        onError={(e) => {
          e.target.style.display = "none";
          if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
        }}
      />
    );
  }
  return (
    <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs">
      {initials}
    </div>
  );
};

export default function ProductTable({ products = [], loading = false, error = "", onEditProduct }) {
  const formatPrice = (val) =>
    val != null
      ? `LKR ${Number(val).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : "—";

  return (
    <div className="overflow-hidden bg-white border border-slate-100 rounded-[32px] shadow-xs">
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200 text-red-700 text-xs font-semibold">
          ⚠️ {error}
        </div>
      )}

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Image</th>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Unit</th>
              <th className="px-6 py-4 text-right">Base Price</th>
              <th className="px-6 py-4 text-right">MRP Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan="8" className="px-6 py-4">
                    <div className="h-6 bg-slate-100 rounded-full w-full" />
                  </td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-16 text-center text-slate-400">
                  <p className="text-4xl mb-2">📦</p>
                  <p className="font-bold text-slate-800 text-sm">No products found</p>
                  <p className="text-xs text-slate-400">Try adjusting your filters or search criteria.</p>
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const code = `PRD-${String(p.product_id).padStart(3, "0")}`;
                return (
                  <tr key={p.product_id} className="hover:bg-slate-50/60 transition duration-150">
                    <td className="px-6 py-4">
                      <ProductThumb imageUrl={p.image_url} name={p.product_name} />
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 text-sm leading-tight">{p.product_name}</p>
                      <p className="text-[11px] font-bold text-blue-600 mt-0.5">{code}</p>
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-600 text-xs">
                      {p.category_name}
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-500 text-xs">
                      {p.unit || "—"}
                    </td>

                    <td className="px-6 py-4 text-right font-bold text-slate-900 text-sm">
                      {formatPrice(p.base_price)}
                    </td>

                    <td className="px-6 py-4 text-right font-semibold text-slate-500 text-xs">
                      {formatPrice(p.mrp_max_retail_price)}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={p.status} />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => onEditProduct?.(p)}
                          className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition whitespace-nowrap cursor-pointer shadow-2xs flex items-center gap-1.5"
                        >
                          <Edit2 size={13} />
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
