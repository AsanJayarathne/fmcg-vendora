import { TriangleAlert } from "lucide-react";

const STATUS_STYLES = {
  Active:    "text-green-700 bg-green-50 border-green-200",
  Exhausted: "text-gray-500  bg-gray-50  border-gray-200",
  Expired:   "text-red-600   bg-red-50   border-red-200",
};

export default function BatchDetailsTable({ title, batches = [], selectedProduct }) {
  if (!selectedProduct) {
    return (
      <div className="p-8 bg-slate-50 border border-gray-200 border-dashed rounded-lg text-center text-gray-400 font-sans">
        <TriangleAlert className="mx-auto mb-2 text-gray-300" size={24} />
        <p className="text-sm font-semibold">No Product Selected</p>
        <p className="text-xs mt-1">Select a product from the table above to view batch details.</p>
      </div>
    );
  }

  const activeBatches = batches.filter((b) => b.status === "Active");
  const totalQty = activeBatches.reduce((sum, b) => sum + Number(b.quantity ?? 0), 0);

  const fmt = (date) =>
    date ? new Date(date.replace(/-/g, "/")).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const days = (new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
    return days >= 0 && days <= 30;
  };

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg font-sans">
      <h3 className="mb-3 text-sm font-bold text-gray-900">{title}</h3>

      <div className="overflow-hidden border border-gray-200 rounded-md">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="border-b border-gray-200 bg-gray-50/75">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Batch No.</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Received</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mfg. Date</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiry Date</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cost Price</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Selling Price</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>

          <tbody className="text-gray-700 divide-y divide-gray-100">
            {batches.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-4 py-6 text-center text-sm text-gray-400">No batch records found for this product.</td>
              </tr>
            ) : (
              batches.map((batch) => (
                <tr key={batch.dist_batch_id ?? batch.batch_id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-gray-900">{batch.batch_number}</td>
                  <td className="px-4 py-3 text-gray-700">{fmt(batch.received_at)}</td>
                  <td className="px-4 py-3 text-gray-500">{fmt(batch.mfg_date)}</td>
                  <td className={`px-4 py-3 ${isExpiringSoon(batch.expiry_date) ? "text-amber-600 font-semibold" : "text-gray-500"}`}>
                    {fmt(batch.expiry_date)}
                    {isExpiringSoon(batch.expiry_date) && (
                      <span className="ml-1.5 text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                        Expiring Soon
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {batch.cost_price != null ? `Rs. ${parseFloat(batch.cost_price).toFixed(2)}` : "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {batch.selling_price != null ? `Rs. ${parseFloat(batch.selling_price).toFixed(2)}` : "—"}
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900">
                    {batch.quantity} <span className="font-normal text-xs text-gray-400">{selectedProduct.unit || "units"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_STYLES[batch.status] ?? STATUS_STYLES.Exhausted}`}>
                      {batch.status}
                    </span>
                  </td>
                </tr>
              ))
            )}

            {batches.length > 0 && (
              <tr className="bg-gray-50/30 font-semibold text-gray-900 border-t border-gray-100">
                <td className="px-4 py-3" colSpan="6">Total Active Stock</td>
                <td className="px-4 py-3 font-bold">
                  {totalQty} <span className="font-normal text-xs text-gray-400">{selectedProduct.unit || "units"}</span>
                </td>
                <td className="px-4 py-3"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}