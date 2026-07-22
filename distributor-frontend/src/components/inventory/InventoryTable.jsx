import { MoreVertical, PackageCheck } from "lucide-react";

export default function InventoryTable({ items = [], onSelectProduct, selectedProductId }) {
  /**
   * items: each item is a product-level summary aggregated from distributor_batch.
   * Fields expected: product_id, product_name, category_name, unit,
   *                  stock (total active qty), batches (array of batch rows).
   * The API should GROUP BY product_id and SUM(quantity) for the summary row.
   */

  const getStatus = (qty) => {
    if (qty <= 0)  return "Out of Stock";
    if (qty <= 20) return "Low";
    return "Good";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Good":         return "text-green-600 bg-green-50 border-green-100";
      case "Low":          return "text-amber-600 bg-amber-50 border-amber-100";
      case "Out of Stock": return "text-red-600   bg-red-50   border-red-100";
      default:             return "text-gray-500  bg-gray-50  border-gray-100";
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
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg font-sans">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-50/75 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product ID</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Batches</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Stock</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nearest Expiry</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 text-gray-600">
          {items.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                No inventory items found.
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
                  className={`transition hover:bg-gray-50 cursor-pointer ${isSelected ? "bg-blue-50/40 hover:bg-blue-50/60" : ""}`}
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{item.product_name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{item.category_name}</div>
                  </td>

                  <td className="px-6 py-4 text-sm font-mono">{code}</td>

                  <td className="px-6 py-4 text-sm font-bold text-gray-700">
                    {activeBatchCount(item.batches)}
                    <span className="ml-1 text-xs font-normal text-gray-400">batches</span>
                  </td>

                  <td className="px-6 py-4 text-sm font-bold text-gray-800">
                    {totalQty}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <span className={soonExpiry ? "text-amber-600 font-semibold" : "text-gray-500"}>
                      {nearestExpiry(item.batches)}
                    </span>
                    {soonExpiry && (
                      <span className="ml-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                        ⚠ Soon
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
                      {status}
                    </span>
                  </td>

                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => onSelectProduct && onSelectProduct(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-md text-sky-600 bg-white hover:bg-sky-50 active:scale-95 transition-all cursor-pointer"
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
  );
}