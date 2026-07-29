import { PackageCheck, AlertCircle } from "lucide-react";

export default function InventoryTable({ items = [], onSelectProduct, selectedProductId }) {

  const getStatus = (qty) => {
    if (qty <= 0)  return "Out of Stock";
    if (qty <= 20) return "Low";
    return "Good";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Good":         return "bg-emerald-50 text-emerald-700 border border-emerald-200/60";
      case "Low":          return "bg-amber-50 text-amber-700 border border-amber-200/60";
      case "Out of Stock": return "bg-rose-50 text-rose-700 border border-rose-200/60";
      default:             return "bg-slate-100 text-slate-600 border border-slate-200";
    }
  };

  const hasSoonExpiry = (batches = []) =>
    batches.some((b) => {
      if (!b.expiry_date || b.status !== "Active") return false;
      const days = (new Date(b.expiry_date) - new Date()) / (1000 * 60 * 60 * 24);
      return days >= 0 && days <= 30;
    });

  const nearestExpiry = (batches = []) => {
    const active = batches
      .filter((b) => b.expiry_date && b.status === "Active")
      .sort((a, b) => new Date(a.expiry_date) - new Date(b.expiry_date));
    if (!active.length) return "—";
    return new Date(active[0].expiry_date.replace(/-/g, "/")).toLocaleDateString(undefined, {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  const activeBatchCount = (batches = []) =>
    batches.filter((b) => b.status === "Active" && Number(b.quantity) > 0).length;

  return (
    <div className="overflow-hidden bg-white border border-slate-100 rounded-[32px] shadow-xs">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Product ID</th>
              <th className="px-6 py-4">Active Batches</th>
              <th className="px-6 py-4">Total Stock</th>
              <th className="px-6 py-4">Nearest Expiry</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-16 text-center text-slate-400">
                  <p className="text-4xl mb-2">📦</p>
                  <p className="font-bold text-slate-800 text-sm">No inventory items found</p>
                  <p className="text-xs text-slate-400">There are no products matching your selected category or filters.</p>
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const totalQty = Number(item.stock ?? item.quantity ?? 0);
                const status   = getStatus(totalQty);
                const code     = `PRD-${String(item.product_id).padStart(3, "0")}`;
                const isSelected = selectedProductId === item.product_id;
                const soonExpiry = hasSoonExpiry(item.batches);

                return (
                  <tr
                    key={item.product_id}
                    onClick={() => onSelectProduct && onSelectProduct(item)}
                    className={`hover:bg-slate-50/60 transition duration-150 cursor-pointer ${
                      isSelected ? "bg-blue-50/40 hover:bg-blue-50/60" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{item.product_name}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">{item.category_name}</div>
                    </td>

                    <td className="px-6 py-4 font-bold text-blue-600">{code}</td>

                    <td className="px-6 py-4 text-slate-700 font-bold">
                      {activeBatchCount(item.batches)}
                      <span className="ml-1 text-[10px] font-normal text-slate-400">batches</span>
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                      {totalQty.toLocaleString()}{" "}
                      <span className="text-[10px] font-medium text-slate-400">{item.unit || "units"}</span>
                    </td>

                    <td className="px-6 py-4">
                      <span className={soonExpiry ? "text-amber-600 font-bold" : "text-slate-600 font-medium"}>
                        {nearestExpiry(item.batches)}
                      </span>
                      {soonExpiry && (
                        <span className="ml-1.5 text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <AlertCircle size={10} /> Expiring Soon
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </td>

                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => onSelectProduct && onSelectProduct(item)}
                          className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition whitespace-nowrap cursor-pointer shadow-2xs flex items-center gap-1.5"
                        >
                          <PackageCheck size={13} />
                          View Batches
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