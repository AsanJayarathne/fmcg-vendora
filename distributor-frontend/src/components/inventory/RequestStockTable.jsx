import { useState } from "react";
import { PackagePlus, Minus, Plus, Trash2, Check, X } from "lucide-react";

export default function RequestStockTable({
  products = [],
  onRequestItem,
  onUpdateQuantity,
  onRemoveItem,
  draftItems = []
}) {
  const [activeSelectors, setActiveSelectors] = useState({});

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
                const availableQty = product.available_to_request !== undefined
                  ? Number(product.available_to_request)
                  : Number(product.warehouse_stock || 0);
                const isOutOfStock = availableQty <= 0;

                const inDraft = draftItems.find((d) => d.product_id === product.product_id);
                const draftCount = inDraft ? inDraft.quantity : 0;
                const isSelecting = activeSelectors[product.product_id] !== undefined;
                const selectQty = isSelecting ? activeSelectors[product.product_id] : 1;

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
                        <div className="flex items-center justify-center">
                          {draftCount > 0 ? (
                            /* Active item already in draft */
                            <div className="flex items-center border-2 border-blue-500/30 bg-blue-50/70 rounded-full p-0.5 shadow-xs transition-all">
                              <button
                                type="button"
                                onClick={() => {
                                  if (draftCount <= 1) {
                                    onRemoveItem && onRemoveItem(product.product_id);
                                  } else {
                                    onUpdateQuantity && onUpdateQuantity(product.product_id, draftCount - 1);
                                  }
                                }}
                                className={`w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer font-bold ${
                                  draftCount === 1
                                    ? "text-rose-600 hover:bg-rose-100 hover:text-rose-700"
                                    : "text-blue-700 hover:bg-white hover:shadow-2xs"
                                }`}
                                title={draftCount === 1 ? "Remove from draft" : "Decrease quantity"}
                              >
                                {draftCount === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                              </button>

                              <input
                                type="number"
                                min="1"
                                max={availableQty}
                                value={draftCount}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  if (!isNaN(val)) {
                                    if (val <= 0) {
                                      onRemoveItem && onRemoveItem(product.product_id);
                                    } else {
                                      const clamped = Math.min(val, availableQty);
                                      onUpdateQuantity && onUpdateQuantity(product.product_id, clamped);
                                    }
                                  }
                                }}
                                className="w-12 text-center text-xs font-black outline-none bg-transparent text-blue-900"
                              />

                              <button
                                type="button"
                                onClick={() => {
                                  if (draftCount < availableQty) {
                                    onUpdateQuantity && onUpdateQuantity(product.product_id, draftCount + 1);
                                  }
                                }}
                                disabled={draftCount >= availableQty}
                                className="w-7 h-7 rounded-full flex items-center justify-center text-blue-700 hover:bg-white hover:shadow-2xs disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer font-bold"
                                title="Increase quantity"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          ) : isSelecting ? (
                            /* Quantity selector opened BEFORE adding to draft */
                            <div className="flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150">
                              <div className="flex items-center border border-slate-200 bg-white rounded-full p-0.5 shadow-2xs">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const cur = Number(selectQty || 1);
                                    if (cur > 1) {
                                      setActiveSelectors((prev) => ({
                                        ...prev,
                                        [product.product_id]: cur - 1,
                                      }));
                                    }
                                  }}
                                  disabled={Number(selectQty || 1) <= 1}
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer font-bold"
                                  title="Decrease quantity"
                                >
                                  <Minus size={11} />
                                </button>

                                <input
                                  type="number"
                                  min="1"
                                  max={availableQty}
                                  value={selectQty}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "") {
                                      setActiveSelectors((prev) => ({
                                        ...prev,
                                        [product.product_id]: "",
                                      }));
                                      return;
                                    }
                                    const num = parseInt(val, 10);
                                    if (!isNaN(num)) {
                                      const clamped = Math.max(1, Math.min(num, availableQty));
                                      setActiveSelectors((prev) => ({
                                        ...prev,
                                        [product.product_id]: clamped,
                                      }));
                                    }
                                  }}
                                  onBlur={() => {
                                    if (!selectQty || Number(selectQty) < 1) {
                                      setActiveSelectors((prev) => ({
                                        ...prev,
                                        [product.product_id]: 1,
                                      }));
                                    }
                                  }}
                                  className="w-12 text-center text-xs font-black outline-none bg-transparent text-slate-800"
                                  autoFocus
                                />

                                <button
                                  type="button"
                                  onClick={() => {
                                    const cur = Number(selectQty || 1);
                                    if (cur < availableQty) {
                                      setActiveSelectors((prev) => ({
                                        ...prev,
                                        [product.product_id]: cur + 1,
                                      }));
                                    }
                                  }}
                                  disabled={Number(selectQty || 1) >= availableQty}
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer font-bold"
                                  title="Increase quantity"
                                >
                                  <Plus size={11} />
                                </button>
                              </div>

                              {/* Apply button */}
                              <button
                                type="button"
                                onClick={() => {
                                  const qty = Math.max(1, Math.min(Number(selectQty || 1), availableQty));
                                  if (qty <= 0) return;
                                  onRequestItem && onRequestItem(product, qty);
                                  setActiveSelectors((prev) => {
                                    const next = { ...prev };
                                    delete next[product.product_id];
                                    return next;
                                  });
                                }}
                                className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs hover:shadow-xs active:scale-95 transition whitespace-nowrap cursor-pointer flex items-center gap-1"
                                title={`Apply ${selectQty || 1} to draft`}
                              >
                                <Check size={12} className="stroke-[3]" />
                                <span>Apply</span>
                              </button>

                              {/* Cancel button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveSelectors((prev) => {
                                    const next = { ...prev };
                                    delete next[product.product_id];
                                    return next;
                                  });
                                }}
                                className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                                title="Cancel"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          ) : (
                            /* Initial Add to Draft button */
                            <button
                              type="button"
                              onClick={() => {
                                setActiveSelectors((prev) => ({
                                  ...prev,
                                  [product.product_id]: 1,
                                }));
                              }}
                              className="px-4 py-2 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all duration-200 whitespace-nowrap cursor-pointer shadow-2xs flex items-center gap-1.5 active:scale-95 group"
                              title={`Choose quantity for ${product.product_name}`}
                            >
                              <PackagePlus size={13} className="group-hover:scale-110 transition-transform" />
                              <span>Add to Draft</span>
                            </button>
                          )}
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