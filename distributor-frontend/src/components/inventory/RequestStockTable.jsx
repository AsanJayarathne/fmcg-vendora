import { useState } from "react";
import { PackagePlus } from "lucide-react";

export default function RequestStockTable({ products = [], onRequestItem }) {
  const [quantities, setQuantities] = useState({});

  return (
    <div className="overflow-hidden bg-white border border-slate-100 rounded-[32px] shadow-xs">
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Product ID</th>
              <th className="px-6 py-4 text-right">Available to Request</th>
              <th className="px-6 py-4 text-right">Base Price</th>
              <th className="px-6 py-4 text-right">MRP</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center text-slate-400">
                  <p className="text-4xl mb-2">📦</p>
                  <p className="font-bold text-slate-800 text-sm">No products found</p>
                  <p className="text-xs text-slate-400">No catalog products match your search or filter criteria.</p>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const code = `PRD-${String(product.product_id).padStart(3, "0")}`;
                const qtyValue = quantities[product.product_id] || "";
                const availableQty = product.available_to_request !== undefined
                  ? Number(product.available_to_request)
                  : Number(product.warehouse_stock || 0);
                const isOutOfStock = availableQty <= 0;

                return (
                  <tr key={product.product_id} className="hover:bg-slate-50/60 transition duration-150">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{product.product_name}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">{product.category_name}</div>
                    </td>

                    <td className="px-6 py-4 font-bold text-blue-600">{code}</td>

                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-slate-900 text-sm">
                        {availableQty.toLocaleString()}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      LKR {parseFloat(product.base_price || 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}
                    </td>

                    <td className="px-6 py-4 text-right font-semibold text-slate-700">
                      LKR {parseFloat(product.mrp || 0).toLocaleString("en-LK", { minimumFractionDigits: 2 })}
                    </td>

                    <td className="px-6 py-4">
                      {isOutOfStock ? (
                        <div className="flex items-center justify-center">
                          <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/60">
                            Out of Stock
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max={availableQty}
                            placeholder="Qty"
                            value={qtyValue}
                            onChange={(e) =>
                              setQuantities((prev) => ({
                                ...prev,
                                [product.product_id]: e.target.value,
                              }))
                            }
                            className="w-20 border border-slate-200 focus:border-blue-500 rounded-full px-3 py-1.5 text-xs font-bold outline-none bg-white text-slate-700 placeholder-slate-400 transition shadow-2xs text-center"
                          />
                          <button
                            onClick={() => {
                              const parsed = parseInt(qtyValue);
                              const qty = isNaN(parsed) || parsed <= 0 ? 1 : parsed;
                              const finalQty = Math.min(qty, availableQty);
                              if (finalQty <= 0) return;
                              onRequestItem && onRequestItem(product, finalQty);
                              setQuantities((prev) => ({
                                ...prev,
                                [product.product_id]: "",
                              }));
                            }}
                            className="px-4 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 transition whitespace-nowrap cursor-pointer shadow-2xs flex items-center gap-1"
                          >
                            <PackagePlus size={13} />
                            Add to Draft
                          </button>
                        </div>
                      )}
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