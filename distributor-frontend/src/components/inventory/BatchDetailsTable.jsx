import { TriangleAlert } from "lucide-react";

export default function BatchDetailsTable({ title, batches = [], selectedProduct }) {
  if (!selectedProduct) {
    return (
      <div className="p-8 bg-slate-50 border border-gray-200 border-dashed rounded-lg text-center text-gray-400 font-sans">
        <TriangleAlert className="mx-auto mb-2 text-gray-300" size={24} />
        <p className="text-sm font-semibold">No Product Selected</p>
        <p className="text-xs mt-1">Select a product from the table above to view batch and unit cost details.</p>
      </div>
    );
  }

  const totalQty = batches.reduce((sum, batch) => sum + batch.qty, 0);

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg font-sans">
      <h3 className="mb-3 text-sm font-bold text-gray-900">{title}</h3>

      <div className="overflow-hidden border border-gray-200 rounded-md">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="border-b border-gray-200 bg-gray-50/75">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Batch No.</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Updated</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiry Date</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit Cost</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>

          <tbody className="text-gray-700 divide-y divide-gray-100">
            {batches.map((batch, index) => (
              <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 font-mono font-semibold text-gray-900">{batch.batchNo}</td>
                <td className="px-4 py-3 text-gray-700">{batch.purchaseDate}</td>
                <td className="px-4 py-3 text-gray-400">{batch.expiryDate}</td>
                <td className="px-4 py-3 font-semibold text-gray-800">
                  {selectedProduct.unit_cost != null ? `Rs. ${parseFloat(selectedProduct.unit_cost).toFixed(2)}` : "—"}
                </td>
                <td className="px-4 py-3 font-bold text-gray-900">{batch.qty} {selectedProduct.unit || "units"}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    batch.status === "Good"
                      ? "text-green-600 bg-green-50 border-green-100"
                      : batch.status === "Low"
                      ? "text-amber-600 bg-amber-50 border-amber-100"
                      : "text-red-600 bg-red-50 border-red-100"
                  }`}>
                    {batch.status}
                  </span>
                </td>
              </tr>
            ))}

            <tr className="bg-gray-50/30 font-semibold text-gray-900 border-t border-gray-100">
              <td className="px-4 py-3">Total Inventory</td>
              <td className="px-4 py-3"></td>
              <td className="px-4 py-3"></td>
              <td className="px-4 py-3"></td>
              <td className="px-4 py-3 font-bold">{totalQty} {selectedProduct.unit || "units"}</td>
              <td className="px-4 py-3"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}