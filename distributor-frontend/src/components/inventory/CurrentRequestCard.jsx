import { Send, Trash2, PackagePlus, Loader2 } from "lucide-react";

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
    <div className="w-full p-6 bg-white border border-slate-100 shadow-xs rounded-[32px] font-sans mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-800 leading-tight">
            My Current Supply Request Draft
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Assemble items from the catalog above to submit a supply request to the manufacturer.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
          <PackagePlus size={20} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden border border-slate-100 rounded-2xl bg-white shadow-2xs">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3 text-right">Quantity</th>
              <th className="px-4 py-3 text-right">Base Price</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {request.items.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-slate-400">
                  No items added to current request yet. Enter a quantity and click "Add to Draft" above.
                </td>
              </tr>
            ) : (
              request.items.map((item) => {
                const amount = item.quantity * parseFloat(item.base_price || 0);
                return (
                  <tr key={item.product_id} className="hover:bg-slate-50/50 transition duration-150">
                    <td className="px-4 py-3 font-bold text-slate-800">
                      {item.product_name}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900">{item.quantity.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-medium text-slate-600">LKR {parseFloat(item.base_price || 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3 font-bold text-right text-slate-900">
                      LKR {amount.toLocaleString("en-LK", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => onRemoveItem && onRemoveItem(item.product_id)}
                        className="p-1.5 text-rose-600 border border-rose-100 bg-rose-50 rounded-full hover:bg-rose-100 transition cursor-pointer shadow-2xs inline-flex items-center justify-center"
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
          <div className="flex flex-col gap-1.5 mt-5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Request Remarks / Instructions</label>
            <textarea
              value={remarks}
              onChange={(e) => onRemarksChange && onRemarksChange(e.target.value)}
              placeholder="Enter any additional instructions or delivery notes..."
              rows={2}
              className="w-full p-3 text-xs border border-slate-200 focus:border-blue-500 rounded-2xl outline-none bg-white text-slate-700 placeholder-slate-400 transition shadow-2xs focus:ring-4 focus:ring-blue-500/10 font-medium"
            />
          </div>

          {/* Summary + Actions */}
          <div className="flex flex-col gap-4 mt-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid grid-cols-2 gap-4 lg:w-1/2">
              <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/70">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Requested Units</p>
                <h4 className="text-lg font-bold text-slate-900 mt-1">
                  {totalItems.toLocaleString()}
                </h4>
              </div>

              <div className="p-4 border border-blue-100 rounded-2xl bg-blue-50/50">
                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Estimated Cost</p>
                <h4 className="text-lg font-bold text-blue-600 mt-1">
                  LKR {totalAmount.toLocaleString("en-LK", { minimumFractionDigits: 2 })}
                </h4>
              </div>
            </div>

            <div className="flex gap-3 lg:w-1/2 lg:justify-end">
              <button
                onClick={onClearRequest}
                disabled={submitting}
                className="w-full px-5 py-2.5 text-xs font-bold text-rose-600 border border-rose-200 rounded-full lg:w-40 hover:bg-rose-50 transition cursor-pointer shadow-2xs disabled:opacity-50"
              >
                Clear Request
              </button>

              <button
                onClick={onSubmitRequest}
                disabled={submitting}
                className="flex items-center justify-center w-full gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-full lg:w-44 transition cursor-pointer shadow-2xs disabled:opacity-60"
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}