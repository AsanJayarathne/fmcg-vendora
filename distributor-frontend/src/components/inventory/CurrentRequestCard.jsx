import { Send, Trash2, PackagePlus } from "lucide-react";

export default function CurrentRequestCard({
  request = { items: [] },
  remarks = "",
  onRemarksChange,
  onRemoveItem,
  onClearRequest,
  onSubmitRequest,
  submitting = false,
}) {
  const totalItems = request.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = request.items.reduce((sum, item) => sum + item.quantity * parseFloat(item.base_price || 0), 0);

  return (
    <div className="w-full p-4 bg-white border border-gray-200 shadow-sm rounded-xl font-sans mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            My Current Supply Request
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Assemble items from the catalog above to submit a supply request to the manufacturer.
          </p>
        </div>

        <div className="flex items-center justify-center w-10 h-10 rounded-full text-sky-500 bg-sky-50">
          <PackagePlus size={20} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-700 font-bold">
            <tr>
              <th className="px-6 py-3 text-xs uppercase tracking-wider">Product</th>
              <th className="py-3 text-xs uppercase tracking-wider text-right">Quantity</th>
              <th className="py-3 text-xs uppercase tracking-wider text-right">Base Price</th>
              <th className="py-3 text-xs uppercase tracking-wider text-right">Amount</th>
              <th className="text-center py-3 text-xs uppercase tracking-wider">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-gray-600">
            {request.items.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                  No items added to current request yet. Enter a quantity and click "Request" in the table above.
                </td>
              </tr>
            ) : (
              request.items.map((item) => {
                const amount = item.quantity * parseFloat(item.base_price || 0);
                return (
                  <tr key={item.product_id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3 font-semibold text-gray-900">
                      {item.product_name}
                    </td>
                    <td className="text-right font-mono font-semibold">{item.quantity.toLocaleString()}</td>
                    <td className="text-right">Rs. {parseFloat(item.base_price || 0).toFixed(2)}</td>
                    <td className="font-semibold text-right text-gray-900">
                      Rs. {amount.toFixed(2)}
                    </td>
                    <td className="text-center py-2">
                      <button
                        onClick={() => onRemoveItem && onRemoveItem(item.product_id)}
                        className="p-1.5 text-red-500 border border-red-100 rounded-md hover:bg-red-50 active:scale-95 transition-all cursor-pointer bg-white"
                        title="Remove product"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {request.items.length > 0 && (
        <>
          {/* Remarks */}
          <div className="flex flex-col gap-1.5 mt-4">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Request Remarks / Notes</label>
            <textarea
              value={remarks}
              onChange={(e) => onRemarksChange && onRemarksChange(e.target.value)}
              placeholder="Enter any additional instructions or delivery notes..."
              rows={2}
              className="w-full p-2.5 text-xs border rounded-lg outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 bg-slate-50 text-gray-800 placeholder-gray-400"
            />
          </div>

          {/* Summary + Actions */}
          <div className="flex flex-col gap-4 mt-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid grid-cols-2 gap-4 lg:w-1/2">
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                <p className="text-xs text-gray-500 font-medium">Total Items</p>
                <h4 className="text-lg font-bold text-gray-900 mt-1">
                  {totalItems.toLocaleString()}
                </h4>
              </div>

              <div className="p-4 border border-blue-100 rounded-lg bg-blue-50/50">
                <p className="text-xs text-gray-500 font-medium">Estimated Cost</p>
                <h4 className="text-lg font-bold text-blue-600 mt-1">
                  Rs. {totalAmount.toFixed(2)}
                </h4>
              </div>
            </div>

            <div className="flex gap-3 lg:w-1/2 lg:justify-end">
              <button
                onClick={onClearRequest}
                disabled={submitting}
                className="w-full px-5 py-2.5 text-xs font-bold text-red-500 border border-red-200 rounded-lg lg:w-40 hover:bg-red-50 transition active:scale-95 disabled:opacity-50 cursor-pointer bg-white"
              >
                Clear Request
              </button>

              <button
                onClick={onSubmitRequest}
                disabled={submitting}
                className="flex items-center justify-center w-full gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 rounded-lg lg:w-40 hover:bg-blue-700 transition active:scale-95 disabled:opacity-60 cursor-pointer"
              >
                <Send size={14} />
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}